# 状态栏模块 API 文档

## 概述

状态栏模块 (`status.css`) 提供了一个简洁的状态栏组件，用于显示系统状态、通知和指示信息。支持多种样式变体、闪动效果和专属图标。采用**纯CSS实现**，通过`mask`技术实现SVG图标显示和颜色自定义，无需JavaScript。

## 版本信息

- **版本**: 0.4.0
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

## 状态类型

### 基础状态类型

| 类型 | 颜色 | 描述 |
|------|------|------|
| `info` | 蓝色 | 信息状态 |
| `success` | 绿色 | 成功状态 |
| `warning` | 黄色 | 警告状态 |
| `error` | 红色 | 错误状态 |

### 系统状态类型

| 类型 | SVG图标 | 颜文字 | 颜色 | 描述 |
|------|---------|--------|------|------|
| `system` | settings | ⚙️ | 灰色 | 系统状态 |
| `maintenance` | tool | 🔧 | 橙色 | 维护模式 |
| `online` | - | 🟢 | 绿色 | 在线状态 |
| `offline` | - | 🔴 | 红色 | 离线状态 |

### 网络状态类型

| 类型 | SVG图标 | 颜文字 | 颜色 | 描述 |
|------|---------|--------|------|------|
| `wifi` | wifi-2 | 📶 | 青色 | Wi-Fi信号 |
| `network` | globe | 🌐 | 紫色 | 网络连接 |
| `upload` | upload | 📤 | 青绿 | 上传状态 |
| `download` | cloud-download | 📥 | 青色 | 下载状态 |

### 硬件状态类型

| 类型 | SVG图标 | 颜文字 | 颜色 | 描述 |
|------|---------|--------|------|------|
| `cpu` | cpu | 💻 | 橙色 | CPU使用率 |
| `memory` | chart-line | 📊 | 黄色 | 内存使用 |
| `disk` | database | 💾 | 绿色 | 磁盘空间 |
| `battery` | battery-charging-2 | 🔋 | 青色 | 电池状态 |

### 应用状态类型

| 类型 | SVG图标 | 颜文字 | 颜色 | 描述 |
|------|---------|--------|------|------|
| `progress` | loader-quarter | ⏳ | 青色 | 任务进度（带旋转动画） |
| `queue` | list | 📋 | 紫色 | 队列状态 |
| `notification` | bell-ringing-2 | 🔔 | 黄色 | 通知状态 |
| `error` | - | ❌ | 红色 | 错误状态 |

### 时间日期类型

| 类型 | SVG图标 | 颜文字 | 颜色 | 描述 |
|------|---------|--------|------|------|
| `time` | clock-12 | ⏰ | 灰色 | 当前时间 |
| `date` | calendar | 📅 | 灰色 | 当前日期 |

### 其他状态类型

| 类型 | SVG图标 | 颜文字 | 颜色 | 描述 |
|------|---------|--------|------|------|
| `weather` | cloud | ☁️ | 青色 | 天气信息 |
| `location` | map-pin-check | 📍 | 橙色 | 地理位置 |
| `language` | - | 🌐 | 紫色 | 语言设置 |
| `theme` | - | 🎨 | 绿色 | 主题模式 |

## 配置选项

### 状态栏配置 (`CUI-status-bar`)

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `data-type` | string | `"default"` | 状态栏样式类型，可选值：`default`, `glass`, `dark`, `primary` |

### 状态项配置

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `data-type` | string | `"info"` | 状态项类型，支持所有状态类型 |
| `data-flash` | string | `"false"` | 动态闪动效果，可选值：`"true"`, `"false"` |
| `data-symbol` | string | - | 符号模式，`"emoji"` 强制使用颜文字符号 |
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

### 状态栏尺寸

| 类型 | 描述 |
|------|------|
| `sm` | 小型状态栏 |
| `lg` | 大型状态栏 |

## 功能特性

### 1. SVG图标显示

状态栏使用CSS `mask`技术显示SVG图标，支持：
- 通过`background-color`设置图标颜色
- 支持通过CSS变量`--status-color`自定义颜色
- 如果`mask`失效，自动降级为圆形圆点

```html
<!-- 默认使用SVG图标 -->
<div data-type="wifi">Wi-Fi: 满格</div>
```

### 2. 颜文字符号模式

通过`data-symbol="emoji"`强制使用颜文字符号：

```html
<div data-type="wifi" data-symbol="emoji">Wi-Fi: 满格</div>
```

### 3. 自定义颜色

使用CSS变量 `--status-color` 设置自定义颜色：

```html
<div data-type="wifi" style="--status-color: #ff6b6b">Wi-Fi: 红色</div>
```

### 4. 动态闪动效果

通过设置 `data-flash="true"` 启用闪动效果：

```html
<div data-type="error" data-flash="true">错误状态</div>
```

### 5. 悬停提示

使用原生HTML的 `title` 属性：

