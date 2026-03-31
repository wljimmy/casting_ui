# 菜单组件 (Menu Component)

## 版本信息
- **版本**: 0.5.2
- **模块文件**: `src/modules/js/menu.js`
- **样式文件**: `src/modules/css/menu.css`

## 概述

Casting UI 菜单组件提供了一个灵活、高性能的菜单系统，支持多种菜单类型、多级嵌套、自动初始化、实例隔离与垃圾回收。

## 核心特性

- ✅ 多种菜单类型（侧边栏、弹出式、内联）
- ✅ 支持4级嵌套菜单
- ✅ 自动初始化与DOM监听（使用统一的DOM观察器）
- ✅ 多菜单实例隔离
- ✅ 自动垃圾回收
- ✅ 简化的动画类（menu-closed/menu-opened）
- ✅ 图标与徽标自动渲染
- ✅ data-action 页面加载与回调
- ✅ HTML预定义模式 + JS API调用模式双支持
- ✅ 标准菜单类识别（menu-sidebar/menu-popup/menu-inline）
- ✅ 构建状态标记，避免重复构建
- ✅ 响应式设计

## 菜单结构

### 基础结构（最新简化写法）

框架自动处理完整的菜单结构，用户只需写最基础的HTML：

```html
<menu id="my-menu" class="menu-sidebar">
    <ul>
        <li data-icon="outline/home.svg" data-badge="new">首页</li>
        <li data-icon="outline/package.svg">产品
            <ul>
                <li data-icon="outline/smartphone.svg">手机</li>
                <li data-icon="outline/laptop.svg" data-badge="hot">电脑
                    <ul>
                        <li>笔记本</li>
                        <li data-badge="beta">台式机</li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</menu>
```

### 生成后的结构

框架会自动生成以下结构：

```html
<menu id="my-menu" class="menu-sidebar" data-menu-built="true">
    <ul>
        <li data-icon="outline/home.svg" data-badge="new">
            <a href="#">
                <span class="menu-icon-container">
                    <span class="menu-icon">
                        <svg>...</svg>
                    </span>
                </span>
                <div class="menu-text">首页</div>
                <span class="badge new">NEW</span>
            </a>
        </li>
        <li data-icon="outline/package.svg" class="menu-closed">
            <a href="#">
                <span class="menu-icon-container">
                    <span class="menu-icon">
                        <svg>...</svg>
                    </span>
                </span>
                <div class="menu-text">产品</div>
                <span class="menu-expand-icon menu-icon">
                    <svg>...</svg>
                </span>
            </a>
            <ul>
                <!-- 子菜单内容 -->
            </ul>
        </li>
    </ul>
</menu>
```

### 菜单类型

| 类名 | 说明 |
|------|------|
| `menu-sidebar` | 侧边栏菜单 |
| `menu-popup` | 弹出式菜单 |
| `menu-inline` | 内联菜单 |

## 动画类

### 核心动画类

| 类名 | 说明 |
|------|------|
| `menu-closed` | 子菜单关闭状态（箭头朝右，子菜单高度为0） |
| `menu-opened` | 子菜单展开状态（箭头朝下，子菜单高度自动） |
| `menu-active` | 菜单项激活状态 |

### 其他动画类

| 类名 | 说明 |
|------|------|
| `menu-animate` | 启用基础过渡动画 |
| `menu-animate-fade` | 淡入淡出效果 |
| `menu-animate-slide` | 滑入滑出效果 |
| `menu-hover` | 悬停动效 |
| `menu-disabled` | 禁用状态 |

## Data 属性

### data-icon

控制菜单项前的图标展示，格式为 `outline/图标名.svg` 或 `filled/图标名.svg`。

```html
<li data-icon="outline/home.svg">首页</li>
```

### data-badge

控制菜单项右上角的提示徽标。

```html
<li data-badge="new">新功能</li>
```

支持的徽标类型：
- `new` - 蓝色（#165DFF）
- `hot` - 红色（#F53F3F）
- `beta` - 黄色（#FF7D00）
- `update` - 绿色（#00B42A）

