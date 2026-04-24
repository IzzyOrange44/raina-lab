import { getResearchAreas } from '@/lib/reader'

export const metadata = { title: 'Research' }

export default async function ResearchPage() {
  const areas = await getResearchAreas()

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight mb-8">Research</h1>
      {areas.length === 0 ? (
        <p className="text-neutral-500">
          No research areas published yet. Add one via the admin.
        </p>
      ) : (
        <div className="space-y-12">
          {areas.map((area) => (
            <section key={area.slug} id={area.slug} className="scroll-mt-24">
              <div className="flex gap-6 items-start">
                {area.image && (
                  <img
                    src={area.image}
                    alt=""
                    className="w-40 h-40 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{area.title}</h2>
                  {area.shortDescription && (
                    <p className="mt-2 text-neutral-700">
                      {area.shortDescription}
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
