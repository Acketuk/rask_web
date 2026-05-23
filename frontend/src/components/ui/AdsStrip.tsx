import { cacheLife } from "next/cache";
import Link from "next/link";
import Animate from "@/components/ui/Animate";

type Ad = {
  id: string;
  title: string;
  price: number;
  created_at: { Time: string; Valid: boolean } | null;
  category_id: string;
  user_id: string;
};

const gradients = [
  "from-blue-200 via-indigo-100 to-violet-200",
  "from-amber-200 via-orange-100 to-rose-200",
  "from-emerald-200 via-teal-100 to-cyan-200",
  "from-rose-200 via-pink-100 to-fuchsia-200",
  "from-violet-200 via-purple-100 to-indigo-200",
  "from-sky-200 via-blue-100 to-indigo-200",
  "from-lime-200 via-green-100 to-emerald-200",
];

function gradient(id: string) {
  const n = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return gradients[n % gradients.length];
}

function formatPrice(price: number) {
  return price.toLocaleString("pl-PL") + " zł";
}

function formatDate(created_at: Ad["created_at"]) {
  if (!created_at?.Valid) return null;
  return new Date(created_at.Time).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function fetchAds(): Promise<Ad[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/ads?limit=20`);
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}

export default async function AdsStrip() {
  const ads = await fetchAds();
  if (ads.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Latest offers</h2>
        <Link href="/ads" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          See all
        </Link>
      </div>

      <Animate stagger y={20} staggerDelay={0.06} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {ads.map((ad) => {
          const date = formatDate(ad.created_at);
          return (
            <Link
              key={ad.id}
              href={`/ads/${ad.id}`}
              className="group flex w-52 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-md"
            >
              <div className={`h-40 w-full bg-gradient-to-br ${gradient(ad.id)}`} />
              <div className="flex flex-1 flex-col gap-1 p-3">
                <h3 className="line-clamp-2 text-sm font-medium leading-snug group-hover:underline group-hover:underline-offset-2">
                  {ad.title}
                </h3>
                {date && (
                  <p className="text-xs text-muted-foreground">{date}</p>
                )}
              </div>
              <div className="border-t border-border px-3 py-2.5">
                <span className="text-sm font-semibold">{formatPrice(ad.price)}</span>
              </div>
            </Link>
          );
        })}
      </Animate>
    </section>
  );
}
