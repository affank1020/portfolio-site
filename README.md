# Affan Khan — Portfolio

A PSP/XMB-inspired portfolio built with Next.js and Contentful. The desktop experience supports keyboard and pointer navigation; mobile uses a touch-friendly version of the same visual language.

## Local development

```bash
npm install
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001).

## Contentful setup

Add these values to `.env.local`:

```bash
CONTENTFUL_SPACE_ID=...
CONTENTFUL_DELIVERY_TOKEN=...
```

The app reads the following Contentful content types. All fields are optional except the identifying title/name field; local fallback content keeps the site usable while a model is being filled in.

### `portfolioHero`

- `firstName`, `lastName`, `tagline`, `description`

### `portfolioContact`

- `email`, `responseTime`, `githubUrl`, `linkedinUrl`

### `workItem`

- `title`, `slug`, `year`, `summary`, `body`
- `role`, `note`, `tags`, `outcomes`
- `href`, `repositoryUrl`, `liveUrl`
- `image`, `gallery`

`summary` stays concise in the XMB. `body` can be plain text or Contentful Rich Text and appears instantly in the expanded XMB view. `/projects/[slug]` remains available as a shareable direct URL.

### `experienceItem`

- `company`, `role`, `period`, `description`
- `highlights`, `tags`, `accent`, `image`

### `blogPost`

- `title`, `slug`, `excerpt`, `publishedAt`
- `body`, `tags`, `heroImage`

Published posts appear in the Journal category and open inside the XMB; `/journal/[slug]` remains available as a shareable direct URL. Until the first post exists, the interface displays a non-clickable “Writing, soon” placeholder.

## Interaction

- `←` / `→`: change category
- `↑` / `↓`: change item
- `Enter`: perform the contextual action shown on screen
- `Escape`: close expanded content or leave a Settings subsection
- Categories and items are also clickable and keyboard-focusable

Themes and reduced-motion preferences are available in the Settings category and persist locally.

## Checks

```bash
npm run lint
npm run build
```
