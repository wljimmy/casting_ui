# 状态栏扩展设计方案

## 1. 现有实现分析

当前状态栏实现：
- 纯CSS驱动，无需JavaScript
- 使用`data-type`属性定义状态类型
- 通过CSS变量`--status-color`设置颜色
- `::before`伪元素显示状态圆点
- `data-flash="true"`启用闪动效果
- 文字直接写在标签内

## 2. 设计目标

- **更多状态类型**：支持网络、硬件、应用等多种状态
- **双符号系统**：优先使用SVG图标，其次使用颜文字图标
- **符号闪动**：继承现有闪动效果
- **代码复用**：最大化复用现有CSS结构
- **现代化设计**：使用简洁优雅的视觉符号
- **颜色自定义**：支持通过CSS变量设置SVG图标颜色

## 3. 扩展状态类型

### 3.1 系统状态
| 状态类型 | SVG图标 | 颜文字符号 | 颜色 | 描述 |
|---------|---------|-----------|------|------|
| `system` | settings | ⚙️ | #6c757d | 系统状态 |
| `maintenance` | tool | 🔧 | #fd7e14 | 维护模式 |
| `offline` | - | 🔴 | #dc3545 | 离线状态 |
| `online` | - | 🟢 | #28a745 | 在线状态 |

### 3.2 网络状态
| 状态类型 | SVG图标 | 颜文字符号 | 颜色 | 描述 |
|---------|---------|-----------|------|------|
| `wifi` | wifi-2 | 📶 | #17a2b8 | Wi-Fi信号 |
| `network` | - | 🌐 | #6f42c1 | 网络连接 |
| `upload` | upload | 📤 | #20c997 | 上传状态 |
| `download` | cloud-download | 📥 | #17a2b8 | 下载状态 |

### 3.3 硬件状态
| 状态类型 | SVG图标 | 颜文字符号 | 颜色 | 描述 |
|---------|---------|-----------|------|------|
| `cpu` | cpu | 💻 | #fd7e14 | CPU使用率 |
| `memory` | - | 📊 | #ffc107 | 内存使用 |
| `disk` | - | 💾 | #28a745 | 磁盘空间 |
| `battery` | battery-charging-2 | 🔋 | #17a2b8 | 电池状态 |

### 3.4 应用状态
| 状态类型 | SVG图标 | 颜文字符号 | 颜色 | 描述 |
|---------|---------|-----------|------|------|
| `progress` | - | ⏳ | #17a2b8 | 任务进度 |
| `queue` | - | 📋 | #6f42c1 | 队列状态 |
| `notification` | notification | 🔔 | #ffc107 | 通知状态 |
| `error` | - | ❌ | #dc3545 | 错误状态 |

### 3.5 时间日期
| 状态类型 | SVG图标 | 颜文字符号 | 颜色 | 描述 |
|---------|---------|-----------|------|------|
| `time` | clock-12 | ⏰ | #6c757d | 当前时间 |
| `date` | calendar | 📅 | #6c757d | 当前日期 |

### 3.6 其他状态
| 状态类型 | SVG图标 | 颜文字符号 | 颜色 | 描述 |
|---------|---------|-----------|------|------|
| `weather` | cloud | ☁️ | #17a2b8 | 天气信息 |
| `location` | map-pin-check | 📍 | #fd7e14 | 地理位置 |
| `language` | - | 🌐 | #6f42c1 | 语言设置 |
| `theme` | - | 🎨 | #28a745 | 主题模式 |

## 4. 技术实现方案

### 4.1 双符号系统

#### 优先级
- **优先**：使用SVG图标（轮廓线风格）
- **降级**：当SVG图标不存在时，使用颜文字符号

#### 手动选择
- 使用`data-symbol="emoji"`属性强制使用颜文字符号
- 未指定时，自动根据SVG图标是否存在选择

### 4.2 SVG符号实现（支持颜色自定义）

**使用`mask` + `background`方法**：
- 使用`mask`属性显示SVG轮廓
- 使用`background`属性设置颜色
- 支持通过CSS变量`--status-color`自定义颜色

### 4.3 HTML用法

```html
<div class="CUI-status-bar">
    <!-- 自动选择（优先SVG） -->
    <div data-type="wifi">Wi-Fi: 满格</div>
    <div data-type="cpu">CPU: 25%</div>
    
    <!-- 强制使用颜文字符号 -->
    <div data-type="memory" data-symbol="emoji">内存: 1.2GB</div>
    
    <!-- 闪动效果（适用于两种符号） -->
    <div data-type="download" data-flash="true">下载: 1.2MB/s</div>
    
    <!-- 自定义颜色 -->
    <div data-type="wifi" style="--status-color: #ff6b6b">Wi-Fi: 红色</div>
</div>
```

