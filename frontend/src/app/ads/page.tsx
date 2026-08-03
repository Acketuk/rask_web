import { cacheLife } from "next/cache";
import BrowsePageContent from "@/components/ui/BrowsePageContent";

type Category = { id: string; name: string; level: number; parent_id: string | null };

async function fetchCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/categories`);
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}

async function fetchAdCount(): Promise<number> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/ads/count`);
    if (!res.ok) return 0;
    const data = await res.json();
    return typeof data?.count === "number" ? data.count : 0;
  } catch {
    return 0;
  }
}

export default async function AdsPage() {
  const [categories, adCount] = await Promise.all([fetchCategories(), fetchAdCount()]);
  return <BrowsePageContent categories={categories} adCount={adCount} />;
}
