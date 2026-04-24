import { getAlumni, getRoleLabel } from '@/lib/reader'
import Masthead from '@/components/Masthead'
import Reveal from '@/components/Reveal'

export const metadata = { title: 'Alumni' }

function formatYear(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '' : String(d.getFullYear())
}

export default async function AlumniPage() {
  const alumni = await getAlumni()
  const withRoles = await Promise.all(
    alumni.map(async (m) => ({
      ...m,
      roleLabel: await getRoleLabel(m.role),
    })),
  )

  return (
    <article>
      <Masthead title="Alumni" />

      {withRoles.length === 0 ? (
        <div className="flex items-center justify-center py-24 opacity-40">
          <span
            className="h-3 w-3 rounded-full bg-[color:var(--color-accent)]"
            aria-hidden
          />
        </div>
      ) : (
        <ul className="divide-y divide-[color:var(--color-line)]">
          {withRoles.map((m, i) => (
            <Reveal
              as="li"
              key={m.id}
              delay={i * 0.04}
              className="grid grid-cols-12 gap-3 sm:gap-6 py-7 sm:py-8 items-baseline"
            >
              <div className="col-span-12 sm:col-span-2 label tabular">
                {formatYear(m.endDate)}
              </div>
              <div className="col-span-12 sm:col-span-5 lg:col-span-6">
                <h3 className="display-md text-xl sm:text-2xl text-[color:var(--color-ink)] leading-tight">
                  {m.name}
                </h3>
                {m.roleLabel && (
                  <p className="label text-[color:var(--color-accent)] mt-1.5">
                    {m.roleLabel}
                  </p>
                )}
              </div>
              <div className="col-span-12 sm:col-span-5 lg:col-span-4">
                {m.currentPosition && (
                  <p className="text-[color:var(--color-ink-2)] leading-snug">
                    {m.currentPosition}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      )}
    </article>
  )
}
