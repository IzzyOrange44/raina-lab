import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DocumentRenderer } from '@keystatic/core/renderer'
import { getMember, getRoleLabel } from '@/lib/reader'

type Links = {
  scholar: string | null
  github: string | null
  website: string | null
  twitter: string | null
  linkedin: string | null
  orcid: string | null
}

const SOCIAL_PLATFORMS: Array<{ key: keyof Links; label: string }> = [
  { key: 'scholar', label: 'Google Scholar' },
  { key: 'github', label: 'GitHub' },
  { key: 'website', label: 'Website' },
  { key: 'twitter', label: 'Twitter / X' },
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
  const bio = await member.fullBio()
  const links = member.links as Links
  const visibleLinks = SOCIAL_PLATFORMS.filter((p) => links[p.key])

  return (
    <article>
      <Link href="/people" className="text-sm text-neutral-500 hover:underline">
        ← People
      </Link>
      <div className="mt-6 flex flex-col sm:flex-row gap-6 items-start">
        {member.photo && (
          <img
            src={member.photo}
            alt={member.name}
            className="w-40 h-40 rounded-lg object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{member.name}</h1>
          <div className="text-neutral-500">{roleLabel}</div>
          {member.shortBio && (
            <p className="mt-2 text-neutral-700">{member.shortBio}</p>
          )}
          {member.email && (
            <div className="mt-2 text-sm">
              <a
                href={`mailto:${member.email}`}
                className="text-blue-600 hover:underline"
              >
                {member.email}
              </a>
            </div>
          )}
          {visibleLinks.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-3 text-sm">
              {visibleLinks.map((p) => (
                <li key={p.key}>
                  <a
                    href={links[p.key]!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="prose prose-neutral mt-8 max-w-none">
        <DocumentRenderer document={bio} />
      </div>
    </article>
  )
}
