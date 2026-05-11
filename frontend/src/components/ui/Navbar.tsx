import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Rask
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
