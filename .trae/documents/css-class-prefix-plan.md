# CSS类名前缀统一化计划

## 一、问题分析

经过对项目中所有CSS文件的分析，发现框架自定义的CSS类存在以下问题：

### 已带 `CUI-` 前缀的文件
- `layout.css` - 大部分类已带前缀（如 `.CUI-layout-web`, `.CUI-sidebar-left`）
- `status.css` - 所有类已带前缀（如 `.CUI-status-bar`, `.CUI-status-dark`）
- `progress.css` - 所有类已带前缀（如 `.CUI-progress-box`, `.CUI-progress-bar`）
- `container.css` - 所有类已带前缀（如 `.CUI-box`, `.CUI-card`, `.CUI-grid`）
- `input.css` - 混合使用（`.input` 和 `.CUI-input` 并存）

### 未带 `CUI-` 前缀的文件
- `components.css` - 大量类名未带前缀，包括：
  - `.card`, `.btn`, `.input`, `.textarea`, `.select`, `.modal-content`, `.message`, `.toast`, `.loading`, `.skeleton`, `.progress`, `.image`, `.list`, `.table`, `.badge`, `.icon`, `.divider` 等
- `menu.css` - 部分类名未带前缀（如 `.menu-active`, `.menu-sidebar`, `.menu-popup`）
- `header.css` - 所有类名都未带前缀（`.header`, `.header-search` 等）

## 二、实施计划

### 阶段1：修改CSS文件

| 文件 | 修改内容 | 估计类数 |
|------|----------|----------|
| `components.css` | 为所有框架类添加 `CUI-` 前缀 | ~80个类 |
| `menu.css` | 为所有框架类添加 `CUI-` 前缀 | ~15个类 |
| `header.css` | 为所有框架类添加 `CUI-` 前缀 | ~8个类 |
| `input.css` | 统一使用 `CUI-input`，移除 `.input` | ~5个类 |

### 阶段2：修改JavaScript文件

| 文件 | 修改内容 | 说明 |
|------|----------|------|
| `modal.js` | 更新类名引用 | 弹窗组件相关 |
| `message.js` | 更新类名引用 | 消息提示组件相关 |
| `menu.js` | 更新类名引用 | 菜单组件相关 |
| `progress.js` | 更新类名引用 | 进度条组件相关 |
| `input.js` | 更新类名引用 | 输入框组件相关 |
| `image-zoom.js` | 更新类名引用 | 图片缩放组件相关 |
| `theme-manager.js` | 更新类名引用 | 主题管理器相关 |
| `ui.js` | 更新类名引用 | UI工具函数相关 |

### 阶段3：修改测试页面

| 文件 | 修改内容 |
|------|----------|
| `theme-manager-test.html` | 更新类名引用 |
| `input-test.html` | 更新类名引用 |

## 三、需要修改的类名清单

### components.css 需要修改的类名

**卡片类**
- `.card` → `.CUI-card`
- `.card-size-*` → `.CUI-card-size-*`
- `.card-height-*` → `.CUI-card-height-*`
- `.card-style-*` → `.CUI-card-style-*`
- `.card-radius-*` → `.CUI-card-radius-*`
- `.card-disabled` → `.CUI-card-disabled`

**按钮类**
- `.btn` → `.CUI-btn`
- `.btn-*` → `.CUI-btn-*`

**输入类**
- `.input` → `.CUI-input`
- `.textarea` → `.CUI-textarea`
- `.select` → `.CUI-select`
- `.date-input` → `.CUI-date-input`
- `.input-group` → `.CUI-input-group`
- `.input-label` → `.CUI-input-label`
- `.input-hint` → `.CUI-input-hint`
- `.input-error` → `.CUI-input-error`

**表单控件类**
- `.radio-group` → `.CUI-radio-group`
- `.radio-item` → `.CUI-radio-item`
- `.checkbox-group` → `.CUI-checkbox-group`
- `.checkbox-item` → `.CUI-checkbox-item`
- `.switch` → `.CUI-switch`
- `.switch-slider` → `.CUI-switch-slider`
- `.slider` → `.CUI-slider`

**遮罩/弹窗类**
- `.overlay` → `.CUI-overlay`
- `.overlay-transparent` → `.CUI-overlay-transparent`
- `.overlay-glass` → `.CUI-overlay-glass`
- `.modal-content` → `.CUI-modal-content`
- `.modal-header` → `.CUI-modal-header`
- `.modal-title` → `.CUI-modal-title`
- `.modal-close` → `.CUI-modal-close`
- `.modal-body` → `.CUI-modal-body`
- `.modal-footer` → `.CUI-modal-footer`

