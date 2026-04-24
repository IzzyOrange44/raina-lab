'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

/** Subtle parallax fade on the hero — moves slightly up and fades as the
   user scrolls past it. Respects prefers-reduced-motion. */
export default function HeroParallax({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1, reduce ? 1 : 0.5],
  )

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  )
}
