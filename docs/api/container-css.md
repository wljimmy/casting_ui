# Container CSS 技术文档

## 模块信息
- **版本**: v0.3.0
- **文件**: `src/modules/css/container.css`
- **描述**: 容器样式模块，提供视觉容器、Grid布局、间距等类

## 概述

Container CSS 提供了一套完整的容器类系统，包括视觉容器、语义容器、Grid布局系统和间距类。所有类名统一使用 `CUI-` 前缀。

## 视觉容器类

### CUI-box
基础通用容器，带边框和内边距。

```html
<div class="CUI-box">
    内容区域
</div>
```

**样式特性**:
- 内边距: `--size-md` (16px)
- 边框: 1px solid `--border-color`
- 背景色: `--bg-color`
- 圆角: `--radius-md` (8px)

### CUI-card
卡片容器，带阴影效果。

```html
<div class="CUI-card">
    卡片内容
</div>
```

**样式特性**:
- 背景色: `--bg-color`
- 圆角: `--radius-md` (8px)
- 阴影: `--shadow-md`
- 内边距: `--size-md` (16px)
- 过渡效果: `--transition-normal`

### CUI-fluid
透明无样式布局容器，用于纯布局目的。

```html
<div class="CUI-fluid">
    透明容器
</div>
```

**样式特性**:
- 宽度: 100%
- 无内边距、无边框、无背景

### CUI-panel
功能面板容器，带边框和圆角。

```html
<div class="CUI-panel">
    面板内容
</div>
```

**样式特性**:
- 边框: 1px solid `--border-color`
- 圆角: `--radius-md` (8px)
- 溢出: hidden

## 语义功能型容器

### CUI-section
页面章节/区块容器。

```html
<section class="CUI-section">
    <h2>章节标题</h2>
    <p>章节内容...</p>
</section>
```

**样式特性**:
- 内边距: `--size-lg` (24px)
- 下外边距: `--size-lg` (24px)

### CUI-header
页面头部容器。

```html
<header class="CUI-header">
    <h1>网站标题</h1>
</header>
```

**样式特性**:
- 最小高度: 60px
- 内边距: `--size-md` (16px)
- 背景色: `--gray-100`
- 下边框: 1px solid `--border-color`

### CUI-footer
页面底部容器。

```html
<footer class="CUI-footer">
    <p>版权信息</p>
</footer>
```

**样式特性**:
- 最小高度: 60px
- 内边距: `--size-md` (16px)
- 背景色: `--gray-100`
- 上边框: 1px solid `--border-color`

### CUI-main
主内容容器。

```html
<main class="CUI-main">
    主要内容
</main>
```

**样式特性**:
- flex: 1
- 内边距: `--size-md` (16px)

### CUI-aside
侧边栏容器。

```html
<aside class="CUI-aside">
    侧边栏内容
</aside>
```

**样式特性**:
- 宽度: 200px
- 内边距: `--size-md` (16px)
- 背景色: `--gray-100`
- 右边框: 1px solid `--border-color`

### CUI-page
页面根容器。

```html
<body class="CUI-page">
    <!-- 页面内容 -->
</body>
```

**样式特性**:
- 最小高度: 100vh
- display: flex
- flex-direction: column

### CUI-wrap
内容宽度约束包裹容器。

```html
<div class="CUI-wrap">
    受限宽度的内容
</div>
```

**样式特性**:
- 最大宽度: 1200px
- 水平居中
- 内边距: `--size-md` (16px)

## Grid布局系统

### CUI-grid
启用Grid布局的基础类。

```html
<div class="CUI-grid">
    <div>项目1</div>
    <div>项目2</div>
</div>
```

**样式特性**:
- display: grid
- 间距: `--size-md` (16px)

### 列数类

| 类名 | 列数 | 说明 |
|------|------|------|
| `CUI-grid-1c` | 1列 | 单列布局 |
| `CUI-grid-2c` | 2列 | 双列布局 |
| `CUI-grid-3c` | 3列 | 三列布局 |
| `CUI-grid-4c` | 4列 | 四列布局 |
| `CUI-grid-5c` | 5列 | 五列布局 |
| `CUI-grid-6c` | 6列 | 六列布局 |
| `CUI-grid-7c` | 7列 | 七列布局 |
| `CUI-grid-8c` | 8列 | 八列布局 |
| `CUI-grid-9c` | 9列 | 九列布局 |
| `CUI-grid-10c` | 10列 | 十列布局 |
| `CUI-grid-11c` | 11列 | 十一列布局 |
| `CUI-grid-12c` | 12列 | 十二列布局 |

**使用示例**:
```html
<div class="CUI-grid CUI-grid-3c">
    <div>列1</div>
    <div>列2</div>
    <div>列3</div>
</div>
```

### CUI-grid-middle
三列结构（1fr auto 1fr），左右自适应+中间严格居中。

```html
<div class="CUI-grid CUI-grid-middle">
    <div>左侧内容</div>
    <div>中间内容</div>
    <div>右侧内容</div>
</div>
```

## 对齐类

### 水平对齐

| 类名 | 说明 |
|------|------|
| `CUI-grid-left` | 子项水平靠左 |
| `CUI-grid-h-center` | 子项水平居中 |
| `CUI-grid-right` | 子项水平靠右 |

