import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AppDownloadPopup } from "../components/AppDownloadPopup";
import { AnimatePresence, motion } from "motion/react";

export function MainLayout() {
    const { pathname } = useLocation();
    const isAdmin = pathname.toLowerCase().startsWith("/tawangjob");
    const isTermsPage = pathname === "/internship-terms";

    return (
        <div className={isTermsPage ? "flex h-dvh flex-col overflow-hidden" : "min-h-screen flex flex-col"}>
            {!isAdmin && <Navbar />}
            <main
                className={isTermsPage ? "flex min-h-0 flex-1 flex-col overflow-hidden" : "flex-grow flex flex-col"}
                style={{ paddingTop: isAdmin ? 0 : "var(--navbar-height, 56px)" }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className={isTermsPage ? "flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden" : "flex-1 w-full"}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            {!isAdmin && !isTermsPage && <Footer />}
            {!isAdmin && !isTermsPage && <AppDownloadPopup />}
        </div>
    );
}
