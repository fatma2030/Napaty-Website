import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createConsultationRequest,
  fetchExpertRequests,
  fetchExperts,
  fetchMyRequests,         
  updateRequestStatus,
} from "../api/consultation";

const timeSlots = [
  "9:00 ص - 10:00 ص",
  "10:00 ص - 11:00 ص",
  "11:00 ص - 12:00 م",
  "1:00 م - 2:00 م",
  "2:00 م - 3:00 م",
  "3:00 م - 4:00 م",
];

const paymentMethods = [
  { id: "vodafone", name: "فودافون كاش", icon: "📱" },
  { id: "visa", name: "فيزا / ماستركارد", icon: "💳" },
  { id: "paypal", name: "باي بال", icon: "🔵" },
];

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getRequestTime = (req) => {
  return (
    req.created_at ||
    req.createdAt ||
    req.timestamp ||
    req.sent_at ||
    req.time ||
    req.created ||
    null
  );
};

const ChatButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      marginTop: 12,
      padding: "10px 14px",
      borderRadius: 14,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 800,
      color: "#fff",
      background: disabled
        ? "#9CA3AF"
        : "linear-gradient(135deg, #0ea5e9, #2563eb)",
      boxShadow: disabled ? "none" : "0 12px 24px rgba(37,99,235,0.18)",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
      opacity: disabled ? 0.75 : 1,
    }}
    onMouseEnter={(e) => {
      if (disabled) return;
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 16px 30px rgba(37,99,235,0.24)";
    }}
    onMouseLeave={(e) => {
      if (disabled) return;
      e.currentTarget.style.transform = "translateY(0px)";
      e.currentTarget.style.boxShadow = "0 12px 24px rgba(37,99,235,0.18)";
    }}
  >
    💬 فتح الشات
  </button>
);

