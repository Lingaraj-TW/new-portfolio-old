export function LiveDemoChip({ className = "" }: { className?: string }) {
  return (
    <p
      className={`inline-flex rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent ${className}`}
    >
      Live demo — concept by Linga Raj M
    </p>
  );
}
