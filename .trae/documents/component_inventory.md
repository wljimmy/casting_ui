# Casting UI 组件清单

## 项目结构分析

### 目录结构
```
Casting_UI/
├── dev/
│   ├── modules/
│   │   ├── css/          # CSS模块
│   │   └── js/           # JavaScript模块
│   └── pages/          # 页面目录
├── test/               # 测试目录
├── dist/               # 发布目录
├── docs/               # 文档目录
└── index.html          # 主页面
```

## 组件分类

### 1. 基础布局组件 (basic-layout)
- **card-container** - 卡片容器
- **general-container** - 通用容器

### 2. 交互控件 (interaction-controls)
- **button-container** - 按钮组件
- **input-container** - 输入框组件
- **select-container** - 选择控件
- **md-container** - Markdown编辑器

### 3. 反馈组件 (feedback-components)
- **modal-container-1** - 弹窗组件
- **toast-container** - Toast提示组件
- **loading-container** - 加载组件

### 4. 数据展示 (data-display)
- **image-container** - 图片容器
- **list-container** - 列表容器
- **table-container** - 表格容器
- **badge-container** - 徽章容器
- **progress-container** - 进度条容器

### 5. 通用UI (general-ui)
- **divider-container** - 分隔线组件
- **icon-container** - 图标组件
- **text-container** - 文本组件
- **theme-selector** - 主题选择器

### 6. 核心模块
- **core** - 核心模块（调试、遮罩、弹窗基类）
- **modal** - 弹窗模块
- **message** - 消息提示模块
- **image-zoom** - 图片放大模块
- **theme-manager** - 主题管理模块
- **color-picker** - 颜色选择器模块
- **ui** - UI框架模块
- **md** - Markdown编辑器模块

## 组件详细信息

### 1. 基础布局组件

#### card-container
- **功能**: 卡片式容器，用于展示内容
- **文件**: pages/basic-layout/card-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持阴影、边框、圆角等样式

#### general-container
- **功能**: 通用容器，用于页面布局
- **文件**: pages/basic-layout/general-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持不同尺寸和布局方式

### 2. 交互控件

#### button-container
- **功能**: 按钮组件，支持不同样式和尺寸
- **文件**: pages/interaction-controls/button-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持主要按钮、次要按钮、禁用状态等

#### input-container
- **功能**: 输入框组件，支持不同类型的输入
- **文件**: pages/interaction-controls/input-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持文本输入、密码输入、搜索输入等

#### select-container
- **功能**: 选择控件，支持下拉选择
- **文件**: pages/interaction-controls/select-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持单选和多选

#### md-container
- **功能**: Markdown编辑器，支持实时预览
- **文件**: pages/interaction-controls/md-container/index.html
- **依赖**: md.css, md.js
- **特性**: 支持Markdown语法、工具栏、分屏编辑

### 3. 反馈组件

#### modal-container-1
- **功能**: 弹窗组件，用于显示重要信息或操作
- **文件**: pages/feedback-components/modal-container-1/index.html
- **依赖**: modal.js
- **特性**: 支持自定义标题、内容、按钮

#### toast-container
- **功能**: Toast提示组件，用于显示临时消息
- **文件**: pages/feedback-components/toast-container/index.html
- **依赖**: message.js
- **特性**: 支持不同类型（成功、警告、错误、信息）

#### loading-container
- **功能**: 加载组件，用于显示加载状态
- **文件**: pages/feedback-components/loading-container/index.html
- **依赖**: message.js
- **特性**: 支持不同样式的加载动画

### 4. 数据展示

#### image-container
- **功能**: 图片容器，支持图片展示和放大
- **文件**: pages/data-display/image-container/index.html
- **依赖**: image-zoom.js
- **特性**: 支持点击放大查看

#### list-container
- **功能**: 列表容器，用于展示列表数据
- **文件**: pages/data-display/list-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持不同样式的列表项

#### table-container
- **功能**: 表格容器，用于展示表格数据
- **文件**: pages/data-display/table-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持表头、单元格样式

