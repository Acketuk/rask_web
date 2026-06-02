"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isLoggedIn) {
    return (
      <Link
        href="/sign-in"
        className="flex size-9 items-center justify-center rounded-full border border-border transition hover:bg-muted"
        aria-label="Sign in"
      >
        <User className="size-4" />
      </Link>
    );
  }

  const initials = user!.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 rounded-full border border-border pl-1.5 pr-2.5 py-1 transition hover:bg-muted"
      >
        <div className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {initials}
        </div>
        <span className="hidden text-sm font-medium sm:block">{user!.name.split(" ")[0]}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="border-b border-border px-3 py-2.5">
            <p className="text-xs font-semibold">{user!.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user!.email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm transition hover:bg-muted"
          >
            <LayoutDashboard className="size-3.5" />
            My Profile
          </Link>
          <button
            onClick={async () => { setOpen(false); await logout(); router.push("/"); }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-destructive transition hover:bg-muted"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
