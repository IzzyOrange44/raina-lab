# Raina Lab website

Live at **https://raina-lab.vercel.app** · Repo: `IzzyOrange44/raina-lab`

Next.js 16 + Keystatic (git-based CMS). Deploys on Vercel. No database.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Keystatic** — content lives as YAML/MDoc files in `content/`, edits happen through an admin UI at `/keystatic`, saves commit back to GitHub in production
- **Tailwind CSS v4** + `@tailwindcss/typography` for rich-text rendering

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3100](http://localhost:3100) for the site and [http://localhost:3100/keystatic](http://localhost:3100/keystatic) for the admin UI. In dev, Keystatic writes directly to the local filesystem — no GitHub auth needed.

## Content model

Collections (multiple entries each):

- `members` — current people and alumni (differentiated by `status` field)
- `researchAreas` — research themes, ordered manually via `order`
- `posts` — news items, sorted by date
- `roles` — role labels (PhD Student, Postdoc, etc.) referenced by members
- `tags` — tag labels (Paper, Award, etc.) referenced by posts

Singletons (single editable doc each): `home`, `about`, `contact`.

See [keystatic.config.ts](./keystatic.config.ts) for the full schema.

## Editing content (PI workflow)

1. Visit https://raina-lab.vercel.app/keystatic
2. Sign in with GitHub (must be a collaborator on `IzzyOrange44/raina-lab`)
3. Add or edit content via forms
4. Hit **Save** — Keystatic commits to the repo and Vercel rebuilds within ~60s

## Deploying / OAuth setup

The site is already deployed. To complete the Keystatic admin setup (one-time GitHub App creation), see [DEPLOY.md](./DEPLOY.md).

## Project structure

```
keystatic.config.ts          # CMS schema
content/                     # all editable content (committed)
  members/        {slug}.mdoc
  research-areas/ {slug}.mdoc
  posts/          {slug}.mdoc
  roles/          {slug}.yaml
  tags/           {slug}.yaml
  pages/          home.yaml, about.mdoc, contact.yaml
public/images/               # uploaded images live here
src/
  app/                       # Next.js routes
    page.tsx                 # /
    about/ research/ people/ alumni/ news/ contact/
    keystatic/               # admin UI
    api/keystatic/           # Keystatic API handler
  components/Nav.tsx         # nav with active state
  lib/reader.ts              # typed helpers over the Keystatic reader
```

## Notes on the file layout

Keystatic's file conventions aren't obvious — they bit me during setup:

- Collections without a document field use flat `{slug}.yaml` files (not `{slug}/index.yaml`)
- Singleton paths that don't end in `/` use flat `{path}.{ext}` files
- `fields.document` defaults to `.mdoc` extension, not `.mdx`

If a `reader.collections.X.all()` silently returns `[]` or `reader.singletons.X.read()` returns `null`, check extension and flat-vs-directory layout first.
