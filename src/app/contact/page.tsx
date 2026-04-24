import { getContact } from '@/lib/reader'

export const metadata = { title: 'Contact' }

type SocialKey = 'twitter' | 'github' | 'linkedin' | 'bluesky' | 'mastodon'

const SOCIAL_LABELS: Record<SocialKey, string> = {
  twitter: 'Twitter / X',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  bluesky: 'Bluesky',
  mastodon: 'Mastodon',
}

export default async function ContactPage() {
  const contact = await getContact()
  if (!contact) return <div>Contact info not set.</div>

  const social = contact.social as Record<SocialKey, string | null>
  const visibleSocial = (Object.keys(SOCIAL_LABELS) as SocialKey[])
    .filter((key) => social[key])
    .map((key) => ({ key, label: SOCIAL_LABELS[key], url: social[key]! }))

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight mb-8">Contact</h1>
      <div className="space-y-6 text-neutral-800">
        {contact.email && (
          <div>
            <div className="text-sm text-neutral-500">Email</div>
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 hover:underline"
            >
              {contact.email}
            </a>
          </div>
        )}
        {contact.address && (
          <div>
            <div className="text-sm text-neutral-500">Address</div>
            <p className="whitespace-pre-wrap">{contact.address}</p>
          </div>
        )}
        {visibleSocial.length > 0 && (
          <div>
            <div className="text-sm text-neutral-500 mb-2">Follow us</div>
            <ul className="flex flex-wrap gap-3">
              {visibleSocial.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {contact.mapEmbed && (
          <div>
            <iframe
              src={contact.mapEmbed}
              className="w-full h-80 rounded border-0"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  )
}
