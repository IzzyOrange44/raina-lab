import { getResearchAreas } from '@/lib/reader'
import Masthead from '@/components/Masthead'

export const metadata = { title: 'Research' }

export default async function ResearchPage() {
  const areas = await getResearchAreas()

  return (
    <article>
      <Masthead title="Research" />

      {areas.length === 0 ? (
        <div className="flex items-center justify-center py-24 opacity-40">
          <span
            className="h-3 w-3 rounded-full bg-[color:var(--color-accent)]"
            aria-hidden
          />
        </div>
      ) : (
        <div className="space-y-24 sm:space-y-32">
          {areas.map((area, i) => (
            <section
              key={area.slug}
              id={area.slug}
              className="scroll-mt-32 grid grid-cols-12 gap-6 lg:gap-12"
            >
              <div className="col-span-12 lg:col-span-3">
                <div className="lg:sticky lg:top-32 flex items-baseline gap-3">
                  <span
                    className="h-2 w-2 rounded-full bg-[color:var(--color-accent)] shrink-0"
                    aria-hidden
                  />
                  <p className="display-xl text-6xl sm:text-7xl leading-none text-[color:var(--color-ink)] tabular">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-9">
                <h2 className="display-lg text-3xl sm:text-5xl lg:text-[3.5rem] text-balance">
                  {area.title}
                </h2>

                {area.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <figure className="my-10">
                    <img
                      src={area.image}
                      alt=""
                      className="w-full max-w-2xl"
                    />
                  </figure>
                )}

                {area.shortDescription && (
                  <p className="text-xl sm:text-2xl text-[color:var(--color-ink-2)] mt-8 leading-[1.45] max-w-[44rem]">
                    {area.shortDescription}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </article>
  )
}
