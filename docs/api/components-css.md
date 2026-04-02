# Components CSS 技术文档

## 模块信息
- **版本**: v0.3.0
- **文件**: `src/modules/css/components.css`
- **描述**: 通用组件样式模块，提供按钮、表单、表格等组件样式

## 概述

Components CSS 提供了一套完整的UI组件样式，包括按钮、表单控件、表格、代码块等常用组件。所有样式基于 CSS 变量，支持主题切换。

## 按钮组件

### 基础按钮 (.btn)

```html
<button class="btn">默认按钮</button>
```

**样式特性**:
- 内边距: 8px 16px
- 边框: 1px solid `--border-color`
- 圆角: `--radius-md` (8px)
- 背景: `--bg-color`
- 过渡: `--transition-normal`

### 按钮变体

| 类名 | 说明 | 样式 |
|------|------|------|
| `.btn-primary` | 主按钮 | 主色背景，白色文字 |
| `.btn-secondary` | 次要按钮 | 灰色背景 |
| `.btn-success` | 成功按钮 | 绿色背景 |
| `.btn-warning` | 警告按钮 | 橙色背景 |
| `.btn-error` | 错误按钮 | 红色背景 |
| `.btn-ghost` | 幽灵按钮 | 透明背景，边框 |
| `.btn-link` | 链接按钮 | 无背景，文字样式 |

### 按钮尺寸

| 类名 | 说明 |
|------|------|
| `.btn-xs` | 超小按钮 |
| `.btn-sm` | 小按钮 |
| `.btn-lg` | 大按钮 |

### 按钮状态

- `:hover`: 悬停状态
- `:active`: 激活状态
- `:disabled`: 禁用状态
- `.loading`: 加载状态

## 表单组件

### 输入框 (.input)

```html
<input type="text" class="input" placeholder="请输入">
```

**样式特性**:
- 宽度: 100%
- 高度: 40px
- 内边距: 0 12px
- 边框: 1px solid `--border-color`
- 圆角: `--radius-md` (8px)

### 输入框变体

| 类名 | 说明 |
|------|------|
| `.input-error` | 错误状态 |
| `.input-success` | 成功状态 |
| `.input-disabled` | 禁用状态 |

### 文本域 (.textarea)

```html
<textarea class="textarea" rows="4"></textarea>
```

### 选择框 (.select)

```html
<select class="select">
    <option>选项1</option>
    <option>选项2</option>
</select>
```

### 复选框和单选框

```html
<label class="checkbox">
    <input type="checkbox">
    <span>复选框</span>
</label>

<label class="radio">
    <input type="radio" name="group">
    <span>单选框</span>
</label>
```

### 开关 (.switch)

```html
<label class="switch">
    <input type="checkbox">
    <span class="slider"></span>
</label>
```

## 表格组件

### 基础表格 (.table)

```html
<table class="table">
    <thead>
        <tr>
            <th>表头1</th>
            <th>表头2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>数据1</td>
            <td>数据2</td>
        </tr>
    </tbody>
</table>
```

**样式特性**:
- 宽度: 100%
- 边框: 1px solid `--border-color`
- 表头背景: `--gray-100`
- 行悬停: `--gray-100`

### 表格变体

| 类名 | 说明 |
|------|------|
| `.table-striped` | 斑马纹表格 |
| `.table-bordered` | 带边框表格 |
| `.table-hover` | 悬停效果 |
| `.table-compact` | 紧凑表格 |

## 代码块

### 行内代码 (.code)

```html
<p>使用 <code class="code">console.log()</code> 输出</p>
```

### 代码块 (.code-block)

```html
<pre class="code-block"><code>function hello() {
    console.log('Hello');
}</code></pre>
```

## 标签和徽章

### 标签 (.tag)

```html
<span class="tag">标签</span>
```

### 徽章 (.badge)

```html
<span class="badge">12</span>
```

### 变体

| 类名 | 说明 |
|------|------|
| `.tag-primary` / `.badge-primary` | 主色 |
| `.tag-success` / `.badge-success` | 成功色 |
| `.tag-warning` / `.badge-warning` | 警告色 |
| `.tag-error` / `.badge-error` | 错误色 |

## 提示框

### 基础提示 (.alert)

```html
<div class="alert">提示信息</div>
```

### 提示变体

| 类名 | 说明 |
|------|------|
| `.alert-info` | 信息提示 |
| `.alert-success` | 成功提示 |
| `.alert-warning` | 警告提示 |
| `.alert-error` | 错误提示 |

## 分割线

### 基础分割线 (.divider)

```html
<div class="divider"></div>
```

### 文字分割线

```html
<div class="divider divider-text">或</div>
```

## 更新记录

### v0.3.0 (2026-04-03)
- 统一类名前缀为 `CUI-`
- 优化按钮样式
- 新增开关组件
