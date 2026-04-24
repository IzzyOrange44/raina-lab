import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: 'Raina Lab',
    template: '%s — Raina Lab',
  },
  description: 'Research group led by Dr. Raina.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <header className="border-b border-neutral-200">
          <Nav />
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
          {children}
        </main>

        <footer className="border-t border-neutral-200 py-6 text-sm text-neutral-500">
          <div className="max-w-5xl mx-auto px-6 flex justify-between">
            <span>© {new Date().getFullYear()} Raina Lab</span>
            <Link href="/keystatic" className="hover:text-neutral-900">
              Admin
            </Link>
          </div>
        </footer>
      </body>
    </html>
  )
}
