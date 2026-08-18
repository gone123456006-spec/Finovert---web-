import { useCallback, useEffect, useRef, useState } from "react";

const BLUE = "#1a73e8";
const MUTED = "#5f6368";
const LINE = "#dadce0";
const TEXT = "#202124";
const GREEN = "#188038";
const ERROR = "#d93025";

const OVAL_RX = 0.26;
const OVAL_RY = 0.36;
const STABLE_MS = 900;
const FALLBACK_CAPTURE_MS = 3500;

type Status = "idle" | "starting" | "live" | "captured" | "denied" | "unavailable";

type DetectedFace = { boundingBox: DOMRectReadOnly };

type FaceDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<DetectedFace[]>;
};

type LegacyNavigator = Navigator & {
  getUserMedia?: (
    constraints: MediaStreamConstraints,
    success: (stream: MediaStream) => void,
    error: (error: unknown) => void,
  ) => void;
  webkitGetUserMedia?: LegacyNavigator["getUserMedia"];
  mozGetUserMedia?: LegacyNavigator["getUserMedia"];
};

function isFaceInOval(face: DetectedFace, videoWidth: number, videoHeight: number) {
  const box = face.boundingBox;
  const cx = (box.x + box.width / 2) / videoWidth;
  const cy = (box.y + box.height / 2) / videoHeight;
  const faceW = box.width / videoWidth;
  const faceH = box.height / videoHeight;

  const dx = (cx - 0.5) / OVAL_RX;
  const dy = (cy - 0.5) / OVAL_RY;
  const insideOval = dx * dx + dy * dy <= 1;
  const sizeOk = faceW >= 0.12 && faceW <= 0.85 && faceH >= 0.12 && faceH <= 0.9;

  return insideOval && sizeOk;
}

function requestUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
  if (navigator.mediaDevices?.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  const legacyNav = navigator as LegacyNavigator;
  const legacy =
    legacyNav.getUserMedia ?? legacyNav.webkitGetUserMedia ?? legacyNav.mozGetUserMedia;

  if (!legacy) {
    return Promise.reject(new Error("Camera API not supported"));
  }

  return new Promise((resolve, reject) => {
    legacy.call(navigator, constraints, resolve, reject);
  });
}

async function openCameraStream(): Promise<MediaStream> {
  const attempts: MediaStreamConstraints[] = [
    {
      audio: false,
      video: {
        facingMode: { ideal: "user" },
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
      },
    },
    { audio: false, video: { facingMode: { ideal: "user" } } },
    { audio: false, video: { facingMode: "user" } },
    { audio: false, video: true },
  ];

  let lastError: unknown;
  for (const constraints of attempts) {
    try {
      return await requestUserMedia(constraints);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Unable to open camera");
}

async function attachStreamToVideo(video: HTMLVideoElement, stream: MediaStream) {
  video.srcObject = stream;
  video.setAttribute("playsinline", "true");
  video.setAttribute("webkit-playsinline", "true");

  await new Promise<void>((resolve) => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve();
      return;
    }
    video.onloadedmetadata = () => resolve();
  });

  try {
    await video.play();
  } catch {
    // iOS may require another user gesture; stream is still attached.
  }
}

