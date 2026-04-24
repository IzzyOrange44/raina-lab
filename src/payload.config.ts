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

/** Build a minimal Lexical rich-text value from plain paragraphs. */
function lexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((p) => ({
        type: 'paragraph' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text' as const,
            text: p,
            format: 0,
            detail: 0,
            mode: 'normal' as const,
            style: '',
            version: 1,
          },
        ],
      })),
    },
  }
}

const seedResearchAreas = [
  {
    title: 'Plant–Pathogen Interactions',
    slug: 'plant-pathogen-interactions',
    order: 1,
    featured: true,
    shortDescription:
      'Genetic and molecular mechanisms controlling plant responses to pathogen infection — from the hypersensitive response to systemic acquired resistance.',
    image:
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1600&q=80&auto=format&fit=crop',
    body: lexical([
      'We use forward and reverse genetic approaches in Arabidopsis thaliana to identify the genes that govern how plants detect pathogens and mount a defence. Our work has characterised mutants such as hrl1 and dll1 that spontaneously develop hypersensitive-response-like lesions and express defence genes constitutively.',
      'Through suppression subtractive hybridisation and microarray analysis we have identified over a thousand differentially expressed genes in response to pathogens, hormones, and stress, most with no previously characterised role in defence.',
    ]),
  },
  {
    title: 'Receptor-Like Kinases',
    slug: 'receptor-like-kinases',
    order: 2,
    featured: true,
    shortDescription:
      'Functional genomics of the 600+ receptor-like kinase family in Arabidopsis — how plants perceive environmental and pathogen-derived signals at the cell surface.',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&q=80&auto=format&fit=crop',
    body: lexical([
      'Receptor-like kinases (RLKs) are the largest family of signalling receptors in Arabidopsis, exceeding 600 members. We study their role in plant–pathogen interactions, abiotic stress responses, and development.',
      'To accelerate RLK functional analysis we developed a chimeric receptor toolkit that fuses target RLK extracellular domains to the kinase domain of a defence-activating RLK, coupling perception to a visible hypersensitive-response reporter.',
    ]),
  },
  {
    title: 'microRNA-Mediated Defence',
    slug: 'microrna-mediated-defence',
    order: 3,
    featured: true,
    shortDescription:
      'How plant microRNAs post-transcriptionally regulate defence against bacterial pathogens — including the salicylic-acid-dependent miR167 / ARF6 / ARF8 circuit.',
    image:
      'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=1600&q=80&auto=format&fit=crop',
    body: lexical([
      'We have shown that Arabidopsis miR167 and its targets ARF6 and ARF8 regulate resistance to Pseudomonas syringae through a salicylic-acid-dependent pathway, linking the post-transcriptional machinery of plants to their innate immune system.',
      'Current work explores how small RNAs integrate biotic and abiotic signals and modulate the expression of receptor-like kinases and defence gene networks.',
    ]),
  },
  {
    title: 'Abiotic Stress Responses',
    slug: 'abiotic-stress-responses',
    order: 4,
    featured: false,
    shortDescription:
      'How plants sense and respond to drought, temperature, and oxidative stress — and how these responses interact with pathogen defence.',
    body: lexical([
      'Plants in the field rarely encounter a single stress in isolation. We investigate how signalling networks integrate responses to pathogens with responses to drought, heat, cold, and reactive oxygen species.',
    ]),
  },
]

