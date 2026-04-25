# 功能记忆

## 核心功能

### 1. 动态页面加载
- **功能**：通过点击左侧菜单动态加载对应子页面
- **实现**：使用fetch API获取子页面HTML内容，然后插入到主页面的内容容器中
- **代码位置**：index.html中的loadPage函数
- **使用方式**：点击左侧菜单中的链接，自动加载对应页面

### 2. 弹窗系统
- **功能**：提供不同类型和位置的弹窗
- **实现**：
  - `showModal(options)` - 显示弹窗，返回Promise
  - `showModalById(id)` - 根据ID显示预设弹窗
- **参数**：
  - `title` - 弹窗标题
  - `content` - 弹窗内容
  - `buttons` - 按钮配置
  - `position` - 弹窗位置
  - `glass` - 是否使用毛玻璃效果
  - `inputs` - 输入框配置
- **返回值**：Promise，包含操作结果和输入内容

### 3. Toast消息
- **功能**：提供不同类型和位置的消息提示
- **实现**：`showToast(type, message, position)`
- **参数**：
  - `type` - 消息类型（success, error, warning, info）
  - `message` - 消息内容
  - `position` - 消息位置（top, bottom）
- **特性**：自动消失，带有动画效果

### 4. 加载动画
- **功能**：提供全局加载遮罩
- **实现**：`showLoading()`
- **特性**：自动消失，带有动画效果

### 5. 图片放大
- **功能**：点击图片显示放大效果
- **实现**：
  - `zoomImage(src)` - 放大图片
  - `closeImageZoom()` - 关闭图片放大
- **特性**：全屏显示，支持点击关闭

### 6. 遮罩组件
- **功能**：提供半透明和毛玻璃遮罩
- **实现**：
  - `createOverlay(options)` - 创建遮罩
  - `showOverlay(options)` - 显示遮罩
  - `hideOverlay(id)` - 隐藏遮罩
- **参数**：
  - `id` - 遮罩ID
  - `type` - 遮罩类型（transparent, glass）
  - `zIndex` - 层级

### 7. 消息提示组件
- **功能**：提供不同类型的消息提示
- **实现**：`createMessage(options)`
- **参数**：
  - `title` - 消息标题
  - `content` - 消息内容
  - `type` - 消息类型（info, success, warning, error）
  - `duration` - 自动消失时间
  - `position` - 消息位置
  - `container` - 容器元素

### 8. 调试功能
- **功能**：提供可开关的调试模式
- **实现**：`debug(action, element, details)`
- **配置**：`DEBUG_MODE` 变量控制
- **使用**：在控制台显示详细的操作日志

## 工具函数

### 1. 折叠面板
- **功能**：实现面板的展开和收起
- **实现**：在UI.initCollapsePanels()中初始化
- **使用**：点击面板头部切换展开/收起状态

### 2. 导航菜单
- **功能**：处理菜单点击和激活状态
- **实现**：在index.html中的事件监听器
- **特性**：支持二级菜单，自动更新激活状态

## 技术实现

### 1. 响应式设计
- **实现**：使用Flexbox、Grid和媒体查询
- **特性**：适配手机、平板和桌面设备

### 2. 性能优化
- **实现**：
  - `content-visibility: auto` - 优化渲染性能
  - 图片懒加载 - `loading="lazy"`
  - 动态加载页面 - 减少初始加载时间

### 3. 动画效果
- **实现**：使用CSS transitions
- **特性**：平滑的过渡效果，提升用户体验

### 4. 模块化设计
- **实现**：
  - 页面按功能分类拆分
  - 功能按模块组织
  - 代码结构清晰，易于维护