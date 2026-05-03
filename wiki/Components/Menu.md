
# 菜单组件

菜单组件是框架中功能最丰富的组件之一，支持多种菜单类型、多级嵌套、自动初始化、响应式侧边栏等。

---

## 菜单类型

框架支持 3 种标准菜单类型：

| 类名 | 描述 |
|------|------|
| `menu-sidebar` | 侧边栏菜单（固定在页面侧边，响应式） |
| `menu-popup` | 弹出菜单（点击按钮弹出，可通过 `data-trigger` 绑定） |
| `menu-inline` | 内联菜单（点击菜单项弹出子菜单） |

---

## 基础结构

所有菜单都使用标准的 HTML 结构：

```html
<menu class="menu-sidebar" id="mainMenu">
  <ul>
    <li data-icon="home" data-default="true">
      <a href="javascript:void(0)">首页</a>
    </li>
    
    <li data-icon="folder">
      <a href="javascript:void(0)">文档</a>
      <ul>
        <li data-icon="file">
          <a href="javascript:void(0)">快速开始</a>
        </li>
        <li data-icon="book">
          <a href="javascript:void(0)">API 文档</a>
        </li>
      </ul>
    </li>
    
    <li data-icon="settings" data-badge="hot">
      <a href="javascript:void(0)">设置</a>
    </li>
  </ul>
</menu>
```

### 菜单项属性

在 `<li>` 元素上可以使用以下属性：

| 属性 | 描述 | 示例 |
|------|------|------|
| `data-icon` | 图标名称或 SVG 路径 | `data-icon="home"` |
| `data-badge` | 徽章类型 | `data-badge="hot"` / `data-badge="new"` |
| `data-default` | 设为默认激活项 | `data-default="true"` |
| `data-action` | 点击动作（JSON 或函数名） | 见下文 |

---

## data-action 动作配置

`data-action` 支持两种方式：

### 方式 1：函数名

直接指定全局函数名：

```html
<li data-action="handleMenuClick">
  <a href="javascript:void(0)">点击我</a>
</li>

<script>
function handleMenuClick() {
  showToast('info', '菜单被点击了');
}
</script>
```

### 方式 2：JSON 配置

通过 JSON 配置加载页面和回调：

```html
<li data-action='{"url": "page1.html", "container": "#content", "callback": "onPageLoaded"}'>
  <a href="javascript:void(0)">加载页面</a>
</li>

<script>
function onPageLoaded() {
  console.log('页面加载完成');
}
</script>
```

**JSON 配置属性：**

| 属性 | 类型 | 描述 |
|------|------|------|
| `url` | String | 要加载的页面 URL |
| `container` | String | 目标容器选择器 |
| `callback` | String | 加载完成后的回调函数名 |

---

## 侧边栏菜单 (menu-sidebar)

侧边栏菜单是最常用的菜单类型，支持响应式设计。

### 基础示例

```html
<body class="layout-web">
  <aside class="sidebar-left">
    <menu class="menu-sidebar" id="sidebarMenu">
      <ul>
        <li data-icon="home" data-default="true">
          <a href="javascript:void(0)">首页</a>
        </li>
        <li data-icon="chart">
          <a href="javascript:void(0)">数据概览</a>
        </li>
        <li data-icon="settings">
          <a href="javascript:void(0)">系统设置</a>
        </li>
      </ul>
    </menu>
  </aside>
  
  <main class="main-content">
    <!-- 主内容区 -->
  </main>
</body>
```

### 响应式特性

侧边栏菜单具有以下响应式特性：

- **桌面端（≥ 768px）**：正常显示在侧边栏位置
- **移动端（< 768px）**：
  - 自动移动到 `<body>` 顶部
  - 默认隐藏，点击按钮/菜单区域展开
  - 展开时使用全屏覆盖层样式

---

## 弹出菜单 (menu-popup)

弹出菜单默认隐藏，通过按钮触发显示。

### 基础示例

