"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translate } from "@/lib/translator";

export function useAutoTranslate(text: string): string {
  const { lang } = useLanguage();
  const [value, setValue] = useState(text);

  useEffect(() => {
    if (lang === "en" || !text) {
      setValue(text);
      return;
    }
    let cancelled = false;
    translate(text, lang).then((v) => {
      if (!cancelled) setValue(v);
    });
    return () => {
      cancelled = true;
    };
  }, [text, lang]);

  return value;
}
