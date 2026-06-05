
# API 参考

Casting UI 提供丰富的 JavaScript API，用于控制和扩展框架功能。

## 全局对象

### window.CUI

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

### window.CastingDOMObserver

DOM 观察者单例，用于监听 DOM 变化。

```javascript
CastingDOMObserver.onAdd(key, selector, handler)
CastingDOMObserver.onRemove(key, selector, handler)
CastingDOMObserver.off(key)
```

### window.ui

UI 模块主实例，包含主题管理器、颜色选择器等。

```javascript
ui.themeManager  // 主题管理器
ui.menu          // 菜单管理
ui.getThemeManager()
ui.getColorPicker()
```

## 核心 API

### 输入框注册表 (CUI.input)

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

### DOM 观察者 (CastingDOMObserver)

| 方法 | 描述 |
|------|------|
| `onAdd(key, selector, handler)` | 注册元素添加事件 |
| `onRemove(key, selector, handler)` | 注册元素移除事件 |
| `off(key)` | 取消注册事件 |
| `destroy()` | 销毁观察者 |

### 消息提示 (CUI.message)

| 方法 | 描述 |
|------|------|
| `showToast(type, message, options)` | 显示轻提示 |
| `showLoading(message)` | 显示加载遮罩 |
| `hideLoading()` | 隐藏加载遮罩 |
| `createMessage(type, message, options)` | 创建持久消息 |

### 弹窗 (CUI.modal)

| 方法 | 描述 |
|------|------|
| `showModal(options)` | 显示弹窗 |
| `hideModal()` | 隐藏弹窗 |

### 进度条 (Progress)

| 方法 | 描述 |
|------|------|
| `new Progress(element, options)` | 创建进度条实例 |
| `progress.setValue(value)` | 设置进度值 |
| `progress.getValue()` | 获取进度值 |
| `progress.setType(type)` | 设置进度条类型 |
| `progress.animate(start, end, duration)` | 动画过渡 |

### 菜单 (CastingMenu)

| 方法 | 描述 |
|------|------|
| `CastingMenu.initMenu(menu)` | 初始化单个菜单 |
| `CastingMenu.initMenus()` | 初始化所有菜单 |
| `menuInstance.setActiveItem(item)` | 设置激活菜单项 |
| `menuInstance.toggle()` | 切换菜单显示/隐藏 |

## 快捷函数

### 全局函数

| 函数 | 描述 |
|------|------|
| `openThemeSelector(options)` | 打开主题选择器 |
| `openColorPicker(options)` | 打开颜色选择器 |
| `showToast(type, message, options)` | 显示轻提示 |
| `showModal(options)` | 显示弹窗 |
| `showLoading(message)` | 显示加载遮罩 |
| `hideLoading()` | 隐藏加载遮罩 |

## 详细文档

- [LifecycleScheduler API](../Core/LifecycleScheduler.md) - 全局生命周期时序调度与沙箱容灾隔离详细文档
- [DOMObserver API](../Core/DOMObserver.md) - DOM 观察者详细文档
- [ColorPicker API](../Core/ColorPicker.md) - 颜色选择器详细文档
- [ThemeManager API](../Core/ThemeManager.md) - 主题管理器详细文档
- [Menu API](../Components/Menu.md) - 菜单组件详细文档
- [Feedback API](../Components/Feedback.md) - 反馈组件详细文档
- [Form API](../Components/Form.md) - 表单组件详细文档

## 使用示例

### 表单数据操作

```javascript
// 获取表单数据
const formData = CUI.input.getFormData('myForm');
console.log(formData);

// 设置表单数据
CUI.input.setFormData('myForm', {
  username: '张三',
  email: 'zhangsan@example.com'
});

// 获取单个输入框值
const email = CUI.input.getValue('myForm.email');
```

### 显示提示消息

```javascript
// 成功提示
showToast('success', '操作成功！');

// 错误提示
showToast('error', '操作失败，请重试');

// 警告提示
showToast('warning', '请注意！');

// 信息提示
showToast('info', '提示信息');
```

### 打开颜色选择器

```javascript
openColorPicker({
  initialColor: '#165DFF',
  format: 'hex'
}).then(color => {
  console.log('选择的颜色:', color);
  // 使用颜色
});
```

### 打开主题选择器

```javascript
openThemeSelector().then(() => {
  console.log('主题选择器已打开');
}).catch(reason => {
  console.log('主题选择器已关闭:', reason);
});
```

### 显示弹窗

```javascript
showModal({
  title: '确认',
  content: '确定要执行此操作吗？',
  confirmText: '确定',
  cancelText: '取消'
}).then(() => {
  // 用户点击确定
  console.log('用户确认');
}).catch(() => {
  // 用户点击取消
  console.log('用户取消');
});
```

### 动态创建组件

```javascript
// 动态添加输入框
const input = document.createElement('input');
input.type = 'text';
input.name = 'dynamic-input';
input.className = 'CUI-input';
input.placeholder = '动态输入框';
document.body.appendChild(input);

// DOMObserver 会自动检测并注册这个输入框
// 可以立即使用 API 操作它
setTimeout(() => {
  CUI.input.setValue('dynamic-input', 'Hello World');
}, 100);
```

## 错误处理

所有返回 Promise 的 API 都应该处理错误：

```javascript
// 颜色选择器
try {
  const color = await openColorPicker();
  console.log('选择的颜色:', color);
} catch (error) {
  console.log('用户取消选择');
}

// 弹窗
try {
  await showModal({ title: '确认' });
  console.log('用户确认');
} catch (error) {
  console.log('用户取消');
}
```

## 调试模式

启用调试模式可以看到详细的日志：

```javascript
import { DEBUG_MODE, debug } from './core.js';

// 启用调试
DEBUG_MODE = true;

// 输出调试信息
debug('这是调试信息', element, { data: 'extra' });
```

## 扩展指南

### 自定义组件

使用 DOMObserver 监听你的自定义组件：

```javascript
CastingDOMObserver.onAdd('my-component', '.my-component', (el) => {
  console.log('自定义组件被添加:', el);
  // 初始化你的组件
});
```

### 注册自定义主题

```javascript
const customTheme = {
  name: '我的主题',
  description: '自定义主题',
  colors: { /* 颜色配置 */ }
};

ui.themeManager.addTheme(customTheme);
ui.themeManager.applyTheme(customTheme);
```
