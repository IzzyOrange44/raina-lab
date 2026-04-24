import { getContact } from '@/lib/reader'
import Masthead from '@/components/Masthead'
import Reveal from '@/components/Reveal'
import CopyEmail from '@/components/CopyEmail'

export const metadata = { title: 'Contact' }

type SocialKey = 'twitter' | 'github' | 'linkedin' | 'bluesky' | 'mastodon'

const SOCIAL_LABELS: Record<SocialKey, string> = {
  twitter: 'Twitter',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  bluesky: 'Bluesky',
  mastodon: 'Mastodon',
}

function mailtoAddress(address: string, email?: string | null) {
  const subject = encodeURIComponent('Raina Lab enquiry')
  const body = encodeURIComponent(
    `Hello Dr. Raina,\n\n\n\n—\nSent from rainalab.vercel.app`,
  )
  return email ? `mailto:${email}?subject=${subject}&body=${body}` : undefined
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

  const social = (contact.social ?? {}) as Record<
    SocialKey,
    string | null | undefined
  >
  const visibleSocial = (Object.keys(SOCIAL_LABELS) as SocialKey[])
    .filter((key) => social[key])
    .map((key) => ({ key, label: SOCIAL_LABELS[key], url: social[key]! }))

  return (
    <article className="relative">
      {/* Subtle dot grid — same family as the home hero */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-line-strong) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          WebkitMaskImage:
            'radial-gradient(ellipse at 70% 20%, black 20%, transparent 70%)',
          maskImage:
            'radial-gradient(ellipse at 70% 20%, black 20%, transparent 70%)',
        }}
      />

      <Masthead title="Contact" />

      <div className="grid grid-cols-12 gap-10 lg:gap-16">
        <div className="col-span-12 lg:col-span-7 space-y-16">
          {contact.email && (
            <Reveal>
              <div>
                <p className="label-strong text-[color:var(--color-accent)] mb-5">
                  /01 Email
                </p>
                <CopyEmail email={contact.email} />
                <div className="mt-6">
                  <a
                    href={
                      mailtoAddress(contact.address ?? '', contact.email) ??
                      undefined
                    }
                    className="inline-flex items-center gap-2.5 rounded-full border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-[color:var(--color-canvas)] px-5 py-2.5 text-sm font-medium hover:bg-[color:var(--color-accent-dark)] hover:border-[color:var(--color-accent-dark)] transition-colors"
                  >
                    Write a message
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </Reveal>
          )}

          {contact.address && (
            <Reveal delay={0.1}>
              <div>
                <p className="label-strong text-[color:var(--color-accent)] mb-5">
                  /02 Address
                </p>
                <address className="not-italic text-xl sm:text-2xl text-[color:var(--color-ink-2)] whitespace-pre-wrap leading-[1.5] tracking-tight">
                  {contact.address}
                </address>
              </div>
            </Reveal>
          )}

          {visibleSocial.length > 0 && (
            <Reveal delay={0.15}>
              <div>
                <p className="label-strong text-[color:var(--color-accent)] mb-5">
                  /03 Elsewhere
                </p>
                <ul className="flex flex-wrap gap-3">
                  {visibleSocial.map((s) => (
                    <li key={s.key}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] hover:border-[color:var(--color-ink)] hover:text-[color:var(--color-ink)] text-[color:var(--color-ink-2)] px-4 py-2 text-sm font-medium transition-colors"
                      >
                        {s.label}
                        <span
                          aria-hidden
                          className="text-[color:var(--color-accent)]"
                        >
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal
          delay={0.2}
          className="col-span-12 lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
        >
          {contact.mapEmbed ? (
            <iframe
              src={contact.mapEmbed}
              className="w-full h-[28rem] border border-[color:var(--color-line)] rounded-lg"
              loading="lazy"
              title="Map"
            />
          ) : (
            <aside className="border border-[color:var(--color-line)] rounded-xl p-8 bg-[color:var(--color-surface)]">
              <p className="label-strong text-[color:var(--color-accent)] mb-4">
                Get in touch
              </p>
              <p className="text-lg text-[color:var(--color-ink-2)] leading-[1.55]">
                Send us an email — we welcome notes from prospective
                researchers, collaborators, and curious readers. We aim to
                respond within a few days.
              </p>
              <div className="mt-6 pt-6 border-t border-[color:var(--color-line)] flex flex-col gap-2 label">
                <span>
                  <span className="text-[color:var(--color-accent)]">→</span>{' '}
                  Prospective PhD students
                </span>
                <span>
                  <span className="text-[color:var(--color-accent)]">→</span>{' '}
                  Postdoctoral researchers
                </span>
                <span>
                  <span className="text-[color:var(--color-accent)]">→</span>{' '}
                  Undergraduate researchers at Syracuse
                </span>
                <span>
                  <span className="text-[color:var(--color-accent)]">→</span>{' '}
                  Collaborators and visiting scientists
                </span>
              </div>
            </aside>
          )}
        </Reveal>
      </div>
    </article>
  )
}
