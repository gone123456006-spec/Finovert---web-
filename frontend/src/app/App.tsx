import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { PageLoader } from "./components/LoadingStates";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollRestoration } from "./components/ScrollRestoration";
import { HomePage } from "./pages/HomePage";

// Lazy load non-critical pages for code splitting
// HomePage is NOT lazy loaded to prevent unmounting issues
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
const ServicesIndexPage = lazy(() => import("./pages/ServicesIndexPage").then(m => ({ default: m.ServicesIndexPage })));
const ServicePage = lazy(() => import("./pages/ServicePage").then(m => ({ default: m.ServicePage })));

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollRestoration />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* HomePage is NOT lazy loaded - prevents unmounting issues */}
          <Route index element={<HomePage />} />
          
          {/* Other pages are lazy loaded with Suspense boundary */}
          <Route path="about" element={
            <Suspense fallback={<PageLoader />}>
              <AboutPage />
            </Suspense>
          } />
          <Route path="privacy" element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy />
            </Suspense>
          } />
          <Route path="verify" element={
            <Suspense fallback={<PageLoader />}>
              <VerificationPage />
            </Suspense>
          } />
          <Route path="contributors" element={
            <Suspense fallback={<PageLoader />}>
              <ContributorsPage />
            </Suspense>
          } />
          <Route path="blog" element={
            <Suspense fallback={<PageLoader />}>
              <BlogsPage />
            </Suspense>
          } />
          <Route path="blog/:slug" element={
            <Suspense fallback={<PageLoader />}>
              <BlogPostPage />
            </Suspense>
          } />
          <Route path="admin" element={
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          } />
          <Route path="careers" element={
            <Suspense fallback={<PageLoader />}>
              <CareersPage />
            </Suspense>
          } />
          <Route path="finance-guides" element={
            <Suspense fallback={<PageLoader />}>
              <FinanceGuidesPage />
            </Suspense>
          } />
          <Route path="my-app" element={
            <Suspense fallback={<PageLoader />}>
              <MyAppPage />
            </Suspense>
          } />
          <Route path="confirmation-form" element={
            <Suspense fallback={<PageLoader />}>
              <ConfirmationFormPage />
            </Suspense>
          } />
          <Route path="book-consultation" element={
            <Suspense fallback={<PageLoader />}>
              <BookConsultationPage />
            </Suspense>
          } />
          <Route path="services" element={
            <Suspense fallback={<PageLoader />}>
              <ServicesIndexPage />
            </Suspense>
          } />
          <Route path="services/:slug" element={
            <Suspense fallback={<PageLoader />}>
              <ServicePage />
            </Suspense>
          } />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
