# 版本更新日志

## v0.1.0 (2024-01-01)

### 核心模块 (core.js)
- 初始版本
- 实现调试函数 debug()
- 实现遮罩组件 showMask() 和 hideMask()
- 实现弹窗基类 PopupBase

### 弹窗模块 (modal.js)
- 初始版本
- 实现 modal() 函数，支持自定义标题、内容和按钮

### 消息提示模块 (message.js)
- 初始版本
- 实现 toast() 函数，支持不同类型的 Toast 消息
- 实现 message() 函数，支持不同类型的消息提示
- 实现 showLoading() 和 hideLoading() 函数，用于显示和隐藏加载遮罩

### 图片放大模块 (image-zoom.js)
- 初始版本
- 实现 imageZoom() 函数，支持点击图片放大查看

### 主题管理模块 (theme-manager.js)
- 初始版本
- 实现 applyTheme() 函数，支持切换内置主题和自定义主题
- 内置默认、深色和浅色主题

### 颜色选择器模块 (color-picker.js)
- 初始版本
- 实现 openColorPicker() 函数，支持弹窗模式和内联模式
- 支持 HEX、RGB 和 RGBA 颜色格式
- 支持自定义预设颜色

### UI 模块 (ui.js)
- 初始版本
- 实现 UI 框架的初始化和管理

### CSS 模块
- 初始版本
- 实现核心样式 (core.css)，包含 CSS 变量定义和基础样式
- 实现组件样式 (components.css)，包含所有 UI 组件的样式