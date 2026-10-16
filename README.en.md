<div align="center">

# SkyUI

**Less, but better.**

A monochrome (black & white) UI component library and interactive showcase for React.
Copy the source — no npm package, no icon library, zero component dependencies.

[![Release](https://img.shields.io/github/v/release/SkyBiuBiu/imskyui?style=flat-square&labelColor=202020)](https://github.com/SkyBiuBiu/imskyui/releases)
[![CI](https://github.com/SkyBiuBiu/imskyui/actions/workflows/ci.yml/badge.svg?style=flat-square)](https://github.com/SkyBiuBiu/imskyui/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-202020?style=flat-square&logo=github&logoColor=white)](https://skybiubiu.github.io/imskyui/)
[![License: MIT](https://img.shields.io/badge/License-MIT-202020?style=flat-square)](LICENSE)

**66** components & scenarios · **66** components & utilities · **2** themes · **18** HTTP status pages · **0** dependencies

[Live demo](https://skybiubiu.github.io/imskyui/) · [README (中文)](README.md) · [Component API](docs/components.md) · [Changelog](CHANGELOG.md) · [MIT License](LICENSE)

</div>

---

## What is this

SkyUI is not an installable package — it is a **copy-paste design language**. You take two files (`ui.tsx` + `ui.css`) into your React project and own the code.

- 66 reusable components & utilities (zero icon dependency, zero chart library):
  - **Typography & containers (6):** `Title`, `Text`, `Paragraph`, `Kbd`, `Card`, `Label`
  - **Base (12):** `Button`, `Input`, `Switch`, `Badge`, `Avatar`, `Checkbox`, `Select`, `Textarea`, `Alert`, `Skeleton`, `EmptyState`, `HttpStatusPage`
  - **Overlays (8):** `Tooltip`, `HoverCard`, `Dropdown`, `Popover`, `Modal`, `Drawer`, `ToastProvider`, `useToast`
  - **Selection (5):** `Segmented`, `RadioGroup`, `Toggle`, `ToggleGroup`, `Rate`
  - **Navigation (5):** `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`, `Steps`
  - **Data & layout (14):** `Progress`, `Slider`, `AvatarGroup`, `Tag`, `Table`, `Statistic`, `Timeline`, `Descriptions`, `Divider`, `Stack`, `Container`, `Grid`, `GridItem`, `Carousel`
  - **Forms & commands (5):** `useForm`, `FormItem`, `Command`, `Calendar`, `DatePicker`
  - **Charts & metrics (8):** `Sparkline`, `LineChart`, `Gauge`, `Meter`, `Counter`, `ThresholdLegend`, `SearchInput`, `FilterChips`
  - **Config (3):** `ConfigProvider`, `useSkyUIConfig`, `Spin`
- Optional full scenarios: form validation, multi-step form, file upload, data table, skeleton states, breadcrumbs
- 18 HTTP status pages (200 → 504), including a 429 with retry countdown
- Charts are hand-written SVG / CSS too — line chart, sparkline, gauge, threshold meter and animated counter ship with no charting dependency
- Light/dark theme via a single CSS class; all visuals drawn in CSS, zero image assets

## The 66-card gallery

The showcase gallery is organized into 6 categories — **66 cards** in total, with keyword search and grid / list views:

| Category | Cards | Contents |
| --- | --- | --- |
| **Base** | 15 | Buttons, Tabs, Badges, Accordion, Tooltip, Dropdown, Divider, Typography, Card, Segmented, Toggle, Popover, HoverCard, Grid, ConfigProvider |
| **Forms** | 11 | Inputs, selection controls, progress & slider, contact form, multi-step form, settings, file upload, RadioGroup, Rate, Calendar, DatePicker |
| **Feedback** | 6 | Notifications & Toast, dialog, drawer, data states, Spin, command palette |
| **Data display** | 14 | Profile card, data overview, avatars, data table, mini table, statistic, timeline, descriptions, carousel, LineChart, Sparkline, Gauge & Meter, Counter, Search & Filter |
| **Navigation** | 2 | Breadcrumb & pagination, steps |
| **HTTP pages** | 18 | Every status code from 200 to 504 |

## Requirements

- **React 18+** only (uses `useId`; the showcase site runs on React 19). No Lucide, no other runtime dependencies.

## Quick start

```bash
# Copy the 4 source files into your project — no git history, no install
npx degit SkyBiuBiu/imskyui/src/components src/components
```

Or download just the base pair:

```bash
mkdir -p src/components
curl -fsSL -o src/components/ui.tsx https://raw.githubusercontent.com/SkyBiuBiu/imskyui/main/src/components/ui.tsx
curl -fsSL -o src/components/ui.css https://raw.githubusercontent.com/SkyBiuBiu/imskyui/main/src/components/ui.css
```

Source files live at a fixed path in this repo: `src/components/`. To pin a version, replace `main` in any raw URL with a release tag.

## Usage

```tsx
import { Button, Input, HttpStatusPage } from './components/ui'

<Button>Start creating</Button>
```

Full props reference for every component: **[docs/components.md](docs/components.md)**.

- **Dark theme:** add the `skyui-theme-dark` class to any outer container.
- **Customize:** edit the `--skyui-*` CSS variables in `ui.css` (colors, radii, spacing).
- **Scenarios (optional):** import from `./components/scenarios` — `ContactFormDemo`, `DataTableDemo`, `HttpDemo`, `httpScenarios`, and more. These are self-contained demos with sample data and local-only validation; wire your own submit logic when adopting them.

```tsx
import { HttpStatusPage } from './components/ui'

<HttpStatusPage code={404} title="Page not found" description="This page went blank." />
```

## Run the showcase locally

Requires **Node.js 22+** and **pnpm**.

```bash
pnpm install
pnpm dev   # http://localhost:3000
```

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server (port 3000) |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm test` | vitest unit tests |
| `pnpm build` | Production build (generates `routeTree.gen.ts`, which typecheck depends on) |
| `pnpm build:pages` | Static build for GitHub Pages (`/imskyui/` base + prerendered route; output `dist/client`) |
| `pnpm capture` | Re-capture every `docs/images/` screenshot listed in the README (Playwright) |
| `pnpm release:check` | Pre-release gate (version consistency + typecheck + tests + build) |
| `pnpm release` | Ship a release: verify → annotated tag → GitHub Release |

Versions follow SemVer and live in exactly two places (`package.json` and `src/version.ts`), kept in sync by `pnpm check:version`. CI runs build → typecheck → tests → version consistency on every push and PR, so a drifting version number cannot be merged.

The build outputs `dist/client` (client) and `dist/server` (SSR) — platform-neutral, deployable to Vercel, Cloudflare, Netlify, or your own Node server.

Prefer not to run it locally? Visit the live demo: **[skybiubiu.github.io/imskyui](https://skybiubiu.github.io/imskyui/)** — built and deployed by `.github/workflows/pages.yml` on every push to `main`.

## License

[MIT](LICENSE) — free to copy, modify, and use commercially. Keep the copyright notice.
