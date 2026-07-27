import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function AppDownloadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already closed the popup in this session
    const hasClosed = sessionStorage.getItem("app-popup-closed");

    if (!hasClosed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000); // Delay popup until after main UI is fully rendered
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem("app-popup-closed", "true");
    }, 150); // Faster close animation
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] max-w-sm w-[calc(100vw-3rem)] transition-all duration-150 ease-out ${isClosing
          ? 'opacity-0 translate-y-24 scale-90'
          : 'opacity-100 translate-y-0 scale-100 animate-fade-in'
        }`}
      style={{
        willChange: 'transform, opacity'
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
        {/* Close Button - Bigger and Faster */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-all duration-150 z-10 shadow-sm hover:shadow-md"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 shrink-0 shadow-xl rounded-2xl overflow-hidden border-2 border-white bg-white">
                <img src="/app-logo.png" alt="Finovert App" className="w-full h-full object-cover" />
              </div>
              {/* Real Play Store Badge */}
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-lg shadow-lg flex items-center justify-center p-1 border border-blue-50">
                <img src="/play-logo.png" alt="Play Store" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                Get the Finovert App
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Manage your finances on the go with our mobile app.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.brandovert.finovert&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-black text-white py-3 px-6 rounded-2xl hover:bg-gray-800 transition-colors w-full"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                <path d="M3.18 23.76c.3.17.63.24.97.21l13.2-11.97L13.47 8.1 3.18 23.76zM.5 1.05C.19 1.4 0 1.93 0 2.62v18.77c0 .69.19 1.22.5 1.57l.08.08L10.65 12.5v-.25L.58.97.5 1.05zm20.55 8.87-2.89-1.66-3.3 3 3.3 3 2.91-1.67c.83-.48.83-1.25-.02-1.67zM4.15.24l13.2 11.97-3.88 3.9L4.15.23z" />
              </svg>
              <span className="flex flex-col items-start">
                <span className="text-[10px] leading-none opacity-80">GET IT ON</span>
                <span className="text-sm font-semibold leading-tight">Google Play</span>
              </span>
            </a>

            <button
              onClick={handleClose}
              className="w-full text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              Maybe later
            </button>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-50 rounded-full opacity-50 pointer-events-none" />
      </div>
    </div>
  );
}
