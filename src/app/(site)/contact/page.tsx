import { getContact } from '@/lib/reader'
import Masthead from '@/components/Masthead'

export const metadata = { title: 'Contact' }

type SocialKey = 'twitter' | 'github' | 'linkedin' | 'bluesky' | 'mastodon'

const SOCIAL_LABELS: Record<SocialKey, string> = {
  twitter: 'Twitter',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  bluesky: 'Bluesky',
  mastodon: 'Mastodon',
}

export default async function ContactPage() {
  const contact = await getContact()
  if (!contact) {
    return (
      <div>
        <Masthead title="Contact" />
      </div>
    )
  }

  const social = contact.social as Record<SocialKey, string | null>
  const visibleSocial = (Object.keys(SOCIAL_LABELS) as SocialKey[])
    .filter((key) => social[key])
    .map((key) => ({ key, label: SOCIAL_LABELS[key], url: social[key]! }))

  return (
    <article>
      <Masthead title="Contact" />

      <div className="grid grid-cols-12 gap-8 lg:gap-16">
        <div className="col-span-12 lg:col-span-8 space-y-14 sm:space-y-16">
          {contact.email && (
            <div>
              <p className="label-strong text-[color:var(--color-accent)] mb-4">
                Email
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="display-lg text-2xl sm:text-4xl lg:text-5xl text-[color:var(--color-ink)] hover:text-[color:var(--color-accent-dark)] transition-colors duration-300 inline-block break-all link-underline decoration-[color:var(--color-accent-light)] underline-offset-[6px] decoration-2"
              >
                {contact.email}
              </a>
            </div>
          )}

          {contact.address && (
            <div>
              <p className="label-strong text-[color:var(--color-accent)] mb-4">
                Address
              </p>
              <p className="text-xl sm:text-2xl text-[color:var(--color-ink-2)] whitespace-pre-wrap leading-snug tracking-tight">
                {contact.address}
              </p>
            </div>
          )}

          {visibleSocial.length > 0 && (
            <div>
              <p className="label-strong text-[color:var(--color-accent)] mb-4">
                Elsewhere
              </p>
              <ul className="space-y-2">
                {visibleSocial.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-[color:var(--color-ink-2)] link-underline inline-flex items-center gap-1.5"
                    >
                      {s.label}
                      <span className="text-[color:var(--color-accent)]" aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {contact.mapEmbed && (
          <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
            <iframe
              src={contact.mapEmbed}
              className="w-full h-80 border border-[color:var(--color-line)]"
              loading="lazy"
              title="Map"
            />
          </div>
        )}
      </div>
    </article>
  )
}
