# Casting UI 框架开发约束

## 核心目标
让用户专注内容，框架自动处理其他。

## 目录结构
- `src/modules/` - 功能模块
- `public/manual/` - 手册页
- `test/` - 测试页
- `dist/` - 发布产物

## 模块规范
- 模块间可具备严密的依赖拓扑关系，必须在头部以 `@dependency` 注释声明，并在注册时显式声明 `dependencies` 数组
- 使用原生 ES6 模块化，保证模块零全局污染
- **发布打包哲学**：
  - 前期开发阶段（1.0 以前）长久处于 DEV ES6 Module 原生状态，禁止任何自动打包，便于快速迭代与加入新模块。
  - 发布正式 1.0 或重大里程碑版本时，**通过人工确认、手动打包**将所有 JS 文件合并为单个 `Casting.js`，CSS 文件合并为单个 `Casting.css`，最终为终端用户提供极简的双文件引入方案。
  - 严禁加入任何侵入式自动化打包构建链路（如在 git 提交或保存时自动构建）。

## 示例/手册页
- 必须使用框架CSS类
- 禁止内嵌`<style>`
- 内联脚本需添加忽略备注

## 命名空间
- 使用 `window.CUI`
- 禁止直接使用 `window`

## 路径规范
- Vite开发模式下，`src/` 和 `public/` 目录为默认根目录
- 页面链接生成时需注意路径前缀：
  - `src/` 目录下文件路径：`/src/...`
  - `public/` 目录下文件路径：`/...`（无需 public 前缀）
  - 示例：`/src/modules/css/core.css`、`/manual/theme-manager-container/index.html`
