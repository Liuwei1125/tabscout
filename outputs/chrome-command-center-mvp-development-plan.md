# Chrome Command Center MVP Development Plan

> Date: 2026-06-10
> Product: Local-first Chrome command panel for searching and managing tabs, history, bookmarks, and tab groups.
> Scope: MVP development plan only. AI, cloud sync, page-body indexing, and heavy dashboards are intentionally out of scope.

## 1. Product Positioning

### One-line Positioning

Chrome Command Center is a local-first Chrome extension that lets users search, switch, group, clean, and recover browser pages from one keyboard-first command panel.

### Product Thesis

Chrome already has tab search, history, bookmarks, and tab groups, but those capabilities are scattered across separate surfaces. The MVP does not try to replace Chrome. It integrates Chrome's existing page objects into one fast workflow:

1. Search.
2. Understand page state.
3. Act on the selected result.
4. Undo dangerous changes.

### Target Users

- Users who keep dozens of tabs open.
- Users working across multiple Chrome windows.
- Keyboard-first productivity users.
- Users who frequently return to history/bookmark pages but dislike Chrome's heavier built-in pages.
- Users who want local/private tab management without accounts, cloud sync, or AI.

### Core MVP Promise

Open a command panel, type a few characters, find the page, switch to it, or clean up related tabs without leaving the keyboard.

## 2. MVP Scope

### P1 Must Have

1. Search all open tabs across all Chrome windows.
2. Match tab title, domain, path, and full URL.
3. Sort results with explainable scoring:
   - title match highest
   - domain match second
   - path/full URL match third
   - current window, recent activity, and pinned state as small boosts
4. Display dense, scannable results:
   - favicon
   - title
   - domain/path
   - source type
   - window info
   - tab group info
   - pinned/duplicate indicators
5. Switch to an open tab and focus its window.
6. Close selected tab.
7. Close duplicate URL tabs while keeping one copy.
8. Close other tabs from the same domain with confirmation.
9. Undo recently closed-tab actions when enough data is available to recreate the tabs.
10. Keyboard experience:
    - input auto focus
    - Up/Down selects result
    - Enter opens/switches
    - Esc closes popup when possible
    - Cmd/Ctrl + Backspace triggers close selected tab
    - Cmd/Ctrl + Enter opens action menu
11. Prefix commands:
    - `t` / `tab`: tabs only
    - `h` / `his`: history only
    - `b` / `bm`: bookmarks only
12. Optional permission flow for history/bookmarks.
13. History search after permission grant.
14. Bookmark search after permission grant.
15. Settings/options page with permissions, privacy, theme, and shortcuts guidance.
16. i18n for all user-visible strings, at least English and Simplified Chinese.
17. Local-first privacy statement:
    - no cloud sync
    - no AI
    - no page body indexing
    - no external analytics
    - no remote scripts

### MVP Should Have

1. Empty input shows recent active tabs and cleanup suggestions.
2. Result rows show matched text highlighting.
3. Theme supports system, dark, light, and high contrast.
4. Tab group metadata displayed when available.
5. Search remains responsive with 100+ tabs and thousands of history/bookmark items.

### Explicit Non-goals

- AI semantic search.
- Page body indexing.
- New tab page replacement.
- Heavy dashboard/workspace manager.
- Account login.
- Cloud sync.
- Sharing sessions online.
- Browser page content injection.
- Content scripts for arbitrary websites.
- Replacing Chrome omnibox.
- Managing Chrome's saved tab groups as a first-class object, unless Chrome exposes stable APIs for that later.

## 3. Recommended Technical Stack

| Area | Choice | Rationale |
| --- | --- | --- |
| Extension framework | WXT + Manifest V3 | Clean extension entrypoints, simple build, good MV3 ergonomics. |
| UI | React + TypeScript | Strong fit for keyboard state, action menus, settings, and reusable UI components. |
| Styling | TailwindCSS for layout + CSS variables for theme tokens | Tailwind speeds layout, CSS variables keep themes replaceable. |
| Icons | lucide-react | Consistent icon system, avoids custom inline SVG clutter. |
| State | React hooks + reducers | MVP does not need global state libraries. |
| Search/scoring | Pure TypeScript modules | Testable, deterministic, no UI coupling. |
| Unit tests | Vitest | Fast tests for parser, scoring, URL normalization, undo payloads. |
| UI tests | Playwright | Verify popup/options layout, keyboard navigation, theme rendering. |
| i18n | Chrome `chrome.i18n` message files | Native extension localization. |
| Storage | `chrome.storage.local` | Settings, recent activity, theme, undo metadata. |

