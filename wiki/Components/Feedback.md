
# 反馈组件

反馈组件用于向用户提供操作反馈，包括弹窗、Toast、加载遮罩等。

---

## Toast 轻提示

Toast 用于显示临时的消息提示，会自动消失。

### 基础用法

```javascript
showToast(type, message, position);
```

### 参数说明

| 参数 | 类型 | 可选值 | 默认值 | 描述 |
|------|------|--------|--------|------|
| `type` | String | `success` / `error` / `warning` / `info` | - | 消息类型 |
| `message` | String | - | - | 消息内容 |
| `position` | String | `top` / `bottom` | `top` | 显示位置 |

### 示例

```html
<button onclick="showToast('success', '操作成功')">成功Toast</button>
<button onclick="showToast('error', '操作失败')">错误Toast</button>
<button onclick="showToast('warning', '警告信息')">警告Toast</button>
<button onclick="showToast('info', '提示信息')">信息Toast</button>

<button onclick="showToast('success', '顶部Toast', 'top')">顶部Toast</button>
<button onclick="showToast('success', '底部Toast', 'bottom')">底部Toast</button>
```

### 使用说明

- Toast 会在显示后自动消失（默认 3 秒）
- 支持 4 种内置类型，每种类型有对应的图标和颜色
- 可以选择顶部或底部显示
- 同时显示多个 Toast 时，会自动堆叠排列

---

## Modal 弹窗

弹窗用于显示重要信息或获取用户输入。

### 基础用法

```javascript
showModal(options);
```

### 选项说明 (options)

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `title` | String | `'弹窗标题'` | 弹窗标题 |
| `content` | String | `'弹窗内容'` | 弹窗内容 |
| `buttons` | Array | `[{text: '关闭', type: 'secondary'}]` | 按钮配置数组 |
| `position` | String | `''` | 弹窗位置：`''`（居中）/ `top` / `bottom` / `left` / `right` |
| `glass` | Boolean | `false` | 是否使用毛玻璃效果 |
| `inputs` | Array | `[]` | 输入框配置数组 |

### 按钮配置 (buttons)

每个按钮对象支持以下属性：

| 属性 | 类型 | 描述 |
|------|------|------|
| `text` | String | 按钮文字 |
| `type` | String | 按钮类型：`primary` / `secondary` |
| `action` | Function | 点击按钮时的回调函数（可选） |

### 输入框配置 (inputs)

每个输入框对象支持以下属性：

| 属性 | 类型 | 描述 |
|------|------|------|
| `label` | String | 输入框标签 |
| `name` | String | 输入框名称 |
| `type` | String | 输入框类型（如 `text` / `email` / `password`，默认为 `text`） |
| `placeholder` | String | 占位文字（可选） |
| `value` | String | 默认值（可选） |

### 返回值

`showModal()` 返回一个 Promise，解析为：

```javascript
{
  status: 'success' | 'closed',  // 点击按钮关闭 或 其他方式关闭
  button: buttonObject | null,   // 点击的按钮对象
  inputs: { name: value }        // 输入框值（如果有）
}
```

### 示例 1：信息弹窗

```html
<button onclick="showInfoModal()">信息弹窗</button>

<script>
function showInfoModal() {
  showModal({
    title: '信息提示',
    content: '这是一条重要的信息提示。',
    buttons: [
      { text: '关闭', type: 'secondary' }
    ]
  });
}
</script>
```

### 示例 2：确认弹窗

```html
<button onclick="showConfirmModal()">确认弹窗</button>

<script>
function showConfirmModal() {
  showModal({
    title: '确认操作',
    content: '确定要执行此操作吗？此操作不可逆。',
    buttons: [
      { 
        text: '取消', 
        type: 'secondary',
        action: () => showToast('info', '已取消')
      },
      { 
        text: '确定', 
        type: 'primary',
        action: () => showToast('success', '操作成功')
      }
    ]
  });
}
</script>
```

### 示例 3：不同位置的弹窗

```html
<button onclick="showModal({title: '顶部弹窗', content: '内容', position: 'top'})">顶部弹窗</button>
<button onclick="showModal({title: '底部弹窗', content: '内容', position: 'bottom'})">底部弹窗</button>
<button onclick="showModal({title: '左侧弹窗', content: '内容', position: 'left'})">左侧弹窗</button>
<button onclick="showModal({title: '右侧弹窗', content: '内容', position: 'right'})">右侧弹窗</button>
```

