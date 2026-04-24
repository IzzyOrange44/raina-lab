'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode, type ElementType } from 'react'

type Props = {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  as?: 'div' | 'section' | 'header' | 'li' | 'article'
  className?: string
  once?: boolean
}

export default function Reveal({
  children,
  delay = 0,
  y = 14,
  duration = 0.7,
  as = 'div',
  className,
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: '-80px 0px -80px 0px',
  })
  const reduce = useReducedMotion()

  const MotionTag = motion[as] as ElementType

  return (
    <MotionTag
      ref={ref}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0.7, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
