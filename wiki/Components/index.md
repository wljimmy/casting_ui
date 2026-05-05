
# 组件文档

欢迎浏览 Casting UI 的所有组件文档！

## 组件分类

### 基础布局
- [基础布局](./Basic-Layout.md) - 容器、按钮、卡片、网格布局

### 数据展示
- [数据展示](./Data-Display.md) - 进度条、徽章、状态栏

### 表单组件
- [表单组件](./Form.md) - 输入框、表单、选择器

### 文本组件
- [文本组件](./Text.md) - 标题、文本样式、字体

### 反馈组件
- [反馈组件](./Feedback.md) - Toast、Modal、Loading

### 菜单组件
- [菜单组件](./Menu.md) - 导航菜单、侧边栏

## 快速参考

### 所有组件列表

| 组件 | 文档 | 示例 |
|------|------|------|
| **容器** | [Basic-Layout](./Basic-Layout.md) | [手册](../../public/manual/basic-layout/) |
| **按钮** | [Basic-Layout](./Basic-Layout.md) | [手册](../../public/manual/basic-layout/button-container/) |
| **卡片** | [Basic-Layout](./Basic-Layout.md) | [手册](../../public/manual/basic-layout/card-container/) |
| **进度条** | [Data-Display](./Data-Display.md) | [手册](../../public/manual/data-display/progress-container/) |
| **徽章** | [Data-Display](./Data-Display.md) | [手册](../../public/manual/data-display/badge-container/) |
| **状态栏** | [Data-Display](./Data-Display.md) | [手册](../../public/manual/data-display/status-container/) |
| **表单** | [Form](./Form.md) | [手册](../../public/manual/form-components/) |
| **输入框** | [Form](./Form.md) | [手册](../../public/manual/form-components/input-container/) |
| **表单布局** | [Form](./Form.md) | [手册](../../public/manual/form-components/form-container/) |
| **文本** | [Text](./Text.md) | [手册](../../public/manual/general-ui/text-container/) |
| **Toast** | [Feedback](./Feedback.md) | [手册](../../public/manual/feedback-components/toast-container/) |
| **Modal** | [Feedback](./Feedback.md) | [手册](../../public/manual/feedback-components/modal-container-1/) |
| **菜单** | [Menu](./Menu.md) | - |

## 组件使用原则

### 1. 使用标准 HTML
所有组件都基于原生 HTML 标签，不需要自定义标签。

```html
<!-- 正确 -->
<menu>
  <ul>
    <li>菜单项</li>
  </ul>
</menu>

<!-- 不需要这样 -->
<CastingMenu></CastingMenu>
```

### 2. 通过 data-* 配置
使用标准的 data 属性配置组件行为。

```html
<li data-icon="home" data-badge="new">首页</li>
<input type="text" data-label="用户名" />
```

### 3. 使用 CSS 类
添加相应的 CSS 类启用组件样式。

```html
<div class="CUI-card">卡片内容</div>
<button class="btn btn-primary">按钮</button>
```

## 组件使用流程

1. **引入框架** - 引入 CSS 和 JavaScript
2. **编写 HTML** - 使用标准 HTML 标签和类
3. **配置属性** - 添加 data-* 属性
4. **自动初始化** - 框架自动检测并初始化

## 最佳实践

### 组件命名
- 使用语义化的 HTML 标签
- 遵循框架的 CSS 类命名规范
- 使用描述性的 data 属性

### 性能优化
- 合理使用 CUI-grid 网格布局
- 避免过度嵌套组件
- 使用 CSS 变量进行主题定制

### 可访问性
- 确保键盘导航可用
- 添加适当的 ARIA 属性
- 保持足够的颜色对比度

## 更多资源

- [API 文档](../API/index.md) - 完整的 API 参考
- [核心模块](../Core/) - 框架核心功能文档
- [设计理念](../Design-Philosophy.md) - 深入理解框架设计
- [快速入门](../Getting-Started.md) - 快速上手指南
- [手册页面](../../public/manual/) - 交互式组件手册
