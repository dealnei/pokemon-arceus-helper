# Hisui Field Guide — React + TypeScript

**Active development branch:** `refactor/react-typescript-vite`

An unofficial, fan-made Pokémon Legends: Arceus Pokédex and team builder. Migrated from a single HTML file to React, TypeScript, Vite and Mantine, while retaining the Hisui visual design.

## Run and test locally

```bash
npm install
npm run dev
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

The production static files are generated in `dist/`. React **does not need a backend**.

## Publish ONE GitHub Pages site

The target website is **https://dealnei.github.io/pokemon-arceus-helper/**. It serves the React version at the normal URL; there is **no /preview/** or separate hosting provider.

**Important:** GitHub Pages → **Deploy from a branch** cannot serve this repository's React source files: source `index.html` references `/src/main.tsx`, which GitHub Pages cannot compile and returns 404.

To publish this branch:

1. In [repository Settings → Pages](https://github.com/dealnei/pokemon-arceus-helper/settings/pages), set **Build and deployment → Source → GitHub Actions** instead of **Deploy from a branch**.
2. Open [Actions](https://github.com/dealnei/pokemon-arceus-helper/actions) and select **Build and deploy Hisui React**. Run the workflow on branch `refactor/react-typescript-vite` (or push a commit to that branch).
3. Wait for both **build** and **deploy** jobs to succeed. The workflow uploads **only `dist/`** and serves React at https://dealnei.github.io/pokemon-arceus-helper/.

This workflow runs unit and browser rendering tests before deployment. **The source code on `main` remains unchanged.** Changing Pages to GitHub Actions changes which *built website* is published at the single existing URL, not which branch contains the original code.

If a protected `github-pages` environment restricts deployment branches, allow `refactor/react-typescript-vite`.

The old website used a service worker, so a previously visited browser may need a hard refresh if it still shows cached content. Existing `hisui-v3-*` browser progress keys remain the same, and deployment to the same GitHub Pages origin preserves local storage.

## Project layout

```text
src/
  App.tsx                     State, navigation and CSV export
  main.tsx                    React root and Mantine theme
  types.ts                    Shared types
  styles.css                  Hisui styling and responsive layout
  components/
    PokemonTable.tsx          Sortable/filterable Pokédex
    PokemonDetails.tsx        Desktop sidebar / mobile drawer
    EvolutionChain.tsx        Evolution links
    PokemonParts.tsx          Sprites, grades, types
    TeamLab.tsx               Recommendations and team swaps
  data/legacy.ts              Game data, acquisition, Natures, grades
  teamEngine.ts               Team scoring and type matchups
e2e/render.spec.ts            Chromium rendering/navigation tests
```

## Features

- 242 Pokémon, location and evolution information, recommended Italian Natures
- S–F investment grades, individually sortable and filterable Pokédex columns
- Team Lab strategy, coverage, recommendations and swaps
- CSV export; locally saved caught, favorites and team selections
- Mobile details drawer with scrolling

Game data from [Insektaure/pkDex](https://github.com/Insektaure/pkDex) and [lgreski/pokemonData](https://github.com/lgreski/pokemonData); first online access is required. Pokémon names and artwork remain the property of their respective rights holders. This is an unofficial fan project.
