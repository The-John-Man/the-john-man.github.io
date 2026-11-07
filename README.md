# John Manuel — portfolio

Personal portfolio site built with Next.js. Hosted on Vercel.

## Edit the content

Everything you'd want to change lives in [`content/site.ts`](content/site.ts):

- `profile`: name, tagline, about text, and links (leave a link as `""` to hide it)
- `projects`: shipped projects shown with a screenshot (put images in `public/projects/`)
- `inTheWorks`: projects you're still building (move one to `projects` when it ships)
- `skills`: the skill lists in the About section

Colors and fonts are the tokens at the top of [`app/globals.css`](app/globals.css).

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

Import this repo at https://vercel.com/new. Vercel detects Next.js and redeploys on every push to `main`.