## 4. Extension Surfaces

### Popup: Primary MVP Surface

Use browser action popup as the first implementation target.

Recommended dimensions:

- width: 680px
- height: 560px

Why popup first:

- Most compliant and predictable Chrome extension UX.
- Works with toolbar click and `_execute_action` keyboard shortcut.
- Enough room for a command panel experience.
- Avoids complexity of custom floating windows for MVP.

### Options Page

Dedicated settings page for:

- theme
- permissions
- shortcut guidance
- privacy explanation
- clearing local data

### Background Service Worker

Responsibilities:

- command shortcut handling
- tab event listeners
- recent activity tracking
- optional action message routing if needed

### Not In MVP

- side panel
- new tab override
- content scripts
- custom floating detached command window

These can be explored after the core experience is proven.

## 5. Permission Design

### Required Permissions

```json
{
  "permissions": ["tabs", "storage", "tabGroups"]
}
```

#### `tabs`

Required for:

- reading open tab title, URL, favicon, pinned state, window ID
- switching tabs
- closing tabs
- creating/restoring tabs for undo

#### `storage`

Required for:

- theme preference
- recent tab activity
- undo queue metadata
- settings
- optional local sessions later

#### `tabGroups`

Required for:

- showing current group title/color/collapsed state
- later updating or grouping tabs

### Optional Permissions

```json
{
  "optional_permissions": ["history", "bookmarks"]
}
```

#### `history`

Requested only when the user uses history search, such as:

- `h github`
- `his chrome extension`
- selecting History filter for the first time

#### `bookmarks`

Requested only when the user uses bookmark search, such as:

- `b notion`
- `bm chrome api`
- selecting Bookmarks filter for the first time

### Permissions Copy

History permission prompt:

```text
Search Chrome history?
We only read history title and URL locally to show matching results. Nothing is uploaded.
```

Bookmarks permission prompt:

```text
Search bookmarks?
We only read bookmark title, URL, and folder path locally. Nothing is uploaded.
```

Chinese:

```text
搜索 Chrome 历史记录？
我们只在本地读取历史记录的标题和 URL，用于展示匹配结果，不会上传。
```

```text
搜索书签？
我们只在本地读取书签标题、URL 和文件夹路径，不会上传。
```

## 6. Privacy And Store Compliance Rules

### Privacy Commitments

1. All search and ranking happens locally.
2. No external API calls.
3. No remote JavaScript.
4. No analytics SDK in MVP.
5. No AI in MVP.
6. No page body indexing.
7. No content scripts on websites.
8. No host permissions such as `<all_urls>`.
9. No selling, sharing, or transferring browsing data.
10. Clear local data option in settings.

### Chrome Web Store Compliance Checklist

- Single purpose is clear: local page search and tab management.
- Permissions are minimal and tied to user-facing features.
- Optional permissions are requested at feature-use time.
- Store listing explains why tabs/history/bookmarks are used.
- Privacy policy describes collected/processed data and states local-only processing.
- Build package contains all code locally.
- No remotely hosted executable code.
- No misleading claims such as "complete privacy" without specifics.

## 7. UI System And Theme Architecture

### UI Principle

Components must be reusable and theme-replaceable. Business components should not hardcode colors, shadows, or theme-specific visual decisions.

### UI Layers

1. Foundation tokens:
   - color
   - typography
   - radius
   - spacing
   - shadow
   - motion
2. Primitive components:
   - Button
   - IconButton
   - Input
   - Badge
   - Tooltip
   - Popover
   - SegmentedControl
   - Toast
   - ListRow
