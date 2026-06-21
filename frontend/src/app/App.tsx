import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { VerificationPage } from "./pages/VerificationPage";
import { ContributorsPage } from "./pages/ContributorsPage";
import { BlogsPage } from "./pages/BlogsPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CareersPage } from "./pages/CareersPage";
import { FinanceGuidesPage } from "./pages/FinanceGuidesPage";
import { MyAppPage } from "./pages/MyAppPage";
import { ConfirmationFormPage } from "./pages/ConfirmationFormPage";
import { BookConsultationPage } from "./pages/BookConsultationPage";

import { AboutPage } from "./pages/AboutPage";

export default function App() {
  return (
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
  );
}
