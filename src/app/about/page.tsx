import { DocumentRenderer } from '@keystatic/core/renderer'
import { getAbout } from '@/lib/reader'

export const metadata = { title: 'About' }

export default async function AboutPage() {
  const about = await getAbout()
  if (!about) return <div>About content not found.</div>

  const body = await about.body()

  return (
    <article>
      <h1 className="text-4xl font-bold tracking-tight">About the Lab</h1>
      {about.mission && (
        <p className="mt-4 text-lg text-neutral-700">{about.mission}</p>
      )}
      {about.affiliation && (
        <p className="mt-1 text-neutral-500">{about.affiliation}</p>
      )}
      <div className="prose prose-neutral mt-8 max-w-none">
        <DocumentRenderer document={body} />
      </div>
    </article>
  )
}
