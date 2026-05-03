
# 快速入门

本指南将帮助你快速上手 Casting UI 框架。

## 核心设计理念

### 1. 极简的使用方式

Casting UI 让你像使用 Markdown 一样使用 HTML，无需学习复杂的组件语法。

**用户只需做的**：
- 使用标准 HTML 标签定义结构
- 通过 `data-*` 属性配置组件
- 专注于业务内容

**框架自动处理的**：
- 样式渲染
- 组件结构生成
- 事件绑定
- 交互逻辑

### 2. 示例：创建菜单

传统框架可能需要这样的复杂代码：

```javascript
// 复杂的组件配置
const menu = new Menu({
  items: [
    { text: '首页', icon: 'home' },
    { text: '关于', icon: 'info' }
  ]
});
```

使用 Casting UI，你只需写原生 HTML：

```html
<menu>
  <ul>
    <li data-icon="home">首页</li>
    <li data-icon="info">关于</li>
  </ul>
</menu>
```

框架会自动识别 `menu` 标签，渲染图标，绑定交互事件！

## 第一个示例

让我们创建一个包含卡片、按钮和网格布局的简单页面。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>我的第一个 Casting UI 页面</title>
  <!-- 引入框架 -->
  <link rel="stylesheet" href="src/modules/css/core.css">
  <link rel="stylesheet" href="src/modules/css/container.css">
  <link rel="stylesheet" href="src/modules/css/layout.css">
  <link rel="stylesheet" href="src/modules/css/components.css">
</head>
<body>
  <!-- 页面标题 -->
  <h1>欢迎使用 Casting UI</h1>
  
  <!-- 通用容器 -->
  <div class="CUI-box">
    <h2>功能介绍</h2>
    <p>这是一个简单的卡片组件示例。</p>
  </div>
  
  <!-- 网格布局 + 卡片 -->
  <div class="CUI-grid CUI-grid-3c">
    <div class="CUI-card">
      <h3>极简设计</h3>
      <p>像写 Markdown 一样写 HTML</p>
    </div>
    <div class="CUI-card">
      <h3>原生兼容</h3>
      <p>标准 HTML/CSS/JavaScript</p>
    </div>
    <div class="CUI-card">
      <h3>功能丰富</h3>
      <p>完整的组件体系</p>
    </div>
  </div>
  
  <!-- 按钮组 -->
  <div class="CUI-box" style="margin-top: 20px;">
    <button class="btn btn-primary" onclick="showToast('success', '操作成功！')">点击我</button>
    <button class="btn btn-secondary">次要按钮</button>
  </div>

  <!-- 引入 JavaScript -->
  <script type="module" src="src/modules/js/index.js"></script>
</body>
</html>
```

## 关键概念

### 1. 容器类

框架提供多种容器类用于组织内容：

| 类名 | 描述 | 适用场景 |
|------|------|----------|
| `.CUI-section` | 页面区块容器 | 组织大段内容 |
| `.CUI-box` | 通用盒子容器 | 带边框的内容块 |
| `.CUI-card` | 卡片容器 | 展示独立内容 |
| `.CUI-fluid` | 流式容器 | 宽度自适应 |
| `.CUI-wrap` | 约束宽度容器 | 最大宽度居中 |

### 2. Grid 布局

使用 Grid 系统轻松创建响应式布局：

```html
<!-- 2 列布局 -->
<div class="CUI-grid CUI-grid-2c">
  <div>左侧内容</div>
  <div>右侧内容</div>
</div>

<!-- 3 列布局 -->
<div class="CUI-grid CUI-grid-3c">
  <div>列 1</div>
  <div>列 2</div>
  <div>列 3</div>
</div>

<!-- 居中对齐 -->
<div class="CUI-grid CUI-grid-center">
  <div>居中内容</div>
</div>
```

### 3. data-* 属性配置

框架大量使用 `data-*` 属性来配置组件行为：

```html
<!-- 进度条 -->
<div class="CUI-progress" 
     data-value="60" 
     data-type="label striped animated">
</div>

<!-- 菜单项 -->
<li data-icon="home" data-badge="hot" data-default="true">
  首页
</li>

<!-- 状态栏 -->
<div class="CUI-status-bar">
  <div data-type="info" data-flash="true">信息</div>
</div>
```

## 常见问题

### Q: 需要构建工具吗？

A: 不需要！Casting UI 是纯原生框架，可以直接在浏览器中运行。虽然项目中包含 Vite 配置，但那只是用于开发预览，不参与实际打包。

### Q: 如何自定义样式？

A: 框架通过 CSS 变量管理样式，你可以覆盖这些变量：

```css
:root {
  --primary-color: #your-color;
  --text-primary: #333;
}
```

或者直接添加自己的 CSS，框架不会干扰你的自定义样式。

### Q: 组件是如何初始化的？

A: 框架使用 DOM 观察者自动检测并初始化组件，你无需手动调用初始化函数。

```javascript
// 框架会自动这样做（你不需要写）
CastingDOMObserver.onAdd('menu', 'menu', (el) => {
  initMenu(el);
});
```

## 下一步

现在你已经了解了基础概念，接下来可以：

- 查看 [组件文档](./Components/) 了解所有可用组件
- 查看 [API 文档](./API/) 了解编程接口
- 查看 [设计理念](./Design-Philosophy.md) 深入理解框架设计思路
