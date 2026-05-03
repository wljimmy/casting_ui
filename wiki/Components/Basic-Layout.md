
# 基础布局组件

基础布局组件是构建页面结构的核心元素。

## 通用容器

### CUI-box - 通用盒子

最基础的容器类，提供边框、内边距和圆角。

```html
<div class="CUI-box">
  <h3>标题</h3>
  <p>这是一个通用盒子容器</p>
</div>
```

**特性**：
- 带边框和圆角
- 标准内边距
- 浅色背景

### CUI-card - 卡片容器

用于展示独立内容块的卡片组件。

```html
<div class="CUI-card">
  <h3>卡片标题</h3>
  <p>卡片内容描述</p>
</div>
```

**特性**：
- 阴影效果
- 圆角边框
- 优雅的间距

**配合 Grid 布局使用**：

```html
<div class="CUI-grid CUI-grid-3c">
  <div class="CUI-card">卡片 1</div>
  <div class="CUI-card">卡片 2</div>
  <div class="CUI-card">卡片 3</div>
</div>
```

### CUI-fluid - 流式容器

宽度自适应的容器。

```html
<div class="CUI-fluid">
  宽度占满父容器
</div>
```

### CUI-wrap - 约束宽度容器

最大宽度 1200px，居中显示的容器。

```html
<div class="CUI-wrap">
  内容在大屏幕上居中显示
</div>
```

### CUI-section - 页面区块

用于组织大段内容的区块容器。

```html
<section class="CUI-section">
  <h2>章节标题</h2>
  <p>章节内容...</p>
</section>
```

## Grid 布局系统

### 基础用法

```html
<!-- 基础网格 -->
<div class="CUI-grid">
  <div>项 1</div>
  <div>项 2</div>
  <div>项 3</div>
</div>
```

### 列数配置

| 类名 | 描述 |
|------|------|
| `.CUI-grid-1c` | 1 列布局 |
| `.CUI-grid-2c` | 2 列等宽 |
| `.CUI-grid-3c` | 3 列等宽 |
| `.CUI-grid-4c` | 4 列等宽 |
| `.CUI-grid-6c` | 6 列等宽 |
| `.CUI-grid-12c` | 12 列等宽 |

```html
<div class="CUI-grid CUI-grid-2c">
  <div class="CUI-card">左</div>
  <div class="CUI-card">右</div>
</div>
```

### 对齐方式

#### 水平对齐

| 类名 | 描述 |
|------|------|
| `.CUI-grid-left` | 左对齐 |
| `.CUI-grid-h-center` | 水平居中 |
| `.CUI-grid-right` | 右对齐 |

#### 垂直对齐

| 类名 | 描述 |
|------|------|
| `.CUI-grid-top` | 顶部对齐 |
| `.CUI-grid-v-center` | 垂直居中 |
| `.CUI-grid-bottom` | 底部对齐 |

#### 居中对齐

| 类名 | 描述 |
|------|------|
| `.CUI-grid-center` | 水平垂直双向居中 |
| `.CUI-grid-middle` | 三列结构：1fr auto 1fr |

```html
<div class="CUI-grid CUI-grid-center" style="min-height: 200px;">
  <div class="CUI-box">居中内容</div>
</div>
```

### 组合示例

```html
<div class="CUI-grid CUI-grid-3c CUI-grid-v-center">
  <div class="CUI-card">左</div>
  <div class="CUI-card">中</div>
  <div class="CUI-card">右</div>
</div>
```

## 页面布局模式

框架提供两种完整的页面布局模式。

### 1. 网页布局 (layout-web)

流式布局，超宽屏时主内容区居中。

```html
<body class="layout-web">
  <header>顶部导航</header>
  <aside class="sidebar-left">左侧边栏</aside>
  <main>主内容区</main>
  <aside class="sidebar-right">右侧边栏</aside>
  <footer>底部信息</footer>
</body>
```

### 2. 应用壳布局 (layout-shell)

固定布局，各区域独立滚动。

```html
<body class="layout-shell">
  <header>顶部导航</header>
  <aside class="sidebar-left">左侧菜单</aside>
  <main>主内容区</main>
  <aside class="sidebar-right">右侧边栏</aside>
  <footer>底部信息</footer>
</body>
```

### 布局控制类

通过在 body 上添加类来控制布局元素的显示：

| 类名 | 描述 |
|------|------|
| `.hidden-header` | 隐藏头部 |
| `.hidden-sidebar-left` | 隐藏左侧边栏 |
| `.hidden-sidebar-right` | 隐藏右侧边栏 |
| `.hidden-footer` | 隐藏底部 |
| `.sticky-sidebar` | 边栏吸顶（仅网页布局） |

```html
<!-- 单栏布局 -->
<body class="layout-web hidden-sidebar-left hidden-sidebar-right">
  <header>标题</header>
  <main>内容</main>
  <footer>底部</footer>
</body>
```

## 间距工具类

### 外边距

| 类名 | 描述 |
|------|------|
| `.CUI-m-xs` | 极小外边距 |
| `.CUI-m-sm` | 小外边距 |
| `.CUI-m-md` | 中等外边距 |
| `.CUI-m-lg` | 大外边距 |
| `.CUI-m-xl` | 特大外边距 |

### 内边距

| 类名 | 描述 |
|------|------|
| `.CUI-p-xs` | 极小内边距 |
| `.CUI-p-sm` | 小内边距 |
| `.CUI-p-md` | 中等内边距 |
| `.CUI-p-lg` | 大内边距 |
| `.CUI-p-xl` | 特大内边距 |

## 尺寸工具类

| 类名 | 描述 |
|------|------|
| `.CUI-full` | 宽度高度 100% |
| `.CUI-auto` | 内容自适应 |
| `.CUI-half` | 宽度 50% |

## 毛玻璃效果

框架提供三种毛玻璃效果：

| 类名 | 模糊度 | 透明度 | 适用场景 |
|------|--------|--------|----------|
| `.glass-bg` | blur(6px) | 50% | 容器、遮罩背景 |
| `.glass-fg` | blur(10px) | 60% | 按钮等前景元素 |
| `.glass-bg-dark` | blur(2px) | 30% | 深色背景遮罩 |

```html
<div class="glass-bg" style="padding: 20px; border-radius: 8px;">
  毛玻璃背景效果
</div>
```

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>基础布局示例</title>
  <link rel="stylesheet" href="src/modules/css/core.css">
  <link rel="stylesheet" href="src/modules/css/container.css">
  <link rel="stylesheet" href="src/modules/css/layout.css">
</head>
<body class="layout-web">
  
  <header class="CUI-header">
    <h1>我的网站</h1>
  </header>
  
  <main class="CUI-main">
    <div class="CUI-wrap">
      
      <section class="CUI-section">
        <h2>欢迎使用</h2>
        
        <div class="CUI-grid CUI-grid-3c">
          <div class="CUI-card">
            <h3>功能一</h3>
            <p>描述...</p>
          </div>
          <div class="CUI-card">
            <h3>功能二</h3>
            <p>描述...</p>
          </div>
          <div class="CUI-card">
            <h3>功能三</h3>
            <p>描述...</p>
          </div>
        </div>
      </section>
      
    </div>
  </main>
  
  <footer class="CUI-footer">
    <p>&copy; 2024 My Website</p>
  </footer>
  
</body>
</html>
```
