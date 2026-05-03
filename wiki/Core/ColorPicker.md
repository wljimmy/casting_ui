
# ColorPicker - 颜色选择器

ColorPicker 是一个功能完整的颜色选择器组件，支持多种颜色格式、预设颜色、标准色盘等功能。

## 基本用法

### 引入模块

```javascript
import { openColorPicker } from './color-picker.js';
```

或者使用全局对象：

```javascript
window.CUI.openColorPicker
window.openColorPicker
```

### 打开颜色选择器

```javascript
openColorPicker({
  initialColor: '#165DFF',
  presetColors: ['#165DFF', '#67C23A', '#E6A23C', '#F56C6C'],
  format: 'hex'
}).then(color => {
  console.log('选择的颜色:', color);
}).catch(reason => {
  console.log('取消选择:', reason);
});
```

## API 选项

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| initialColor | string | '#165DFF' | 初始颜色 |
| presetColors | Array | 见下文 | 预设颜色数组 |
| format | string | 'hex' | 输出格式：'hex', 'rgb', 'rgba' |
| container | string/Element | null | 内联容器选择器或元素 |

### 默认预设颜色

```javascript
[
  '#165DFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000'
]
```

## 完整示例

```javascript
// 打开颜色选择器
openColorPicker({
  initialColor: '#165DFF',
  format: 'hex'
}).then(color => {
  // 用户确认选择
  console.log('选择的颜色:', color);
  document.body.style.backgroundColor = color;
}).catch(reason => {
  // 用户取消或关闭
  console.log('未选择颜色:', reason);
});
```

## 颜色格式

### HEX 格式

```javascript
openColorPicker({
  initialColor: '#165DFF',
  format: 'hex'
}).then(color => {
  console.log(color); // '#165DFF'
});
```

### RGB 格式

```javascript
openColorPicker({
  initialColor: '#165DFF',
  format: 'rgb'
}).then(color => {
  console.log(color); // 'rgb(22, 93, 255)'
});
```

### RGBA 格式

```javascript
openColorPicker({
  initialColor: '#165DFF',
  format: 'rgba'
}).then(color => {
  console.log(color); // 'rgba(22, 93, 255, 1)'
});
```

## 内联模式

将颜色选择器嵌入到页面中的指定容器：

```html
<div id="color-picker-container" class="color-picker-inline"></div>
```

```javascript
openColorPicker({
  container: '#color-picker-container', // 或者直接传入 DOM 元素
  initialColor: '#165DFF'
}).then(color => {
  console.log('选择的颜色:', color);
});
```

## 界面功能

### 颜色预览

- 实时显示当前选择的颜色
- 显示颜色值（可切换格式）

### 标准色盘

- 完整的彩虹渐变色盘
- 亮度滑块（0% - 100%）
- 点击选择颜色

### 预设颜色

- 15 个预设颜色
- 快速选择常用颜色

### 手动输入

- 颜色输入框（支持直接点击打开系统颜色选择器）
- 文本输入（支持多种颜色格式）

### 格式切换

- 在 HEX、RGB、RGBA 之间切换
- 自动转换颜色格式

## 实际应用示例

### 主题色选择

```javascript
function changePrimaryColor() {
  openColorPicker({
    initialColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
    format: 'hex'
  }).then(color => {
    document.documentElement.style.setProperty('--primary-color', color);
  });
}
```

### 颜色配置表单

```html
<div class="CUI-box">
  <label class="text-md">主色调</label>
  <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
    <div id="color-preview" style="width: 50px; height: 32px; border-radius: 4px; background: #165DFF; cursor: pointer;"></div>
    <input type="text" id="color-input" class="CUI-input" value="#165DFF" style="width: 120px;">
    <button class="btn btn-secondary" onclick="openColorPickerFromForm()">选择</button>
  </div>
</div>
```

```javascript
function openColorPickerFromForm() {
  const currentColor = document.getElementById('color-input').value;
  
  openColorPicker({
    initialColor: currentColor,
    format: 'hex'
  }).then(color => {
    document.getElementById('color-input').value = color;
    document.getElementById('color-preview').style.backgroundColor = color;
  });
}
```

## 与主题管理器集成

ColorPicker 与 ThemeManager 完美集成，用于自定义主题颜色：

```javascript
// 在主题编辑界面中使用
const colorInput = document.createElement('div');
colorInput.className = 'color-picker-trigger';
colorInput.style.cssText = `
  width: 50px;
  height: 32px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: ${currentColor};
  cursor: pointer;
`;

colorInput.addEventListener('click', async () => {
  try {
    const result = await openColorPicker({
      presetColors: [
        '#165DFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'
      ],
      format: 'hex',
      initialColor: currentColor
    });
    if (result) {
      colorValue.value = result;
      colorInput.style.backgroundColor = result;
    }
  } catch (error) {
    // 用户取消选择
  }
});
```

## 错误处理

颜色选择器返回 Promise，需要处理两种情况：

```javascript
openColorPicker().then(color => {
  // 成功选择颜色
  console.log('选择成功:', color);
}).catch(reason => {
  // 取消或关闭
  console.log('未选择:', reason);
});
```

## 样式定制

颜色选择器使用 CSS 变量，可以通过覆盖变量自定义样式：

```css
:root {
  --primary-color: #your-color;
  --bg-color: #f5f5f5;
  --border-color: #ddd;
  --text-primary: #333;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.1);
}
```