3. Product components:
   - CommandPanel
   - SearchInput
   - ScopeSwitcher
   - ResultList
   - ResultItem
   - ResultMeta
   - ActionMenu
   - PermissionPrompt
   - ConfirmBar
   - UndoToast
   - EmptyState
   - SettingsSection

### Token Strategy

Use CSS variables for all visual semantics:

```css
:root {
  --bg-app: #0f1115;
  --bg-panel: #16191f;
  --bg-elevated: #1d222b;
  --bg-selected: #232a36;

  --text-primary: #f4f6f8;
  --text-secondary: #a8b0bf;
  --text-muted: #788295;

  --border-subtle: #2a2f3a;
  --border-strong: #3a4150;

  --accent: #6aa6ff;
  --accent-weak: rgba(106, 166, 255, 0.14);

  --danger: #e06c75;
  --danger-weak: rgba(224, 108, 117, 0.12);

  --radius-panel: 12px;
  --radius-control: 8px;
  --radius-row: 8px;

  --shadow-panel: 0 20px 60px rgba(0, 0, 0, 0.35);
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

Theme files:

```text
src/ui/themes/
  base.css
  command-dark.css
  command-light.css
  high-contrast.css
```

Future theme files:

```text
src/ui/themes/
  raycast-dark.css
  raycast-light.css
  alfred.css
  arc-dark.css
  chrome-light.css
```

### Component Styling Rule

Prefer semantic classes:

```tsx
<div className="command-panel">
  <ResultItem selected={selected} />
