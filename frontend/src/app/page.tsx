import { cacheLife } from "next/cache";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AdCard, { type Ad } from "@/components/ui/AdCard";
import CategoryGrid from "@/components/ui/CategoryGrid";
import HeroSection from "@/components/ui/HeroSection";
import CtaBanner from "@/components/ui/CtaBanner";

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
      <HeroSection />

      {/* Categories */}
      <section className="mt-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Categories</p>
            <h2 className="text-2xl font-black tracking-tight">Browse by Category</h2>
          </div>
          <Link href="/ads" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4">
            All <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <CategoryGrid />
      </section>

      {/* Featured */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Handpicked</p>
            <h2 className="text-2xl font-black tracking-tight">Featured Services</h2>
          </div>
          <Link href="/ads" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="flex h-52 items-center justify-center rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground">
            No services yet
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
          </div>
        )}
      </section>

      <CtaBanner />
    </div>
  );
}
