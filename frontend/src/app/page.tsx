import { cacheLife } from "next/cache";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AdCard, { type Ad } from "@/components/ui/AdCard";
import CategoryGrid from "@/components/ui/CategoryGrid";
import SearchInput from "@/components/ui/SearchInput";

async function fetchAds(): Promise<Ad[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/ads?limit=6`);
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const ads = await fetchAds();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="relative -mx-4 -mt-8 overflow-hidden px-6 py-20 text-white"
        style={{ background: "linear-gradient(135deg, oklch(0.42 0.22 270) 0%, oklch(0.35 0.20 290) 100%)" }}
      >
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-300">
            Lithuania&apos;s Service Marketplace
          </p>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Find the perfect<br />service for you
          </h1>
          <p className="mt-4 text-lg text-indigo-200">
            Thousands of professionals ready to help — from web design to home repairs.
          </p>

          <div className="mt-8 mx-auto max-w-xl">
            <SearchInput
              placeholder="What service are you looking for?"
              className="shadow-2xl"
            />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
            <span className="text-indigo-300">Popular:</span>
            {["Web Development", "Photography", "Cleaning", "Tutoring", "Legal"].map((tag) => (
              <Link
                key={tag}
                href={`/ads?q=${encodeURIComponent(tag)}`}
                className="rounded-full bg-white/10 px-3 py-0.5 text-indigo-100 transition hover:bg-white/20"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-14">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Browse by Category</h2>
          <Link
            href="/ads"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            All categories <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <CategoryGrid />
      </section>

      {/* Featured Services */}
      <section className="mt-14">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured Services</h2>
          <Link
            href="/ads"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-border text-sm text-muted-foreground">
            No services yet
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="mt-14 mb-6 rounded-3xl bg-secondary p-10 text-center">
        <h2 className="text-2xl font-bold">Offer your services on Rask</h2>
        <p className="mt-2 text-muted-foreground">
          Reach thousands of customers across Lithuania. Free to post.
        </p>
        <Link
          href="/ads/post"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Post a Service <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
