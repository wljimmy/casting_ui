
# 数据展示组件

数据展示组件用于在界面上呈现各种类型的数据和状态信息。

## 按钮 (Button)

按钮是用于触发操作的基础交互组件。

### 基础用法

```html
<button class="btn btn-primary">主要按钮</button>
```

### 按钮类型

| 类名 | 描述 | 场景 |
|------|------|------|
| `.btn-primary` | 主要按钮 | 主操作，如提交、确认 |
| `.btn-secondary` | 次要按钮 | 次要操作，如取消 |
| `.btn-text` | 文字按钮 | 链接样式按钮 |
| `.btn-icon` | 图标按钮 | 圆形图标按钮 |
| `.btn-success` | 成功按钮 | 成功状态操作 |
| `.btn-warning` | 警告按钮 | 警告状态操作 |
| `.btn-error` | 危险按钮 | 删除等危险操作 |
| `.btn-info` | 信息按钮 | 信息提示操作 |

```html
<div class="CUI-grid CUI-grid-4c">
  <button class="btn btn-primary">主要</button>
  <button class="btn btn-secondary">次要</button>
  <button class="btn btn-text">文字</button>
  <button class="btn btn-icon">🔍</button>
</div>
```

### 按钮尺寸

| 类名 | 描述 |
|------|------|
| `.btn-sm` | 小按钮 |
| `.btn-md` | 中按钮（默认） |
| `.btn-lg` | 大按钮 |

```html
<button class="btn btn-primary btn-sm">小</button>
<button class="btn btn-primary btn-md">中</button>
<button class="btn btn-primary btn-lg">大</button>
```

### 按钮状态

| 类名 | 描述 |
|------|------|
| `disabled` | 禁用状态 |
| `.btn-loading` | 加载中 |
| `.btn-icon-only` | 仅图标 |

```html
<button class="btn btn-primary" disabled>不可用</button>
<button class="btn btn-primary btn-loading">加载中</button>
```

### 按钮组

```html
<div class="btn-group">
  <button class="btn btn-primary">左</button>
  <button class="btn btn-primary">中</button>
  <button class="btn btn-primary">右</button>
</div>
```

---

## 徽章 (Badge)

徽章用于在界面上显示标签、标记或状态信息。

### 基础用法

```html
<span class="badge badge-primary">主要</span>
```

### 徽章尺寸

| 类名 | 描述 |
|------|------|
| `.badge-sm` | 小徽章 |
| `.badge-md` | 中徽章（默认） |
| `.badge-lg` | 大徽章 |

```html
<span class="badge badge-sm badge-primary">小</span>
<span class="badge badge-md badge-primary">中</span>
<span class="badge badge-lg badge-primary">大</span>
```

### 徽章颜色

| 类名 | 描述 |
|------|------|
| `.badge-primary` | 主要（蓝色） |
| `.badge-secondary` | 次要（灰色） |
| `.badge-success` | 成功（绿色） |
| `.badge-warning` | 警告（橙色） |
| `.badge-error` | 错误（红色） |

```html
<span class="badge badge-success">成功</span>
<span class="badge badge-warning">警告</span>
<span class="badge badge-error">错误</span>
```

### 描边样式

```html
<span class="badge badge-outline badge-primary">描边</span>
```

### 特殊徽章（自动文字）

| 类名 | 自动文字 |
|------|----------|
| `.badge-hot` | HOT |
| `.badge-new` | NEW |
| `.badge-recommend` | 推荐 |
| `.badge-update` | 更新 |
| `.badge-demo` | DEMO |
| `.badge-tip` | 提示 |
| `.badge-official` | 官方 |
| `.badge-pro` | PRO |
| `.badge-beta` | BETA |
| `.badge-fixed` | FIXED |

```html
<span class="badge badge-hot"></span>
<span class="badge badge-new"></span>
<span class="badge badge-recommend"></span>
```

### 带数字角标

```html
<span class="badge badge-primary badge-with-count">
  消息
  <span class="badge-count">99+</span>
</span>
```

---

