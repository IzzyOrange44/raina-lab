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
    name: 'Taylor Stubitsch',
    slug: 'taylor-stubitsch',
    roleLabel: 'Undergraduate',
    featured: false,
    shortBio:
      'Biochemistry and Forensic Science major, Psychology minor. Graduating 2026 and applying to medical school.',
    status: 'current' as const,
    photo: '/images/members/taylor-stubitsch.jpg',
  },
  {
    name: 'Katie Bakley',
    slug: 'katie-bakley',
    roleLabel: 'Undergraduate',
    featured: false,
    shortBio:
      '4+1 Biotechnology program: BS 2026, MS 2027. Honors thesis on JMJ1 and JMJ2 in Arabidopsis defence and development.',
    status: 'current' as const,
    photo: '/images/members/katie-bakley.jpg',
    fullBio: lexical([
      'Katie is a junior enrolled in the 4+1 Biotechnology program. She will earn her BS in Biotechnology in December 2026, followed by her MS in December 2027. After graduation, she hopes to pursue a career in the biotechnology industry.',
      'Outside of the Raina Lab, Katie has worked as a Student Research Associate at Drexel University and will be joining DSM-Firmenich as a Quality Control Intern in Summer 2026. She is a member of the Renée Crown University Honors Program, and her thesis work focuses on the role of JMJ1 and JMJ2 in defence and development in Arabidopsis.',
    ]),
  },
  {
    name: 'Taryn Keefe',
    slug: 'taryn-keefe',
    roleLabel: 'Undergraduate',
    featured: false,
    shortBio:
      'Researching JMJ21 and its role in abiotic and biotic stress responses in Arabidopsis thaliana.',
    status: 'current' as const,
    photo: '/images/members/taryn-keefe.jpg',
    fullBio: lexical([
      'Taryn is researching JMJ21 and its role in abiotic and biotic stress responses in Arabidopsis thaliana.',
      'On campus, she serves in leadership roles across the Biotechnology Society, Campus Cursive, and the MaryAnn Shaw Center, and acts as a student ambassador for SOURCE and the College of Arts and Sciences. She is also a member of Omega Alpha Tau (Biotechnology Fraternity) and Pi Mu Epsilon (Math Honors Society).',
      'This summer she will be researching at Trent University as a Fulbright Canada–Mitacs Globalink Research Intern, focusing on metagenomics and the global carbon cycle.',
    ]),
  },
  {
    name: 'Sevara Abduvalieva',
    slug: 'sevara-abduvalieva',
    roleLabel: 'Undergraduate',
    featured: false,
    shortBio:
      'Senior, BS Biotechnology with a minor in Chemistry. Honors thesis on the JMJ27 protein in Arabidopsis thaliana.',
    status: 'current' as const,
    photo: '/images/members/sevara-abduvalieva.jpg',
    fullBio: lexical([
      'Sevara Abduvalieva is a senior at Syracuse University, graduating in 2026 with a B.S. in Biotechnology and a minor in Chemistry. She is a member of the Renée Crown University Honors Program and plans to pursue medical school following graduation.',
      'Her honors thesis focuses on the characterisation of the JMJ27 protein in Arabidopsis thaliana.',
    ]),
  },
  /* Placeholder alumni — clearly fake, replace via the admin. */
  {
    name: 'A. Former Researcher',
    slug: 'placeholder-alumni-1',
    roleLabel: 'PhD Student',
    featured: false,
    status: 'alumni' as const,
    endDate: '2022-05-15',
    currentPosition: 'Postdoctoral fellow — placeholder.',
  },
  {
    name: 'B. Former Researcher',
    slug: 'placeholder-alumni-2',
    roleLabel: 'Postdoc',
    featured: false,
    status: 'alumni' as const,
    endDate: '2021-08-01',
    currentPosition: 'Research scientist — placeholder.',
  },
  {
    name: 'C. Former Researcher',
    slug: 'placeholder-alumni-3',
    roleLabel: 'Undergraduate',
    featured: false,
    status: 'alumni' as const,
    endDate: '2020-05-15',
    currentPosition: 'Graduate student — placeholder.',
  },
]

