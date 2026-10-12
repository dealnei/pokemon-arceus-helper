# Hisui Field Guide

A fan-made Pokédex and strategy-aware team builder for **Pokémon Legends: Arceus**, styled like a Hisui expedition journal.

## Features

- Search and filter all **242 Hisui Pokédex species**
- Browse evolution requirements, encounter locations, estimated rarity and recommended Italian Natures
- Team Lab: add one or more Pokémon, select a strategy, explain recommendations, or auto-complete a six-Pokémon team
- Team coverage and weakness summaries, favorite/caught tracking, CSV export
- Responsive design and optional home-screen installation

## Run locally

Open `index.html` in your browser, or run a static HTTP server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish via GitHub Pages

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Set branch to **main**, folder to **/(root)**, and save.
4. Your site should become available at `https://<username>.github.io/<repository>/` once Pages deploys.

All app routes and PWA assets use relative URLs so GitHub Pages subdirectory hosting works.

## Sources and caveats

The app loads game data from [Insektaure/pkDex](https://github.com/Insektaure/pkDex), base stats from [lgreski/pokemonData](https://github.com/lgreski/pokemonData), and sprite images from public Pokémon sprite endpoints. Internet access is needed on first visit; subsequent visits can use cached data. Team recommendations and Nature rankings are heuristic suggestions, not an official competitive tier list. Rarity is approximate, not a published encounter rate. Your caught/team/favorites are stored locally in the browser, not synced to GitHub.

*Unofficial fan project. Pokémon and Pokémon Legends: Arceus belong to Nintendo, Game Freak, and The Pokémon Company. This project is not affiliated with or endorsed by them.*