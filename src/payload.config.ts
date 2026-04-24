import { buildConfig, type CollectionConfig, type GlobalConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* ───── Collections ───── */

const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', defaultColumns: ['name', 'email'] },
  auth: true,
  access: {
    /* Only signed-in users can create, read, update, or delete other users.
       This disables public registration — new admins must be invited from
       within the admin UI by someone already logged in. The first-time
       "create first user" flow still runs when the table is empty. */
    create: ({ req }) => !!req.user,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
    admin: ({ req }) => !!req.user,
  },
  fields: [{ name: 'name', type: 'text' }],
}

const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'order'],
    description:
      'Role labels for members (e.g., PhD Student, Postdoc). Editable — add or rename as needed.',
  },
  access: { read: () => true },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order (lower numbers appear first)' },
    },
  ],
}

const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'color'],
    description:
      'News post tags (e.g., Paper, Award). Editable — add or rename as needed.',
  },
  access: { read: () => true },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'color',
      type: 'text',
      admin: { description: 'Optional hex color (e.g., #3b82f6)' },
    },
  ],
}

const slugifyHook = {
  beforeValidate: [
    ({ value, data }: { value?: string; data?: { name?: string; title?: string } }) => {
      if (value) return value
      const source = data?.name ?? data?.title
      if (!source) return value
      return source
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    },
  ],
}

const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'status', 'featured'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'URL-safe identifier (auto-generated from name if left blank).',
      },
      hooks: slugifyHook,
    },
    { name: 'photo', type: 'text', admin: { description: 'Image URL' } },
    { name: 'role', type: 'relationship', relationTo: 'roles' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Pin at top of the People page' },
    },
    {
      name: 'shortBio',
      type: 'text',
      admin: { description: 'One-line bio shown in the grid' },
    },
    { name: 'joinedDate', type: 'date' },
    { name: 'email', type: 'text' },
    {
      name: 'links',
      type: 'group',
      fields: [
        { name: 'scholar', type: 'text' },
        { name: 'github', type: 'text' },
        { name: 'website', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'orcid', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'current',
      options: [
        { label: 'Current', value: 'current' },
        { label: 'Alumni', value: 'alumni' },
      ],
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        condition: (data) => data.status === 'alumni',
        description: 'End date (alumni only)',
      },
    },
    {
      name: 'currentPosition',
      type: 'text',
      admin: {
        condition: (data) => data.status === 'alumni',
        description: 'e.g., "Assistant Professor at MIT" (alumni only)',
      },
    },
    {
      name: 'fullBio',
      type: 'richText',
      admin: { description: 'Full bio shown on the member page' },
    },
  ],
}

const ResearchAreas: CollectionConfig = {
  slug: 'research-areas',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'featured'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: slugifyHook,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order (lower numbers appear first)' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show on home page' },
    },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'image', type: 'text', admin: { description: 'Image URL' } },
    {
      name: 'relatedMembers',
      type: 'relationship',
      relationTo: 'members',
      hasMany: true,
    },
    { name: 'body', type: 'richText' },
  ],
}

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', 'tag', 'draft'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: slugifyHook,
    },
    { name: 'publishedDate', type: 'date', required: true },
    { name: 'tag', type: 'relationship', relationTo: 'tags' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'coverImage', type: 'text', admin: { description: 'Image URL' } },
    {
      name: 'draft',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Hide from the public site' },
    },
    { name: 'body', type: 'richText' },
  ],
}

/* ───── Globals ───── */

const Home: GlobalConfig = {
  slug: 'home',
  access: { read: () => true },
  fields: [
    { name: 'tagline', type: 'text' },
    { name: 'intro', type: 'textarea' },
    { name: 'heroImage', type: 'text', admin: { description: 'Image URL' } },
  ],
}

const About: GlobalConfig = {
  slug: 'about',
  access: { read: () => true },
  fields: [
    { name: 'mission', type: 'textarea' },
    { name: 'affiliation', type: 'text' },
    { name: 'body', type: 'richText' },
  ],
}

const Contact: GlobalConfig = {
  slug: 'contact',
  access: { read: () => true },
  fields: [
    { name: 'email', type: 'text' },
    { name: 'address', type: 'textarea' },
    {
      name: 'mapEmbed',
      type: 'text',
      admin: { description: 'Google Maps embed URL (optional)' },
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
        { name: 'github', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'bluesky', type: 'text' },
        { name: 'mastodon', type: 'text' },
      ],
    },
  ],
}

/* ───── Seeds ───── */

const seedRoles = [
  { label: 'Principal Investigator', order: 1 },
  { label: 'Postdoc', order: 2 },
  { label: 'PhD Student', order: 3 },
  { label: 'MS Student', order: 4 },
  { label: 'Undergraduate', order: 5 },
  { label: 'Research Staff', order: 6 },
  { label: 'Visitor', order: 7 },
]

const seedTags = [
  { label: 'Paper', color: '#3b82f6' },
  { label: 'Award', color: '#eab308' },
  { label: 'Talk', color: '#8b5cf6' },
  { label: 'New Member', color: '#10b981' },
  { label: 'Event', color: '#f97316' },
  { label: 'Other', color: '#6b7280' },
]

/* ───── Config ───── */

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Raina Lab' },
  },
  collections: [Users, Members, Roles, Tags, ResearchAreas, Posts],
  globals: [Home, About, Contact],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI ||
        process.env.POSTGRES_URL ||
        process.env.POSTGRES_URL_NON_POOLING ||
        '',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-production',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  routes: { admin: '/admin', api: '/api' },
  onInit: async (payload) => {
    const existingRoles = await payload.count({ collection: 'roles' })
    if (existingRoles.totalDocs === 0) {
      for (const role of seedRoles) {
        await payload.create({ collection: 'roles', data: role })
      }
      payload.logger.info(`Seeded ${seedRoles.length} roles`)
    }

    const existingTags = await payload.count({ collection: 'tags' })
    if (existingTags.totalDocs === 0) {
      for (const tag of seedTags) {
        await payload.create({ collection: 'tags', data: tag })
      }
      payload.logger.info(`Seeded ${seedTags.length} tags`)
    }
  },
})
