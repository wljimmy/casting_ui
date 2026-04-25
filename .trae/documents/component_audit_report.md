# Casting UI 组件审计报告

## 一、CSS组件清单

### 1.1 核心样式 (core.css)

#### 容器类组件
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| .container | 基础容器，最大宽度1200px | ⚠️ 部分文档化 |
| .container-fluid | 全宽容器 | ⚠️ 部分文档化 |
| .container-fixed-sm | 固定宽度容器(500px) | ⚠️ 部分文档化 |
| .container-fixed-md | 固定宽度容器(800px) | ⚠️ 部分文档化 |
| .container-fixed-lg | 固定宽度容器(1200px) | ⚠️ 部分文档化 |
| .container-grid-2 | 2列网格容器 | ⚠️ 部分文档化 |
| .container-grid-3 | 3列网格容器 | ⚠️ 部分文档化 |
| .container-grid-4 | 4列网格容器 | ⚠️ 部分文档化 |
| .container-grid-12 | 12列网格容器 | ⚠️ 部分文档化 |

#### 布局类组件
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| .layout-container | 布局容器(侧边栏+内容) | ❌ 未文档化 |
| .layout-top-left-right | 顶部+左侧边栏+右侧内容布局 | ❌ 未文档化 |
| .layout-sidebar | 侧边栏区域 | ❌ 未文档化 |
| .layout-content | 内容区域 | ❌ 未文档化 |
| .layout-header | 头部区域 | ❌ 未文档化 |
| .layout-footer | 底部区域 | ❌ 未文档化 |

#### 工具类组件
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| .section | 区块容器 | ✅ 已文档化 |
| .section-subtitle | 子标题区块 | ✅ 已文档化 |
| .header | 页面头部 | ⚠️ 部分文档化 |
| .spacer-xs/sm/md/lg/xl | 间距占位符 | ⚠️ 部分文档化 |
| .text-muted | 灰色文本 | ⚠️ 部分文档化 |
| .text-serif | 宋体文本 | ⚠️ 部分文档化 |

#### 其他组件
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| .collapse-panel | 折叠面板 | ❌ 未文档化 |
| .transparent-bg-container | 透明背景容器 | ❌ 未文档化 |
| .header-search | 头部搜索框 | ❌ 未文档化 |
| .header-element-right/center | 头部元素位置控制 | ❌ 未文档化 |

### 1.2 组件样式 (components.css)

#### 按钮类
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| .btn | 基础按钮 | ✅ 已文档化 |
| .btn-primary | 主按钮 | ✅ 已文档化 |
| .btn-secondary | 次按钮 | ✅ 已文档化 |
| .btn-text | 文本按钮 | ⚠️ 部分文档化 |
| .btn-icon | 图标按钮 | ⚠️ 部分文档化 |
| .btn-sm/md/lg | 按钮尺寸 | ⚠️ 部分文档化 |
| .btn-loading | 加载中按钮 | ⚠️ 部分文档化 |

#### 表单类
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| .input | 输入框 | ✅ 已文档化 |
| .textarea | 多行输入框 | ✅ 已文档化 |
| .select | 选择框 | ✅ 已文档化 |
| .input-group | 输入组 | ⚠️ 部分文档化 |
| .input-label | 输入标签 | ⚠️ 部分文档化 |
| .radio-group | 单选组 | ⚠️ 部分文档化 |
| .checkbox-group | 复选组 | ⚠️ 部分文档化 |
| .switch | 开关 | ⚠️ 部分文档化 |
| .slider | 滑块 | ❌ 未文档化 |

#### 卡片类
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| .card | 卡片容器 | ✅ 已文档化 |
| .card-size-1~12 | 卡片尺寸(12列网格) | ✅ 已文档化 |
| .card-style-default/glass/borderless | 卡片样式 | ⚠️ 部分文档化 |
| .card-radius-sm/md/lg/none | 卡片圆角 | ⚠️ 部分文档化 |
| .card-height-sm/md/lg | 卡片高度 | ⚠️ 部分文档化 |

#### 数据展示类
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| .table | 表格 | ✅ 已文档化 |
| .table-striped | 斑马纹表格 | ⚠️ 部分文档化 |
| .table-sortable | 可排序表格 | ⚠️ 部分文档化 |
| .list | 列表 | ✅ 已文档化 |
| .list-item | 列表项 | ✅ 已文档化 |
| .list-with-image | 图文列表 | ⚠️ 部分文档化 |
| .badge | 徽章/标签 | ✅ 已文档化 |
| .badge-hot/new/recommend等 | 语义化徽章 | ✅ 已文档化 |
| .progress | 进度条 | ✅ 已文档化 |
| .progress-circle | 环形进度条 | ⚠️ 部分文档化 |
| .image | 图片控件 | ✅ 已文档化 |
| .image-sm/md/lg | 图片尺寸 | ⚠️ 部分文档化 |

