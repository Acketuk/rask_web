"use client";

import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";
import AdCard, { type Ad } from "@/components/ui/AdCard";
import Pagination from "@/components/ui/Pagination";
import { CATEGORY_ICONS, CATEGORY_GRADIENTS, FALLBACK_GRADIENT } from "@/lib/categoryMeta";
import { useLanguage } from "@/contexts/LanguageContext";

type Category = { id: string; name: string; level: number; parent_id: string | null };

type Props = {
  currentCategory: Category | undefined;
  subCategories: Category[];
  ads: Ad[];
  page: number;
  hasMore: boolean;
  prevHref: string;
  nextHref: string;
  gradient: string;
};

export default function CategoryPageContent({
  currentCategory, subCategories, ads, page, hasMore, prevHref, nextHref, gradient,
}: Props) {
  const { t } = useLanguage();
  const catName = currentCategory
    ? (t.categoryNames[currentCategory.name] ?? currentCategory.name)
    : t.category;

  return (
    <div className="flex flex-col gap-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/ads" className="font-medium hover:text-primary transition-colors">{t.browse}</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-semibold text-foreground">{catName}</span>
      </nav>

      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl px-10 py-12 min-h-40"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-black/20 to-transparent" />
        <div className="relative flex flex-col gap-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">{t.category}</p>
          <h1 className="text-4xl font-black tracking-tight text-white">{catName}</h1>
        </div>
      </div>

      {/* Sub-categories */}
      {subCategories.length > 0 && (
        <section>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{t.subCategories}</p>
          <div className="flex flex-wrap gap-2">
            {subCategories.map((sub) => {
              const Icon    = CATEGORY_ICONS[sub.name] ?? LayoutGrid;
              const grad    = CATEGORY_GRADIENTS[sub.name] ?? gradient;
              const subName = t.categoryNames[sub.name] ?? sub.name;
              return (
                <Link
                  key={sub.id}
                  href={`/ads/category/${sub.id}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:text-primary hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(0_0_0/0.08)]"
                >
                  <span
                    className="flex size-5 items-center justify-center rounded-md text-white"
                    style={{ background: grad }}
                  >
                    <Icon className="size-3" />
                  </span>
                  {subName}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Ads */}
      <section className="flex flex-col gap-6">
        {subCategories.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Services</p>
            <h2 className="text-xl font-black tracking-tight">{t.allServicesIn} {catName}</h2>
          </div>
        )}
        {ads.length === 0 ? (
          <div className="flex h-52 items-center justify-center rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground">
            {page > 1 ? t.noMoreServices : t.noServicesInCategory}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
          </div>
        )}
        {(page > 1 || hasMore) && (
          <Pagination page={page} hasMore={hasMore} prevHref={prevHref} nextHref={nextHref} />
        )}
      </section>
    </div>
  );
}
