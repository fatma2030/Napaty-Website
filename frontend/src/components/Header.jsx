import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaFlask,
  FaShoppingCart,
  FaComments,
  FaCalendarAlt,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";

const Header = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/login", { replace: true });
  };

  const navItems = [
    { path: "/welcome", icon: <FaHome />, label: "الرئيسية" },
    { path: "/diagnosis", icon: <MdLocalHospital />, label: "تشخيص الأمراض" },
    { path: "/soil-analysis", icon: <FaFlask />, label: "تحليل التربة" },
    { path: "/plants-seasons", icon: <FaCalendarAlt />, label: "النباتات والفصول" },
    { path: "/store", icon: <FaShoppingCart />, label: "المتجر" },
    { path: "/consultation", icon: <FaComments />, label: "استشارة الخبراء" },
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="logo-section">
          <img
            src="/images/Capture.png"
            alt="نباتي"
            className="header-logo-image"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              marginLeft: 0,
            }}
          />
          <h1 style={{ marginLeft: "10%" }}>نباتي</h1>
        </div>

        <nav className="nav-menu">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="user-actions">
          {user ? (
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> تسجيل الخروج
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              <FaUser /> تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
