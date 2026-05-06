
# 表单组件

Casting UI 提供完整的表单组件，包括输入框、表单处理、表单验证等功能。

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

## 输入框 (Input)

### 基础用法

只需为 input/textarea/select 添加 `CUI-input` 类，框架会自动美化并注册到注册表。

```html
<input type="text" name="username" class="CUI-input" placeholder="文本输入">
<input type="password" name="password" class="CUI-input" placeholder="密码输入">
<input type="email" name="email" class="CUI-input" placeholder="邮箱输入">
```

### 自动图标

框架会根据 input 的 type 属性自动渲染对应图标：

| type值 | 图标 | 说明 |
|------|------|------|
| search | 搜索 | 搜索框 |
| email | 邮件 | 邮箱输入 |
| tel / telephone | 电话 | 电话号码 |
| password | 密码 | 密码输入 |
| url / link | 链接 | 网址输入 |
| number / numeric | 数字 | 数字输入 |
| sms / verification | 短信 | 验证码 |
| code | 代码 | 验证码/兑换码 |
| date | 日期 | 日期选择 |
| time | 时间 | 时间选择 |
| user / username | 用户 | 用户名 |
| userpassword | 用户+密码 | 用户密码组合 |

```html
<input type="search" name="search" class="CUI-input" placeholder="搜索框">
<input type="tel" name="tel" class="CUI-input" placeholder="电话">
<input type="url" name="url" class="CUI-input" placeholder="网址">
```

### 自定义图标

使用 `data-icon` 属性指定图标名称，覆盖自动识别：

```html
<input type="text" name="username" class="CUI-input" data-icon="user" placeholder="用户名">
<input type="text" name="captcha" class="CUI-input" data-icon="sms" placeholder="验证码">
```

### 带标签输入框

使用 `data-label` 添加标签，`data-label-position` 控制位置：

```html
<!-- 标签在左（默认）-->
<input type="text" name="name" class="CUI-input" data-label="姓名" placeholder="">

<!-- 标签在上 -->
<input type="text" name="email" class="CUI-input" data-label="邮箱地址" data-label-position="top" placeholder="">
```

### 简约样式

添加 `CUI-input--simple` 类实现极简风格：

```html
<input type="text" name="search" class="CUI-input CUI-input--simple" data-label="搜索" data-label-position="top" placeholder="简约搜索">
```

## 组合输入框 (CUI-input-box)

提供完整的输入组件，包含标签、提示、错误信息等功能：

```html
<!-- 普通组合框 -->
<input type="text" name="input1" class="CUI-input-box" data-label="普通输入" data-hint="这是永久提示" placeholder="请输入">

<!-- 错误状态组合框 -->
<input type="text" name="input2" class="CUI-input-box" data-label="错误输入" data-hint="这是永久提示" data-error="这是错误信息" data-isError="true" placeholder="请输入">

<!-- 带图标和提示的组合框 -->
<input type="email" name="input3" class="CUI-input-box" data-label="邮箱" data-icon="email" data-hint="请输入有效的邮箱地址" data-info="焦点时显示：请注意邮箱格式" placeholder="请输入邮箱">
```

### CUI-input-box 参数说明

| 参数 | 说明 |
|------|------|
| data-label | 输入框标签文字 |
| data-hint | 永久显示的提示文字 |
| data-info | 焦点时显示的提示文字 |
| data-error | 错误状态显示的错误信息 |
| data-isError | 设为 "true" 强制显示错误状态 |
| data-icon | 图标名称（如 email, user, sms） |

## 文本域 (textarea)

```html
<textarea name="description" class="CUI-input" placeholder="请输入描述..." rows="3"></textarea>
```

## 下拉选择 (select)

```html
<select name="city" class="CUI-input">
    <option value="">请选择城市</option>
    <option value="bj">北京</option>
    <option value="sh">上海</option>
    <option value="sz">深圳</option>
</select>
```

## 复选框 (checkbox)

```html
<label><input type="checkbox" name="hobby" class="CUI-input" value="read"> 阅读</label>
<label><input type="checkbox" name="hobby" class="CUI-input" value="music"> 音乐</label>
<label><input type="checkbox" name="hobby" class="CUI-input" value="sport"> 运动</label>
```

## 单选框 (radio)

```html
<label><input type="radio" name="gender" class="CUI-input" value="male"> 男</label>
<label><input type="radio" name="gender" class="CUI-input" value="female"> 女</label>
<label><input type="radio" name="gender" class="CUI-input" value="other"> 其他</label>
```

