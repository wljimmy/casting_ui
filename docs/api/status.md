# 状态栏模块 API 文档

## 概述

状态栏模块 (`status.css`) 提供了一个简洁的状态栏组件，用于显示系统状态、通知和指示信息。支持多种样式变体、闪动效果和自定义颜色。采用**纯CSS实现**，无需JavaScript，CSS选择器自动处理所有样式。

## 版本信息

- **版本**: 0.3.0
- **发布日期**: 2026-04-26
- **依赖**: 无（纯CSS模块）

## 快速使用

### 基本语法

状态栏是纯HTML + CSS工作方式，直接写HTML即可：

```html
<!-- 引入CSS -->
<link rel="stylesheet" href="/modules/css/status.css">

<!-- 状态栏HTML - 文字直接写在标签内 -->
<div class="CUI-status-bar">
    <div data-type="info">就绪</div>
    <div data-type="success">3 项任务</div>
</div>
```

## 配置选项

### 状态栏配置 (`CUI-status-bar`)

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `data-type` | string | `"default"` | 状态栏样式类型，可选值：`default`, `glass`, `dark`, `primary` |

### 状态项配置

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `data-type` | string | `"info"` | 状态项类型，可选值：`info`, `success`, `warning`, `error` |
| `data-flash` | string | `"false"` | 动态闪动效果，可选值：`"true"`, `"false"` |
| `title` | string | - | 鼠标悬停时显示的详细说明文字（原生HTML属性） |
| `style` | string | - | CSS变量 `--status-color` 用于自定义颜色 |

**注意**：状态项的文字直接写在HTML标签内，不需要额外的`data-text`属性。

## 样式类型

### 状态栏样式

| 类型 | 描述 |
|------|------|
| `default` | 默认样式，浅色背景 |
| `glass` | 玻璃效果，半透明背景 |
| `dark` | 深色样式，深色背景 |
| `primary` | 主色样式，使用主色背景 |

### 状态项类型

| 类型 | 颜色 | 描述 |
|------|------|------|
| `info` | 蓝色 | 信息状态 |
| `success` | 绿色 | 成功状态 |
| `warning` | 黄色 | 警告状态 |
| `error` | 红色 | 错误状态 |

## 功能特性

### 1. 动态闪动效果

通过设置 `data-flash="true"` 启用闪动效果，用于提醒用户注意需要处理的状态。

```html
<div class="CUI-status-bar">
    <div data-type="info">正常状态</div>
    <div data-type="error" data-flash="true">错误状态</div>
</div>
```

闪动动画：从有到无，0.5秒周期，循环往复。

### 2. 悬停提示

使用原生HTML的 `title` 属性，鼠标悬停时显示详细说明文字。

```html
<div class="CUI-status-bar">
    <div data-type="error" title="检测到内存泄漏，请及时处理！">内存泄漏</div>
</div>
```

### 3. 自定义颜色

使用CSS变量 `--status-color` 设置自定义颜色：

```html
<div class="CUI-status-bar">
    <div data-type="info" style="--status-color: #ff6b6b">红色告警</div>
    <div data-type="info" style="--status-color: #4ecdc4">青色通知</div>
</div>
```

## 示例

### 基础示例

```html
<!-- 基础状态栏 -->
<div class="CUI-status-bar">
    <div data-type="info">就绪</div>
    <div data-type="success">3 项任务</div>
</div>

<!-- 玻璃效果状态栏 -->
<div class="CUI-status-bar CUI-status-glass">
    <div data-type="info">系统运行中</div>
    <div data-type="warning">CPU: 25%</div>
</div>

<!-- 深色状态栏 -->
<div class="CUI-status-bar CUI-status-dark">
    <div data-type="success">在线</div>
    <div data-type="info">已连接</div>
</div>

<!-- 主色状态栏 -->
<div class="CUI-status-bar CUI-status-primary">
    <div data-type="info">同步中</div>
    <div data-type="warning">50%</div>
</div>

<!-- 动态闪动效果 -->
<div class="CUI-status-bar">
    <div data-type="info">正常状态</div>
    <div data-type="error" data-flash="true">错误状态</div>
</div>

<!-- 悬停提示 -->
<div class="CUI-status-bar">
    <div data-type="warning" title="CPU使用率中等，建议关注">CPU: 45%</div>
</div>

<!-- 自定义颜色 -->
<div class="CUI-status-bar">
    <div data-type="info" style="--status-color: #ff6b6b">红色告警</div>
    <div data-type="info" style="--status-color: #4ecdc4">青色通知</div>
</div>
```

## 动态更新

状态栏支持直接通过修改HTML属性来更新：

```javascript
// 获取状态项
const item = document.querySelector('.CUI-status-bar > [data-type="info"]');

// 更新状态类型
item.dataset.type = 'error';

// 启用/关闭闪动效果
item.dataset.flash = 'true';

// 动态修改自定义颜色
item.style.setProperty('--status-color', '#ff6b6b');

// 动态设置悬停提示
item.title = '新的详细说明';

// 更新文字内容
item.textContent = '新的文字';
```

## 最佳实践

1. **布局建议**：状态栏通常放置在页面顶部或底部，用于显示系统状态信息
2. **状态项数量**：建议最多显示 3-5 个状态项，避免信息过载
3. **响应式设计**：在小屏幕设备上，状态栏会自动调整布局
4. **颜色使用**：合理使用不同类型的状态项，以直观传达信息状态
5. **自定义颜色**：使用CSS变量 `--status-color` 直接在元素上设置
6. **动态更新**：状态栏支持实时更新，无需重新渲染
7. **闪动提醒**：用于需要用户立即注意的状态，如错误、警告等
8. **悬停提示**：使用原生 `title` 属性提供详细说明

## 浏览器兼容性

- 支持所有现代浏览器（Chrome, Firefox, Safari, Edge）
- 不支持 IE 11 及以下版本

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 状态栏不显示 | 未添加 `CUI-status-bar` 类 | 确保添加正确的类名 |
| 状态项颜色不正确 | `data-type` 值错误 | 检查 `data-type` 值是否为合法选项 |
| 玻璃效果不生效 | 浏览器不支持 `backdrop-filter` | 降级为默认样式 |
| 自定义颜色不生效 | 未使用 `--status-color` 变量 | 使用 `style="--status-color: #色值"` |

### 调试提示

- 检查浏览器控制台是否有错误信息
- 确保正确引入了 `status.css`
- 验证 `data-*` 属性是否正确设置
- 使用浏览器开发者工具检查元素样式和CSS变量

## 相关模块

- **容器模块** (`container.css`) - 提供布局容器
- **进度条模块** (`progress.js`) - 可与状态栏配合使用，显示任务进度