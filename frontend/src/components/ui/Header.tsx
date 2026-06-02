import Link from "next/link";
import { PlusCircle } from "lucide-react";
import Logo from "@/components/ui/Logo";
import SearchInput from "@/components/ui/SearchInput";
import FavoritesLink from "@/components/ui/FavoritesLink";
import UserMenu from "@/components/ui/UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
        <Link href="/" aria-label="Rask home" className="shrink-0">
          <Logo />
        </Link>

        <div className="mx-4 hidden w-full max-w-lg md:block">
          <SearchInput />
        </div>

        <nav className="ml-auto flex shrink-0 items-center gap-3">
          <Link
            href="/ads/post"
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:flex"
          >
            <PlusCircle className="size-4" />
            Post a Service
          </Link>

          <FavoritesLink />

          <UserMenu />
        </nav>
      </div>

      <div className="border-t border-border px-6 py-2.5 md:hidden">
        <SearchInput />
      </div>
    </header>
  );
}
