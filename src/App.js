import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// ADMIN PAGES
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReportManagement from "./pages/admin/ReportManagement";
import RoomList from "./pages/admin/rooms/RoomList";
import RoomAdd from "./pages/admin/rooms/RoomAdd";
import RoomEdit from "./pages/admin/rooms/RoomEdit";
import ContractManagement from "./pages/admin/ContractManagement";
import InvoiceManagement from "./pages/admin/InvoiceManagement";
import UserManagement from "./pages/admin/UserManagement";
import ExpenseManagement from "./pages/admin/ExpenseManagement";
import MaintenanceManagement from "./pages/admin/MaintenanceManagement";
import RequestManagement from "./pages/admin/RequestManagement";
import NotificationManagement from "./pages/admin/NotificationManagement";
import ServiceList from "./pages/admin/services/ServiceList";
import ServiceAdd from "./pages/admin/services/ServiceAdd";
import ServiceEdit from "./pages/admin/services/ServiceEdit";
import RoomsPage from "./pages/public/RoomsPage";
import ContactPage from "./pages/public/ContactPage";
import HomePage from "./pages/public/HomePage";
import UnauthorizedPage from "./pages/public/UnauthorizedPage";
import BookingFormPage from "./pages/public/BookingFormPage";

import TenantProfile from "./pages/tenant/TenantProfile";
import MyContracts from "./pages/tenant/MyContracts";
import MyInvoices from "./pages/tenant/MyInvoices";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";
import ChangePassword from "./pages/tenant/ChangePassword";
import MyPayments from "./pages/tenant/MyPayments";
import MyNotifications from "./pages/tenant/MyNotifications";
import ChatWidget from "./features/chat/ChatWidget";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <ChatWidget />
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<MainLayout />}>
          {/* TENANT / PUBLIC */}
          <Route index element={<HomePage />} />
          <Route path="rooms" element={<RoomsPage />} />
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
    </Router>
  );
}

export default App;
