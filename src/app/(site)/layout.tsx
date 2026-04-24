import type { Metadata } from 'next'
import Link from 'next/link'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import '../globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Raina Lab',
    template: '%s · Raina Lab',
  },
  description: 'The Raina laboratory.',
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="min-h-full flex flex-col">
          <header className="sticky top-0 z-20 bg-[color:var(--color-canvas)]/80 backdrop-blur-lg border-b border-[color:var(--color-line)]">
            <div className="max-w-[82rem] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-6 h-16 sm:h-18">
              <Link
                href="/"
                aria-label="Raina Lab — home"
                className="group flex items-center gap-2.5 shrink-0"
              >
                <span
                  className="h-[18px] w-[18px] rounded-full bg-[color:var(--color-accent)] transition-all duration-500 group-hover:bg-[color:var(--color-accent-dark)] group-hover:scale-90"
                  aria-hidden
                />
                <span className="display-md text-[1.15rem] sm:text-[1.25rem] tracking-[-0.02em] font-medium">
                  Raina Lab
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-8">
                <nav aria-label="Primary">
                  <Nav />
                </nav>
                <Link
                  href="/admin"
                  className="label-strong border border-[color:var(--color-line)] hover:border-[color:var(--color-ink)] hover:text-[color:var(--color-ink)] text-[color:var(--color-ink-3)] px-3 py-1.5 rounded-full transition-colors"
                >
                  Admin
                </Link>
              </div>
            </div>
            <div className="md:hidden border-t border-[color:var(--color-line)] px-5 py-3 flex items-center justify-between gap-4">
              <div className="overflow-x-auto">
                <Nav />
              </div>
              <Link
                href="/admin"
                className="label-strong border border-[color:var(--color-line)] hover:border-[color:var(--color-ink)] text-[color:var(--color-ink-3)] px-3 py-1.5 rounded-full shrink-0"
              >
                Admin
              </Link>
            </div>
          </header>

          <main className="relative z-10 flex-1 max-w-[82rem] mx-auto w-full px-5 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-28">
            {children}
          </main>

          <footer className="relative z-10 border-t border-[color:var(--color-line)] mt-16 sm:mt-24">
            <div className="max-w-[82rem] mx-auto px-5 sm:px-8 lg:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-[14px] w-[14px] rounded-full bg-[color:var(--color-accent)]"
                  aria-hidden
                />
                <span className="display-md text-[0.95rem] font-medium">
                  Raina Lab
                </span>
              </div>
              <div className="flex items-center gap-6 label">
                <span className="tabular">© {new Date().getFullYear()}</span>
                <Link
                  href="/contact"
                  className="hover:text-[color:var(--color-ink)] transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/admin"
                  className="hover:text-[color:var(--color-ink)] transition-colors"
                >
                  Admin
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
