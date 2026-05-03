
# 文本组件

文本组件提供丰富的文本样式，包括标题、段落、颜色、大小和装饰等。

## 标题 (Headings)

框架提供六级标题样式，从 h1 到 h6。

| 标签 | 字体大小 | 字重 | 用途 |
|------|---------|------|------|
| `h1` | 32px | 600 | 页面主标题 |
| `h2` | 24px | 600 | 章节标题 |
| `h3` | 20px | 600 | 小节标题 |
| `h4` | 18px | 600 | 子节标题 |
| `h5` | 16px | 600 | 小标题 |
| `h6` | 14px | 600 | 最小标题 |

```html
<h1>一级标题 (h1)</h1>
<h2>二级标题 (h2)</h2>
<h3>三级标题 (h3)</h3>
<h4>四级标题 (h4)</h4>
<h5>五级标题 (h5)</h5>
<h6>六级标题 (h6)</h6>
```

## 文本颜色 (Text Colors)

提供多种文本颜色，用于不同场景。

| 类名 | 颜色 | 用途 |
|------|------|------|
| `.text-primary` | 主题色 | 主要文本、链接 |
| `.text-secondary` | 次要色 | 描述文本 |
| `.text-muted` | 灰色 | 提示信息、禁用状态 |
| `.text-success` | 绿色 | 成功状态 |
| `.text-warning` | 黄色 | 警告状态 |
| `.text-error` | 红色 | 错误状态 |

```html
<p class="text-primary">主要文本 (text-primary)：使用主题色</p>
<p class="text-secondary">次要文本 (text-secondary)：使用次要颜色</p>
<p class="text-muted">灰色文本 (text-muted)：用于提示信息</p>
<p class="text-success">成功文本 (text-success)：使用绿色</p>
<p class="text-warning">警告文本 (text-warning)：使用黄色</p>
<p class="text-error">错误文本 (text-error)：使用红色</p>
```

## 文本大小 (Text Sizes)

提供三种文本大小。

| 类名 | 字体大小 | 用途 |
|------|---------|------|
| `.text-sm` | 12px | 辅助信息、标签 |
| `.text-md` | 14px | 默认正文 |
| `.text-lg` | 16px | 强调内容 |

```html
<p class="text-sm">小文本 (text-sm)：12px，用于辅助信息</p>
<p class="text-md">中文本 (text-md)：14px，默认文本大小</p>
<p class="text-lg">大文本 (text-lg)：16px，用于强调内容</p>
```

## 文本装饰 (Text Decoration)

提供粗体、斜体、下划线等文本装饰样式。

| 类名 | 样式 | 用途 |
|------|------|------|
| `.text-bold` | font-weight: 600 | 强调文本 |
| `.text-italic` | font-style: italic | 引用、特殊说明 |
| `.text-underline` | text-decoration: underline | 链接、强调 |
| `.text-strike` | text-decoration: line-through | 已删除内容 |

```html
<p class="text-bold">粗体文本 (text-bold)：font-weight: 600</p>
<p class="text-italic">斜体文本 (text-italic)：font-style: italic</p>
<p class="text-underline">下划线文本 (text-underline)：text-decoration: underline</p>
<p class="text-strike">删除线文本 (text-strike)：text-decoration: line-through</p>
```

## 字体族 (Font Families)

支持不同的字体族。

| 类名 | 字体 | 用途 |
|------|------|------|
| `.text-sans` | 系统无衬线字体 | 默认正文 |
| `.text-serif` | 宋体 | 中文排版、引用 |
| `.text-mono` | Consolas | 代码、数据 |

```html
<p class="text-sans">无衬线字体 (text-sans)：系统默认无衬线字体</p>
<p class="text-serif">衬线字体 (text-serif)：宋体，适合中文排版</p>
<p class="text-mono">等宽字体 (text-mono)：Consolas，适合代码</p>
```

## 文本对齐 (Text Alignment)

提供文本对齐方式。

| 类名 | 对齐方式 |
|------|---------|
| `.text-left` | 左对齐（默认） |
| `.text-center` | 居中对齐 |
| `.text-right` | 右对齐 |
| `.text-justify` | 两端对齐 |

```html
<p class="text-left">左对齐文本 (text-left)</p>
<p class="text-center">居中对齐文本 (text-center)</p>
<p class="text-right">右对齐文本 (text-right)</p>
<p class="text-justify">两端对齐文本 (text-justify)</p>
```

## 使用建议

- 使用语义化标题标签 (h1-h6)，不要仅依赖样式
- 文本颜色应与状态对应：success(成功)、warning(警告)、error(错误)
- 不要过度使用文本装饰，保持页面简洁
- 中文正文推荐使用默认无衬线字体，特殊场景使用宋体
- 代码和数据使用等宽字体，确保对齐
