"use client";

import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, addDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SessionMessage } from "@/lib/types";
import styles from "./SessionChat.module.css";

interface Props {
  bookingId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  disabled?: boolean;
}

export default function SessionChat({ bookingId, userId, userName, userAvatar, disabled }: Props) {
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Real-time listener
  useEffect(() => {
    const q = query(
      collection(db, "bookings", bookingId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs: SessionMessage[] = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      } as SessionMessage));
      setMessages(msgs);
    }, (err) => {
      console.error("Chat listener error:", err);
    });

    return () => unsub();
  }, [bookingId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending || disabled) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    try {
      await addDoc(collection(db, "bookings", bookingId, "messages"), {
        bookingId,
        senderId: userId,
        senderName: userName,
        senderAvatar: userAvatar || "",
        content: text,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Send message error:", err);
      setInput(text); // Restore on failure
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        💬 Chat de sesión
      </div>

      <div className={styles.chatMessages} ref={chatContainerRef}>
        {messages.length === 0 && (
          <div className={styles.emptyChat}>
            Aún no hay mensajes.<br />¡Escribe algo para empezar!
          </div>
        )}
        {messages.map(msg => {
          const isOwn = msg.senderId === userId;
          return (
            <div key={msg.id} className={`${styles.message} ${isOwn ? styles.messageOwn : styles.messageOther}`}>
              <div className={styles.messageMeta}>
                <span className={styles.senderName}>{isOwn ? "Tú" : msg.senderName}</span>
                <span className={styles.messageTime}>{formatTime(msg.createdAt)}</span>
              </div>
              <div className={styles.messageBubble}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder={disabled ? "Sesión finalizada" : "Escribe un mensaje..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          maxLength={1000}
        />
        <button
          className={styles.sendBtn}
          onClick={sendMessage}
          disabled={!input.trim() || sending || disabled}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