</div>
```

Avoid hardcoded visual utility classes in product components:

```tsx
<div className="bg-zinc-950 text-white border-zinc-800" />
```

Tailwind can be used for layout:

```tsx
<div className="flex items-center gap-2 truncate" />
```

Colors, radius, shadows, and state visuals should come from tokens.

### Initial Themes

MVP ships:

1. System
2. Command Dark
3. Command Light
4. High Contrast

## 8. Main User Flows

### Flow 1: Switch To Open Tab

1. User opens command panel.
2. Input auto-focuses.
3. User types `github pr`.
4. Results show matching open tabs first.
5. User presses Down/Up.
6. User presses Enter.
7. Extension activates the selected tab and focuses the containing window.

### Flow 2: Close A Duplicate Tab

1. User searches `docs`.
2. Duplicate badge appears on matching duplicate URLs.
3. User selects duplicate cleanup suggestion or a duplicate result.
4. User invokes action menu.
5. User chooses Close Duplicates.
6. Extension closes all but one duplicate tab.
7. Undo toast appears.

### Flow 3: Close Same-domain Other Tabs

1. User searches `github`.
2. Result metadata shows many `github.com` tabs.
3. User chooses Close Other Same-domain Tabs.
4. Confirm bar appears: `Close 8 other github.com tabs?`
5. User confirms.
6. Tabs close and undo toast appears.

### Flow 4: Search History

1. User types `h chrome extension permission`.
2. If history permission is missing, inline permission prompt appears.
3. User grants permission.
4. History results appear with title, domain/path, and visit time.
5. Enter opens the selected history result.

### Flow 5: Search Bookmarks

1. User types `b notion roadmap`.
2. If bookmarks permission is missing, inline permission prompt appears.
3. User grants permission.
4. Bookmark results appear with folder path.
5. Enter opens the selected bookmark.
6. If the URL is already open, UI should prefer switching to the open tab or clearly show both options.

## 9. Data Model

### Search Source

```ts
type SearchSource = "tabs" | "history" | "bookmarks" | "groups" | "suggestions";
```

### Normalized Result

```ts
type SearchResult = {
  id: string;
  source: SearchSource;
  title: string;
  url?: string;
  domain?: string;
  path?: string;
  faviconUrl?: string;
  score: number;
  matchedFields: Array<"title" | "domain" | "path" | "url">;
  badges: ResultBadge[];
  actions: ResultAction[];
  raw: unknown;
};
```

### Tab Result Metadata

```ts
type TabResultMeta = {
  tabId: number;
  windowId: number;
  index: number;
  active: boolean;
  pinned: boolean;
  groupId?: number;
  groupTitle?: string;
  groupColor?: string;
  lastActivatedAt?: number;
  duplicateCount?: number;
  sameDomainCount?: number;
};
```

### History Result Metadata

```ts
type HistoryResultMeta = {
  lastVisitTime?: number;
  visitCount?: number;
  typedCount?: number;
};
```

### Bookmark Result Metadata

```ts
type BookmarkResultMeta = {
  bookmarkId: string;
  parentId?: string;
  folderPath: string[];
  dateAdded?: number;
};
```

## 10. Search Query Design

### Prefix Commands

```text
t github
tab github
h github
his github
b github
bm github
```

### MVP Filters

```text
site:github.com
title:react
url:pull
window:current
pinned:true
```

If filters are expensive or ambiguous, implement parser support in MVP but only expose the stable subset in UI copy.

### Query Parser Output

```ts
type ParsedQuery = {
  raw: string;
  mode: "all" | "tabs" | "history" | "bookmarks";
  terms: string[];
  filters: {
    site?: string;
    title?: string;
    url?: string;
    window?: "current" | string;
    pinned?: boolean;
  };
};
```

## 11. Search Scoring

### Base Weights

| Match | Score |
| --- | ---: |
| exact title match | +140 |
| title prefix match | +120 |
| title contains match | +100 |
| domain exact/prefix match | +80 |
| domain contains match | +70 |
| path match | +45 |
| full URL match | +30 |

### Boosts

| Signal | Score |
| --- | ---: |
| open tab result | +20 |
| current window tab | +10 |
| recently activated tab | +8 |
| pinned tab | +4 |
| same group as current active tab | +4 |
| history recent visit | +1 to +8 |
| bookmark exact title match | +8 |

### Rules

1. Do not hide duplicate URLs.
2. Do not collapse same-domain results automatically.
3. Mark duplicates with badges.
4. Keep scoring deterministic.
5. Return matched field info for UI highlighting.
6. Empty input uses recent activity and suggestions, not normal text scoring.

## 12. Recommended File Structure

```text
.
├── entrypoints/
│   ├── background.ts
│   ├── popup/
│   │   ├── App.tsx
│   │   ├── index.html
│   │   └── main.tsx
│   └── options/
│       ├── OptionsApp.tsx
│       ├── index.html
│       └── main.tsx
├── public/
│   ├── _locales/
│   │   ├── en/messages.json
│   │   └── zh_CN/messages.json
│   └── icons/
├── src/
│   ├── actions/
│   │   ├── tabActions.ts
│   │   └── undoManager.ts
│   ├── search/
│   │   ├── queryParser.ts
│   │   ├── rankResults.ts
│   │   ├── score.ts
│   │   ├── normalizeUrl.ts
│   │   └── types.ts
│   ├── services/
│   │   ├── bookmarksService.ts
│   │   ├── historyService.ts
│   │   ├── permissionsService.ts
│   │   ├── storageService.ts
│   │   ├── tabGroupsService.ts
│   │   └── tabsService.ts
│   ├── ui/
│   │   ├── components/
│   │   │   ├── primitives/
│   │   │   └── product/
│   │   ├── hooks/
│   │   ├── themes/
│   │   └── utils/
│   ├── i18n/
│   │   └── t.ts
│   └── shared/
│       ├── chromeApi.ts
│       └── types.ts
├── tests/
│   ├── search/
│   ├── actions/
│   └── services/
├── e2e/
│   └── popup.spec.ts
├── package.json
├── tsconfig.json
├── wxt.config.ts
├── tailwind.config.ts
└── vitest.config.ts
```

## 13. Service Responsibilities

### `tabsService.ts`

- Query all open tabs.
- Normalize Chrome tab objects.
- Activate a tab and focus its window.
- Close tabs by ID.
- Recreate tabs for undo when possible.
- Track current window/current active tab.

### `tabGroupsService.ts`

- Query current tab groups.
- Map group ID to title/color/collapsed state.
- Provide group metadata to tab normalization.

### `historyService.ts`

- Check/request history permission via `permissionsService`.
- Search browser history for a query.
- Normalize history results.
- Apply time ranges: last day/week/month.

### `bookmarksService.ts`

- Check/request bookmarks permission.
- Load bookmark tree.
- Flatten bookmarks with folder paths.
- Search bookmarks by title, domain, path, and URL.

### `permissionsService.ts`

- Check optional permissions.
- Request optional permissions.
- Provide permission state for UI.

### `storageService.ts`

- Theme preference.
- Recent tab activity.
- Undo queue.
- Settings.

### `tabActions.ts`

- Switch to tab.
- Close selected tab.
- Close duplicate URLs.
- Close same-domain tabs.
- Copy URL.
- Future: move to group, create group from results.

### `undoManager.ts`

- Store recent close operations.
- Reopen closed tabs from stored URL/title/window/index/group metadata.
- Expire undo entries after a short TTL.

## 14. Development Phases

### Phase 0: Project Scaffolding

Goal: Create a clean WXT extension foundation.

Tasks:

- Initialize WXT with React + TypeScript.
- Add TailwindCSS and CSS variable theme files.
- Add Vitest.
- Add Playwright config.
- Configure MV3 manifest.
- Add popup entrypoint.
- Add options entrypoint.
- Add background service worker.
- Add `_locales/en/messages.json`.
- Add `_locales/zh_CN/messages.json`.
- Add basic extension icons.

Verification:

```bash
npm install
npm run dev
npm run build
npm run test
```

Expected:

- dev server starts.
- unpacked extension build exists.
- popup renders placeholder UI.
- tests run successfully.

### Phase 1: Tab Search Core

Goal: Search and switch open tabs across all windows.

Tasks:

- Implement `tabsService.getAllTabs()`.
- Implement URL normalization.
- Implement query parser for plain query and `t`/`tab`.
- Implement pure scoring function.
- Implement result ranking.
- Build CommandPanel UI.
- Build SearchInput.
- Build ResultList and ResultItem.
- Add keyboard navigation.
- Add Enter to switch to tab.
- Track and display current window/window ID.
- Display favicon, title, domain/path, pinned state.

Tests:

- query parser tests.
- URL normalization tests.
- scoring tests.
- ranking tests.

Verification:

```bash
npm run test -- tests/search
npm run dev
```

Manual:

- Open 20+ tabs.
- Search by title.
- Search by domain.
- Search by path.
- Switch to a tab in another window.

### Phase 2: Tab Management Actions

Goal: Let users clean tabs safely.

Tasks:

- Add action menu.
- Implement close selected tab.
- Implement duplicate URL detection.
- Implement close duplicates while keeping active/current-most-relevant tab.
- Implement same-domain detection.
- Implement close other same-domain tabs.
- Add confirm bar for dangerous actions.
- Add undo toast.
- Implement undo for closed tabs by recreating tabs.
- Add keyboard shortcut for close selected tab.

Tests:

- duplicate detection.
- same-domain grouping.
- action payload generation.
- undo payload generation.

Verification:

```bash
npm run test -- tests/actions
```

Manual:

- Open duplicate URLs.
- Close duplicates.
- Undo.
- Close selected tab.
- Undo.
- Close same-domain tabs with confirmation.

### Phase 3: History And Bookmarks

Goal: Add optional history/bookmark search without over-requesting permissions.

Tasks:

- Implement `permissionsService`.
- Add inline permission prompt component.
- Implement `historyService.searchHistory()`.
- Add `h`/`his` query mode.
- Add history filter chip.
- Implement recent day/week/month suggestions.
- Implement `bookmarksService`.
- Flatten bookmark tree with folder path.
- Add `b`/`bm` query mode.
- Add bookmark filter chip.
- Open history/bookmark URL on Enter.
- If URL is already open, show "Open tab" result above history/bookmark result.

Tests:

- permission state reducer.
- history result normalization.
- bookmark tree flattening.
- mixed result ranking.

Verification:

```bash
npm run test -- tests/services tests/search
```

Manual:

- Fresh install without history/bookmarks permission.
- Type `h github`.
- Permission prompt appears.
- Grant permission.
- Results appear.
- Repeat for bookmarks.

### Phase 4: Tab Group Awareness

Goal: Integrate Chrome's current tab groups as visible browser state.

Tasks:

- Implement `tabGroupsService.getGroups()`.
- Join group metadata onto tab results.
- Display group title/color in ResultItem metadata.
- Add `g`/`group` parser support if stable enough.
- Empty state suggestion: show large group cleanup opportunities.
- Add future-ready action definitions for "Move to group" and "Group results", but do not expose unfinished actions.

Tests:

- group metadata join.
- grouped result badge rendering.

Verification:

```bash
npm run test -- tests/services
```

Manual:

- Create Chrome tab groups.
- Search tabs inside groups.
- Confirm group title/color appears.

### Phase 5: Settings, i18n, Themes

Goal: Make MVP usable, explainable, and theme-replaceable.

Tasks:

- Build options page.
- Add theme setting: system/dark/light/high-contrast.
- Save theme to storage.
- Apply theme using `data-theme`.
- Add permission status section.
- Add shortcut help with link/instructions for `chrome://extensions/shortcuts`.
- Add privacy section.
- Add clear local data action.
- Replace all user-facing strings with i18n helper.
- Complete English and Simplified Chinese messages.

