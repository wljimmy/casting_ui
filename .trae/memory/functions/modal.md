# 弹窗系统功能记忆

## 功能描述
- **功能**：提供不同类型和位置的弹窗
- **实现**：
  - `showModal(options)` - 显示弹窗，返回Promise
  - `showModalById(id)` - 根据ID显示预设弹窗

## 参数说明
- **title** - 弹窗标题
- **content** - 弹窗内容
- **buttons** - 按钮配置
- **position** - 弹窗位置
- **glass** - 是否使用毛玻璃效果
- **inputs** - 输入框配置

## 返回值
- **Promise** - 包含操作结果和输入内容
  - `status` - 操作状态（success, closed, error）
  - `button` - 点击的按钮信息
  - `inputs` - 输入内容

## 预设弹窗
- **modal1** - 信息弹窗
- **modal2** - 确认弹窗
- **modal3** - 顶部弹窗
- **modal4** - 底部弹窗
- **modal5** - 毛玻璃弹窗
- **modal6** - 带输入框的弹窗
- **modal7** - 左侧弹窗
- **modal8** - 右侧弹窗

## 使用方式
- `showModalById('modal1')` - 显示信息弹窗
- `showModal({title: '标题', content: '内容'})` - 自定义弹窗