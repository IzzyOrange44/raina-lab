'use client'

import { motion, useReducedMotion } from 'motion/react'

type Props = {
  text: string
  className?: string
}

/** Splits text into words and reveals them one by one for a gentle hero entrance. */
export default function HeroTitle({ text, className }: Props) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pr-[0.25em] last:pr-0 align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={reduce ? { y: 0 } : { y: '110%' }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.9,
              delay: reduce ? 0 : i * 0.08,
              ease: [0.2, 0.7, 0.2, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}
