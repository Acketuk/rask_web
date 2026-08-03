import Link from "next/link";
import { Search } from "lucide-react";
import AdCard, { type Ad } from "@/components/ui/AdCard";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";

const PER_PAGE = 25;

async function searchAds(q: string, page: number): Promise<Ad[]> {
  const offset = (page - 1) * PER_PAGE;
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/v1/ads/search?q=${encodeURIComponent(q)}&limit=${PER_PAGE}&offset=${offset}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page  = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const ads   = query ? await searchAds(query, page) : [];

  const hasMore  = ads.length === PER_PAGE;
  const baseHref = `/search?q=${encodeURIComponent(query)}`;
  const prevHref = page > 1 ? `${baseHref}&page=${page - 1}` : baseHref;
  const nextHref = `${baseHref}&page=${page + 1}`;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">Search</span>
        </nav>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black">
            {query ? (
              <>
                Results for{" "}
                <span className="text-primary">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "Search services"
            )}
          </h1>
          {query && ads.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Page {page} · {ads.length} result{ads.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="max-w-xl">
          <SearchInput placeholder="Refine your search…" initialValue={query} />
        </div>
      </div>

      {/* Results */}
      {!query ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border text-muted-foreground">
          <Search className="size-8 opacity-40" />
          <p className="text-sm">Type something above to search</p>
        </div>
      ) : ads.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border text-muted-foreground">
          <Search className="size-8 opacity-40" />
          <p className="text-sm font-medium">
            {page > 1 ? "No more results." : `No results for "${query}"`}
          </p>
          {page === 1 && (
            <p className="text-xs">
              Try different keywords or{" "}
              <Link href="/ads" className="text-primary hover:underline">browse categories</Link>
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>

          {(page > 1 || hasMore) && (
            <Pagination
              page={page}
              hasMore={hasMore}
              prevHref={prevHref}
              nextHref={nextHref}
            />
          )}
        </div>
      )}
    </div>
  );
}