```html
<button id="triggerBtn" class="btn btn-primary">打开菜单</button>

<menu class="menu-popup menu-hidden" id="popupMenu" data-trigger="triggerBtn">
  <ul>
    <li><a href="javascript:void(0)">选项 1</a></li>
    <li><a href="javascript:void(0)">选项 2</a></li>
    <li><a href="javascript:void(0)">选项 3</a></li>
  </ul>
</menu>
```

### data-trigger 属性

`data-trigger` 指定触发按钮的 ID：

```html
<button id="myTrigger">打开菜单</button>
<menu class="menu-popup" data-trigger="myTrigger">...</menu>
```

### 手动控制

也可以通过 JS API 手动控制：

```javascript
// 切换菜单显示/隐藏
CastingMenu.toggle('popupMenu');

// 或者使用 menuManager
menuManager.toggle('popupMenu');
```

### 关闭行为

- 点击菜单外部自动关闭
- 点击菜单项（无子菜单）自动关闭
- 点击遮罩层关闭

---

## 内联菜单 (menu-inline)

内联菜单显示在页面中，点击菜单项会弹出子菜单。

### 基础示例

```html
<div class="CUI-box">
  <h3>导航</h3>
  <menu class="menu-inline" id="inlineMenu">
    <ul>
      <li data-icon="home">
        <a href="javascript:void(0)">首页</a>
      </li>
      
      <li data-icon="folder">
        <a href="javascript:void(0)">产品</a>
        <menu class="menu-popup menu-hidden">
          <ul>
            <li><a href="javascript:void(0)">产品 A</a></li>
            <li><a href="javascript:void(0)">产品 B</a></li>
            <li><a href="javascript:void(0)">产品 C</a></li>
          </ul>
        </menu>
      </li>
      
      <li data-icon="user">
        <a href="javascript:void(0)">关于</a>
      </li>
    </ul>
  </menu>
</div>
```

### 注意事项

- 内联菜单的子菜单必须是 `menu-popup` 类型
- 框架会自动处理子菜单的显示/隐藏
- 同一时间只会有一个子菜单展开

---

## JavaScript API

框架提供了丰富的 JS API 来操作菜单。

### 全局对象

框架暴露了两个全局对象：

```javascript
// 方式 1：使用 CastingMenu（推荐）
CastingMenu.create(...);
CastingMenu.toggle('menuId');

// 方式 2：使用 menuManager（底层）
menuManager.createMenu(...);
menuManager.toggle('menuId');
```

### API 方法

| 方法 | 描述 | 示例 |
|------|------|------|
| `CastingMenu.create(config)` | 通过配置创建菜单 | 见下文 |
| `CastingMenu.toggle(menuId)` | 切换菜单显示/隐藏 | `CastingMenu.toggle('myMenu')` |
| `CastingMenu.getInstance(menuId)` | 获取菜单实例 | `CastingMenu.getInstance('myMenu')` |
| `CastingMenu.getAllInstances()` | 获取所有菜单实例 | `CastingMenu.getAllInstances()` |
| `CastingMenu.destroy(menuId)` | 销毁菜单实例 | `CastingMenu.destroy('myMenu')` |
| `menuManager.addItems(config)` | 添加菜单项 | 见下文 |

### 创建菜单 (create)

通过 JS 配置创建菜单：

```javascript
const menuInstance = CastingMenu.create({
  id: 'dynamicMenu',
  className: 'menu-sidebar',
  container: '#menuContainer',  // 可选，指定容器
  items: [
    {
      text: '首页',
      icon: 'home',
      action: () => console.log('点击首页'),
      className: 'custom-class'  // 可选
    },
    {
      text: '文档',
      icon: 'folder',
      children: [  // 子菜单
        {
          text: '快速开始',
          icon: 'file'
        },
        {
          text: 'API 文档',
          icon: 'book'
        }
      ]
    }
  ]
});
```

### 添加菜单项 (addItems)

向现有菜单添加项目：

