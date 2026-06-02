import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import FavoriteButton from "@/components/ui/FavoriteButton";

export type Ad = {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: { Time: string; Valid: boolean } | null;
  category_id: string;
  user_id: string;
  attributes: { location?: string; provider?: string; delivery?: string; availability?: string } | null;
};

// ─── Per-category gradients ───────────────────────────────────────────────

const GRADIENTS: Record<string, string> = {
  "019e0ed4-e692-7d25-8095-114e3985b50b": "linear-gradient(135deg,#4f46e5,#3730a3)",
  "019e0ed4-e692-7d3a-bf74-fbb96566e1de": "linear-gradient(135deg,#7c3aed,#4c1d95)",
  "019e0ed4-e692-7d04-8925-6a0aab350b5d": "linear-gradient(135deg,#ec4899,#9d174d)",
  "019e0ed4-e692-7ca9-82fd-e02ce5452121": "linear-gradient(135deg,#0d9488,#0c4a6e)",
  "019e0ed4-e692-7d5c-8620-8c3802bfb293": "linear-gradient(135deg,#334155,#020617)",
  "019e0ed4-e692-7d2f-9dd4-5f08d03de4b8": "linear-gradient(135deg,#f43f5e,#7c3aed)",
  "019e0ed4-e692-7cd9-8740-19d78979e463": "linear-gradient(135deg,#d97706,#7c2d12)",
};

// ─── Helpers ──────────────────────────────────────────────────────────────

function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────

const FALLBACK_GRADIENT = "linear-gradient(135deg,#6b7280,#1f2937)";

export default function AdCard({ ad }: { ad: Ad }) {
  const gradient = GRADIENTS[ad.category_id] ?? FALLBACK_GRADIENT;
  const provider = ad.attributes?.provider;
  const location = ad.attributes?.location ?? "Lithuania";
  const delivery = ad.attributes?.delivery;

  return (
    <Link
      href={`/ads/${ad.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-16/10 w-full" style={{ background: gradient }}>
        <div className="absolute right-2.5 top-2.5">
          <FavoriteButton adId={ad.id} />
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {ad.title}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {ad.description}
        </p>

        <div className="mt-auto flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span>{location}</span>
          {delivery && (
            <>
              <span className="mx-0.5 opacity-40">·</span>
              <Clock className="size-3 shrink-0" />
              <span>{delivery}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <div
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: gradient }}
            >
              {initials(provider)}
            </div>
            <span className="max-w-28 truncate text-xs font-medium text-muted-foreground">
              {provider ?? "Provider"}
            </span>
          </div>
          <p className="text-base font-black text-foreground">
            {ad.price.toLocaleString()} €
          </p>
        </div>
      </div>
    </Link>
  );
}
