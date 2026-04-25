# 遮罩组件功能记忆

## 功能描述
- **功能**：提供半透明和毛玻璃遮罩
- **实现**：
  - `createOverlay(options)` - 创建遮罩
  - `showOverlay(options)` - 显示遮罩
  - `hideOverlay(id)` - 隐藏遮罩

## 参数说明
- **id** - 遮罩ID
- **type** - 遮罩类型（transparent, glass）
- **zIndex** - 层级

## 特性
- **半透明遮罩** - 普通半透明遮罩
- **毛玻璃遮罩** - 带有毛玻璃效果的遮罩
- **动画效果** - 平滑的显示和隐藏动画

## 使用方式
- `showOverlay({id: 'test-overlay', type: 'transparent'})` - 显示半透明遮罩
- `showOverlay({id: 'glass-overlay', type: 'glass'})` - 显示毛玻璃遮罩
- `hideOverlay('test-overlay')` - 隐藏遮罩

## 应用场景
- 弹窗背景
- 加载遮罩
- 图片放大背景