# packages/design

The bridge look, written down once so the website and the app match.

**Status:** reference only. Later this becomes a `tokens.ts` both apps import.

## Colors

| Name | Value | Use |
|---|---|---|
| coral | `#ff7974` | first logo dot, highlights |
| periwinkle | `#8799d5` | second logo dot, focus outlines |
| text | `#000000` | headings and body |
| text-soft | `#3a3a3a` | mono body copy |
| text-muted | `#6b6b6b` | labels, captions |
| line | `#d9d9d9` | dividers, borders |
| bg | `#ffffff` | page background (the app screens are black) |

## Type

- **Alte Haas Grotesk** (regular 400, bold 700) for headlines and body. Self-hosted; files in `apps/web/public/fonts`.
- **Space Mono** (400, 700) for small text, labels and buttons. Free on Google Fonts.
- House style is lowercase for headings and UI labels.

## Logo

Two overlapping dots (coral, then periwinkle on top, overlapping by about 22% of a dot's width) followed by the wordmark "bridge" in Alte Haas Grotesk. The website builds it in code (`Logo` in `apps/web/app/page.tsx`, styles under `.logo` in `apps/web/app/globals.css`).
