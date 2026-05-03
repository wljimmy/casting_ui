
# DOMObserver - DOM 观察者

DOMObserver 是 Casting UI 的核心模块，负责统一管理 DOM 变化监听，使用 MutationObserver 监测整个文档的 DOM 变化。

## 设计目标

- 避免多个模块重复创建 MutationObserver
- 统一管理所有 DOM 变化监听
- 各模块只需注册自己的选择器和处理函数

## 基本用法

### 引入模块

```javascript
import { domObserver } from './dom-observer.js';
```

或者直接使用全局对象：

```javascript
window.CastingDOMObserver
```

### 注册添加事件

当匹配选择器的元素被添加到 DOM 中时触发：

```javascript
domObserver.onAdd('my-key', '.my-element', (el) => {
  console.log('元素被添加:', el);
  // 在这里初始化你的组件
});
```

### 注册移除事件

当匹配选择器的元素从 DOM 中移除时触发：

```javascript
domObserver.onRemove('my-key', '.my-element', (el) => {
  console.log('元素被移除:', el);
  // 在这里清理你的组件
});
```

### 取消注册

同时取消增加事件和移除事件的注册：

```javascript
domObserver.off('my-key');
```

### 销毁观察器

停止观察，清空所有处理函数：

```javascript
domObserver.destroy();
```

## 完整示例

```javascript
// 导入 DOMObserver
import { domObserver } from './dom-observer.js';

// 定义组件初始化函数
function initMyComponent(el) {
  el.innerHTML = '组件已初始化';
  console.log('组件初始化:', el);
}

// 定义组件清理函数
function destroyMyComponent(el) {
  console.log('组件清理:', el);
}

// 注册添加事件
domObserver.onAdd('my-component', '.my-component', (el) => {
  initMyComponent(el);
});

// 注册移除事件
domObserver.onRemove('my-component', '.my-component', (el) => {
  destroyMyComponent(el);
});

// 动态添加元素（会触发 onAdd）
const newEl = document.createElement('div');
newEl.className = 'my-component';
document.body.appendChild(newEl);

// 一段时间后移除元素（会触发 onRemove）
setTimeout(() => {
  newEl.remove();
  
  // 取消注册
  domObserver.off('my-component');
}, 5000);
```

## API 参考

### onAdd(key, selector, handler)

注册 DOM 元素增加事件。

| 参数 | 类型 | 描述 |
|------|------|------|
| key | string | 唯一标识，用于后续取消注册 |
| selector | string | CSS 选择器，用于匹配目标元素 |
| handler | Function | 处理函数，参数为匹配的元素 |

### onRemove(key, selector, handler)

注册 DOM 元素移除事件。

| 参数 | 类型 | 描述 |
|------|------|------|
| key | string | 唯一标识，用于后续取消注册 |
| selector | string | CSS 选择器，用于匹配目标元素 |
| handler | Function | 处理函数，参数为匹配的元素 |

### off(key)

取消注册事件。

| 参数 | 类型 | 描述 |
|------|------|------|
| key | string | 要取消的事件标识 |

### destroy()

销毁 DOM 观察器，停止观察，清空所有处理函数。

## 内部工作原理

DOMObserver 使用 MutationObserver 监听 `document.body` 的变化：

```javascript
// 观察选项
{
  childList: true,    // 监听子节点的添加/删除
  subtree: true,      // 监听所有后代节点的变化
  attributes: false,  // 不监听属性变化
  characterData: false // 不监听文本内容变化
}
```

当 DOM 变化时，会：

1. 收集所有新增的元素及其后代
2. 收集所有被移除的元素及其后代
3. 对每个元素检查是否匹配注册的选择器
4. 如果匹配，调用对应的处理函数

## 最佳实践

1. **使用有意义的 key**：key 应该能描述你要做什么，例如 `'menu-init'` 或 `'input-register'`

2. **及时清理**：当不再需要监听时，调用 `off()` 取消注册，避免内存泄漏

3. **处理函数要简单**：处理函数应该快速执行，避免阻塞

4. **错误处理**：处理函数内部应该有 try-catch，避免一个组件出错影响其他组件

```javascript
domObserver.onAdd('my-component', '.my-component', (el) => {
  try {
    initMyComponent(el);
  } catch (error) {
    console.error('初始化组件失败:', error);
  }
});
```

## 实际项目中的应用

### 菜单组件

```javascript
domObserver.onAdd('menu', 'menu', (el) => {
  initMenu(el);
});
```

### 输入框注册

```javascript
domObserver.onAdd('input-registry', 'input,textarea,select', (el) => {
  if (el.matches('input,textarea,select') && el.name) {
    processInput(el);
  }
});
```

### 表单处理

```javascript
domObserver.onAdd('form-processor', 'form.CUI-form', (el) => {
  if (!processedForms.has(el)) {
    processedForms.add(el);
    processForm(el);
  }
});
```
