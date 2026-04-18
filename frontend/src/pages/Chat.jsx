import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchMyRequests,
  fetchExpertRequests,
  fetchRequestMessages,
  sendRequestMessage,
} from "../api/consultation";
import { useChatNotifications } from "../hooks/useConsultationNotifications";
import "../style/Chat.css";

export default function Chat({ language = "ar" }) {
  const isArabic = language === "ar";
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

  const myEmail = useMemo(
    () => (currentUser?.email || "").toLowerCase().trim(),
    [currentUser]
  );

  const myDisplayName = useMemo(
    () =>
      currentUser?.full_name ||
      currentUser?.name ||
      currentUser?.username ||
      (isArabic ? "حسابي" : "My Account"),
    [currentUser, isArabic]
  );

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

  // ── Chat Notifications: نمرر الـ request الحالي عشان الـ hook يتعامل معاه ──
  const currentRequestList = useMemo(
    () => (requestId ? [{ id: requestId }] : []),
    [requestId]
  );
  const { markChatAsSeen } = useChatNotifications(currentRequestList);

  // لما الصفحة تفتح → نصفّر badge الشات ده
  useEffect(() => {
    if (requestId && token) {
      markChatAsSeen(requestId);
    }
  }, [requestId, token, markChatAsSeen]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  const extractSenderEmail = useCallback(
    (m) =>
      (
        m.sender_email ||
        m.sender?.email ||
        m.sender_username ||
        m.sender?.username ||
        m.sender_name ||
        ""
      )
        .toString()
        .toLowerCase()
        .trim(),
    []
  );

  const isMine = useCallback(
    (m) => {
      if (!myEmail) return false;
      const senderEmail = extractSenderEmail(m);
      if (senderEmail && senderEmail.includes("@")) return senderEmail === myEmail;
      const myId = currentUser?.id;
      const senderId = m.sender_id || m.sender?.id;
      if (myId && senderId && Number(myId) === Number(senderId)) return true;
      return false;
    },
    [myEmail, currentUser, extractSenderEmail]
  );

  const extractNameFromMessage = useCallback(
    (m) =>
      m.sender_name ||
      m.sender?.full_name ||
      m.sender?.name ||
      m.sender?.username ||
      null,
    []
  );

  const getSenderTitle = useCallback(
    (m) => {
      if (isMine(m)) return myDisplayName;
      const extracted = extractNameFromMessage(m);
      if (extracted) return extracted;
      if (userType === "user")
        return requestInfo.expertName || (isArabic ? "الخبير" : "Expert");
      return requestInfo.userName || (isArabic ? "المستخدم" : "User");
    },
    [isMine, myDisplayName, extractNameFromMessage, userType, requestInfo, isArabic]
  );

  const loadRequestInfo = useCallback(async () => {
    try {
      const data =
        userType === "expert"
          ? await fetchExpertRequests()
          : await fetchMyRequests();
      const arr = Array.isArray(data) ? data : data?.results || [];
      const req = arr.find((x) => String(x.id) === String(requestId));
      if (!req) return;
      setRequestInfo({
        userName:
          req.user_name ||
          req.user?.full_name ||
          req.user?.username ||
          (isArabic ? "مستخدم" : "User"),
        expertName:
          req.expert_name ||
          req.expert?.full_name ||
          req.expert?.username ||
          (isArabic ? "خبير" : "Expert"),
      });
    } catch (e) {
      console.error("loadRequestInfo error:", e);
    }
  }, [userType, requestId, isArabic]);

  const loadMessages = useCallback(async () => {
    try {
      setErr("");
      setLoading(true);
      const data = await fetchRequestMessages(requestId);
      const arr = Array.isArray(data) ? data : data?.results || [];
      setMessages(arr);
      scrollToBottom();
      // بعد تحميل الرسائل نصفّر الـ badge تاني (لو وصلت رسائل جديدة أثناء التحميل)
      markChatAsSeen(requestId);
    } catch (e) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.detail || e?.response?.data || e.message;
      setErr(
        isArabic
          ? `مش قادر أجيب الرسائل (${status || "?"})\n${JSON.stringify(msg)}`
          : `Unable to load messages (${status || "?"})\n${JSON.stringify(msg)}`
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [requestId, isArabic, scrollToBottom, markChatAsSeen]);

  const send = useCallback(async () => {
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
      setErr(
        isArabic
          ? `مش قادر أرسل الرسالة (${status || "?"})\n${JSON.stringify(msg)}`
          : `Unable to send message (${status || "?"})\n${JSON.stringify(msg)}`
      );
      console.error(e);
    } finally {
      setSending(false);
    }
  }, [text, requestId, loadMessages, isArabic]);

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
        if (!document.hidden) loadMessages();
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
  }, [token, requestId, navigate, loadRequestInfo, loadMessages]);

  if (!token) return null;

  return (
    <div className="page-container">
      <div className="page-header chat-page-header">
        <h2>{isArabic ? "المحادثة" : "Chat"}</h2>
        <p className="page-header-subtext"></p>
      </div>

      <div className="consultation-container chat-container">
        {loading && (
          <p className="chat-loading-text">
            {isArabic ? "جاري تحميل الرسائل..." : "Loading messages..."}
          </p>
        )}

        {err && <p className="chat-error-text">{err}</p>}

        <div className="chat-messages-wrapper">
          {messages.length === 0 && !loading ? (
            <p className="chat-empty-text">
              {isArabic ? "لا توجد رسائل بعد" : "No messages yet"}
            </p>
          ) : (
            messages.map((m, i) => {
              const mine = isMine(m);
              const title = getSenderTitle(m);
              const body = m.message || m.text || m.content || "";

              return (
                <div
                  key={m.id || i}
                  className={`chat-message-row ${mine ? "mine" : "other"}`}
                >
                  <div className={`chat-bubble ${mine ? "mine" : "other"}`}>
                    <div className="chat-bubble-meta">
                      <span className="chat-sender-name">{title}</span>
                      <span className="chat-message-time">
                        {m.created_at ? String(m.created_at).slice(0, 19) : ""}
                      </span>
                    </div>
                    <div className="chat-bubble-body">{body}</div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-compose-box">
          <input
            className="chat-compose-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isArabic ? "اكتب رسالة..." : "Type a message..."}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            disabled={sending}
          />
          <button
            className="chat-send-btn"
            onClick={send}
            disabled={sending || !text.trim()}
          >
            {sending ? "..." : isArabic ? "إرسال 🚀" : "Send 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
