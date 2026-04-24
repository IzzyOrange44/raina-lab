import { RichText } from '@payloadcms/richtext-lexical/react'
import { getAbout } from '@/lib/reader'
import Masthead from '@/components/Masthead'

export const metadata = { title: 'About' }

export default async function AboutPage() {
  const about = await getAbout()

  return (
    <article>
      <Masthead title="About" />

      <div className="grid grid-cols-12 gap-8 lg:gap-16">
        <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-10">
          {about?.mission && (
            <div>
              <p className="label-strong text-[color:var(--color-accent)] mb-3">
                Mission
              </p>
              <p className="text-xl text-[color:var(--color-ink-2)] leading-snug tracking-tight">
                {about.mission}
              </p>
            </div>
          )}
          {about?.affiliation && (
            <div>
              <p className="label-strong text-[color:var(--color-accent)] mb-3">
                Affiliation
              </p>
              <p className="text-[color:var(--color-ink-2)]">
                {about.affiliation}
              </p>
            </div>
          )}
        </aside>

        <div className="col-span-12 lg:col-span-8">
          {about?.body && (
            <div className="prose prose-sleek max-w-none">
              <RichText data={about.body} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