**消息提示类**
- `.message` → `.CUI-message`
- `.message-info` → `.CUI-message-info`
- `.message-success` → `.CUI-message-success`
- `.message-warning` → `.CUI-message-warning`
- `.message-error` → `.CUI-message-error`
- `.toast` → `.CUI-toast`
- `.toast-*` → `.CUI-toast-*`

**加载/骨架类**
- `.loading` → `.CUI-loading`
- `.loading-overlay` → `.CUI-loading-overlay`
- `.skeleton` → `.CUI-skeleton`
- `.skeleton-*` → `.CUI-skeleton-*`

**进度条类**
- `.progress` → `.CUI-progress`
- `.progress-bar` → `.CUI-progress-bar`
- `.progress-circle` → `.CUI-progress-circle`
- `.progress-segmented` → `.CUI-progress-segmented`
- `.progress-segment` → `.CUI-progress-segment`

**图片类**
- `.image` → `.CUI-image`
- `.image-*` → `.CUI-image-*`

**列表/表格类**
- `.list` → `.CUI-list`
- `.list-item` → `.CUI-list-item`
- `.list-with-image` → `.CUI-list-with-image`
- `.list-scrollable` → `.CUI-list-scrollable`
- `.list-with-actions` → `.CUI-list-with-actions`
- `.table` → `.CUI-table`
- `.table-striped` → `.CUI-table-striped`
- `.table-sortable` → `.CUI-table-sortable`

**徽章类**
- `.badge` → `.CUI-badge`
- `.badge-*` → `.CUI-badge-*`

**文本/链接类**
- `.text-lg`, `.text-md`, `.text-sm`, `.text-muted` → 添加前缀
- `.link`, `.link-underline`, `.link-disabled` → 添加前缀

**图标类**
- `.icon` → `.CUI-icon`
- `.icon-sm`, `.icon-md`, `.icon-lg`, `.icon-clickable` → 添加前缀

**分隔线/间距类**
- `.divider` → `.CUI-divider`
- `.divider-dashed` → `.CUI-divider-dashed`
- `.divider-vertical` → `.CUI-divider-vertical`
- `.spacer-*` → `.CUI-spacer-*`
- `.placeholder` → `.CUI-placeholder`

**毛玻璃效果类**
- `.glass-bg` → `.CUI-glass-bg`
- `.glass-bg-dark` → `.CUI-glass-bg-dark`
- `.glass-fg` → `.CUI-glass-fg`

### menu.css 需要修改的类名
- `.menu-active` → `.CUI-menu-active`
- `.menu-icon-container` → `.CUI-menu-icon-container`
- `.menu-icon` → `.CUI-menu-icon`
- `.menu-text` → `.CUI-menu-text`
- `.menu-expand-icon` → `.CUI-menu-expand-icon`
- `.menu-closed` → `.CUI-menu-closed`
- `.menu-opened` → `.CUI-menu-opened`
- `.menu-sidebar` → `.CUI-menu-sidebar`
- `.menu-popup` → `.CUI-menu-popup`
- `.menu-inline` → `.CUI-menu-inline`
- `.menu-hidden` → `.CUI-menu-hidden`
- `.menu-visible` → `.CUI-menu-visible`
- `.menu-divider` → `.CUI-menu-divider`
- `.head-menu-opened` → `.CUI-head-menu-opened`

### header.css 需要修改的类名
- `.header` → `.CUI-header`
- `.header-element-right` → `.CUI-header-element-right`
- `.header-element-center` → `.CUI-header-element-center`
- `.header-search` → `.CUI-header-search`
- `.header-search-input` → `.CUI-header-search-input`
- `.header-search-icon` → `.CUI-header-search-icon`

## 四、风险评估与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| JS文件中动态添加的类名未更新 | 组件功能失效 | 全局搜索类名引用，逐一检查 |
| HTML测试页面未更新 | 测试页面样式失效 | 检查所有测试HTML文件 |
| 第三方库冲突 | 样式覆盖问题 | 确保前缀唯一性 |
| 用户自定义样式冲突 | 用户样式被覆盖 | 使用 `CUI-` 前缀区分框架类 |

## 五、验证步骤

1. 修改完成后运行构建命令验证CSS语法
2. 启动开发服务器预览效果
3. 检查各组件功能是否正常
4. 检查响应式布局是否正常
5. 检查主题切换是否正常

---

**计划状态**：待审批

**预计工作量**：约2小时（CSS修改约1小时，JS和HTML修改约1小时）
