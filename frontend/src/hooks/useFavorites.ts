"use client";

import { useState, useEffect, useCallback } from "react";

const KEY = "rask_favorites";

export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setIds(new Set(JSON.parse(stored) as string[]));
    } catch {}
    setMounted(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem(KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => ids.has(id), [ids]);

  return { ids, toggle, isFavorite, mounted };
}
