import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function AnimatedGradientText({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "animate-gradient bg-[linear-gradient(110deg,var(--color-primary),var(--color-accent),var(--color-chart-4),var(--color-primary))] bg-[length:300%_100%] bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  )
}
