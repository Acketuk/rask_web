"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function MessageSellerButton({ adId }: { adId: string }) {
  const { isLoggedIn, accessToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isLoggedIn) { router.push("/sign-in"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/v1/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ad_id: adId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? "Could not start conversation");
        return;
      }
      const conv = await res.json();
      router.push(`/chats/${conv.id}`);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold transition hover:bg-muted disabled:opacity-60"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <MessageSquare className="size-4" />}
      {loading ? "Opening chat…" : "Message seller"}
    </button>
  );
}
