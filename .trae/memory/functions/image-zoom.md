# 图片放大功能记忆

## 功能描述
- **功能**：点击图片显示放大效果
- **实现**：
  - `zoomImage(src)` - 放大图片
  - `closeImageZoom()` - 关闭图片放大

## 参数说明
- **src** - 图片地址

## 特性
- **全屏显示** - 全屏显示放大的图片
- **点击关闭** - 点击遮罩或关闭按钮关闭
- **动画效果** - 平滑的显示和隐藏动画

## 使用方式
- `zoomImage('https://example.com/image.jpg')` - 放大指定图片
- 点击图片元素（带有onclick="zoomImage(this.querySelector('img').src)"）

## 应用场景
- 图片预览
- 产品图片查看
- 图库浏览