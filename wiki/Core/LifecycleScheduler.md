# LifecycleScheduler - 生命周期调度器与沙箱强隔离引擎

`LifecycleScheduler` 是 Casting UI 的核心架构引擎，负责统一控制功能模块的分阶段时序加载，并构建了完善的**沙箱强隔离**与**运行时级联防雪崩防灾机制**。

该机制解决了原生 ESM 异步加载中的全局竞态冲突，实现了微秒级故障追踪，并提供开发期极度友好的 Debug 错误强提示。

---

## 🛠️ 设计目标

1. **时序控制**：确保组件按依赖关系串行或并行加载，杜绝覆盖风险与竞态漏洞。
2. **沙箱故障隔离**：任何子模块崩溃，被安全捕获并实施强隔离，绝不影响其他正常模块（防雪崩）。
3. **级联隔离（Cascade Dependency Isolation）**：自动分析模块依赖图，当上游模块损坏时级联停运所有直接/间接下游模块，彻底避免“次生嵌套崩溃（Crash in Crash）”。
4. **开发极速诊断**：在 `DEBUG_MODE` 下自动弹出可视化 alert 并输出极其丰富的彩色控制台诊断数据。

---

## 📅 生命周期五大阶段 (Pipeline Stages)

调度器严格按照以下时序顺序推进，每个模块可以注册其中的一个或多个阶段：

```
  [ENV] ➔ 嗅探宿主浏览器环境，初始化内存参数与特性侦测
    │
  [CORE] ➔ 初始化 DOMObserver，注入全局核心基类与最底层工具库 (如 core, overlay)
    │
[DOM_REGISTRY] ➔ 扫描静态 HTML 节点，美化原生 DOM (如 input, form, imageZoom)
    │
[INTERACTION] ➔ 绑定全局动态交互、事件代理和手势侦察
    │
  [READY] ➔ 实例化整个 UI 系统，释放全局终极 API，系统就绪 (如 ui.js)
```

---

## ✍️ 开发者用法指南

在编写任何新模块或重构已有模块时，**严禁使用文件顶层匿名副作用函数立即初始化**。必须通过向调度器声明式注册来融入系统：

### 1. 注册功能模块与生命周期钩子

在模块定义下方，使用 `window.CUI.registerModule(name, config)` 进行注册：

```javascript
import { debug } from './core.js';

// 声明模块 API
function openMyFeature() {
    debug('打开自定义功能');
    // 你的业务代码...
}

// 保证全局命名空间存在
window.CUI = window.CUI || {};

// 1. 头部注释标明依赖规范 (对人)
/**
 * @dependency: core, overlay
 */

// 2. 注册模块到调度器 (对机)
window.CUI.registerModule('myFeature', {
    // 声明上游依赖：若 core 或 overlay 崩溃，本模块自动级联停运，防止嵌套报错
    dependencies: ['core', 'overlay'],
    
    stages: {
        // 在 CORE 阶段挂载到全局 API 树上，确保在后面 DOM_REGISTRY 时随时可用
        CORE: () => {
            window.CUI.openMyFeature = openMyFeature;
        },
        
        // 在 DOM_REGISTRY 阶段自动处理静态 DOM 或绑定监听
        DOM_REGISTRY: () => {
            console.log('自动扫描页面上具有 data-cui-feature 的自定义节点');
        }
    }
});
```

---

## 🛡️ 容灾与隔离工作原理

### 1. 沙箱隔离运行
当 Pipeline 逐个阶段遍历模块的钩子时，全部使用 `try...catch` 进行沙箱保护：

```javascript
try {
    module.status = `running_${stage}`;
    await hook();
    module.status = `completed_${stage}`;
} catch (error) {
    this.handleModuleError(name, stage, error);
}
```
被捕获的故障模块将立即归入 `failedModules` 黑名单，后续阶段不再调用其任何钩子。

### 2. 运行时级联依赖拦截
在执行钩子前，调度器自动校验 `dependencies`：

```javascript
const deps = module.config.dependencies || [];
const brokenDep = deps.find(dep => this.failedModules.has(dep));
if (brokenDep) {
    this.failedModules.add(name);
    module.status = 'failed_cascade';
    console.warn(`[CUI Scheduler 级联隔离] 模块 "${name}" 已被安全停运！原因：依赖的上游 "${brokenDep}" 损坏。`);
    continue;
}
```

### 3. 可视化友好 Debug 提示
如果 `window.CUI.DEBUG_MODE` 为 `true`，一旦崩溃，调度器将在屏幕中直接抛出强震慑警报框：

```
【Casting UI 运行期错误警报】
────────────────────
● 故障模块: imageZoom
● 崩溃阶段: DOM_REGISTRY
● 错误原因: Simulated imageZoom Failure

⚠️ 该模块已实施【强隔离沙箱处理】，其他健康模块将继续运行。
请打开浏览器控制台(Console)排查具体的代码行号与堆栈。
```

---

## 🌟 最佳实践与避坑指南

1. **无顶层自执行逻辑**：除了 `import` 和类/函数定义，文件最外层不应该有任何立即修改 DOM 或读写全局变量的副作用。必须写在对应的阶段钩子里。
2. **正确区分依赖**：如果你的模块里使用了 `window.CUI.showModal` 或 `window.CUI.overlay`，请在 `dependencies` 中写上 `['core', 'overlay', 'modal']`。
3. **安全合并命名空间**：如果编写的模块是对 `window.CUI` 赋值实例（例如初始化核心 UI 控制类时），**绝对不可**直接进行洗劫式重置（`window.CUI = new UI()`），必须采用安全的合并手段：
   ```javascript
   const oldCUI = window.CUI || {};
   const uiInstance = new UI();
   Object.assign(uiInstance, oldCUI);
   window.CUI = uiInstance;
   ```