## 进度条 (Progress)

进度条组件用于显示任务完成的百分比，完全由 data 属性驱动。

### 基础用法

默认启用标签、条纹和动画效果。

```html
<div class="CUI-progress" data-value="60"></div>
```

### data-type 配置项

在 `data-type` 中可以用空格分隔多个选项：

| 选项 | 描述 |
|------|------|
| `plain` | 关闭所有装饰效果（优先级最高） |
| `label` | 显示百分比标签 |
| `striped` | 条纹样式 |
| `animated` | 条纹动画 |
| `glass` | 毛玻璃效果 |
| `success` / `warning` / `error` / `info` | 预设颜色 |
| `W{数字}` | 自定义宽度（如 W300） |
| `H{数字}` | 自定义高度（如 H20） |

### 示例

#### 简洁模式
```html
<div class="CUI-progress" data-value="60" data-type="plain"></div>
```

#### 单独控制效果
```html
<div class="CUI-progress" data-value="75" data-type="label"></div>
<div class="CUI-progress" data-value="50" data-type="striped"></div>
<div class="CUI-progress" data-value="50" data-type="striped animated"></div>
```

#### 毛玻璃效果
```html
<div class="CUI-progress" data-value="80" data-type="glass"></div>
```

#### 彩色进度条
```html
<div class="CUI-progress" data-value="85" data-type="success label"></div>
<div class="CUI-progress" data-value="65" data-type="warning label"></div>
<div class="CUI-progress" data-value="35" data-type="error label"></div>
```

#### 自定义颜色
`data-color` 优先级高于 `data-type` 中的颜色。

```html
<div class="CUI-progress" 
     data-value="70" 
     data-type="label" 
     data-color="#ff6b6b">
</div>
```

#### 自定义尺寸
`W{数字}` 和 `H{数字}` 优先级高于 `data-size`。

```html
<div class="CUI-progress" data-value="75" data-type="label W300 H20"></div>
<div class="CUI-progress" data-value="60" data-type="label W200 H28"></div>
```

#### 预定义尺寸
```html
<div class="CUI-progress" data-value="60" data-size="sm"></div>
<div class="CUI-progress" data-value="70" data-size="md"></div>
<div class="CUI-progress" data-value="80" data-size="lg"></div>
<div class="CUI-progress" data-value="90" data-size="xl"></div>
```

### 动态控制

只需修改 `data-value` 属性，无需任何 API 调用！

```html
<div id="myProgress" class="CUI-progress" data-value="0"></div>

<button onclick="startProgress()">开始</button>
<button onclick="pauseProgress()">暂停</button>
<button onclick="resetProgress()">重置</button>

<script>
let timer = null;
const progress = document.getElementById('myProgress');

function startProgress() {
  if (timer) return;
  timer = setInterval(() => {
    let current = parseInt(progress.dataset.value) || 0;
    if (current >= 100) {
      clearInterval(timer);
      timer = null;
      return;
    }
    progress.dataset.value = current + 1;
  }, 100);
}

function pauseProgress() {
  clearInterval(timer);
  timer = null;
}

function resetProgress() {
  pauseProgress();
  progress.dataset.value = 0;
}
</script>
```

### 冲突处理规则

1. `plain` 优先级最高，一旦设置关闭所有装饰
2. `data-color` 优先于 `data-type` 中的颜色
3. `W/H` 参数优先于 `data-size`

---

## 状态栏 (Status Bar)

状态栏组件用于显示系统状态、通知和指示信息。采用纯 CSS 实现，通过 mask 技术实现 SVG 图标显示和颜色自定义。

### 基础用法

```html
<div class="CUI-status-bar">
  <div data-type="info">就绪</div>
  <div data-type="success">3 项任务</div>
</div>
```

### 状态类型

