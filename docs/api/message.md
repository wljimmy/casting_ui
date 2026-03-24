# 消息提示模块 API 文档

## 模块版本
- 版本: v0.1.0
- 更新日期: 2024-01-01

## 模块功能
消息提示模块提供 Toast 消息、加载遮罩和消息提示功能。

## API 方法

### 1. toast()
**功能**: 显示 Toast 消息

**参数**:
- `message` (String): 消息内容
- `type` (String): 消息类型，可选 'success', 'error', 'warning', 'info'
- `duration` (Number): 消息显示时长，单位毫秒，默认为 3000

**使用示例**:
```javascript
toast('操作成功', 'success', 2000);
```

### 2. message()
**功能**: 显示消息提示

**参数**:
- `message` (String): 消息内容
- `type` (String): 消息类型，可选 'success', 'error', 'warning', 'info'
- `duration` (Number): 消息显示时长，单位毫秒，默认为 3000

**使用示例**:
```javascript
message('操作成功', 'success');
```

### 3. showLoading()
**功能**: 显示加载遮罩

**参数**:
- `text` (String): 加载文本，默认为 '加载中...'

**使用示例**:
```javascript
showLoading('加载中，请稍候...');
```

### 4. hideLoading()
**功能**: 隐藏加载遮罩

**使用示例**:
```javascript
hideLoading();
```