# 调试功能记忆

## 功能描述
- **功能**：提供可开关的调试模式
- **实现**：`debug(action, element, details)`

## 参数说明
- **action** - 操作名称
- **element** - 操作的元素
- **details** - 详细信息

## 配置
- **DEBUG_MODE** - 调试模式开关，设置为true启用调试

## 特性
- **控制台输出** - 在控制台显示详细的操作日志
- **可开关** - 可以通过修改DEBUG_MODE变量来开关调试模式
- **详细信息** - 显示操作名称、元素信息和详细参数

## 使用方式
- `debug('显示弹窗', options)` - 记录弹窗显示操作
- `debug('点击按钮', buttonElement, {buttonId: button.id})` - 记录按钮点击操作

## 应用场景
- 开发调试
- 功能测试
- 问题定位