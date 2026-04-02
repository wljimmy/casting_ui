# 主题管理模块 API 文档

## 模块版本
- 版本: v0.3.0
- 更新日期: 2026-04-03

## 模块功能
主题管理模块提供主题切换和自定义功能，支持内置主题和自定义主题。

## 主题数据结构

### 主题对象
```javascript
{
  name: String,          // 主题名称
  description: String,   // 主题描述
  isDefault: Boolean,    // 是否为预设主题
  colors: {
    'primary-color': String,   // 主色调
    'bg-color': String,        // 背景色
    'text-primary': String,    // 主要文本色
    'text-secondary': String,  // 次要文本色
    'text-light': String,      // 辅助文本色
    'text-disabled': String,   // 禁用文本色
    'border-color': String,    // 边框色
    'gray-100': String,        // 浅灰色
    'gray-200': String,        // 中灰色
    'gray-300': String,        // 深灰色
    'success-color': String,   // 成功色
    'warning-color': String,   // 警告色
    'error-color': String,     // 错误色
    'info-color': String       // 信息色
  }
}
```

## API 方法

### ThemeManager 类

#### constructor()
**功能**: 创建主题管理器实例

**使用示例**:
```javascript
const themeManager = new ThemeManager();
```

#### init()
**功能**: 初始化主题管理器，加载主题配置和自定义主题

**返回值**:
- Promise<void>: 异步初始化完成

**使用示例**:
```javascript
await themeManager.init();
```

**说明**:
- 从 `/themes.json` 加载预设主题
- 从 localStorage 加载自定义主题
- 恢复上次使用的主题

#### applyTheme(theme)
**功能**: 应用指定主题

**参数**:
- `theme` (Object): 主题对象，包含 name、description、colors 等属性

**使用示例**:
```javascript
const theme = {
  name: '自定义主题',
  description: '我的自定义配色',
  colors: {
    'primary-color': '#165DFF',
    'bg-color': '#FFFFFF',
    'text-primary': '#303133',
    // ... 其他颜色
  }
};
themeManager.applyTheme(theme);
```

#### addTheme(theme)
**功能**: 添加自定义主题

**参数**:
- `theme` (Object): 主题对象
  - `name` (String): 主题名称（必须唯一）
  - `description` (String): 主题描述
  - `colors` (Object): 颜色配置对象

**返回值**:
- Object: 添加的主题对象

**异常**:
- Error: 主题名称已存在时抛出错误

**使用示例**:
```javascript
const newTheme = {
  name: '我的主题',
  description: '自定义配色方案',
  colors: {
    'primary-color': '#ff6b6b',
    'bg-color': '#f8f9fa',
    // ... 其他颜色
  }
};

try {
  themeManager.addTheme(newTheme);
  console.log('主题添加成功');
} catch (error) {
  console.error(error.message); // "主题名称已存在"
}
```

#### editTheme(index, theme)
**功能**: 编辑自定义主题

**参数**:
- `index` (Number): 主题在列表中的索引
- `theme` (Object): 更新后的主题对象

**返回值**:
- Boolean: 编辑成功返回 true，失败返回 false

**异常**:
- Error: 主题名称已存在时抛出错误

**使用示例**:
```javascript
const updatedTheme = {
  name: '更新的主题',
  description: '更新后的描述',
  colors: {
    'primary-color': '#165DFF',
    // ... 其他颜色
  }
};

const success = themeManager.editTheme(0, updatedTheme);
if (success) {
  console.log('主题编辑成功');
}
```

#### deleteTheme(index)
**功能**: 删除自定义主题

**参数**:
- `index` (Number): 主题在列表中的索引

**返回值**:
- Boolean: 删除成功返回 true，失败返回 false

**使用示例**:
```javascript
const success = themeManager.deleteTheme(0);
if (success) {
  console.log('主题删除成功');
}
```

**说明**:
- 只能删除非预设主题
- 如果删除的是当前主题，会自动切换到默认主题

#### openThemeSelector(options)
**功能**: 打开主题选择器弹窗

**参数**:
- `options` (Object): 可选配置
  - `inline` (Boolean): 是否为内联模式，默认为 false
  - `container` (DOMElement): 内联模式的容器元素

**返回值**:
- Promise<Object>: 返回选中的主题对象