#### 反馈类
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| .message | 信息提示 | ✅ 已文档化 |
| .message-info/success/warning/error | 信息类型 | ✅ 已文档化 |
| .toast | Toast提示 | ✅ 已文档化 |
| .loading | 加载动画 | ✅ 已文档化 |
| .skeleton | 骨架屏 | ⚠️ 部分文档化 |
| .overlay | 遮罩层 | ⚠️ 部分文档化 |
| .modal-content | 弹窗内容 | ⚠️ 部分文档化 |

#### 通用UI类
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| .text-lg/md/sm | 文本大小 | ⚠️ 部分文档化 |
| .link | 链接 | ⚠️ 部分文档化 |
| .icon | 图标 | ⚠️ 部分文档化 |
| .divider | 分隔线 | ✅ 已文档化 |
| .placeholder | 占位符 | ❌ 未文档化 |

#### 菜单类
| 类名 | 功能描述 | 手册页状态 |
|------|----------|------------|
| menu | 菜单组件 | ✅ 已文档化 |
| .menu-icon | 菜单图标 | ⚠️ 部分文档化 |
| .menu-badge | 菜单徽章 | ⚠️ 部分文档化 |

### 1.3 MD编辑器样式 (md.css)
- 作为独立模组整体介绍，不拆分CSS类

---

## 二、JS组件清单

### 2.1 核心模块 (core.js)
| 功能/类 | 描述 | 手册页状态 |
|---------|------|------------|
| debug() | 调试函数 | ❌ 未文档化 |
| createOverlay() | 创建遮罩 | ❌ 未文档化 |
| showOverlay() | 显示遮罩 | ❌ 未文档化 |
| hideOverlay() | 隐藏遮罩 | ❌ 未文档化 |
| PopupBase类 | 弹窗基类 | ❌ 未文档化 |

### 2.2 弹窗模块 (modal.js)
| 功能 | 描述 | 手册页状态 |
|------|------|------------|
| showModal() | 显示弹窗 | ✅ 已文档化 |

### 2.3 消息模块 (message.js)
| 功能 | 描述 | 手册页状态 |
|------|------|------------|
| createMessage() | 创建消息提示 | ✅ 已文档化 |
| showToast() | 显示Toast | ✅ 已文档化 |
| showLoading() | 显示加载遮罩 | ✅ 已文档化 |
| hideLoading() | 隐藏加载遮罩 | ✅ 已文档化 |

### 2.4 图片放大模块 (image-zoom.js)
| 功能 | 描述 | 手册页状态 |
|------|------|------------|
| zoomImage() | 放大图片 | ⚠️ 部分文档化 |
| closeImageZoom() | 关闭图片放大 | ⚠️ 部分文档化 |

### 2.5 主题管理器模块 (theme-manager.js)
- **独立模组，整体介绍**
- ThemeManager类：主题管理功能
- 支持主题切换、自定义主题、本地存储

### 2.6 颜色选择器模块 (color-picker.js)
- **独立模组，整体介绍**
- ColorPicker类：颜色选择功能
- 支持弹窗和内联模式

### 2.7 UI模块 (ui.js)
| 功能 | 描述 | 手册页状态 |
|------|------|------------|
| UI类 | UI框架管理 | ❌ 未文档化 |
| initCollapsePanels() | 折叠面板初始化 | ❌ 未文档化 |
| initModals() | 弹窗初始化 | ❌ 未文档化 |
| initToasts() | Toast初始化 | ❌ 未文档化 |
| initImageZoom() | 图片放大初始化 | ❌ 未文档化 |
| initFormValidation() | 表单验证初始化 | ❌ 未文档化 |
| initMenus() | 菜单初始化 | ❌ 未文档化 |

### 2.8 MD编辑器模块 (md.js)
- **独立模组，整体介绍**
- mdParse()：Markdown解析
- htmlToMd()：HTML转Markdown
- 富文本编辑功能

---

## 三、现有手册页面清单

### 3.1 已存在的手册页面

