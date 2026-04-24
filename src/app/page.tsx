import Link from 'next/link'
import {
  getHome,
  getLatestPosts,
  getFeaturedResearchAreas,
} from '@/lib/reader'

export default async function HomePage() {
  const home = await getHome()
  const posts = await getLatestPosts(3)
  const featured = await getFeaturedResearchAreas()

  return (
    <div className="space-y-20">
      <section className="pt-8 pb-4 max-w-3xl">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-balance">
          {home?.tagline ?? 'The Raina Lab'}
        </h1>
        {home?.intro && (
          <p className="mt-6 text-xl text-neutral-600 leading-relaxed">
            {home.intro}
          </p>
        )}
      </section>

      {featured.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Research</h2>
            <Link
              href="/research"
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              All areas →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((r) => (
              <Link
                key={r.slug}
                href={`/research#${r.slug}`}
                className="block group rounded-lg border border-neutral-200 p-5 hover:border-neutral-400 transition-colors"
              >
                <h3 className="font-semibold group-hover:underline">
                  {r.title}
                </h3>
                {r.shortDescription && (
                  <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                    {r.shortDescription}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Latest news</h2>
            <Link
              href="/news"
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              All news →
            </Link>
          </div>
          <ul className="divide-y divide-neutral-200">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/news/${p.slug}`}
                  className="group block py-4 -mx-2 px-2 rounded hover:bg-neutral-50 transition-colors"
                >
                  <div className="text-sm text-neutral-500">
                    {p.publishedDate}
                  </div>
                  <div className="mt-1 font-medium group-hover:underline">
                    {p.title}
                  </div>
                  {p.excerpt && (
                    <p className="text-sm text-neutral-600 mt-1">
                      {p.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