| data-type | 图标 | 颜色 | 描述 |
|-----------|------|------|------|
| `info` | ● | 蓝色 | 信息状态 |
| `success` | ● | 绿色 | 成功状态 |
| `warning` | ● | 黄色 | 警告状态 |
| `error` | ● | 红色 | 错误状态 |
| `wifi` | 📶 | 青色 | Wi-Fi 信号 |
| `network` | 🌐 | 紫色 | 网络连接 |
| `upload` | 📤 | 青绿 | 上传状态 |
| `download` | 📥 | 青色 | 下载状态 |
| `cpu` | 💻 | 橙色 | CPU 使用率 |
| `memory` | 📊 | 黄色 | 内存使用 |
| `disk` | 💾 | 绿色 | 磁盘空间 |
| `battery` | 🔋 | 青色 | 电池状态 |
| `system` | ⚙️ | 灰色 | 系统状态 |
| `maintenance` | 🔧 | 橙色 | 维护模式 |
| `online` | 🟢 | 绿色 | 在线状态 |
| `offline` | 🔴 | 红色 | 离线状态 |
| `progress` | ⏳ | 青色 | 任务进度 |
| `queue` | 📋 | 紫色 | 队列状态 |
| `notification` | 🔔 | 黄色 | 通知状态 |
| `time` | ⏰ | 灰色 | 当前时间 |
| `date` | 📅 | 灰色 | 当前日期 |
| `weather` | ☁️ | 青色 | 天气信息 |
| `location` | 📍 | 橙色 | 地理位置 |
| `language` | 🌐 | 紫色 | 语言设置 |
| `theme` | 🎨 | 绿色 | 主题模式 |

### 示例：系统状态

```html
<div class="CUI-status-bar">
  <div data-type="system">系统状态</div>
  <div data-type="maintenance">维护模式</div>
  <div data-type="online">在线</div>
  <div data-type="offline">离线</div>
</div>
```

### 示例：网络状态

```html
<div class="CUI-status-bar">
  <div data-type="wifi">Wi-Fi: 满格</div>
  <div data-type="network">网络已连接</div>
  <div data-type="upload">上传中</div>
  <div data-type="download">下载中</div>
</div>
```

### 示例：硬件状态

```html
<div class="CUI-status-bar">
  <div data-type="cpu">CPU: 25%</div>
  <div data-type="memory">内存: 1.2GB</div>
  <div data-type="disk">磁盘: 256GB</div>
  <div data-type="battery">电池: 80%</div>
</div>
```

### 动态闪动效果

添加 `data-flash="true"` 属性启用闪动效果。

```html
<div class="CUI-status-bar">
  <div data-type="info">正常状态</div>
  <div data-type="warning" data-flash="true">闪动警告</div>
  <div data-type="error" data-flash="true">闪动错误</div>
  <div data-type="download" data-flash="true">下载中</div>
</div>
```

### 悬停提示

使用标准 `title` 属性。

```html
<div class="CUI-status-bar">
  <div data-type="info" title="系统已就绪">就绪</div>
  <div data-type="warning" title="CPU使用率中等">CPU: 45%</div>
  <div data-type="error" title="检测到内存泄漏">内存泄漏</div>
</div>
```

### 自定义颜色

使用 `--status-color` CSS 变量。

```html
<div class="CUI-status-bar">
  <div data-type="wifi" style="--status-color: #ff6b6b">红色Wi-Fi</div>
  <div data-type="cpu" style="--status-color: #4ecdc4">青色CPU</div>
  <div data-type="memory" style="--status-color: #45b7d1">蓝色内存</div>
</div>
```

### 颜文字符号模式

添加 `data-symbol="emoji"` 强制使用颜文字。

```html
<div class="CUI-status-bar">
  <div data-type="wifi" data-symbol="emoji">Wi-Fi: 满格</div>
  <div data-type="cpu" data-symbol="emoji">CPU: 25%</div>
  <div data-type="memory" data-symbol="emoji">内存: 1.2GB</div>
</div>
```

### 状态栏容器样式类

| 类名 | 描述 |
|------|------|
| `.CUI-status-sm` | 小型状态栏 |
| `.CUI-status-lg` | 大型状态栏 |
| `.CUI-status-glass` | 玻璃效果 |
| `.CUI-status-dark` | 深色背景 |
| `.CUI-status-primary` | 主题色背景 |

