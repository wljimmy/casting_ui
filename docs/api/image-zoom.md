# 图片放大模块 API 文档

## 模块版本
- 版本: v0.3.0
- 更新日期: 2026-04-03

## 模块功能
图片放大模块提供点击图片放大查看的功能。

## API 方法

### zoomImage()
**功能**: 为图片添加放大功能

**参数**:
- `img` (DOMElement): 要添加放大功能的图片元素

**使用示例**:
```javascript
// 为单个图片添加放大功能
const img = document.querySelector('img');
img.onclick = function() {
  zoomImage(this);
};

// 为多个图片添加放大功能
const images = document.querySelectorAll('img');
images.forEach(img => {
  img.onclick = function() {
    zoomImage(this);
  };
});
```