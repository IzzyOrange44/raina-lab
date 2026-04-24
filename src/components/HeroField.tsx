'use client'

import { motion, useReducedMotion } from 'motion/react'

/** Subtle technical-feel backdrop: a faint dotted grid plus one quiet
 *  emerald "spill" drifting at the corner. No banner-block vibe. */
export default function HeroField() {
  const reduce = useReducedMotion()

  return (
    <>
      {/* Dotted grid — barely there, masks to avoid hard edges */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-line-strong) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          WebkitMaskImage:
            'radial-gradient(ellipse at 30% 40%, black 30%, transparent 80%)',
          maskImage:
            'radial-gradient(ellipse at 30% 40%, black 30%, transparent 80%)',
        }}
      />

      {/* One soft emerald spill, pushed mostly off-canvas so it reads as
         ambient light rather than a contained shape. */}
      <motion.div
        aria-hidden
        className="absolute -top-[20%] -right-[15%] w-[700px] h-[700px] rounded-full bg-[color:var(--color-accent)]/18 blur-[140px]"
        animate={
          reduce
            ? undefined
            : { x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.05, 1] }
        }
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}