**使用示例**:
```javascript
// 弹窗模式
try {
  const selectedTheme = await themeManager.openThemeSelector();
  console.log('选中的主题:', selectedTheme.name);
} catch (error) {
  console.log('用户取消了选择');
}

// 内联模式
const container = document.getElementById('theme-container');
themeManager.openThemeSelector({
  inline: true,
  container: container
});
```

#### getCurrentTheme()
**功能**: 获取当前应用的主题

**返回值**:
- Object: 当前主题对象

**使用示例**:
```javascript
const currentTheme = themeManager.getCurrentTheme();
console.log('当前主题:', currentTheme.name);
```

#### getThemes()
**功能**: 获取所有主题列表

**返回值**:
- Array: 主题对象数组

**使用示例**:
```javascript
const themes = themeManager.getThemes();
themes.forEach(theme => {
  console.log(theme.name, theme.isDefault ? '(预设)' : '(自定义)');
});
```

## 主题选择器界面

主题选择器提供以下功能：

1. **主题列表展示**
   - 网格布局展示所有主题
   - 显示主题名称、描述、颜色预览
   - 标记预设主题和自定义主题
   - 当前主题高亮显示

2. **主题管理**
   - 添加新主题
   - 编辑自定义主题
   - 删除自定义主题

3. **主题编辑**
   - 主题名称输入
   - 主题描述输入
   - 14种颜色配置（使用颜色选择器）
   - 实时预览效果

4. **示例组件**
   - 展示主题在实际组件中的效果
   - 包括按钮、标签、文本、背景等

## 预设主题

框架内置13种预设主题：

1. **极简高级蓝** - 默认主题，科技感与高级感兼具
2. **墨黑酒红** - 复古高级，氛围感拉满
3. **暖白橙** - 温暖、友好、亲和
4. **深空灰** - 沉稳、专业、科技感
5. **奶油米** - 柔和、自然、文艺
6. **森绿** - 自然、健康、清新
7. **薰衣草紫** - 优雅、浪漫、女性化
8. **焦糖棕** - 复古、温暖、质感
9. **薄荷绿** - 清新、现代、活力
10. **玫瑰粉** - 温柔、甜美、浪漫
11. **深海蓝** - 深邃、专业、商务
12. **珊瑚橙** - 活力、热情、醒目
13. **石墨黑** - 极简、高端、神秘

## 使用示例

### 基本使用
```javascript
// 创建并初始化主题管理器
const themeManager = new ThemeManager();
await themeManager.init();

// 打开主题选择器
try {
  const theme = await themeManager.openThemeSelector();
  console.log('已切换到主题:', theme.name);
} catch (error) {
  console.log('取消选择');
}
```

### 自定义主题
```javascript
// 添加自定义主题
const myTheme = {
  name: '品牌主题',
  description: '公司品牌配色',
  colors: {
    'primary-color': '#1890ff',
    'bg-color': '#f0f2f5',
    'text-primary': '#262626',
    'text-secondary': '#595959',
    'text-light': '#8c8c8c',
    'text-disabled': '#bfbfbf',
    'border-color': '#d9d9d9',
    'gray-100': '#f5f5f5',
    'gray-200': '#e8e8e8',
    'gray-300': '#d9d9d9',
    'success-color': '#52c41a',
    'warning-color': '#faad14',
    'error-color': '#f5222d',
    'info-color': '#1890ff'
  }
};

try {
  themeManager.addTheme(myTheme);
  themeManager.applyTheme(myTheme);
} catch (error) {
  console.error(error.message);
}
```

### 获取主题信息
```javascript
// 获取当前主题
const current = themeManager.getCurrentTheme();
console.log('当前主题主色:', current.colors['primary-color']);

// 获取所有主题
const allThemes = themeManager.getThemes();
const customThemes = allThemes.filter(t => !t.isDefault);
console.log('自定义主题数量:', customThemes.length);
```

## 数据持久化

主题管理器自动处理数据持久化：

- **预设主题**: 从 `themes.json` 文件加载
- **自定义主题**: 保存到 localStorage (`customThemes` 键)
- **当前主题**: 保存到 localStorage (`currentTheme` 键)

## 注意事项

1. 主题名称必须唯一，添加或编辑时会进行校验
2. 预设主题无法编辑或删除
3. 删除当前使用的主题会自动切换到默认主题
4. 颜色值应为有效的CSS颜色格式（推荐HEX格式）
