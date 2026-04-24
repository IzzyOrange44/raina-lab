import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getMember, getRoleLabel } from '@/lib/reader'

type Links = {
  scholar?: string | null
  github?: string | null
  website?: string | null
  twitter?: string | null
  linkedin?: string | null
  orcid?: string | null
}

const SOCIAL_PLATFORMS: Array<{ key: keyof Links; label: string }> = [
  { key: 'scholar', label: 'Scholar' },
  { key: 'github', label: 'GitHub' },
  { key: 'website', label: 'Website' },
  { key: 'twitter', label: 'Twitter' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'orcid', label: 'ORCID' },
]

export default async function MemberPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const member = await getMember(slug)
  if (!member) notFound()

  const roleLabel = await getRoleLabel(member.role)
  const links = (member.links ?? {}) as Links
  const visibleLinks = SOCIAL_PLATFORMS.filter((p) => links[p.key])

  return (
    <article>
      <Link
        href="/people"
        className="label hover:text-[color:var(--color-ink)] transition-colors inline-block mb-10"
      >
        ← People
      </Link>

      <header className="grid grid-cols-12 gap-6 lg:gap-10 mb-14 sm:mb-20 pb-10 border-b border-[color:var(--color-line)]">
        <div className="col-span-12 sm:col-span-5 md:col-span-4 lg:col-span-3">
          <div className="aspect-[3/4] bg-[color:var(--color-surface)] border border-[color:var(--color-line)] overflow-hidden">
            {member.photo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={member.photo}
                alt={member.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <span
                  className="h-3 w-3 rounded-full bg-[color:var(--color-accent)] opacity-40"
                  aria-hidden
                />
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 sm:col-span-7 md:col-span-8 lg:col-span-9 flex flex-col justify-end">
          {roleLabel && (
            <p className="label-strong text-[color:var(--color-accent)] mb-4">
              {roleLabel}
            </p>
          )}
          <h1 className="display-xl text-[clamp(2.5rem,7vw,5rem)] text-balance">
            {member.name}
          </h1>
          {member.shortBio && (
            <p className="text-xl sm:text-2xl text-[color:var(--color-ink-3)] mt-5 max-w-[40rem] leading-[1.4]">
              {member.shortBio}
            </p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 lg:gap-12">
        <aside className="col-span-12 lg:col-span-3 lg:sticky lg:top-32 lg:self-start space-y-8">
          {member.email && (
            <div>
              <p className="label mb-2">Email</p>
              <a
                href={`mailto:${member.email}`}
                className="text-[color:var(--color-ink-2)] link-underline break-all"
              >
                {member.email}
              </a>
            </div>
          )}

          {visibleLinks.length > 0 && (
            <div>
              <p className="label mb-2">Links</p>
              <ul className="space-y-1.5">
                {visibleLinks.map((p) => (
                  <li key={p.key}>
                    <a
                      href={links[p.key]!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color:var(--color-ink-2)] link-underline inline-flex items-center gap-1.5"
                    >
                      {p.label}
                      <span
                        className="text-[color:var(--color-accent)]"
                        aria-hidden
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <div className="col-span-12 lg:col-span-9">
          {member.fullBio && (
            <div className="prose prose-sleek max-w-none">
              <RichText data={member.fullBio} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
