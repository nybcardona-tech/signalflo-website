import { motion } from "motion/react"

const beams = [
  "M-20 220 C 160 80, 300 320, 520 160 S 860 80, 1040 240",
  "M-40 380 C 180 230, 340 480, 560 300 S 880 210, 1100 420",
  "M120 20 C 260 160, 420 20, 560 190 S 820 360, 980 140",
]

export function BackgroundBeams() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
      viewBox="0 0 1100 620"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="beam-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="45%" stopColor="var(--color-primary)" />
          <stop offset="70%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {beams.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          fill="none"
          stroke="url(#beam-gradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0.15, 0.7, 0.25] }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  )
}
