"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, isLoggedIn, logout } = useAuth();
  const { t } = useLanguage();
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
        className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
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
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 transition-all hover:border-primary/30"
      >
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-[10px] font-black text-primary-foreground">
          {initials}
        </div>
        <span className="hidden text-sm font-semibold sm:block">{user!.name.split(" ")[0]}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_32px_rgb(0_0_0/0.12)]">
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs font-bold text-foreground">{user!.name}</p>
            <p className="truncate text-xs text-muted-foreground mt-0.5">{user!.email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <LayoutDashboard className="size-4 text-muted-foreground" />
            {t.myProfile}
          </Link>
          <button
            onClick={async () => { setOpen(false); await logout(); router.push("/"); }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-muted"
          >
            <LogOut className="size-4" />
            {t.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
