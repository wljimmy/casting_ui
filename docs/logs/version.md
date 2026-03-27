# 版本更新日志

## v0.2.1 (2026-03-28)

### 新增功能

#### 菜单组件 (ui.js)
- **v0.2.1** - 新增菜单组件
- 支持多级菜单结构（最多4级）
- 支持通过HTML结构定义菜单内容
- 支持data属性标记引用位置或执行内容
- 支持动态添加菜单项
- 自动渲染和事件处理

#### Badge组件 (components.css)
- **v0.2.1** - 新增Badge小标记组件
- 支持多种语义化标签：hot、new、recommend、update、demo、tip、official、pro、beta、fixed
- 支持不同尺寸：sm、md、lg
- 支持多种颜色主题：primary、secondary、success、warning、error
- 支持描边样式
- 支持带数字角标
- 支持可关闭徽章
- 自动文本内容显示

#### 信息提示组件 (components.css)
- **v0.2.1** - 新增信息提示组件
- 支持四种类型：info、success、warning、error
- 支持带标题的信息提示
- 支持带列表的内容展示
- 纯CSS组件，无需JavaScript

#### Prism代码高亮集成
- **v1.29.0** - 集成Prism.js代码高亮库
- 支持HTML、JavaScript、CSS等语言高亮
- 适配Casting UI框架风格
- 支持动态内容加载后自动高亮

### 功能优化

#### 核心样式 (core.css)
- **v0.2.1** - 布局系统增强
- 新增顶部+左侧边栏+右侧内容布局结构
- 新增header搜索框样式
- 新增位置控制类：右对齐、居中
- 优化容器最小高度设置

#### 组件样式 (components.css)
- **v0.2.1** - 组件样式重构
- 重构Badge组件样式，使用padding控制高度
- 统一所有标签和徽章的高度为1em
- 优化代码块样式，字重设置为300
- 添加代码块滚动条样式
- 优化信息提示组件样式

#### UI模块 (ui.js)
- **v0.2.1** - 功能增强
- 新增菜单组件初始化和管理
- 优化页面加载逻辑
- 支持Prism代码高亮自动触发

#### Markdown编辑器样式 (md.css)
- **v0.2.1** - 样式优化
- 优化编辑器容器样式
- 调整预览区域样式

### 新增页面

#### 组件文档页面
- 菜单组件文档页面 (pages/interaction-controls/menu-container/)
- Badge组件文档页面 (pages/data-display/badge-container/)
- 信息提示组件文档页面 (pages/feedback-components/message-container/)
- 初始化指南页面 (pages/init-guide/)

#### 测试页面
- 菜单组件测试页面 (test/menu/)
- Badge组件测试页面 (test/badge/)

### 项目结构更新
- 新增Prism代码高亮目录 (dev/modules/css/prism/、dev/modules/js/prism/)
- 新增初始化指南页面目录 (pages/init-guide/)
- 新增菜单组件文档目录 (pages/interaction-controls/menu-container/)
- 新增信息提示组件文档目录 (pages/feedback-components/message-container/)

### 模块版本汇总

| 模块 | 文件 | 版本 | 描述 |
|------|------|------|------|
| core-css | dev/modules/css/core.css | 0.2.1 | 核心样式，包含CSS变量和基础样式 |
| components-css | dev/modules/css/components.css | 0.2.1 | 组件样式，包含所有UI组件的样式 |
| md-css | dev/modules/css/md.css | 0.2.1 | Markdown编辑器样式 |
| prism-css | dev/modules/css/prism/prism.css | 1.29.0 | Prism代码高亮样式 |
| prism-js | dev/modules/js/prism/prism.js | 1.29.0 | Prism代码高亮库 |

---

## v0.2.0 (2026-03-25)

### 新增功能

#### MD编辑器模块 (md.js / md.css)
- **v0.1.0** - 新增Markdown编辑器模块
- 支持Markdown语法实时预览
- 支持工具栏快捷操作
- 支持分屏编辑和预览模式

### 功能优化

#### 主题管理模块 (theme-manager.js)
- **v0.2.0** - 功能全面升级
- 修复颜色选择器初始颜色显示问题
- 添加 `initialColor` 参数支持，确保颜色选择器能正确显示当前颜色
- 修复主题管理模块重复添加元素问题
- 完善本地存储逻辑：
  - 预设主题不存储到本地，只存储自定义主题
  - 添加主题名称唯一性校验
  - 读取本地主题时过滤同名主题，避免重复加载
- 新增自定义主题功能：
  - 支持添加多个自定义主题
  - 支持编辑自定义主题
  - 支持删除自定义主题
  - 删除正在使用的主题时自动切换为默认主题
- 预设主题显示"预设"标签，不可编辑和删除
- 主题卡片显示主题描述信息

