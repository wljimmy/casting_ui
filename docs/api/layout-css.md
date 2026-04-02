# Layout CSS 技术文档

## 模块信息
- **版本**: v0.3.0
- **文件**: `src/modules/css/layout.css`
- **描述**: 布局样式模块，提供网页布局和应用壳布局

## 概述

Layout CSS 提供两种高级布局模式：网页布局（Web Layout）和应用壳布局（App Shell Layout）。这两种布局都采用 CSS Grid 实现，支持响应式设计和灵活的布局控制。

## 布局模式

### 1. 网页布局 (CUI-layout-web)

适合内容型网站，如博客、文档站点等。

**特点**:
- 流式自适应设计
- 超宽屏时主内容区限宽居中
- Header 和 Footer 通屏显示
- 支持左右侧边栏
- 主内容区随页面正常滚动

**使用方式**:
```html
<body class="CUI-layout-web">
    <header>头部内容</header>
    <aside class="CUI-sidebar-left">左侧边栏</aside>
    <main>主内容区</main>
    <aside class="CUI-sidebar-right">右侧边栏</aside>
    <footer>底部内容</footer>
</body>
```

**布局结构**:
```
+--------------------------------------------------+
|                      header                      |  <-- 通屏
+--------------------------------------------------+
|        |                            |            |
|  left  |           main             |   right    |  <-- 中间区域限宽
|        |                            |            |
+--------------------------------------------------+
|                      footer                      |  <-- 通屏
+--------------------------------------------------+
```

**CSS Grid 定义**:
- 行: header(自适应) + main(1fr) + footer(自适应)
- 列: 1fr + left(200px) + main(max 1000px) + right(200px) + 1fr
- 左右 `.` 区域用于实现通屏效果

### 2. 应用壳布局 (CUI-layout-shell)

适合管理后台、仪表盘等应用型界面。

**特点**:
- 上下左右固定区域
- 中间主内容区独立滚动
- 100vw x 100vh 固定尺寸
- 适合复杂的应用界面

**使用方式**:
```html
<body class="CUI-layout-shell">
    <header>顶部导航</header>
    <aside class="CUI-sidebar-left">左侧菜单</aside>
    <main>主内容区（独立滚动）</main>
    <aside class="CUI-sidebar-right">右侧信息</aside>
    <footer>底部状态栏</footer>
</body>
```

**布局结构**:
```
+------------------------------------------+
|                 header                   |  <-- 固定高度 60px
+----------+----------------------+--------+
|          |                      |        |
|   left   |        main          | right  |  <-- 中间区域滚动
|          |   (独立滚动区域)      |        |
+----------+----------------------+--------+
|                 footer                   |  <-- 固定高度 50px
+------------------------------------------+
```

**CSS Grid 定义**:
- 行: header(60px) + main(1fr) + footer(50px)
- 列: left(220px) + main(1fr) + right(220px)
- overflow: hidden（整体不滚动）

## 布局元素

### header
布局的顶部区域。

**样式特性**:
- 网页布局: 通屏显示，内容区域与主内容区对齐
- 应用壳布局: 固定高度 60px

### CUI-sidebar-left
左侧边栏区域。

**样式特性**:
- 网页布局: 宽度 200px
- 应用壳布局: 宽度 220px，可独立滚动

### main
主内容区域。

**样式特性**:
- 网页布局: 最大宽度 1000px，随页面滚动
- 应用壳布局: 独立滚动区域
- 内边距: 20px

### CUI-sidebar-right
右侧边栏区域。

**样式特性**:
- 网页布局: 宽度 200px
- 应用壳布局: 宽度 220px，可独立滚动

### footer
布局的底部区域。

**样式特性**:
- 网页布局: 通屏显示
- 应用壳布局: 固定高度 50px

## 布局控制类

通过给 body 添加以下类来控制布局元素的显示/隐藏：

| 类名 | 作用 | 影响的CSS变量 |
|------|------|---------------|
| `CUI-hidden-header` | 隐藏头部 | --web-header-height: 0, --shell-header-height: 0 |
| `CUI-hidden-sidebar-left` | 隐藏左侧边栏 | --web-sidebar-left-width: 0, --shell-sidebar-left-width: 0 |
| `CUI-hidden-sidebar-right` | 隐藏右侧边栏 | --web-sidebar-right-width: 0, --shell-sidebar-right-width: 0 |
| `CUI-hidden-footer` | 隐藏底部 | --web-footer-height: 0, --shell-footer-height: 0 |

**使用示例**:
```html
<!-- 隐藏右侧边栏和底部 -->
<body class="CUI-layout-web CUI-hidden-sidebar-right CUI-hidden-footer">
    ...
</body>
```

