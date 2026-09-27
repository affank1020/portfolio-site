# Affan Khan — Portfolio

[![CI](https://github.com/affank1020/portfolio-site/actions/workflows/ci.yml/badge.svg)](https://github.com/affank1020/portfolio-site/actions/workflows/ci.yml)

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

The app reads the following Contentful content types. All fields are optional except the identifying title/name field. The Projects category stays hidden until at least one published `workItem` exists.

### `portfolioHero`

- `firstName`, `lastName`, `tagline`, `description`

### `portfolioContact`

- `email`, `responseTime`, `githubUrl`, `linkedinUrl`

### `workItem`

Current Contentful fields:

- `title`, `year`, `summary`
- `tags`, `note`, `url`, `links`
- `image`, `gallery`
- `collection` (optional reference to `portfolioCollection`)

The app also supports the optional future fields `slug`, `body`, `role`, `outcomes`, `repositoryUrl`, and `liveUrl` if they are added to the model. Without a `slug`, one is generated from the title. The mapper accepts both `url` and the legacy `href` field ID. `links` is an optional JSON Object field shaped as `{ "items": [{ "label", "url", "type" }] }`.

`summary` appears in the XMB and supports Markdown. For a separate concise summary and longer case study, add `body` as a Long text field; it also supports Markdown and appears in the expanded XMB view. `/projects/[slug]` remains available as a shareable direct URL.

### `experienceItem`

- `company`, `role`, `period`, `description`
- `highlights`, `tags`, `accent`, `image`

### `blogPost`

- `title`, `slug`, `excerpt`, `publishedAt`
- `body`, `tags`, `heroImage`

Published posts appear in the Blog category and open inside the XMB; `/blog/[slug]` is the shareable direct URL. Legacy `/journal/[slug]` links redirect to the corresponding Blog URL. Until the first post exists, the interface displays a non-clickable “Writing, soon” placeholder.

### `portfolioCollection`

- `title`, `slug`, `section`, `description`, `order`, `image`

Set `section` to `projects` or `blog`, then reference the collection from a work item or blog post. Empty collections are hidden. Projects are ordered by their most recent year; for a range such as `2022-2024`, the ending year is used.

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
npm run typecheck
npm test
npm run test:coverage
npm run build
```

Run `npm run check` to execute linting, type-checking, and coverage-enforced unit tests together. The suite covers project ordering, Contentful mapping and failure fallbacks, collection grouping, and theme utilities. Coverage thresholds are 95% for lines, 75% for branches, and 100% for functions across the exercised application logic. The same checks run in GitHub Actions for pushes and pull requests, followed by a production build.
