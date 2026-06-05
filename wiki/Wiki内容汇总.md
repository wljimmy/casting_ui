
# Casting UI Wiki 内容汇总

本文档汇总了 Casting UI Wiki 的所有内容，方便快速查阅。

---

## 📋 目录

1. [项目概述](#1-项目概述)
2. [快速入门](#2-快速入门)
3. [设计理念](#3-设计理念)
4. [组件文档](#4-组件文档)
5. [核心模块](#5-核心模块)
6. [API 参考](#6-api-参考)
7. [使用规范](#7-使用规范)
8. [Wiki 维护规范](#8-wiki-维护规范)

---

## 1. 项目概述

### 框架简介

**Casting UI** 是一个极简、易用的前端 UI 框架，专注于简化开发流程。

### 核心特点

- **极简设计**：无需学习复杂语法，像写 Markdown 一样写 HTML
- **专注内容**：所有样式、组件结构由框架自动处理
- **原生兼容**：使用标准 HTML/CSS/JavaScript，无需构建工具
- **灵活扩展**：提供完整的扩展机制

### 版本信息

- **当前版本**：v0.5.5
- **技术栈**：原生 HTML5、CSS3、JavaScript (ES6+)
- **浏览器兼容性**：Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### 项目结构

```
Casting_UI/
├── src/
│   ├── modules/
│   │   ├── js/        # JavaScript 模块
│   │   └── css/       # CSS 模块
│   ├── examples/      # 示例页面
│   └── index.html     # 首页
├── public/
│   ├── manual/        # 手册页面
│   └── icons/         # 图标资源
├── dist/             # 发布文件
├── docs/            # 文档
├── test/            # 测试页面
└── wiki/            # Wiki 文档
```

---

## 2. 快速入门

### 引入方式一：使用合并文件（推荐）

```html
<!-- 引入 CSS 文件 -->
<link rel="stylesheet" href="dist/v0.5.5/Casting.css">

<!-- 引入 JavaScript 文件 -->
<script src="dist/v0.5.5/Casting.js"></script>
```

### 引入方式二：使用模块化文件

```html
<!-- CSS 模块 -->
<link rel="stylesheet" href="src/modules/css/core.css">
<link rel="stylesheet" href="src/modules/css/container.css">
<link rel="stylesheet" href="src/modules/css/layout.css">
<link rel="stylesheet" href="src/modules/css/components.css">

<!-- JavaScript 模块 -->
<script type="module" src="src/modules/js/index.js"></script>
```

### 核心设计理念

#### 1. 极简的使用方式

**用户只需做的**：
- 使用标准 HTML 标签定义结构
- 通过 `data-*` 属性配置组件
- 专注于业务内容

**框架自动处理的**：
- 样式渲染
- 组件结构生成
- 事件绑定
- 交互逻辑

#### 2. 示例：创建菜单

传统框架需要复杂配置：

```javascript
const menu = new Menu({
  items: [
    { text: '首页', icon: 'home' },
    { text: '关于', icon: 'info' }
  ]
});
```

使用 Casting UI，只需写原生 HTML：

```html
<menu>
  <ul>
    <li data-icon="home">首页</li>
    <li data-icon="info">关于</li>
  </ul>
</menu>
```

框架会自动识别 `menu` 标签，渲染图标，绑定交互事件！

---

## 3. 设计理念

### 一句话概括

**像写 Markdown 一样写 HTML**

### 设计原则

#### 1. 极简用户 API

用户只需要做最简单的事情：
- 使用标准 HTML 标签
- 通过 `data-*` 属性配置
- 不需要学习复杂的组件语法

#### 2. 原生兼容

框架完全基于标准技术：
- **HTML5**：语义化标签
- **CSS3**：变量、Flexbox、Grid、动画
- **JavaScript ES6+**：模块化、类、异步

**不依赖**：
- 任何前端框架（React/Vue/Angular）
- 任何构建工具（Webpack/Vite/Rollup）
- 任何编译器（TypeScript/Sass）

#### 3. 渐进式增强

- **基础功能**：CSS 即可实现
- **进阶功能**：JS 增强
- **不干扰正常页面**：即使 JS 禁用，页面仍能正常显示

---

## 4. 组件文档

### 4.1 组件分类总览

| 分类 | 组件 | 描述 |
|------|------|------|
| **基础布局** | CUI-box | 通用容器 |
| | CUI-card | 卡片容器 |
| | CUI-grid | 网格布局 |
| | 按钮 | 多种样式的按钮组件 |
| **数据展示** | 进度条 | 进度展示组件 |
| | 徽章 | 状态标签组件 |
| | 状态栏 | 系统状态栏组件 |
| **表单** | 输入框 | 美化的输入控件 |
| | 表单 | 表单处理模块 |
| **反馈** | Toast | 轻提示组件 |
| | Modal | 弹窗组件 |
| | Loading | 加载遮罩 |
| **导航** | Menu | 菜单组件 |
| **工具** | 颜色选择器 | 颜色选择组件 |
| | 主题管理器 | 主题管理组件 |

### 4.2 基础布局组件

#### 通用容器

##### CUI-box - 通用盒子

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

##### CUI-card - 卡片容器

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

##### CUI-section - 页面区块

用于组织大段内容的区块容器。

```html
<section class="CUI-section">
  <h2>章节标题</h2>
  <p>章节内容...</p>
</section>
```

#### Grid 布局系统

##### 列数配置

| 类名 | 描述 |
|------|------|
| `.CUI-grid-1c` | 1 列布局 |
| `.CUI-grid-2c` | 2 列等宽 |
| `.CUI-grid-3c` | 3 列等宽 |
| `.CUI-grid-4c` | 4 列等宽 |

##### 基础用法

```html
<div class="CUI-grid CUI-grid-3c">
  <div class="CUI-card">卡片 1</div>
  <div class="CUI-card">卡片 2</div>
  <div class="CUI-card">卡片 3</div>
</div>
```

#### 按钮组件

##### 按钮类型

| 类名 | 描述 | 场景 |
|------|------|------|
| `.btn-primary` | 主要按钮 | 主操作，如提交、确认 |
| `.btn-secondary` | 次要按钮 | 次要操作，如取消 |
| `.btn-text` | 文字按钮 | 链接样式按钮 |
| `.btn-icon` | 图标按钮 | 圆形图标按钮 |
| `.btn-success` | 成功按钮 | 成功状态操作 |
| `.btn-warning` | 警告按钮 | 警告状态操作 |
| `.btn-error` | 危险按钮 | 删除等危险操作 |
| `.btn-info` | 信息按钮 | 信息提示操作 |

##### 按钮尺寸

| 类名 | 描述 |
|------|------|
| `.btn-sm` | 小按钮 |
| `.btn-md` | 中按钮（默认） |
| `.btn-lg` | 大按钮 |

##### 使用示例

```html
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
<button class="btn btn-success">成功</button>
<button class="btn btn-warning">警告</button>
```

### 4.3 数据展示组件

#### 进度条 (Progress)

##### 基础用法

```html
<div class="CUI-progress" data-value="60"></div>
```

##### data-type 配置项

| 选项 | 描述 |
|------|------|
| `plain` | 关闭所有装饰效果（优先级最高） |
| `label` | 显示百分比标签 |
| `striped` | 条纹样式 |
| `animated` | 条纹动画 |
| `glass` | 毛玻璃效果 |
| `success` / `warning` / `error` / `info` | 预设颜色 |
| `W{数字}` | 自定义宽度（如 W300） |
| `H{数字}` | 自定义高度（如 H20） |

##### 示例

```html
<!-- 简洁模式 -->
<div class="CUI-progress" data-value="60" data-type="plain"></div>

<!-- 带标签 -->
<div class="CUI-progress" data-value="75" data-type="label"></div>

<!-- 条纹动画 -->
<div class="CUI-progress" data-value="50" data-type="striped animated"></div>

<!-- 毛玻璃效果 -->
<div class="CUI-progress" data-value="80" data-type="glass"></div>

<!-- 彩色进度条 -->
<div class="CUI-progress" data-value="85" data-type="success label"></div>
```

#### 徽章 (Badge)

##### 基础用法

```html
<span class="badge badge-primary">主要</span>
```

##### 徽章颜色

| 类名 | 描述 |
|------|------|
| `.badge-primary` | 主要（蓝色） |
| `.badge-secondary` | 次要（灰色） |
| `.badge-success` | 成功（绿色） |
| `.badge-warning` | 警告（橙色） |
| `.badge-error` | 错误（红色） |

##### 特殊徽章（自动文字）

| 类名 | 自动文字 |
|------|----------|
| `.badge-hot` | HOT |
| `.badge-new` | NEW |
| `.badge-recommend` | 推荐 |
| `.badge-update` | 更新 |
| `.badge-demo` | DEMO |
| `.badge-tip` | 提示 |
| `.badge-official` | 官方 |
| `.badge-pro` | PRO |
| `.badge-beta` | BETA |
| `.badge-fixed` | FIXED |

##### 示例

```html
<span class="badge badge-hot"></span>
<span class="badge badge-new"></span>
<span class="badge badge-recommend"></span>
```

#### 状态栏 (Status Bar)

##### 基础用法

```html
<div class="CUI-status-bar">
  <div data-type="info">就绪</div>
  <div data-type="success">3 项任务</div>
</div>
```

##### 状态类型

| data-type | 图标 | 颜色 | 描述 |
|-----------|------|------|------|
| `info` | ● | 蓝色 | 信息状态 |
| `success` | ● | 绿色 | 成功状态 |
| `warning` | ● | 黄色 | 警告状态 |
| `error` | ● | 红色 | 错误状态 |
| `wifi` | 📶 | 青色 | Wi-Fi 信号 |
| `network` | 🌐 | 紫色 | 网络连接 |
| `cpu` | 💻 | 橙色 | CPU 使用率 |
| `memory` | 📊 | 黄色 | 内存使用 |
| `battery` | 🔋 | 青色 | 电池状态 |

##### 动态闪动效果

添加 `data-flash="true"` 属性启用闪动效果。

```html
<div data-type="warning" data-flash="true">闪动警告</div>
```

### 4.4 表单组件

#### 核心规则

**重要：form 下的第一级 div 就是一行！**

| 结构 | 说明 |
|------|------|
| `form.CUI-form` | 表单容器，flex布局 |
| `form > div` | **每一行**，grid布局 |
| `form > div > div` | 标签，默认占1列 |
| `form > div > .CUI-input` | 输入框，默认占3列 |
| `form > button` | 按钮，自动收集到操作区 |

#### 输入框 (Input)

##### 基础用法

只需为 input/textarea/select 添加 `CUI-input` 类，框架会自动美化并注册到注册表。

```html
<input type="text" name="username" class="CUI-input" placeholder="文本输入">
<input type="password" name="password" class="CUI-input" placeholder="密码输入">
<input type="email" name="email" class="CUI-input" placeholder="邮箱输入">
```

##### 自动图标

框架会根据 input 的 type 属性自动渲染对应图标：

| type值 | 图标 | 说明 |
|------|------|------|
| search | 搜索 | 搜索框 |
| email | 邮件 | 邮箱输入 |
| tel / telephone | 电话 | 电话号码 |
| password | 密码 | 密码输入 |
| url / link | 链接 | 网址输入 |
| number / numeric | 数字 | 数字输入 |
| date | 日期 | 日期选择 |
| time | 时间 | 时间选择 |
| user / username | 用户 | 用户名 |

##### 自定义图标

使用 `data-icon` 属性指定图标名称：

```html
<input type="text" name="username" class="CUI-input" data-icon="user" placeholder="用户名">
<input type="text" name="captcha" class="CUI-input" data-icon="sms" placeholder="验证码">
```

##### 带标签输入框

使用 `data-label` 添加标签：

```html
<!-- 标签在左（默认）-->
<input type="text" name="name" class="CUI-input" data-label="姓名" placeholder="">

<!-- 标签在上 -->
<input type="text" name="email" class="CUI-input" data-label="邮箱地址" data-label-position="top" placeholder="">
```

### 4.5 反馈组件

#### Toast 轻提示

##### 使用方法

```javascript
window.CUI.message.showToast('success', '操作成功');
window.CUI.message.showToast('error', '操作失败');
window.CUI.message.showToast('warning', '警告信息');
window.CUI.message.showToast('info', '提示信息');
```

##### 自动消失

Toast 会自动在 3 秒后消失，无需手动关闭。

#### Modal 弹窗

##### 使用方法

```javascript
window.CUI.modal.showModal({
  title: '标题',
  content: '内容',
  buttons: [
    { text: '取消', action: 'cancel' },
    { text: '确认', action: 'confirm', primary: true }
  ]
});
```

##### 配置选项

| 选项 | 类型 | 描述 |
|------|------|------|
| title | string | 弹窗标题 |
| content | string/HTMLElement | 弹窗内容 |
| width | string | 弹窗宽度，如 '500px' |
| buttons | array | 按钮配置数组 |

#### Loading 加载

##### 显示加载遮罩

```javascript
window.CUI.message.showLoading('加载中...');
```

##### 隐藏加载遮罩

```javascript
window.CUI.message.hideLoading();
```

### 4.6 菜单组件

##### 基础用法

```html
<menu>
  <ul>
    <li data-icon="home">首页</li>
    <li data-icon="info">关于</li>
  </ul>
</menu>
```

##### 带子菜单

```html
<menu>
  <ul>
    <li data-icon="home">
      首页
      <ul>
        <li>子菜单1</li>
        <li>子菜单2</li>
      </ul>
    </li>
    <li data-icon="settings">设置</li>
  </ul>
</menu>
```

---

## 5. 核心模块

### 5.1 模块列表

| 模块 | 描述 |
|------|------|
| [DOMObserver](./Core/DOMObserver.md) | DOM 变化观察者，自动监听和初始化组件 |
| [ColorPicker](./Core/ColorPicker.md) | 颜色选择器，支持多种颜色格式 |
| [ThemeManager](./Core/ThemeManager.md) | 主题管理器，支持主题切换和自定义主题 |

### 5.2 核心架构

#### 模块依赖图 (DAG 拓扑结构)

```
       [scheduler] (时序与容灾引擎)
            │
         [core] (最底座 API 支持)
      ┌─────┼──────────────┐
      ▼     ▼              ▼
[overlay] [input]  [imageZoom] (依赖 core)
      │     │
      ▼     ▼
  [modal] [colorPicker] (依赖 core, overlay)
      │     │
      ▼     ▼
     [ui] (依赖 core, colorPicker, modal)
```

#### 初始化流程 (Pipeline Flow)

1. 加载 `scheduler.js` 准备全局注册 API。
2. 异步并行加载所有业务 ES 模块，通过 `registerModule` 进行登记。
3. 并行下载完成后，触发运行 `scheduler.runPipeline()` 驱动生命周期流转。
4. Pipeline 逐个推进阶段：`ENV` ➔ `CORE` ➔ `DOM_REGISTRY` ➔ `INTERACTION` ➔ `READY`。
5. 在每次执行每个模块的钩子前，动态进行**上游依赖健康校验**与**级联停运隔离**保护。

### 5.3 DOMObserver 详解

#### 设计目标

- 避免多个模块重复创建 MutationObserver
- 统一管理所有 DOM 变化监听
- 各模块只需注册自己的选择器和处理函数

#### 基本用法

```javascript
// 导入 DOMObserver
import { domObserver } from './dom-observer.js';

// 或者直接使用全局对象
window.CastingDOMObserver
```

#### 注册添加事件

当匹配选择器的元素被添加到 DOM 中时触发：

```javascript
domObserver.onAdd('my-key', '.my-element', (el) => {
  console.log('元素被添加:', el);
  // 在这里初始化你的组件
});
```

#### 注册移除事件

当匹配选择器的元素从 DOM 中移除时触发：

```javascript
domObserver.onRemove('my-key', '.my-element', (el) => {
  console.log('元素被移除:', el);
  // 在这里清理你的组件
});
```

#### 取消注册

```javascript
domObserver.off('my-key');
```

### 5.4 核心概念

#### DOM 观察者模式

DOMObserver 使用 MutationObserver 监听 DOM 变化，自动检测和初始化组件。

```javascript
// 当元素被添加时自动初始化
CastingDOMObserver.onAdd('my-component', '.my-component', (el) => {
  initMyComponent(el);
});
```

#### 命名空间隔离

所有框架功能挂载在 `window.CUI` 和相关命名空间下，避免冲突。

```javascript
window.CUI = {
  input: {...},
  message: {...},
  modal: {...},
  // ...
};
```

#### 数据持久化

主题等数据使用 localStorage 持久化存储。

---

## 6. API 参考

### 6.1 全局对象

#### window.CUI

框架的主要命名空间，所有核心功能都挂载在此对象下。

```javascript
CUI.input      // 输入框注册表
CUI.message    // 消息提示
CUI.modal      // 弹窗
CUI.ColorPicker // 颜色选择器
CUI.openColorPicker // 打开颜色选择器
CUI.scheduler  // 全局生命周期调度器实例
CUI.registerModule // 注册功能模块的统一 API 方法
```

#### window.CastingDOMObserver

DOM 观察者单例，用于监听 DOM 变化。

```javascript
CastingDOMObserver.onAdd(key, selector, handler)
CastingDOMObserver.onRemove(key, selector, handler)
CastingDOMObserver.off(key)
```

#### window.ui

UI 模块主实例，包含主题管理器、颜色选择器等。

```javascript
ui.themeManager  // 主题管理器
ui.menu          // 菜单管理
ui.getThemeManager()
ui.getColorPicker()
```

### 6.2 核心 API

#### 输入框注册表 (CUI.input)

| 方法 | 描述 |
|------|------|
| `get(path)` | 获取节点信息 |
| `getValue(path)` | 获取输入框值 |
| `setValue(path, value)` | 设置输入框值 |
| `getFormData(formId)` | 获取表单数据对象 |
| `setFormData(formId, data)` | 设置表单数据 |
| `element(path)` | 获取 DOM 元素 |
| `getAll()` | 获取完整注册表 |
| `clear()` | 清空注册表 |

#### DOM 观察者 (CastingDOMObserver)

| 方法 | 描述 |
|------|------|
| `onAdd(key, selector, handler)` | 注册元素添加事件 |
| `onRemove(key, selector, handler)` | 注册元素移除事件 |
| `off(key)` | 取消注册事件 |
| `destroy()` | 销毁观察者 |

#### 消息提示 (CUI.message)

| 方法 | 描述 |
|------|------|
| `showToast(type, message, options)` | 显示轻提示 |
| `showLoading(message)` | 显示加载遮罩 |
| `hideLoading()` | 隐藏加载遮罩 |
| `createMessage(type, message, options)` | 创建持久消息 |

#### 弹窗 (CUI.modal)

| 方法 | 描述 |
|------|------|
| `showModal(options)` | 显示弹窗 |
| `closeModal()` | 关闭弹窗 |

---

## 7. 使用规范

### 7.1 文件引入规范

#### 生产环境（推荐）

```html
<link rel="stylesheet" href="dist/v{版本号}/Casting.css">
<script src="dist/v{版本号}/Casting.js"></script>
```

#### 开发环境

```html
<link rel="stylesheet" href="src/modules/css/core.css">
<!-- 按需引入其他 CSS -->
<script type="module" src="src/modules/js/index.js"></script>
```

### 7.2 HTML 编写规范

#### 基础原则

1. **使用原生 HTML 标签** - 不使用自定义标签
2. **使用语义化标签** - `<header>`, `<nav>`, `<main>`, `<footer>` 等
3. **通过 data-* 属性配置** - 不使用框架专属属性

#### 正确示例

```html
<!-- 容器 -->
<div class="CUI-section">
  <div class="CUI-box">内容</div>
</div>

<!-- 按钮 -->
<button class="btn btn-primary">按钮</button>

<!-- 菜单 -->
<menu>
  <ul>
    <li data-icon="home">首页</li>
  </ul>
</menu>

<!-- 输入框 -->
<input type="text" name="username" class="CUI-input" data-label="用户名">
```

### 7.3 CSS 使用规范

#### CSS 变量使用

```css
/* 正确 - 使用 CSS 变量自定义主题 */
:root {
  --primary-color: #165DFF;
  --bg-color: #ffffff;
  --text-primary: #333333;
}
```

#### 样式优先级

1. **CSS 变量** - 最高优先级，推荐
2. **自定义类** - 其次推荐
3. **内联样式** - 仅在特殊情况下使用
4. **!important** - 尽量避免使用

### 7.4 JavaScript 调用规范

#### 全局对象使用

```javascript
// 正确 - 使用框架提供的全局对象
window.CUI.input.getValue('form.field');
window.openColorPicker();
window.openThemeSelector();
window.CUI.message.showToast('success', '消息');
```

#### Promise 处理

```javascript
// Promise 处理
openColorPicker().then(color => {
  console.log('选择的颜色:', color);
}).catch(() => {
  console.log('用户取消');
});

// async/await
async function pickColor() {
  try {
    const color = await openColorPicker();
    console.log(color);
  } catch (error) {
    console.log('取消选择');
  }
}
```

### 7.5 组件使用规范

#### 组件初始化

- ✅ **自动初始化**: 框架会自动检测并初始化组件
- ✅ **data-* 配置**: 使用 data 属性配置组件
- ❌ **手动调用**: 除非特殊情况，不需要手动调用初始化函数

#### 组件命名约定

- **容器**: `CUI-*` 前缀 (CUI-box, CUI-card, CUI-grid)
- **按钮**: `btn-*` 前缀 (btn-primary, btn-secondary)
- **状态**: `*-success`, `*-warning`, `*-error`, `*-info`

---

## 8. Wiki 维护规范

### 8.1 Wiki 目录结构

```
wiki/
├── Home.md                          # 首页
├── Getting-Started.md               # 快速入门
├── Design-Philosophy.md             # 设计理念
├── 使用规范.md                      # 框架使用规范
├── Wiki维护规范.md                  # 本文档
├── Wiki内容汇总.md                  # 本汇总文档
├── Components/                      # 组件文档
│   ├── index.md                     # 组件索引
│   ├── Basic-Layout.md              # 基础布局
│   ├── Data-Display.md              # 数据展示
│   ├── Form.md                      # 表单组件
│   ├── Text.md                      # 文本组件
│   ├── Feedback.md                  # 反馈组件
│   └── Menu.md                      # 菜单组件
├── Core/                            # 核心模块
│   ├── index.md                     # 核心模块索引
│   ├── DOMObserver.md               # DOM 观察者
│   ├── ColorPicker.md               # 颜色选择器
│   └── ThemeManager.md              # 主题管理器
└── API/                             # API 文档
    └── index.md                     # API 索引
```

### 8.2 新增文档位置规范

| 内容类型 | 存放位置 | 命名规范 |
|---------|---------|---------|
| 组件文档 | `Components/` | 大驼峰 + 连字符，如 `Basic-Layout.md` |
| 核心模块 | `Core/` | 大驼峰，如 `DOMObserver.md` |
| API 文档 | `API/` | 相关 API 归类，如 `Input-API.md` |
| 指南文档 | 根目录 | 中文命名，如 `使用规范.md` |

### 8.3 Markdown 格式规范

#### 基本规范

1. **文件编码**: UTF-8
2. **换行**: LF
3. **缩进**: 2 空格
4. **标题层级**: 从 H2 (`##`) 开始，H1 仅用于文档标题

#### 代码块格式

```markdown
```语言
代码内容
```
```

常用语言标识：`html`、`css`、`javascript`、`bash`、`markdown`

### 8.4 链接规范

```markdown
<!-- 正确 -->
[首页](./Home.md)
[组件文档](./Components/index.md)

<!-- 错误 -->
[首页](Home.md)          // 缺少 ./
[首页](./Home)            // 缺少扩展名
```

---

## 相关资源

### 官方资源

- [手册页面](../public/manual/) - 交互式组件手册
- [示例页面](../src/examples/) - 组件示例
- [测试页面](../test/) - 功能测试

### 文档索引

- [首页](./Home.md) - Wiki 首页
- [快速入门](./Getting-Started.md) - 快速上手指南
- [设计理念](./Design-Philosophy.md) - 深入理解框架设计
- [组件索引](./Components/index.md) - 所有组件文档
- [核心模块索引](./Core/index.md) - 所有核心模块
- [API 索引](./API/index.md) - 完整 API 参考

### 规范文档

- [使用规范](./使用规范.md) - 框架使用标准（用户）
- [Wiki维护规范](./Wiki维护规范.md) - Wiki 维护标准（Agent）

---

**最后更新时间**: 2026-05-04
**版本**: v0.5.5
