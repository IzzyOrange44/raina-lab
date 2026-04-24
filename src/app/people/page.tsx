import Link from 'next/link'
import { getCurrentMembers, getRoleLabel } from '@/lib/reader'

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
    <div>
      <h1 className="text-4xl font-bold tracking-tight mb-8">People</h1>
      {withRoles.length === 0 ? (
        <p className="text-neutral-500">
          No members yet. Add one via the admin.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {withRoles.map((m) => (
            <Link key={m.slug} href={`/people/${m.slug}`} className="group">
              {m.photo ? (
                <img
                  src={m.photo}
                  alt={m.name}
                  className="aspect-square w-full rounded-lg bg-neutral-100 object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-lg bg-neutral-100" />
              )}
              <div className="mt-3">
                <div className="font-medium group-hover:underline">
                  {m.name}
                </div>
                <div className="text-sm text-neutral-500">{m.roleLabel}</div>
                {m.shortBio && (
                  <p className="mt-1 text-sm text-neutral-700">{m.shortBio}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
