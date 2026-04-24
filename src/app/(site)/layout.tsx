import Link from 'next/link'
import Nav from '@/components/Nav'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
          <nav aria-label="Primary" className="hidden md:block">
            <Nav />
          </nav>
        </div>
        <div className="md:hidden border-t border-[color:var(--color-line)] px-5 py-3 overflow-x-auto">
          <Nav />
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
              href="/keystatic"
              className="hover:text-[color:var(--color-ink)] transition-colors"
            >
              Edit
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
