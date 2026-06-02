"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoriteButton({ adId }: { adId: string }) {
  const { toggle, isFavorite, mounted } = useFavorites();

  if (!mounted) return null;

  const saved = isFavorite(adId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(adId);
      }}
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      className={`flex size-8 items-center justify-center rounded-full shadow-sm transition-all duration-150 ${
        saved
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white/90 text-muted-foreground hover:text-red-500 hover:bg-white"
      }`}
    >
      <Heart className={`size-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
