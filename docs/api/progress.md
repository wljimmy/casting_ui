# 进度条组件 (Progress Component)

## 版本信息
- **版本**: 0.3.0
- **模块文件**: `src/modules/js/progress.js`
- **样式文件**: `src/modules/css/progress.css`

## 概述

Casting UI 进度条组件提供了一种简洁、直观的进度展示方式。基于data属性驱动设计，用户只需修改元素的data-value属性即可控制进度条，无需学习任何框架专用API。

## 核心特性

- ✅ 基于data属性驱动，简化用户使用
- ✅ 默认启用标签、条纹和动画效果
- ✅ 支持plain模式关闭所有装饰
- ✅ 支持自定义颜色（data-color优先于data-type颜色）
- ✅ 支持自定义尺寸（W/H参数优先于预定义尺寸）
- ✅ 使用MutationObserver监听data-value变化，自动更新UI
- ✅ 使用DOMObserver管理生命周期，自动清理
- ✅ 防呆设计，参数冲突时按优先级自动处理
- ✅ 命名空间隔离（window.CUI.Progress）
- ✅ 圆角为高度的一半，视觉美观

## 基础用法

### 最简写法

进度条默认启用标签、条纹和动画效果，无需任何额外配置。

```html
<div id="myProgress" class="CUI-progress" data-value="60"></div>
```

### 获取/设置进度值

```javascript
// 获取进度值
const value = document.getElementById('myProgress').dataset.value;

// 设置进度值（自动更新UI）
document.getElementById('myProgress').dataset.value = 75;
```

## 参数说明

### data-value

进度值，范围0-100。

```html
<div class="CUI-progress" data-value="60"></div>
```

### data-type

控制进度条的装饰效果，多个效果用空格分隔。

| 值 | 说明 | 备注 |
|----|------|------|
| `plain` | 关闭所有默认装饰 | 优先级最高 |
| `label` | 显示百分比标签 | 默认启用 |
| `striped` | 条纹样式 | 默认启用 |
| `animated` | 条纹动画 | 默认启用 |
| `glass` | 毛玻璃效果 | 不包含在默认效果中 |
| `success` | 绿色（成功） | 颜色类型 |
| `warning` | 橙色（警告） | 颜色类型 |
| `error` | 红色（错误） | 颜色类型 |
| `info` | 蓝色（信息） | 颜色类型 |
| `W数字` | 自定义宽度 | 最小50px |
| `H数字` | 自定义bar高度 | 最小14px |

```html
<!-- 简洁模式 -->
<div class="CUI-progress" data-value="60" data-type="plain"></div>

<!-- 单独启用标签 -->
<div class="CUI-progress" data-value="75" data-type="label"></div>

<!-- 条纹+动画 -->
<div class="CUI-progress" data-value="50" data-type="striped animated"></div>

<!-- 毛玻璃效果 -->
<div class="CUI-progress" data-value="80" data-type="glass"></div>

<!-- 自定义尺寸 -->
<div class="CUI-progress" data-value="75" data-type="W300 H20"></div>
```

### data-color

自定义颜色（十六进制格式），优先于data-type中的颜色类型。

```html
<div class="CUI-progress" data-value="70" data-type="label" data-color="#ff6b6b"></div>
```

### data-size

预定义尺寸，当W/H参数存在时会被忽略。

| 值 | 说明 |
|----|------|
| `sm` | 小尺寸（16px高） |
| `md` | 中尺寸（20px高） |
| `lg` | 大尺寸（28px高） |
| `xl` | 超大尺寸（36px高） |

```html
<div class="CUI-progress" data-value="60" data-size="sm"></div>
```

## 冲突处理规则

### 1. plain vs 其他装饰
- **规则**: plain优先级最高，一旦设置关闭所有装饰效果
- **示例**: `data-type="plain striped animated"` → 只有plain生效

### 2. data-color vs data-type颜色
- **规则**: data-color更具体，优先于data-type中的颜色
- **示例**: `data-type="success" data-color="#ff0000"` → 使用#ff0000

### 3. W/H参数 vs data-size
- **规则**: W/H参数更精确，优先于预定义尺寸
- **示例**: `data-type="W200 H20" data-size="xl"` → 使用W200 H20

## 完整示例

### 基础进度条

```html
<div id="progress1" class="CUI-progress" data-value="60"></div>
```

