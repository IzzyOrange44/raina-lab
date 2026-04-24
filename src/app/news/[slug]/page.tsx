import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DocumentRenderer } from '@keystatic/core/renderer'
import { getPost, getTag } from '@/lib/reader'

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const tag = await getTag(post.tag)
  const body = await post.body()

  return (
    <article className="max-w-[44rem] mx-auto">
      <Link
        href="/news"
        className="label hover:text-[color:var(--color-ink)] transition-colors inline-block mb-10"
      >
        ← News
      </Link>

      <header className="mb-14 pb-10 border-b border-[color:var(--color-line)]">
        {(post.publishedDate || tag) && (
          <div className="flex items-center gap-4 label tabular mb-8">
            {post.publishedDate && <time>{post.publishedDate}</time>}
            {post.publishedDate && tag && (
              <span className="h-1 w-1 rounded-full bg-[color:var(--color-ink-4)]" aria-hidden />
            )}
            {tag && (
              <span
                className="label-strong"
                style={{ color: tag.color || 'var(--color-accent)' }}
              >
                {tag.label}
              </span>
            )}
          </div>
        )}

        <h1 className="display-xl text-[clamp(2.5rem,6vw,4rem)] text-balance">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl sm:text-2xl text-[color:var(--color-ink-3)] mt-6 leading-[1.45]">
            {post.excerpt}
          </p>
        )}

        {post.coverImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.coverImage}
            alt=""
            className="mt-10 w-full border border-[color:var(--color-line)]"
          />
        )}
      </header>

      <div className="prose prose-sleek max-w-none">
        <DocumentRenderer document={body} />
      </div>
    </article>
  )
}
