# Hisui Field Guide — React migration

**Migration branch:** \`refactor/react-typescript-vite\`

An unofficial, fan-made Pokémon Legends: Arceus Pokédex and strategic team builder. This branch ports the original single-file site to a maintainable component architecture while keeping the custom Hisui-inspired visual style.

## Stack

- **React 19 + TypeScript** — UI components and typed application state
- **Mantine 8** — accessible drawers, scroll areas, inputs, buttons and other primitives
- **Vite 7** — fast development and static builds
- **GitHub Pages** — hosting compiled HTML, CSS and JavaScript; **no backend required**

## Develop locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Open the local address printed by Vite.

\`\`\`bash
npm run build
npm run preview
npm test
\`\`\`

## Project layout

\`\`\`text
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
\`\`\`

## Existing features kept

- All 242 Pokémon, rarity and encounter information, evolution requirements
- S–F long-term team-investment grades and Italian recommended Natures
- Per-column sorting and filtering (including grade) and CSV export
- Caught/favorite/team tracking, stored locally
- Six-member Team Lab, selectable strategies, coverage analysis and replacements
- Mobile Pokémon-details drawer with independent scrolling

**Progress migration:** Uses the original \`localStorage\` keys \`hisui-v3-caught\`, \`hisui-v3-starred\` and \`hisui-v3-team\` to preserve selections.

Game data loads from [Insektaure/pkDex](https://github.com/Insektaure/pkDex) and [lgreski/pokemonData](https://github.com/lgreski/pokemonData), with browser caching of downloaded text. Initial online access is required.

## GitHub Pages deployment

This is now a **built** frontend application. The \`vite.config.ts\` base is \`/pokemon-arceus-helper/\`. GitHub Pages must use **GitHub Actions** as its deployment source after merging to \`main\`; serving the repository root directly will not work for Vite source files.

The workflow in \`.github/workflows/pages.yml\` builds the site on pushes to the migration branch for validation, and deploys only from \`main\`. The current main website is untouched until you explicitly merge.

## Credits

Unofficial fan project; not associated with Nintendo, Game Freak or The Pokémon Company. Pokémon character artwork and game names remain the property of their respective owners. Grades and team recommendations are heuristic suggestions rather than official rankings.