Tests:

- i18n key presence.
- theme preference resolver.
- settings storage.

Verification:

```bash
npm run test
```

Manual:

- Switch themes.
- Restart popup.
- Confirm theme persists.
- Change Chrome language or force locale where possible.

### Phase 6: Quality, Performance, And Release Prep

Goal: Prepare an unpacked build and store-ready package.

Tasks:

- Add Playwright UI tests for popup.
- Add keyboard navigation e2e test.
- Add basic visual screenshot checks for dark/light themes.
- Test 100+ mocked results.
- Run production build.
- Inspect manifest permissions.
- Confirm no remote code or remote assets.
- Prepare privacy policy draft.
- Prepare Chrome Web Store listing copy.
- Prepare manual QA checklist.

Verification:

```bash
npm run test
npm run e2e
npm run build
```

Manual:

- Load unpacked extension in Chrome.
- Test popup action.
- Test keyboard shortcut.
- Test permissions flow.
- Test multi-window tab activation.
- Test tab close/undo.

## 15. MVP Acceptance Criteria

### Functional Acceptance

- User can search all open tabs by title/domain/path/URL.
- Results appear immediately for typical tab counts.
- User can switch to tabs in other windows.
- User can close a selected tab.
- User can close duplicate URL tabs.
- User can close same-domain tabs after confirmation.
- User can undo supported close actions.
- History search is unavailable until permission is granted.
- Bookmark search is unavailable until permission is granted.
- All user-facing copy is available in English and Simplified Chinese.
- Options page explains all permissions.

