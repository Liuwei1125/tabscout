# TabScout

[English](#english) | [简体中文](#简体中文)

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-MV3-4285F4)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB)
![Local First](https://img.shields.io/badge/privacy-local--first-16a34a)

TabScout is a local-first Chrome command palette for quickly searching, switching, and cleaning up tabs, history, bookmarks, and tab groups.

> Chrome Web Store package: `.output/tabscout-0.1.0-chrome.zip`
>
> Privacy policy: [docs/privacy-policy.md](docs/privacy-policy.md)

![TabScout command panel](docs/assets/store/screenshot-command-panel.png)

## English

### Why TabScout

Chrome's built-in tab search and history pages are useful, but they are not optimized for users who keep dozens of tabs open and want a keyboard-first command experience. TabScout brings tab search, history search, bookmark search, tab group context, and safe tab cleanup into one compact panel.

It is closer to Alfred, Raycast, Arc Command Bar, and Chrome command surfaces than to a search-engine extension.

### Screenshots

| Command panel | Bulk selection | Settings |
| --- | --- | --- |
| ![Command panel](docs/assets/store/screenshot-command-panel.png) | ![Bulk selection](docs/assets/store/screenshot-selection.png) | ![Settings](docs/assets/store/screenshot-options.png) |

### Features

- Search open tabs across all Chrome windows.
- Match title, domain, path, and full URL.
- Activate a selected tab and focus its window.
- Search Chrome history after optional permission is granted.
- Search Chrome bookmarks after optional permission is granted.
- Switch scopes between All, Tabs, History, Bookmarks, and Groups.
- Use prefix commands:
  - `t github` or `tab github`: tabs only
  - `h github` or `his github`: history only
  - `b github` or `bm github`: bookmarks only
- Use search filters:
  - `site:github.com`
  - `title:react`
  - `url:pull`
  - `window:current`
  - `pinned:true`
- Manage tabs:
  - switch to tab
  - close selected tab
  - close duplicate URL tabs
  - close same-domain tabs
  - close matching search-result tabs
  - select multiple visible tab results and close them safely
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

### Privacy

TabScout is local-first:

- No AI.
- No cloud sync.
- No analytics SDK.
- No external service calls.
- No page-body indexing.
- No content scripts.
- No host permissions.
- History and bookmarks are requested only when the user opens or searches those scopes.

Public privacy policy URL for Chrome Web Store:

```text
https://github.com/Liuwei1125/tabscout/blob/main/docs/privacy-policy.md
```

### Permissions

Required permissions:

- `tabs`: read and manage open tabs, activate tabs, close tabs, and restore tabs for undo.
- `storage`: store theme, recent tab activity, and undo metadata locally.
- `tabGroups`: read tab group metadata for display.

Optional permissions:

- `history`: search Chrome history locally.
- `bookmarks`: search Chrome bookmarks locally.

### Tech Stack

- WXT
- Chrome Extension Manifest V3
- React
- TypeScript
- TailwindCSS
- lucide-react
- Vitest
- Playwright

### Development

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

### Local Installation

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

### Project Structure

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
docs/                      Store listing, privacy, QA, and release docs
```

### Store And Release Materials

- Store listing copy: [docs/store-listing.md](docs/store-listing.md)
- Privacy policy: [docs/privacy-policy.md](docs/privacy-policy.md)
- Chrome Web Store checklist: [docs/chrome-web-store-prep.md](docs/chrome-web-store-prep.md)
- Manual QA checklist: [docs/manual-qa-checklist.md](docs/manual-qa-checklist.md)
- Release notes: [docs/release-0.1.0-beta.md](docs/release-0.1.0-beta.md)
- Store screenshots and promotional tile: [docs/assets/store](docs/assets/store)

### MVP Boundary

Not included in this MVP:

- AI semantic search
- webpage body search
- full history indexing
- account login
- cloud sync
- session cloud backup
- heavy dashboard UI
- arbitrary website content scripts

---

## 简体中文

### TabScout 是什么

TabScout 是一个本地优先的 Chrome 命令面板插件，用来快速搜索、切换和整理标签页、历史记录、书签和标签页分组。

Chrome 自带的标签页搜索和历史记录页面能用，但不够像效率工具。TabScout 更接近 Alfred、Raycast、Arc Command Bar 这类命令面板：第一屏就是搜索框，支持键盘操作，结果列表紧凑清晰，并且可以安全地清理重复标签页、同域名标签页和当前搜索结果中的标签页。

### 截图

| 命令面板 | 多选关闭 | 设置页 |
| --- | --- | --- |
| ![命令面板](docs/assets/store/screenshot-command-panel.png) | ![多选关闭](docs/assets/store/screenshot-selection.png) | ![设置页](docs/assets/store/screenshot-options.png) |

### 核心功能

- 搜索所有 Chrome 窗口里的打开标签页。
- 匹配标题、域名、路径和完整 URL。
- 选中结果后切换到对应标签页，并聚焦所在窗口。
- 授权后搜索 Chrome 历史记录。
- 授权后搜索 Chrome 书签。
- 支持 All、Tabs、History、Bookmarks、Groups 作用域切换。
- 支持前缀命令：
  - `t github` 或 `tab github`：只搜索标签页
  - `h github` 或 `his github`：只搜索历史记录
  - `b github` 或 `bm github`：只搜索书签
- 支持搜索过滤：
  - `site:github.com`
  - `title:react`
  - `url:pull`
  - `window:current`
  - `pinned:true`
- 支持标签页管理：
  - 切换标签页
  - 关闭选中标签页
  - 关闭重复 URL 标签页
  - 关闭同域名标签页
  - 关闭当前搜索结果中的标签页
  - 多选可见标签页并批量关闭
  - 在可恢复时撤销最近关闭操作
- 支持键盘操作：
  - 输入框默认聚焦
  - 上下键选择
  - Enter 打开/切换
  - Esc 关闭面板
  - Cmd/Ctrl + Enter 打开操作菜单
  - Cmd/Ctrl + Backspace 关闭选中的标签页
- 支持主题：
  - 跟随系统
  - 命令暗色
  - 命令浅色
  - 高对比度
- 支持语言：
  - 英文
  - 简体中文

### 隐私

TabScout 是本地优先工具：

- 不使用 AI。
- 不使用云同步。
- 不接入分析 SDK。
- 不调用外部服务。
- 不索引网页正文。
- 不注入 content scripts。
- 不申请 host permissions。
- 历史记录和书签权限只会在用户打开或搜索对应作用域时请求。

Chrome Web Store 可填写的公开隐私政策 URL：

```text
https://github.com/Liuwei1125/tabscout/blob/main/docs/privacy-policy.md
```

### 权限说明

必需权限：

- `tabs`：读取和管理打开的标签页、切换标签页、关闭标签页，以及在撤销时恢复标签页。
- `storage`：在本地保存主题、最近标签页活动和撤销信息。
- `tabGroups`：读取标签页分组标题、颜色和分组上下文。

可选权限：

- `history`：在本地搜索 Chrome 历史记录。
- `bookmarks`：在本地搜索 Chrome 书签。

### 本地开发

安装依赖：

```bash
npm install
```

启动开发模式：

```bash
npm run dev
```

构建 Chrome MV3 插件：

```bash
npm run build
```

生成 Chrome Web Store 上传包：

```bash
npm run zip
```

运行验证：

```bash
npm run typecheck
npm run lint
npm run test
npm run e2e
```

### 本地安装

1. 运行 `npm run build`。
2. 打开 `chrome://extensions`。
3. 开启 Developer mode。
4. 点击 “Load unpacked”。
5. 选择 `.output/chrome-mv3`。
6. 如有需要，把插件固定到 Chrome 工具栏。
7. 打开 `chrome://extensions/shortcuts` 调整快捷键。

默认快捷键：

- macOS：`Command+Shift+Space`
- 其他平台：`Ctrl+Shift+Space`

### 发布材料

- 商店文案：[docs/store-listing.md](docs/store-listing.md)
- 隐私政策：[docs/privacy-policy.md](docs/privacy-policy.md)
- Chrome Web Store 检查清单：[docs/chrome-web-store-prep.md](docs/chrome-web-store-prep.md)
- 手动 QA 清单：[docs/manual-qa-checklist.md](docs/manual-qa-checklist.md)
- 发布说明：[docs/release-0.1.0-beta.md](docs/release-0.1.0-beta.md)
- 商店截图和推广图：[docs/assets/store](docs/assets/store)

