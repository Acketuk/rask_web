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
      className="relative flex size-9 items-center justify-center rounded-full border border-border transition hover:bg-muted"
      aria-label="Saved services"
    >
      <Heart className="size-4" />
      {mounted && label && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold leading-none text-white">
          {label}
        </span>
      )}
    </Link>
  );
}