## 表单组合

框架支持嵌套表单结构，通过 `name` 属性自动注册到注册表：

```html
<form id="myForm">
    <input type="email" name="email" class="CUI-input" placeholder="邮箱">
    <input type="tel" name="phone" class="CUI-input" placeholder="手机号">
    <input type="sms" name="captcha" class="CUI-input" placeholder="验证码">
</form>
```

## JavaScript API

### 获取节点信息

```javascript
// 获取节点信息
CUI.input.get('myForm.username')
```

### 获取和设置值

```javascript
// 获取值
CUI.input.getValue('username')

// 设置值
CUI.input.setValue('username', 'test')
```

### 表单数据操作

```javascript
// 获取整个表单数据对象
const data = CUI.input.getFormData('myForm')

// 设置整个表单数据
CUI.input.setFormData('myForm', {username: 'test'})
```

### 其他 API

```javascript
// 获取 DOM 元素
CUI.input.element('username')

// 获取完整注册表
CUI.input.getAll()
```

## 路径规则

| 类型 | 格式 | 示例 |
|------|------|------|
| 独立输入框 | 直接使用 name 属性值 | 'username' |
| 表单内输入框 | formId.name | 'loginForm.username' |
| 复选框/单选框 | 返回值为数组 | ['read', 'music'] |

## 自动注册与垃圾回收

框架通过 DOMObserver 自动扫描并注册所有 `input/textarea/select` 元素，无需手动管理生命周期。当元素被移除时，自动从注册表注销并清理事件监听。

## 表单容器 (CUI-form)

### 核心结构

**重要：form 下的第一级 div 就是一行！**

```html
<form class="CUI-form" data-form-cols="12">
    <!-- 每一行是一个div -->
    <div>
        <div>姓名</div>
        <input type="text" name="username" class="CUI-input" placeholder="请输入姓名">
        <div>邮箱</div>
        <input type="email" name="email" class="CUI-input" placeholder="请输入邮箱">
        <div>电话</div>
        <input type="tel" name="phone" class="CUI-input" placeholder="请输入电话">
    </div>
    <!-- 按钮会自动收集到操作区 -->
    <button type="submit" class="btn btn-primary">提交</button>
    <button type="button" class="btn btn-secondary">取消</button>
</form>
```

### 布局参数

| 参数 | 值 | 说明 |
|------|------|------|
| data-form-cols | 12 / 8 / 4 / 2 | 表单总列数，控制布局密度 |
| data-label-position | left / top | 标签位置（在form或div上设置） |
| CUI-span-Xc | 1~11 | 在input上设置，控制占列数 |

### 布局规范

| 规范 | 说明 |
|------|------|
| form下第一级div就是一行 | 每个直接子div是一行，形成独立的grid布局 |
| 标签与input不换行 | 避免一行放不下时标签和input被拆散 |
| 手动调整列数 | 若布局不合理，可通过调整data-form-cols或CUI-span来优化 |
| input后可添加内容 | input之后可以继续放div做额外提示，不受框架限制 |
| 默认上对齐 | 标签和input第一行保持对齐 |
| 响应式适配 | 小屏幕自动切换为单列布局 |

### 示例

```html
<!-- 12列布局（3列展示） -->
<form class="CUI-form" data-form-cols="12">
    <div>
        <div>姓名</div>
        <input type="text" name="name" class="CUI-input" placeholder="请输入姓名">
        <div>邮箱</div>
        <input type="email" name="email" class="CUI-input" placeholder="请输入邮箱">
        <div>电话</div>
        <input type="tel" name="tel" class="CUI-input" placeholder="请输入电话">
    </div>
    <button type="submit" class="btn btn-primary">提交</button>
</form>

<!-- 8列布局（2列展示） -->
<form class="CUI-form" data-form-cols="8">
    <div>
        <div>姓名</div>
        <input type="text" name="name" class="CUI-input" placeholder="请输入姓名">
        <div>邮箱</div>
        <input type="email" name="email" class="CUI-input" placeholder="请输入邮箱">
    </div>
    <button type="submit" class="btn btn-primary">提交</button>
</form>

<!-- 标签在上 -->
<form class="CUI-form" data-form-cols="12">
    <div data-label-position="top">
        <div>个人简介</div>
        <textarea name="bio" class="CUI-input" placeholder="请输入个人简介" rows="3"></textarea>
    </div>
    <button type="submit" class="btn btn-primary">提交</button>
</form>
```

表单会自动将按钮包装在 `.CUI-form-actions` 容器中，并添加适当的样式。