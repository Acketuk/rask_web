"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Send, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type DBMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: { Time: string; Valid: boolean } | null;
};

type WSMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
};

type ConvDetail = {
  id: string;
  ad_id: string;
  ad_title: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  messages: DBMessage[];
};

type Message = {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
};

function dbMsgToMsg(m: DBMessage, conv: ConvDetail): Message {
  return {
    id: m.id,
    sender_id: m.sender_id,
    sender_name: m.sender_id === conv.buyer_id ? conv.buyer_name : conv.seller_name,
    content: m.content,
    created_at: m.created_at?.Valid ? m.created_at.Time : "",
  };
}

function formatTime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export default function ChatRoomPage() {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, user, accessToken } = useAuth();
  const router = useRouter();

  const [conv, setConv] = useState<ConvDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoggedIn === false) { router.replace("/sign-in"); return; }
  }, [isLoggedIn, router]);

  // Fetch conversation + history
  useEffect(() => {
    if (!accessToken || !id) return;
    fetch(`/api/v1/conversations/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: ConvDetail) => {
        setConv(data);
        setMessages((data.messages ?? []).map(m => dbMsgToMsg(m, data)));
      })
      .catch(() => router.replace("/chats"));
  }, [accessToken, id, router]);

  // Connect WebSocket after conv is loaded
  useEffect(() => {
    if (!conv || !accessToken) return;

    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const host  = window.location.host;
    const ws = new WebSocket(`${proto}://${host}/api/v1/ws?conversation_id=${id}&token=${accessToken}`);
    wsRef.current = ws;

    ws.onopen  = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
      const msg: WSMessage = JSON.parse(e.data);
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, { id: msg.id, sender_id: msg.sender_id, sender_name: msg.sender_name, content: msg.content, created_at: msg.created_at }];
      });
    };

    return () => ws.close();
  }, [conv, accessToken, id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ content: text }));
    setInput("");
  }, [input]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  if (!isLoggedIn || !conv) return null;

  const otherName = conv.buyer_id === user?.id ? conv.seller_name : conv.buyer_name;

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-2xl flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-0">
        <Link href="/chats" className="rounded-full p-1.5 transition hover:bg-muted">
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {initials(otherName)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{otherName}</p>
          <Link href={`/ads/${conv.ad_id}`} className="truncate text-xs text-muted-foreground hover:text-primary transition-colors">
            {conv.ad_title}
          </Link>
        </div>
        <div className={`ml-auto size-2 shrink-0 rounded-full ${connected ? "bg-green-500" : "bg-muted-foreground"}`} title={connected ? "Connected" : "Connecting…"} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-muted-foreground pt-8">
            No messages yet. Say hello!
          </p>
        )}
        {messages.map(msg => {
          const mine = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>
              {!mine && (
                <span className="px-1 text-xs text-muted-foreground">{msg.sender_name}</span>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  mine
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
              <span className="px-1 text-[10px] text-muted-foreground">{formatTime(msg.created_at)}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            style={{ maxHeight: "120px" }}
            onInput={e => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || !connected}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
