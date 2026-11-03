# DevUI Studio — Personal Local-First UI Component Library

A private, local-first UI component library and discovery studio inspired by the user experience of [21st.dev](https://21st.dev).

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Motion**.

---

## Workflow

$$\text{DISCOVER} \longrightarrow \text{PREVIEW} \longrightarrow \text{CUSTOMIZE} \longrightarrow \text{COPY} \longrightarrow \text{INSTALL} \longrightarrow \text{REUSE}$$

---

## Key Capabilities

- **Local-First & Offline**: All component code, demos, and metadata live in the local filesystem. Zero cloud databases (no Supabase, Firebase, or external API keys needed).
- **Live Component Previews**: Inspect and interact with components embedded directly in cards and detail pages.
- **Responsive Viewports**: Switch between Desktop (100%), Tablet (768px), and Mobile (375px) in live previews.
- **Isolated Theme Sandbox**: Toggle light/dark preview states independently of the application theme.
- **One-Click Code & CLI Copying**: Quick copy buttons for component source code and CLI installation across `pnpm`, `npm`, `yarn`, and `bun`.
- **Self-Contained ZIP Export**: Download complete component packages with source, README, and dependency specifications in one click.
- **Interactive Playground (`/playground`)**: Live prop controls (variant, size, tilt angle, glare, status ping, content text) with real-time JSX generator.
- **Fuzzy Search & Discovery (`Cmd+K` / `Ctrl+K`)**: Instant search across component names, categories, tags, and dependencies.
- **Personal Collections & Favorites**: Star components and assemble custom project stacks saved to browser local storage.
- **Automated Registry Discovery**: Run `pnpm generate-registry` to automatically discover and index components from `packages/ui/src/`.

---

## Repository Architecture (pnpm Workspaces)

```
ui-library/
├── apps/
│   └── web/                                  # Next.js 15 Web Application
│       ├── src/
│       │   ├── app/                          # App Router routes
│       │   │   ├── page.tsx                  # Dashboard
│       │   │   ├── elements/page.tsx         # Component Catalog
│       │   │   ├── elements/[category]/      # Category browser
│       │   │   ├── components/[slug]/        # Detail view & live sandbox
│       │   │   ├── animations/page.tsx       # Animation & physics engine
│       │   │   ├── sections/page.tsx         # Website section layouts
│       │   │   ├── templates/page.tsx        # Multi-component templates
│       │   │   ├── product-kits/page.tsx     # Domain UI kits
│       │   │   ├── favorites/page.tsx        # Starred components
│       │   │   ├── collections/page.tsx      # Custom user stacks
│       │   │   ├── recent/page.tsx           # History tracker
│       │   │   ├── references/page.tsx       # Design tokens & docs
│       │   │   ├── experiments/page.tsx      # R&D lab
│       │   │   ├── playground/page.tsx       # Interactive prop workbench
│       │   │   └── settings/page.tsx         # Settings & Git backup
│       │   ├── components/
│       │   │   ├── layout/                   # Header, Sidebar, CommandMenu
│       │   │   └── preview/                  # ComponentCard, CodeViewer
│       │   ├── lib/                          # Storage, Categories, ZIP export
│       │   └── registry/                     # Central generated registry
├── packages/
│   └── ui/                                   # Standalone Component Library (@ui-library/ui)
│       └── src/
│           ├── buttons/                      # animated-button, magnetic-button, shimmer-button
│           ├── inputs/                       # floating-input
│           ├── cards/                        # tilt-card, bento-grid, spotlight-card
│           ├── badges/                       # status-badge
│           ├── navigation/                   # floating-dock, tabs-slider
│           ├── animations/                   # text-shimmer
│           ├── data-display/                 # terminal-window, stats-card
│           └── sections/                     # hero-geometric
└── scripts/
    └── generate-registry.ts                  # Metadata crawler & indexer
```

---

## Quickstart

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Generate Component Registry
```bash
pnpm generate-registry
```

### 3. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite
```bash
pnpm test
```

### 5. Production Build
```bash
pnpm build
```

---

## Adding a New Component

Every component lives in its own folder under `packages/ui/src/<category>/<component-name>/`:

1. Create folder: `packages/ui/src/buttons/my-button/`
2. Create component files:
   - `my-button.tsx`: Component implementation
   - `my-button.demo.tsx`: Live demo with example props
   - `my-button.test.tsx`: Vitest unit tests
   - `meta.json`: Component metadata (name, slug, tags, dependencies, status)
   - `README.md`: Documentation and usage instructions
   - `index.ts`: Module export
3. Re-run registry crawler:
   ```bash
   pnpm generate-registry
   ```
The component will instantly appear in the discovery grid, search dialog, category browser, and detail view!

---

## Private GitHub Backup Compatibility

To back up your library to a private GitHub repository:

```bash
# Initialize git if needed
git init

# Stage all files
git add .

# Create initial commit
git commit -m "feat: personal local-first component library"

# Connect to private GitHub remote
git remote add origin git@github.com:your-username/private-ui-library.git

# Push main branch
git branch -M main
git push -u origin main
```
