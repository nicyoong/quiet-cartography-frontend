# Quiet Cartography (Frontend-only demo)

A modern, minimal editorial blog template built with **HTML + CSS + vanilla JS**.

## Features
- Light/Dark theme toggle (saved in `localStorage`, system-aware)
- Blog index rendered from a small JS dataset
- Category filtering + search
- Post template with reading progress bar
- Accessible focus states and semantic markup

## Run locally
Because this uses ES modules, use a small local server:

```bash
# from the project root
python -m http.server 8080
```

Then open:
- http://localhost:8080/

## Deploy
Works well on GitHub Pages / Netlify / Vercel as a static site.

## Customize
Edit blog content in:
- `assets/js/blogData.js`

Change styles in:
- `assets/css/*`
