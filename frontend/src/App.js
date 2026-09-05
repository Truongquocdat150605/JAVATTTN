import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CircularProgress, Box } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatWidget from "./features/chat/ChatWidget";

// AUTH
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

// ADMIN PAGES
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const ReportMain = React.lazy(() => import("./pages/admin/reports/ReportMain"));
const RoomList = React.lazy(() => import("./pages/admin/rooms/RoomList"));
const RoomAdd = React.lazy(() => import("./pages/admin/rooms/RoomAdd"));
const RoomEdit = React.lazy(() => import("./pages/admin/rooms/RoomEdit"));
const ContractList = React.lazy(() => import("./pages/admin/contracts/ContractList"));
const ContractAdd = React.lazy(() => import("./pages/admin/contracts/ContractAdd"));
const ContractEdit = React.lazy(() => import("./pages/admin/contracts/ContractEdit"));
const InvoiceList = React.lazy(() => import("./pages/admin/invoices/InvoiceList"));
const InvoiceEdit = React.lazy(() => import("./pages/admin/invoices/InvoiceEdit"));
const ExpenseList = React.lazy(() => import("./pages/admin/expenses/ExpenseList"));
const ExpenseAdd = React.lazy(() => import("./pages/admin/expenses/ExpenseAdd"));
const ExpenseEdit = React.lazy(() => import("./pages/admin/expenses/ExpenseEdit"));
const UserList = React.lazy(() => import("./pages/admin/users/UserList"));
const UserAdd = React.lazy(() => import("./pages/admin/users/UserAdd"));
const UserEdit = React.lazy(() => import("./pages/admin/users/UserEdit"));
const MaintenanceList = React.lazy(() => import("./pages/admin/maintenance/MaintenanceList"));
const RequestManagement = React.lazy(() => import("./pages/admin/RequestManagement"));
const NotificationMain = React.lazy(() => import("./pages/admin/notifications/NotificationMain"));
const ServiceList = React.lazy(() => import("./pages/admin/services/ServiceList"));
const ServiceAdd = React.lazy(() => import("./pages/admin/services/ServiceAdd"));
const ServiceEdit = React.lazy(() => import("./pages/admin/services/ServiceEdit"));
const AccountProfile = React.lazy(() => import("./pages/account/AccountProfile"));

// PUBLIC PAGES
const RoomsPage = React.lazy(() => import("./pages/public/RoomsPage"));
const RoomDetail = React.lazy(() => import("./pages/public/RoomDetail"));
const ContactPage = React.lazy(() => import("./pages/public/ContactPage"));
const HomePage = React.lazy(() => import("./pages/public/HomePage"));
const UnauthorizedPage = React.lazy(() => import("./pages/public/UnauthorizedPage"));
const BookingFormPage = React.lazy(() => import("./pages/public/BookingFormPage"));

// TENANT PAGES
const TenantProfile = React.lazy(() => import("./pages/tenant/TenantProfile"));
const MyContracts = React.lazy(() => import("./pages/tenant/MyContracts"));
const MyInvoices = React.lazy(() => import("./pages/tenant/MyInvoices"));
const TenantMaintenance = React.lazy(() => import("./pages/tenant/TenantMaintenance"));
const ChangePassword = React.lazy(() => import("./pages/tenant/ChangePassword"));
const MyPayments = React.lazy(() => import("./pages/tenant/MyPayments"));
const MyNotifications = React.lazy(() => import("./pages/tenant/MyNotifications"));
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <ChatWidget />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route element={<MainLayout />}>
            {/* TENANT / PUBLIC */}
            <Route index element={<HomePage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="rooms/:id" element={<RoomDetail />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
            <Route path="booking-form" element={<BookingFormPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="tenant/profile" element={<ProtectedRoute requiredRole="TENANT"><TenantProfile /></ProtectedRoute>} />
              <Route path="my-contracts" element={<ProtectedRoute requiredRole="TENANT"><MyContracts /></ProtectedRoute>} />
              <Route path="my-invoices" element={<ProtectedRoute requiredRole="TENANT"><MyInvoices /></ProtectedRoute>} />
              <Route path="my-maintenance" element={<ProtectedRoute requiredRole="TENANT"><TenantMaintenance /></ProtectedRoute>} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="my-payments" element={<ProtectedRoute requiredRole="TENANT"><MyPayments /></ProtectedRoute>} />
              <Route path="my-notifications" element={<ProtectedRoute requiredRole="TENANT"><MyNotifications /></ProtectedRoute>} />
            </Route>
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="profile" element={<AccountProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="my-notifications" element={<MyNotifications />} />
              <Route path="reports" element={<ReportMain />} />
              <Route path="rooms" element={<RoomList />} />
              <Route path="rooms/add" element={<RoomAdd />} />
              <Route path="rooms/edit/:id" element={<RoomEdit />} />
              <Route path="contracts" element={<ContractList />} />
              <Route path="contracts/add" element={<ContractAdd />} />
              <Route path="contracts/edit/:id" element={<ContractEdit />} />
              <Route path="invoices" element={<InvoiceList />} />
              <Route path="invoices/edit/:id" element={<InvoiceEdit />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/add" element={<UserAdd />} />
              <Route path="users/edit/:id" element={<UserEdit />} />
              <Route path="expenses" element={<ExpenseList />} />
              <Route path="expenses/add" element={<ExpenseAdd />} />
              <Route path="expenses/edit/:id" element={<ExpenseEdit />} />
              <Route path="maintenance" element={<MaintenanceList />} />
              <Route path="requests" element={<RequestManagement />} />
              <Route path="notifications" element={<NotificationMain />} />
              <Route path="services" element={<ServiceList />} />
              <Route path="services/add" element={<ServiceAdd />} />
              <Route path="services/edit/:id" element={<ServiceEdit />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
