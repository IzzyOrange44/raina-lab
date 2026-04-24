import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

export const reader = createReader(process.cwd(), keystaticConfig)

export type MemberEntry = Awaited<
  ReturnType<typeof reader.collections.members.read>
>
export type ResearchAreaEntry = Awaited<
  ReturnType<typeof reader.collections.researchAreas.read>
>
export type PostEntry = Awaited<
  ReturnType<typeof reader.collections.posts.read>
>

export async function getMembers() {
  const entries = await reader.collections.members.all()
  return entries.map((e) => ({ slug: e.slug, ...e.entry }))
}

export async function getCurrentMembers() {
  const all = await getMembers()
  return all
    .filter((m) => m.status.discriminant === 'current')
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
}

export async function getAlumni() {
  const all = await getMembers()
  return all
    .filter((m) => m.status.discriminant === 'alumni')
    .sort((a, b) => {
      const aEnd =
        a.status.discriminant === 'alumni' ? a.status.value.endDate ?? '' : ''
      const bEnd =
        b.status.discriminant === 'alumni' ? b.status.value.endDate ?? '' : ''
      return bEnd.localeCompare(aEnd)
    })
}

export async function getMember(slug: string) {
  return reader.collections.members.read(slug)
}

export async function getResearchAreas() {
  const entries = await reader.collections.researchAreas.all()
  return entries
    .map((e) => ({ slug: e.slug, ...e.entry }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function getFeaturedResearchAreas() {
  return (await getResearchAreas()).filter((r) => r.featured)
}

export async function getPosts() {
  const entries = await reader.collections.posts.all()
  return entries
    .map((e) => ({ slug: e.slug, ...e.entry }))
    .filter((p) => !p.draft)
    .sort((a, b) => (b.publishedDate ?? '').localeCompare(a.publishedDate ?? ''))
}

export async function getLatestPosts(count = 3) {
  return (await getPosts()).slice(0, count)
}

export async function getPost(slug: string) {
  return reader.collections.posts.read(slug)
}

export async function getRoleLabel(slug: string | null) {
  if (!slug) return null
  const role = await reader.collections.roles.read(slug)
  return role?.label ?? slug
}

export async function getTag(slug: string | null) {
  if (!slug) return null
  const tag = await reader.collections.tags.read(slug)
  return tag ? { label: tag.label, color: tag.color } : null
}

export async function getHome() {
  return reader.singletons.home.read()
}
export async function getAbout() {
  return reader.singletons.about.read()
}
export async function getContact() {
  return reader.singletons.contact.read()
}
