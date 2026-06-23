# Chrome Web Store Listing Copy

Use this as the copy source for the Chrome Web Store dashboard. Keep the listing aligned with the actual MVP: local tab, history, bookmark, and tab group search; no AI; no cloud sync; no page-body indexing.

## English

### Extension Name

```text
TabScout
```

### Short Name

```text
TabScout
```

### Summary

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
- All search and ranking happens locally in Chrome
- No AI service is used
- No cloud sync is used
- No analytics SDK is included
- No external service calls are made
- No webpage body content is indexed
- No content scripts are injected into webpages
- No host permissions are requested
```

## 简体中文

Chrome Web Store 的默认语言目前由 manifest 设置为 English。若后续添加中文商店列表，可使用以下版本。

### 扩展名称

```text
TabScout 标签侦察
```

### 简短名称

```text
TabScout
```

### 摘要

```text
用一个快速命令面板搜索、切换和清理 Chrome 标签页、历史记录、书签和分组。
```

### 详细描述

```text
TabScout 标签侦察是一款本地优先的效率工具，适合经常同时打开大量标签页、需要快速找回网页的用户。

你可以用它搜索所有窗口中的打开标签页，回到历史记录页面，查找书签，查看标签页分组，并通过键盘快速清理重复或同域名标签页。

核心功能：
- 搜索所有 Chrome 窗口中的打开标签页
- 授权后搜索 Chrome 历史记录
- 授权后搜索 Chrome 书签
- 切换到已打开的标签页，并聚焦所在窗口
- 关闭单个标签页、重复标签页、同域名标签页或当前搜索结果中的标签页
- 在可恢复时撤销最近的关闭操作
- 支持 "t github"、"h github"、"b github" 等前缀命令
- 支持 "site:github.com"、"title:react"、"url:pull"、"window:current"、"pinned:true" 等过滤语法
- 支持跟随系统、暗色、浅色和高对比度主题

隐私：
- 所有搜索和排序都在 Chrome 本地完成
- 不使用 AI 服务
- 不使用云同步
- 不接入分析 SDK
- 不调用外部服务
- 不索引网页正文内容
- 不向网页注入 content script
- 不申请 host permissions
```

## Category And Language

- Suggested category: Productivity
- Default language: English
- Localized language already included in the extension package: Simplified Chinese (`zh_CN`)

## Permission Justification Copy

Use these in the Chrome Web Store privacy and permissions fields.

### `tabs`

```text
Required to read open tab titles, URLs, favicons, pinned state, window IDs, and tab indexes; switch to selected tabs; focus the correct Chrome window; close selected or matching tabs; and recreate recently closed tabs for undo.
```

### `storage`

```text
Required to store local-only settings such as theme preference, recent tab activity, and undo metadata.
```

### `tabGroups`

```text
Required to show tab group title, color, and grouping context in search results.
```

### Optional `history`

```text
Requested only when the user opens or searches the History scope. Used to search Chrome history titles and URLs locally and display matching results.
```

### Optional `bookmarks`

```text
Requested only when the user opens or searches the Bookmarks scope. Used to search bookmark titles, URLs, domains, paths, and folder paths locally.
```

## Privacy Practices Fields

### Single Purpose

```text
TabScout helps users quickly search, switch, and manage their open tabs, history, bookmarks, and tab groups from one local-first command palette.
```

### Data Use

```text
The extension accesses browser tabs, tab groups, history, bookmarks, and local extension settings only to provide command-panel search, navigation, and tab-management features.
```

### Data Sharing

```text
The extension does not sell, transfer, or share user data with third parties.
```

### Remote Code

```text
The extension does not use remote hosted code. All JavaScript, CSS, HTML, and assets are packaged with the extension.
```

### Remote Processing

```text
The extension does not upload browser data to external servers. Search, scoring, ranking, settings, and undo metadata are processed locally in the browser.
```

### Analytics

```text
The extension does not include analytics SDKs or tracking services.
```

### AI

```text
The extension does not include AI features or send data to AI services.
```

### Public Privacy Policy URL

```text
https://github.com/Liuwei1125/tabscout/blob/main/docs/privacy-policy.md
```

### Support URL

```text
https://github.com/Liuwei1125/tabscout/issues
```

## Store Assets

Generated local assets live in `docs/assets/store/`:

- `screenshot-command-panel.png` - 1280 x 800
- `screenshot-selection.png` - 1280 x 800
- `screenshot-options.png` - 1280 x 800
- `small-promo-tile.png` - 440 x 280

Before final submission, visually inspect these assets and replace them with production screenshots if the UI changes.