const seedMembers = [
  {
    name: 'Ramesh Raina',
    slug: 'ramesh-raina',
    roleLabel: 'Principal Investigator',
    featured: true,
    shortBio: 'Professor of Biology, Syracuse University.',
    email: 'raraina@syr.edu',
    links: { website: 'https://rainalab.syr.edu/' },
    status: 'current' as const,
    photo: null,
    fullBio: lexical([
      'Ramesh Raina is Professor in the Department of Biology at Syracuse University. His lab studies the molecular basis of plant–pathogen interactions, functional genomics of receptor-like kinases in Arabidopsis, and plant responses to abiotic stresses.',
    ]),
  },
  {
    name: 'Pratibha Choudhury',
    slug: 'pratibha-choudhury',
    roleLabel: 'Postdoc',
    featured: false,
    shortBio: 'Postdoctoral Associate.',
    status: 'current' as const,
  },
  {
    name: 'Nikhilesh Dhar',
    slug: 'nikhilesh-dhar',
    roleLabel: 'Postdoc',
    featured: false,
    shortBio: 'Postdoctoral researcher.',
    status: 'current' as const,
  },
  {
    name: 'Dan Li',
    slug: 'dan-li',
    roleLabel: 'PhD Student',
    featured: false,
    status: 'current' as const,
  },
  {
    name: 'Irmak Erdem',
    slug: 'irmak-erdem',
    roleLabel: 'PhD Student',
    featured: false,
    status: 'current' as const,
  },
  {
    name: 'Snigdha Chatterjee',
    slug: 'snigdha-chatterjee',
    roleLabel: 'Undergraduate',
    featured: false,
    shortBio: 'BS Biotechnology.',
    status: 'current' as const,
  },
  {
    name: 'Nelson Trusler',
    slug: 'nelson-trusler',
    roleLabel: 'Undergraduate',
    featured: false,
    shortBio: 'BS Biology.',
    status: 'current' as const,
  },
  {
    name: 'Pallavi Gupta',
    slug: 'pallavi-gupta',
    roleLabel: 'PhD Student',
    featured: false,
    status: 'alumni' as const,
    endDate: '2013-05-15',
    currentPosition: 'Research scientist in industry.',
  },
  {
    name: 'Julie Caruana',
    slug: 'julie-caruana',
    roleLabel: 'PhD Student',
    featured: false,
    status: 'alumni' as const,
    endDate: '2012-05-15',
    currentPosition: 'Academic researcher.',
  },
  {
    name: 'Aditya Dutta',
    slug: 'aditya-dutta',
    roleLabel: 'PhD Student',
    featured: false,
    status: 'alumni' as const,
    endDate: '2011-05-15',
    currentPosition: 'Industry scientist.',
  },
]

const seedPosts = [
  {
    title: 'miR167 controls salicylic-acid-dependent defence in Arabidopsis',
    slug: 'mir167-salicylic-acid-defence',
    publishedDate: '2020-09-15',
    tagLabel: 'Paper',
    excerpt:
      'Our Plant Direct paper shows that overexpression of Arabidopsis miR167 induces salicylic-acid-dependent defence against Pseudomonas syringae through its targets ARF6 and ARF8.',
    coverImage:
      'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=1600&q=80&auto=format&fit=crop',
    body: lexical([
      'In Plant Direct, Caruana et al. demonstrate that the plant microRNA miR167 regulates resistance to the bacterial pathogen Pseudomonas syringae. Overexpression of miR167 reduces ARF6 and ARF8 transcripts and induces a salicylic-acid-dependent defence programme.',
      'The finding links the post-transcriptional machinery of plants to their innate immune system and highlights microRNAs as integrators of developmental and defence signalling.',
    ]),
  },
  {
    title: 'SDA1 modulates pathogen defence and oxidative-stress tolerance',
    slug: 'sda1-defence-oxidative-stress',
    publishedDate: '2020-06-01',
    tagLabel: 'Paper',
    excerpt:
      'Characterisation of SMALL DEFENSE-ASSOCIATED PROTEIN 1 as a regulator of bacterial defence and reactive-oxygen-species tolerance in Arabidopsis.',
    body: lexical([
      'sda1 loss-of-function mutants are compromised in defence gene expression and salicylic acid accumulation after Pseudomonas syringae infection, while also showing reduced tolerance to oxidative stress.',
    ]),
  },
  {
    title: 'HRL1 codes for AtPPT1 and regulates ROS accumulation',
    slug: 'hrl1-atppt1-ros',
    publishedDate: '2015-03-11',
    tagLabel: 'Paper',
    excerpt:
      'The spontaneous-lesion mutant hrl1 is allelic to AtPPT1, linking phosphoenolpyruvate/phosphate translocator activity to reactive-oxygen-species homeostasis and defence.',
    body: lexical([
      'Our Frontiers in Plant Science paper maps the classic hrl1 mutation to AtPPT1, a plastidic phosphoenolpyruvate/phosphate translocator, establishing a connection between primary metabolism and defence gene activation.',
    ]),
  },
  {
    title: 'New graduate students welcomed to the lab',
    slug: 'new-graduate-students-welcome',
    publishedDate: '2024-09-01',
    tagLabel: 'New Member',
    excerpt:
      'The Raina Lab welcomes its incoming graduate cohort and a new round of undergraduate researchers for the academic year.',
    body: lexical([
      'The lab is excited to introduce the newest members joining our Arabidopsis research programme. We look forward to their contributions to our work on plant defence and receptor-like kinase signalling.',
    ]),
  },
]

const seedHome = {
  tagline: 'How plants sense the environment and defend themselves.',
  intro:
    'The Raina Lab studies the molecular genetics of plant–pathogen interactions in Arabidopsis thaliana — receptor-like kinases, small RNAs, and the defence programmes they trigger.',
  heroImage:
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=2000&q=80&auto=format&fit=crop',
}

