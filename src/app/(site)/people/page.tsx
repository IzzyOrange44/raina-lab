import Link from 'next/link'
import { getCurrentMembers, getRoleLabel } from '@/lib/reader'
import Masthead from '@/components/Masthead'

export const metadata = { title: 'People' }

export default async function PeoplePage() {
  const members = await getCurrentMembers()
  const withRoles = await Promise.all(
    members.map(async (m) => ({
      ...m,
      roleLabel: await getRoleLabel(m.role),
    })),
  )

  return (
    <article>
      <Masthead title="People" />

      {withRoles.length === 0 ? (
        <div className="flex items-center justify-center py-24 opacity-40">
          <span
            className="h-3 w-3 rounded-full bg-[color:var(--color-accent)]"
            aria-hidden
          />
        </div>
      ) : (
        <ul className="grid gap-x-6 gap-y-14 sm:gap-x-8 sm:gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {withRoles.map((m) => (
            <li key={m.id}>
              <Link href={`/people/${m.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--color-surface)] border border-[color:var(--color-line)] mb-5">
                  {m.photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700 ease-out"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span
                        className="h-3 w-3 rounded-full bg-[color:var(--color-accent)] opacity-40"
                        aria-hidden
                      />
                    </div>
                  )}
                </div>
                {m.roleLabel && (
                  <p className="label text-[color:var(--color-accent)] mb-1.5">
                    {m.roleLabel}
                  </p>
                )}
                <h3 className="display-md text-xl sm:text-2xl text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-dark)] transition-colors duration-300 leading-tight">
                  {m.name}
                </h3>
                {m.shortBio && (
                  <p className="text-[color:var(--color-ink-3)] mt-2 leading-relaxed">
                    {m.shortBio}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
