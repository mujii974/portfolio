# Deploy to Cloudflare Pages

This repo is prepared for Cloudflare Pages because Markdown Negotiation requires a request-aware runtime. GitHub Pages cannot vary the homepage response body by the `Accept` request header.

## Cloudflare Pages Settings

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Functions directory: `functions`

The Pages Function at `functions/[[path]].ts` handles Markdown Negotiation for `/` and `/index.html`. Static headers live in `public/_headers`.

## DNS Migration Checklist

1. Deploy the project to Cloudflare Pages and test the generated `pages.dev` URL.
2. In Cloudflare Pages, add the custom domain `mujii.dev`.
3. Remove old GitHub Pages DNS records:
   - A records pointing to GitHub Pages IPs.
   - CNAME records pointing to `username.github.io`.
4. Use the DNS record Cloudflare Pages provides for `mujii.dev`.
5. Purge Cloudflare cache if the old GitHub Pages HTML is still served.
6. Re-test the live domain after DNS propagation.

## Verification Commands

Test the `pages.dev` URL first:

```sh
curl -I -H "Accept: text/markdown" https://PROJECT_NAME.pages.dev/
curl -H "Accept: text/markdown" https://PROJECT_NAME.pages.dev/
curl -I -H "Accept: text/html" https://PROJECT_NAME.pages.dev/
```

Expected:

```txt
Content-Type: text/markdown; charset=utf-8
Vary: Accept
```

The markdown body should start with:

```md
# Mujtaba Shahid Portfolio
```

After adding `mujii.dev` to Cloudflare Pages:

```sh
curl -I -H "Accept: text/markdown" https://mujii.dev/
curl -H "Accept: text/markdown" https://mujii.dev/
curl -I -H "Accept: text/html" https://mujii.dev/
```

Expected:

- `Accept: text/markdown` returns markdown.
- `Accept: text/html` returns the Vite HTML app.
- Static assets under `/assets/` keep long cache headers.

## Rollback

The previous GitHub Pages workflow was preserved at `.github/workflows-disabled/deploy.github-pages.yml`. To roll back, move it back to `.github/workflows/deploy.yml` and restore `.github/workflows-disabled/CNAME.github-pages-disabled` to `public/CNAME`.
