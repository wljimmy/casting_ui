# 动态页面加载功能记忆

## 功能描述
- **功能**：通过点击左侧菜单动态加载对应子页面
- **实现**：使用fetch API获取子页面HTML内容，然后插入到主页面的内容容器中

## 代码实现
- **代码位置**：index.html中的loadPage函数
- **核心逻辑**：
  1. 点击菜单链接时，获取目标页面ID
  2. 调用loadPage函数加载对应页面
  3. 显示加载动画
  4. 使用fetch API获取页面内容
  5. 将内容插入到content-container
  6. 隐藏加载动画

## 页面映射
- **basic-layout** → `pages/basic-layout/index.html`
- **interaction-controls** → `pages/interaction-controls/index.html`
- **feedback-components** → `pages/feedback-components/index.html`
- **data-display** → `pages/data-display/index.html`
- **general-ui** → `pages/general-ui/index.html`

## 使用方式
- 点击左侧菜单中的链接，自动加载对应页面
- 页面加载过程中会显示加载动画
- 加载完成后自动更新内容区域