
# 设计理念

Casting UI 框架的核心设计理念可以用一句话概括：**像写 Markdown 一样写 HTML**。

---

## 设计原则

### 1. 极简用户 API

用户只需要做最简单的事情：

- 使用标准 HTML 标签
- 通过 `data-*` 属性配置
- 不需要学习复杂的组件语法

```html
<!-- 用户只需要写这个 -->
<menu>
  <ul>
    <li data-icon="home">首页</li>
  </ul>
</menu>
```

框架自动处理：
- 渲染图标
- 绑定事件
- 处理交互
- 管理状态

### 2. 原生兼容

框架完全基于标准技术：

- **HTML5**：语义化标签
- **CSS3**：变量、Flexbox、Grid、动画
- **JavaScript ES6+**：模块化、类、异步

不依赖：
- 任何前端框架（React/Vue/Angular）
- 任何构建工具（Webpack/Vite/Rollup）
- 任何编译器（TypeScript/Sass）

### 3. 渐进式增强

- **基础功能**：CSS 即可实现
- **进阶功能**：JS 增强
- **不干扰正常页面**：即使 JS 禁用，页面仍能正常显示

### 4. 模块化设计

每个模块独立：

```
src/modules/
├── css/
│   ├── core.css       # 核心样式
│   ├── container.css  # 容器
│   ├── layout.css     # 布局
│   ├── menu.css       # 菜单
│   └── ...
└── js/
    ├── core.js        # 核心功能
    ├── dom-observer.js# DOM 监听
    ├── menu.js        # 菜单
    └── ...
```

### 5. 内存安全

- 自动初始化
- 自动销毁
- DOMObserver 监听
- 无内存泄漏

---

## 核心概念

### 1. data-* 驱动

所有配置都通过 `data-*` 属性完成：

```html
<!-- 进度条 -->
<div class="CUI-progress"
     data-value="50"
     data-type="label striped animated"
     data-color="#1890ff">
</div>

<!-- 菜单项 -->
<li data-icon="home"
    data-badge="new"
    data-default="true"
    data-action='{"callback": "onClick"}'>
  首页
</li>
```

### 2. DOMObserver 自动监听

框架使用 DOMObserver 自动处理：

```javascript
// 监听元素添加
domObserver.onAdd('menu', 'menu', (el) => {
  initMenu(el);
});

// 监听元素移除
domObserver.onRemove('menu', 'menu', (el) => {
  destroyMenu(el.id);
});
```

### 3. 命名空间隔离

所有框架变量都在 `window.CUI` 下：

```javascript
window.CUI = {
  DEBUG_MODE,
  debug,
  createOverlay,
  showOverlay,
  hideOverlay,
  PopupBase,
  Progress,
  // ...
};

// 菜单另有独立命名空间
window.CastingMenu = { ... };
window.CastingMenuManager = menuManager;
```

### 4. 实例管理

每个组件都有实例管理器：

```javascript
class MenuManager {
  constructor() {
    this.instances = new Map();  // 存储所有实例
  }
  
  initMenu(el) { ... }      // 初始化
  destroyMenu(id) { ... }   // 销毁
  getInstance(id) { ... }   // 获取
}
```

---

## 文件组织原则

### 1. 源码与发布分离

- **src/**：开发阶段的源码，模块化
- **dist/**：发布阶段的合并文件

### 2. 手册与示例分离

- **public/manual/**：用户手册（加载到示例页）
- **src/examples/**：功能示例
- **test/**：独立测试页面

### 3. 文档同步更新

- 模块更新 → API 文档同步更新
- 功能修改 → 手册同步修改
- 版本升级 → 所有相关文档同步更新

---

## 样式设计原则

### 1. CSS 变量优先

使用 CSS 变量管理所有可配置项：

```css
:root {
  /* 颜色 */
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  
  /* 尺寸 */
  --size-xs: 4px;
  --size-sm: 8px;
  --size-md: 16px;
  --size-lg: 24px;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* 阴影 */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### 2. 类名命名规范

所有框架CSS类均使用 `CUI-` 前缀，作为框架保留名，确保与用户自定义类名不产生冲突：

- **容器类**：`CUI-` 前缀（如 `CUI-box`、`CUI-card`）
- **组件类**：`CUI-` 前缀（如 `CUI-menu-sidebar`、`CUI-badge`）
- **状态类**：`CUI-` 前缀（如 `CUI-menu-active`、`CUI-menu-hidden`）

