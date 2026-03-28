# Casting UI 框架

## 项目简介
Casting 是一个极简UI框架，专注于提供基础的UI组件和交互功能，采用原生HTML5、CSS和JavaScript开发，无任何第三方依赖。

## 技术栈
- 原生HTML5
- CSS3 (ES6+)
- JavaScript (ES6+)

## 第三方引用
- **Tabler Icons**: 一个免费的MIT许可的高质量SVG图标库，用于项目中的图标展示。详细信息请参考 [dev/icons/README.md](dev/icons/README.md)。
- **Prism**: 一个轻量级、健壮、优雅的语法高亮库，用于项目中的代码高亮显示。详细信息请参考 [dev/modules/js/prism/README.md](dev/modules/js/prism/README.md)。

## 目录结构
```
Casting_UI/
├── dev/                # 开发目录
│   ├── modules/        # 模块目录
│   │   ├── css/        # CSS模块
│   │   │   ├── core.css        # 核心样式（CSS变量、基础样式）
│   │   │   └── components.css  # 组件样式
│   │   └── js/         # JavaScript模块
│   │       ├── core.js          # 核心模块（调试、遮罩、弹窗基类）
│   │       ├── modal.js         # 弹窗模块
│   │       ├── message.js       # 消息提示模块
│   │       ├── image-zoom.js    # 图片放大模块
│   │       ├── theme-manager.js # 主题管理模块
│   │       ├── color-picker.js  # 颜色选择器模块
│   │       ├── ui.js            # UI框架模块
│   │       └── index.js         # 模块加载器
│   └── pages/          # 示例页面
├── test/               # 测试目录
│   ├── core/           # 核心模块测试
│   ├── modal/          # 弹窗模块测试
│   ├── message/        # 消息提示模块测试
│   ├── image-zoom/     # 图片放大模块测试
│   ├── theme-manager/  # 主题管理模块测试
│   └── color-picker/   # 颜色选择器模块测试
├── dist/               # 发布目录
│   └── v0.1.0/         # 版本目录
│       ├── Casting.css  # 合并后的CSS文件
│       └── Casting.js   # 合并后的JavaScript文件
├── docs/               # 文档目录
│   ├── api/            # API文档
│   ├── logs/           # 版本日志
│   └── usage/          # 使用说明
└── README.md           # 项目说明
```

## 模块说明

### 核心模块 (core.js)
- 提供调试函数 `debug()`
- 提供遮罩组件 `showMask()` 和 `hideMask()`
- 提供弹窗基类 `PopupBase`

### 弹窗模块 (modal.js)
- 提供 `modal()` 函数，支持自定义标题、内容和按钮

### 消息提示模块 (message.js)
- 提供 `toast()` 函数，支持不同类型的Toast消息
- 提供 `message()` 函数，支持不同类型的消息提示
- 提供 `showLoading()` 和 `hideLoading()` 函数，用于显示和隐藏加载遮罩

### 图片放大模块 (image-zoom.js)
- 提供 `imageZoom()` 函数，支持点击图片放大查看

### 主题管理模块 (theme-manager.js)
- 提供 `applyTheme()` 函数，支持切换内置主题和自定义主题
- 内置默认、深色和浅色主题

### 颜色选择器模块 (color-picker.js)
- 提供 `openColorPicker()` 函数，支持弹窗模式和内联模式
- 支持HEX、RGB和RGBA颜色格式
- 支持自定义预设颜色

### UI模块 (ui.js)
- 提供UI框架的初始化和管理

## 快速开始

### 引入框架文件
```html
<link rel="stylesheet" href="dist/v0.1.0/Casting.css">
<script src="dist/v0.1.0/Casting.js"></script>
```

### 基本使用

#### 弹窗
```javascript
modal({
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
toast('操作成功', 'success');
```

#### 图片放大
```javascript
const img = document.querySelector('img');
img.onclick = function() {
  imageZoom(this);
};
```

#### 主题切换
```javascript
applyTheme('dark'); // 应用深色主题
```

## 版本信息
- 当前版本: v0.2.1
- 发布日期: 2026-03-29
- 版本文件: [version.json](version.json)
- 版本日志: [docs/logs/version.md](docs/logs/version.md)

### 版本历史
- **v0.2.1** (2026-03-29) - 优化菜单样式，修复菜单边框显示问题，添加第三方引用说明
- **v0.2.0** (2026-03-25) - 主题管理功能优化，新增MD编辑器模块，完善版本管理
- **v0.1.0** (2024-01-01) - 初始版本发布

## 开发规范
- 严格遵循原生HTML5/CSS/ES6+规范
- 仅引入必要的第三方库（Tabler Icons和Prism）
- 所有页面可直接运行
- 框架文件不包含业务、测试、示例内容
- 保持代码简洁、清晰、可维护

## 贡献指南
1. Fork 本项目
2. 创建 feature 分支
3. 提交代码
4. 推送到分支
5. 打开 Pull Request

## 许可证
MIT License