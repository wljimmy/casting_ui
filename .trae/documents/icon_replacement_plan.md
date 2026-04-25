# 图标替换计划 - 批量修改手册图标为图标库图标

## 任务分析
需要将手册中涉及到的图标（例如搜索和菜单用的箭头）替换为图标库中的图标，优先使用 outline 图标，使用 `<use href="文件.svg#icon">` 方法引用。

## 任务分解和优先级

### [/] 任务 1: 分析手册中使用的图标
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 遍历所有手册页面，识别使用的图标
  - 记录需要替换的图标位置和类型
- **Success Criteria**:
  - 完成所有手册页面的图标分析
  - 生成需要替换的图标清单
- **Test Requirements**:
  - `programmatic` TR-1.1: 列出所有需要替换的图标及其位置
  - `human-judgement` TR-1.2: 确认清单完整，无遗漏

### [ ] 任务 2: 为每个图标选择合适的 outline 版本
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 从 icon/outline 目录中选择合适的图标
  - 确保每个需要替换的图标都有对应的 outline 版本
- **Success Criteria**:
  - 为所有需要替换的图标找到对应的 outline 版本
  - 记录每个图标的文件路径
- **Test Requirements**:
  - `programmatic` TR-2.1: 验证所有选择的图标文件存在
  - `human-judgement` TR-2.2: 确认选择的图标与原图标功能匹配

### [ ] 任务 3: 批量替换图标为 `<use href="文件.svg#icon">` 格式
- **Priority**: P1
- **Depends On**: Task 2
- **Description**:
  - 编写脚本批量修改手册页面中的图标
  - 使用 `<use href="文件.svg#icon">` 格式引用图标
  - 优先使用 outline 图标
- **Success Criteria**:
  - 所有手册页面中的图标都已替换为图标库图标
  - 使用正确的 `<use href="文件.svg#icon">` 格式
- **Test Requirements**:
  - `programmatic` TR-3.1: 验证所有图标引用路径正确
  - `human-judgement` TR-3.2: 确认图标显示正常，无缺失

### [ ] 任务 4: 测试修改后的图标显示效果
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 启动本地服务器测试所有手册页面
  - 验证图标显示正常
  - 修复可能的路径或显示问题
- **Success Criteria**:
  - 所有手册页面中的图标都能正常显示
  - 无 404 错误或显示异常
- **Test Requirements**:
  - `programmatic` TR-4.1: 验证所有图标文件都能正确加载
  - `human-judgement` TR-4.2: 确认图标显示效果符合预期

### [ ] 任务 5: 清理临时文件和测试文件
- **Priority**: P2
- **Depends On**: Task 4
- **Description**:
  - 删除测试过程中创建的临时文件
  - 清理测试服务器
- **Success Criteria**:
  - 无临时文件残留
  - 测试服务器已停止
- **Test Requirements**:
  - `programmatic` TR-5.1: 验证临时文件已删除
  - `programmatic` TR-5.2: 验证测试服务器已停止

## 实施方法
1. **分析阶段**：使用 grep 命令搜索手册页面中使用的图标
2. **选择阶段**：根据功能匹配选择合适的 outline 图标
3. **替换阶段**：编写 Python 脚本批量替换图标
4. **测试阶段**：启动本地服务器验证图标显示
5. **清理阶段**：删除临时文件，停止测试服务器

## 预期成果
- 所有手册页面中的图标都使用图标库中的 outline 图标
- 图标引用方式统一为 `<use href="文件.svg#icon">` 格式
- 图标显示正常，无错误

## 风险评估
- **风险 1**：某些图标可能没有对应的 outline 版本
  - 应对措施：使用 filled 版本作为备选
- **风险 2**：图标路径引用错误
  - 应对措施：仔细验证路径，使用相对路径
- **风险 3**：图标显示效果不符合预期
  - 应对措施：测试后根据需要调整图标选择