```html
<div data-type="error" title="检测到内存泄漏，请及时处理！">内存泄漏</div>
```

### 6. 进度动画

`progress`类型自带旋转加载动画：

```html
<div data-type="progress">处理中</div>
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
    <div data-type="wifi">Wi-Fi: 满格</div>
    <div data-type="cpu">CPU: 25%</div>
</div>

<!-- 深色状态栏 -->
<div class="CUI-status-bar CUI-status-dark">
    <div data-type="success">在线</div>
    <div data-type="network">已连接</div>
</div>

<!-- 主色状态栏 -->
<div class="CUI-status-bar CUI-status-primary">
    <div data-type="progress">同步中</div>
    <div data-type="notification">通知: 3</div>
</div>

<!-- 动态闪动效果 -->
<div class="CUI-status-bar">
    <div data-type="info">正常状态</div>
    <div data-type="error" data-flash="true">错误状态</div>
</div>

<!-- 自定义颜色 -->
<div class="CUI-status-bar">
    <div data-type="wifi" style="--status-color: #ff6b6b">Wi-Fi: 红色</div>
    <div data-type="cpu" style="--status-color: #4ecdc4">CPU: 青色</div>
</div>

<!-- 颜文字符号模式 -->
<div class="CUI-status-bar">
    <div data-type="wifi" data-symbol="emoji">Wi-Fi: 满格</div>
    <div data-type="memory" data-symbol="emoji">内存: 1.2GB</div>
</div>
```

## 动态更新

状态栏支持直接通过修改HTML属性来更新：

```javascript
// 获取状态项
const item = document.querySelector('.CUI-status-bar > [data-type="wifi"]');

// 更新状态类型
item.dataset.type = 'cpu';

// 启用/关闭闪动效果
item.dataset.flash = 'true';

// 切换符号模式
item.dataset.symbol = 'emoji';

// 动态修改自定义颜色
item.style.setProperty('--status-color', '#ff6b6b');

// 动态设置悬停提示
item.title = '新的详细说明';

// 更新文字内容
item.textContent = '新的文字';
```

## 技术实现

### CSS Mask技术

状态栏使用CSS `mask`技术实现SVG图标显示：

```css
.CUI-status-bar > [data-type]:not([data-symbol="emoji"])::before {
    content: '';
    width: 16px;
    height: 16px;
    background-color: var(--status-color);
    -webkit-mask-image: var(--svg-mask);
    mask-image: var(--svg-mask);
    -webkit-mask-size: contain;
    mask-size: contain;
    /* ... */
}
```

**优点**：
- 通过`background-color`设置颜色，便于自定义
- 如果`mask`失效，自动降级为圆形圆点
- 支持所有现代浏览器

### 降级保护

如果浏览器不支持`mask`属性：
- SVG图标会显示为圆形圆点
- 颜文字符号模式正常工作
- 基本功能不受影响

## 最佳实践

1. **布局建议**：状态栏通常放置在页面顶部或底部，用于显示系统状态信息
2. **状态项数量**：建议最多显示 3-5 个状态项，避免信息过载
3. **响应式设计**：在小屏幕设备上，状态栏会自动调整布局
4. **颜色使用**：合理使用不同类型的状态项，以直观传达信息状态
5. **自定义颜色**：使用CSS变量 `--status-color` 直接在元素上设置
6. **动态更新**：状态栏支持实时更新，无需重新渲染
7. **闪动提醒**：用于需要用户立即注意的状态，如错误、警告等
8. **悬停提示**：使用原生 `title` 属性提供详细说明
9. **符号选择**：默认使用SVG图标确保设计风格一致，需要时使用`data-symbol="emoji"`切换

## 浏览器兼容性

- 支持所有现代浏览器（Chrome, Firefox, Safari, Edge）
- `mask`属性在现代浏览器中支持良好
- 不支持 IE 11 及以下版本

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 状态栏不显示 | 未添加 `CUI-status-bar` 类 | 确保添加正确的类名 |
| 状态项图标不正确 | `data-type` 值错误 | 检查 `data-type` 值是否为合法选项 |
| 颜色不生效 | 未使用 `--status-color` 变量 | 使用 `style="--status-color: #色值"` |
| 玻璃效果不生效 | 浏览器不支持 `backdrop-filter` | 降级为默认样式 |
| 图标显示为圆点 | 浏览器不支持 `mask` 属性 | 这是降级保护，正常现象 |

### 调试提示

- 检查浏览器控制台是否有错误信息
- 确保正确引入了 `status.css`
- 验证 `data-*` 属性是否正确设置
- 使用浏览器开发者工具检查元素样式和CSS变量

## 相关模块

- **容器模块** (`container.css`) - 提供布局容器
- **进度条模块** (`progress.js`) - 可与状态栏配合使用，显示任务进度
- **图标库** (`/icons/outline/`) - 提供SVG图标资源