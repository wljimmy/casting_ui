# Toast消息功能记忆

## 功能描述
- **功能**：提供不同类型和位置的消息提示
- **实现**：`showToast(type, message, position)`

## 参数说明
- **type** - 消息类型（success, error, warning, info）
- **message** - 消息内容
- **position** - 消息位置（top, bottom）

## 特性
- **自动消失** - 3秒后自动消失
- **动画效果** - 平滑的显示和隐藏动画
- **不同类型** - 支持成功、错误、警告、信息四种类型
- **不同位置** - 支持顶部和底部显示

## 使用方式
- `showToast('success', '操作成功')` - 显示成功消息
- `showToast('error', '操作失败', 'bottom')` - 显示底部错误消息