### 示例 4：毛玻璃弹窗

```html
<button onclick="showGlassModal()">毛玻璃弹窗</button>

<script>
function showGlassModal() {
  showModal({
    title: '毛玻璃效果',
    content: '这个弹窗使用了毛玻璃效果。',
    glass: true,
    buttons: [
      { text: '关闭', type: 'secondary' }
    ]
  });
}
</script>
```

### 示例 5：带输入框的弹窗

```html
<button onclick="showInputModal()">带输入框的弹窗</button>

<script>
async function showInputModal() {
  const result = await showModal({
    title: '用户信息',
    content: '请输入以下信息：',
    buttons: [
      { text: '取消', type: 'secondary' },
      { text: '提交', type: 'primary' }
    ],
    inputs: [
      { label: '姓名', name: 'name', placeholder: '请输入姓名' },
      { label: '邮箱', name: 'email', type: 'email', placeholder: '请输入邮箱' }
    ]
  });
  
  if (result.status === 'success') {
    console.log('输入值：', result.inputs);
    showToast('success', `收到：${result.inputs.name} / ${result.inputs.email}`);
  }
}
</script>
```

### 弹窗关闭方式

弹窗可以通过以下方式关闭：

1. 点击按钮
2. 点击右上角的关闭按钮 (×)
3. 点击遮罩层
4. 按 Esc 键（需自行实现）

---

## Loading 加载遮罩

加载遮罩用于显示加载状态，阻止用户操作。

### showLoading 显示加载

```javascript
showLoading(text);
```

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `text` | String | `'加载中...'` | 加载提示文字 |

### hideLoading 隐藏加载

```javascript
hideLoading();
```

### 示例

```html
<button onclick="startLoading()">显示加载遮罩</button>

<script>
function startLoading() {
  showLoading('数据加载中...');
  
  // 模拟加载
  setTimeout(() => {
    hideLoading();
    showToast('success', '加载完成');
  }, 3000);
}
</script>
```

### 特性

- 加载遮罩会居中显示
- 显示旋转动画
- 支持自定义文字
- 显示 3 秒后自动隐藏（也可手动调用 `hideLoading()`）

---

## createMessage 创建消息（不自动关闭）

`createMessage()` 用于创建不会自动消失的消息提示。

### 用法

```javascript
createMessage(options);
```

### 选项说明

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `id` | String | 自动生成 | 消息 ID（可选） |
| `type` | String | `'info'` | 消息类型：`info` / `success` / `warning` / `error` |
| `title` | String | `'消息'` | 消息标题 |
| `content` | String | `''` | 消息内容 |
| `duration` | Number | `undefined` | 自动关闭时间（毫秒），不设置则不自动关闭 |
| `position` | String | `'top'` | 显示位置（预留，暂未实现） |
| `container` | Element / String | `document.body` | 容器元素或选择器 |

### 返回值

返回创建的消息 DOM 元素。

### 示例

```html
<button onclick="createPersistentMessage()">创建持久消息</button>

<script>
function createPersistentMessage() {
  const msg = createMessage({
    type: 'info',
    title: '重要通知',
    content: '这是一条不会自动消失的消息，请手动处理。',
    // 不设置 duration，不会自动关闭
  });
  
  // 可以手动操作这个元素
  console.log('消息元素：', msg);
}
</script>
```

### 自动关闭示例

```html
<button onclick="createAutoCloseMessage()">5秒后自动关闭</button>

<script>
function createAutoCloseMessage() {
  createMessage({
    type: 'success',
    title: '操作成功',
    content: '这条消息会在 5 秒后自动关闭。',
    duration: 5000
  });
}
</script>
```

---

## 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>反馈组件示例</title>
  <link rel="stylesheet" href="src/modules/css/core.css">
  <link rel="stylesheet" href="src/modules/css/components.css">