#### 颜色选择器模块 (color-picker.js)
- **v0.2.0** - 功能优化
- 添加 `initialColor` 参数支持
- 修复颜色选择器打开时显示默认颜色而非当前颜色的问题
- 优化颜色预览区域的初始值设置

### 版本管理

#### 新增版本号文件 (version.json)
- 创建项目根目录版本号文件
- 统一管理项目版本号和模块版本号
- 记录各模块的版本信息和描述
- 支持浏览器兼容性和技术栈信息

#### 模块版本注释更新
- 为所有JS模块文件添加版本注释
- 为所有CSS模块文件添加版本注释
- 统一版本注释格式，包含版本号、模块名、描述等信息

### 模块版本汇总

| 模块 | 文件 | 版本 | 描述 |
|------|------|------|------|
| core | dev/modules/js/core.js | 0.2.0 | 核心模块，提供调试、遮罩、弹窗基类等功能 |
| modal | dev/modules/js/modal.js | 0.2.0 | 弹窗模块，提供模态框功能 |
| message | dev/modules/js/message.js | 0.2.0 | 消息提示模块，提供Toast、Loading等功能 |
| image-zoom | dev/modules/js/image-zoom.js | 0.2.0 | 图片放大模块，支持点击图片放大查看 |
| theme-manager | dev/modules/js/theme-manager.js | 0.2.0 | 主题管理模块，支持主题切换和自定义主题 |
| color-picker | dev/modules/js/color-picker.js | 0.2.0 | 颜色选择器模块，支持多种颜色格式 |
| ui | dev/modules/js/ui.js | 0.2.0 | UI框架模块，提供UI组件管理 |
| index | dev/modules/js/index.js | 0.2.0 | 模块加载器，按需加载各功能模块 |
| md | dev/modules/js/md.js | 0.2.0 | Markdown编辑器模块 |
| core-css | dev/modules/css/core.css | 0.2.0 | 核心样式，包含CSS变量和基础样式 |
| components-css | dev/modules/css/components.css | 0.2.0 | 组件样式，包含所有UI组件的样式 |
| md-css | dev/modules/css/md.css | 0.2.0 | Markdown编辑器样式 |

---

## v0.1.0 (2024-01-01)

### 初始版本发布

#### 核心模块 (core.js)
- **v0.1.0** - 初始版本
- 实现调试函数 `debug()`
- 实现遮罩组件 `showOverlay()` 和 `hideOverlay()`
- 实现弹窗基类 `PopupBase`

#### 弹窗模块 (modal.js)
- **v0.1.0** - 初始版本
- 实现 `showModal()` 函数，支持自定义标题、内容和按钮
- 支持Promise异步处理

#### 消息提示模块 (message.js)
- **v0.1.0** - 初始版本
- 实现 `showToast()` 函数，支持不同类型的 Toast 消息
- 实现 `createMessage()` 函数，支持不同类型的消息提示
- 实现 `showLoading()` 和 `hideLoading()` 函数，用于显示和隐藏加载遮罩

#### 图片放大模块 (image-zoom.js)
- **v0.1.0** - 初始版本
- 实现 `zoomImage()` 函数，支持点击图片放大查看
- 支持手势操作和键盘快捷键

#### 主题管理模块 (theme-manager.js)
- **v0.1.0** - 初始版本
- 实现 `applyTheme()` 函数，支持切换内置主题和自定义主题
- 内置13种预设主题配色方案
- 支持从配置文件加载主题

#### 颜色选择器模块 (color-picker.js)
- **v0.1.0** - 初始版本
- 实现 `openColorPicker()` 函数，支持弹窗模式和内联模式
- 支持 HEX、RGB 和 RGBA 颜色格式
- 支持自定义预设颜色
- 提供色轮选择和手动输入功能

#### UI 模块 (ui.js)
- **v0.1.0** - 初始版本
- 实现 UI 框架的初始化和管理
- 集成主题管理功能

#### CSS 模块
- **v0.1.0** - 初始版本
- 实现核心样式 (core.css)，包含 CSS 变量定义和基础样式
- 实现组件样式 (components.css)，包含所有 UI 组件的样式
- 采用科技蓝（#165DFF）为主的流行配色
- 使用 CSS 变量统一管理样式
- 添加原生过渡动画和 View Transitions API 支持

### 项目结构
```
Casting_UI/
├── dev/                # 开发目录
│   ├── modules/        # 模块目录
│   │   ├── css/        # CSS模块
│   │   └── js/         # JavaScript模块
│   └── pages/          # 示例页面
├── test/               # 测试目录
├── dist/               # 发布目录
│   └── v0.1.0/         # 版本目录
├── docs/               # 文档目录
└── README.md           # 项目说明
```

### 技术特性
- 原生HTML5、CSS3、JavaScript (ES6+) 开发
- 无第三方依赖
- 所有页面可直接运行
- 框架文件不包含业务、测试、示例内容
- 代码简洁、清晰、可维护
