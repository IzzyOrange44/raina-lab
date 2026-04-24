import Link from 'next/link'
import {
  getHome,
  getLatestPosts,
  getFeaturedResearchAreas,
  getTag,
} from '@/lib/reader'
import HeroTitle from '@/components/HeroTitle'
import HeroParallax from '@/components/HeroParallax'
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
      <HeroParallax>
        <section className="relative min-h-[58vh] lg:min-h-[68vh] flex flex-col justify-center pt-4 lg:pt-8">
          <Reveal as="div" className="flex items-center gap-3 mb-8 sm:mb-10">
            <span
              className="h-2 w-2 rounded-full bg-[color:var(--color-accent)]"
              aria-hidden
            />
            <span className="label-strong">Raina Lab</span>
          </Reveal>

          {home?.tagline && (
            <HeroTitle
              text={home.tagline}
              className="display-xl text-[clamp(2.75rem,10vw,9.5rem)] text-balance max-w-[18ch]"
            />
          )}

          {home?.intro && (
            <Reveal delay={0.3} y={12}>
              <p className="text-xl sm:text-2xl lg:text-[1.65rem] text-[color:var(--color-ink-3)] mt-8 leading-[1.4] max-w-[44rem]">
                {home.intro}
              </p>
            </Reveal>
          )}

          {(featured.length > 0 || postsWithTags.length > 0) && (
            <Reveal delay={0.5}>
              <div className="mt-14">
                <Link
                  href={featured.length > 0 ? '/research' : '/news'}
                  className="group inline-flex items-center gap-3 text-sm font-medium text-[color:var(--color-ink)]"
                >
                  <span className="relative link-reveal">
                    {featured.length > 0
                      ? 'Explore the research'
                      : 'Latest news'}
                  </span>
                  <span
                    aria-hidden
                    className="text-[color:var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          )}
        </section>
      </HeroParallax>

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
