import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchMyRequests,
  fetchExpertRequests,
  fetchRequestMessages,
  sendRequestMessage,
} from "../api/consultation";

export default function Chat() {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const token = useMemo(
    () => localStorage.getItem("access") || localStorage.getItem("token"),
    []
  );

  const userType = useMemo(() => {
    const t = localStorage.getItem("user_type") || "user";
    return String(t).toLowerCase().trim();
  }, []);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const myEmail = useMemo(() => {
    return (currentUser?.email || "").toLowerCase().trim();
  }, [currentUser]);

  const myDisplayName = useMemo(() => {
    return (
      currentUser?.full_name ||
      currentUser?.name ||
      currentUser?.username ||
      "حسابي"
    );
  }, [currentUser]);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  const [requestInfo, setRequestInfo] = useState({
    userName: "",
    expertName: "",
  });

  const bottomRef = useRef(null);
  const scrollToBottom = () =>
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50
    );

  const extractSenderEmail = (m) => {
    return (
      (m.sender_email ||
        m.sender?.email ||
        m.sender_username ||
        m.sender?.username ||
        m.sender_name ||
        "") 
        .toString()
        .toLowerCase()
        .trim()
    );
  };

  const isMine = (m) => {
    if (!myEmail) return false;

    const senderEmail = extractSenderEmail(m);

    if (senderEmail && senderEmail.includes("@")) {
      return senderEmail === myEmail;
    }

    const myId = currentUser?.id;
    const senderId = m.sender_id || m.sender?.id;
    if (myId && senderId && Number(myId) === Number(senderId)) return true;

    return false;
  };

  const extractNameFromMessage = (m) => {
    return (
      m.sender_name ||
      m.sender?.full_name ||
      m.sender?.name ||
      m.sender?.username ||
      null
    );
  };

  const getSenderTitle = (m) => {
    const mine = isMine(m);
    if (mine) return myDisplayName;

    const extracted = extractNameFromMessage(m);
    if (extracted) return extracted;

    if (userType === "user") return requestInfo.expertName || "الخبير";
    return requestInfo.userName || "المستخدم";
  };

  const loadRequestInfo = async () => {
    try {
      let data;
      if (userType === "expert") data = await fetchExpertRequests();
      else data = await fetchMyRequests();

      const arr = Array.isArray(data) ? data : data?.results || [];
      const req = arr.find((x) => String(x.id) === String(requestId));
      if (!req) return;

      setRequestInfo({
        userName:
          req.user_name || req.user?.full_name || req.user?.username || "مستخدم",
        expertName:
          req.expert_name ||
          req.expert?.full_name ||
          req.expert?.username ||
          "خبير",
      });
    } catch (e) {
      console.error("loadRequestInfo error:", e);
    }
  };

  const loadMessages = async () => {
    try {
      setErr("");
      setLoading(true);
      const data = await fetchRequestMessages(requestId);
      const arr = Array.isArray(data) ? data : data?.results || [];
      setMessages(arr);
      scrollToBottom();
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.detail || e?.response?.data || e.message;
      setErr(`مش قادر أجيب الرسائل (${status || "?"})\n${JSON.stringify(msg)}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    try {
      setErr("");
      setSending(true);
      await sendRequestMessage(requestId, text.trim());
      setText("");
      await loadMessages();
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.detail || e?.response?.data || e.message;
      setErr(`مش قادر أرسل الرسالة (${status || "?"})\n${JSON.stringify(msg)}`);
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    if (!requestId) return;

    loadRequestInfo();
    loadMessages();

    let timer = null;

    const startPolling = () => {
      if (timer) clearInterval(timer);

      timer = setInterval(() => {
        if (document.hidden) return;
        loadMessages();
      }, 8000);
    };

    startPolling();

    const onVisibilityChange = () => {
      if (!document.hidden) {
        loadMessages();
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, requestId]);

  if (!token) return null;

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0 }}>💬 الشات</h2>
        <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
        <div className="page-header">
            
            </div>

        </p>
      </div>

      <div className="consultation-container" style={{ maxWidth: 900 }}>
        {loading && <p>جاري تحميل الرسائل...</p>}
        {err && <p style={{ color: "red", whiteSpace: "pre-wrap" }}>{err}</p>}

        <div
          style={{
            border: "1px solid #e6e6e6",
            borderRadius: 18,
            padding: 16,
            height: 440,
            overflowY: "auto",
            background:
              "linear-gradient(180deg, rgba(245,255,250,1) 0%, rgba(255,255,255,1) 100%)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
          }}
        >
          {messages.length === 0 && !loading ? (
            <p style={{ opacity: 0.7 }}>لا توجد رسائل بعد</p>
          ) : (
            messages.map((m, i) => {
              const mine = isMine(m);
              const title = getSenderTitle(m);
              const body = m.message || m.text || m.content || "";

              const bg = mine
                ? "linear-gradient(135deg, #16a34a, #22c55e)" // أنا
                : "linear-gradient(135deg, #2563eb, #60a5fa)"; // الطرف الآخر

              return (
                <div
                  key={m.id || i}
                  style={{
                    display: "flex",
                    justifyContent: mine ? "flex-end" : "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "10px 12px",
                      borderRadius: 16,
                      background: bg,
                      color: "#fff",
                      border: "1px solid rgba(0,0,0,0.06)",
                      boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        opacity: 0.95,
                        marginBottom: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span style={{ fontWeight: 800 }}>{title}</span>
                      <span style={{ fontSize: 11, opacity: 0.85 }}>
                        {m.created_at ? String(m.created_at).slice(0, 19) : ""}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 15,
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.6,
                      }}
                    >
                      {body}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 10,
            alignItems: "center",
            background: "#fff",
            padding: 12,
            borderRadius: 16,
            border: "1px solid #eee",
            boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رسالة..."
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid #ddd",
              outline: "none",
              fontSize: 14,
            }}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={sending}
          />

          <button
            onClick={send}
            disabled={sending || !text.trim()}
            style={{
              padding: "12px 18px",
              borderRadius: 14,
              border: "none",
              cursor: sending || !text.trim() ? "not-allowed" : "pointer",
              fontWeight: 800,
              color: "#fff",
              background:
                sending || !text.trim()
                  ? "#9CA3AF"
                  : "linear-gradient(135deg, #16a34a, #22c55e)",
              boxShadow:
                sending || !text.trim()
                  ? "none"
                  : "0 10px 22px rgba(34,197,94,0.25)",
              transition:
                "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
              opacity: sending || !text.trim() ? 0.75 : 1,
            }}
            onMouseEnter={(e) => {
              if (sending || !text.trim()) return;
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 14px 26px rgba(34,197,94,0.30)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow =
                sending || !text.trim()
                  ? "none"
                  : "0 10px 22px rgba(34,197,94,0.25)";
            }}
          >
            {sending ? "..." : "إرسال 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
