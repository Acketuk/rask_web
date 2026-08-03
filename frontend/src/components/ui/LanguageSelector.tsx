"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { LANGS, type Lang } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

const FLAG: Record<Lang, string> = { en: "🇬🇧", lt: "🇱🇹", ru: "🇷🇺" };

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-foreground transition-all hover:border-primary/30"
        aria-label="Language"
      >
        <span className="text-sm leading-none">{FLAG[lang]}</span>
        <span className="hidden sm:inline">{lang.toUpperCase()}</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_32px_rgb(0_0_0/0.12)] z-50">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => { setLang(code as Lang); setOpen(false); }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted ${lang === code ? "font-bold text-primary" : "font-medium text-foreground"}`}
            >
              <span className="text-base leading-none">{FLAG[code as Lang]}</span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
