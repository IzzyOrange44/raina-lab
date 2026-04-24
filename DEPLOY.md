# Deployment & GitHub OAuth setup

The site is deployed at **https://raina-lab.vercel.app** and the repo lives at **https://github.com/IzzyOrange44/raina-lab**.

Right now the public pages work, but the Keystatic admin at `/keystatic` cannot save edits because it uses placeholder GitHub OAuth credentials. To finish setup, Dr. Raina (or whoever owns the repo on GitHub) needs to create a GitHub App and plug its credentials into Vercel.

This is the one step that cannot be automated — GitHub requires a human to click through their UI and approve the new App.

## One-time OAuth setup

### 1. Create the GitHub App (recommended: Keystatic's wizard)

1. Visit https://raina-lab.vercel.app/keystatic in a browser.
2. Sign in with the GitHub account that owns `IzzyOrange44/raina-lab`.
3. Keystatic will detect that no GitHub App is configured and show a **"Create GitHub App"** button.
4. Click it. GitHub will open a pre-filled app creation page. Accept the defaults and click **Create GitHub App**.
5. GitHub redirects you back to Keystatic. It now shows you three values:
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
6. Leave this page open — you'll need those values in a moment.

### 2. Update Vercel env vars with the real values

Open a terminal in this project and run (paste the real values when prompted):

```bash
# Remove the placeholders
vercel env rm KEYSTATIC_GITHUB_CLIENT_ID production --yes
vercel env rm KEYSTATIC_GITHUB_CLIENT_SECRET production --yes
vercel env rm NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG production --yes

# Add the real values (you'll be prompted to paste each)
vercel env add KEYSTATIC_GITHUB_CLIENT_ID production
vercel env add KEYSTATIC_GITHUB_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG production
```

Or do it through the Vercel dashboard: https://vercel.com/izzyorange44s-projects/raina-lab/settings/environment-variables

### 3. Install the GitHub App on the repo

From the Keystatic wizard (or at https://github.com/settings/apps/<your-app-slug>/installations), click **Install** and grant access to the `raina-lab` repo specifically (not all repos).

### 4. Redeploy

```bash
vercel --prod --yes
```

Or just push any commit — Vercel auto-deploys main.

### 5. Test

Visit https://raina-lab.vercel.app/keystatic again. Sign in with GitHub. You should now be able to add members, news posts, and edit pages. Saving commits to `main` and Vercel rebuilds within ~60 seconds.

## Adding collaborators

To let other people (lab members, grad students) edit via Keystatic:

1. On GitHub, add them as collaborators on `IzzyOrange44/raina-lab` (Settings → Collaborators).
2. They visit https://raina-lab.vercel.app/keystatic and sign in with their own GitHub account.
3. Their edits commit under their GitHub identity — you get a clean history of who changed what.

## Local development

```bash
npm install
npm run dev
```

Keystatic writes directly to the local filesystem in dev — no GitHub auth needed. Changes you save there are normal git commits you push as usual.

## If something breaks

- **Build fails on Vercel with "Missing required config"**: env vars are missing or misnamed. Check `vercel env ls production`.
- **Admin UI throws auth error**: placeholder OAuth creds still in use. Complete steps 1–4 above.
- **Edits save locally but don't show on the live site**: Vercel rebuild is in progress. Check https://vercel.com/izzyorange44s-projects/raina-lab/deployments.
