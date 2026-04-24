'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

type Props = {
  email: string
}

export default function CopyEmail({ email }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3">
      <a
        href={`mailto:${email}`}
        className="display-lg text-2xl sm:text-4xl lg:text-5xl text-[color:var(--color-ink)] hover:text-[color:var(--color-accent-dark)] transition-colors duration-300 break-all link-underline decoration-[color:var(--color-accent-light)] underline-offset-[6px] decoration-2"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="relative label-strong border border-[color:var(--color-line)] hover:border-[color:var(--color-ink)] text-[color:var(--color-ink-3)] hover:text-[color:var(--color-ink)] px-3 py-1.5 rounded-full transition-colors"
        aria-label="Copy email to clipboard"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1.5 text-[color:var(--color-accent-dark)]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]"
                aria-hidden
              />
              Copied
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              Copy
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
