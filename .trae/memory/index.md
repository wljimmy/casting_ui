# UI框架记忆索引

## 项目结构
- `index.html` - 主页面，包含基础布局和导航菜单
- `style.css` - 框架样式文件
- `app.js` - 框架功能文件
- `pages/` - 子页面文件夹
  - `basic-layout/` - 基础布局组件
    - `card-container/` - 卡片容器
    - `general-container/` - 通用容器
  - `interaction-controls/` - 交互控件
    - `button-container/` - 按钮
    - `input-container/` - 输入框
    - `select-container/` - 选择控件
  - `feedback-components/` - 反馈组件
    - `modal-container-1/` - 弹窗
    - `toast-container/` - Toast
    - `loading-container/` - 加载类
  - `data-display/` - 数据展示组件
    - `image-container/` - 图片控件
    - `list-container/` - 列表
    - `table-container/` - 表格
    - `badge-container/` - 标签/徽章
    - `progress-container/` - 进度条
  - `general-ui/` - 通用UI元素
    - `text-container/` - 文本
    - `icon-container/` - 图标
    - `divider-container/` - 分隔组件

## 记忆文件结构
- `.trae/memory/` - 记忆文件文件夹
  - `index.md` - 记忆索引
  - `project-structure.md` - 项目结构
  - `tech-stack.md` - 技术栈
  - `components/` - 组件记忆
    - `basic-layout.md` - 基础布局组件
    - `interaction-controls.md` - 交互控件
    - `feedback-components.md` - 反馈组件
    - `data-display.md` - 数据展示组件
    - `general-ui.md` - 通用UI元素
  - `functions/` - 功能记忆
    - `dynamic-loading.md` - 动态页面加载
    - `modal.md` - 弹窗系统
    - `toast.md` - Toast消息
    - `loading.md` - 加载动画
    - `image-zoom.md` - 图片放大
    - `overlay.md` - 遮罩组件
    - `message.md` - 消息提示组件
    - `debug.md` - 调试功能
  - `tech-implementation/` - 技术实现
    - `responsive-design.md` - 响应式设计
    - `performance-optimization.md` - 性能优化
    - `animation.md` - 动画效果

## 核心功能
1. 动态页面加载 - 通过fetch API加载子页面
2. 响应式布局 - 适配手机/Pad/PC
3. 组件库 - 包含多种UI组件
4. 交互功能 - 弹窗、Toast、加载动画等
5. 调试功能 - 可开关的调试模式

## 技术栈
- 原生HTML5
- CSS3 (Flex+Grid+容器查询)
- JavaScript (ES6+)
- 无依赖

## 最近更新
- 2026-03-21: 完成内容拆分和动态加载功能
- 2026-03-21: 测试应用并确保所有功能正常工作
- 2026-03-21: 整理记忆，创建细粒度的记忆文件结构
- 2026-03-21: 实现grid布局，留出header高度
- 2026-03-21: 拆分二级菜单到独立页面