### data-action

定义菜单项点击后的核心跳转/加载行为。

#### ⚠️ 安全使用说明

为了防止XSS攻击，`data-action` 有以下安全限制：

1. **不能直接写代码**：只允许引用已定义的函数名，不允许写代码字符串
2. **函数名验证**：函数名必须符合标识符规范，使用正则表达式验证
3. **JSON参数限制**：JSON对象中只能包含数据，不能包含函数

#### 使用方式

```html
<!-- 执行函数（最简单的方式） -->
<li data-action="handleMenuClick">首页</li>

<!-- 执行函数并传参数 -->
<li data-action='{"callback":"handleMenuClick","page":"home","id":123}'>首页</li>

<!-- 加载页面 -->
<li data-action='{"url":"path/to/page.html","container":"#content"}'>设置</li>

<!-- 加载页面并执行回调 -->
<li data-action='{"url":"path/to/page.html","container":"#content","callback":"onPageLoaded"}'>设置</li>
```

JSON 字段说明：
- `callback` - 回调函数名（仅引用，不能直接写代码）
- `url` - 需要加载的页面地址
- `container` - 页面内容要刷新渲染的目标容器选择器
- `[其他字段]` - 自定义参数，会完整传递给回调函数

#### 完整示例

```html
<!-- HTML -->
<li data-action='{"callback":"showProduct","id":123,"name":"iPhone"}'>iPhone</li>

<!-- JavaScript -->
<script>
function showProduct(action) {
    console.log('产品ID:', action.id);      // 123
    console.log('产品名称:', action.name);  // iPhone
    // 处理业务逻辑...
}
</script>
```

## JavaScript API

### 全局便捷API

```javascript
// 全局菜单对象
window.CastingMenu
```

### CastingMenu 方法

#### create(config)

通过JSON配置动态创建菜单（JS API调用模式）。

```javascript
CastingMenu.create({
    id: 'dynamic-menu',
    className: 'menu-sidebar menu-animate',
    container: '#menu-container',
    items: [
        {
            text: '首页',
            icon: 'outline/home.svg',
            badge: 'new',
            action: {
                url: 'path/to/page.html',
                container: '#content',
                callback: 'onPageLoaded'
            }
        },
        {
            text: '产品',
            icon: 'outline/package.svg',
            children: [
                { text: '手机', icon: 'outline/smartphone.svg' },
                { text: '电脑', icon: 'outline/laptop.svg', badge: 'hot' }
            ]
        }
    ]
});
```

配置参数说明：
- `id` - 菜单ID（可选）
- `className` - 菜单类名（可选）
- `container` - 目标容器选择器（可选）
- `items` - 菜单项配置数组

菜单项配置：
- `text` - 菜单项文本
- `icon` - 图标路径（可选）
- `badge` - 徽标类型（可选）
- `action` - 点击动作配置（可选）
- `className` - 菜单项类名（可选）
- `children` - 子菜单项数组（可选）

#### getInstance(id)

获取指定ID的菜单实例。

```javascript
const instance = CastingMenu.getInstance('my-menu');
```

#### getAllInstances()

获取所有菜单实例。

```javascript
const instances = CastingMenu.getAllInstances();
```

#### destroy(id)

销毁指定ID的菜单实例。

```javascript
CastingMenu.destroy('my-menu');
```

### 全局实例访问

```javascript
// 访问全局菜单管理器
const menuManager = window.CastingMenuManager;

// 访问全局DOM观察器
const domObserver = window.CastingDOMObserver;
```

### MenuManager 方法

#### getInstance(menuId)

获取指定ID的菜单实例。

```javascript
const instance = menuManager.getInstance('my-menu');
```

#### getAllInstances()

获取所有菜单实例。

```javascript
const instances = menuManager.getAllInstances();
```

#### initMenu(menuElement)

手动初始化一个菜单元素。

