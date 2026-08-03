"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesLink() {
  const { ids, mounted } = useFavorites();
  const count = ids.size;
  const label = count > 9 ? "9+" : count > 0 ? String(count) : null;

  return (
    <Link
      href="/favorites"
      className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
      aria-label="Saved services"
    >
      <Heart className="size-4" />
      {mounted && label && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground">
          {label}
        </span>
      )}
    </Link>
  );
}
