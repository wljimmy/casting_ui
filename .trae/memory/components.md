# 组件记忆

## 基础布局组件

### 卡片容器
- **功能**：提供不同尺寸、样式和状态的卡片
- **类名**：
  - `.card` - 基础卡片类
  - `.card-size-1` 到 `.card-size-12` - 不同宽度的卡片
  - `.card-style-default` - 默认样式
  - `.card-style-glass` - 毛玻璃样式
  - `.card-style-borderless` - 无边框样式
  - `.card-radius-sm/md/lg/none` - 不同圆角
  - `.card-disabled` - 禁用状态
  - `.card-height-auto` - 高度自适应
- **使用场景**：展示内容、数据卡片、功能模块

### 通用容器
- **功能**：提供不同类型的容器
- **类名**：
  - `.container-fluid` - 流式容器
  - `.container-fixed-sm` - 小固定宽容器
  - `.container-grid-3` - 3列网格容器
  - `.collapse-panel` - 折叠面板
  - `.layout-container` - 侧边布局容器
- **使用场景**：页面布局、内容组织、响应式设计

## 交互控件

### 按钮
- **功能**：提供不同尺寸、样式和状态的按钮
- **类名**：
  - `.btn` - 基础按钮类
  - `.btn-primary/secondary/text` - 不同样式
  - `.btn-sm/md/lg` - 不同尺寸
  - `.btn-icon` - 图标按钮
  - `.btn-loading` - 加载状态
- **使用场景**：操作触发、表单提交、功能按钮

### 输入框
- **功能**：提供不同类型和状态的输入框
- **类名**：
  - `.input` - 基础输入框
  - `.textarea` - 多行输入框
  - `.input-group` - 输入组
  - `.input-label` - 输入标签
  - `.input-hint` - 提示信息
  - `.input-error` - 错误信息
  - `.error/success` - 错误/成功状态
- **使用场景**：表单输入、用户输入、数据采集

### 选择控件
- **功能**：提供单选框、复选框、下拉选择器、开关和滑块
- **类名**：
  - `.radio-group` - 单选框组
  - `.checkbox-group` - 复选框组
  - `.select` - 下拉选择器
  - `.switch` - 开关
  - `.slider` - 滑块
- **使用场景**：选项选择、配置设置、数据筛选

## 反馈组件

### 弹窗
- **功能**：提供不同类型和位置的弹窗
- **类名**：
  - `.modal-content` - 弹窗内容
  - `.modal-header` - 弹窗头部
  - `.modal-body` - 弹窗主体
  - `.modal-footer` - 弹窗底部
  - `.modal-top/bottom/left/right` - 不同位置
- **使用场景**：信息展示、确认操作、表单输入

### Toast
- **功能**：提供不同类型和位置的消息提示
- **类名**：
  - `.toast` - 基础Toast类
  - `.toast-success/error/warning/info` - 不同类型
  - `.toast-top/bottom` - 不同位置
- **使用场景**：操作结果提示、系统通知、状态更新

### 加载动画
- **功能**：提供不同尺寸的加载动画和骨架屏
- **类名**：
  - `.loading` - 基础加载动画
  - `.loading-sm/md/lg` - 不同尺寸
  - `.skeleton` - 骨架屏
  - `.skeleton-card/list/table` - 不同类型骨架屏
- **使用场景**：数据加载、操作处理、页面过渡

## 数据展示组件

### 图片控件
- **功能**：提供不同尺寸和样式的图片展示
- **类名**：
  - `.image` - 基础图片类
  - `.image-sm/md/lg` - 不同尺寸
  - `.image-rounded` - 圆角图片
  - `.image-square` - 方形图片
  - `.image-with-title` - 带标题图片
- **使用场景**：图片展示、产品图片、用户头像

### 列表
- **功能**：提供不同类型的列表
- **类名**：
  - `.list` - 基础列表类
  - `.list-item` - 列表项
  - `.list-with-image` - 图文列表
  - `.list-with-actions` - 带操作按钮列表
  - `.list-scrollable` - 可滑动列表
- **使用场景**：数据列表、导航菜单、选项列表

### 表格
- **功能**：提供不同样式的表格
- **类名**：
  - `.table` - 基础表格类
  - `.table-striped` - 斑马纹表格
  - `.table-collapse` - 移动端折叠表格
  - `.table-responsive` - 响应式表格
- **使用场景**：数据展示、报表、信息列表

### 标签/徽章
- **功能**：提供不同尺寸、样式和状态的标签/徽章
- **类名**：
  - `.badge` - 基础徽章类
  - `.badge-sm/md/lg` - 不同尺寸
  - `.badge-primary/success/warning/error` - 不同样式
  - `.badge-outline` - 描边样式
  - `.badge-with-count` - 带数字角标
  - `.badge-closeable` - 可关闭徽章
- **使用场景**：状态标记、分类标签、通知计数

### 进度条
- **功能**：提供不同尺寸的线性进度条
- **类名**：
  - `.progress` - 基础进度条
  - `.progress-sm/md/lg` - 不同尺寸
  - `.progress-bar` - 进度条填充
- **使用场景**：任务进度、加载进度、完成度展示

## 通用UI元素

### 文本
- **功能**：提供不同样式的文本
- **使用场景**：标题、正文、说明文字

### 图标
- **功能**：提供内置图标
- **使用场景**：按钮图标、状态图标、导航图标

### 分隔组件
- **功能**：提供页面分隔线
- **使用场景**：内容分隔、区域划分