```javascript
// 添加同级菜单项
CastingMenu.addItems({
  target: '#menu li:first-child',  // 目标元素或选择器
  items: [
    { text: '新项目 1', icon: 'star' },
    { text: '新项目 2', icon: 'heart' }
  ]
});

// 添加子菜单
CastingMenu.addItems({
  target: '#menu li:has(ul)',
  isSubmenu: true,  // 作为子菜单添加
  items: [
    { text: '子项 1', icon: 'check' },
    { text: '子项 2', icon: 'check' }
  ]
});
```

---

## 菜单实例 (MenuInstance)

每个菜单都有一个对应的实例对象，可以通过 `CastingMenu.getInstance(id)` 获取。

### 实例方法

```javascript
const menuInstance = CastingMenu.getInstance('myMenu');

// 显示/隐藏菜单
menuInstance.toggle();
menuInstance.show();
menuInstance.hide();

// 设置激活项
menuInstance.setActive(liElement);

// 重新渲染图标和徽章
menuInstance.renderIconsAndBadges();

// 销毁实例
menuInstance.destroy();
```

---

## DOMObserver 自动初始化

框架使用 DOMObserver 自动监听页面变化：

- 菜单被添加到页面 → 自动初始化
- 菜单从页面移除 → 自动销毁

这意味着：

1. 无需手动调用初始化函数
2. 动态加载的菜单也能正常工作
3. 不会产生内存泄漏

### 手动初始化（一般不需要）

如果需要手动初始化：

```javascript
const menuElement = document.getElementById('myMenu');
const menuInstance = menuManager.initMenu(menuElement);
```

---

## 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>菜单组件完整示例</title>
  <link rel="stylesheet" href="src/modules/css/core.css">
  <link rel="stylesheet" href="src/modules/css/container.css">
  <link rel="stylesheet" href="src/modules/css/menu.css">
  <link rel="stylesheet" href="src/modules/css/layout.css">
