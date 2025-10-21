import AuthLayout from "@/components/layout/AuthLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import LoginPage from "@/pages/auth/LoginPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import VerifyotpPage from "@/pages/auth/VerifyOtpPage";
import CoursesPage from "@/pages/course/CoursesPage";
import CreateCoursePage from "@/pages/course/CreateCoursePage";
import UpdateCoursePage from "@/pages/course/UpdateCoursePage";
import CategoryPage from "@/pages/dashboard/CategoryPage";
import ContactPage from "@/pages/dashboard/ContactPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import SubscriberPage from "@/pages/dashboard/SubscriberPage";
import UsersPage from "@/pages/dashboard/UsersPage";
import FaqsPage from "@/pages/help/FaqsPage";
import HelpPage from "@/pages/help/HelpPage";
import OrdersPage from "@/pages/order/OrdersPage";
import AboutPage from "@/pages/settings/AboutPage";
import ChangePasswordPage from "@/pages/settings/ChangePasswordPage";
import PrivacyPage from "@/pages/settings/PrivacyPage";
import ProfilePage from "@/pages/settings/ProfilePage";
import TermsPage from "@/pages/settings/TermsPage";
import CertificateIssuedPage from "@/pages/test/CertificateIssuedPage";
import CertificateTemplatePage from "@/pages/test/CertificateTemplatePage";
import CreateTestPage from "@/pages/test/CreateTestPage";
import TestBuilderPage from "@/pages/test/TestBuilderPage";
import TestResultsPage from "@/pages/test/TestResultsPage";
import UpdateTestPage from "@/pages/test/UpdateTestPage";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
       <PrivateRoute>
         <DashboardLayout />
       </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "add-course",
        element: <CreateCoursePage />,
      },
      {
        path: "update-course/:id",
        element: <UpdateCoursePage />,
      },
      {
        path: "categories",
        element: <CategoryPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "about-us",
        element: <AboutPage />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPage />,
      },
      {
        path: "terms-condition",
        element: <TermsPage />,
      },
      {
        path: "help",
        element: <HelpPage />,
      },
      {
        path: "faqs",
        element: <FaqsPage />,
      },
      {
        path: "test-builder",
        element: <TestBuilderPage />,
      },
      {
        path: "test-results",
        element: <TestResultsPage />,
      },
      {
        path: "add-test",
        element: <CreateTestPage />,
      },
      {
        path: "update-test/:id",
        element: <UpdateTestPage />,
      },
      {
        path: "certificate-template",
        element: <CertificateTemplatePage />,
      },
      {
        path: "certificate-issued",
        element: <CertificateIssuedPage />,
      },
      {
        path: "contacts",
        element: <ContactPage />,
      },
      {
        path: "subscribers",
        element: <SubscriberPage />,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
       <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/auth/signin" replace />,
      },
      {
        path: "signin",
        element: <LoginPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "verify-otp",
        element: <VerifyotpPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: "*",
    element: <h1>This is Not Found Page</h1>
    // element: <NotFoundRoute/>,
  },
]);

export default router;
