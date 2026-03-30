# DOM观察器 (DOM Observer)

## 版本信息
- **版本**: 0.5.0
- **模块文件**: `src/modules/js/dom-observer.js`
- **依赖模块**: `core.js`

## 概述

DOMObserver 是 Casting UI 框架的统一 DOM 变化监听模块，使用 MutationObserver 监测整个文档的 DOM 变化。它提供了一个集中式的 DOM 变化监听机制，避免多个模块重复创建 MutationObserver，从而优化性能并简化代码。

## 核心特性

- ✅ 统一的 DOM 变化监听，避免重复监听
- ✅ 支持两类事件：元素增加事件、元素移除事件
- ✅ 自动处理新增/移除元素及其所有子元素
- ✅ 使用 CSS 选择器匹配目标元素
- ✅ 错误处理，单个处理函数失败不影响其他
- ✅ 调试日志支持
- ✅ 全局单例模式
- ✅ 支持模块化导入和全局访问

## 设计目标

1. **避免重复监听**: 多个模块不再需要各自创建 MutationObserver
2. **统一管理**: 所有 DOM 变化监听集中在一个模块中
3. **简单易用**: 各模块只需注册自己的选择器和处理函数
4. **高性能**: 使用 Set 去重，避免重复处理同一元素

## 快速开始

### ES6 模块导入

```javascript
import { domObserver } from './modules/js/dom-observer.js';

// 注册元素增加事件
domObserver.onAdd('my-component', '.my-component', (element) => {
    console.log('组件被添加:', element);
    // 初始化组件...
});

// 注册元素移除事件
domObserver.onRemove('my-component', '.my-component', (element) => {
    console.log('组件被移除:', element);
    // 清理组件...
});
```

### 全局访问

```javascript
// 通过全局对象访问
const domObserver = window.CastingDOMObserver;

domObserver.onAdd('my-component', '.my-component', (element) => {
    // 处理...
});
```

## API 参考

### 全局实例

```javascript
// 导入使用
import { domObserver } from './dom-observer.js';

// 或全局访问
const domObserver = window.CastingDOMObserver;
```

### 方法

#### onAdd(key, selector, handler)

注册 DOM 元素增加事件。当匹配 selector 的元素被添加到页面时，会调用 handler 函数。

**参数:**
- `key` (string): 唯一标识，用于后续取消注册
- `selector` (string): CSS 选择器，用于匹配目标元素
- `handler` (Function): 处理函数，参数为匹配的元素

**示例:**
```javascript
domObserver.onAdd('menu-add', 'menu', (element) => {
    console.log('菜单被添加:', element);
    // 初始化菜单...
});
```

#### onRemove(key, selector, handler)

注册 DOM 元素移除事件。当匹配 selector 的元素从页面移除时，会调用 handler 函数。

**参数:**
- `key` (string): 唯一标识，用于后续取消注册
- `selector` (string): CSS 选择器，用于匹配目标元素
- `handler` (Function): 处理函数，参数为匹配的元素

**示例:**
```javascript
domObserver.onRemove('menu-remove', 'menu', (element) => {
    console.log('菜单被移除:', element);
    // 清理菜单...
});
```

#### off(key)

取消注册事件。同时取消增加事件和移除事件的注册。

**参数:**
- `key` (string): 要取消的事件标识

**示例:**
```javascript
// 取消之前注册的事件
domObserver.off('menu-add');
```

#### destroy()

销毁 DOM 观察器。停止观察，清空所有处理函数。

**示例:**
```javascript
// 销毁观察器（通常不需要手动调用）
domObserver.destroy();
```

## 使用示例

### 示例 1: 监听菜单变化

```javascript
import { domObserver } from './dom-observer.js';

// 监听菜单的添加
domObserver.onAdd('menu-monitor', 'menu', (menuElement) => {
    console.log('检测到新菜单:', menuElement.id);
    // 可以在这里做一些额外的初始化工作
});

// 监听菜单的移除
domObserver.onRemove('menu-monitor', 'menu', (menuElement) => {
    console.log('菜单被移除:', menuElement.id);
    // 可以在这里做一些清理工作
});
```

### 示例 2: 监听自定义组件

