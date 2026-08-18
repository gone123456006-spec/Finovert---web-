import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AppDownloadPopup } from "../components/AppDownloadPopup";
import { AnimatePresence, motion } from "motion/react";

export function MainLayout() {
    const { pathname } = useLocation();
    const isAdmin = pathname.toLowerCase().startsWith("/tawangjob");

    return (
        <div className="min-h-screen flex flex-col">
            {!isAdmin && <Navbar />}
            {/* 
              Padding-top accounts for the fixed navbar height:
              - h-14 (3.5rem = 56px) on mobile
              - sm:h-16 (4rem = 64px) on sm+
              This prevents content from hiding under the fixed nav on mobile.
            */}
            <main
                className="flex-grow flex flex-col"
                style={{ paddingTop: isAdmin ? 0 : 'var(--navbar-height, 56px)' }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(4px)" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-1 w-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            {!isAdmin && <Footer />}
            {!isAdmin && <AppDownloadPopup />}
        </div>
    );
}
