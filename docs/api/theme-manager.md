# 主题管理模块 API 文档

## 模块版本
- 版本: v0.1.0
- 更新日期: 2024-01-01

## 模块功能
主题管理模块提供主题切换和自定义功能，支持内置主题和自定义主题。

## API 方法

### applyTheme()
**功能**: 应用主题

**参数**:
- `themeName` (String): 主题名称
- `themeColors` (Object): 可选，自定义主题颜色对象

**使用示例**:
```javascript
// 应用内置主题
applyTheme('default');  // 默认主题
applyTheme('dark');     // 深色主题
applyTheme('light');    // 浅色主题

// 应用自定义主题
const customTheme = {
  'primary-color': '#ff6b6b',
  'bg-color': '#f8f9fa',
  'text-color': '#333333',
  'border-color': '#dee2e6',
  'success-color': '#28a745',
  'error-color': '#dc3545',
  'warning-color': '#ffc107',
  'info-color': '#17a2b8'
};

applyTheme('custom', customTheme);
```