### 4.4 CSS实现

```css
/* 基础状态项样式 */
.CUI-status-bar > [data-type] {
    display: flex;
    align-items: center;
    gap: var(--size-xs);
    font-weight: normal;
    --status-color: var(--info-color);
}

/* SVG符号模式（默认） */
.CUI-status-bar > [data-type]:not([data-symbol="emoji"])::before {
    content: '';
    width: 16px;
    height: 16px;
    background-color: var(--status-color);
    -webkit-mask-image: var(--svg-mask);
    mask-image: var(--svg-mask);
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    flex-shrink: 0;
}

/* 颜文字符号模式 */
.CUI-status-bar > [data-type][data-symbol="emoji"]::before {
    content: var(--emoji-content);
    font-size: 14px;
    color: var(--status-color);
    flex-shrink: 0;
}

/* 状态类型定义 */
.CUI-status-bar > [data-type="wifi"] {
    --status-color: #17a2b8;
    --svg-mask: url('/icons/outline/wifi-2.svg');
    --emoji-content: "📶";
}

.CUI-status-bar > [data-type="cpu"] {
    --status-color: #fd7e14;
    --svg-mask: url('/icons/outline/cpu.svg');
    --emoji-content: "💻";
}

.CUI-status-bar > [data-type="memory"] {
    --status-color: #ffc107;
    --emoji-content: "📊";
}

/* 闪动效果 - 适用于两种符号 */
.CUI-status-bar > [data-flash="true"]::before {
    animation: flash 0.5s ease-in-out infinite;
}

@keyframes flash {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}
```

### 4.5 颜色自定义

```html
<!-- 自定义SVG图标颜色 -->
<div data-type="wifi" style="--status-color: #ff6b6b">Wi-Fi: 红色</div>

<!-- 自定义颜文字图标颜色 -->
<div data-type="memory" data-symbol="emoji" style="--status-color: #4ecdc4">内存: 青色</div>

<!-- 动态修改颜色 -->
<script>
    // 通过CSS变量动态修改颜色
    const statusItem = document.querySelector('[data-type="wifi"]');
    statusItem.style.setProperty('--status-color', '#9c27b0');
</script>
```

## 5. 性能优化

- **CSS变量复用**：使用CSS变量统一管理符号和颜色
- **伪元素优化**：使用`::before`伪元素减少DOM元素
- **选择器效率**：使用属性选择器提高选择效率
- **动画性能**：使用`opacity`动画确保流畅性
- **SVG优化**：使用轮廓线风格的SVG图标
- **Mask性能**：`mask`属性在现代浏览器中性能良好

## 6. 兼容性考虑

- **Mask支持**：`mask`属性在现代浏览器中支持良好
- **降级方案**：在不支持`mask`的环境中自动使用颜文字
- **SVG支持**：确保SVG在所有目标浏览器中显示正常
- **Unicode符号**：确保使用的颜文字符号在主流浏览器中显示正常
- **响应式设计**：适应不同屏幕尺寸

## 7. 测试计划

1. **视觉测试**：验证所有状态符号显示正确
2. **功能测试**：验证闪动效果正常工作
3. **兼容性测试**：测试在不同浏览器中的表现
4. **性能测试**：验证大量状态项时的性能
5. **颜色测试**：验证自定义颜色功能正常

## 8. 文件修改

1. **`src/modules/css/status.css`**：扩展状态类型和符号定义
2. **`src/examples/status-examples.html`**：添加新状态类型示例
3. **`public/manual/data-display/status-container/index.html`**：更新手册页
4. **`docs/api/status.md`**：更新API文档

## 9. 风险评估

- **Mask兼容性**：旧浏览器可能不支持`mask`属性
- **SVG加载**：SVG图标加载失败可能影响用户体验
- **符号显示**：某些Unicode符号可能在旧浏览器中显示异常
- **性能影响**：大量状态项可能影响渲染性能
- **维护成本**：新增状态类型需要同步更新多个文件

## 10. 优势

- **双符号系统**：优先使用SVG图标，确保设计风格一致
- **颜色自定义**：支持通过CSS变量设置SVG图标颜色
- **视觉丰富**：使用专属符号提高信息识别度
- **代码简洁**：复用现有CSS结构，保持代码整洁
- **用户友好**：直观的视觉符号提升用户体验
- **扩展性强**：易于添加新的状态类型
- **现代化设计**：使用SVG和Unicode符号符合现代设计趋势
- **性能良好**：`mask`属性在现代浏览器中性能优秀