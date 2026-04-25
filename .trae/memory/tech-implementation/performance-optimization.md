# 性能优化技术记忆

## 实现方式
- **content-visibility: auto** - 优化渲染性能
- **Image Lazy Loading** - 图片懒加载
- **Dynamic Page Loading** - 动态加载页面
- **Minimal Dependencies** - 无外部依赖

## 渲染优化
- **content-visibility: auto** - 只渲染可见区域的内容
- **CSS Variables** - 减少样式重复
- **Efficient Selectors** - 使用高效的CSS选择器

## 资源优化
- **Image Lazy Loading** - 只有当图片进入视口时才加载
- **Dynamic Page Loading** - 只加载当前需要的页面内容
- **Minified CSS/JS** - 压缩CSS和JavaScript文件

## 网络优化
- **Fetch API** - 使用现代的网络请求API
- **Caching** - 合理使用浏览器缓存
- **Reduced HTTP Requests** - 减少HTTP请求次数

## 运行时优化
- **Event Delegation** - 使用事件委托减少事件监听器
- **Debouncing** - 防抖处理频繁触发的事件
- **Throttling** - 节流处理连续触发的事件