"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CtaBanner() {
  const { t } = useLanguage();

  return (
    <section className="mt-20 mb-8 overflow-hidden rounded-2xl bg-primary p-10 sm:p-14">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/60 mb-3">
            For professionals
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-primary-foreground leading-tight">
            {t.ctaTitle}
          </h2>
          <p className="mt-3 text-primary-foreground/70 max-w-md">
            {t.ctaSub}
          </p>
        </div>
        <Link
          href="/ads/post"
          className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-white/90 active:scale-95"
        >
          {t.ctaButton}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
