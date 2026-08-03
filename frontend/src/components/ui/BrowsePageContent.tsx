"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { CATEGORY_ICONS, CATEGORY_GRADIENTS, FALLBACK_GRADIENT } from "@/lib/categoryMeta";
import { useLanguage } from "@/contexts/LanguageContext";

type Category = { id: string; name: string; level: number; parent_id: string | null };

export default function BrowsePageContent({ categories, adCount }: { categories: Category[]; adCount: number }) {
  const { t } = useLanguage();

  const roots  = categories.filter((c) => c.parent_id === null);
  const subMap = new Map<string, Category[]>();
  for (const cat of categories) {
    if (cat.parent_id) {
      const arr = subMap.get(cat.parent_id) ?? [];
      arr.push(cat);
      subMap.set(cat.parent_id, arr);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Marketplace</p>
        <h1 className="text-3xl font-black tracking-tight">{t.browseByCategory}</h1>
        <p className="mt-2 text-muted-foreground">
          {adCount > 0
            ? `${adCount.toLocaleString()} services across ${roots.length} categories`
            : "Choose a category to explore services"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {roots.map((cat) => {
          const Icon    = CATEGORY_ICONS[cat.name] ?? LayoutGrid;
          const grad    = CATEGORY_GRADIENTS[cat.name] ?? FALLBACK_GRADIENT;
          const subs    = subMap.get(cat.id) ?? [];
          const shown   = subs.slice(0, 3);
          const extra   = subs.length - shown.length;
          const catName = t.categoryNames[cat.name] ?? cat.name;

          return (
            <Link
              key={cat.id}
              href={`/ads/category/${cat.id}`}
              className="group overflow-hidden rounded-xl shadow-[0_2px_12px_rgb(0_0_0/0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgb(0_0_0/0.16)]"
            >
              <div
                className="relative flex aspect-4/3 w-full flex-col justify-between p-5"
                style={{ background: grad }}
              >
                <div className="flex justify-end">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur-sm">
                    <Icon className="size-4" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm font-black leading-tight text-white">{catName}</p>
                  {shown.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {shown.map((s) => (
                        <span key={s.id} className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                          {t.categoryNames[s.name] ?? s.name}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white">
                          +{extra}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
