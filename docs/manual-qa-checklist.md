# Manual QA Checklist

Use this checklist after `npm run build` and before sharing an unpacked build or Chrome Web Store zip.

## Setup

- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run test`.
- [ ] Run `npm run build`.
- [ ] Run `npm run e2e`.
- [ ] Open `chrome://extensions`.
- [ ] Enable Developer mode.
- [ ] Load unpacked extension from `.output/chrome-mv3`.
- [ ] Pin the extension to the toolbar.
- [ ] Open `chrome://extensions/shortcuts` and confirm the shortcut is registered.

## Baseline Browser State

Prepare a realistic Chrome session:

- [ ] At least 30 open tabs.
- [ ] At least 2 Chrome windows.
- [ ] At least 3 tabs from the same domain.
- [ ] At least 2 exact duplicate URL tabs.
- [ ] At least 1 pinned tab.
- [ ] At least 1 tab group.
- [ ] At least 5 relevant history items.
- [ ] At least 5 relevant bookmarks across different folders.

## Popup Shell

- [ ] Toolbar click opens the command panel.
- [ ] Keyboard shortcut opens the command panel.
- [ ] Search input is focused by default.
- [ ] Popup uses compact row density.
- [ ] Text does not overlap at 680 x 560.
- [ ] The footer actions remain visible and usable.
- [ ] Esc closes the popup when the action menu is closed.
- [ ] Esc closes the action menu first when it is open.

## Scope Semantics

### All

- [ ] Empty input shows recent/open tab content, not a blank state.
- [ ] Typing a query mixes tabs, history, and bookmarks when optional permissions are granted.
- [ ] Tab results appear before history/bookmark results when scores are otherwise similar.

### Tabs

- [ ] Empty input shows open tabs.
- [ ] Query searches all windows.
- [ ] Same-domain pages all remain visible as separate results.
- [ ] Current-window tabs get a light ranking boost.
- [ ] Pinned tabs show a pinned indicator.

### History

- [ ] First click without permission shows the history permission prompt.
- [ ] Clicking Allow requests Chrome history permission.
- [ ] After permission is granted, history results appear immediately.
- [ ] Empty input shows recent history.
- [ ] Query matches title, domain, and URL.
- [ ] Last day / Last week / Last month filters change the result set.
- [ ] Enter on a history result opens a new tab.

### Bookmarks

- [ ] First click without permission shows the bookmarks permission prompt.
- [ ] Clicking Allow requests Chrome bookmarks permission.
- [ ] After permission is granted, bookmark results appear immediately.
- [ ] Empty input shows bookmarks.
- [ ] Query matches title, domain, URL, and folder path.
- [ ] Result rows show folder information where available.
- [ ] Enter on a bookmark result opens a new tab.

## Prefix Commands

- [ ] `t github` searches only open tabs.
- [ ] `tab github` searches only open tabs.
- [ ] `h github` searches only history.
- [ ] `his github` searches only history.
- [ ] `b github` searches only bookmarks.
- [ ] `bm github` searches only bookmarks.
- [ ] Prefix terms are not displayed as false search terms.

## Search Syntax

- [ ] `site:github.com` filters by domain.
- [ ] `title:react` filters by title.
- [ ] `url:pull` filters by URL.
- [ ] `window:current` excludes other-window tab results.
- [ ] `pinned:true` shows pinned tab results only.
- [ ] A small typo such as `githb` still matches `GitHub`.

## Keyboard

- [ ] Down selects the next result.
- [ ] Up selects the previous result.
- [ ] Selected result scrolls into view.
- [ ] Enter opens or switches to the selected result.
- [ ] Cmd/Ctrl + Enter opens the action menu.
- [ ] Cmd/Ctrl + Backspace closes the selected tab result.
- [ ] Cmd/Ctrl + Backspace does nothing for non-tab results.

## Tab Actions

- [ ] Switching to a tab focuses the correct Chrome window.
- [ ] Closing selected tab removes only that tab.
- [ ] Undo restores the recently closed selected tab when possible.
- [ ] Close duplicates keeps one tab per exact URL.
- [ ] Close duplicates skips pinned duplicate tabs.
- [ ] Close same-domain asks for confirmation.
- [ ] Close same-domain skips pinned tabs.
- [ ] Close search results asks for confirmation.
- [ ] Close search results closes only tab results, not history/bookmark results.
- [ ] Close search results skips pinned tabs.
- [ ] Undo restore failure keeps a visible failure message.

## Options Page

- [ ] Options page opens from Chrome extension details.
- [ ] Theme selection works.
- [ ] Privacy copy is visible.
- [ ] Permission states are visible.
- [ ] Optional permissions can be requested from options.
- [ ] Clear local data removes theme, recent tabs, and undo metadata.

## Theme QA

- [ ] System theme works in light mode.
- [ ] System theme works in dark mode.
- [ ] Command dark is readable.
- [ ] Command light is readable.
- [ ] High contrast is readable.
- [ ] Hover and selected states remain distinct in every theme.

## Privacy And Network

- [ ] No external network request is visible while opening the popup.
- [ ] No external network request is visible while searching tabs.
- [ ] No external network request is visible while searching history.
- [ ] No external network request is visible while searching bookmarks.
- [ ] Extension does not request host permissions.
- [ ] Extension does not inject content scripts into webpages.

## Packaging

- [ ] Run `npm run zip`.
- [ ] Confirm `.output/tabscout-0.1.0-chrome.zip` exists.
- [ ] Inspect the zip and confirm it contains `manifest.json`, popup/options HTML, background JS, chunks, icons, and `_locales`.
- [ ] Confirm the zip does not contain `node_modules`, tests, source maps if not intended, or local debug artifacts.

## Store Assets

- [ ] Run `npm run assets:store`.
- [ ] Confirm `docs/assets/store/screenshot-command-panel.png` is 1280 x 800.
- [ ] Confirm `docs/assets/store/screenshot-selection.png` is 1280 x 800.
- [ ] Confirm `docs/assets/store/screenshot-options.png` is 1280 x 800.
- [ ] Confirm `docs/assets/store/small-promo-tile.png` is 440 x 280.
- [ ] Visually inspect the generated assets before uploading them to Chrome Web Store.
