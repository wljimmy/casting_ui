# Casting UI 框架

## 项目简介
Casting 是一个极简UI框架，专注于提供基础的UI组件和交互功能，采用原生HTML5、CSS和JavaScript开发，无任何第三方依赖。

## 技术栈
- 原生HTML5
- CSS3 (ES6+)
- JavaScript (ES6+)
- Vite (开发工具)

## 第三方引用
- **Tabler Icons**: 一个免费的MIT许可的高质量SVG图标库，用于项目中的图标展示。
- **Prism**: 一个轻量级、健壮、优雅的语法高亮库，用于项目中的代码高亮显示。

**说明**：这些第三方库都不影响框架的核心运行，仅为了美化界面，属于插件性质。

## 目录结构
```
Casting_UI/
├── src/                      # 开发目录
│   ├── modules/              # 模块目录
│   │   ├── css/              # CSS模块
│   │   │   ├── prism/        # Prism代码高亮样式
│   │   │   ├── core.css      # 核心样式（CSS变量、基础样式）
│   │   │   ├── container.css # 容器样式（CUI-box、CUI-grid等）
│   │   │   ├── layout.css    # 布局样式（CUI-layout-web、CUI-layout-shell）
│   │   │   ├── components.css# 组件样式
│   │   │   ├── progress.css  # 进度条样式
│   │   │   ├── status.css    # 状态栏样式
│   │   │   ├── text.css      # 文本样式
│   │   │   ├── header.css    # 头部样式
│   │   │   ├── menu.css      # 菜单组件样式
│   │   │   ├── md.css        # Markdown编辑器样式
│   │   │   ├── animation.css # 动画样式
│   │   │   └── responsive.css# 响应式样式
│   │   └── js/               # JavaScript模块
│   │       ├── prism/        # Prism代码高亮库
│   │       ├── core.js       # 核心模块（调试、遮罩、弹窗基类）
│   │       ├── modal.js      # 弹窗模块
│   │       ├── message.js    # 消息提示模块
│   │       ├── image-zoom.js # 图片放大模块
│   │       ├── theme-manager.js# 主题管理模块
│   │       ├── color-picker.js# 颜色选择器模块
│   │       ├── progress.js   # 进度条模块
│   │       ├── status.js    # 状态栏模块
│   │       ├── ui.js         # UI框架模块
│   │       ├── md.js         # Markdown编辑器模块
│   │       ├── menu.js       # 菜单模块
│   │       ├── dom-observer.js# DOM观察器模块
│   │       └── index.js      # 模块加载器
│   ├── examples/             # 示例页面
│   └── index.html            # Vite入口文件
├── public/                   # 静态资源目录
│   ├── icons/                # 图标资源（filled、outline）
│   ├── manual/               # 手册页面
│   └── test/                 # 测试页面
├── dist/                     # 发布目录
│   └── v0.3.0/               # 版本目录
│       ├── Casting.css       # 合并后的CSS文件
│       └── Casting.js        # 合并后的JavaScript文件
├── docs/                     # 文档目录
│   ├── api/                  # API文档
│   ├── logs/                 # 版本日志
│   ├── design/               # 设计文档
│   └── usage/                # 使用说明
├── index.html                # 项目根入口
├── vite.config.js            # Vite配置文件
├── package.json              # 项目配置文件
├── playwright.config.js      # Playwright测试配置
└── README.md                 # 项目说明
```

## 模块说明

### CSS模块

#### 核心样式 (core.css)
- 提供CSS变量定义（颜色、字体、尺寸、阴影等）
- 基础样式重置
- 标题和正文样式
- 屏幕适配规则

#### 容器样式 (container.css)
- 视觉容器类：CUI-box、CUI-card、CUI-fluid、CUI-panel
- 语义容器类：CUI-section、CUI-header、CUI-footer、CUI-main、CUI-aside、CUI-page、CUI-wrap
- Grid布局系统：CUI-grid、CUI-grid-1c到CUI-grid-12c
- 对齐类：CUI-grid-left、CUI-grid-h-center、CUI-grid-right、CUI-grid-top、CUI-grid-v-center、CUI-grid-bottom
- 跨列/跨行类：CUI-span-1c到CUI-span-12c、CUI-span-1r到CUI-span-12r
- 间距类：CUI-m-xs到CUI-m-xl、CUI-p-xs到CUI-p-xl

#### 布局样式 (layout.css)
- 网页布局：CUI-layout-web（流式自适应，超宽屏主内容区限宽居中）
- 应用壳布局：CUI-layout-shell（上下左右固定，中间主内容区独立滚动）
- 布局控制类：CUI-hidden-header、CUI-hidden-sidebar-left、CUI-hidden-sidebar-right、CUI-hidden-footer
- 侧边栏类：CUI-sidebar-left、CUI-sidebar-right

#### 其他CSS模块
- **text.css**: 文本相关样式
- **header.css**: 头部样式
- **menu.css**: 菜单组件样式
- **components.css**: 通用组件样式
- **md.css**: Markdown编辑器样式
- **animation.css**: 动画样式
- **responsive.css**: 响应式设计样式

### JavaScript模块

#### 核心模块 (core.js)
- 提供调试函数 `debug()`
- 提供遮罩组件 `createOverlay()`、`showOverlay()` 和 `hideOverlay()`
- 提供弹窗基类 `PopupBase`

#### 弹窗模块 (modal.js)
- 提供 `showModal()` 函数，支持自定义标题、内容和按钮
- 支持Promise异步处理

#### 消息提示模块 (message.js)
- 提供 `showToast()` 函数，支持不同类型的Toast消息
- 提供 `createMessage()` 函数，支持不同类型的消息提示
- 提供 `showLoading()` 和 `hideLoading()` 函数，用于显示和隐藏加载遮罩

