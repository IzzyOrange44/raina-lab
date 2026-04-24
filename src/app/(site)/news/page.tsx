import Link from 'next/link'
import { getPosts, getTag } from '@/lib/reader'
import Masthead from '@/components/Masthead'

export const metadata = { title: 'News' }

function formatDate(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function NewsPage() {
  const posts = await getPosts()
  const withTags = await Promise.all(
    posts.map(async (p) => ({ ...p, tagData: await getTag(p.tag) })),
  )

  return (
    <article>
      <Masthead title="News" />

      {withTags.length === 0 ? (
        <div className="flex items-center justify-center py-24 opacity-40">
          <span
            className="h-3 w-3 rounded-full bg-[color:var(--color-accent)]"
            aria-hidden
          />
        </div>
      ) : (
        <ul className="divide-y divide-[color:var(--color-line)]">
          {withTags.map((p) => (
            <li key={p.id}>
              <Link
                href={`/news/${p.slug}`}
                className="group grid grid-cols-12 gap-3 sm:gap-6 py-8 sm:py-10 -mx-3 sm:-mx-5 px-3 sm:px-5 hover:bg-[color:var(--color-surface)] transition-colors"
              >
                <div className="col-span-12 sm:col-span-3 lg:col-span-2 flex flex-col gap-1.5 pt-1">
                  {p.publishedDate && (
                    <time className="label tabular">
                      {formatDate(p.publishedDate)}
                    </time>
                  )}
                  {p.tagData && (
                    <span
                      className="label-strong"
                      style={{
                        color: p.tagData.color || 'var(--color-accent)',
                      }}
                    >
                      {p.tagData.label}
                    </span>
                  )}
                </div>

                <div className="col-span-12 sm:col-span-9 lg:col-span-9">
                  <h2 className="display-md text-xl sm:text-2xl lg:text-3xl text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-dark)] transition-colors duration-300 leading-tight text-balance">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="text-[color:var(--color-ink-3)] mt-3 leading-relaxed max-w-[44rem]">
                      {p.excerpt}
                    </p>
                  )}
                </div>

                {p.coverImage && (
                  <div className="hidden lg:block lg:col-span-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.coverImage}
                      alt=""
                      className="w-full aspect-square object-cover border border-[color:var(--color-line)]"
                    />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
