"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

export type Ad = {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: { Time: string; Valid: boolean } | null;
  category_id: string;
  user_id: string;
  attributes: { location?: string; provider?: string; delivery?: string; availability?: string; image?: string } | null;
};

const GRADIENTS: Record<string, string> = {
  "019e0ed4-e692-7d25-8095-114e3985b50b": "linear-gradient(135deg,#1e1b4b,#312e81)",
  "019e0ed4-e692-7d3a-bf74-fbb96566e1de": "linear-gradient(135deg,#1a0533,#4c1d95)",
  "019e0ed4-e692-7d04-8925-6a0aab350b5d": "linear-gradient(135deg,#500724,#9d174d)",
  "019e0ed4-e692-7ca9-82fd-e02ce5452121": "linear-gradient(135deg,#042f2e,#115e59)",
  "019e0ed4-e692-7d5c-8620-8c3802bfb293": "linear-gradient(135deg,#0c0a09,#292524)",
  "019e0ed4-e692-7d2f-9dd4-5f08d03de4b8": "linear-gradient(135deg,#450a0a,#7f1d1d)",
  "019e0ed4-e692-7cd9-8740-19d78979e463": "linear-gradient(135deg,#422006,#78350f)",
};
const FALLBACK = "linear-gradient(135deg,#1c1917,#292524)";

function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function AdCard({ ad }: { ad: Ad }) {
  const gradient  = GRADIENTS[ad.category_id] ?? FALLBACK;
  const provider  = ad.attributes?.provider;
  const location  = ad.attributes?.location ?? "Lithuania";
  const image     = ad.attributes?.image;

  const title       = useAutoTranslate(ad.title);
  const description = useAutoTranslate(ad.description);

  return (
    <Link
      href={`/ads/${ad.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-[0_1px_4px_rgb(0_0_0/0.06),0_4px_16px_rgb(0_0_0/0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_24px_rgb(0_0_0/0.12)]"
    >
      {/* Image */}
      <div
        className="relative aspect-4/3 w-full overflow-hidden"
        style={{ background: gradient }}
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={ad.title}
            className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        <div className="absolute right-3 top-3">
          <FavoriteButton adId={ad.id} />
        </div>
        {/* Price on image */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-lg bg-primary px-2.5 py-1 text-sm font-black text-primary-foreground">
            {ad.price.toLocaleString()} €
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground flex-1">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div
              className="flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
              style={{ background: gradient }}
            >
              {initials(provider)}
            </div>
            <span className="max-w-24 truncate font-medium">{provider ?? "Provider"}</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {location}
          </span>
        </div>
      </div>
    </Link>
  );
}
