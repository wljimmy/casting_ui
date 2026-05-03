
# ThemeManager - 主题管理器

ThemeManager 是 Casting UI 的主题管理模块，支持主题切换、自定义主题、主题持久化等功能。

## 基本用法

### 引入模块

```javascript
import { ThemeManager } from './theme-manager.js';
```

或者使用全局对象：

```javascript
window.ui.themeManager
window.openThemeSelector
```

### 初始化

```javascript
const themeManager = new ThemeManager();
await themeManager.init();
```

### 打开主题选择器

```javascript
themeManager.openThemeSelector({
  // 选项
}).then(() => {
  console.log('主题选择器打开');
}).catch(reason => {
  console.log('主题选择器关闭:', reason);
});
```

或者使用便捷函数：

```javascript
openThemeSelector();
```

## 主题配置文件

主题配置存储在 `/themes.json` 文件中：

```json
{
  "themes": [
    {
      "name": "默认蓝",
      "description": "默认的蓝色主题",
      "colors": {
        "primary-color": "#165DFF",
        "bg-color": "#FFFFFF",
        "text-primary": "#333333",
        "text-secondary": "#666666",
        "text-muted": "#999999",
        "text-disabled": "#CCCCCC",
        "border-color": "#E5E5E5",
        "gray-100": "#F5F5F5",
        "gray-200": "#E5E5E5",
        "gray-300": "#CCCCCC",
        "success-color": "#67C23A",
        "warning-color": "#E6A23C",
        "error-color": "#F56C6C",
        "info-color": "#165DFF"
      }
    }
  ]
}
```

## 主题管理 API

### 获取当前主题

```javascript
const currentTheme = themeManager.getCurrentTheme();
console.log(currentTheme.name);
console.log(currentTheme.colors);
```

### 获取所有主题

```javascript
const themes = themeManager.getThemes();
console.log(themes);
```

### 应用主题

```javascript
themeManager.applyTheme(themeObject);
```

### 添加自定义主题

```javascript
const newTheme = {
  name: "我的主题",
  description: "自定义主题",
  colors: {
    "primary-color": "#FF6B6B",
    "bg-color": "#FFFFFF",
    // ... 其他颜色
  }
};

themeManager.addTheme(newTheme);
```

### 编辑主题

```javascript
const updatedTheme = {
  name: "修改后的主题",
  description: "修改后的描述",
  colors: {
    // ... 更新的颜色
  }
};

themeManager.editTheme(index, updatedTheme);
```

### 删除主题

```javascript
themeManager.deleteTheme(index);
```

## 主题选择器功能

### 主题列表

- 显示所有可用主题
- 高亮当前主题
- 点击切换主题

### 主题管理

- 添加新主题
- 编辑现有主题
- 删除自定义主题

### 主题编辑

- 主题名称输入
- 主题描述输入
- 颜色配置（14个颜色选项）
- 实时主题预览
- 颜色选择器集成

### 主题预览

预览区域展示主题效果，包括：

- 标题、副标题、段落
- 按钮（主要、默认）
- 标签（成功、警告、错误、信息）
- 文本颜色（主要、次要、辅助、禁用）
- 背景色（主色、灰色、白色）

## 完整示例

```javascript
// 初始化主题管理器
const themeManager = new ThemeManager();

async function initThemes() {
  try {
    await themeManager.init();
    console.log('主题管理器初始化成功');
  } catch (error) {
    console.error('初始化失败:', error);
  }
}

// 打开主题选择器
document.getElementById('theme-btn').addEventListener('click', () => {
  themeManager.openThemeSelector();
});

// 切换到指定主题
function switchToTheme(themeName) {
  const themes = themeManager.getThemes();
  const theme = themes.find(t => t.name === themeName);
  if (theme) {
    themeManager.applyTheme(theme);
  }
}

// 创建自定义主题
function createCustomTheme() {
  const customTheme = {
    name: "暗夜紫",
    description: "深色主题配紫色主色",
    colors: {
      "primary-color": "#8B5CF6",
      "bg-color": "#1E1E2E",
      "text-primary": "#FFFFFF",
      "text-secondary": "#B0B0B0",
      "text-muted": "#808080",
      "text-disabled": "#505050",
      "border-color": "#3A3A4A",
      "gray-100": "#2A2A3A",
      "gray-200": "#3A3A4A",
      "gray-300": "#4A4A5A",
      "success-color": "#10B981",
      "warning-color": "#F59E0B",
      "error-color": "#EF4444",
      "info-color": "#3B82F6"
    }
  };
  
  themeManager.addTheme(customTheme);
  themeManager.applyTheme(customTheme);
}

initThemes();
```

