# Mujtaba Shahid — Portfolio

Personal portfolio site. React + Vite + Tailwind, prepared for Cloudflare Pages so request-aware Markdown Negotiation can run at the edge.

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Use Cloudflare Pages:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Functions directory: `functions`

The old GitHub Pages workflow is disabled in `.github/workflows-disabled/` because GitHub Pages cannot vary `/` by the `Accept` request header.
