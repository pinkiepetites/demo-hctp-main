# Project Context

## Overview

This repository is a React/Vite demo for a Vietnamese court case/petition
management workflow (`Hệ thống quản lý án`). It is currently a frontend-only
prototype: data is mocked in component files, there is no backend/API layer, and
most business flows are simulated with local React state.

Primary app entry:

- `index.html` mounts `#root`.
- `main.tsx` renders `./app/App.tsx`.
- The root project is the active app. The nested `ui-hctp-demo-main/` folder is
  a duplicate/snapshot; do not edit it unless the user explicitly asks to sync
  that copy.

## Tech Stack

- React 18, TypeScript, Vite 6.
- Tailwind CSS 4 via `@tailwindcss/vite`.
- Icons use `lucide-react`.
- Typography imports Google font `Be Vietnam Pro` in `styles/fonts.css`.

Useful commands:

- Install: `npm ci`
- Dev server: `npm run dev`
- Production build: `npm run build`
- Typecheck: `npx tsc --noEmit`

Current verification notes:

- `npm ci` followed by `npm run build` succeeds.
- Vite warns that the main JS chunk is over 500 kB after minification.
- `npx tsc --noEmit` currently fails because `app/components/ui/*` imports many
  shadcn/Radix-style dependencies that are not declared in `package.json`
  (`@radix-ui/*`, `class-variance-authority`, `clsx`, `tailwind-merge`,
  `react-hook-form`, `recharts`, etc.). Those UI files are mostly unused by the
  active app bundle, so Vite can still build.
- `npm ci` reports one moderate npm audit issue.

## Important Files

- `app/App.tsx`: Main SPA shell and most screens. This file is very large and
  contains shared primitives, sidebar navigation, mocked datasets, filters,
  OCR flow simulation, petition forms, merge/prototype flows, document template
  screens, judge assignment, approval flows, role switcher, and notifications.
- `app/Dashboard.tsx`: Home/dashboard widgets with mocked KPI and chart data.
- `app/components/DocumentNumberingModal.tsx`: Modal for document numbering,
  document tree validation, approval/signing fields, attached document handling,
  and preview templates.
- `app/components/ui/*`: Generated shadcn-like UI component library. Treat as
  dormant until dependencies are added or the app starts importing it.
- `app/components/figma/ImageWithFallback.tsx`: Simple image fallback wrapper.
- `styles/index.css`: Imports `fonts.css`, `tailwind.css`, and `theme.css`.
- `styles/theme.css`: Tailwind theme tokens and base element typography.
- `imports/*.png`: Design/reference image assets.
- `script*.py` and `search_*.txt`: Scratch/migration artifacts from previous
  editing sessions. They are not part of the runtime path.

## UI And Product Conventions

- Keep UI copy in Vietnamese.
- The interface is dense, operational, and enterprise-like. Prefer compact
  controls, small text, tables, toolbars, and restrained visual styling.
- Existing colors matter:
  - dark navy top/sidebar: `#1d2e4f`
  - primary crimson: `#8b1a1a`
  - light app background: `#eef1f5` / `#f4f7f9`
  - section borders: `#ddd` / `#e0e0e0`
- Reuse local primitives in `app/App.tsx` where possible: `Inp`, `Sel`, `Lbl`,
  `BtnPrimary`, `BtnSecondary`, `BtnAdd`, `Section`, `Tbl`, `Td`, `ActionBtn`.
- Avoid marketing/landing-page patterns. This app should feel like a working
  internal case-management tool.

## Business And State Notes

- `currentRole` is a local role switcher with values `can-bo`, `truong-phong`,
  `pho-vp`, and `lanh-dao`; several flows render differently by role.
- Notifications use `notiEmitter` and `triggerNoti` in `app/App.tsx`.
- OCR is simulated with timers, `ocrRunId`, and `ocrTimers`; clear timers when
  changing the OCR flow to avoid stale state updates.
- List filtering uses Vietnamese date strings (`dd/mm/yyyy`) for sample data and
  ISO date strings (`yyyy-mm-dd`) from `<input type="date">`.
- Most list/document behavior is driven by mocked arrays such as `SAMPLE_ROWS`,
  `LOAI_VAN_BAN_FILTER`, and document type option arrays.
- `DocumentNumberingModal` builds a three-level tree:
  document by receiving unit -> petition list -> individual petition.

## Editing Guidance

- Start every change by checking `git status --short`; this repo may have user
  edits.
- For `app/App.tsx`, search narrowly with `rg` before editing. The file is large
  enough that broad rewrites are risky.
- Keep changes scoped to the active root app unless explicitly asked to update
  `ui-hctp-demo-main/`.
- If introducing imports from `app/components/ui/*`, add the missing package
  dependencies first or expect `tsc`/runtime failures.
- Prefer preserving current mock-data flows over adding a backend abstraction
  unless the task explicitly asks for integration.
- After React changes, run `npm run build`. Run `npx tsc --noEmit` only as a
  known-failing diagnostic until the dormant UI dependency issue is resolved.
