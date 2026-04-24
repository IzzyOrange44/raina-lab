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
    <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link
        href="/"
        className="font-semibold text-lg tracking-tight hover:text-neutral-600 transition-colors"
      >
        Raina Lab
      </Link>
      <ul className="flex gap-6 text-sm">
        {links.map((l) => {
          const active =
            pathname === l.href ||
            (l.href !== '/' && pathname.startsWith(l.href))
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={
                  active
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-600 hover:text-neutral-900 transition-colors'
                }
              >
                {l.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
