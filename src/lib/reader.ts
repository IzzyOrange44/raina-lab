/* Data reader — wraps Payload's local API with simple helpers.
   Pages are typed loosely here (`any`) until `payload generate:types` runs
   after the DB is provisioned. */
import { getPayload } from 'payload'
import config from '@payload-config'

/* eslint-disable @typescript-eslint/no-explicit-any */

async function payload() {
  return getPayload({ config })
}

export async function getHome(): Promise<any> {
  const p = await payload()
  return p.findGlobal({ slug: 'home' as any })
}

export async function getAbout(): Promise<any> {
  const p = await payload()
  return p.findGlobal({ slug: 'about' as any })
}

export async function getContact(): Promise<any> {
  const p = await payload()
  return p.findGlobal({ slug: 'contact' as any })
}

export async function getCurrentMembers(): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'members' as any,
    where: { status: { equals: 'current' } },
    limit: 200,
    sort: ['-featured', 'name'] as any,
  })
  return docs
}

export async function getAlumni(): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'members' as any,
    where: { status: { equals: 'alumni' } },
    limit: 200,
    sort: '-endDate',
  })
  return docs
}

export async function getMember(slug: string): Promise<any> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'members' as any,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getResearchAreas(): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'research-areas' as any,
    limit: 100,
    sort: 'order',
  })
  return docs
}

export async function getFeaturedResearchAreas(): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'research-areas' as any,
    where: { featured: { equals: true } },
    limit: 20,
    sort: 'order',
  })
  return docs
}

export async function getPosts(): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'posts' as any,
    where: { draft: { not_equals: true } },
    limit: 200,
    sort: '-publishedDate',
  })
  return docs
}

export async function getLatestPosts(limit = 4): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'posts' as any,
    where: { draft: { not_equals: true } },
    limit,
    sort: '-publishedDate',
  })
  return docs
}

export async function getPost(slug: string): Promise<any> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'posts' as any,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getRoleLabel(role: unknown): Promise<string | null> {
  if (!role) return null
  if (typeof role === 'object' && role !== null && 'label' in role) {
    return (role as { label?: string }).label ?? null
  }
  if (typeof role === 'string' || typeof role === 'number') {
    const p = await payload()
    try {
      const doc: any = await p.findByID({
        collection: 'roles' as any,
        id: role,
      })
      return doc?.label ?? null
    } catch {
      return null
    }
  }
  return null
}

export async function getTag(
  tag: unknown,
): Promise<{ label: string; color: string | null } | null> {
  if (!tag) return null
  if (typeof tag === 'object' && tag !== null && 'label' in tag) {
    const t = tag as { label?: string; color?: string | null }
    return { label: t.label ?? '', color: t.color ?? null }
  }
  if (typeof tag === 'string' || typeof tag === 'number') {
    const p = await payload()
    try {
      const doc: any = await p.findByID({
        collection: 'tags' as any,
        id: tag,
      })
      if (!doc) return null
      return { label: doc.label ?? '', color: doc.color ?? null }
    } catch {
      return null
    }
  }
  return null
}
