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
        "heading-accent animate-gradient bg-[length:300%_100%]",
        className,
      )}
    >
      {children}
    </span>
  )
}
