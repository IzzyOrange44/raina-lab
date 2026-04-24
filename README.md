# Raina Lab website

Next.js 16 + Keystatic (git-based CMS). Deploys on Vercel. No database.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Keystatic** for CMS — content lives as YAML/MDX files in `content/`, edits happen through an admin UI at `/keystatic`, saves commit to GitHub in production
- **Tailwind CSS v4**

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/keystatic](http://localhost:3000/keystatic) for the admin UI. In dev, Keystatic writes directly to the local filesystem — no GitHub auth needed.

## Content model

Collections (multiple entries each):

- `members` — current people and alumni (differentiated by `status` field)
- `researchAreas` — research themes, ordered manually via `order`
- `posts` — news items, sorted by date
- `roles` — role labels (PhD Student, Postdoc, etc.) referenced by members
- `tags` — tag labels (Paper, Award, etc.) referenced by posts

Singletons (single editable doc each): `home`, `about`, `contact`.

See [keystatic.config.ts](./keystatic.config.ts) for the full schema.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Create a Keystatic GitHub App: [follow the Keystatic setup guide](https://keystatic.com/docs/github-model-setup) and install it on your repo.
4. Copy `.env.local.example` to Vercel's environment variables and fill in:
   - `NEXT_PUBLIC_GITHUB_REPO_OWNER`
   - `NEXT_PUBLIC_GITHUB_REPO_NAME`
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET` (random string; `openssl rand -hex 32`)
5. Deploy.

## How the PI edits content

1. Visit `/keystatic` on the live site.
2. Sign in with GitHub (must be a collaborator on the repo).
3. Edit members, posts, research areas, or the about page via forms.
4. Hit **Save** — Keystatic commits to the repo and Vercel rebuilds within ~60s.

## Project structure

```
keystatic.config.ts          # CMS schema
content/                     # all editable content (committed)
  members/        {slug}/index.mdx
  research-areas/ {slug}/index.mdx
  posts/          {slug}/index.mdx
  roles/          {slug}/index.yaml
  tags/           {slug}/index.yaml
  pages/          home.yaml, about/index.mdx, contact.yaml
public/images/               # uploaded images live here
src/
  app/                       # Next.js routes
    page.tsx                 # /
    about/ research/ people/ alumni/ news/ contact/
    keystatic/               # admin UI
    api/keystatic/           # Keystatic API handler
  lib/reader.ts              # typed helpers over the Keystatic reader
```
