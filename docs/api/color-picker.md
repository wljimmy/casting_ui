# 颜色选择器模块 API 文档

## 模块版本
- 版本: v0.3.0
- 更新日期: 2026-04-03

## 模块功能
颜色选择器模块提供颜色选择功能，支持弹窗模式和内联模式，支持多种颜色格式。

## API 方法

### openColorPicker()
**功能**: 打开颜色选择器

**参数**:
- `options` (Object): 配置选项
  - `mode` (String): 模式，可选 'modal' (弹窗) 或 'inline' (内联)
  - `container` (String): 内联模式时的容器选择器
  - `format` (String): 颜色格式，可选 'hex', 'rgb', 'rgba'
  - `presetColors` (Array): 预设颜色数组

**返回值**:
- Promise: 解析为选择的颜色值

**使用示例**:
```javascript
// 弹窗模式
openColorPicker({
  mode: 'modal',
  format: 'hex'
})
.then(color => {
  console.log('选择的颜色:', color);
})
.catch(error => {
  console.log('颜色选择器已取消:', error);
});

// 内联模式
openColorPicker({
  mode: 'inline',
  container: '#color-container',
  format: 'rgb'
})
.then(color => {
  console.log('选择的颜色:', color);
});

// 自定义预设颜色
const customPresets = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
openColorPicker({
  mode: 'modal',
  presetColors: customPresets,
  format: 'hex'
});
```