```javascript
import { domObserver } from './dom-observer.js';

// 监听自定义组件
domObserver.onAdd('custom-widget', '.custom-widget', (widget) => {
    // 自动初始化自定义组件
    widget.innerHTML = '<div class="widget-content">已初始化</div>';
    widget.dataset.initialized = 'true';
});

// 监听自定义组件移除
domObserver.onRemove('custom-widget', '.custom-widget', (widget) => {
    // 清理资源
    console.log('清理组件:', widget.id);
});
```

### 示例 3: 多个选择器

```javascript
import { domObserver } from './dom-observer.js';

// 监听多种元素
domObserver.onAdd('buttons', 'button', (btn) => {
    console.log('按钮被添加:', btn);
});

domObserver.onAdd('inputs', 'input', (input) => {
    console.log('输入框被添加:', input);
});
```

## 工作原理

### 1. 初始化

DOMObserver 在加载时自动创建 MutationObserver 实例，并开始观察 `document.body`。

### 2. 监听配置

```javascript
this.observer.observe(document.body, {
    childList: true,    // 监听子节点的添加/删除
    subtree: true,      // 监听所有后代节点的变化
    attributes: false,  // 不监听属性变化
    characterData: false // 不监听文本内容变化
});
```

### 3. 变化处理

当 DOM 发生变化时：
1. 收集所有新增元素及其子元素
2. 收集所有移除元素及其子元素
3. 遍历所有注册的处理函数
4. 检查元素是否匹配选择器
5. 匹配则调用对应的处理函数

### 4. 错误处理

每个处理函数都被 try-catch 包裹，单个处理函数失败不会影响其他处理函数的执行。

## 最佳实践

### 1. 使用有意义的 key

```javascript
// 推荐：使用描述性的 key
domObserver.onAdd('menu-initializer', 'menu', handler);

// 不推荐：使用模糊的 key
domObserver.onAdd('abc123', 'menu', handler);
```

### 2. 及时取消注册

如果你的模块不再需要监听，记得取消注册：

```javascript
// 组件卸载时
domObserver.off('my-component');
```

### 3. 选择器尽量具体

```javascript
// 推荐：使用具体的选择器
domObserver.onAdd('sidebar-menu', 'menu.menu-sidebar', handler);

// 不推荐：使用过于宽泛的选择器
domObserver.onAdd('all-elements', '*', handler);
```

### 4. 处理函数保持简洁

```javascript
// 推荐：处理函数只做一件事
domObserver.onAdd('my-component', '.my-component', (el) => {
    initComponent(el);
});

// 不推荐：处理函数过于复杂
domObserver.onAdd('my-component', '.my-component', (el) => {
    // 大量逻辑...
});
```

## 注意事项

1. **全局单例**: DOMObserver 是全局单例，不要重复创建实例
2. **选择器性能**: 避免使用过于复杂的 CSS 选择器
3. **处理函数性能**: 处理函数应尽量快速完成，避免阻塞
4. **内存管理**: 不再需要的事件要及时取消注册
5. **元素匹配**: 处理函数会被调用多次，注意去重
6. **错误处理**: 单个处理函数失败不会影响其他，但要注意错误日志

## 与其他模块集成

### 菜单模块集成示例

```javascript
// menu.js 中的使用方式
import { domObserver } from './dom-observer.js';

class MenuManager {
    init() {
        // ... 其他初始化代码 ...
        
        // 注册到统一 DOM 观察器
        this.registerObserver();
    }
    
    registerObserver() {
        // 注册菜单增加事件
        domObserver.onAdd('menu-add', 'menu', (element) => {
            if (this.isStandardMenu(element) && !this.isMenuBuilt(element)) {
                this.initMenu(element);
            }
        });

        // 注册菜单移除事件
        domObserver.onRemove('menu-remove', 'menu', (element) => {
            if (element.id) {
                this.destroyMenu(element.id);
            }
        });
    }
}
```

## 更新记录

### v0.5.0 (2026-03-30)
- 初始版本发布
- 实现统一的 DOM 变化监听
- 支持元素增加和移除事件
- 使用私有方法 #trigger 统一触发逻辑
- 支持 ES6 模块导入和全局访问
- 添加详细的中文注释
- 提供完整的 API 文档
