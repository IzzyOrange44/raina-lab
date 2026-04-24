/* Data reader — wraps Payload's local API with simple helpers.
   Pages are typed loosely here (`any`) until `payload generate:types` runs
   after the DB is provisioned. */
import { getPayload } from 'payload'
import config from '@payload-config'

/* eslint-disable @typescript-eslint/no-explicit-any */

async function payload() {
  return getPayload({ config })
}

/** Prefer an uploaded Media doc's URL; fall back to a plain text URL. */
function resolveImage(upload: unknown, fallbackUrl?: string | null): string | null {
  if (upload && typeof upload === 'object' && 'url' in upload) {
    const url = (upload as { url?: string | null }).url
    if (url) return url
  }
  if (typeof fallbackUrl === 'string' && fallbackUrl.length > 0) return fallbackUrl
  return null
}

function hydrateImages<T extends Record<string, any>>(doc: T): T {
  if (!doc) return doc
  const next: any = { ...doc }
  if ('photoUpload' in doc || 'photo' in doc) {
    next.photo = resolveImage(doc.photoUpload, doc.photo)
  }
  if ('imageUpload' in doc || 'image' in doc) {
    next.image = resolveImage(doc.imageUpload, doc.image)
  }
  if ('coverImageUpload' in doc || 'coverImage' in doc) {
    next.coverImage = resolveImage(doc.coverImageUpload, doc.coverImage)
  }
  if ('heroImageUpload' in doc || 'heroImage' in doc) {
    next.heroImage = resolveImage(doc.heroImageUpload, doc.heroImage)
  }
  return next as T
}

export async function getHome(): Promise<any> {
  const p = await payload()
  const doc = await p.findGlobal({ slug: 'home' as any })
  return hydrateImages(doc as any)
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
  return docs.map(hydrateImages)
}

export async function getAlumni(): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'members' as any,
    where: { status: { equals: 'alumni' } },
    limit: 200,
    sort: '-endDate',
  })
  return docs.map(hydrateImages)
}

export async function getMember(slug: string): Promise<any> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'members' as any,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ? hydrateImages(docs[0]) : null
}

export async function getResearchAreas(): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'research-areas' as any,
    limit: 100,
    sort: 'order',
  })
  return docs.map(hydrateImages)
}

export async function getFeaturedResearchAreas(): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'research-areas' as any,
    where: { featured: { equals: true } },
    limit: 20,
    sort: 'order',
  })
  return docs.map(hydrateImages)
}

export async function getPosts(): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'posts' as any,
    where: { draft: { not_equals: true } },
    limit: 200,
    sort: '-publishedDate',
  })
  return docs.map(hydrateImages)
}

export async function getLatestPosts(limit = 4): Promise<any[]> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'posts' as any,
    where: { draft: { not_equals: true } },
    limit,
    sort: '-publishedDate',
  })
  return docs.map(hydrateImages)
}

export async function getPost(slug: string): Promise<any> {
  const p = await payload()
  const { docs } = await p.find({
    collection: 'posts' as any,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ? hydrateImages(docs[0]) : null
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
