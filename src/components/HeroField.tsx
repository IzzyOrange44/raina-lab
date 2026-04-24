'use client'

import { motion, useReducedMotion } from 'motion/react'

/** Soft animated emerald orbs behind the hero. Subtle, not flashy. */
export default function HeroField() {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-[18%] left-[8%] w-[520px] h-[520px] rounded-full bg-[color:var(--color-accent)]/25 blur-[110px]" />
        <div className="absolute bottom-[8%] right-[4%] w-[420px] h-[420px] rounded-full bg-[color:var(--color-accent-light)]/20 blur-[100px]" />
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <motion.div
        className="absolute w-[560px] h-[560px] rounded-full bg-[color:var(--color-accent)]/25 blur-[120px]"
        style={{ top: '12%', left: '6%' }}
        animate={{
          x: [0, 60, -20, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[440px] h-[440px] rounded-full bg-[color:var(--color-accent-light)]/22 blur-[110px]"
        style={{ bottom: '6%', right: '4%' }}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.94, 1.1, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[320px] h-[320px] rounded-full bg-[color:var(--color-accent-dark)]/18 blur-[100px]"
        style={{ top: '45%', left: '40%' }}
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
