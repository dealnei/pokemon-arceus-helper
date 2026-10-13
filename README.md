# Hisui Field Guide — React migration

**Migration branch:** `refactor/react-typescript-vite`

An unofficial, fan-made Pokémon Legends: Arceus Pokédex and strategic team builder. This branch ports the original single-file site to a maintainable component architecture while keeping the custom Hisui-inspired visual style.

## Stack

- **React 19 + TypeScript** — UI components and typed application state
- **Mantine 8** — accessible drawers, scroll areas, inputs, buttons and other primitives
- **Vite 7** — fast development and static builds
- **Cloudflare Pages** — separate React preview with its own URL, **no backend required**
- **GitHub Pages** — one deployment combines original `main` at the root and compiled React under `/preview/`

## Develop locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite.

```bash
npm run build
npm run preview
npm test
```

## Project layout

```text
src/
  App.tsx                     Application state and navigation
  types.ts                   Shared types
  main.tsx                   Mantine theme and React entry
  styles.css                 Hisui-themed design tokens and responsive layouts
  components/
    PokemonTable.tsx         Sortable/filterable 242-entry Pokédex
    PokemonDetails.tsx       Desktop sidebar / mobile Mantine drawer
    EvolutionChain.tsx       Linked evolution family
    PokemonParts.tsx         Sprites, grades, types
    TeamLab.tsx              Team recommendations and one-click swaps
  data/
    legacy.ts                Preserved PLA game data, Natures, grades and data loader
  teamEngine.ts              Pure scoring, matchup and replacement logic
```

## Existing features kept

- All 242 Pokémon, rarity and encounter information, evolution requirements
- S–F long-term team-investment grades and Italian recommended Natures
- Per-column sorting and filtering (including grade) and CSV export
- Caught/favorite/team tracking, stored locally
- Six-member Team Lab, selectable strategies, coverage analysis and replacements
- Mobile Pokémon-details drawer with independent scrolling

**Progress migration:** Uses the original `localStorage` keys `hisui-v3-caught`, `hisui-v3-starred` and `hisui-v3-team` to preserve selections.

Game data loads from [Insektaure/pkDex](https://github.com/Insektaure/pkDex) and [lgreski/pokemonData](https://github.com/lgreski/pokemonData), with browser caching of downloaded text. Initial online access is required.

## GitHub Pages: both sites from this one repository

**Do not switch GitHub Pages to “Deploy from a branch” on the React branch.** That serves source `index.html`, which requests `/src/main.tsx` and fails with a 404 because GitHub Pages does not compile React or TypeScript.

This branch contains `.github/workflows/pages.yml`. On each React-branch push it builds the React app with Vite, checks it in Chromium, copies the original static files from `main` to `site/`, copies the compiled `dist/` into `site/preview/`, and uploads and deploys both directories together.

1. Open repository **Settings → Pages → Build and deployment**.
2. Change **Source** from **Deploy from a branch** to **GitHub Actions**.
3. From the [Actions page](https://github.com/dealnei/pokemon-arceus-helper/actions), rerun the latest **Verify and publish Hisui Field Guide with React preview** workflow on `refactor/react-typescript-vite`. If a manual run isn't offered because the workflow is only on the feature branch, push another commit to that branch instead.
4. Check the **deploy** job succeeded. Once published, the exact locations are:
   - Original `main` site: [`/pokemon-arceus-helper/`](https://dealnei.github.io/pokemon-arceus-helper/)
   - Compiled React preview: [`/pokemon-arceus-helper/preview/`](https://dealnei.github.io/pokemon-arceus-helper/preview/)

This changes the **publication method**, not the code of `main`. If there is a Pages environment branch restriction, allow `refactor/react-typescript-vite` to deploy before rerunning.

Because both sites use the same origin, `localStorage` selections (caught, starred and team) can be shared between versions. The original service worker uses a network-first strategy and its scope may cover `/preview/`; a hard refresh may help if you see cached content. Merging is not required to use this preview.

## Independent Cloudflare Pages preview

Use a *separate Cloudflare Pages project* to host this React branch, without changing the existing GitHub Pages site.

1. Sign in at [Cloudflare](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize GitHub access to repository `dealnei/pokemon-arceus-helper`.
3. Select this repository, and for the **production branch of the Cloudflare preview project**, choose **`refactor/react-typescript-vite`** (not `main`).
4. Framework preset: **React (Vite)** or **None**. Build command: `npm run build`. Build output: `dist`. Root directory: repository root; leave it blank if already selected. Node.js: 22 is suitable. No environment variables or API tokens required.
5. Create a distinct project name, e.g. `hisui-react-preview` (if available), then click **Save and Deploy**.
6. Cloudflare will display the actual project URL under `*.pages.dev`. Each new commit to the React branch updates that separate site automatically.

**Important:** `main` continues to be published by GitHub Pages. The React preview's `localStorage` is isolated by domain: browser-saved favorites/caught/team on GitHub Pages **will not automatically appear** on the Cloudflare preview, despite using the same storage keys. This is expected browser-origin isolation, not data deletion.

Cloudflare project deployment from the React branch is the *production deployment for the isolated preview project*, not a production deployment of your existing site. No merge is needed.

## Credits

Unofficial fan project; not associated with Nintendo, Game Freak or The Pokémon Company. Pokémon character artwork and game names remain the property of their respective owners. Grades and team recommendations are heuristic suggestions rather than official rankings.

## Migration status

- Production build: passing on GitHub Actions.
- Automated tests: five passing data and team-engine checks.
- Chromium smoke tests: Pokédex render, Team Lab navigation and mobile details drawer passed in CI. Manual visual/device verification remains useful.
- Original Pokédex and Team Lab remain deployed from `main` until the PR is merged.
- Legacy game-data and scoring rules are preserved in extracted modules; tightening their TypeScript types is a follow-up task.