export function FaceVerificationCamera({
  required = false,
  error,
  onCapture,
  onClear,
}: {
  required?: boolean;
  error?: string;
  onCapture?: (photo: string) => void;
  onClear?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stableSinceRef = useRef<number | null>(null);
  const capturingRef = useRef(false);
  const statusRef = useRef<Status>("idle");
  const fallbackTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [photo, setPhoto] = useState("");
  const [faceOk, setFaceOk] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  statusRef.current = status;

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(null);
  }, []);

  const stopCamera = useCallback(() => {
    clearFallbackTimer();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [clearFallbackTimer]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0 || capturingRef.current) return;

    capturingRef.current = true;
    clearFallbackTimer();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      capturingRef.current = false;
      return;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPhoto(dataUrl);
    onCapture?.(dataUrl);
    stopCamera();
    setFaceOk(true);
    setStatus("captured");
    stableSinceRef.current = null;
  }, [clearFallbackTimer, stopCamera, onCapture]);

  const startFallbackCountdown = useCallback(
    (cancelledRef: { current: boolean }) => {
      clearFallbackTimer();
      setFaceOk(true);
      let remaining = 3;
      setCountdown(remaining);

      countdownIntervalRef.current = window.setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          if (countdownIntervalRef.current !== null) {
            window.clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          setCountdown(null);
          if (!cancelledRef.current && statusRef.current === "live") capture();
          return;
        }
        setCountdown(remaining);
      }, 1000);
    },
    [clearFallbackTimer, capture],
  );

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (status !== "live") {
      stableSinceRef.current = null;
      capturingRef.current = false;
      clearFallbackTimer();
      return;
    }

    const cancelledRef = { current: false };
    const FaceDetectorCtor = (
      window as Window & { FaceDetector?: new (opts?: { fastMode?: boolean }) => FaceDetectorLike }
    ).FaceDetector;

    if (FaceDetectorCtor) {
      const detector = new FaceDetectorCtor({ fastMode: true });

      const tick = async () => {
        if (cancelledRef.current || statusRef.current !== "live") return;

        const video = videoRef.current;
        if (!video || video.videoWidth === 0) {
          if (!cancelledRef.current) window.setTimeout(() => void tick(), 120);
          return;
        }

        try {
          const faces = await detector.detect(video);
          if (cancelledRef.current || statusRef.current !== "live") return;

          const aligned =
            faces.length === 1 && isFaceInOval(faces[0], video.videoWidth, video.videoHeight);
          setFaceOk(aligned);

          if (aligned) {
            if (stableSinceRef.current === null) {
              stableSinceRef.current = Date.now();
            } else if (Date.now() - stableSinceRef.current >= STABLE_MS) {
              capture();
              return;
            }
          } else {
            stableSinceRef.current = null;
          }
        } catch {
          if (!cancelledRef.current) {
            setFaceOk(false);
            stableSinceRef.current = null;
          }
        }

        if (!cancelledRef.current && statusRef.current === "live") {
          window.setTimeout(() => void tick(), 120);
        }
      };

      void tick();
      return () => {
        cancelledRef.current = true;
      };
    }

    fallbackTimerRef.current = window.setTimeout(() => {
      if (cancelledRef.current || statusRef.current !== "live" || capturingRef.current) return;
      startFallbackCountdown(cancelledRef);
    }, FALLBACK_CAPTURE_MS);

    return () => {
      cancelledRef.current = true;
      clearFallbackTimer();
    };
  }, [status, capture, clearFallbackTimer, startFallbackCountdown]);

  const startCamera = async () => {
    if (!window.isSecureContext) {
      setStatus("unavailable");
      return;
    }

    capturingRef.current = false;
    stableSinceRef.current = null;
    setStatus("starting");
    setFaceOk(false);
    setCountdown(null);

    try {
      const stream = await openCameraStream();
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        await attachStreamToVideo(video, stream);
      }
      setPhoto("");
      onClear?.();
      setStatus("live");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setStatus("denied");
      } else {
        setStatus("unavailable");
      }
    }
  };

  const turnCameraOff = () => {
    stopCamera();
    capturingRef.current = false;
    stableSinceRef.current = null;
    setFaceOk(false);
    setCountdown(null);
    setStatus("idle");
  };

  const retake = () => {
    capturingRef.current = false;
    stableSinceRef.current = null;
    setPhoto("");
    onClear?.();
    setFaceOk(false);
    setCountdown(null);
    void startCamera();
  };

  const borderColor =
    error && status !== "captured"
      ? ERROR
      : faceOk || status === "captured"
        ? GREEN
        : LINE;

  const helperText =
    status === "captured"
      ? "Face verified and captured automatically."
      : status === "live" && countdown !== null
        ? `Hold still — capturing in ${countdown}…`
        : status === "live" && faceOk
          ? "Face aligned — capturing…"
          : status === "live"
            ? "Center your face in the oval. Capture is automatic."
            : !window.isSecureContext
              ? "Camera needs HTTPS. Open https://www.finovert.com."
              : "Used only to confirm intern identity.";

  return (
    <div className="pt-2">
      <div
        className="relative rounded bg-white transition-colors duration-200"
        style={{
          border: error && status !== "captured" ? `2px solid ${ERROR}` : `1px solid ${borderColor}`,
          boxShadow: faceOk && !error ? `0 0 0 1px ${GREEN}` : undefined,
        }}
      >
        <span
          className="pointer-events-none absolute z-[3] bg-white px-1.5"
          style={{
            left: 12,
            top: -10,
            fontSize: 12,
            lineHeight: "16px",
            color: error && status !== "captured" ? ERROR : faceOk || status === "captured" ? GREEN : MUTED,
          }}
        >
          Face verification
          {required ? <span style={{ color: ERROR }}> *</span> : null}
        </span>

        <div className="relative aspect-[5/6] max-h-[280px] w-full overflow-hidden rounded bg-[#f8f9fa] sm:aspect-[4/3] sm:max-h-none">
          {status === "captured" && photo ? (
            <img src={photo} alt="Captured face for verification" className="h-full w-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`h-full w-full object-cover ${status === "live" || status === "starting" ? "block" : "hidden"}`}
              style={{ transform: "scaleX(-1)" }}
            />
          )}

          {status === "live" ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="h-[58%] w-[62%] max-w-[220px] rounded-[50%] border-[3px] transition-colors duration-200 sm:h-[72%] sm:w-[52%] sm:max-w-[240px]"
                style={{
                  borderColor: faceOk ? GREEN : "rgba(255,255,255,0.95)",
                  boxShadow: faceOk
                    ? "0 0 0 999px rgba(24,128,56,0.18), 0 0 18px rgba(24,128,56,0.45)"
                    : "0 0 0 999px rgba(0,0,0,0.28)",
                }}
              />
              {faceOk ? (
                <div
                  className="absolute bottom-3 mx-3 rounded-full px-3 py-1 text-center text-[11px] font-medium text-white sm:bottom-4 sm:text-xs"
                  style={{ background: GREEN }}
                >
                  {countdown !== null ? `Capturing in ${countdown}…` : "Face aligned — capturing…"}
                </div>
              ) : null}
            </div>
          ) : null}

          {status === "captured" ? (
            <div
              className="pointer-events-none absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium text-white"
              style={{ background: GREEN }}
            >
              Verified
            </div>
          ) : null}

          {status === "idle" || status === "starting" || status === "denied" || status === "unavailable" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#f8f9fa]/90 px-4 text-center sm:px-6">
              <p className="text-sm font-medium" style={{ color: TEXT }}>
                {status === "starting" ? "Starting camera…" : "Verify your face"}
              </p>
              <p className="max-w-[32ch] text-[13px] sm:max-w-none sm:text-sm" style={{ color: MUTED }}>
                {status === "denied"
                  ? "Camera access was blocked. Allow the camera in your browser settings, then try again."
                  : status === "unavailable"
                    ? !window.isSecureContext
                      ? "Camera works on secure pages only. Use https://www.finovert.com."
                      : "No camera found on this device, or your browser blocked access."
                    : "Keep your face inside the oval. Capture is automatic."}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {error && status !== "captured" ? (
        <p className="mt-1.5 text-[12px]" style={{ color: ERROR }}>
          {error}
        </p>
      ) : null}

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p
          className="text-xs font-medium transition-colors duration-200"
          style={{ color: status === "captured" || faceOk ? GREEN : MUTED }}
        >
          {helperText}
        </p>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {status === "live" || status === "starting" ? (
            <button
              type="button"
              onClick={turnCameraOff}
              className="h-11 w-full rounded px-4 text-sm font-medium sm:h-9 sm:w-auto"
              style={{ color: TEXT, border: `1px solid ${LINE}` }}
            >
              Turn camera off
            </button>
          ) : null}

          {status === "idle" || status === "denied" || status === "unavailable" ? (
            <button
              type="button"
              onClick={() => void startCamera()}
              className="h-11 w-full rounded px-4 text-sm font-medium text-white sm:h-9 sm:w-auto"
              style={{ background: BLUE }}
            >
              Turn camera on
            </button>
          ) : null}

          {status === "captured" ? (
            <button
              type="button"
              onClick={retake}
              className="h-11 w-full rounded px-4 text-sm font-medium sm:h-9 sm:w-auto"
              style={{ color: BLUE, border: `1px solid ${LINE}` }}
            >
              Retake
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