const seedPosts = [
  {
    title: 'Example paper — replace from the admin',
    slug: 'placeholder-post-paper',
    publishedDate: '2025-09-15',
    tagLabel: 'Paper',
    excerpt:
      'Placeholder entry for a recent publication from the lab. Edit or delete this from the admin to add a real post.',
    body: lexical([
      'This is placeholder text for a news post. You can change the title, date, tag, excerpt, and body from the admin.',
    ]),
  },
  {
    title: 'Example award — replace from the admin',
    slug: 'placeholder-post-award',
    publishedDate: '2025-07-01',
    tagLabel: 'Award',
    excerpt:
      'Placeholder entry for a lab member award or recognition. Edit or delete this from the admin.',
    body: lexical([
      'Placeholder text for an award announcement. Use the admin to replace with real content.',
    ]),
  },
  {
    title: 'Example talk — replace from the admin',
    slug: 'placeholder-post-talk',
    publishedDate: '2025-04-10',
    tagLabel: 'Talk',
    excerpt:
      'Placeholder entry for a talk, seminar, or conference presentation.',
    body: lexical([
      'Placeholder text for a talk or seminar announcement.',
    ]),
  },
  {
    title: 'New lab member — replace from the admin',
    slug: 'placeholder-post-member',
    publishedDate: '2025-01-15',
    tagLabel: 'New Member',
    excerpt:
      'Placeholder entry for welcoming a new member to the lab.',
    body: lexical([
      'Placeholder text for a new-member announcement.',
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

    /* Helper: look up role / tag id by label */
    const roleIdByLabel = new Map<string, string | number>()
    for (const r of (
      await payload.find({ collection: 'roles', limit: 50 })
    ).docs as Array<{ id: string | number; label: string }>) {
      roleIdByLabel.set(r.label, r.id)
    }
    const tagIdByLabel = new Map<string, string | number>()
    for (const t of (
      await payload.find({ collection: 'tags', limit: 50 })
    ).docs as Array<{ id: string | number; label: string }>) {
      tagIdByLabel.set(t.label, t.id)
    }

    /* One-time cleanup of old real-people/real-paper seeds. Safe to run
       repeatedly — only deletes records with these specific slugs. */
    const oldMemberSlugs = [
      'pratibha-choudhury',
      'nikhilesh-dhar',
      'dan-li',
      'irmak-erdem',
      'snigdha-chatterjee',
      'nelson-trusler',
      'pallavi-gupta',
      'julie-caruana',
      'aditya-dutta',
    ]
    const oldMembers = await payload.find({
      collection: 'members',
      where: { slug: { in: oldMemberSlugs } },
      limit: 50,
    })
    for (const m of oldMembers.docs as Array<{ id: string | number }>) {
      await payload.delete({ collection: 'members', id: m.id })
    }
    if (oldMembers.docs.length) {
      payload.logger.info(
        `Removed ${oldMembers.docs.length} old real-people seeds`,
      )
    }

    const oldPostSlugs = [
      'mir167-salicylic-acid-defence',
      'sda1-defence-oxidative-stress',
      'hrl1-atppt1-ros',
      'new-graduate-students-welcome',
    ]
    const oldPosts = await payload.find({
      collection: 'posts',
      where: { slug: { in: oldPostSlugs } },
      limit: 50,
    })
    for (const p of oldPosts.docs as Array<{ id: string | number }>) {
      await payload.delete({ collection: 'posts', id: p.id })
    }
    if (oldPosts.docs.length) {
      payload.logger.info(`Removed ${oldPosts.docs.length} old real-paper seeds`)
    }

    /* Upsert members by slug (create if missing; patch photo if empty) */
    for (const m of seedMembers) {
      const { roleLabel, ...rest } = m
      const existing = await payload.find({
        collection: 'members',
        where: { slug: { equals: rest.slug } },
        limit: 1,
      })
      if (existing.docs.length) {
        const doc = existing.docs[0] as { id: string | number; photo?: string | null }
        if (rest.photo && !doc.photo) {
          await payload.update({
            collection: 'members',
            id: doc.id,
            data: { photo: rest.photo },
          })
          payload.logger.info(`Patched photo for ${rest.slug}`)
        }
        continue
      }
      const role = roleLabel ? roleIdByLabel.get(roleLabel) : undefined
      await payload.create({
        collection: 'members',
        data: {
          ...rest,
          ...(role ? { role } : {}),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      })
      payload.logger.info(`Seeded member ${rest.slug}`)
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

    /* Upsert posts by slug */
    for (const post of seedPosts) {
      const { tagLabel, ...rest } = post
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: rest.slug } },
        limit: 1,
      })
      if (existing.docs.length) continue
      const tag = tagLabel ? tagIdByLabel.get(tagLabel) : undefined
      await payload.create({
        collection: 'posts',
        data: {
          ...rest,
          ...(tag ? { tag } : {}),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      })
      payload.logger.info(`Seeded post ${rest.slug}`)
    }

    /* Globals — only seed if empty (never overwrite edits) */
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
