import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, registerRequest } from "../api/auth";

import {
  FaUser,
  FaLock,
  FaUserTie,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaCalendarAlt,
  FaBriefcase,
} from "react-icons/fa";

const emptyForm = {
  email: "",
  password: "",
  name: "",
  phone: "",
  location: "",
  experience: "",
  field: "",
};

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });

  useEffect(() => {
    setFormData({ ...emptyForm });
    setShowPassword(false);
  }, [activeTab]);

  const userTypes = [
    { value: "user", label: "مستخدم", icon: <FaUser />, color: "#4CAF50" },
    { value: "expert", label: "خبير زراعي", icon: <FaUserTie />, color: "#2196F3" },
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === "login") {
        if (!formData.email || !formData.password) {
          alert("يرجى إدخال البريد وكلمة المرور");
          return;
        }

        const data = await loginRequest({
          email: formData.email,
          password: formData.password,
        });

        if (data.access) localStorage.setItem("access", data.access);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);
        if (data.token) localStorage.setItem("access", data.token);

        const savedUserType =
          data.user_type ||
          data.user?.user_type ||
          data.user?.type ||
          "user";

        localStorage.setItem("user_type", savedUserType);
        localStorage.setItem("user", JSON.stringify(data.user || {}));

        setUser({
          ...(data.user || {}),
          user_type: savedUserType,
          isAuthenticated: true,
        });

        setFormData({ ...emptyForm });
        navigate("/", { replace: true });
        return;
      }

      // REGISTER
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        alert("يرجى ملء جميع الحقول المطلوبة");
        return;
      }

      if (userType === "expert") {
        if (!formData.experience || !formData.field) {
          alert("يرجى ملء مدة الخبرة والمجال للخبير الزراعي");
          return;
        }
      }

      const payload = {
        full_name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || "",
        location: formData.location || "",
        user_type: userType,
        ...(userType === "expert" && {
          experience_years: Number(formData.experience),
          specialization: formData.field,
        }),
      };

      await registerRequest(payload);

      alert("تم إنشاء الحساب بنجاح ✅");
      setFormData({ ...emptyForm });
      setUserType("user");
      setShowPassword(false);
      setActiveTab("login");
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        data?.detail ||
        data?.message ||
        (data && typeof data === "object" ? JSON.stringify(data) : null) ||
        "حصل خطأ.. تأكد من البيانات أو من السيرفر";

      alert(msg);
      console.error(err);
    }
  };

  return (
    <div className="login-page-proper">
      <div className="login-container-proper">
        <div className="login-header">
          <img
            src="/images/Capture.png"
            alt="App Logo"
            className="header-image"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "20px",
              border: "3px solid #4CAF50",
            }}
          />
          <div className="app-title">
            <div className="app-title-text">
              <h1>مرحباً بعودتك</h1>
            </div>
          </div>
        </div>

        <div className="welcome-section">
          <p style={{ fontSize: 20 }}>سجل الدخول لمواصلة رحلتك مع النباتات</p>
        </div>

        <div className="login-content-proper">
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              تسجيل الدخول
            </button>
            <button
              className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              إنشاء حساب
            </button>
          </div>

          {activeTab === "register" && (
            <div className="user-type-section">
              <h3>نوع الحساب</h3>
              <div className="user-types">
                {userTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`user-type-card ${userType === type.value ? "selected" : ""}`}
                    onClick={() => setUserType(type.value)}
                    style={{ borderColor: userType === type.value ? type.color : "#ddd" }}
                  >
                    <div className="type-icon" style={{ color: type.color }}>
                      {type.icon}
                    </div>
                    <span>{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form-proper">
            {activeTab === "register" ? (
              <>
                <div className="form-single-column">
                  <div className="form-group">
                    <label>الاسم الكامل</label>
                    <div className="input-with-icon">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>البريد الإلكتروني</label>
                    <div className="input-with-icon">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="أدخل بريدك الإلكتروني"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>رقم الهاتف</label>
                    <div className="input-with-icon">
                      <FaUser className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="أدخل رقم هاتفك"
                        required
                      />
                    </div>
                  </div>

                  {userType === "expert" && (
                    <>
                      <div className="form-group">
                        <label>مدة الخبرة (سنوات)</label>
                        <div className="input-with-icon">
                          <FaCalendarAlt className="input-icon" />
                          <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="عدد سنوات الخبرة"
                            min="0"
                            max="50"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>المجال التخصصي</label>
                        <div className="input-with-icon">
                          <FaBriefcase className="input-icon" />
                          <input
                            type="text"
                            name="field"
                            value={formData.field}
                            onChange={handleChange}
                            placeholder="مثال: نباتات زينة، أشجار فاكهة، خضروات"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="form-group">
                  <label>كلمة المرور</label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="أدخل كلمة المرور"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-single-column">
                  <div className="form-group">
                    <label>الأيميل</label>
                    <div className="input-with-icon">
                      <FaUser className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="أدخل بريدك الإلكتروني"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>كلمة المرور</label>
                    <div className="input-with-icon">
                      <FaLock className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="أدخل كلمة المرور"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="submit-btn-proper">
              {activeTab === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
            </button>
          </form>

          <div className="auth-footer">
            {activeTab === "login" ? (
              <p>
                ليس لديك حساب؟ <span onClick={() => setActiveTab("register")}>سجل الآن</span>
              </p>
            ) : (
              <p>
                لديك حساب بالفعل؟ <span onClick={() => setActiveTab("login")}>سجل الدخول</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