</head>
<body class="layout-web">
  
  <!-- 侧边栏菜单 -->
  <aside class="sidebar-left">
    <menu class="menu-sidebar" id="sidebarMenu">
      <ul>
        <li data-icon="home" data-default="true" data-action='{"callback": "onHomeClick"}'>
          <a href="javascript:void(0)">首页</a>
        </li>
        
        <li data-icon="folder">
          <a href="javascript:void(0)">文档</a>
          <ul>
            <li data-icon="file">
              <a href="javascript:void(0)">快速开始</a>
            </li>
            <li data-icon="book">
              <a href="javascript:void(0)">API 文档</a>
            </li>
            <li data-icon="help">
              <a href="javascript:void(0)">常见问题</a>
            </li>
          </ul>
        </li>
        
        <li data-icon="settings" data-badge="new">
          <a href="javascript:void(0)">设置</a>
          <ul>
            <li data-icon="user">
              <a href="javascript:void(0)">个人设置</a>
            </li>
            <li data-icon="shield">
              <a href="javascript:void(0)">安全设置</a>
            </li>
          </ul>
        </li>
        
        <li data-icon="info">
          <a href="javascript:void(0)">关于</a>
        </li>
      </ul>
    </menu>
  </aside>
  
  <main class="main-content">
    <div class="CUI-wrap">
      <section class="CUI-section">
        <h1>菜单组件示例</h1>
        
        <!-- 弹出菜单 -->
        <div class="CUI-box">
          <h2>弹出菜单</h2>
          <button id="popupTrigger" class="btn btn-primary">打开菜单</button>
          
          <menu class="menu-popup menu-hidden" id="popupMenu" data-trigger="popupTrigger">
            <ul>
              <li data-icon="copy"><a href="javascript:void(0)">复制</a></li>
              <li data-icon="cut"><a href="javascript:void(0)">剪切</a></li>
              <li data-icon="paste"><a href="javascript:void(0)">粘贴</a></li>
              <li data-icon="trash"><a href="javascript:void(0)">删除</a></li>
            </ul>
          </menu>
        </div>
        
        <!-- 内联菜单 -->
        <div class="CUI-box">
          <h2>内联菜单</h2>
          <menu class="menu-inline" id="inlineMenu">
            <ul>
              <li data-icon="home">
                <a href="javascript:void(0)">首页</a>
              </li>
              
              <li data-icon="shopping-cart">
                <a href="javascript:void(0)">产品</a>
                <menu class="menu-popup menu-hidden">
                  <ul>
                    <li data-icon="smartphone"><a href="javascript:void(0)">手机</a></li>
                    <li data-icon="monitor"><a href="javascript:void(0)">电脑</a></li>
                    <li data-icon="watch"><a href="javascript:void(0)">手表</a></li>
                  </ul>
                </menu>
              </li>
              
              <li data-icon="user">
                <a href="javascript:void(0)">关于</a>
              </li>
            </ul>
          </menu>
        </div>
        
        <!-- 动态操作 -->
        <div class="CUI-box">
          <h2>动态操作</h2>
          <div class="CUI-grid CUI-grid-3c">
            <button class="btn btn-primary" onclick="addMenuItem()">添加菜单项</button>
            <button class="btn btn-secondary" onclick="togglePopup()">切换弹出菜单</button>
            <button class="btn btn-info" onclick="createMenuJS()">JS 创建菜单</button>
          </div>
        </div>
        
        <!-- 动态菜单容器 -->
        <div class="CUI-box" id="dynamicMenuContainer">
          <h2>动态创建的菜单</h2>
        </div>
      </section>
    </div>
  </main>
  
  <script type="module" src="src/modules/js/index.js"></script>
  
  <script>
  // 菜单回调函数
  function onHomeClick() {
    showToast('success', '点击了首页');
  }
  
  // 添加菜单项
  function addMenuItem() {
    CastingMenu.addItems({
      target: '#sidebarMenu ul',  // 添加到侧边栏菜单的最后
      items: [
        { 
          text: '新功能', 
          icon: 'star', 
          badge: 'new',
          action: () => showToast('info', '点击了新功能')
        }
      ]
    });
    showToast('success', '菜单项已添加');
  }
  
  // 切换弹出菜单
  function togglePopup() {
    CastingMenu.toggle('popupMenu');
  }
  
  // 通过 JS 创建菜单
  function createMenuJS() {
    const existing = document.getElementById('jsCreatedMenu');
    if (existing) {
      existing.remove();
    }
    
    CastingMenu.create({
      id: 'jsCreatedMenu',
      className: 'menu-inline',
      container: '#dynamicMenuContainer',
      items: [
        {
          text: '选项 A',
          icon: 'zap'
        },
        {
          text: '选项 B',
          icon: 'package',
          children: [
            { text: '子项 B1', icon: 'file' },
            { text: '子项 B2', icon: 'file' }
          ]
        },
        {
          text: '选项 C',
          icon: 'gift'
        }
      ]
    });
    showToast('success', '菜单已创建');
  }
  </script>
</body>
</html>
```

---

## 菜单管理器 (MenuManager)

`MenuManager` 是框架内部使用的管理器类，负责：

- 扫描并初始化页面中的菜单
- 管理所有菜单实例
- 处理响应式侧边栏
- 监听 DOM 变化

### 响应式侧边栏方法

虽然一般不需要手动调用，但了解一下：

```javascript
// 将侧边栏移动到顶部（移动端）
menuManager.moveSidebarToTop();

// 恢复侧边栏到原始位置（桌面端）
menuManager.restoreSidebarPosition();

// 检查并调整侧边栏位置
menuManager.checkAndAdjustSidebar();
```

---

## 样式定制

可以通过 CSS 变量或覆盖类来定制菜单样式：

```css
/* 修改菜单颜色 */
.menu-sidebar {
  --primary-color: #1890ff;
  --bg-color: #f5f7fa;
}

/* 调整尺寸 */
.menu-sidebar li a {
  padding: 12px 20px;
  font-size: 14px;
}
```
