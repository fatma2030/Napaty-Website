
import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchMyRequests,
  fetchExpertRequests,
  fetchRequestMessages,
} from "../api/consultation";


function getSeenIds(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveSeenIds(key, ids) {
  try {
    localStorage.setItem(key, JSON.stringify([...ids]));
  } catch {
  }
}

function getLastMsgCount(requestId) {
  try {
    const raw = localStorage.getItem(`chat_msg_count_${requestId}`);
    return raw !== null ? Number(raw) : null;
  } catch {
    return null;
  }
}

function saveLastMsgCount(requestId, count) {
  try {
    localStorage.setItem(`chat_msg_count_${requestId}`, String(count));
  } catch {
  }
}


export function useConsultationNotifications(userType) {
  const [badgeCount, setBadgeCount] = useState(0);
  const seenKey = `seen_requests_${userType}`;
  const pollingRef = useRef(null);

  const computeBadge = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("access") || localStorage.getItem("token");
      if (!token) return;

      let items = [];

      if (userType === "expert") {
        const data = await fetchExpertRequests();
        const arr = Array.isArray(data) ? data : data?.results || [];
        items = arr.filter((r) => r.status === "pending");
      } else {
        const data = await fetchMyRequests();
        const arr = Array.isArray(data) ? data : data?.results || [];
        items = arr.filter((r) => r.status === "accepted");
      }

      const seen = getSeenIds(seenKey);
      setBadgeCount(items.filter((r) => !seen.has(r.id)).length);
    } catch {
      /* silence */
    }
  }, [userType, seenKey]);

  useEffect(() => {
    const type = (userType || "").toString().toLowerCase();
    if (type !== "user" && type !== "expert") return;

    computeBadge();

    pollingRef.current = setInterval(() => {
      if (!document.hidden) computeBadge();
    }, 15000);

    return () => clearInterval(pollingRef.current);
  }, [userType, computeBadge]);

  const markAllAsSeen = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("access") || localStorage.getItem("token");
      if (!token) return;

      let items = [];
      if (userType === "expert") {
        const data = await fetchExpertRequests();
        const arr = Array.isArray(data) ? data : data?.results || [];
        items = arr.filter((r) => r.status === "pending");
      } else {
        const data = await fetchMyRequests();
        const arr = Array.isArray(data) ? data : data?.results || [];
        items = arr.filter((r) => r.status === "accepted");
      }

      const seen = getSeenIds(seenKey);
      items.forEach((r) => seen.add(r.id));
      saveSeenIds(seenKey, seen);
      setBadgeCount(0);
    } catch {
      
    }
  }, [userType, seenKey]);

  return { badgeCount, markAllAsSeen, refresh: computeBadge };
}


export function useChatNotifications(acceptedRequests) {
  const [chatUnread, setChatUnread] = useState({});
  const pollingRef = useRef(null);

  const computeUnread = useCallback(async () => {
    if (!acceptedRequests || acceptedRequests.length === 0) return;

    const token =
      localStorage.getItem("access") || localStorage.getItem("token");
    if (!token) return;

    const updates = {};

    await Promise.allSettled(
      acceptedRequests.map(async (req) => {
        try {
          const data = await fetchRequestMessages(req.id);
          const arr = Array.isArray(data) ? data : data?.results || [];
          const total = arr.length;
          const last = getLastMsgCount(req.id);

          if (last === null) {
            saveLastMsgCount(req.id, total);
            updates[req.id] = 0;
          } else {
            updates[req.id] = Math.max(total - last, 0);
          }
        } catch {
          updates[req.id] = 0;
        }
      })
    );

    setChatUnread((prev) => ({ ...prev, ...updates }));
  }, [acceptedRequests]);

  useEffect(() => {
    if (!acceptedRequests || acceptedRequests.length === 0) return;

    computeUnread();

    pollingRef.current = setInterval(() => {
      if (!document.hidden) computeUnread();
    }, 10000);

    return () => clearInterval(pollingRef.current);
  }, [acceptedRequests, computeUnread]);

  const markChatAsSeen = useCallback(async (requestId) => {
    try {
      const token =
        localStorage.getItem("access") || localStorage.getItem("token");
      if (!token) return;

      const data = await fetchRequestMessages(requestId);
      const arr = Array.isArray(data) ? data : data?.results || [];
      saveLastMsgCount(requestId, arr.length);

      setChatUnread((prev) => ({ ...prev, [requestId]: 0 }));
    } catch {
    }
  }, []);

  return { chatUnread, markChatAsSeen };
}
