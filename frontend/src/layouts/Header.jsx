import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaChartBar,
  FaEnvelope,
  FaFileContract,
  FaHome,
  FaMoneyBillWave,
  FaPhone,
  FaSearch,
  FaSignOutAlt,
  FaTools,
  FaUserCircle,
  FaBell,
} from "react-icons/fa";
import { Badge } from "@mui/material";
import "../styles/Header.css";

const tenantLinks = [
  { to: "/tenant/profile", label: "Cá nhân", icon: <FaUserCircle /> },
  { to: "/my-contracts", label: "Hợp đồng", icon: <FaFileContract /> },
  { to: "/my-invoices", label: "Hóa đơn", icon: <FaMoneyBillWave /> },
  { to: "/my-payments", label: "Thanh toán", icon: <FaMoneyBillWave /> },
  { to: "/my-maintenance", label: "Bảo trì", icon: <FaTools /> },
  { to: "/change-password", label: "Đổi mật khẩu", icon: <FaTools /> },
];

const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role || localStorage.getItem("role");
  return user || role ? { ...user, role } : null;
};

const Header = () => {
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(getCurrentUser());
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const isTenant = user?.role === "TENANT";
  const userLinks = useMemo(() => (isTenant ? tenantLinks : []), [isTenant]);
  const username = user?.username || user?.fullName || user?.name || "Tài khoản";

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  const handleSearch = () => {
    const keyword = searchText.trim();
    navigate(keyword ? `/rooms?keyword=${encodeURIComponent(keyword)}` : "/rooms");
  };

  return (
    <>
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="top-bar-left">
              <span className="hotline"><FaPhone /> Hotline: 0123 456 789</span>
              <span className="email"><FaEnvelope /> contact@phongtro.vn</span>
            </div>
            <div className="top-bar-right">
              {!user && (
                <Link to="/login" className="auth-link">
                  <FaUserCircle /> Đăng nhập
                </Link>
              )}
              {user && (
                <span className="auth-link">
                  <FaUserCircle /> {username}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <header className={`main-header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="container">
          <div className="header-main-content">
            <Link to="/" className="logo">
              <div className="logo-icon"><FaBuilding /></div>
              <div className="logo-text">
                <span className="logo-main">SMART</span>
                <span className="logo-sub">PHÒNG TRỌ</span>
              </div>
            </Link>

            <div className="search-section">
              <div className="search-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm phòng trọ, khu vực..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button type="button" className="search-button" onClick={handleSearch}>
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="actions-section">
              {user ? (
                <div className="user-menu-container">
                  <button
                    type="button"
                    className="user-button"
                    onClick={() => setMenuOpen((open) => !open)}
                  >
                    <FaUserCircle />
                    <span>{username}</span>
                  </button>

                  {menuOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <strong>{username}</strong>
                        <span>{isAdmin ? "ADMIN" : "TENANT"}</span>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="dropdown-link"
                          onClick={() => setMenuOpen(false)}
                        >
                          <FaChartBar /> Bảng quản trị
                        </Link>
                      )}

                      {userLinks.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="dropdown-link"
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.icon} {item.label}
                        </Link>
                      ))}

                      <button type="button" className="dropdown-link logout-button" onClick={logout}>
                        <FaSignOutAlt /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="user-button">
                  <FaUserCircle />
                  <span>Tài khoản</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="main-nav">
        <div className="container">
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link"><FaHome /> Trang chủ</Link></li>
            <li><Link to="/rooms" className="nav-link"><FaBuilding /> Danh sách phòng</Link></li>
            <li><Link to="/contact" className="nav-link"><FaPhone /> Liên hệ</Link></li>

            {userLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="nav-link">
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}

            {isAdmin && (
              <li>
                <Link to="/admin/dashboard" className="nav-link">
                  <FaChartBar /> Bảng quản trị
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
