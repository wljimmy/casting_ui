# 表单组件记忆

## 核心规则

**重要：form 下的第一级 div 就是一行！**

表单的每一行是一个独立的 `<div>` 容器，每个容器内可以包含多组标签和输入框。

| 结构 | 说明 |
|------|------|
| `form.CUI-form` | 表单容器，flex布局 |
| `form > div` | **每一行**，grid布局 |
| `form > div > div` | 标签，默认占1列 |
| `form > div > .CUI-input` | 输入框，默认占3列 |
| `form > button` | 按钮，自动收集到操作区 |

## 输入框

### 功能
提供不同类型、自动图标渲染、标签布局和组合框样式的输入框

### 类名
- `.CUI-input` - 基础输入框类，自动美化
- `.CUI-input-box` - 组合输入框，包含标签、提示、错误信息
- `.CUI-input--simple` - 简约样式（仅下边框）

### 属性
- `data-label` - 输入框标签文字
- `data-hint` - 永久显示的提示文字
- `data-info` - 焦点时显示的提示文字
- `data-error` - 错误状态显示的错误信息
- `data-isError` - 设为 true 强制显示错误状态
- `data-icon` - 自定义图标名称（email, user, sms等）
- `data-label-position` - 标签位置（left/top）

### 自动图标类型
- search
- email
- tel / telephone
- password
- url / link
- number / numeric
- sms / verification
- code
- date
- time
- user / username
- userpassword

### 图标库
Tabler Icons

### 注册表功能
- `CUI.input.get(path)` - 获取节点信息
- `CUI.input.getValue(path)` - 获取input的值
- `CUI.input.setValue(path, value)` - 设置input的值
- `CUI.input.getFormData(formId)` - 获取整个表单数据对象
- `CUI.input.setFormData(formId, data)` - 设置整个表单数据
- `CUI.input.element(path)` - 获取input的DOM元素
- `CUI.input.getAll()` - 获取完整注册表

### 使用场景
表单输入、用户输入、数据采集

## 表单布局

### 功能
提供灵活的网格表单布局，自动按钮容器，统一标签对齐，响应式适配

### 核心规则
**form 下的第一级 div 就是一行！**

### 类名
- `.CUI-form` - 表单容器，flex布局
- `.CUI-form-card` - 自动添加的卡片容器类
- `.CUI-form-actions` - 自动添加的按钮容器
- `.CUI-form-processed` - 已处理表单标记

### 属性
- `data-form-cols` - 表单总列数（12/8/4/2）
  - 12列：可实现3列输入框展示
  - 8列：可实现2列输入框展示
  - 4列/2列：单列展示
- `data-label-position` - 标签位置（left/top）
- `CUI-span-Xc` - 在input上设置，控制占列数（1~11）

### 布局规范
- form下第一级div就是一行：每个直接子div是一行，形成独立的grid布局
- 标签与input不换行：避免一行放不下时标签和input被拆散
- 手动调整列数：若布局不合理，可通过调整data-form-cols或CUI-span来优化
- input后可添加内容：input之后可以继续放div做额外提示，不受框架限制
- 默认上对齐：标签和input第一行保持对齐
- 响应式适配：小屏幕自动切换为单列布局

### 使用场景
表单构建、数据录入、信息填写