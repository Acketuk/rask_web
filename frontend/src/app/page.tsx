import CategoryGrid from "@/components/ui/CategoryGrid";
import AdsStrip from "@/components/ui/AdsStrip";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8">
      <CategoryGrid />
      <AdsStrip />
    </div>
  );
}
