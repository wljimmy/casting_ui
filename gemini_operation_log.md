# Gemini 操作记录 (交接给 Trae)

此文档用于记录 Gemini 在本项目（Casting UI）中的操作日志。由于本项目主要由 Trae 负责开发，Gemini 的开发过程严格遵循 Trae 建立的规范（详见 `.trae/rules/`），并将所有操作记录在此，以便在 Trae 接手时能够无缝同步工作进度。

## 遵循的开发规范摘要
1. **核心理念**：极简配置，使用原生 HTML 结构 + `data-*` 属性。
2. **样式规范**：所有框架相关的类名必须以 `CUI-` 开头，不使用内嵌 `<style>` 编写自定义样式，避免覆盖框架 CSS 变量。
3. **JS 规范**：使用原生 ES6 模块化；全部在 `window.CUI` 命名空间下进行操作，不污染全局 `window`；使用 `CastingDOMObserver` 和事件委托进行事件绑定，禁止内联事件（如 `onclick`）。
4. **外观与内容分离原则**：外观由 CSS 控制，JavaScript 只设置内容，不操作 `style.display`。
5. **Git 规范**：提交信息格式为 `[type]: [module] - [description]`；代码与文档需同步更新；版本号需统一。
6. **文件结构**：模块位于 `src/modules/`，手册页位于 `public/manual/`，发布产物位于 `dist/`。
7. **AI 协作与日志同步（重要）**：所有的开发操作必须实时更新并记录在本文件（`gemini_operation_log.md`）中，**且全项目仅保留这一个交接日志文件**。任何 AI（包括 Gemini 和 Trae）接手时需优先阅读此文件。
---

## 历史操作日志

### [2026-06-09]
- **操作人**: Trae
- **操作内容**:
  1. **身份证高级验证器逐位解析显示功能**：
     - 修改 `_setupDefaultMessages(wrapper)` 方法，检查用户是否设置了 `data-info` 属性
     - 关键词清洗规则：忽略大小写、忽略 -_ 连接符、忽略其他符号，清洗后为 "idinfo" 才启用
     - 如果后面还有别的词汇，则属于用户自定义内容，不做处理
     - 逐位解析显示：从输入满2位开始显示省份信息，逐步显示省市、生日、性别等

  2. **修复逐位解析功能失效问题**：
     - 在 input.js 中添加 `data-info` 属性传递到新的 input 元素
     - 确保 `_setupDefaultMessages` 能正确获取 `data-info` 属性

  3. **修改初始提示词**：
     - 将初始提示词改为"请输入身份证号码"
     - 更新 `_setupDefaultMessages` 和 `updateMessageDisplay` 方法中的提示文本

  4. **修复 blur 事件清空 info 内容的问题**：
     - 当值为空时，只有启用逐位解析才恢复初始提示词
     - 其他情况不动 info 内容（保护用户自定义内容）
     - Error 内容不清除，只通过 CSS 类控制显示/隐藏

  5. **设计原则确认**：
     - Error 内容：通过状态控制显示/隐藏，内容不动（除非必要）
     - Info 内容：只有启用逐位解析时才动态调整，其他情况不动
     - 保持 input.js 基础模块不变，所有 info 元素的创建和更新由 idcard-validator.js 负责

- **状态**: 身份证高级验证模块已完成开发，待测试验证。

### [2026-06-07]
- **操作人**: Trae
- **操作内容**:
  1. **身份证验证模块默认信息设置**：
     - 在 `idcard-validator.js` 中新增 `_setupDefaultMessages(wrapper)` 方法
     - 自动设置默认 Info 提示："请输入正确的中华人民共和国18位身份证"
     - 自动设置默认 Error 错误："身份证号格式不正确"
     - 优先使用用户自定义信息（如果已设置）
     - 使用 DOMObserver 监听新添加的 `idcard-adv` 元素，自动设置默认信息
     - 扫描现有元素并设置默认信息

  2. **测试页面更新**：
     - 更新 `idcard-validator-test.html`，新增"高级身份证验证（自定义信息）"测试用例
     - 展示默认信息与自定义信息的对比效果
     - 更新测试编号，保持有序

- **状态**: 测试页面已更新，展示默认信息与自定义信息的对比效果。

...（省略中间章节）...

### [2026-06-16 第六阶段]
- **操作人**: Trae
- **操作内容**:
  1. **表格异步数据源加载**:
     - `createTable` 新增 `_needsAsyncLoad` 检测文件路径数据源
     - 新增 `_loadDataSource` 方法：fetch 加载远程 JSON → `tableDataManager.parse` 解析
     - 加载完成后调用 `_initTable` 统一初始化流程
     - `parseDataSource` 对文件路径静默跳过（不再输出 debug 日志）

  2. **用户表头驱动的数据渲染**:
     - 新增 `renderTableBody(table, config)` 方法
     - **匹配规则**：
       - 以用户 `<thead>` 设定的表头列名为准
       - 数据源中找不到对应字段的列 → 隐藏（不渲染该列）
       - 数据源中多出的字段（用户表头未定义）→ 忽略
       - 纯数组数据 → 按列顺序填充
     - 数据载入后自动渲染到 `<tbody>`，保持用户 `<thead>` 和 `<tfoot>` 不变

  3. **数据就绪事件**:
     - 展示类表格渲染完成后派发 `cui-table-data-ready` 自定义事件
     - 事件携带 `detail.data`（完整数据）和 `detail.config`
     - 用户可监听此事件处理汇总行等自定义逻辑

  4. **测试页面完全重构**:
     - 移除 `fillTableBody`、`maskIdcard`、`maskPhone` 等手动 JS
     - 使用原生 `<table>` + `<thead>` 定义表头
     - 通过 `data-cui-table='{"dataSource":"..."}'` 指定数据源
     - 框架自动加载数据 + 根据用户表头渲染 + 处理字段匹配
     - "应用"按钮通过 sessionStorage 保存配置后刷新页面刷新配置
     - 页面加载时读取 sessionStorage，在框架模块运行前更新 table 属性
- **状态**: 所有更改均经过 lint 检查，测试页面零手动数据渲染逻辑

### [2026-06-21 第七阶段]
- **操作人**: Trae
- **操作内容**:
  1. **CUITableRegistry 实现**：
     - 新建 `src/modules/js/table-registry.js`，实现单例、注册、数据加载、增删改、事件派发等 API；在全局 `window.CUI.tableRegistry` 暴露实例。
  2. **Table 类重构**：
     - 注入 `CUITableRegistry`，改为从注册表读取配置并渲染；编辑事件写回注册表并派发 `cui-table-data-updated`，完成后派发 `cui-table-data-ready`。
  3. **测试页面更新**：
     - 使用 `CUI.tableRegistry.register` 与 `loadDataSource` 加载数据；移除旧手动填充逻辑，改为监听自定义事件。
  4. **事件系统完善**：
     - 在注册表实现 `dispatchEvent`，确保 `cui-table-data-ready`、`cui-table-data-updated`、`cui-table-config-changed` 能被页面监听。
  5. **遗留代码清理**：
     - 删除 `index` 未使用提示、`fillTableBody`、`maskIdcard`、`maskPhone` 等函数，lint 警告为零。
- **状态**: 表格模块完整重构，注册表机制生效，满足双向同步与标准化渲染需求