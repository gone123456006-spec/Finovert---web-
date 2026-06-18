import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export function AppDownloadPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already closed the popup in this session
    const hasClosed = sessionStorage.getItem("app-popup-closed");

    if (!hasClosed) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("app-popup-closed", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[9999] max-w-sm w-[calc(100vw-3rem)]"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X className="w-4 h-4" />
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
                  className="flex items-center justify-center gap-3 bg-black text-white py-3.5 px-6 rounded-2xl hover:bg-gray-800 transition-all group w-full"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    className="h-8"
                  />
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
