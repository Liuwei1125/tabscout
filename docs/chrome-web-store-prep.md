# Chrome Web Store Prep

This document collects the current store-readiness notes for the MVP. Re-check official Chrome Web Store policies before submission because policy details can change.

Official references:

- [Chrome Web Store Program Policies](https://developer.chrome.com/docs/webstore/program-policies)
- [Chrome Web Store Developer Program Policies](https://developer.chrome.com/docs/webstore/program-policies/policies)
- [Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions)
- [chrome.permissions API](https://developer.chrome.com/docs/extensions/reference/api/permissions)
- [Complete your listing information](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)
- [Fill out the privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Supplying Images](https://developer.chrome.com/docs/webstore/images)
- [Remote hosted code guidance](https://developer.chrome.com/docs/extensions/develop/migrate/remote-hosted-code)
- [Privacy Policies](https://developer.chrome.com/docs/webstore/program-policies/privacy)
- [Limited Use](https://developer.chrome.com/docs/webstore/program-policies/limited-use)

## Current Technical Posture

- Manifest version: MV3
- Required permissions: `tabs`, `storage`, `tabGroups`
- Optional permissions: `history`, `bookmarks`
- Host permissions: none
- Content scripts: none
- External services: none
- Remote hosted code: none
- Analytics: none
- AI: none
- User data processing: local only

## Single Purpose

Suggested single-purpose statement:

```text
TabScout helps users quickly search, switch, and manage their open tabs, history, bookmarks, and tab groups from one local-first command palette.
```

## Store Listing Draft

Canonical copy now lives in [store-listing.md](store-listing.md). Keep the dashboard copy in sync with that file.

### Name

```text
TabScout
```

### Short Description

```text
Search, switch, and clean up Chrome tabs, history, bookmarks, and tab groups from one fast command panel.
```

### Detailed Description

```text
TabScout is a local-first command palette for people who keep many tabs open and need to find pages quickly.

Use it to search open tabs across windows, jump back to history pages, find bookmarks, inspect tab groups, and clean up duplicate or same-domain tabs without leaving the keyboard.

Core features:
- Search all open tabs across Chrome windows
- Search Chrome history after optional permission is granted
- Search bookmarks after optional permission is granted
- Switch to an open tab and focus its window
- Close selected tabs, duplicate tabs, same-domain tabs, or matching tab results
- Undo recent tab-close actions when restoration data is available
- Use prefix commands like "t github", "h github", and "b github"
- Use filters like "site:github.com", "title:react", "url:pull", "window:current", and "pinned:true"
- Choose system, dark, light, or high-contrast themes

Privacy:
- All search and ranking happens locally
- No AI
- No cloud sync
- No analytics
- No external service calls
- No webpage body indexing
- No content scripts
- No host permissions
```

## Permission Justifications

### `tabs`

Used to read open tab titles, URLs, favicons, pinned state, window IDs, and tab indexes; switch to selected tabs; focus the right window; close selected or matching tabs; and recreate recently closed tabs for undo.

### `storage`

Used to store local settings such as theme preference, recent tab activity, and undo metadata.

### `tabGroups`

Used to show tab group title, color, and grouping context in search results.

### Optional `history`

Requested only when the user searches or opens the History scope. Used to search history titles and URLs locally and display matching results.

### Optional `bookmarks`

Requested only when the user searches or opens the Bookmarks scope. Used to search bookmark titles, URLs, domains, paths, and folder paths locally.

## Privacy Practices Draft

Use these answers as the first draft for Chrome Web Store privacy fields. Re-check the dashboard wording during submission.

### Data Collection

The extension accesses browser tabs, tab groups, history, bookmarks, and local extension settings only to provide the command-panel search and tab-management features.

### Data Sharing

No user data is sold, transferred, or shared with third parties.

### Remote Processing

No browser data is uploaded to external servers. Search, scoring, ranking, settings, and undo metadata are processed locally in the browser.

### Analytics

No analytics SDK or tracking service is included in the MVP.

### AI

No AI service is included in the MVP.

### Privacy Policy Short Copy

```text
TabScout is local-first. It uses Chrome extension APIs to search and manage tabs, history, bookmarks, and tab groups only for user-facing command-palette features. The extension does not upload browsing data, does not use analytics, does not use AI services, does not sell data, and does not share user data with third parties.
```

### Public Privacy Policy URL

```text
https://github.com/Liuwei1125/tabscout/blob/main/docs/privacy-policy.md
```

## Submission Checklist

### Product

- [x] The first screen is the search panel, not a marketing page.
- [x] Core tab search works with realistic multi-window sessions.
- [x] History permission is optional and requested in context.
- [x] Bookmarks permission is optional and requested in context.
- [x] Dangerous tab actions have confirmation or undo.
- [x] Settings page explains privacy and permissions.

### Policy

- [x] Single purpose is clear and matches the actual product behavior.
- [x] Store listing does not promise AI, cloud sync, page body search, or session sync.
- [x] Permission justifications match the manifest.
- [x] Privacy policy draft matches actual implementation.
- [x] No remote hosted code is included.
- [x] No unnecessary permission is requested in the current manifest.
- [x] Public privacy policy URL is prepared: `https://github.com/Liuwei1125/tabscout/blob/main/docs/privacy-policy.md`.
- [x] Support/contact destination is selected: `https://github.com/Liuwei1125/tabscout/issues`.

### Assets

- [x] 16 px icon
- [x] 32 px icon
- [x] 48 px icon
- [x] 128 px icon
- [x] Store screenshots generated in `docs/assets/store/`
- [x] Required small promotional image generated in `docs/assets/store/`
- [x] Public privacy policy URL
- [x] Support/contact URL: `https://github.com/Liuwei1125/tabscout/issues`

### Build

- [x] Run `npm run typecheck` on 2026-06-16.
- [x] Run `npm run lint` on 2026-06-16.
- [x] Run `npm run test` on 2026-06-16.
- [x] Run `npm run build` on 2026-06-16.
- [x] Run `npm run e2e` on 2026-06-16.
- [x] Run `npm run assets:store` on 2026-06-16.
- [x] Run `npm run zip` on 2026-06-16.
- [ ] Upload `.output/tabscout-0.1.0-chrome.zip`.

## Known Pre-Submission Gaps

- GitHub repository must be published before the privacy policy URL and support URL are live.
- Store screenshots are generated from QA sessions and need final visual approval.
- Generated screenshots currently show the Chinese UI while the default store listing is English. Use them for beta review, or recapture English screenshots before a public English listing.
- 1-2 days of real Chrome dogfood is recommended before a public release. For a closed beta, the current QA evidence is enough to proceed.
