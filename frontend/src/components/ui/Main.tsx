

export default function Main({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      {children}
    </main>
  );
}
