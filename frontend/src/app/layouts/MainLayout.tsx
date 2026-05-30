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
            <main className="flex-grow">
                <Outlet />
            </main>
            {!isAdmin && <Footer />}
            {!isAdmin && <AppDownloadPopup />}
        </div>
    );
}
