# Core CSS 技术文档

## 模块信息
- **版本**: v0.3.0
- **文件**: `src/modules/css/core.css`
- **描述**: 核心样式模块，提供CSS变量定义和基础样式重置

## 概述

Core CSS 是 Casting UI 框架的基础样式模块，定义了所有CSS变量和基础样式重置。所有其他CSS模块都依赖这些变量来保持视觉一致性。

## CSS变量

### 主色系

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--primary-color` | #222021 | 主色调（墨黑色） |
| `--primary-hover` | #171617 | 主色悬停态 |
| `--primary-active` | #0C0C0C | 主色激活态 |

### 中性灰阶

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--gray-100` | #F7F5F6 | 最浅灰 |
| `--gray-200` | #E9E5E7 | 浅灰 |
| `--gray-300` | #D1C9CD | 中灰 |
| `--gray-400` | #B0A6AB | 深灰 |
| `--gray-500` | #8F8389 | 更深灰 |
| `--gray-600` | #6E646A | 深灰 |
| `--gray-700` | #4D454A | 最深灰 |

### 功能色

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--success-color` | #66BB6A | 成功状态 |
| `--warning-color` | #FFA726 | 警告状态 |
| `--error-color` | #C2185B | 错误状态（酒红色） |
| `--info-color` | #7986CB | 信息状态 |

### 背景色

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--bg-color` | #FAFAFA | 主背景色 |
| `--bg-gray` | #F7F5F6 | 灰色背景 |

### 边框色

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--border-color` | #E9E5E7 | 默认边框 |
| `--border-hover` | #D1C9CD | 悬停边框 |

### 文本色

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--text-primary` | #222021 | 主要文本 |
| `--text-secondary` | #6E646A | 次要文本 |
| `--text-light` | #8F8389 | 辅助文本 |
| `--text-disabled` | #B0A6AB | 禁用文本 |

### 字体

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--font-serif` | "Noto Serif SC", ... | 衬线字体（标题） |
| `--font-sans` | -apple-system, ... | 无衬线字体（正文） |
| `--font-mono` | "SF Mono", ... | 等宽字体（代码） |
| `--font-weight-body` | 400 | 正文粗细 |
| `--font-weight-title` | 900 | 标题粗细 |
| `--font-size-body` | 14px | 正文字号 |
| `--font-size-title` | 20px | 标题字号 |

### 尺寸

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--size-xs` | 4px | 超小尺寸 |
| `--size-sm` | 8px | 小尺寸 |
| `--size-md` | 16px | 中尺寸 |
| `--size-lg` | 24px | 大尺寸 |
| `--size-xl` | 32px | 超大尺寸 |

### 圆角

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--radius-sm` | 4px | 小圆角 |
| `--radius-md` | 8px | 中圆角 |
| `--radius-lg` | 12px | 大圆角 |
| `--radius-full` | 9999px | 全圆角 |

### 阴影

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--shadow-sm` | 0 2px 4px rgba(...) | 小阴影 |
| `--shadow-md` | 0 4px 12px rgba(...) | 中阴影 |
| `--shadow-lg` | 0 8px 24px rgba(...) | 大阴影 |

### 过渡

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--transition-fast` | 0.15s ease | 快速过渡 |
| `--transition-normal` | 0.3s ease | 正常过渡 |
| `--transition-slow` | 0.5s ease | 慢速过渡 |

### 布局变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--main-padding` | 20px | 主内容区内边距 |
| `--web-header-height` | 120px | 网页布局头部高度 |
| `--web-footer-height` | 50px | 网页布局底部高度 |
| `--web-sidebar-left-width` | 200px | 网页布局左侧边栏宽度 |
| `--web-sidebar-right-width` | 200px | 网页布局右侧边栏宽度 |
| `--web-main-max-width` | 1000px | 网页布局主内容区最大宽度 |
| `--shell-header-height` | 60px | 应用壳布局头部高度 |
| `--shell-footer-height` | 50px | 应用壳布局底部高度 |
| `--shell-sidebar-left-width` | 220px | 应用壳布局左侧边栏宽度 |
| `--shell-sidebar-right-width` | 220px | 应用壳布局右侧边栏宽度 |

## 基础样式

### 重置样式

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

### 列表样式

- `ul, ol`: 左外边距24px，下外边距16px
- `li`: 下外边距4px
- 嵌套列表: 额外左外边距16px

### 正文样式

```css
body {
    font-family: var(--font-serif);
    font-size: var(--font-size-body);
    font-weight: var(--font-weight-body);
    line-height: 1.8;
    letter-spacing: 0.8px;
    color: #333;
    background-color: var(--bg-gray);
}
```

### 标题样式

- 字体: `--font-serif`
- 行高: 1
- 字间距: 1px
- 颜色: `--primary-color`
- 上外边距: 24px
- 下外边距: 16px

## 使用示例

### 使用CSS变量

```css
.my-component {
    background-color: var(--bg-color);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--size-md);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
}

.my-component:hover {
    border-color: var(--border-hover);
    box-shadow: var(--shadow-md);
}
```

### 响应式字体

```css
.responsive-text {
    font-size: var(--font-size-body);
    font-weight: var(--font-weight-body);
    line-height: 1.8;
}

@media (max-width: 768px) {
    .responsive-text {
        font-size: calc(var(--font-size-body) * 0.9);
    }
}
```

## 注意事项

1. **变量覆盖**: 可以通过在 `:root` 中重新定义变量来覆盖默认值
2. **主题切换**: 通过 JavaScript 修改 CSS 变量实现主题切换
3. **继承关系**: 子元素会自动继承父元素的 CSS 变量
4. **性能**: CSS 变量在渲染时计算，避免在关键路径频繁修改

## 更新记录

### v0.3.0 (2026-04-03)
- 更新默认主题为墨黑酒红配色
- 添加布局相关CSS变量
- 优化字体栈配置
