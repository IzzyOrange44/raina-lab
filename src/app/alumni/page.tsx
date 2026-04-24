import { getAlumni, getRoleLabel } from '@/lib/reader'
import Masthead from '@/components/Masthead'

export const metadata = { title: 'Alumni' }

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
          {withRoles.map((m) => {
            const alumniInfo =
              m.status.discriminant === 'alumni' ? m.status.value : null
            return (
              <li
                key={m.slug}
                className="grid grid-cols-12 gap-3 sm:gap-6 py-7 sm:py-8 items-baseline"
              >
                <div className="col-span-12 sm:col-span-2 label tabular">
                  {alumniInfo?.endDate ?? ''}
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
                  {alumniInfo?.currentPosition && (
                    <p className="text-[color:var(--color-ink-2)] leading-snug">
                      {alumniInfo.currentPosition}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}