#### badge-container
- **功能**: 徽章容器，用于显示标签或状态
- **文件**: pages/data-display/badge-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持不同颜色和样式

#### progress-container
- **功能**: 进度条容器，用于显示进度
- **文件**: pages/data-display/progress-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持不同样式和动画

### 5. 通用UI

#### divider-container
- **功能**: 分隔线组件，用于分隔内容
- **文件**: pages/general-ui/divider-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持水平和垂直分隔线

#### icon-container
- **功能**: 图标组件，用于显示图标
- **文件**: pages/general-ui/icon-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持不同图标样式

#### text-container
- **功能**: 文本组件，用于显示文本内容
- **文件**: pages/general-ui/text-container/index.html
- **依赖**: 基础CSS
- **特性**: 支持不同文本样式和层次

#### theme-selector
- **功能**: 主题选择器，用于切换主题
- **文件**: pages/general-ui/theme-selector/index.html
- **依赖**: theme-manager.js
- **特性**: 支持主题切换和自定义主题

## 核心模块

### core
- **功能**: 核心模块，提供调试、遮罩、弹窗基类
- **文件**: dev/modules/js/core.js
- **特性**: 提供debug函数、showOverlay/hideOverlay函数、PopupBase基类

### modal
- **功能**: 弹窗模块，提供模态框功能
- **文件**: dev/modules/js/modal.js
- **依赖**: core.js
- **特性**: 提供showModal函数，支持Promise异步处理

### message
- **功能**: 消息提示模块，提供Toast、Loading等功能
- **文件**: dev/modules/js/message.js
- **依赖**: core.js
- **特性**: 提供showToast、createMessage、showLoading等函数

### image-zoom
- **功能**: 图片放大模块，支持点击图片放大查看
- **文件**: dev/modules/js/image-zoom.js
- **依赖**: core.js
- **特性**: 提供zoomImage函数，支持手势操作

### theme-manager
- **功能**: 主题管理模块，支持主题切换和自定义主题
- **文件**: dev/modules/js/theme-manager.js
- **依赖**: core.js, color-picker.js
- **特性**: 提供主题切换、自定义主题、本地存储等功能

### color-picker
- **功能**: 颜色选择器模块，支持多种颜色格式
- **文件**: dev/modules/js/color-picker.js
- **依赖**: core.js
- **特性**: 提供openColorPicker函数，支持弹窗和内联模式

### ui
- **功能**: UI框架模块，提供UI组件管理
- **文件**: dev/modules/js/ui.js
- **依赖**: 所有其他模块
- **特性**: 提供UI框架的初始化和管理

### md
- **功能**: Markdown编辑器模块
- **文件**: dev/modules/js/md.js
- **依赖**: core.js
- **特性**: 提供Markdown编辑和预览功能

## 技术栈

- **前端**: 原生HTML5、CSS3、JavaScript (ES6+)
- **样式**: CSS变量、Flexbox、Grid、响应式设计
- **交互**: 原生事件处理、Promise异步
- **存储**: localStorage（用于主题设置）

## 组件使用模式

1. **纯CSS组件**: 仅依赖CSS，无JavaScript
   - card-container
   - general-container
   - divider-container
   - icon-container
   - text-container
   - badge-container
   - progress-container

2. **CSS + JavaScript组件**: 依赖CSS和JavaScript
   - button-container (基础功能纯CSS，高级功能需JS)
   - input-container (基础功能纯CSS，高级功能需JS)
   - select-container (基础功能纯CSS，高级功能需JS)
   - modal-container-1 (依赖modal.js)
   - toast-container (依赖message.js)
   - loading-container (依赖message.js)
   - image-container (依赖image-zoom.js)
   - md-container (依赖md.js)
   - theme-selector (依赖theme-manager.js)

3. **核心模块**: 提供功能API
   - core.js
   - modal.js
   - message.js
   - image-zoom.js
   - theme-manager.js
   - color-picker.js
   - ui.js
   - md.js