```javascript
const menuElement = document.getElementById('new-menu');
menuManager.initMenu(menuElement);
```

#### destroyMenu(menuId)

销毁指定ID的菜单实例。

```javascript
menuManager.destroyMenu('my-menu');
```

#### createMenu(config)

通过JSON配置创建菜单（同 CastingMenu.create）。

### MenuInstance 方法

#### destroy()

销毁当前菜单实例。

```javascript
const instance = menuManager.getInstance('my-menu');
instance.destroy();
```

## 双模式构建菜单

### HTML预定义模式

在页面中编写基础HTML结构，框架自动扫描、解析并完成菜单构建。

```html
<menu id="my-menu" class="menu-sidebar">
    <ul>
        <li data-icon="outline/home.svg">首页</li>
    </ul>
</menu>
```

### JS API调用模式

通过标准化API接口动态创建菜单。

```javascript
CastingMenu.create({
    id: 'my-menu',
    className: 'menu-sidebar',
    container: '#container',
    items: [
        { text: '首页', icon: 'outline/home.svg' }
    ]
});
```

## 多菜单实例化

页面上可以同时存在多个独立的 `<menu>` 标签，每个都会被自动初始化为独立的实例，实例之间完全隔离。

```html
<menu id="menu-1" class="menu-inline">
    <!-- 菜单内容 -->
</menu>

<menu id="menu-2" class="menu-inline">
    <!-- 菜单内容 -->
</menu>
```

## 自动初始化与垃圾回收

### 自动初始化

菜单模块通过统一的DOM观察器（dom-observer.js）监听页面DOM变化，一旦检测到新增的标准 `<menu>` 标签（menu-sidebar/menu-popup/menu-inline），立即对其进行初始化。

### 垃圾回收

当包含 `<menu>` 标签的元素被移除时，对应的菜单实例会自动执行清理销毁：
- 移除所有事件监听器
- 清空DOM引用和状态数据
- 注销实例
- 释放内存

## 标准菜单类识别

框架只会处理包含以下标准类名的菜单：
- `menu-sidebar`
- `menu-popup`
- `menu-inline`

用户自定义菜单会被直接忽略。

## 菜单构建状态标记

已构建完成的菜单会标记 `data-menu-built="true"` 属性，避免重复解析与重复构建。

## 完整示例

### 侧边栏菜单（4级嵌套）

```html
<menu id="main-sidebar" class="menu-sidebar menu-animate">
    <ul>
        <li data-icon="outline/home.svg" data-badge="new">首页</li>
        <li data-icon="outline/package.svg">产品
            <ul>
                <li data-icon="outline/smartphone.svg">手机</li>
                <li data-icon="outline/laptop.svg" data-badge="hot">电脑
                    <ul>
                        <li>笔记本</li>
                        <li data-badge="beta">台式机
                            <ul>
                                <li>游戏主机</li>
                                <li>工作站</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
        <li class="menu-divider"></li>
        <li data-icon="outline/settings.svg" data-action='{"url":"init-guide/index.html","container":"#content","callback":"onPageLoaded"}'>设置</li>
    </ul>
</menu>
```

### JS API动态创建

```javascript
// 动态创建菜单
const menuInstance = CastingMenu.create({
    id: 'dynamic-sidebar',
    className: 'menu-sidebar menu-animate',
    container: '#sidebar-container',
    items: [
        {
            text: '首页',
            icon: 'outline/home.svg',
            badge: 'new'
        },
        {
            text: '产品',
            icon: 'outline/package.svg',
            children: [
                { text: '手机', icon: 'outline/smartphone.svg' },
                { text: '电脑', icon: 'outline/laptop.svg', badge: 'hot' }
            ]
        }
    ]
});

// 3秒后销毁
setTimeout(() => {
    CastingMenu.destroy('dynamic-sidebar');
}, 3000);
```

## 激活状态规则

