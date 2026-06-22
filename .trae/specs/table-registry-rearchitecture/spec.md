# 表格模块重构 Spec

## Why
为实现表格数据与 UI 的双向同步、统一数据入口以及符合 "HTML 编写 → 框架渲染" 的设计理念，需要在表格模块上引入类似 Input 的注册表机制并彻底重构渲染流程。

## What Changes
- **新增 CUITableRegistry**：全局单例，负责表格数据的注册、读取、写入、加载数据源、销毁与重建。
- **Table 类改造**：构造函数接受 `registry`，在初始化时从 `registry` 拉取配置；编辑事件自动写回 `registry` 并派发 `cui-table-data-updated` 事件。
- **数据源统一入口**：`CUITableRegistry.loadDataSource(tableId, src)` 负责 `fetch` 并解析为标准结构，内部使用 `tableDataManager`。
- **彻底销毁并重建**：`registry.destroy(tableId)` 移除旧表格 DOM 与事件，`registry.recreate(tableId)` 重新创建符合框架标准的 `<table>` 并绑定数据。
- **新增统一事件**：`cui-table-data-ready`（首次渲染完成），`cui-table-data-updated`（单元格编辑后），`cui-table-config-changed`（冻结、功能切换等配置变更）。
- **显示层 API**：`registry.toggleMask(tableId, true/false)`、`registry.setDisplayMode(tableId, 'display'|'functional')`，自动刷新视图而不影响底层数据。
- **清理旧实现**：删除 `index` 未使用提示、移除手动填充函数 (`fillTableBody`, `maskIdcard`, `maskPhone`)。
- **文档与日志**：更新 `gemini_operation_log.md` 记录本次重构。

## Impact
- **受影响的能力**：表格渲染、数据解析、交互事件、冻结功能、功能表格切换。
- **受影响的代码**：`src/modules/js/table.js`、`src/modules/js/table-registry.js`（新建）、`src/test/table/index.html`（需要更新调用方式）、相关 CSS 可能保持不变。

## ADDED Requirements
### Requirement: Table Registry
系统必须提供 `CUITableRegistry`，具备以下方法：
- `register(tableId, config)`：注册表格并保存初始配置。
- `loadDataSource(tableId, src)`：异步加载 JSON/CSV/文本数据并解析为 `{headers, data, footerData}`，随后调用 `recreate`。
- `getData(tableId)` / `setData(tableId, data)`：获取/设置表格数据，调用后自动刷新 UI。
- `destroy(tableId)`：销毁表格实例及其 DOM。
- `recreate(tableId)`：基于当前配置重新生成符合框架规范的 `<table>` 并挂载。
- `onChange(tableId, callback)`：注册数据变化回调。

#### Scenario: Success case
- **WHEN** 开发者在页面中写 `<table id="myTable" data-cui-table='{"type":"display"}'></table>` 并在脚本中调用 `CUI.tableRegistry.register('myTable', {...})`。
- **THEN** 框架自动加载数据、渲染表格，并在用户编辑单元格后 `registry.setData` 更新，`cui-table-data-updated` 事件被触发，业务代码可以实时获取最新数据。

## MODIFIED Requirements
### Requirement: Existing Table Rendering
原有 `Table.render`、`Table.createTable`、`renderTableBody` 的行为将被简化，只负责从 `registry` 读取已有数据进行渲染，不再直接处理 `dataSource`。相关实现细节将在任务中完成。

## REMOVED Requirements
### Requirement: Manual Data Injection via JS in Test Page
**Reason**: 由 `CUITableRegistry` 统一管理，手动在页面脚本中自行填充 `<tbody>` 的方式将被废除。
**Migration**: 使用 `CUI.tableRegistry.loadDataSource('test-table', '/测试用数据/仿真测试数据（JSON格式）.json')` 取代旧的 `fetch` + 手动渲染逻辑。
