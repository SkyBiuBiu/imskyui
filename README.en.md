<div align="center">

# SkyUI

**Less, but better.**

A monochrome (black & white) UI component library and interactive showcase for React.
Copy the source — no npm package, no icon library, zero component dependencies.

**37** components & scenarios · **2** themes · **18** HTTP status pages · **0** dependencies

[README (中文)](README.md) · [Component API](docs/components.md) · [MIT License](LICENSE)

</div>

---

## What is this

SkyUI is not an installable package — it is a **copy-paste design language**. You take two files (`ui.tsx` + `ui.css`) into your React project and own the code.

- 12 reusable base components: `Button`, `Input`, `Switch`, `Badge`, `Avatar`, `Checkbox`, `Select`, `Textarea`, `Alert`, `Skeleton`, `EmptyState`, `HttpStatusPage`
- Optional full scenarios: form validation, multi-step form, file upload, data table, skeleton states, breadcrumbs
- 18 HTTP status pages (200 → 504), including a 429 with retry countdown
- Light/dark theme via a single CSS class; all visuals drawn in CSS, zero image assets

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

## License

[MIT](LICENSE) — free to copy, modify, and use commercially. Keep the copyright notice.
