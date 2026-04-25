# 消息提示组件功能记忆

## 功能描述
- **功能**：提供不同类型的消息提示
- **实现**：`createMessage(options)`

## 参数说明
- **title** - 消息标题
- **content** - 消息内容
- **type** - 消息类型（info, success, warning, error）
- **duration** - 自动消失时间
- **position** - 消息位置
- **container** - 容器元素

## 特性
- **自动消失** - 可配置的自动消失时间
- **不同类型** - 支持信息、成功、警告、错误四种类型
- **灵活定位** - 可以显示在指定元素下方或容器末尾
- **动画效果** - 平滑的显示和隐藏动画

## 使用方式
- `createMessage({title: '信息', content: '这是一条信息', type: 'info'})` - 显示信息消息
- `createMessage({title: '成功', content: '操作成功', type: 'success', duration: 5000})` - 显示5秒后消失的成功消息

## 应用场景
- 操作结果提示
- 表单验证提示
- 系统通知