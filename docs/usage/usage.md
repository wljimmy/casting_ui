# 使用说明

## 快速开始

### 1. 引入框架文件
在HTML文件中引入Casting.css和Casting.js文件：

```html
<link rel="stylesheet" href="dist/v0.1.0/Casting.css">
<script src="dist/v0.1.0/Casting.js"></script>
```

### 2. 基本使用

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
toast('操作失败', 'error');
toast('警告信息', 'warning');
toast('提示信息', 'info');
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
  imageZoom(this);
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

## 开发模式

### 目录结构
```
Casting_UI/
├── dev/                # 开发目录
│   ├── modules/        # 模块目录
│   │   ├── css/        # CSS模块
│   │   └── js/         # JavaScript模块
│   └── examples/       # 示例页面
├── test/               # 测试目录
├── dist/               # 发布目录
│   └── v0.1.0/         # 版本目录
├── docs/               # 文档目录
└── README.md           # 项目说明
```

### 开发流程
1. 在 `dev/modules` 目录下修改或添加模块
2. 在 `test` 目录下测试模块功能
3. 手动打包生成 `dist/v0.1.0/Casting.css` 和 `dist/v0.1.0/Casting.js`
4. 更新文档

### 打包方法
手动合并 `dev/modules/css` 下的CSS文件和 `dev/modules/js` 下的JavaScript文件，生成纯净的Casting.css和Casting.js文件。