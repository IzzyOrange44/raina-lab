import { getAlumni, getRoleLabel } from '@/lib/reader'

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
    <div>
      <h1 className="text-4xl font-bold tracking-tight mb-8">Alumni</h1>
      {withRoles.length === 0 ? (
        <p className="text-neutral-500">No alumni yet.</p>
      ) : (
        <ul className="divide-y divide-neutral-200">
          {withRoles.map((m) => {
            const alumniInfo =
              m.status.discriminant === 'alumni' ? m.status.value : null
            return (
              <li key={m.slug} className="py-4 flex gap-4 items-start">
                {m.photo && (
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-neutral-500">
                    {m.roleLabel}
                    {alumniInfo?.endDate && (
                      <span> · until {alumniInfo.endDate}</span>
                    )}
                  </div>
                  {alumniInfo?.currentPosition && (
                    <div className="text-sm text-neutral-700 mt-1">
                      Now: {alumniInfo.currentPosition}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
