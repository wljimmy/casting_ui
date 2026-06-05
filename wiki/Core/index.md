
# 核心模块

Casting UI 的核心功能模块文档。

## 核心模块列表

| 模块 | 描述 |
|------|------|
| [LifecycleScheduler](./LifecycleScheduler.md) | 生命周期调度器，提供 Pipeline 分阶段时序调度与沙箱级联防雪崩隔离机制 |
| [DOMObserver](./DOMObserver.md) | DOM 变化观察者，自动监听和初始化组件 |
| [ColorPicker](./ColorPicker.md) | 颜色选择器，支持多种颜色格式 |
| [ThemeManager](./ThemeManager.md) | 主题管理器，支持主题切换和自定义主题 |

## 核心架构

### 模块依赖图 (DAG 拓扑结构)

```
       [scheduler] (时序与容灾引擎)
            │
         [core] (最底座 API 支持)
      ┌─────┼──────────────┐
      ▼     ▼              ▼
[overlay] [input]  [imageZoom] (依赖 core)
      │     │
      ▼     ▼
  [modal] [colorPicker] (依赖 core, overlay)
      │     │
      ▼     ▼
     [ui] (依赖 core, colorPicker, modal)
```

### 初始化流程 (Pipeline Flow)

1. 加载 `scheduler.js` 准备全局注册 API。
2. 异步并行加载所有业务 ES 模块，通过 `registerModule` 进行登记。
3. 并行下载完成后，触发运行 `scheduler.runPipeline()` 驱动生命周期流转。
4. Pipeline 逐个推进阶段：`ENV` ➔ `CORE` ➔ `DOM_REGISTRY` ➔ `INTERACTION` ➔ `READY`。
5. 在每次执行每个模块的钩子前，动态进行**上游依赖健康校验**与**级联停运隔离**保护。

## 模块设计原则

### 1. 独立可扩展
每个核心模块都是独立的，可以单独使用或扩展。

### 2. 事件驱动
使用事件机制解耦模块间通信。

### 3. Promise 支持
异步操作使用 Promise，便于 async/await 使用。

## 核心概念

### DOM 观察者模式
DOMObserver 使用 MutationObserver 监听 DOM 变化，自动检测和初始化组件。

```javascript
// 当元素被添加时自动初始化
CastingDOMObserver.onAdd('my-component', '.my-component', (el) => {
  initMyComponent(el);
});
```

### 命名空间隔离
所有框架功能挂载在 `window.CUI` 和相关命名空间下，避免冲突。

```javascript
window.CUI = {
  input: {...},
  message: {...},
  modal: {...},
  // ...
};
```

### 数据持久化
主题等数据使用 localStorage 持久化存储。

## 使用核心模块

### 方式一：直接使用全局对象

```javascript
// DOMObserver
window.CastingDOMObserver.onAdd(...)

// ColorPicker
window.openColorPicker(...)

// ThemeManager
window.openThemeSelector(...)
```

### 方式二：ES6 模块导入

```javascript
import { domObserver } from './dom-observer.js';
import { openColorPicker } from './color-picker.js';
import { ThemeManager } from './theme-manager.js';
```

## 扩展核心模块

### 自定义 DOMObserver 处理器

```javascript
// 注册你自己的组件初始化逻辑
CastingDOMObserver.onAdd('my-widget', '.my-widget', (el) => {
  const widget = new MyWidget(el);
  widget.init();
});
```

### 自定义主题

```javascript
const themeManager = new ThemeManager();
const myTheme = {
  name: '我的主题',
  description: '自定义主题',
  colors: { /* 颜色配置 */ }
};
themeManager.addTheme(myTheme);
```

## 更多资源

- [API 文档](../API/index.md) - 完整的 API 参考
- [组件文档](../Components/) - 组件使用指南
- [设计理念](../Design-Philosophy.md) - 深入理解框架设计
- [快速入门](../Getting-Started.md) - 快速上手指南
