# 框架设计逻辑说明

## 核心设计理念
极简化用户使用成本，贴合原生网页开发习惯。用户只需：
- 用基础HTML标签划定容器
- 使用data-*属性配置扩展功能

框架自动完成：样式渲染、组件生成、交互绑定。

## 用户使用规则
1. **基础容器** - 仅用原生HTML标签
2. **层级结构** - 纯原生标签搭建
3. **扩展配置** - 仅用data-*属性
4. **动态元素** - 由JS运行时生成

## 示例：菜单组件
```html
<menu>
  <ul>
    <li data-icon="home">首页</li>
    <li data-badge="new">新功能</li>
  </ul>
</menu>
```
用户只需写原生结构，JS自动渲染图标和徽章。

## 代码修整原则
1. 样式/DOM/交互收敛至框架
2. data-*为唯一配置入口
3. 动态元素仅运行时生成
4. 零学习成本，符合原生习惯

## 事件绑定规则
1. **框架职责** - 标准交互（如颜色选择器、表单验证）通过DOMObserver + 事件委托统一绑定
2. **用户职责** - 自定义业务逻辑（如按钮点击）由用户自行处理
3. **事件委托优先** - 避免直接绑定到每个元素，使用事件委托模式
4. **自动处理动态元素** - DOMObserver自动检测新增元素并绑定行为
5. **隔离性** - 框架的DOMObserver与用户代码完全独立，互不干扰

## 事件绑定示例
框架标准交互（颜色选择器）：
```javascript
// 框架通过事件委托统一处理
document.addEventListener('click', (event) => {
    const colorWrapper = event.target.closest('.CUI-input-color');
    if (colorWrapper) {
        // 处理颜色选择逻辑
    }
});
```

用户自定义交互（按钮点击）：
```javascript
// 用户自行绑定业务逻辑
document.querySelector('#myBtn').addEventListener('click', () => {
    // 用户的业务逻辑
});
```

## 生命周期与依赖隔离规则 (Lifecycle & Dependencies)
1. **模块非侵入式声明**：严禁在文件顶层执行有立即副作用的匿名初始化代码（如立即绑定 DOMObserver 或重置 `window.CUI`）。所有功能必须通过 `window.CUI.registerModule` 注册。
2. **时序阶段分配**：
   - `ENV`：嗅探宿主环境。
   - `CORE`：释放核心 API（如内核底层对象、工具类等）。
   - `DOM_REGISTRY`：美化静态 DOM，注册 DOMObserver 行为。
   - `INTERACTION`：绑定全局委托交互。
   - `READY`：运行整个系统的完全就绪逻辑。
3. **级联依赖声明（防雪崩）**：
   - 若模块 A 的执行依赖模块 B 导出的 API 变量，模块 A 的注册配置中**必须**显式指定 `dependencies: ['B']`。
   - 在各文件头部必须以 JSDoc 显式写明：`* @dependency: B, C`。
4. **防覆盖安全性**：
   - 绝不允许对 `window.CUI` 进行粗暴的洗劫式覆盖赋值（如直接 `window.CUI = new Class()`），必须使用 `Object.assign(newInstance, window.CUI || {})` 进行安全合并以防其他已加载模块被抹除。
