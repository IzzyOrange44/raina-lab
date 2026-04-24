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
    <article>
      <Link href="/news" className="text-sm text-neutral-500 hover:underline">
        ← News
      </Link>
      <header className="mt-6">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          {post.publishedDate && <time>{post.publishedDate}</time>}
          {tag && (
            <span
              className="px-2 py-0.5 rounded text-xs font-medium text-white"
              style={{ background: tag.color || '#6b7280' }}
            >
              {tag.label}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{post.title}</h1>
        {post.excerpt && (
          <p className="mt-3 text-lg text-neutral-700">{post.excerpt}</p>
        )}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            className="mt-6 w-full rounded-lg object-cover"
          />
        )}
      </header>
      <div className="prose prose-neutral mt-8 max-w-none">
        <DocumentRenderer document={body} />
      </div>
    </article>
  )
}
