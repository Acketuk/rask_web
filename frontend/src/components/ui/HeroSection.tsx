"use client";

import Link from "next/link";
import SearchInput from "@/components/ui/SearchInput";
import { useLanguage } from "@/contexts/LanguageContext";

const POPULAR_TAGS = ["Web Development", "Photography", "Cleaning", "Tutoring", "Legal"];

export default function HeroSection() {
  const { t } = useLanguage();
  const titleLines = t.heroTitle.split("\n");

  return (
    <section className="relative -mx-4 -mt-8 px-6 py-24 sm:py-32">
      <div className="relative mx-auto max-w-3xl text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-8">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          {t.tagline}
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-7xl leading-[0.95]">
          {titleLines[0]}
          {titleLines[1] && (
            <>
              <br />
              <span className="text-primary">{titleLines[1]}</span>
            </>
          )}
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {t.heroSub}
        </p>

        {/* Search */}
        <div className="mt-10 mx-auto max-w-2xl">
          <SearchInput placeholder={t.searchPlaceholder} />
        </div>

        {/* Popular tags */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t.popular}
          </span>
          {POPULAR_TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
