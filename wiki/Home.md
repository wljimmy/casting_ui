
# Casting UI 框架 Wiki

欢迎来到 Casting UI 框架的官方 Wiki！

## 概述

Casting UI 是一个极简、易用的前端 UI 框架，专注于简化开发流程。框架遵循以下设计理念：

- **极简设计**：无需学习复杂语法，像写 Markdown 一样写 HTML
- **专注内容**：所有样式、组件结构由框架自动处理
- **原生兼容**：使用标准 HTML/CSS/JavaScript，无需构建工具
- **灵活扩展**：提供完整的扩展机制

## 快速开始

### 引入方式一：使用合并文件（推荐）

```html
<!-- 引入 CSS 文件 -->
<link rel="stylesheet" href="dist/v0.5.4/Casting.css">

<!-- 引入 JavaScript 文件 -->
<script src="dist/v0.5.4/Casting.js"></script>
```

### 引入方式二：使用模块化文件

```html
<!-- 引入 CSS 文件 -->
<link rel="stylesheet" href="src/modules/css/core.css">
<link rel="stylesheet" href="src/modules/css/container.css">
<link rel="stylesheet" href="src/modules/css/layout.css">
<link rel="stylesheet" href="src/modules/css/components.css">

<!-- 引入 JavaScript 文件 -->
<script type="module" src="src/modules/js/index.js"></script>
```

## 版本信息

- **当前版本**：v0.5.4
- **技术栈**：原生 HTML5、CSS3、JavaScript (ES6+)
- **浏览器兼容性**：Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

## 导航

### 入门指南
- [快速入门](./Getting-Started.md) - 快速上手框架
- [设计理念](./Design-Philosophy.md) - 了解框架设计思想
- [使用规范](./使用规范.md) - 框架使用标准（用户）
- [Wiki维护规范](./Wiki维护规范.md) - Wiki 维护标准（Agent）

### 组件文档
- [基础布局](./Components/Basic-Layout.md) - 容器、按钮、卡片
- [数据展示](./Components/Data-Display.md) - 进度条、徽章、状态栏
- [表单组件](./Components/Form.md) - 输入框、表单、选择器
- [文本组件](./Components/Text.md) - 标题、文本样式
- [反馈组件](./Components/Feedback.md) - 提示、弹窗、加载
- [菜单组件](./Components/Menu.md) - 导航菜单、侧边栏

### API 文档
- [API 索引](./API/index.md) - 所有 API 快速参考
- [DOMObserver](./Core/DOMObserver.md) - DOM 观察者
- [ColorPicker](./Core/ColorPicker.md) - 颜色选择器
- [ThemeManager](./Core/ThemeManager.md) - 主题管理器

### 核心模块
- [核心模块](./Core/) - 框架核心功能文档

## 组件总览

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

## 项目结构

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
└── test/            # 测试页面
└── wiki/            # Wiki 文档 (本目录)
```

## 快速链接

- [手册页面](../public/manual/) - 交互式组件手册
- [示例页面](../src/examples/) - 组件示例
- [测试页面](../test/) - 功能测试
- [设计理念](./Design-Philosophy.md) - 深入理解框架设计

