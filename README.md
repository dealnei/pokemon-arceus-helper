# Hisui Field Guide

**An unofficial Pokédex and strategy-based team builder for Pokémon Legends: Arceus.**

Browse the **242 entries in the Hisui Pokédex**, compare recommended Natures, find evolution requirements, and plan teams using a design inspired by the game's expedition journal.

> **Project:** [pokemon-arceus-helper](https://github.com/dealnei/pokemon-arceus-helper)  
> **Website:** [dealnei.github.io/pokemon-arceus-helper](https://dealnei.github.io/pokemon-arceus-helper/) *(available after GitHub Pages is enabled and deployed)*

## Features

| Pokédex | Team Lab |
| --- | --- |
| Search Pokémon by name, evolution or location | Start with one or more Pokémon and build a team of up to six |
| Filter by type, rarity and recommended Nature | Get ranked partner suggestions with explanations |
| See the top three recommended Natures (Italian and English) | Compare **Balanced**, **High Damage**, **Quick Turns**, **Survivability** and **Capture Team** strategies |
| Check evolutions, locations, types and base stats | Review shared weaknesses, coverage and team roles |
| Track caught Pokémon and favorites | Auto-complete the remaining team slots |
| Export the Pokédex and your selections to CSV | Optionally limit suggestions to caught Pokémon or include postgame legendaries |

The interface works on desktop and mobile and is styled with parchment-like panels and Hisui-inspired colors.

## Getting started

### Use the website

Once GitHub Pages is configured, open:

**https://dealnei.github.io/pokemon-arceus-helper/**

You can use the Pokédex without installing anything. An internet connection is needed to load external Pokémon datasets on the first visit.

### Run locally

This is a **static HTML/CSS/JavaScript project**. It has no build step, package manager or backend.

Clone the repository:

```bash
git clone https://github.com/dealnei/pokemon-arceus-helper.git
cd pokemon-arceus-helper
```

Start a local web server:

```bash
python3 -m http.server 8000
```

Open **http://localhost:8000** in your browser.

You can also open `index.html` directly, but a local server is recommended for consistent browser behavior and service-worker support.

## Using Team Lab

1. Select **Team Lab** in the website header.
2. Search for and add one or more Pokémon you want to keep.
3. Select a strategy: **Balanced**, **High Damage**, **Quick Turns**, **Survivability**, or **Capture Team**.
4. Review suggested partners and read the explanation of each recommendation.
5. Add suggestions individually, or select **Complete my team** to fill empty slots.
6. Change the strategy or team members to compare alternative builds.

**How recommendations are calculated:** a rule-based scoring system considers type matchups, offensive coverage, shared weaknesses, base stats, physical/special balance, Speed, bulk and (for capture teams) catching utility. It explains why a Pokémon is recommended. Auto-completion adds candidates iteratively based on the current team.

**Important:** the engine does **not** simulate battles, calculate damage for specific movesets, or guarantee an optimal team. Nature recommendations are general guidance and can change with your chosen moves.

## Deploy to GitHub Pages

1. Open this repository's [Pages settings](https://github.com/dealnei/pokemon-arceus-helper/settings/pages).
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose **main** and **/ (root)**, then select **Save**.
4. Wait for the Pages deployment to finish, then visit [the website](https://dealnei.github.io/pokemon-arceus-helper/).

The entry point is `index.html` in the repository root. The app uses relative links for its local assets, so it supports GitHub Pages project URLs.

## Project structure

```text
pokemon-arceus-helper/
├── index.html         # Pokédex, UI styles, and Team Lab logic
├── favicon.svg        # Website icon
├── site.webmanifest   # Home-screen installation metadata
├── sw.js              # Service worker for caching local app files
├── robots.txt         # Search-engine crawler rules
├── .nojekyll          # Serve the site directly with GitHub Pages
└── README.md          # Project documentation
```

## Data sources and limitations

- **Hisui Pokédex entries, locations and evolution data:** [Insektaure/pkDex](https://github.com/Insektaure/pkDex).
- **Base stats:** [lgreski/pokemonData](https://github.com/lgreski/pokemonData).
- **Pokémon artwork/sprites:** loaded from external public Pokémon image endpoints.
- **Nature rankings, rarity labels and team recommendations:** application-level estimates or heuristics; **not official encounter rates, rankings or competitive calculations**.
- **Availability:** some species, items and encounters require story progress, distortions, postgame access or particular conditions. Check special evolution/form requirements in-game.

Pokémon datasets and sprites are fetched from third-party services. Initial loading requires internet access; after the app has loaded, some data and website files can be served from browser caches. Images and external sources may still require a connection.

Your **caught, favorite and team selections are saved locally in your browser**. There is no login or cloud synchronization; clearing browser storage may erase those selections.

## Contributing

Suggestions and corrections are welcome. Open a [GitHub issue](https://github.com/dealnei/pokemon-arceus-helper/issues) with the Pokémon name, the incorrect behavior or information, and a reliable game-specific source when applicable.

## Disclaimer

This is a non-commercial, **unofficial fan project** and is not affiliated with or endorsed by Nintendo, Game Freak or The Pokémon Company. Pokémon and Pokémon Legends: Arceus are trademarks and intellectual property of their respective owners.
