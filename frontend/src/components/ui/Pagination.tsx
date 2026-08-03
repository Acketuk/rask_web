import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  hasMore: boolean;
  prevHref: string;
  nextHref: string;
  total?: number;
  perPage?: number;
};

export default function Pagination({ page, hasMore, prevHref, nextHref, total, perPage = 25 }: Props) {
  const totalPages = total ? Math.ceil(total / perPage) : null;

  return (
    <div className="flex items-center justify-between pt-6">
      <Link
        href={prevHref}
        aria-disabled={page <= 1}
        className={`inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition-all
          ${page <= 1 ? "pointer-events-none opacity-30" : "hover:border-primary/30 hover:text-primary"}`}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Link>

      <span className="text-sm text-muted-foreground">
        Page{" "}
        <span className="font-black text-foreground">{page}</span>
        {totalPages && (
          <> of <span className="font-black text-foreground">{totalPages}</span></>
        )}
      </span>

      <Link
        href={nextHref}
        aria-disabled={!hasMore}
        className={`inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition-all
          ${!hasMore ? "pointer-events-none opacity-30" : "hover:border-primary/30 hover:text-primary"}`}
      >
        Next
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
