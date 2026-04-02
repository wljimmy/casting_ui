# 核心模块 API 文档

## 模块版本
- 版本: v0.3.0
- 更新日期: 2026-04-03

## 模块功能
核心模块提供框架的基础功能，包括调试工具、遮罩组件和弹窗基类。

## API 方法

### 1. debug()
**功能**: 调试函数，用于在控制台输出调试信息

**参数**:
- `message` (String): 调试消息
- `data` (Any): 可选，附加数据

**使用示例**:
```javascript
debug('调试信息', { test: 'data' });
```

### 2. showOverlay()
**功能**: 显示遮罩层

**返回值**:
- DOMElement: 创建的遮罩元素

**使用示例**:
```javascript
const overlay = showOverlay();
```

### 3. hideOverlay()
**功能**: 隐藏遮罩层

**使用示例**:
```javascript
hideOverlay();
```

### 4. PopupBase 类
**功能**: 弹窗基类，提供弹窗的基础功能

**构造函数参数**:
- `options` (Object): 配置选项
  - `title` (String): 弹窗标题
  - `content` (String): 弹窗内容
  - `width` (String): 弹窗宽度
  - `modal` (Boolean): 是否为模态弹窗

**方法**:
- `show()`: 显示弹窗
- `hide()`: 隐藏弹窗
- `destroy()`: 销毁弹窗

**使用示例**:
```javascript
class CustomPopup extends PopupBase {
  constructor(options) {
    super(options);
  }
}

const popup = new CustomPopup({
  title: '自定义弹窗',
  content: '弹窗内容',
  width: '400px'
});

popup.show();
```