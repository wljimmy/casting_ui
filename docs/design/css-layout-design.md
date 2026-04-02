# 原生 Grid 双布局框架 · 最终定稿规范
## 命名修正
- 常规页面：**网页布局（Web Layout）**
- 全屏固定壳：**应用壳布局（App Shell Layout）**

---

# 1. 总体设计规则
1. **结构固定为 5 个原生区块**
   `<header>` 顶部
   `<aside class="sidebar-left">` 左侧边栏
   `<main>` 主内容区
   `<aside class="sidebar-right">` 右侧边栏
   `<footer>` 底部

2. **统一使用 CSS Grid 布局**
   不使用 `position:fixed` 造成重叠，所有区块由 Grid 直接划分区域，**天然互不重叠**。

3. **body 唯一控制入口**
   布局模式、显示/隐藏、吸顶、固定行为，全部通过 `<body>` 上的类控制，子区域不加状态类。

4. **两套布局模式**
   - 网页布局：流式自适应 + 超宽屏 main 限宽居中
   - 应用壳布局：上下左右均为固定区域，中间 main 独立滚动，典型 App 外壳

---

# 2. HTML 结构规范（固定不变）
```html
<body class="layout-web">
  <header></header>
  <aside class="sidebar-left"></aside>
  <main></main>
  <aside class="sidebar-right"></aside>
  <footer></footer>
</body>
```

---

# 3. CSS 全局变量（:root）
```css
:root {
  /* 间距与内边距 */
  --main-padding: 20px;

  /* 网页布局 */
  --web-header-height: 60px;
  --web-footer-height: 50px;
  --web-sidebar-width: 200px;
  --web-main-max-width: 1000px;

  /* 应用壳布局 App Shell */
  --shell-header-height: 60px;
  --shell-footer-height: 50px;
  --shell-sidebar-width: 220px;

  /* 层级与吸顶（仅网页布局可用） */
  --z-sticky: 90;
  --sticky-top: var(--web-header-height);
}
```

---

# 4. body 类名规范
## 4.1 布局类（二选一）
- `layout-web`：网页流式布局
- `layout-shell`：应用壳布局（App Shell）

## 4.2 全局控制类
- `hidden-header`      隐藏头部
- `hidden-sidebar-left` 隐藏左侧边栏
- `hidden-sidebar-right` 隐藏右侧边栏
- `hidden-footer`      隐藏底部
- `sticky-sidebar`     边栏吸顶（仅网页布局生效）

---

# 5. 布局实现规则（核心）
## 5.1 网页布局（layout-web）
目标：
- 正常宽度：左右边栏固定，main 撑满剩余空间
- 超宽屏幕：main 限制最大宽度，整体居中，边栏紧贴 main
- Grid 划分，无重叠

```css
.layout-web {
  min-height: 100vh;
  display: grid;
  grid-template-rows:
    var(--web-header-height)
    1fr
    var(--web-footer-height);

  grid-template-columns:
    var(--web-sidebar-width)
    minmax(0, var(--web-main-max-width))
    var(--web-sidebar-width);

  justify-content: center;
  grid-template-areas:
    "header  header  header"
    "left    main    right"
    "footer  footer  footer";
}

.layout-web header         { grid-area: header; }
.layout-web .sidebar-left  { grid-area: left; }
.layout-web main           { grid-area: main; }
.layout-web .sidebar-right { grid-area: right; }
.layout-web footer         { grid-area: footer; }
```

---

## 5.2 应用壳布局（layout-shell）
### 核心定义
- 顶部、左侧边栏、右侧边栏、底部均为**固定尺寸**
- 中间 main 自动填充剩余空间
- main 内部独立滚动
- 所有区域由 Grid 划分，**互不重叠、不覆盖、不使用 fixed 错位**

```css
.layout-shell {
  width: 100vw;
  height: 100vh;
  display: grid;
  overflow: hidden;

  /* 行：顶部固定 / 主体自适应 / 底部固定 */
  grid-template-rows:
    var(--shell-header-height)
    1fr
    var(--shell-footer-height);

  /* 列：左侧固定 / 主体自适应 / 右侧固定 */
  grid-template-columns:
    var(--shell-sidebar-width)
    1fr
    var(--shell-sidebar-width);

  grid-template-areas:
    "header  header  header"
    "left    main    right"
    "footer  footer  footer";
}

.layout-shell header         { grid-area: header; }
.layout-shell .sidebar-left  { grid-area: left; }
.layout-shell main           { grid-area: main; }
.layout-shell .sidebar-right { grid-area: right; }
.layout-shell footer         { grid-area: footer; }
```

---

# 6. main 主内容区完整样式规范
```css
main {
  padding: var(--main-padding);
  box-sizing: border-box;
  overflow-wrap: break-word;
}

/* 应用壳中 main 独立滚动 */
.layout-shell main {
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* 网页布局中 main 随页面正常滚动 */
.layout-web main {
  overflow: visible;
}
```

---

# 7. body 控制的状态样式（无重叠、纯 Grid 友好）
## 7.1 隐藏控制
```css
body.hidden-header header               { display: none; }
body.hidden-sidebar-left .sidebar-left  { display: none; }
body.hidden-sidebar-right .sidebar-right{ display: none; }
body.hidden-footer footer               { display: none; }
```

## 7.2 边栏吸顶（仅网页布局）
```css
.layout-web.sticky-sidebar .sidebar-left,
.layout-web.sticky-sidebar .sidebar-right {
  position: sticky;
  top: var(--sticky-top);
  height: calc(100vh - var(--sticky-top));
  overflow-y: auto;
  z-index: var(--z-sticky);
}
```

## 7.3 应用壳中不使用吸顶
应用壳本身已经固定四边，`.sticky-sidebar` 在 `layout-shell` 下不生效。

---

# 8. 全局基础样式
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  margin: 0;
}
```

---

# 9. AI 生成 CSS 执行准则
1. 严格使用 **header / left / main / right / footer** 5 区域结构。
2. 两套布局均使用 Grid，不使用 `position: fixed` 做整体布局，避免重叠。
3. 应用壳布局：
   - `100vw 100vh` 撑满屏幕
   - `overflow: hidden`
   - `main` 设置 `overflow-y: auto` 独立滚动
4. 网页布局：
   - `minmax(0, var(--web-main-max-width))` 实现自动拉伸 + 超宽限宽
   - `justify-content: center` 实现边栏紧贴 main 并居中
5. 所有显隐逻辑由 body 类控制，不写内联样式，不使用 !important。
6. 应用壳布局中，四边区域固定、互不重叠，Grid 自动分配空间。