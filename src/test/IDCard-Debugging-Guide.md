# 身份证验证器注册表问题诊断报告

## 问题描述

用户反馈：身份证高级验证器的注册表数据中没有包含省市、生日等详细信息，即使这些信息在身份证验证器的 `parse()` 方法中是正确的。

## 可能的原因

### 1. `updateRegistryState` 方法没有被正确调用

身份证验证器的 `input` 事件监听器应该：
1. 检测到用户输入
2. 调用 `parse()` 方法解析身份证
3. 调用 `updateRegistryState()` 方法将解析结果添加到注册表

但是，如果 `updateRegistryState()` 方法没有被正确调用，注册表中就不会有 `idcard` 属性。

### 2. 注册表节点路径不正确

身份证验证器使用以下路径格式：
```javascript
const form = input.closest('form');
const parentId = form && form.id ? form.id : null;
const path = parentId ? `${parentId}.${input.name}` : input.name;
```

如果注册表中的节点路径与这个格式不匹配，`CUI.input.get(path)` 会返回 `null`，导致无法设置 `idcard` 属性。

### 3. 身份证状态没有被正确添加到注册表节点中

即使节点存在，如果 `updateRegistryState()` 方法的实现有问题，身份证状态也可能没有被正确添加。

## 诊断步骤

### 步骤 1：运行简单测试

打开 `src/test/idcard-simple-test.html` 页面：
1. 在身份证输入框中输入 "11010119900307723X"
2. 点击"检查节点"按钮
3. 查看结果文本框

**预期结果**：
- 节点应该存在
- `idcard` 属性应该存在
- `idcard` 内容应该包含省市、生日等详细信息

**如果 `idcard` 属性不存在**：
点击"手动测试"按钮进行手动测试。

### 步骤 2：检查控制台输出

打开浏览器开发者工具（F12），切换到"Console"标签：
1. 刷新测试页面
2. 在身份证输入框中输入内容
3. 查看控制台输出

**应该看到的信息**：
- `[调试] 身份证节点: {...}`
- `[调试] 身份证 idcard 属性: {...}`

### 步骤 3：检查事件触发

打开 `src/test/idcard-event-test.html` 页面：
1. 在身份证输入框中输入内容
2. 观察调试日志
3. 检查是否正确检测到 `data-validate="idcard-adv"` 属性

## 解决方案

### 方案 1：手动设置 idcard 属性

如果身份证验证器正常工作，但注册表中没有 `idcard` 属性，可以手动设置：

```javascript
// 获取节点
const node = CUI.input.get('formId.idcard');

// 解析身份证
const state = await CUI.idcardValidator.parse('11010119900307723X');

// 手动设置 idcard 属性
node.idcard = state;
```

### 方案 2：修改身份证验证器代码

如果问题出在身份证验证器的 `updateRegistryState` 方法，可以修改该方法，添加调试日志：

```javascript
updateRegistryState(input, state) {
    if (!window.CUI || !window.CUI.input) {
        console.error('[身份证验证器] CUI.input 未加载');
        return;
    }
    
    const form = input.closest('form');
    const parentId = form && form.id ? form.id : null;
    const path = parentId ? `${parentId}.${input.name}` : input.name;
    
    console.log('[身份证验证器] updateRegistryState', {
        path,
        inputName: input.name,
        formId: parentId,
        state: state
    });
    
    const node = window.CUI.input.get(path);
    if (node) {
        node.idcard = state;
        node.value = input.value;
        console.log('[身份证验证器] 已设置 node.idcard', node.idcard);
    } else {
        console.error('[身份证验证器] 节点未找到', path);
    }
}
```

### 方案 3：检查注册表注册时机

如果问题出在注册表节点的注册时机，可以检查 `input` 模块的注册逻辑，确保在身份证验证器初始化之前，输入框已经被正确注册。

## 测试文件列表

1. `src/test/idcard-simple-test.html` - 简单测试
2. `src/test/idcard-event-test.html` - 事件测试
3. `src/test/registry-structure-test.html` - 注册表结构测试
4. `src/test/idcard-complete-test.html` - 完整测试
5. `src/test/idcard-validator-test.html` - 综合测试

## 下一步

1. 运行简单测试，确认问题是否存在
2. 如果问题存在，使用手动测试功能验证身份证解析是否正常
3. 根据诊断结果，选择合适的解决方案
4. 如果需要修改代码，确保修改后进行全面测试
