"use client";

import Link from "next/link";
import { MapPin, Clock, CalendarDays, ChevronRight, Tag } from "lucide-react";
import FavoriteButton from "@/components/ui/FavoriteButton";
import MessageSellerButton from "@/components/ui/MessageSellerButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

type Ad = {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: { Time: string; Valid: boolean } | null;
  category_id: string;
  user_id: string;
  attributes: { location?: string; provider?: string; delivery?: string; availability?: string; image?: string } | null;
};

type Category = { id: string; name: string; level: number; parent_id: string | null };

function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function AdDetailContent({
  ad, category, parent, gradient, date,
}: {
  ad: Ad;
  category: Category | undefined;
  parent: Category | undefined;
  gradient: string;
  date: string | null;
}) {
  const { t } = useLanguage();
  const title       = useAutoTranslate(ad.title);
  const description = useAutoTranslate(ad.description);
  const catName     = category ? (t.categoryNames[category.name] ?? category.name) : undefined;
  const parentName  = parent   ? (t.categoryNames[parent.name]   ?? parent.name)   : undefined;
  const { location, provider, delivery, availability, image } = ad.attributes ?? {};

  return (
    <div className="mx-auto max-w-4xl">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/ads" className="font-medium hover:text-primary transition-colors">{t.browse}</Link>
        {parent && parentName && (
          <>
            <ChevronRight className="size-3.5" />
            <Link href={`/ads/category/${parent.id}`} className="hover:text-primary transition-colors">{parentName}</Link>
          </>
        )}
        {category && catName && (
          <>
            <ChevronRight className="size-3.5" />
            <Link href={`/ads/category/${category.id}`} className="hover:text-primary transition-colors">{catName}</Link>
          </>
        )}
        <ChevronRight className="size-3.5" />
        <span className="truncate font-semibold text-foreground max-w-48">{title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Main */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* Image */}
          <div
            className="relative aspect-video w-full overflow-hidden rounded-2xl"
            style={{ background: gradient }}
          >
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={ad.title} className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute right-4 top-4">
              <FavoriteButton adId={ad.id} />
            </div>
          </div>

          {/* Title block */}
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-black tracking-tight leading-tight">{title}</h1>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {location && (
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="size-3.5 shrink-0 text-primary" /> {location}
                </span>
              )}
              {delivery && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="size-3.5 shrink-0 text-primary" /> {delivery}
                </span>
              )}
              {availability && (
                <span className="flex items-center gap-1.5 font-medium">
                  <CalendarDays className="size-3.5 shrink-0 text-primary" /> {availability}
                </span>
              )}
              {category && catName && (
                <Link
                  href={`/ads/category/${category.id}`}
                  className="flex items-center gap-1.5 font-semibold text-primary hover:underline underline-offset-4"
                >
                  <Tag className="size-3.5 shrink-0" /> {catName}
                </Link>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{t.aboutService}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {description}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">

          {/* Price card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{t.startingPrice}</p>
            <p className="text-4xl font-black text-primary">{ad.price.toLocaleString()} €</p>

            <button className="mt-5 w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]">
              {t.contactProvider}
            </button>
            <MessageSellerButton adId={ad.id} />
          </div>

          {/* Provider */}
          {provider && (
            <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                style={{ background: gradient }}
              >
                {initials(provider)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{provider}</p>
                <p className="text-xs text-muted-foreground">{t.serviceProvider}</p>
              </div>
            </div>
          )}

          {date && (
            <p className="px-1 text-xs text-muted-foreground">
              <span className="font-semibold">{t.posted}:</span> {date}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
