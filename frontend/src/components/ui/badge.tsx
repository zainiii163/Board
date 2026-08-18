export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent ${className}`}
    >
      {children}
    </span>
  );
}
