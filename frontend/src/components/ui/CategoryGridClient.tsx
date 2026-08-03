"use client";

import Link from "next/link";
import {
  Briefcase, Camera, Sparkles, Home, Zap, ShoppingBag, Car,
  BookOpen, Dumbbell, Wrench, Armchair, Baby, PawPrint, Palette,
  UtensilsCrossed, Music, Building2, Gamepad2, Plane, LayoutGrid,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Category = { id: string; name: string; level: number; parent_id: string | null };

const ICON_MAP: Record<string, React.ElementType> = {
  "Jobs & Services":     Briefcase,
  "Photography & Video": Camera,
  "Health & Beauty":     Sparkles,
  "Real Estate":         Home,
  "Electronics":         Zap,
  "Clothing & Apparel":  ShoppingBag,
  "Vehicles":            Car,
  "Books & Education":   BookOpen,
  "Sports & Outdoors":   Dumbbell,
  "Garden & Tools":      Wrench,
  "Furniture":           Armchair,
  "Baby & Kids":         Baby,
  "Pets & Animals":      PawPrint,
  "Art & Collectibles":  Palette,
  "Food & Beverages":    UtensilsCrossed,
  "Music & Instruments": Music,
  "Office & Business":   Building2,
  "Toys & Games":        Gamepad2,
  "Travel & Experiences":Plane,
  "Other":               LayoutGrid,
};

// Semantic color pairings — icon bg + icon color
const ACCENTS = [
  { bg: "bg-indigo-100",  text: "text-indigo-700"  },
  { bg: "bg-violet-100",  text: "text-violet-700"  },
  { bg: "bg-sky-100",     text: "text-sky-700"     },
  { bg: "bg-teal-100",    text: "text-teal-700"    },
  { bg: "bg-rose-100",    text: "text-rose-700"    },
  { bg: "bg-amber-100",   text: "text-amber-700"   },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-700" },
] as const;

export default function CategoryGridClient({
  categories,
  compact = false,
}: {
  categories: Category[];
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const roots = categories.filter((c) => c.parent_id === null);

  // Count sub-categories per root
  const subCount = new Map<string, number>();
  for (const c of categories) {
    if (c.parent_id) subCount.set(c.parent_id, (subCount.get(c.parent_id) ?? 0) + 1);
  }

  if (roots.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {roots.map((cat) => (
          <Link
            key={cat.id}
            href={`/ads/category/${cat.id}`}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            {t.categoryNames[cat.name] ?? cat.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {roots.map((cat, i) => {
        const Icon    = ICON_MAP[cat.name] ?? LayoutGrid;
        const accent  = ACCENTS[i % ACCENTS.length];
        const subs    = subCount.get(cat.id) ?? 0;
        const catName = t.categoryNames[cat.name] ?? cat.name;

        return (
          <Link
            key={cat.id}
            href={`/ads/category/${cat.id}`}
            className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-3 py-6 text-center shadow-[0_1px_3px_rgb(0_0_0/0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_6px_24px_rgb(0_0_0/0.08)]"
          >
            {/* Icon container */}
            <div className={`flex size-12 items-center justify-center rounded-xl ${accent.bg} transition-transform duration-200 group-hover:scale-110`}>
              <Icon className={`size-5 ${accent.text}`} />
            </div>

            {/* Name */}
            <p className="text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
              {catName}
            </p>

            {/* Sub-category count */}
            {subs > 0 && (
              <p className="text-xs text-muted-foreground">
                {subs} {subs === 1 ? "type" : "types"}
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