### 简洁模式

```html
<div id="progress2" class="CUI-progress" data-value="60" data-type="plain"></div>
```

### 彩色进度条

```html
<div id="progress-success" class="CUI-progress" data-value="85" data-type="success label"></div>
<div id="progress-warning" class="CUI-progress" data-value="65" data-type="warning label"></div>
<div id="progress-error" class="CUI-progress" data-value="35" data-type="error label"></div>
<div id="progress-info" class="CUI-progress" data-value="55" data-type="info label"></div>
```

### 自定义颜色

```html
<div class="CUI-progress" data-value="70" data-type="label" data-color="#ff6b6b"></div>
<div class="CUI-progress" data-value="60" data-type="label" data-color="#4ecdc4"></div>
```

### 自定义尺寸

```html
<div class="CUI-progress" data-value="75" data-type="label W300 H20"></div>
<div class="CUI-progress" data-value="60" data-type="label W200 H28"></div>
```

### 预定义尺寸

```html
<div class="CUI-progress" data-value="60" data-size="sm"></div>
<div class="CUI-progress" data-value="70" data-size="md"></div>
<div class="CUI-progress" data-value="80" data-size="lg"></div>
<div class="CUI-progress" data-value="90" data-size="xl"></div>
```

### 动态控制

```html
<div id="myProgress" class="CUI-progress" data-value="0"></div>

<button onclick="startProgress()">开始</button>
<button onclick="pauseProgress()">暂停</button>
<button onclick="resetProgress()">重置</button>
```

```javascript
let timer = null;

function startProgress() {
    if (timer) return;
    const progressEl = document.getElementById('myProgress');
    if (!progressEl) return;
    timer = setInterval(() => {
        let current = parseInt(progressEl.dataset.value) || 0;
        if (current >= 100) {
            clearInterval(timer);
            timer = null;
            return;
        }
        progressEl.dataset.value = current + 1;
    }, 100);
}

function pauseProgress() {
    clearInterval(timer);
    timer = null;
}

function resetProgress() {
    pauseProgress();
    const progressEl = document.getElementById('myProgress');
    if (progressEl) progressEl.dataset.value = 0;
}
```

## JavaScript API

### 命名空间

```javascript
window.CUI.Progress
```

### Progress类

框架内部使用，用户无需直接调用。进度条通过DOMObserver自动初始化。

### 内部机制

1. **自动初始化**: 通过DOMObserver监听`.CUI-progress`类元素
2. **属性监听**: 使用MutationObserver监听data-value属性变化
3. **自动更新**: 属性变化时自动更新UI
4. **垃圾回收**: 元素移除时自动清理监听器

## 设计理念

### 为什么使用data属性驱动？

1. **零学习成本**: 用户只需懂HTML和原生DOM操作
2. **符合直觉**: 像操作普通HTML元素一样操作进度条
3. **状态同步**: data属性与UI状态保持一致
4. **框架无关**: 不依赖任何框架专用API

### 防呆设计

- **参数冲突**: 按预设优先级自动处理，无需用户记忆
- **类型检查**: 无效参数会被忽略，不会导致错误
- **默认值**: 未设置的参数使用合理的默认值

## 注意事项

1. **ID保持不变**: 框架不会修改元素的ID，用户可直接获取
2. **属性驱动**: 只需修改data-value属性，UI自动更新
3. **圆角设计**: 圆角固定为高度的一半
4. **命名空间**: 框架内部使用window.CUI.Progress，避免冲突
5. **自动清理**: 元素移除时监听器自动清理

## 更新记录

### v0.3.0 (2026-04-26)
- 重构为data属性驱动模式
- 移除dom.go()等API接口
- 添加MutationObserver监听data-value变化
- 添加plain模式关闭默认装饰
- 添加W/H参数支持自定义尺寸
- 添加data-color支持自定义颜色
- 添加防呆处理，参数冲突按优先级处理
- 更新条纹效果使用主色和激活色
- 圆角改为高度的一半
- 使用命名空间window.CUI.Progress

### v0.2.0 (2026-04-25)
- 添加条纹动画效果
- 添加毛玻璃效果
- 添加自定义尺寸支持

### v0.1.0 (2026-04-24)
- 初始版本
- 基础进度条功能
- 支持多种颜色
- 支持标签显示
