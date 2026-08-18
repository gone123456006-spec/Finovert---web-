import { useEffect, useRef, useState } from "react";

const BLUE = "#1a73e8";
const MUTED = "#5f6368";
const LINE = "#dadce0";
const INK = "#202124";
const ERROR = "#d93025";

type Point = { x: number; y: number };

export function SignaturePad({
  label = "Digital Signature / Name Confirmation",
  required = false,
  error,
  onChange,
  onSignature,
}: {
  label?: string;
  required?: boolean;
  error?: string;
  onChange?: (hasSignature: boolean) => void;
  onSignature?: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<Point | null>(null);
  const hasInkRef = useRef(false);
  const [focused, setFocused] = useState(false);
  const [hasInk, setHasInk] = useState(false);

  const paintSettings = (ctx: CanvasRenderingContext2D, ratio: number) => {
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight;
      const snapshot = hasInkRef.current ? canvas.toDataURL() : "";

      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      paintSettings(ctx, ratio);

      if (snapshot) {
        const image = new Image();
        image.onload = () => ctx.drawImage(image, 0, 0, width, height);
        image.src = snapshot;
      }
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDraw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.setPointerCapture(event.pointerId);
    drawing.current = true;
    setFocused(true);
    const point = pointFromEvent(event);
    last.current = point;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = INK;
    ctx.fill();
    hasInkRef.current = true;
    setHasInk(true);
    onChange?.(true);
  };

  const moveDraw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    event.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const point = pointFromEvent(event);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    last.current = point;
  };

  const emitSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasInkRef.current) {
      onSignature?.("");
      return;
    }
    onSignature?.(canvas.toDataURL("image/png"));
  };

  const endDraw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    event.preventDefault();
    drawing.current = false;
    last.current = null;
    setFocused(false);
    emitSignature();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasInkRef.current = false;
    setHasInk(false);
    onChange?.(false);
    onSignature?.("");
  };

  const borderColor = error ? ERROR : focused ? BLUE : LINE;

  return (
    <div>
      <div
        className="relative rounded bg-white"
        style={{
          border: error || focused ? `2px solid ${borderColor}` : `1px solid ${LINE}`,
        }}
      >
        <span
          className="pointer-events-none absolute z-[1] max-w-[calc(100%-1.5rem)] truncate bg-white px-1"
          style={{
            left: 12,
            top: -8,
            fontSize: 12,
            lineHeight: "16px",
            color: error ? ERROR : focused ? BLUE : MUTED,
          }}
        >
          {label}
          {required ? <span style={{ color: ERROR }}> *</span> : null}
        </span>

        <div
          ref={wrapperRef}
          className="relative h-52 w-full sm:h-52 md:h-56"
        >
          {!hasInk ? (
            <p
              className="pointer-events-none absolute inset-x-4 inset-y-0 z-[2] flex items-center justify-center text-center text-sm"
              style={{ color: MUTED }}
            >
              Draw your signature here
            </p>
          ) : null}

          <div
            className="pointer-events-none absolute right-5 bottom-7 left-5 border-b border-dashed"
            style={{ borderColor: LINE }}
          />

          <canvas
            ref={canvasRef}
            className="relative z-[1] h-full w-full cursor-crosshair touch-none"
            style={{ touchAction: "none" }}
            onPointerDown={startDraw}
            onPointerMove={moveDraw}
            onPointerUp={endDraw}
            onPointerCancel={endDraw}
            onPointerLeave={() => {
              last.current = drawing.current ? last.current : null;
            }}
          />
        </div>
      </div>

      {error ? (
        <p className="mt-1.5 text-[12px]" style={{ color: ERROR }}>
          {error}
        </p>
      ) : null}

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="min-w-0 text-xs" style={{ color: MUTED }}>
          Use your mouse or finger to sign.
        </p>
        <button
          type="button"
          onClick={clear}
          disabled={!hasInk}
          className="shrink-0 py-1 text-sm font-medium disabled:opacity-40"
          style={{ color: BLUE }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
