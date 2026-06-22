# Tasks
- [x] Task 1: 创建 CUITableRegistry (src/modules/js/table-registry.js)
  - [x] SubTask 1.1: 实现单例模式与内部 Map 存储
  - [x] SubTask 1.2: 实现 `register(tableId, config)`，支持初始配置（type、dataSource、freeze 等）
  - [x] SubTask 1.3: 实现 `loadDataSource(tableId, src)`，使用 fetch + tableDataManager.parse，解析为统一结构并保存
  - [x] SubTask 1.4: 实现 `getData`, `setData`, `destroy`, `recreate`, `onChange`
  - [x] SubTask 1.5: 实现 `toggleMask`, `setDisplayMode` API

- [x] Task 2: 修改 Table 类以使用 CUITableRegistry
  - [x] SubTask 2.1: 注入 registry 实例；在 `createTable` 中改为 `registry.register` 并读取配置
  - [x] SubTask 2.2: 移除 `_needsAsyncLoad` 与 `_loadDataSource`，改为由 registry 负责加载
  - [x] SubTask 2.3: 在 `setupCellEvents` 中捕获编辑（contenteditable/input），调用 `registry.setData` 并派发 `cui-table-data-updated`
  - [x] SubTask 2.4: 在 `_initTable` 完成后派发 `cui-table-data-ready`
  - [x] SubTask 2.5: 清理旧 `renderTableBody`、`fillTableBody` 相关代码，保留仅用于从 registry 渲染

- [x] Task 3: 更新测试页面使用新注册表 API
  - [x] SubTask 3.1: 在页面 `<script>` 中调用 `CUI.tableRegistry.register('test-table', {type:'display'})`
  - [x] SubTask 3.2: 调用 `CUI.tableRegistry.loadDataSource('test-table', '/测试用数据/仿真测试数据（JSON格式）.json')`
  - [x] SubTask 3.3: 移除旧的手动 fill、mask 函数，改为监听 `cui-table-data-ready` / `cui-table-data-updated`

- [x] Task 4: 完善事件系统
  - [x] SubTask 4.1: 在 CUITableRegistry 中实现 `dispatchEvent(tableId, eventName, detail)`
  - [x] SubTask 4.2: 确保 `cui-table-data-ready`, `cui-table-data-updated`, `cui-table-config-changed` 能被页面监听

- [x] Task 5: 清理遗留代码与诊断
  - [x] SubTask 5.1: 删除 `index` 未使用提示（line 629）并移除相关注释
  - [x] SubTask 5.2: 删除 `fillTableBody`, `maskIdcard`, `maskPhone` 等不再使用的函数
  - [x] SubTask 5.3: 运行 lint 检查并修复警告

- [x] Task 6: 更新日志文件 `gemini_operation_log.md`，记录第七阶段重构工作

- [x] Task 7: 编写单元测试覆盖 CUITableRegistry 基本功能（register、loadDataSource、setData、事件派发）

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1 and Task 2
- Task 4 depends on Task 1
- Task 5 depends on Task 2
- Task 6 depends on Task 1-5
- Task 7 depends on Task 1-4