import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { User } from "lucide-react"


export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border">
      <div className="relative mx-auto flex h-20 max-w-6xl items-center px-4">
        <Link href="/" aria-label="Rask home" className="absolute left-1/2 -translate-x-1/2">
          <Logo />
        </Link>
        <Link
          href="/sign-in"
          aria-label="Account"
          className="ml-auto rounded-full p-2 transition-colors hover:bg-muted"
        >
          <User className="size-5" />
        </Link>
      </div>
    </header>
  );
}