## 数据持久化

### 本地存储

自定义主题保存在 `localStorage` 中：

```javascript
// 自定义主题
localStorage.setItem('customThemes', JSON.stringify(customThemesArray));

// 当前使用的主题
localStorage.setItem('currentTheme', themeName);
```

### 主题类型区分

- **预设主题**：从 `/themes.json` 加载，标记为 `isDefault: true`，不可删除
- **自定义主题**：用户创建的，标记为 `isDefault: false`，可编辑和删除

## 与颜色选择器集成

主题管理器内置颜色选择器功能，用于编辑主题颜色：

```javascript
// 在主题编辑界面中
colorInput.addEventListener('click', async () => {
  try {
    const result = await openColorPicker({
      presetColors: ['#165DFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'],
      format: 'hex',
      initialColor: currentColor
    });
    if (result) {
      // 更新颜色值
      colorValue.value = result;
      colorInput.style.backgroundColor = result;
      // 更新预览
      updateThemePreview();
    }
  } catch (error) {
    // 用户取消
  }
});
```

## 主题应用原理

主题通过 CSS 变量应用到页面：

```javascript
applyTheme(theme) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--${key}`, value);
  }
  localStorage.setItem('currentTheme', theme.name);
}
```

## 内联模式

将主题选择器嵌入到页面容器中：

```html
<div id="theme-selector-container" class="theme-selector-inline"></div>
```

```javascript
themeManager.openThemeSelector({
  container: '#theme-selector-container'
});
```

## 样式定制

主题管理器使用 CSS 变量，可以通过覆盖变量自定义样式：

```css
:root {
  --primary-color: #your-color;
  --bg-color: #f5f5f5;
  --border-color: #ddd;
  --text-primary: #333;
  --size-lg: 16px;
  --size-md: 12px;
  --radius-lg: 12px;
  --radius-md: 8px;
  --radius-sm: 4px;
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.1);
}
```

## 最佳实践

1. **初始化时机**：在页面加载完成后立即初始化，确保主题正确应用

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  const themeManager = new ThemeManager();
  await themeManager.init();
  window.themeManager = themeManager;
});
```

2. **错误处理**：处理主题加载失败的情况

```javascript
try {
  await themeManager.init();
} catch (error) {
  console.error('无法加载主题:', error);
  // 使用默认主题作为后备
}
```

3. **主题切换反馈**：给用户提供主题切换的视觉反馈

```javascript
themeManager.applyTheme(theme);
showToast('success', `已切换到 ${theme.name}`);
```

4. **预设主题备份**：保留预设主题，不要修改 `/themes.json` 文件

## 实际应用场景

### 主题切换按钮

```html
<button class="btn btn-secondary" onclick="openThemeSelector()">
  🎨 主题切换
</button>
```

### 设置页面中的主题管理

```html
<div class="CUI-section">
  <h2>主题设置</h2>
  <div class="CUI-box">
    <h3>当前主题</h3>
    <p id="current-theme-name">默认蓝</p>
    <button class="btn btn-primary" onclick="openThemeSelector()">
      更换主题
    </button>
  </div>
</div>
```

### 深色模式切换

```javascript
function toggleDarkMode() {
  const themes = themeManager.getThemes();
  const darkTheme = themes.find(t => t.name === '暗夜黑');
  const lightTheme = themes.find(t => t.name === '默认蓝');
  
  const current = themeManager.getCurrentTheme();
  if (current.name === '暗夜黑') {
    themeManager.applyTheme(lightTheme);
  } else {
    themeManager.applyTheme(darkTheme);
  }
}
```
