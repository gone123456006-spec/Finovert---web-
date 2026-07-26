import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { PageLoader } from "./components/LoadingStates";

// Lazy load pages for code splitting and faster initial load
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const VerificationPage = lazy(() => import("./pages/VerificationPage").then(m => ({ default: m.VerificationPage })));
const ContributorsPage = lazy(() => import("./pages/ContributorsPage").then(m => ({ default: m.ContributorsPage })));
const BlogsPage = lazy(() => import("./pages/BlogsPage").then(m => ({ default: m.BlogsPage })));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage").then(m => ({ default: m.BlogPostPage })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const CareersPage = lazy(() => import("./pages/CareersPage").then(m => ({ default: m.CareersPage })));
const FinanceGuidesPage = lazy(() => import("./pages/FinanceGuidesPage").then(m => ({ default: m.FinanceGuidesPage })));
const MyAppPage = lazy(() => import("./pages/MyAppPage").then(m => ({ default: m.MyAppPage })));
const ConfirmationFormPage = lazy(() => import("./pages/ConfirmationFormPage").then(m => ({ default: m.ConfirmationFormPage })));
const BookConsultationPage = lazy(() => import("./pages/BookConsultationPage").then(m => ({ default: m.BookConsultationPage })));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="verify" element={<VerificationPage />} />
          <Route path="contributors" element={<ContributorsPage />} />
          <Route path="blog" element={<BlogsPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="finance-guides" element={<FinanceGuidesPage />} />
          <Route path="my-app" element={<MyAppPage />} />
          <Route path="confirmation-form" element={<ConfirmationFormPage />} />
          <Route path="book-consultation" element={<BookConsultationPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
