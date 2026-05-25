import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Button, LinearProgress, IconButton
} from '@mui/material';
import {
  TrendingUp, People, Home, Description, Receipt,
  AttachMoney, Refresh, MeetingRoom, EventNote
} from '@mui/icons-material';

import {
  ComposedChart, Line, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalContracts: 0,
    totalRevenue: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    unpaidInvoices: 0,
    pendingContracts: 0
  });
  const [chartData, setChartData] = useState([]);

  const [currentUser] = useState(() => {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, chartRes] = await Promise.all([
        api.get("/admin/dashboard/stats"),
        api.get("/finance/report?year=2026")
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (chartRes) {
        setChartData(chartRes);
      }
    } catch (error) {
      console.error("Lỗi tải dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="w-1/2 max-w-md"><LinearProgress /></div>
        <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu doanh thu và phòng trọ...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
            <Home className="text-4xl" /> Quản Lý Phòng Trọ
          </h1>
          <p className="text-gray-500 mt-1">
            Chào mừng trở lại quản trị, <span className="font-semibold text-blue-600">{currentUser?.username || 'Chủ trọ'}</span>!
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchData}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Làm mới dữ liệu
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-green-600 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Tổng doanh thu</p>
              <h3 className="text-2xl font-bold text-green-700 mt-1">
                {stats.totalRevenue?.toLocaleString('vi-VN')}₫
              </h3>
            </div>
            <div className="bg-green-100 text-green-700 p-2 rounded-lg">
              <AttachMoney />
            </div>
          </div>
        </div>

        {/* Occupancy Card */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-600 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Phòng đang thuê</p>
              <h3 className="text-2xl font-bold text-blue-700 mt-1">
                {stats.occupiedRooms} / {stats.totalRooms}
              </h3>
            </div>
            <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
              <MeetingRoom />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(stats.occupiedRooms / (stats.totalRooms || 1)) * 100}%` }}>
            </div>
          </div>
        </div>

        {/* Unpaid Invoices */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-red-600 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Hóa đơn chưa thu</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {stats.unpaidInvoices}
              </h3>
            </div>
            <div className="bg-red-100 text-red-600 p-2 rounded-lg">
              <Receipt />
            </div>
          </div>
        </div>

        {/* Active Contracts */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-orange-500 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Hợp đồng hiệu lực</p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {stats.totalContracts}
              </h3>
            </div>
            <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
              <Description />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Chart */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          📊 Biểu đồ Tài chính (Doanh thu & Lợi nhuận)
        </h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
              <XAxis dataKey="name" scale="band" />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu" barSize={40} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Chi phí" barSize={40} fill="#f97316" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="profit" name="Lợi nhuận" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100 mb-8">
        <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          🚀 Lối tắt Quản trị
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Button variant="outlined" startIcon={<Home />} component={Link} to="/admin/rooms" sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f8fafc' } }}>
            Phòng
          </Button>
          <Button variant="outlined" startIcon={<EventNote />} component={Link} to="/admin/contracts" sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f8fafc' } }}>
            Hợp đồng
          </Button>
          <Button variant="outlined" startIcon={<Receipt />} component={Link} to="/admin/invoices" sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f8fafc' } }}>
            Hóa đơn
          </Button>
          <Button variant="outlined" startIcon={<People />} component={Link} to="/admin/users" sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f8fafc' } }}>
            Khách thuê
          </Button>
          <Button variant="outlined" startIcon={<TrendingUp />} component={Link} to="/admin/expenses" sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f8fafc' } }}>
            Chi phí
          </Button>
          <Button variant="outlined" startIcon={<People />} component={Link} to="/admin/requests" sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f8fafc' } }}>
            Yêu cầu thuê
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