#### 图片放大模块 (image-zoom.js)
- 提供 `zoomImage()` 函数，支持点击图片放大查看
- 支持手势操作和键盘快捷键

#### 主题管理模块 (theme-manager.js)
- 提供 `applyTheme()` 函数，支持切换内置主题和自定义主题
- 内置13种预设主题配色方案
- 支持自定义主题

#### 颜色选择器模块 (color-picker.js)
- 提供 `openColorPicker()` 函数，支持弹窗模式和内联模式
- 支持HEX、RGB和RGBA颜色格式
- 支持自定义预设颜色

#### Markdown编辑器模块 (md.js)
- 支持Markdown语法实时预览
- 支持工具栏快捷操作
- 支持分屏编辑和预览模式

#### 菜单模块 (menu.js)
- 支持多种菜单类型（侧边栏、弹出式、内联）
- 支持4级嵌套菜单
- 自动初始化与DOM监听
- 多菜单实例隔离
- 自动垃圾回收
- 支持图标和徽章
- 支持data-action页面加载与回调
- 支持fetch加载子页面，自动处理CSS/JS引用冲突

#### DOM观察器模块 (dom-observer.js)
- 统一的DOM变化监听
- 支持元素增加和移除事件
- 自动处理新增/移除元素及其所有子元素
- 使用CSS选择器匹配目标元素
- 错误处理，单个处理函数失败不影响其他

#### 进度条模块 (progress.js)
- 基于data属性驱动，修改data-value即可控制进度
- 默认启用label、striped、animated效果
- 支持plain模式关闭默认装饰
- 支持自定义颜色（data-color）
- 支持自定义尺寸（W/H参数）
- 防呆设计，参数冲突按优先级处理
- 自动初始化与MutationObserver监听

#### 状态栏模块 (status.js)
- 提供状态栏的动态渲染功能
- 支持多种样式类型（glass、dark、primary）

## 快速开始

### 开发环境
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产环境
```html
<link rel="stylesheet" href="dist/v0.3.0/Casting.css">
<script src="dist/v0.3.0/Casting.js"></script>
```

### 基本使用

#### 使用布局系统
```html
<!-- 应用壳布局 -->
<body class="CUI-layout-shell">
    <header>头部</header>
    <aside class="CUI-sidebar-left">左侧边栏</aside>
    <main>主内容区</main>
    <aside class="CUI-sidebar-right">右侧边栏</aside>
    <footer>底部</footer>
</body>
```

#### 使用容器类
```html
<!-- 基础容器 -->
<div class="CUI-box">内容</div>

<!-- 卡片容器 -->
<div class="CUI-card">卡片内容</div>

<!-- Grid布局 -->
<div class="CUI-grid CUI-grid-3c">
    <div>列1</div>
    <div>列2</div>
    <div>列3</div>
</div>
```

#### 弹窗
```javascript
showModal({
  title: '提示',
  content: '这是一个弹窗',
  buttons: [
    {
      text: '确定',
      style: 'primary',
      action: () => {
        console.log('点击了确定');
      }
    },
    {
      text: '取消',
      action: () => {
        console.log('点击了取消');
      }
    }
  ]
});
```

#### Toast消息
```javascript
showToast('操作成功', 'success');
```

#### 图片放大
```javascript
const img = document.querySelector('img');
img.onclick = function() {
  zoomImage(this);
};
```

#### 主题切换
```javascript
applyTheme('dark'); // 应用深色主题
```

#### 菜单组件
```html
<menu id="my-menu" class="menu-sidebar">
    <ul>
        <li data-icon="outline/home.svg" data-badge="new">首页</li>
        <li data-icon="outline/package.svg">产品
            <ul>
                <li data-icon="outline/smartphone.svg">手机</li>
                <li data-icon="outline/laptop.svg" data-badge="hot">电脑</li>
            </ul>
        </li>
    </ul>
</menu>
```

## 版本信息
- 当前版本: v0.5.4
- 发布日期: 2026-04-26
- 版本日志: [docs/logs/version.md](docs/logs/version.md)

### 版本历史
- **v0.5.4** (2026-04-26) - 优化菜单加载逻辑，添加详细日志输出，支持fetch加载子页面时自动处理CSS/JS引用冲突，防呆设计
- **v0.5.3** (2026-04-25) - 响应式菜单优化，添加侧边栏菜单自动调整位置功能，修复菜单点击事件冒泡问题
- **v0.5.2** (2026-04-01) - 安全优化：修复XSS漏洞，代码质量优化，内存泄漏修复，内联菜单重构
- **v0.5.1** (2026-03-30) - 新增DOM观察器模块，优化菜单组件，调整项目结构
- **v0.2.2** (2026-03-28) - 组件审计与手册完善
- **v0.2.1** (2026-03-28) - 新增菜单组件、Badge组件、信息提示组件
- **v0.2.0** (2026-03-25) - 主题管理功能优化，新增MD编辑器模块，完善版本管理
- **v0.1.0** (2024-01-01) - 初始版本发布

## 开发规范
- 严格遵循原生HTML5/CSS/ES6+规范
- 仅引入必要的第三方库（Tabler Icons和Prism）
- 所有页面可直接运行
- 框架文件不包含业务、测试、示例内容
- 保持代码简洁、清晰、可维护
- 所有CSS类统一使用CUI-前缀

## 贡献指南
1. Fork 本项目
2. 创建 feature 分支
3. 提交代码
4. 推送到分支
5. 打开 Pull Request

## 许可证
MIT License
