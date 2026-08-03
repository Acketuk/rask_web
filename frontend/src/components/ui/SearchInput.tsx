"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Result = {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: string;
};

export default function SearchInput({
  placeholder = "Search for a service…",
  className = "",
  initialValue = "",
}: {
  placeholder?: string;
  className?: string;
  initialValue?: string;
}) {
  const router = useRouter();
  const [query, setQuery]     = useState(initialValue);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 2) { setResults([]); setOpen(false); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/v1/ads/search?q=${encodeURIComponent(trimmed)}&limit=6`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3.5 shadow-[0_2px_16px_rgb(0_0_0/0.06)] transition-shadow focus-within:shadow-[0_4px_24px_rgb(0_0_0/0.10)] focus-within:border-primary/30">
          {loading
            ? <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
            : <Search className="size-4 shrink-0 text-muted-foreground" />
          }
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_40px_rgb(0_0_0/0.14)]">
          {results.length === 0 ? (
            <p className="px-5 py-4 text-sm text-muted-foreground">No results found</p>
          ) : (
            <>
              <ul className="divide-y divide-border">
                {results.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/ads/${r.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{r.title}</p>
                        <p className="truncate text-xs text-muted-foreground mt-0.5">{r.description}</p>
                      </div>
                      <span className="shrink-0 text-sm font-black text-primary">
                        {r.price.toLocaleString()} €
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-t border-border px-5 py-3 text-xs font-semibold text-primary transition-colors hover:bg-muted"
              >
                See all results for &ldquo;{query.trim()}&rdquo;
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
