"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Conv = {
  id: string;
  ad_id: string;
  ad_title: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  last_message: string | null;
  last_at: { Time: string; Valid: boolean } | null;
  updated_at: { Time: string; Valid: boolean } | null;
};

function timeAgo(ts: { Time: string; Valid: boolean } | null) {
  if (!ts?.Valid) return "";
  const d = new Date(ts.Time);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export default function ChatsPage() {
  const { isLoggedIn, accessToken, user } = useAuth();
  const router = useRouter();
  const [convs, setConvs] = useState<Conv[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn === false) { router.replace("/sign-in"); return; }
    if (!accessToken) return;
    fetch("/api/v1/conversations", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(r => r.json())
      .then(d => setConvs(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn, accessToken, router]);

  if (!isLoggedIn) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">Messages</span>
      </nav>

      <h1 className="mb-6 text-2xl font-black">Messages</h1>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">Loading…</div>
      ) : convs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border text-muted-foreground">
          <MessageSquare className="size-8 opacity-40" />
          <p className="text-sm">No messages yet</p>
          <Link href="/ads" className="text-xs text-primary hover:underline">Browse services to get started</Link>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {convs.map(conv => {
            const otherName = conv.buyer_id === user?.id ? conv.seller_name : conv.buyer_name;
            const time = timeAgo(conv.last_at ?? conv.updated_at);
            return (
              <li key={conv.id}>
                <Link
                  href={`/chats/${conv.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-muted"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {initials(otherName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{otherName}</p>
                      {time && <span className="shrink-0 text-xs text-muted-foreground">{time}</span>}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{conv.ad_title}</p>
                    {conv.last_message && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{conv.last_message}</p>
                    )}
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