| 路径 | 标题 | 组件覆盖情况 |
|------|------|--------------|
| pages/init-guide/index.html | 初始化指南 | ✅ 完整 |
| pages/basic-layout/index.html | 基础布局组件 | ⚠️ 部分 |
| pages/basic-layout/card-container/index.html | 卡片容器 | ✅ 完整 |
| pages/basic-layout/general-container/index.html | 通用容器 | ⚠️ 部分 |
| pages/interaction-controls/index.html | 交互控件 | ⚠️ 部分 |
| pages/interaction-controls/button-container/index.html | 按钮 | ✅ 完整 |
| pages/interaction-controls/input-container/index.html | 输入框 | ✅ 完整 |
| pages/interaction-controls/select-container/index.html | 选择控件 | ✅ 完整 |
| pages/interaction-controls/md-container/index.html | MD编辑器 | ✅ 完整 |
| pages/interaction-controls/menu-container/index.html | 菜单组件 | ✅ 完整 |
| pages/feedback-components/index.html | 反馈组件 | ⚠️ 部分 |
| pages/feedback-components/modal-container-1/index.html | 弹窗 | ✅ 完整 |
| pages/feedback-components/toast-container/index.html | Toast | ✅ 完整 |
| pages/feedback-components/loading-container/index.html | 加载类 | ✅ 完整 |
| pages/feedback-components/message-container/index.html | 信息提示 | ✅ 完整 |
| pages/data-display/index.html | 数据展示组件 | ⚠️ 部分 |
| pages/data-display/image-container/index.html | 图片控件 | ✅ 完整 |
| pages/data-display/list-container/index.html | 列表 | ✅ 完整 |
| pages/data-display/table-container/index.html | 表格 | ✅ 完整 |
| pages/data-display/badge-container/index.html | 标签/徽章 | ✅ 完整 |
| pages/data-display/progress-container/index.html | 进度条 | ✅ 完整 |
| pages/general-ui/index.html | 通用UI元素 | ⚠️ 部分 |
| pages/general-ui/text-container/index.html | 文本 | ⚠️ 部分 |
| pages/general-ui/icon-container/index.html | 图标 | ⚠️ 部分 |
| pages/general-ui/divider-container/index.html | 分隔组件 | ✅ 完整 |
| pages/general-ui/theme-selector/index.html | 主题选择器 | ✅ 完整 |

### 3.2 已存在的测试页面

| 路径 | 组件 |
|------|------|
| test/badge/index.html | Badge |
| test/menu/index.html | 菜单 |
| test/image-zoom/index.html | 图片放大 |
| test/core/index.html | 核心功能 |
| test/message/index.html | 消息提示 |
| test/modal/index.html | 弹窗 |
| test/color-picker/index.html | 颜色选择器 |
| test/theme-manager/index.html | 主题管理器 |

---

## 四、缺失项识别

### 4.1 缺少手册页面的组件

#### 高优先级（核心功能）
1. **布局容器手册页** - 统一介绍所有布局相关类
   - .layout-container
   - .layout-top-left-right
   - .layout-sidebar/content/header/footer
   
2. **容器类组件手册页** - 统一介绍所有容器类
   - .container, .container-fluid
   - .container-fixed-sm/md/lg
   - .container-grid-2/3/4/12

3. **工具类组件手册页** - 统一介绍工具类
   - .spacer-xs/sm/md/lg/xl
   - .text-muted, .text-serif
   - .placeholder

4. **核心JS功能手册页** - 介绍core.js功能
   - debug()函数
   - 遮罩组件(createOverlay/showOverlay/hideOverlay)
   - PopupBase类

#### 中优先级（表单和交互）
5. **表单类组件补充** - 补充到现有input-container
   - .radio-group, .checkbox-group
   - .switch
   - .slider

6. **折叠面板手册页**
   - .collapse-panel

#### 低优先级（其他）
7. **透明背景容器手册页**
   - .transparent-bg-container

8. **头部组件手册页**
   - .header-search
   - .header-element-right/center

### 4.2 缺少测试页面的组件

1. **布局容器测试** - test/layout-container/
2. **容器类测试** - test/container/
3. **工具类测试** - test/utilities/
4. **折叠面板测试** - test/collapse/
5. **表单控件测试** - test/form-controls/
6. **核心功能测试** - 需要补充test/core/

### 4.3 菜单中缺少的入口

根据现有菜单结构，以下组件需要在菜单中添加：
1. 布局容器（sidebar-layout, header-layout）
2. 按钮子菜单（button-basic, button-icon等）

---

## 五、文档不完整需要补充的组件

### 5.1 需要补充说明的手册页

1. **card-container** - 补充卡片样式和圆角说明
2. **general-container** - 补充所有容器类说明
3. **text-container** - 补充所有文本类说明
4. **icon-container** - 补充图标尺寸和交互说明
5. **image-container** - 补充图片放大功能说明

### 5.2 需要补充代码示例的手册页

1. 所有手册页都需要检查是否使用Prism高亮
2. 补充"引用方法"和"是否涉及JS动态渲染"章节

---

## 六、建议的补充计划

### 第一阶段：核心文档补充（高优先级）
1. 创建布局容器手册页
2. 创建容器类组件手册页
3. 创建工具类组件手册页
4. 创建核心JS功能手册页

### 第二阶段：表单和交互补充（中优先级）
5. 补充表单类组件到现有页面
6. 创建折叠面板手册页

### 第三阶段：测试页面补充
7. 创建缺失的测试页面
8. 更新菜单结构

### 第四阶段：质量检查和版本更新
9. 检查所有手册页的完整性
10. 更新版本号和日志
11. Git提交
