# Portfolio

Personal portfolio site built with Vue 3 + Vite + Tailwind CSS, featuring custom theming, Lottie animations, and section-based layout.

## Stack

- Vue 3
- Vite
- Tailwind CSS
- GSAP
- Lottie
- Vue I18n (English/Japanese)

## Structure

- `src/main.js` bootstraps the app and global styles.
- `src/App.vue` composes the page from section components.
- `src/sections/` holds page sections (Home, About, Skills, Projects, Contact, etc.).
- `src/components/` holds reusable UI (Navbar, Footer, Background, ScrollIndicator).
- `src/assets/` holds images, Lottie JSON, and theme tokens (`style.css`).
- `src/i18n/` holds locale files.

## Setup

```sh
npm install
```

## Development

```sh
npm run dev
```

## Production build

```sh
npm run build
```
