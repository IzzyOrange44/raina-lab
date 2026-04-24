'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/about', label: 'About' },
  { href: '/research', label: 'Research' },
  { href: '/people', label: 'People' },
  { href: '/alumni', label: 'Alumni' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <ul className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm tracking-tight">
      {links.map((l) => {
        const active =
          pathname === l.href ||
          (l.href !== '/' && pathname.startsWith(l.href))
        return (
          <li key={l.href} className="relative">
            {active && (
              <span
                aria-hidden
                className="absolute -left-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]"
              />
            )}
            <Link
              href={l.href}
              className={
                active
                  ? 'text-[color:var(--color-ink)] font-medium'
                  : 'text-[color:var(--color-ink-3)] hover:text-[color:var(--color-ink)] transition-colors font-medium'
              }
            >
              {l.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
