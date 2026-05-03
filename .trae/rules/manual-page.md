# 手册页通用规则

## 1. 目录结构
```
public/manual/分类目录/模块名-container/index.html
```

## 2. HTML结构要求

页面可以仅有body标签，但必须确保能正确解析。完整的HTML结构（DOCTYPE、html、head、body）可确保更好的兼容性。

**最外层容器**：必须使用 `CUI-section`

## 3. 框架样式使用

**必须使用的框架类**：最外层容器使用 `CUI-section`

**建议使用的框架类**（可根据功能需求选择）：
- 布局：网格系统、弹性布局、间距控制
- 组件：按钮、输入框、卡片、徽章
- 文字：字号、颜色、对齐
- 背景：背景色设置

## 4. 框架功能使用

使用框架提供的 `CastingDOMObserver` 管理DOM事件监听，避免直接使用addEventListener。

## 5. 禁止事项
- 不使用内嵌 `<style>` 编写自定义样式
- 不使用内联事件监听（如 `onclick`），使用框架提供的DOMObserver
- 避免覆盖框架CSS变量