### 侧边栏菜单
- 整个菜单仅有一个菜单项可以为激活项
- 使用 `menu-active` 类标记激活状态
- 点击菜单项会清除整个菜单的激活状态，只保留当前项
- 保持视觉反馈清晰，只在侧边栏菜单中有效

### 其他菜单（内联菜单、弹出菜单）
- 不保留菜单项激活状态
- 点击后不会设置 `menu-active` 类
- 无视觉选中反馈

## 注意事项

1. **菜单标签**: 必须使用 `<menu>` 标签作为根容器
2. **层级嵌套**: 仅使用 `<ul>` + `<li>` 原生列表嵌套
3. **最大层级**: 最多支持4层嵌套
4. **样式与逻辑分离**: JS仅负责切换类名，不直接操作内联样式
5. **内存管理**: 确保正确移除包含菜单的DOM元素，以便垃圾回收
6. **标准菜单类**: 只处理 `menu-sidebar`/`menu-popup`/`menu-inline`
7. **构建标记**: 已构建菜单会标记 `data-menu-built="true"`
8. **图标路径**: 格式为 `outline/图标名.svg` 或 `filled/图标名.svg`
9. **图标目录**: 图标文件位于 `public/icons/` 目录，使用绝对路径 `/icons/` 引用
10. **徽章位置**: 徽章显示在菜单项的右上角，使用绝对定位
11. **data-action安全**: 只允许引用函数名，禁止直接写代码，防止XSS攻击
12. **激活状态**: 仅侧边栏菜单保留激活状态，其他菜单不保留

## 更新记录

### v0.5.2 (2026-04-01)
- 修复XSS安全漏洞，添加函数名格式验证
- 使用正则表达式验证函数名，确保安全执行
- 移除危险的alert()调用，改为只输出到控制台
- 添加事件监听器跟踪机制，防止内存泄漏
- 新增addEventListener辅助方法，安全添加和跟踪监听器
- 完善destroy方法，清理所有跟踪的事件监听器
- 重新设计内联菜单结构，一级菜单作为按钮点击弹出标准弹出菜单
- 采用递归初始化模式：先处理弹出菜单，再渲染主菜单
- 为构建方法增加嵌套menu标签规避逻辑，保留ul和menu标签格式
- 除侧边菜单外，所有菜单均不保留菜单项激活状态
- 侧边菜单整个菜单仅有一个菜单项可以为激活项
- 修改setActive方法，清除整个菜单的激活状态而非仅同级
- 修复徽章重复渲染问题，在renderBadge方法中添加已存在检查
- 按照框架标准语法重写菜单手册页和主入口菜单
- 为关键方法添加JSDoc注释和详细步骤说明

### v0.5.1 (2026-03-31)
- 集成统一DOM观察器（dom-observer.js）
- 移除自有的MutationObserver，使用统一监听
- 简化动画类，使用menu-closed和menu-opened两个核心类
- 优化菜单结构，A标签内直接包含文字，不使用额外容器
- 调整箭头位置，放到menu-text容器外面
- 优化徽章样式，使用绝对定位显示在右上角
- 增强data-action处理，支持直接执行函数
- 更新菜单CSS，优化垂直居中对齐
- 子菜单达到最大高度后支持滚动

### v0.5.0 (2026-03-30)
- 更新动画类名，使用 `menu-close` 替代 `menu-collapsed`
- 增强菜单模块，支持 JS API 调用模式创建菜单
- 添加标准菜单类识别逻辑
- 添加菜单构建状态标记，避免重复构建
- 支持 HTML 预定义模式 + JS API 调用模式双模式构建
- 暴露全局便捷 API `window.CastingMenu`
- 添加 `createMenu` 方法支持从 JSON 配置动态创建菜单
- 更新所有相关文档与示例

### v0.4.0 (2026-03-30)
- 完全重构菜单模块
- 实现多菜单实例化与隔离
- 添加自动初始化与垃圾回收
- 支持 data-icon 和 data-badge 自动渲染
- 实现 data-action 页面加载与回调
- 添加完整的动画类系统
- 支持4级嵌套菜单
