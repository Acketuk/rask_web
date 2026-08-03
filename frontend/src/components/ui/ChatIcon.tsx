"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ChatIcon() {
  const { isLoggedIn, accessToken } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn || !accessToken) { setCount(0); return; }
    function load() {
      fetch("/api/v1/conversations", { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(r => r.json())
        .then(d => setCount(Array.isArray(d) ? d.length : 0))
        .catch(() => {});
    }
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, [isLoggedIn, accessToken]);

  if (!isLoggedIn) return null;

  return (
    <Link
      href="/chats"
      className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
      aria-label="Messages"
    >
      <MessageSquare className="size-4" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
