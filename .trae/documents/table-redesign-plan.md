# 表格模块完整重设计划

## 一、分析结论

### 需求文档 vs 当前实现的差距

| 需求功能 | 当前状态 | 需补充 |
|---------|---------|--------|
| 展示类表格（纯外观） | ❌ 未实现 | CSS样式 + parseConfig识别 |
| HTML标记注入 | ✅ 已有 | 完善 |
| API渲染注入 | ✅ 已有 | 完善 |
| 首行冻结(表头) | ✅ sticky top:0 | - |
| 前N行冻结 | ❌ 未实现 | frozenRows配置 |
| 首列冻结 | ✅ left:0 | - |
| 最后一列冻结 | ❌ hasLastCol只有样式 | sticky right:0 |
| 任意列冻结 | ❌ 未实现 | frozenCols配置 |
| 汇总行冻结 | ❌ 未实现 | sticky bottom:0 |
| 组合冻结 | ❌ 未实现 | 多方向sticky |
| 标题区域合并 | ❌ 未实现 | generateTableFromData支持 |
| 冻结列区域合并 | ❌ 未实现 | generateTableFromData支持 |
| 多级表头 | ❌ 未实现 | headers层级结构 |
| 数据类型适配 | 仅文本 | 身份证/手机号格式化 |

### 框架功能 vs 用户二次开发 的边界

| 归属 | 内容 |
|------|------|
| **框架实现** | CSS样式、TableManager/Table类、render/renderCard API、冻结/排序/筛选/分页逻辑、表格包装、事件委托 |
| **用户代码** | 数据加载(fetch/静态)、回调函数定义、容器DOM创建、渲染参数组装 |

---

## 二、修改文件清单

### 框架文件（需修改）
1. `src/modules/css/table.css` - 增加展示类样式、冻结列/行样式、合并单元格样式
2. `src/modules/js/table.js` - 增加renderCard、frozenRows、frozenCols、colspan/rowspan支持、多级表头

### 用户测试文件（需重写）
3. `src/test/table/index.html` - 完整功能测试页

---

## 三、实施步骤