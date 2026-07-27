import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AppDownloadPopup } from "../components/AppDownloadPopup";

export function MainLayout() {
    const { pathname } = useLocation();
    const isAdmin = pathname.startsWith("/admin");

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
                className="flex-grow"
                style={{ paddingTop: isAdmin ? 0 : 'var(--navbar-height, 56px)' }}
            >
                <Outlet />
            </main>
            {!isAdmin && <Footer />}
            {!isAdmin && <AppDownloadPopup />}
        </div>
    );
}
