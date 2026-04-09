import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import LandingPage from "../pages/public/LandingPage";
import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import MentorListingPage from "../pages/public/MentorListingPage";
import MentorDetailsPage from "../pages/public/MentorDetailsPage";
import MenteeDashboardPage from "../pages/mentee/MenteeDashboardPage";
import MenteeProfilePage from "../pages/mentee/MenteeProfilePage";
import MenteeRequestsPage from "../pages/mentee/MenteeRequestsPage";
import MenteeSessionsPage from "../pages/mentee/MenteeSessionsPage";
import MenteeGoalsPage from "../pages/mentee/MenteeGoalsPage";
import MenteeMessagesPage from "../pages/mentee/MenteeMessagesPage";
import MenteeNotificationsPage from "../pages/mentee/MenteeNotificationsPage";
import MenteeFavoritesPage from "../pages/mentee/MenteeFavoritesPage";
import MentorDashboardPage from "../pages/mentor/MentorDashboardPage";
import MentorProfilePage from "../pages/mentor/MentorProfilePage";
import MentorRequestsPage from "../pages/mentor/MentorRequestsPage";
import MentorMenteesPage from "../pages/mentor/MentorMenteesPage";
import MentorSessionsPage from "../pages/mentor/MentorSessionsPage";
import MentorAvailabilityPage from "../pages/mentor/MentorAvailabilityPage";
import MentorReviewsPage from "../pages/mentor/MentorReviewsPage";
import MentorMessagesPage from "../pages/mentor/MentorMessagesPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminApprovalsPage from "../pages/admin/AdminApprovalsPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminReportsPage from "../pages/admin/AdminReportsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mentors" element={<MentorListingPage />} />
        <Route path="/mentors/:id" element={<MentorDetailsPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={["mentee", "mentor", "admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route element={<ProtectedRoute roles={["mentee"]} />}>
            <Route path="/mentee" element={<MenteeDashboardPage />} />
            <Route path="/mentee/browse-mentors" element={<MentorListingPage />} />
            <Route path="/mentee/profile" element={<MenteeProfilePage />} />
            <Route path="/mentee/requests" element={<MenteeRequestsPage />} />
            <Route path="/mentee/sessions" element={<MenteeSessionsPage />} />
            <Route path="/mentee/goals" element={<MenteeGoalsPage />} />
            <Route path="/mentee/messages" element={<MenteeMessagesPage />} />
            <Route path="/mentee/notifications" element={<MenteeNotificationsPage />} />
            <Route path="/mentee/favorites" element={<MenteeFavoritesPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={["mentor"]} />}>
            <Route path="/mentor" element={<MentorDashboardPage />} />
            <Route path="/mentor/profile" element={<MentorProfilePage />} />
            <Route path="/mentor/requests" element={<MentorRequestsPage />} />
            <Route path="/mentor/mentees" element={<MentorMenteesPage />} />
            <Route path="/mentor/sessions" element={<MentorSessionsPage />} />
            <Route path="/mentor/availability" element={<MentorAvailabilityPage />} />
            <Route path="/mentor/reviews" element={<MentorReviewsPage />} />
            <Route path="/mentor/messages" element={<MentorMessagesPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/approvals" element={<AdminApprovalsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