</head>
<body>
  
  <div class="CUI-wrap">
    <section class="CUI-section">
      <h2>Toast 轻提示</h2>
      <div class="CUI-box">
        <div class="CUI-grid CUI-grid-4c">
          <button class="btn btn-success" onclick="showToast('success', '操作成功！')">成功</button>
          <button class="btn btn-error" onclick="showToast('error', '操作失败！')">错误</button>
          <button class="btn btn-warning" onclick="showToast('warning', '警告信息')">警告</button>
          <button class="btn btn-info" onclick="showToast('info', '提示信息')">信息</button>
        </div>
      </div>
      
      <h2>Modal 弹窗</h2>
      <div class="CUI-box">
        <div class="CUI-grid CUI-grid-3c">
          <button class="btn btn-primary" onclick="showInfoModal()">信息弹窗</button>
          <button class="btn btn-primary" onclick="showConfirmModal()">确认弹窗</button>
          <button class="btn btn-primary" onclick="showGlassModal()">毛玻璃弹窗</button>
          <button class="btn btn-primary" onclick="showInputModal()">带输入框</button>
        </div>
      </div>
      
      <h2>Loading 加载遮罩</h2>
      <div class="CUI-box">
        <button class="btn btn-primary" onclick="startLoading()">显示加载遮罩</button>
      </div>
      
      <h2>Message 消息提示</h2>
      <div class="CUI-box">
        <button class="btn btn-primary" onclick="createPersistentMessage()">持久消息</button>
        <button class="btn btn-primary" onclick="createAutoCloseMessage()">5秒后关闭</button>
      </div>
    </section>
  </div>
  
  <script type="module" src="src/modules/js/index.js"></script>
  
  <script>
  // Toast 示例已可以直接使用
  
  // Modal 示例函数
  function showInfoModal() {
    showModal({
      title: '信息提示',
      content: '这是一条重要的信息提示。',
      buttons: [
        { text: '关闭', type: 'secondary' }
      ]
    });
  }
  
  function showConfirmModal() {
    showModal({
      title: '确认操作',
      content: '确定要执行此操作吗？此操作不可逆。',
      buttons: [
        { 
          text: '取消', 
          type: 'secondary',
          action: () => showToast('info', '已取消')
        },
        { 
          text: '确定', 
          type: 'primary',
          action: () => showToast('success', '操作成功')
        }
      ]
    });
  }
  
  function showGlassModal() {
    showModal({
      title: '毛玻璃效果',
      content: '这个弹窗使用了毛玻璃效果。',
      glass: true,
      buttons: [
        { text: '关闭', type: 'secondary' }
      ]
    });
  }
  
  async function showInputModal() {
    const result = await showModal({
      title: '用户信息',
      content: '请输入以下信息：',
      buttons: [
        { text: '取消', type: 'secondary' },
        { text: '提交', type: 'primary' }
      ],
      inputs: [
        { label: '姓名', name: 'name', placeholder: '请输入姓名' },
        { label: '邮箱', name: 'email', type: 'email', placeholder: '请输入邮箱' }
      ]
    });
    
    if (result.status === 'success') {
      showToast('success', `收到：${result.inputs.name}`);
    }
  }
  
  // Loading 示例函数
  function startLoading() {
    showLoading('数据加载中...');
    setTimeout(() => {
      hideLoading();
      showToast('success', '加载完成');
    }, 3000);
  }
  
  // Message 示例函数
  function createPersistentMessage() {
    createMessage({
      type: 'info',
      title: '重要通知',
      content: '这是一条不会自动消失的消息，请手动处理。'
    });
  }
  
  function createAutoCloseMessage() {
    createMessage({
      type: 'success',
      title: '操作成功',
      content: '这条消息会在 5 秒后自动关闭。',
      duration: 5000
    });
  }
  </script>
</body>
</html>
```

---

## API 速查表

| 函数 | 描述 | 快速示例 |
|------|------|----------|
| `showToast(type, msg, pos)` | 显示 Toast | `showToast('success', '成功')` |
| `showModal(options)` | 显示弹窗 | `showModal({title: '标题', content: '内容'})` |
| `showLoading(text)` | 显示加载遮罩 | `showLoading('加载中...')` |
| `hideLoading()` | 隐藏加载遮罩 | `hideLoading()` |
| `createMessage(options)` | 创建持久消息 | `createMessage({type: 'info', title: '标题', content: '内容'})` |
