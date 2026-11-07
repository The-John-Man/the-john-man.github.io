# John Manuel — portfolio

Personal portfolio site built with Next.js. Hosted on Vercel.

## Edit the content

Everything you'd want to change lives in [`content/site.ts`](content/site.ts):

- `profile`: name, tagline, about text, and links (leave a link as `""` to hide it)
- `skills`: the skill lists in the About section on the home page
- `projects`: shipped projects on /projects, shown with a screenshot (put images in `public/shots/`)
- `inTheWorks`: projects you're still building (move one to `projects` when it ships)
- `experience`: jobs and roles on /experience, newest first
- `aspirations` and `interests`: the /interests page

Search the file for `TODO` and `[` to find the placeholders still to fill in.

Colors and fonts are the tokens at the top of [`app/globals.css`](app/globals.css).

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

Import this repo at https://vercel.com/new. Vercel detects Next.js and redeploys on every push to `main`.
