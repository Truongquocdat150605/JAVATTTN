import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CircularProgress, Box } from "@mui/material";
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
const ReportManagement = React.lazy(() => import("./pages/admin/ReportManagement"));
const RoomList = React.lazy(() => import("./pages/admin/rooms/RoomList"));
const RoomAdd = React.lazy(() => import("./pages/admin/rooms/RoomAdd"));
const RoomEdit = React.lazy(() => import("./pages/admin/rooms/RoomEdit"));
const ContractManagement = React.lazy(() => import("./pages/admin/ContractManagement"));
const InvoiceManagement = React.lazy(() => import("./pages/admin/InvoiceManagement"));
const UserManagement = React.lazy(() => import("./pages/admin/UserManagement"));
const ExpenseManagement = React.lazy(() => import("./pages/admin/ExpenseManagement"));
const MaintenanceManagement = React.lazy(() => import("./pages/admin/MaintenanceManagement"));
const RequestManagement = React.lazy(() => import("./pages/admin/RequestManagement"));
const NotificationManagement = React.lazy(() => import("./pages/admin/NotificationManagement"));
const ServiceList = React.lazy(() => import("./pages/admin/services/ServiceList"));
const ServiceAdd = React.lazy(() => import("./pages/admin/services/ServiceAdd"));
const ServiceEdit = React.lazy(() => import("./pages/admin/services/ServiceEdit"));

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
    <Router>
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
              <Route path="tenant/profile" element={<TenantProfile />} />
              <Route path="my-contracts" element={<MyContracts />} />
              <Route path="my-invoices" element={<MyInvoices />} />
              <Route path="my-maintenance" element={<TenantMaintenance />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="my-payments" element={<MyPayments />} />
              <Route path="my-notifications" element={<MyNotifications />} />
            </Route>
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="reports" element={<ReportManagement />} />
              <Route path="rooms" element={<RoomList />} />
              <Route path="rooms/add" element={<RoomAdd />} />
              <Route path="rooms/edit/:id" element={<RoomEdit />} />
              <Route path="contracts" element={<ContractManagement />} />
              <Route path="invoices" element={<InvoiceManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="expenses" element={<ExpenseManagement />} />
              <Route path="maintenance" element={<MaintenanceManagement />} />
              <Route path="requests" element={<RequestManagement />} />
              <Route path="notifications" element={<NotificationManagement />} />
              <Route path="services" element={<ServiceList />} />
              <Route path="services/add" element={<ServiceAdd />} />
              <Route path="services/edit/:id" element={<ServiceEdit />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;