"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import AdCard, { type Ad } from "@/components/ui/AdCard";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { ids, mounted } = useFavorites();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;

    if (ids.size === 0) {
      setAds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      [...ids].map((id) =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ads/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      setAds(results.filter(Boolean) as Ad[]);
      setLoading(false);
    });
  }, [ids, mounted]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Saved Services</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mounted && !loading
            ? ads.length > 0
              ? `${ads.length} saved service${ads.length !== 1 ? "s" : ""}`
              : "No saved services yet"
            : "Loading…"}
        </p>
      </div>

      {mounted && !loading && ads.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border py-20 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Heart className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">Nothing saved yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap the heart on any service card to save it here.
            </p>
          </div>
          <Link
            href="/ads"
            className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Browse Services
          </Link>
        </div>
      )}

      {ads.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