### UX Acceptance

- Popup opens with input focused.
- Up/Down/Enter/Esc keyboard flow works.
- Selected result is visually clear.
- Result rows are dense but readable.
- Dangerous actions are clear but not visually noisy.
- Undo toast is visible and actionable.
- Empty input is useful.
- Dark and light themes both look polished.

### Privacy Acceptance

- No content scripts.
- No host permissions.
- No analytics.
- No remote JS.
- No remote fonts.
- No AI.
- No external favicon API unless explicitly reviewed; prefer Chrome favicon mechanisms or tab-provided favicons.
- Optional permissions requested only at feature use.

### Performance Acceptance

- 100 open tabs search feels instant.
- Search scoring is pure and debounced only if needed.
- Popup remains responsive during history/bookmark searches.
- History/bookmark results are limited and paginated or capped.

Suggested caps:

- Tabs: all open tabs.
- History: top 50 per query.
- Bookmarks: top 50 per query.
- Mixed results: top 80 total.

## 16. Test Plan

### Unit Test Targets

```text
tests/search/queryParser.test.ts
tests/search/normalizeUrl.test.ts
tests/search/score.test.ts
tests/search/rankResults.test.ts
tests/actions/duplicateTabs.test.ts
tests/actions/sameDomainTabs.test.ts
tests/actions/undoManager.test.ts
tests/services/bookmarksService.test.ts
tests/services/permissionsService.test.ts
tests/ui/themeResolver.test.ts
```

