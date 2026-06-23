# TabScout

<p align="center">
  <a href="README.md">English</a>
  ·
  <a href="README.zh-CN.md"><strong>简体中文</strong></a>
</p>

<p align="center">
  <img alt="版本 0.1.0" src="https://img.shields.io/badge/version-0.1.0-2563eb?style=for-the-badge">
  <img alt="测试通过" src="https://img.shields.io/badge/tests-passing-22c55e?style=for-the-badge">
  <img alt="Manifest V3" src="https://img.shields.io/badge/manifest-MV3-475569?style=for-the-badge">
  <img alt="本地优先" src="https://img.shields.io/badge/privacy-local--first-16a34a?style=for-the-badge">
  <img alt="Chrome Web Store beta" src="https://img.shields.io/badge/Chrome%20Web%20Store-beta-9333ea?style=for-the-badge">
</p>

<p align="center">
  <a href="docs/privacy-policy.md"><strong>隐私政策</strong></a>
  ·
  <a href="docs/store-listing.md"><strong>商店文案</strong></a>
</p>

![TabScout 命令面板](docs/assets/store/screenshot-command-panel.png)

TabScout 是一个本地优先的 Chrome 命令面板插件，用来快速搜索、切换和整理标签页、历史记录、书签和标签页分组。

它适合经常同时打开大量标签页的用户：你可以用键盘快速定位页面、跨窗口切换标签页、搜索历史记录和书签，并安全清理重复标签页或同域名标签页。

## 截图

![命令面板](docs/assets/store/screenshot-command-panel.png)

![多选关闭](docs/assets/store/screenshot-selection.png)

![设置页](docs/assets/store/screenshot-options.png)

## 功能

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

## 隐私与权限

TabScout 是本地优先工具：

- 不使用 AI。
- 不使用云同步。
- 不接入分析 SDK。
- 不调用外部服务。
- 不索引网页正文。
- 不注入 content scripts。
- 不申请 host permissions。
- 历史记录和书签权限只会在用户打开或搜索对应作用域时请求。

当前请求的 Chrome 权限：

- `tabs`：读取和管理打开的标签页、切换标签页、关闭标签页，以及在撤销时恢复标签页。
- `storage`：在本地保存主题、最近标签页活动和撤销信息。
- `tabGroups`：读取标签页分组标题、颜色和分组上下文。
- 可选 `history`：在本地搜索 Chrome 历史记录。
- 可选 `bookmarks`：在本地搜索 Chrome 书签。

隐私政策见 [docs/privacy-policy.md](docs/privacy-policy.md)。

## 本地开发

依赖：

- 与当前 WXT/Vite 工具链兼容的 Node.js。
- npm。

安装依赖：

```bash
npm install
```

启动 WXT 开发服务：

```bash
npm run dev
```

运行检查：

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

运行 Playwright e2e 测试：

```bash
npm run e2e
```

## 发布包

生成 Chrome MV3 上传 zip：

```bash
npm run zip
```

zip 输出位置：

```text
.output/tabscout-0.1.0-chrome.zip
```

上传 Chrome Web Store 前，确认 zip 根目录直接包含 `manifest.json`：

```bash
unzip -l .output/tabscout-0.1.0-chrome.zip | head
```

## 本地安装

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

## Chrome Web Store 状态

TabScout 已准备进行 Chrome Web Store beta 提交。商店文案、截图、权限说明和 QA 记录见 [docs/chrome-web-store-prep.md](docs/chrome-web-store-prep.md)。

## 仓库说明

构建产物、本地 QA 工作文件、Playwright 报告和 Chrome Web Store zip 包不会进入 git。`docs/assets/store/` 下的商店截图和推广图会被保留，用于公开商店页准备。

## 免责声明

TabScout 与 Google、Chrome、Alfred、Raycast、Arc、GitHub、Figma、Notion、Linear 或截图和示例中出现的其他第三方产品不存在从属关系，也未获得这些公司或产品的背书。