function Consultation() {
  const navigate = useNavigate();

  const token = useMemo(
    () => localStorage.getItem("access") || localStorage.getItem("token"),
    []
  );
  const userType = useMemo(
    () => (localStorage.getItem("user_type") || "user").toString().toLowerCase(),
    []
  );

  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);
  const [expertsError, setExpertsError] = useState("");

  const [selectedExpert, setSelectedExpert] = useState(null);
  const [consultationTime, setConsultationTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const [myReqs, setMyReqs] = useState([]);
  const [myReqLoading, setMyReqLoading] = useState(false);
  const [myReqError, setMyReqError] = useState("");

  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    if (userType !== "user") return;

    (async () => {
      try {
        setExpertsLoading(true);
        setExpertsError("");
        const data = await fetchExperts();
        setExperts(Array.isArray(data) ? data : data?.results || []);
      } catch (e) {
        setExpertsError("حصل خطأ في تحميل الخبراء");
        console.error(e);
      } finally {
        setExpertsLoading(false);
      }
    })();
  }, [token, userType]);

  const loadMyRequests = async () => {
    try {
      setMyReqLoading(true);
      setMyReqError("");
      const data = await fetchMyRequests();
      const arr = Array.isArray(data) ? data : data?.results || [];
      setMyReqs(arr);
    } catch (e) {
      setMyReqError("حصل خطأ في تحميل طلباتك");
      console.error(e);
    } finally {
      setMyReqLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    if (userType !== "user") return;

    loadMyRequests();

    const t = setInterval(() => {
      if (document.hidden) return;
      loadMyRequests();
    }, 10000);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userType]);

  useEffect(() => {
    if (!token) return;
    if (userType !== "expert") return;

    (async () => {
      try {
        setReqLoading(true);
        setReqError("");
        const data = await fetchExpertRequests();
        setRequests(Array.isArray(data) ? data : data?.results || []);
      } catch (e) {
        setReqError("حصل خطأ في تحميل الطلبات");
        console.error(e);
      } finally {
        setReqLoading(false);
      }
    })();
  }, [token, userType]);

  if (!token) return null;

  // ====== USER: create request ======
  const handleCreateRequest = async () => {
    if (!selectedExpert || !consultationTime || !paymentMethod) {
      alert("يرجى اختيار خبير + وقت + طريقة دفع");
      return;
    }

    try {
      setCreating(true);

      await createConsultationRequest({
        expert_id: selectedExpert.id,
        time_slot: consultationTime,
        payment_method: paymentMethod,
        message: message || "",
      });

      alert("تم إرسال طلب الاستشارة ✅");
      setSelectedExpert(null);
      setConsultationTime("");
      setPaymentMethod("");
      setMessage("");

      loadMyRequests();
    } catch (e) {
      alert("حصل خطأ أثناء إرسال الطلب");
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  // ====== EXPERT: accept/reject ======
  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateRequestStatus(id, status);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (e) {
      alert("حصل خطأ أثناء تحديث الحالة");
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  // EXPERT VIEW
  if (userType === "expert") {
    return (
      <div className="page-container">
        <div className="page-header">
          <h2>طلبات الاستشارات</h2>
        </div>

        <div className="consultation-container">
          {reqLoading && <p>جاري تحميل الطلبات...</p>}
          {reqError && <p style={{ color: "red" }}>{reqError}</p>}

          {!reqLoading && !reqError && requests.length === 0 && (
            <p>لا توجد طلبات حالياً</p>
          )}

          {!reqLoading &&
            !reqError &&
            requests.map((req) => {
              const reqTime = formatDateTime(getRequestTime(req));
              const userName =
                req.user_name || req.user?.full_name || req.user?.username || "مستخدم";
              const timeSlot = req.time_slot || "-";

              return (
                <div
                  key={req.id}
                  style={{
                    marginBottom: 12,
                    border: "1px solid #eee",
                    borderRadius: 18,
                    padding: 16,
                    background: "#fff",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                  }}
                >
                  <h4 style={{ marginTop: 0 }}>طلب من: {userName}</h4>

                  <p style={{ margin: "8px 0" }}>
                    <b>وقت الجلسة:</b> {timeSlot}
                  </p>

                  {reqTime ? (
                    <p style={{ margin: "8px 0", opacity: 0.85 }}>
                      <b>وقت الإرسال:</b> {reqTime}
                    </p>
                  ) : null}

                  {req.message ? (
                    <p style={{ margin: "8px 0" }}>
                      <b>الرسالة:</b> {req.message}
                    </p>
                  ) : null}

                  {req.status === "pending" ? (
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <button
                        disabled={updatingId === req.id}
                        onClick={() => handleUpdateStatus(req.id, "accept")}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 12,
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 800,
                          color: "#fff",
                          background: "linear-gradient(135deg, #16a34a, #22c55e)",
                          boxShadow: "0 10px 18px rgba(34,197,94,0.22)",
                        }}
                      >
                        {updatingId === req.id ? "..." : "قبول"}
                      </button>

                      <button
                        disabled={updatingId === req.id}
                        onClick={() => handleUpdateStatus(req.id, "reject")}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 12,
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 800,
                          color: "#fff",
                          background: "linear-gradient(135deg, #dc2626, #ef4444)",
                          boxShadow: "0 10px 18px rgba(239,68,68,0.22)",
                        }}
                      >
                        {updatingId === req.id ? "..." : "رفض"}
                      </button>
                    </div>
                  ) : null}

                  {/* ✅ فتح الشات للخبير بعد القبول */}
                  {req.status === "accepted" ? (
                    <ChatButton onClick={() => navigate(`/chat/${req.id}`)} />
                  ) : null}
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  // USER VIEW
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>استشارة مع خبير</h2>
        <p>اختر خبير وابعته طلب مراسلة/حجز</p>
      </div>

      <div className="consultation-container">
        <div
          style={{
            marginBottom: 16,
            border: "1px solid #eee",
            borderRadius: 18,
            padding: 16,
            background: "#fff",
            boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>طلباتك</h3>
          {myReqLoading && <p>جاري تحميل طلباتك...</p>}
          {myReqError && <p style={{ color: "red" }}>{myReqError}</p>}

          {!myReqLoading && !myReqError && myReqs.length === 0 ? (
            <p style={{ opacity: 0.75 }}>مفيش طلبات لحد دلوقتي</p>
          ) : (
            myReqs.map((req) => {
              const reqTime = formatDateTime(getRequestTime(req));
              const expertName =
                req.expert_name ||
                req.expert?.full_name ||
                req.expert?.username ||
                "خبير";
              return (
                <div
                  key={req.id}
                  style={{
                    borderTop: "1px solid #f1f1f1",
                    paddingTop: 12,
                    marginTop: 12,
                  }}
                >
                  <p style={{ margin: "6px 0" }}>
                    <b>الخبير:</b> {expertName}
                  </p>

                  {reqTime ? (
                    <p style={{ margin: "6px 0", opacity: 0.85 }}>
                      <b>وقت الإرسال:</b> {reqTime}
                    </p>
                  ) : null}

                  {req.status === "accepted" ? (
                    <ChatButton onClick={() => navigate(`/chat/${req.id}`)} />
                  ) : (
                    <p style={{ margin: "6px 0", opacity: 0.75 }}>
                      الطلب لم يُقبل بعد
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {expertsLoading && <p>جاري تحميل الخبراء...</p>}
        {expertsError && <p style={{ color: "red" }}>{expertsError}</p>}

        {!expertsLoading && !expertsError && !selectedExpert && (
          <div className="experts-selection">
            <h3>الخبراء المتاحون</h3>
            <div className="experts-grid">
              {experts.map((expert) => (
                <div
                  key={expert.id}
                  className="expert-card"
                  onClick={() => setSelectedExpert(expert)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="expert-info">
                    <h4>{expert.full_name || expert.name}</h4>
                    <p>{expert.specialization || "خبير زراعي"}</p>
                    <p>خبرة: {expert.experience_years ?? expert.experience ?? "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!expertsLoading && !expertsError && selectedExpert && (
          <div className="booking-process">
            <h4>الخبير المختار: {selectedExpert.full_name || selectedExpert.name}</h4>

            <div className="time-selection">
              <h4>اختر وقت الجلسة</h4>
              <div className="time-slots">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`time-slot ${consultationTime === slot ? "selected" : ""}`}
                    onClick={() => setConsultationTime(slot)}
                    disabled={creating}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="payment-selection">
              <h4>طريقة الدفع</h4>
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`payment-method ${
                      paymentMethod === method.id ? "selected" : ""
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{ cursor: creating ? "not-allowed" : "pointer" }}
                  >
                    <span>{method.icon}</span> <span>{method.name}</span>
                  </div>
                ))}
              </div>
            </div>

            

            <button
              onClick={handleCreateRequest}
              disabled={creating || !consultationTime || !paymentMethod}
              className="book-now-btn"
              style={{ marginTop: 14 }}
            >
              {creating ? "جاري إرسال الطلب..." : "إرسال طلب الاستشارة"}
            </button>

            <button
              style={{ marginTop: 10 }}
              onClick={() => setSelectedExpert(null)}
              disabled={creating}
            >
              رجوع
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Consultation;