**命名规则：**
- 使用小写字母
- 单词之间用连字符 `-` 分隔
- 组件名 + 功能/状态描述（如 `CUI-menu-active`、`CUI-btn-primary`）

### 3. 样式分层

```css
/* 1. CSS 变量 */
:root { ... }

/* 2. 基础样式重置 */
* { ... }

/* 3. 布局样式 */
.CUI-grid { ... }

/* 4. 组件样式 */
.menu-sidebar { ... }

/* 5. 响应式样式 */
@media (max-width: 768px) { ... }
```

---

## JavaScript 设计原则

### 1. 模块化

每个模块独立导出：

```javascript
// core.js
export { DEBUG_MODE, debug, createOverlay, ... };

// 同时暴露到全局
if (!window.CUI) window.CUI = {};
window.CUI.DEBUG_MODE = DEBUG_MODE;
```

### 2. 面向对象

使用类封装复杂组件：

```javascript
class MenuInstance {
  constructor(element, id) {
    this.element = element;
    this.id = id;
    this.eventListeners = [];
  }
  
  init() { ... }
  destroy() { ... }
  setActive(el) { ... }
}
```

### 3. 事件清理

所有添加的事件监听器都要记录并在销毁时移除：

```javascript
// 添加时记录
addEventListener(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  this.eventListeners.push({ target, event, handler, options });
}

// 销毁时移除
destroy() {
  this.eventListeners.forEach(listener => {
    listener.target.removeEventListener(
      listener.event,
      listener.handler,
      listener.options
    );
  });
}
```

### 4. 异步友好

使用 Promise 处理异步操作：

```javascript
showModal(options) {
  return new Promise((resolve, reject) => {
    // 创建弹窗
    // 用户点击按钮时 resolve
    // 关闭时 resolve { status: 'closed' }
  });
}
```

---

## 开发与发布打包哲学

### 1. 本地开发：Vite 仅用于预览与调试

Casting UI 是一个面向长周期高扩展性的开发项目。在日常开发与 1.0 正式版出炉前的漫长迭代期内：
- **完全保持 ES Module 原生形态**：各子模块独立开发调试，杜绝任何自动构建和打包，这赋予了框架极速的热更新体验与极简的新增模块流程。
- **Vite 职责仅限于**：
  - 本地预览服务运行；
  - 动态模块热替换（HMR）；
  - 手册页/测试页实时展现。

### 2. 发布与交付：严格控制的“手动合并打包”

为了提供给最终终端用户“零心智负担、极简引入”的极致体验，框架的发布遵循**大版本手动打包**原则：
- **目标交付物**：在 1.0 正式版或里程碑大版本发布时，最终只交付两个极简产物文件：
  - 一个统一打包合并的 `Casting.js`（包含全部的核心模块、调度器和组件逻辑）。
  - 一个统一打包合并的 `Casting.css`（包含全部的基础与组件样式）。
- **人工完全掌控**：打包与合并是一项审慎的发布仪式，由开发者在准备发布里程碑时**人工手动触发并完全控制打包过程**。
- **无自动化干扰**：杜绝加入任何在保存、Git 提交时自动运行的构建流程，这保证了本地开发环境在日常协作中始终维持纯净、高效的解耦调试体验。

### 3. 版本管理

- 保证主版本号的一致性与发布节奏。
- 在打包归档区（`dist/`）按版本号进行双文件发布保存。

---

## 为什么这样设计？

### 1. 降低学习成本

不需要学习：
- 复杂的框架语法
- 构建工具配置
- 新概念和术语

只需要：
- HTML 基础
- CSS 基础
- JS 基础

### 2. 提高可靠性

- 原生技术久经考验
- 减少依赖链
- 容易调试

### 3. 保持灵活

- 可以与任何框架混合使用
- 可以按需加载模块
- 可以轻松扩展功能

### 4. 面向未来

- Web 标准演进
- 原生功能越来越强
- 不需要为了框架而重写

---

## 总结

Casting UI 不是另一个前端框架，而是一套**原生增强库**。

它的目标是：
- 让简单的事情保持简单
- 让复杂的事情可以实现
- 不引入额外的复杂度
- 尊重用户的技术选择

> "任何优秀的库都应该让你感觉不到它的存在。"
