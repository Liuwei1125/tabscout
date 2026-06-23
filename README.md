# TabScout

TabScout is a local-first Chrome MV3 extension for quickly searching, switching, and managing open tabs, history, bookmarks, and tab groups from a keyboard-first command panel.

The product direction is closer to Alfred, Raycast, Arc Command Bar, and Chrome's command surfaces than to a search-engine extension. It keeps browser data local and focuses on speed, dense scanning, and safe tab cleanup.

## MVP Features

- Search open tabs across all Chrome windows.
- Match title, domain, path, and full URL.
- Activate a selected tab and focus its window.
- Search Chrome history after optional permission is granted.
- Search Chrome bookmarks after optional permission is granted.
- Scope switching for All, Tabs, History, Bookmarks, and Groups.
- Prefix commands:
  - `t github` or `tab github`: tabs only
  - `h github` or `his github`: history only
  - `b github` or `bm github`: bookmarks only
- Search filters:
  - `site:github.com`
  - `title:react`
  - `url:pull`
  - `window:current`
  - `pinned:true`
- Tab actions:
  - switch to tab
  - close selected tab
  - close duplicate URL tabs
  - close same-domain tabs
  - close matching search-result tabs
  - undo recent close actions when tab snapshots can be restored
- Keyboard flow:
  - input autofocus
  - Up/Down to select
  - Enter to open/switch
  - Esc to close popup
  - Cmd/Ctrl + Enter to open actions
  - Cmd/Ctrl + Backspace to close the selected tab
- Theme support:
  - system
  - command dark
  - command light
  - high contrast
- i18n:
  - English
  - Simplified Chinese

## Privacy Model

The MVP is local-first:

- No AI.
- No cloud sync.
- No analytics SDK.
- No external service calls.
- No page-body indexing.
- No content scripts.
- No host permissions.
- History and bookmarks are requested only when the user uses those scopes.

Privacy policy:

- [docs/privacy-policy.md](docs/privacy-policy.md)
- Public URL for Chrome Web Store: `https://github.com/Liuwei1125/tabscout/blob/main/docs/privacy-policy.md`

## Permissions

Required permissions:

- `tabs`: read and manage open tabs, activate tabs, close tabs, and restore tabs for undo.
- `storage`: store theme, recent tab activity, and undo metadata locally.
- `tabGroups`: read tab group metadata for display.

Optional permissions:

- `history`: search Chrome history locally.
- `bookmarks`: search Chrome bookmarks locally.

## Tech Stack

- WXT
- Chrome Extension Manifest V3
- React
- TypeScript
- TailwindCSS
- lucide-react
- Vitest
- Playwright

## Development

Install dependencies:

```bash
npm install
```

Start WXT development mode:

```bash
npm run dev
```

Build the Chrome MV3 extension:

```bash
npm run build
```

Create a Chrome Web Store zip package:

```bash
npm run zip
```

Run verification:

```bash
npm run typecheck
npm run lint
npm run test
npm run e2e
```

## Local Chrome Installation

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click "Load unpacked".
5. Select `.output/chrome-mv3`.
6. Pin the extension from Chrome's toolbar if desired.
7. Open `chrome://extensions/shortcuts` to adjust the command shortcut.

Default command shortcut:

- macOS: `Command+Shift+Space`
- Other platforms: `Ctrl+Shift+Space`

## Project Structure

```text
src/entrypoints/popup/     Main command panel
src/entrypoints/options/   Settings and privacy page
src/entrypoints/background.ts
src/services/              Chrome API wrappers
src/search/                Query parsing, result creation, scoring, ranking
src/actions/               Tab cleanup and undo helpers
src/ui/components/product/ Product UI components
src/ui/themes/             Theme tokens
public/_locales/           Chrome i18n messages
tests/                     Unit tests
e2e/                       Playwright tests against built output
outputs/                   Product and planning documents
```

## Current MVP Boundary

Not included in this MVP:

- AI semantic search
- webpage body search
- full history indexing
- account login
- cloud sync
- session cloud backup
- heavy dashboard UI
- arbitrary website content scripts

## Manual QA

Use [docs/manual-qa-checklist.md](docs/manual-qa-checklist.md) before sharing a build with testers.

## Chrome Web Store Prep

Use [docs/chrome-web-store-prep.md](docs/chrome-web-store-prep.md) for listing copy, permission justifications, privacy practices, and release checks.

Release and store materials:

- [docs/store-listing.md](docs/store-listing.md): Chrome Web Store listing copy and permission justification text.
- [docs/privacy-policy.md](docs/privacy-policy.md): public privacy policy draft.
- [docs/release-0.1.0-beta.md](docs/release-0.1.0-beta.md): beta release readiness notes and final upload checklist.
- [docs/assets/store](docs/assets/store): generated screenshots and promotional tile after running `npm run assets:store`.