### E2E Test Targets

```text
e2e/popup-keyboard.spec.ts
e2e/popup-theme.spec.ts
e2e/options.spec.ts
```

### Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run e2e
npm run build
```

### Manual QA Matrix

| Scenario | Expected |
| --- | --- |
| 30 tabs, search title | Correct tab ranked near top. |
| 30 tabs, search domain | All same-domain tabs shown, not collapsed. |
| Multi-window tab switch | Target window focused. |
| Pinned tab result | Pinned badge visible. |
| Duplicate URL tabs | Duplicate badge and cleanup action visible. |
| Close selected tab | Tab closes and undo appears. |
| Undo close | Tab reopens. |
| History without permission | Inline permission prompt appears. |
| Bookmark without permission | Inline permission prompt appears. |
| Theme switch | Popup and options update consistently. |
| Chinese locale | User-facing text localized. |

## 17. Release Package Checklist

Before Chrome Web Store submission:

- Verify manifest permissions are minimal.
- Verify no `host_permissions` unless explicitly justified.
- Verify no remote scripts.
- Verify no external analytics.
- Verify no external fonts.
- Verify privacy policy exists.
- Verify screenshots show actual command panel, not marketing page.
- Verify store description matches single purpose.
- Verify optional permissions are explained.
- Verify all icons are included.
- Verify production build loads as unpacked extension.

## 18. Risks And Mitigations

### Risk: Chrome Native Feature Overlap

Chrome already has tab search, tab groups, history, and bookmarks.

Mitigation:

- Position as integrated command center, not replacement.
- Lead with actions: close, dedupe, same-domain cleanup, undo.
- Make keyboard flow better than native.

### Risk: Permission Anxiety

Tabs/history/bookmarks are sensitive.

Mitigation:

- Request history/bookmarks only on demand.
- Avoid host permissions.
- Explain each permission in settings.
- Avoid vague privacy claims.

### Risk: Popup Limitations

Chrome popup size and focus behavior are constrained.

Mitigation:

- Design for popup first.
- Keep command panel compact.
- Consider side panel or detached window after MVP.

### Risk: Undo Cannot Perfectly Restore Every State

Chrome may not allow perfect reconstruction of all tab state.

Mitigation:

- Store URL, window, index, pinned, group metadata when possible.
- Phrase undo as restoring tabs, not restoring every browser state.
- Prefer confirmation for larger destructive actions.

### Risk: Search Performance With Large History

History/bookmarks can be large.

Mitigation:

- Query limited results.
- Cache flattened bookmarks.
- Debounce history/bookmark calls.
- Rank only capped result sets.

### Risk: Theme System Overengineering

Too much design-system work can slow MVP.

Mitigation:

- Build token layer once.
- Ship only four themes initially.
- Do not create theme editor in MVP.

## 19. Post-MVP Roadmap

### P1.5

- Create tab group from search results.
- Move selected tab to group.
- Collapse/expand group from command panel.
- Better empty-state cleanup suggestions.
- Recently closed local history beyond Chrome default behavior.

### P2

- Session snapshots.
- Restore session with group reconstruction.
- Search saved sessions.
- Duplicate cleanup by domain/window/group.
- Saved searches.
- More search syntax.

### Later AI Track

AI remains intentionally out of MVP. If introduced later, start with opt-in local-first features:

- session naming
- tab group suggestions
- query intent parsing
- user-confirmed action plans

Do not introduce cloud AI until privacy, permissions, and store policy implications are separately reviewed.

## 20. Recommended First Build Order

The fastest path to a credible demo:

1. Scaffold WXT popup.
2. Implement tab query and normalization.
3. Implement scoring.
4. Render result list.
5. Add keyboard navigation and tab switch.
6. Add close selected tab and undo.
7. Add duplicate detection and cleanup.
8. Add optional history/bookmark flows.
9. Add settings/i18n/theme.
10. Polish and package.

This order keeps the product useful early while reducing the chance of spending too much time on lower-confidence surfaces.