**动态切换**:
```javascript
// 隐藏头部
document.body.classList.add('CUI-hidden-header');

// 显示头部
document.body.classList.remove('CUI-hidden-header');

// 切换侧边栏
document.body.classList.toggle('CUI-hidden-sidebar-left');
```

## 布局变量

以下CSS变量可在 `:root` 或 body 中自定义：

### 网页布局变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--web-header-height` | 120px | 头部高度 |
| `--web-footer-height` | 50px | 底部高度 |
| `--web-sidebar-left-width` | 200px | 左侧边栏宽度 |
| `--web-sidebar-right-width` | 200px | 右侧边栏宽度 |
| `--web-main-max-width` | 1000px | 主内容区最大宽度 |

### 应用壳布局变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--shell-header-height` | 60px | 头部高度 |
| `--shell-footer-height` | 50px | 底部高度 |
| `--shell-sidebar-left-width` | 220px | 左侧边栏宽度 |
| `--shell-sidebar-right-width` | 220px | 右侧边栏宽度 |

## 使用示例

### 基础网页布局

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <link rel="stylesheet" href="src/modules/css/core.css">
    <link rel="stylesheet" href="src/modules/css/layout.css">
</head>
<body class="CUI-layout-web">
    <header>
        <h1>我的博客</h1>
    </header>
    
    <aside class="CUI-sidebar-left">
        <nav>导航菜单</nav>
    </aside>
    
    <main>
        <article>
            <h2>文章标题</h2>
            <p>文章内容...</p>
        </article>
    </main>
    
    <aside class="CUI-sidebar-right">
        <div>相关信息</div>
    </aside>
    
    <footer>
        <p>&copy; 2026 我的博客</p>
    </footer>
</body>
</html>
```

### 管理后台布局

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <link rel="stylesheet" href="src/modules/css/core.css">
    <link rel="stylesheet" href="src/modules/css/layout.css">
</head>
<body class="CUI-layout-shell">
    <header>
        <div class="logo">管理后台</div>
        <div class="user">管理员</div>
    </header>
    
    <aside class="CUI-sidebar-left">
        <menu class="menu-sidebar">
            <ul>
                <li>仪表盘</li>
                <li>用户管理</li>
                <li>系统设置</li>
            </ul>
        </menu>
    </aside>
    
    <main>
        <h1>仪表盘</h1>
        <div class="dashboard">
            <!-- 大量内容，可独立滚动 -->
        </div>
    </main>
    
    <footer>
        <span>系统状态: 正常</span>
    </footer>
</body>
</html>
```

### 动态布局切换

```html
<body class="CUI-layout-web" id="app">
    <header>头部</header>
    <aside class="CUI-sidebar-left">左侧栏</aside>
    <main>内容区</main>
    <footer>底部</footer>
    
    <script>
        // 切换到应用壳布局
        function switchToShell() {
            document.body.classList.remove('CUI-layout-web');
            document.body.classList.add('CUI-layout-shell');
        }
        
        // 切换到网页布局
        function switchToWeb() {
            document.body.classList.remove('CUI-layout-shell');
            document.body.classList.add('CUI-layout-web');
        }
        
        // 隐藏侧边栏
        function toggleSidebar() {
            document.body.classList.toggle('CUI-hidden-sidebar-left');
        }
    </script>
</body>
```

## 响应式设计

布局系统可以与响应式类结合使用：

```html
<body class="CUI-layout-web">
    <header class="CUI-grid CUI-grid-2c CUI-grid-v-center">
        <div>Logo</div>
        <div class="CUI-grid CUI-grid-right">
            <nav>导航</nav>
        </div>
    </header>
    
    <aside class="CUI-sidebar-left CUI-hidden-mobile">
        <!-- 移动端隐藏侧边栏 -->
    </aside>
    
    <main>
        <!-- 主内容 -->
    </main>
</body>
```

## 注意事项

1. **结构要求**: 必须使用标准的 HTML5 语义标签（header、aside、main、footer）
2. **类名要求**: 侧边栏必须添加 `CUI-sidebar-left` 或 `CUI-sidebar-right` 类
3. **层级关系**: 所有布局元素必须是 body 的直接子元素
4. **内容溢出**: 应用壳布局中，main 区域需要自行处理内容溢出
5. **兼容性**: 使用 CSS Grid，IE11 不完全支持

## 更新记录

### v0.3.0 (2026-04-03)
- 新增网页布局（CUI-layout-web）
- 新增应用壳布局（CUI-layout-shell）
- 新增布局控制类（CUI-hidden-*）
- 统一类名前缀为 `CUI-`
- 优化 Grid 布局结构