---

## 信息提示 (Message)

信息提示用于向用户展示不同类型的提示信息。

### 基础用法

```html
<div class="message message-info">
  <div>这是一条信息提示</div>
</div>
```

### 提示类型

| 类名 | 描述 | 颜色 |
|------|------|------|
| `.message-info` | 信息提示 | 蓝色 |
| `.message-success` | 成功提示 | 绿色 |
| `.message-warning` | 警告提示 | 黄色 |
| `.message-error` | 错误提示 | 红色 |

```html
<div class="message message-success">
  <div>操作成功！您的更改已保存。</div>
</div>

<div class="message message-warning">
  <div>请注意：此操作不可逆，请谨慎处理。</div>
</div>

<div class="message message-error">
  <div>操作失败！请检查网络连接后重试。</div>
</div>
```

### 带标题

```html
<div class="message message-info">
  <h4>系统更新</h4>
  <div>系统将于今晚进行维护更新，预计耗时 2 小时。</div>
</div>
```

### 带列表

```html
<div class="message message-info">
  <h4>系统要求</h4>
  <div>
    <p>请确保您的系统满足以下要求：</p>
    <ul>
      <li>操作系统：Windows 10 或 macOS 10.15+</li>
      <li>内存：至少 4GB RAM</li>
      <li>存储空间：至少 2GB 可用空间</li>
      <li>浏览器：Chrome 80+, Firefox 75+, Safari 13+</li>
    </ul>
  </div>
</div>
```

---

## 加载组件

### 加载动画

```html
<div class="loading loading-sm"></div>  <!-- 小 -->
<div class="loading"></div>             <!-- 中 -->
<div class="loading loading-lg"></div>  <!-- 大 -->
```

### 骨架屏

| 类名 | 描述 |
|------|------|
| `.skeleton-card` | 卡片骨架屏 |
| `.skeleton-list` | 列表骨架屏 |
| `.skeleton-table` | 表格骨架屏 |

```html
<div class="skeleton skeleton-card"></div>
<div class="skeleton skeleton-list"></div>
<div class="skeleton skeleton-table"></div>
```

---

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>数据展示组件示例</title>
  <link rel="stylesheet" href="src/modules/css/core.css">
  <link rel="stylesheet" href="src/modules/css/components.css">
  <link rel="stylesheet" href="src/modules/css/progress.css">
  <link rel="stylesheet" href="src/modules/css/status.css">
</head>
<body>
  
  <div class="CUI-wrap">
    <section class="CUI-section">
      <h2>按钮示例</h2>
      <div class="CUI-box">
        <div class="CUI-grid CUI-grid-4c">
          <button class="btn btn-primary">主要</button>
          <button class="btn btn-success">成功</button>
          <button class="btn btn-warning">警告</button>
          <button class="btn btn-error">错误</button>
        </div>
      </div>
      
      <h2>徽章示例</h2>
      <div class="CUI-box">
        <span class="badge badge-hot"></span>
        <span class="badge badge-new"></span>
        <span class="badge badge-primary">主要</span>
        <span class="badge badge-success">成功</span>
      </div>
      
      <h2>进度表示例</h2>
      <div class="CUI-box">
        <div class="CUI-progress" data-value="60" data-type="label striped animated"></div>
        <div class="CUI-m-md"></div>
        <div class="CUI-progress" data-value="85" data-type="success label"></div>
      </div>
      
      <h2>状态栏示例</h2>
      <div class="CUI-box">
        <div class="CUI-status-bar">
          <div data-type="system">系统</div>
          <div data-type="online">在线</div>
          <div data-type="wifi">Wi-Fi</div>
          <div data-type="battery">80%</div>
        </div>
      </div>
      
      <h2>信息提示示例</h2>
      <div class="message message-success">
        <h4>操作成功</h4>
        <div>您的更改已成功保存。</div>
      </div>
    </section>
  </div>
  
  <script type="module" src="src/modules/js/index.js"></script>
</body>
</html>
```
