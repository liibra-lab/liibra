█╗     ██╗██╗██████╗  █████╗    ████╗
██║     ██║██║██╔══██╗██╔══██╗ ██ ╔═██╗
██║     ██║██║██████╔╝██████╔╝ ███████║
██║     ██║██║██╔══██╗██╔══██╗ ██╔═╗██║
███████╗██║██║███████║██║  ██║ ██║ ║██║
╚══════╝╚═╝╚═╝╚══════╝╚═╝  ╚═╝ ╚═╝  ╚═╝

A [SvelteKit](https://svelte.dev/docs/kit) app deployed to
[Cloudflare Workers](https://developers.cloudflare.com/workers/) via
[`@sveltejs/adapter-cloudflare`](https://svelte.dev/docs/kit/adapter-cloudflare),
styled with [Tailwind CSS v4](https://tailwindcss.com).

## Requirements

- Node `22` (see `.nvmrc`)

## Develop

```sh
npm install
npm run dev          # Vite dev server
```

## Quality checks

```sh
npm run check        # wrangler types + svelte-check
npm run lint         # eslint
```

## Build & preview (Cloudflare Workers)

```sh
npm run build        # vite build -> .svelte-kit/cloudflare
npm run preview      # serve the built Worker locally via wrangler dev
```

Run `npm run gen` after editing `wrangler.jsonc` to refresh
`worker-configuration.d.ts`.

## Deploy

```sh
npm run deploy       # wrangler deploy
```

Deployment requires Cloudflare credentials (`CLOUDFLARE_API_TOKEN` /
`CLOUDFLARE_ACCOUNT_ID`) configured in the environment — never commit them.

## Project layout

- `src/routes/` — pages and layouts
- `src/lib/` — shared modules and assets
- `static/` — files served as-is
- `wrangler.jsonc` — Cloudflare Workers configuration (generated, Workers target)
- `vite.config.ts` — Vite + SvelteKit + Cloudflare adapter + Tailwind config
