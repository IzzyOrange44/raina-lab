import Link from 'next/link'
import { getPosts, getTag } from '@/lib/reader'

export const metadata = { title: 'News' }

export default async function NewsPage() {
  const posts = await getPosts()
  const withTags = await Promise.all(
    posts.map(async (p) => ({ ...p, tagData: await getTag(p.tag) })),
  )

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight mb-8">News</h1>
      {withTags.length === 0 ? (
        <p className="text-neutral-500">No posts yet.</p>
      ) : (
        <ul className="space-y-6">
          {withTags.map((p) => (
            <li key={p.slug}>
              <Link href={`/news/${p.slug}`} className="group block">
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  {p.publishedDate && <time>{p.publishedDate}</time>}
                  {p.tagData && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{
                        background: p.tagData.color || '#6b7280',
                      }}
                    >
                      {p.tagData.label}
                    </span>
                  )}
                </div>
                <h2 className="mt-1 text-xl font-semibold group-hover:underline">
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className="mt-1 text-neutral-700">{p.excerpt}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
