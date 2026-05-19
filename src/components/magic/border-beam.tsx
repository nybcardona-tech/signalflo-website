import { cn } from "@/lib/utils"

export function BorderBeam({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 animate-beam rounded-[inherit] p-px",
        "before:absolute before:inset-[-1px] before:rounded-[inherit] before:bg-[conic-gradient(from_var(--beam-angle),transparent_0deg,var(--color-primary)_70deg,var(--color-accent)_120deg,transparent_180deg)] before:opacity-80",
        "after:absolute after:inset-px after:rounded-[inherit] after:bg-background",
        className,
      )}
    />
  )
}