const seedAbout = {
  mission:
    'To understand how plants sense the environment and activate defence against pests, using genetic and molecular approaches in Arabidopsis.',
  affiliation: 'Department of Biology, Syracuse University',
  body: lexical([
    'The Raina Lab uses forward and reverse genetics, functional genomics, and molecular biology to dissect the signalling networks that Arabidopsis thaliana uses to perceive pathogens and coordinate defence.',
    'Our long-term goal is to understand the genetic and molecular mechanisms regulating the hypersensitive response, systemic acquired resistance, and disease-associated host cell death — and to translate those insights into more resilient crops.',
    'The lab is housed in the Life Sciences Complex at Syracuse University and trains graduate students, postdoctoral researchers, and undergraduates across biotechnology and biology.',
  ]),
}

const seedContact = {
  email: 'raraina@syr.edu',
  address:
    'Raina Lab\nDepartment of Biology\n458 Life Sciences Complex\nSyracuse University\nSyracuse, NY 13244',
  mapEmbed: null,
  social: {
    twitter: null,
    github: null,
    linkedin: null,
    bluesky: null,
    mastodon: null,
  },
}

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
    /* Roles */
    const existingRoles = await payload.count({ collection: 'roles' })
    if (existingRoles.totalDocs === 0) {
      for (const role of seedRoles) {
        await payload.create({ collection: 'roles', data: role })
      }
      payload.logger.info(`Seeded ${seedRoles.length} roles`)
    }

    /* Tags */
    const existingTags = await payload.count({ collection: 'tags' })
    if (existingTags.totalDocs === 0) {
      for (const tag of seedTags) {
        await payload.create({ collection: 'tags', data: tag })
      }
      payload.logger.info(`Seeded ${seedTags.length} tags`)
    }

    /* Helper: look up role id by label */
    const roleIdByLabel = new Map<string, string | number>()
    const roleDocs = await payload.find({ collection: 'roles', limit: 50 })
    for (const r of roleDocs.docs as Array<{ id: string | number; label: string }>) {
      roleIdByLabel.set(r.label, r.id)
    }

    /* Helper: look up tag id by label */
    const tagIdByLabel = new Map<string, string | number>()
    const tagDocs = await payload.find({ collection: 'tags', limit: 50 })
    for (const t of tagDocs.docs as Array<{ id: string | number; label: string }>) {
      tagIdByLabel.set(t.label, t.id)
    }

    /* Members */
    const existingMembers = await payload.count({ collection: 'members' })
    if (existingMembers.totalDocs === 0) {
      for (const m of seedMembers) {
        const { roleLabel, ...rest } = m
        const role = roleLabel ? roleIdByLabel.get(roleLabel) : undefined
        await payload.create({
          collection: 'members',
          data: {
            ...rest,
            ...(role ? { role } : {}),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        })
      }
      payload.logger.info(`Seeded ${seedMembers.length} members`)
    }

    /* Research Areas */
    const existingAreas = await payload.count({ collection: 'research-areas' })
    if (existingAreas.totalDocs === 0) {
      for (const area of seedResearchAreas) {
        await payload.create({
          collection: 'research-areas',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: area as any,
        })
      }
      payload.logger.info(`Seeded ${seedResearchAreas.length} research areas`)
    }

    /* Posts */
    const existingPosts = await payload.count({ collection: 'posts' })
    if (existingPosts.totalDocs === 0) {
      for (const post of seedPosts) {
        const { tagLabel, ...rest } = post
        const tag = tagLabel ? tagIdByLabel.get(tagLabel) : undefined
        await payload.create({
          collection: 'posts',
          data: {
            ...rest,
            ...(tag ? { tag } : {}),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        })
      }
      payload.logger.info(`Seeded ${seedPosts.length} posts`)
    }

    /* Globals — only seed if tagline/mission/email are empty (never overwrite edits) */
    const home = await payload.findGlobal({ slug: 'home' })
    if (!home.tagline) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.updateGlobal({ slug: 'home', data: seedHome as any })
      payload.logger.info('Seeded home global')
    }

    const about = await payload.findGlobal({ slug: 'about' })
    if (!about.mission) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.updateGlobal({ slug: 'about', data: seedAbout as any })
      payload.logger.info('Seeded about global')
    }

    const contact = await payload.findGlobal({ slug: 'contact' })
    if (!contact.email) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.updateGlobal({ slug: 'contact', data: seedContact as any })
      payload.logger.info('Seeded contact global')
    }
  },
})