### 垂直对齐

| 类名 | 说明 |
|------|------|
| `CUI-grid-top` | 子项垂直靠上 |
| `CUI-grid-v-center` | 子项垂直居中 |
| `CUI-grid-bottom` | 子项垂直靠下 |

### 组合对齐

| 类名 | 说明 |
|------|------|
| `CUI-grid-center` | 子项水平+垂直双向居中 |
| `CUI-grid-between` | 子项两端对齐分布 |
| `CUI-grid-around` | 子项间距均匀分布 |
| `CUI-grid-stretch` | 子项拉伸填满单元格 |

**使用示例**:
```html
<!-- 水平居中 -->
<div class="CUI-grid CUI-grid-3c CUI-grid-h-center">
    <div>居中项目</div>
</div>

<!-- 双向居中 -->
<div class="CUI-grid CUI-grid-center">
    <div>完全居中</div>
</div>
```

## 跨列/跨行类

### 跨列类

| 类名 | 跨度 |
|------|------|
| `CUI-span-1c` | 跨1列 |
| `CUI-span-2c` | 跨2列 |
| `CUI-span-3c` | 跨3列 |
| `CUI-span-4c` | 跨4列 |
| `CUI-span-5c` | 跨5列 |
| `CUI-span-6c` | 跨6列 |
| `CUI-span-7c` | 跨7列 |
| `CUI-span-8c` | 跨8列 |
| `CUI-span-9c` | 跨9列 |
| `CUI-span-10c` | 跨10列 |
| `CUI-span-11c` | 跨11列 |
| `CUI-span-12c` | 跨12列 |

### 跨行类

| 类名 | 跨度 |
|------|------|
| `CUI-span-1r` | 跨1行 |
| `CUI-span-2r` | 跨2行 |
| `CUI-span-3r` | 跨3行 |
| `CUI-span-4r` | 跨4行 |
| `CUI-span-5r` | 跨5行 |
| `CUI-span-6r` | 跨6行 |
| `CUI-span-7r` | 跨7行 |
| `CUI-span-8r` | 跨8行 |
| `CUI-span-9r` | 跨9行 |
| `CUI-span-10r` | 跨10行 |
| `CUI-span-11r` | 跨11行 |
| `CUI-span-12r` | 跨12行 |

**使用示例**:
```html
<div class="CUI-grid CUI-grid-3c">
    <div class="CUI-span-2c">跨2列</div>
    <div>普通列</div>
    <div class="CUI-span-3c">跨3列</div>
</div>
```

## 间距类

### 外边距

| 类名 | 值 |
|------|-----|
| `CUI-m-xs` | 4px |
| `CUI-m-sm` | 8px |
| `CUI-m-md` | 16px |
| `CUI-m-lg` | 24px |
| `CUI-m-xl` | 32px |

### 内边距

| 类名 | 值 |
|------|-----|
| `CUI-p-xs` | 4px |
| `CUI-p-sm` | 8px |
| `CUI-p-md` | 16px |
| `CUI-p-lg` | 24px |
| `CUI-p-xl` | 32px |

**使用示例**:
```html
<div class="CUI-box CUI-m-md CUI-p-lg">
    带外边距和内边距的容器
</div>
```

## 内容层吸顶

### CUI-sticky

```html
<div class="CUI-sticky">
    吸顶内容
</div>
```

**样式特性**:
- position: sticky
- top: 0

## 完整示例

### 响应式网格布局

```html
<div class="CUI-grid CUI-grid-3c CUI-grid-v-center">
    <div class="CUI-card CUI-p-md">
        <h3>卡片1</h3>
        <p>卡片内容</p>
    </div>
    <div class="CUI-card CUI-p-md">
        <h3>卡片2</h3>
        <p>卡片内容</p>
    </div>
    <div class="CUI-card CUI-p-md">
        <h3>卡片3</h3>
        <p>卡片内容</p>
    </div>
</div>
```

### 复杂布局

```html
<div class="CUI-page">
    <header class="CUI-header">
        <h1>网站标题</h1>
    </header>
    
    <div class="CUI-grid CUI-grid-12c">
        <aside class="CUI-aside CUI-span-3c">
            侧边栏
        </aside>
        
        <main class="CUI-main CUI-span-9c">
            <section class="CUI-section">
                <h2>章节标题</h2>
                <div class="CUI-grid CUI-grid-2c">
                    <div class="CUI-box">内容1</div>
                    <div class="CUI-box">内容2</div>
                </div>
            </section>
        </main>
    </div>
    
    <footer class="CUI-footer">
        <p>版权信息</p>
    </footer>
</div>
```

## 注意事项

1. **类名前缀**: 所有类名统一使用 `CUI-` 前缀
2. **组合使用**: 容器类、Grid类、对齐类可以组合使用
3. **响应式**: 建议配合 responsive.css 使用媒体查询
4. **性能**: Grid布局在现代浏览器中性能优异
5. **兼容性**: 使用CSS Grid，IE11不完全支持

## 更新记录

### v0.3.0 (2026-04-03)
- 新增完整Grid布局系统（1-12列）
- 新增对齐类（水平、垂直、组合）
- 新增跨列/跨行类
- 新增间距类
- 统一类名前缀为 `CUI-`
