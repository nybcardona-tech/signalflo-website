import { useEffect, useState } from "react"

export function NumberTicker({
  value,
  suffix = "",
}: {
  value: number
  suffix?: string
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let frame = 0
    const frames = 40
    const interval = window.setInterval(() => {
      frame += 1
      setCurrent(Math.round((value * frame) / frames))
      if (frame === frames) {
        window.clearInterval(interval)
      }
    }, 24)

    return () => window.clearInterval(interval)
  }, [value])

  return (
    <span>
      {current.toLocaleString()}
      {suffix}
    </span>
  )
}
