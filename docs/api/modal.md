# 弹窗模块 API 文档

## 模块版本
- 版本: v0.3.0
- 更新日期: 2026-04-03

## 模块功能
弹窗模块提供创建和管理弹窗的功能，支持自定义标题、内容、按钮和样式。

## API 方法

### showModal()
**功能**: 创建并显示弹窗

**参数**:
- `options` (Object): 配置选项
  - `title` (String): 弹窗标题
  - `content` (String): 弹窗内容，可以是HTML
  - `width` (String): 弹窗宽度，默认为'300px'
  - `buttons` (Array): 按钮配置数组
    - `text` (String): 按钮文本
    - `style` (String): 按钮样式，可选 'primary' 或 'default'
    - `action` (Function): 按钮点击事件处理函数

**使用示例**:
```javascript
showModal({
  title: '提示',
  content: '这是一个弹窗',
  width: '400px',
  buttons: [
    {
      text: '确定',
      style: 'primary',
      action: () => {
        console.log('点击了确定');
      }
    },
    {
      text: '取消',
      action: () => {
        console.log('点击了取消');
      }
    }
  ]
});
```