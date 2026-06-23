# Release 0.1.0 Beta

Target: Chrome Web Store beta submission.

Package candidate:

```text
.output/tabscout-0.1.0-chrome.zip
```

## Scope

This release focuses on the MVP:

- Keyboard-first command panel.
- Open tab search across Chrome windows.
- History search after optional permission.
- Bookmark search after optional permission.
- Tab group context display.
- Tab switching, closing, duplicate cleanup, same-domain cleanup, search-result cleanup, and selected-tab bulk close.
- Undo for recent close actions when tabs can be recreated.
- Local-first privacy posture with no external services.

Not included:

- AI search.
- Webpage body indexing.
- Cloud sync.
- Session cloud backup.
- Heavy dashboard UI.
- Content scripts or host permissions.

## Verified Technical Posture

Current manifest generated at `.output/chrome-mv3/manifest.json`:

- Manifest version: 3
- Required permissions: `tabs`, `storage`, `tabGroups`
- Optional permissions: `history`, `bookmarks`
- Host permissions: none
- Content scripts: none
- Background: MV3 service worker
- Default popup: `popup.html`
- Options page: `options.html`
- Locales: `en`, `zh_CN`

Current zip contents:

- `manifest.json`
- `background.js`
- `popup.html`
- `options.html`
- bundled chunks and CSS
- icons: 16, 32, 48, 128 px
- `_locales/en/messages.json`
- `_locales/zh_CN/messages.json`

Checked exclusions:

- No `node_modules`
- No tests or e2e files
- No source TypeScript files
- No docs or work artifacts
- No source maps

## Verification Evidence

Fresh automated verification completed on 2026-06-16:

- `npm run typecheck` - passed
- `npm run lint` - passed
- `npm run test` - passed, 16 test files / 35 tests
- `npm run build` - passed, `.output/chrome-mv3`
- `npm run e2e` - passed, 6 Playwright tests
- `npm run assets:store` - passed, generated 3 screenshots and 1 small promotional tile
- `npm run zip` - passed, `.output/tabscout-0.1.0-chrome.zip` at 92.1 kB

Real extension QA evidence:

- `work/manual-qa-pregrant-real-extension-report.md`
- `work/toolbar-permission-gap-verification.md`

Real QA coverage includes:

- Popup opens from toolbar and focuses the input.
- Tab search, mixed search, and `t/h/b` prefix routing.
- History and bookmarks optional permission prompts from the real toolbar popup.
- History and bookmark result display after permission is granted.
- Keyboard selection.
- Local metadata preview.
- Opt-in tab multi-select.
- Bulk close skips pinned tabs.
- Undo restores tabs in the tested scenario.
- Options page privacy, permissions, and theme settings.
- Manifest privacy constraints: no host permissions and no content scripts.

## Store Submission Materials

Prepared:

- Store listing copy: `docs/store-listing.md`
- Privacy policy draft: `docs/privacy-policy.md`
- Store prep checklist: `docs/chrome-web-store-prep.md`
- Manual QA checklist: `docs/manual-qa-checklist.md`
- Store screenshots and promotional tile: `docs/assets/store/`
- Package candidate: `.output/tabscout-0.1.0-chrome.zip`

Still requires product-owner input before public submission:

- Final visual approval of screenshots and promotional tile.
- Screenshot language decision: the generated screenshots currently reflect the local Chinese UI while the default store listing is English. For a public English listing, capture English UI screenshots or add a localized Chinese listing.
- 1-2 days of real Chrome dogfood if the release is intended for public users instead of a closed beta.

Prepared public URLs after GitHub repository publication:

- Privacy policy: `https://github.com/Liuwei1125/tabscout/blob/main/docs/privacy-policy.md`
- Support: `https://github.com/Liuwei1125/tabscout/issues`

## Final Pre-Upload Commands

Run these immediately before uploading:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run e2e
npm run assets:store
npm run zip
unzip -l .output/tabscout-0.1.0-chrome.zip
```

Upload `.output/tabscout-0.1.0-chrome.zip`.
