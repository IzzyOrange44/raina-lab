import { config, fields, collection, singleton } from '@keystatic/core'

export default config({
  storage:
    process.env.NODE_ENV === 'development'
      ? { kind: 'local' }
      : {
          kind: 'github',
          repo: {
            owner: process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER ?? 'YOUR-GITHUB-ORG',
            name: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME ?? 'raina-lab',
          },
        },

  ui: {
    brand: { name: 'Raina Lab' },
  },

  collections: {
    members: collection({
      label: 'Members',
      slugField: 'name',
      path: 'content/members/*',
      format: { contentField: 'fullBio' },
      columns: ['name', 'role'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        photo: fields.image({
          label: 'Photo',
          directory: 'public/images/members',
          publicPath: '/images/members/',
        }),
        role: fields.relationship({ label: 'Role', collection: 'roles' }),
        featured: fields.checkbox({
          label: 'Featured (pin at top of People page)',
          defaultValue: false,
        }),
        shortBio: fields.text({ label: 'Short bio (one line)' }),
        joinedDate: fields.date({ label: 'Joined' }),
        email: fields.text({ label: 'Email' }),
        links: fields.object({
          scholar: fields.url({ label: 'Google Scholar' }),
          github: fields.url({ label: 'GitHub' }),
          website: fields.url({ label: 'Personal website' }),
          twitter: fields.url({ label: 'Twitter / X' }),
          linkedin: fields.url({ label: 'LinkedIn' }),
          orcid: fields.url({ label: 'ORCID' }),
        }),
        status: fields.conditional(
          fields.select({
            label: 'Status',
            options: [
              { label: 'Current', value: 'current' },
              { label: 'Alumni', value: 'alumni' },
            ],
            defaultValue: 'current',
          }),
          {
            current: fields.empty(),
            alumni: fields.object({
              endDate: fields.date({ label: 'End date' }),
              currentPosition: fields.text({
                label: 'Current position',
                description: 'e.g., "Assistant Professor at MIT"',
              }),
            }),
          },
        ),
        fullBio: fields.document({
          label: 'Full bio',
          formatting: true,
          links: true,
        }),
      },
    }),

    researchAreas: collection({
      label: 'Research Areas',
      slugField: 'title',
      path: 'content/research-areas/*',
      format: { contentField: 'body' },
      columns: ['title', 'order', 'featured'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        order: fields.integer({ label: 'Display order', defaultValue: 0 }),
        featured: fields.checkbox({
          label: 'Feature on home page',
          defaultValue: false,
        }),
        shortDescription: fields.text({
          label: 'Short description (for cards)',
          multiline: true,
        }),
        image: fields.image({
          label: 'Image',
          directory: 'public/images/research',
          publicPath: '/images/research/',
        }),
        relatedMembers: fields.array(
          fields.relationship({ label: 'Member', collection: 'members' }),
          {
            label: 'Related members',
            itemLabel: (p) => p.value ?? 'Select member',
          },
        ),
        body: fields.document({
          label: 'Full description',
          formatting: true,
          links: true,
          images: {
            directory: 'public/images/research',
            publicPath: '/images/research/',
          },
        }),
      },
    }),

    posts: collection({
      label: 'News',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'body' },
      columns: ['title', 'publishedDate', 'tag'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishedDate: fields.date({ label: 'Date' }),
        tag: fields.relationship({ label: 'Tag', collection: 'tags' }),
        excerpt: fields.text({
          label: 'Excerpt (shown in list)',
          multiline: true,
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        draft: fields.checkbox({
          label: 'Draft (hide from site)',
          defaultValue: false,
        }),
        body: fields.document({
          label: 'Body',
          formatting: true,
          links: true,
          images: {
            directory: 'public/images/posts',
            publicPath: '/images/posts/',
          },
        }),
      },
    }),

    roles: collection({
      label: 'Roles',
      slugField: 'label',
      path: 'content/roles/*',
      columns: ['label', 'order'],
      schema: {
        label: fields.slug({
          name: { label: 'Label (e.g., "PhD Student")' },
        }),
        order: fields.integer({ label: 'Display order', defaultValue: 0 }),
      },
    }),

    tags: collection({
      label: 'Post Tags',
      slugField: 'label',
      path: 'content/tags/*',
      schema: {
        label: fields.slug({ name: { label: 'Label' } }),
        color: fields.text({
          label: 'Badge color (optional, hex)',
          description: 'e.g., #3b82f6',
        }),
      },
    }),
  },

  singletons: {
    home: singleton({
      label: 'Home page',
      path: 'content/pages/home',
      schema: {
        tagline: fields.text({ label: 'Tagline (hero headline)' }),
        intro: fields.text({ label: 'Intro paragraph', multiline: true }),
        heroImage: fields.image({
          label: 'Hero image',
          directory: 'public/images/home',
          publicPath: '/images/home/',
        }),
      },
    }),

    about: singleton({
      label: 'About page',
      path: 'content/pages/about',
      format: { contentField: 'body' },
      schema: {
        mission: fields.text({ label: 'Mission statement', multiline: true }),
        affiliation: fields.text({ label: 'Institutional affiliation' }),
        body: fields.document({
          label: 'About body',
          formatting: true,
          links: true,
          images: true,
        }),
      },
    }),

    contact: singleton({
      label: 'Contact page',
      path: 'content/pages/contact',
      schema: {
        email: fields.text({ label: 'Email' }),
        address: fields.text({ label: 'Address', multiline: true }),
        mapEmbed: fields.url({ label: 'Google Maps embed URL' }),
        social: fields.object({
          twitter: fields.url({ label: 'Twitter / X' }),
          github: fields.url({ label: 'GitHub' }),
          linkedin: fields.url({ label: 'LinkedIn' }),
          bluesky: fields.url({ label: 'Bluesky' }),
          mastodon: fields.url({ label: 'Mastodon' }),
        }),
      },
    }),
  },
})
