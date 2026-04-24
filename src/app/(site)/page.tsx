import Link from 'next/link'
import {
  getHome,
  getLatestPosts,
  getFeaturedResearchAreas,
  getTag,
} from '@/lib/reader'
import HeroTitle from '@/components/HeroTitle'
import HeroField from '@/components/HeroField'
import Reveal from '@/components/Reveal'

export default async function HomePage() {
  const home = await getHome()
  const posts = await getLatestPosts(4)
  const featured = await getFeaturedResearchAreas()

  const postsWithTags = await Promise.all(
    posts.map(async (p) => ({ ...p, tagData: await getTag(p.tag) })),
  )

  return (
    <div className="space-y-28 sm:space-y-36">
      {/* HERO — massive wordmark with animated emerald field */}
      <section className="relative -mx-5 sm:-mx-8 lg:-mx-12 px-5 sm:px-8 lg:px-12 min-h-[68vh] flex flex-col justify-center pt-4 lg:pt-6 isolate">
        <HeroField />

        <div className="relative z-10 max-w-[82rem] mx-auto w-full">
          <HeroTitle
            text="Raina Lab"
            className="display-xl font-medium text-[clamp(3.75rem,13vw,11rem)] leading-[0.9] tracking-[-0.045em] text-balance"
          />

          {home?.tagline && (
            <Reveal delay={0.35} y={14}>
              <p className="mt-8 sm:mt-10 text-2xl sm:text-3xl lg:text-[2.25rem] text-[color:var(--color-ink-2)] max-w-[40rem] leading-[1.25] tracking-[-0.015em] font-medium">
                {home.tagline}
              </p>
            </Reveal>
          )}

          {home?.intro && (
            <Reveal delay={0.5} y={12}>
              <p className="mt-6 text-lg sm:text-xl text-[color:var(--color-ink-3)] leading-[1.5] max-w-[36rem]">
                {home.intro}
              </p>
            </Reveal>
          )}

          {(featured.length > 0 || postsWithTags.length > 0) && (
            <Reveal delay={0.65}>
              <div className="mt-12 flex items-center gap-4">
                <Link
                  href={featured.length > 0 ? '/research' : '/news'}
                  className="group inline-flex items-center gap-3 rounded-full border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-[color:var(--color-canvas)] px-6 py-3 text-sm font-medium hover:bg-[color:var(--color-accent-dark)] hover:border-[color:var(--color-accent-dark)] transition-colors"
                >
                  {featured.length > 0
                    ? 'Explore the research'
                    : 'Latest news'}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-[color:var(--color-ink-2)] link-reveal relative"
                >
                  About the lab
                </Link>
              </div>
            </Reveal>
          )}

          {/* Tiny scroll cue */}
          <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 label animate-pulse">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]"
              aria-hidden
            />
            Scroll
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section>
          <Reveal>
            <div className="flex items-baseline justify-between gap-4 mb-12 sm:mb-16 pb-5 border-b border-[color:var(--color-line)]">
              <span className="label-strong text-[color:var(--color-accent)]">
                / Research
              </span>
              <Link
                href="/research"
                className="label hover:text-[color:var(--color-ink)] transition-colors"
              >
                All areas →
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-10 sm:gap-14 lg:gap-16 md:grid-cols-2">
            {featured.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.08}>
                <Link
                  href={`/research#${r.slug}`}
                  className="group block transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="label-strong text-[color:var(--color-accent)] tabular">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 h-px bg-[color:var(--color-line)]" />
                  </div>
                  <h3 className="display-md text-2xl sm:text-3xl text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-dark)] transition-colors duration-300">
                    {r.title}
                  </h3>
                  {r.shortDescription && (
                    <p className="text-[1.0625rem] text-[color:var(--color-ink-3)] mt-4 leading-relaxed max-w-[36rem]">
                      {r.shortDescription}
                    </p>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {home?.heroImage && (
        <Reveal className="relative -mx-5 sm:-mx-8 lg:-mx-12 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={home.heroImage}
            alt=""
            className="w-full aspect-[21/9] object-cover"
          />
        </Reveal>
      )}

      {postsWithTags.length > 0 && (
        <section>
          <Reveal>
            <div className="flex items-baseline justify-between gap-4 mb-12 sm:mb-16 pb-5 border-b border-[color:var(--color-line)]">
              <span className="label-strong text-[color:var(--color-accent)]">
                / Latest
              </span>
              <Link
                href="/news"
                className="label hover:text-[color:var(--color-ink)] transition-colors"
              >
                All news →
              </Link>
            </div>
          </Reveal>

          <ul className="divide-y divide-[color:var(--color-line)]">
            {postsWithTags.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.06}>
                <Link
                  href={`/news/${p.slug}`}
                  className="group grid grid-cols-12 gap-4 sm:gap-6 py-7 sm:py-8 -mx-3 sm:-mx-5 px-3 sm:px-5 hover:bg-[color:var(--color-surface)] transition-colors"
                >
                  <div className="col-span-12 sm:col-span-3 lg:col-span-2 flex flex-col gap-1.5 pt-1">
                    {p.publishedDate && (
                      <time className="label tabular">
                        {new Date(p.publishedDate).toLocaleDateString(
                          'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' },
                        )}
                      </time>
                    )}
                    {p.tagData && (
                      <span
                        className="label"
                        style={{
                          color: p.tagData.color || 'var(--color-accent)',
                        }}
                      >
                        {p.tagData.label}
                      </span>
                    )}
                  </div>
                  <div className="col-span-12 sm:col-span-9 lg:col-span-10">
                    <h3 className="display-md text-xl sm:text-2xl text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-dark)] transition-colors duration-300 leading-tight text-balance">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="text-[color:var(--color-ink-3)] mt-2 leading-relaxed max-w-[50rem]">
                        {p.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {featured.length === 0 && postsWithTags.length === 0 && (
        <section className="flex items-center justify-center py-24 opacity-40">
          <span
            className="h-3 w-3 rounded-full bg-[color:var(--color-accent)]"
            aria-hidden
          />
        </section>
      )}
    </div>
  )
}
