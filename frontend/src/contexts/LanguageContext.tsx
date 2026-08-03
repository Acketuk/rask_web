"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Lang, type Translations, translations } from "@/lib/i18n";

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const LanguageContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("rask_lang");
    if (saved === "lt" || saved === "ru" || saved === "en") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    localStorage.setItem("rask_lang", l);
    setLangState(l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
