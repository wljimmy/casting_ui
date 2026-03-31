# 使用说明

## 快速开始

### 1. 引入框架文件
在HTML文件中引入Casting.css和Casting.js文件：

```html
<link rel="stylesheet" href="dist/v0.5.1/Casting.css">
<script src="dist/v0.5.1/Casting.js"></script>
```

### 2. 基本使用

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
showToast('操作失败', 'error');
showToast('警告信息', 'warning');
showToast('提示信息', 'info');
```

#### 加载遮罩
```javascript
// 显示加载遮罩
showLoading('加载中...');

// 隐藏加载遮罩
hideLoading();
```

#### 图片放大
```javascript
// 为图片添加放大功能
const img = document.querySelector('img');
img.onclick = function() {
  zoomImage(this);
};
```

#### 主题切换
```javascript
// 应用内置主题
applyTheme('default');  // 默认主题
applyTheme('dark');     // 深色主题
applyTheme('light');    // 浅色主题

// 应用自定义主题
const customTheme = {
  'primary-color': '#ff6b6b',
  'bg-color': '#f8f9fa',
  'text-color': '#333333'
};
applyTheme('custom', customTheme);
```

#### 颜色选择器
```javascript
// 弹窗模式
openColorPicker({
  mode: 'modal',
  format: 'hex'
})
.then(color => {
  console.log('选择的颜色:', color);
});

// 内联模式
openColorPicker({
  mode: 'inline',
  container: '#color-container',
  format: 'rgb'
})
.then(color => {
  console.log('选择的颜色:', color);
});
```

#### Markdown编辑器
```html
<!-- 只需添加一个容器 -->
<div id="markdown-editor"></div>

<script>
// 初始化编辑器
const editor = initMarkdownEditor('#markdown-editor', {
  placeholder: '请输入Markdown内容...',
  theme: 'default'
});

// 获取编辑器内容
const content = editor.getValue();
</script>
```

#### 菜单组件
```html
<!-- 基础菜单结构 -->
<menu id="my-menu" class="menu-sidebar">
    <ul>
        <li data-icon="outline/home.svg" data-badge="new">首页</li>
        <li data-icon="outline/package.svg">产品
            <ul>
                <li data-icon="outline/smartphone.svg">手机</li>
                <li data-icon="outline/laptop.svg" data-badge="hot">电脑
                    <ul>
                        <li>笔记本</li>
                        <li data-badge="beta">台式机</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li data-icon="outline/settings.svg" data-action='{"url":"settings.html","container":"#content"}'>设置</li>
    </ul>
</menu>

<script>
// 通过JS API创建菜单
CastingMenu.create({
    id: 'dynamic-menu',
    className: 'menu-sidebar',
    container: '#menu-container',
    items: [
        {
            text: '首页',
            icon: 'outline/home.svg',
            badge: 'new'
        },
        {
            text: '产品',
            icon: 'outline/package.svg',
            children: [
                { text: '手机', icon: 'outline/smartphone.svg' },
                { text: '电脑', icon: 'outline/laptop.svg', badge: 'hot' }
            ]
        }
    ]
});
</script>
```

## 开发模式

### 目录结构
```
Casting_UI/
├── src/                # 开发目录
│   ├── modules/        # 模块目录
│   │   ├── css/        # CSS模块
│   │   └── js/         # JavaScript模块
│   ├── test/           # 测试目录
│   └── manual/         # 手册页面
├── public/             # 静态资源目录
│   └── icons/          # 图标资源
├── dist/               # 发布目录
│   └── v0.5.1/         # 版本目录
├── docs/               # 文档目录
├── vite.config.js      # Vite配置文件
├── package.json        # 项目配置文件
└── README.md           # 项目说明
```

### 开发流程
1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 在 `src/modules` 目录下修改或添加模块
4. 在 `src/test` 目录下测试模块功能
5. 手动打包生成 `dist/v0.5.1/Casting.css` 和 `dist/v0.5.1/Casting.js`
6. 更新文档

### 打包方法
手动合并 `src/modules/css` 下的CSS文件和 `src/modules/js` 下的JavaScript文件，生成纯净的Casting.css和Casting.js文件。

## 模块加载顺序

框架采用按需加载模式，模块加载顺序如下：
1. dom-observer.js (DOM观察器模块)
2. core.js (核心模块)
3. 其他功能模块 (modal.js, message.js, image-zoom.js, color-picker.js, theme-manager.js, menu.js, ui.js)

## 注意事项

1. **图标引用**：图标文件位于 `public/icons/` 目录，使用绝对路径 `/icons/` 引用
2. **菜单组件**：使用 `<menu>` 标签，支持 `menu-sidebar`、`menu-popup`、`menu-inline` 三种类型
3. **主题管理**：支持13种预设主题，可自定义主题
4. **颜色选择器**：支持HEX、RGB、RGBA三种颜色格式
5. **Markdown编辑器**：支持实时预览和工具栏操作
6. **DOM观察器**：统一的DOM变化监听，避免重复创建MutationObserver

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 性能优化

1. **按需加载**：模块采用动态导入，仅在需要时加载
2. **DOM观察器**：统一的DOM变化监听，减少重复的MutationObserver实例
3. **事件委托**：菜单等组件使用事件委托，减少事件监听器数量
4. **垃圾回收**：菜单实例在DOM元素移除时自动销毁，释放内存
