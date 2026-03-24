# 弹出机制技术文档

## 1. 设计理念

弹出机制是一种通用的交互模式，用于在应用中显示临时内容或获取用户输入。本技术文档定义了一种标准的弹出机制实现方式，支持两种显示模式：

- **弹窗模式**：当未指定容器时，内容以模态弹窗的形式显示在屏幕中央
- **内联模式**：当指定容器时，内容以内联的形式显示在指定容器内部

这种设计理念旨在提供一种统一、灵活的弹出内容展示方式，适用于各种需要临时显示内容的场景，如主题选择器、颜色选择器、配置面板等。

## 2. 实现方式

### 2.1 核心架构

弹出机制的核心实现基于以下组件：

1. **全局函数**：提供统一的调用入口
2. **管理器类**：负责具体的业务逻辑和UI生成
3. **遮罩组件**：用于弹窗模式的背景遮罩
4. **容器生成**：根据模式创建不同的容器

### 2.2 关键代码结构

#### 全局函数

```javascript
function openComponent(options) {
    if (window.ui) {
        const manager = window.ui.getManager();
        // 处理容器选择器
        if (options.container && typeof options.container === 'string') {
            options.container = document.querySelector(options.container);
        }
        return manager.open(options);
    } else {
        // 如果UI实例还未创建，延迟重试
        return new Promise((resolve) => {
            setTimeout(() => {
                openComponent(options).then(resolve);
            }, 100);
        });
    }
}
```

#### 管理器类

```javascript
class ComponentManager {
    constructor() {
        this.init();
    }

    init() {
        // 初始化逻辑
    }

    // 打开组件
    open(options = {}) {
        const mode = options.mode || (options.container ? 'inline' : 'modal');
        
        if (mode === 'modal') {
            return this.openModal(options);
        } else if (mode === 'inline' && options.container) {
            return this.openInline(options);
        }

        return Promise.reject('Invalid mode or container');
    }

    // 弹窗模式
    openModal(options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const overlay = showOverlay({
                    id: 'component-overlay',
                    type: 'transparent',
                    zIndex: 1000
                });

                const container = this.createContainer({ ...options, resolve, reject, overlay });
                overlay.appendChild(container);

                // 显示遮罩
                setTimeout(() => {
                    overlay.classList.add('show');
                }, 10);

                // 处理点击遮罩关闭
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        overlay.classList.remove('show');
                        setTimeout(() => {
                            hideOverlay('component-overlay');
                            reject('Component closed');
                        }, 300);
                    }
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    // 内联模式
    openInline(options = {}) {
        const { container, ...restOptions } = options;

        return new Promise((resolve, reject) => {
            try {
                // 检查是否已存在内联组件
                let existingComponent = container.querySelector('.component-inline');
                if (existingComponent) {
                    // 切换显示/隐藏
                    existingComponent.style.display = existingComponent.style.display === 'none' ? 'block' : 'none';
                    return Promise.reject('Component toggled');
                }

                // 创建组件容器
                const componentContainer = this.createContainer({ ...restOptions, resolve, reject });
                componentContainer.className = 'component-inline';
                componentContainer.style.cssText = `
                    position: relative;
                    background: var(--bg-color);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: var(--size-md);
                    box-shadow: var(--shadow-md);
                    margin-top: var(--size-sm);
                    z-index: 1000;
                    width: 100%;
                    min-width: 400px;
                    max-width: 100%;
                    max-height: 70vh;
                    overflow-y: auto;
                `;

                // 移除固定定位相关样式
                const header = componentContainer.querySelector('.component-header');
                if (header) {
                    header.style.position = 'relative';
                    header.style.top = '0';
                    header.style.left = '0';
                    header.style.right = '0';
                }

                container.appendChild(componentContainer);

            } catch (error) {
                reject(error);
            }
        });
    }

    // 创建组件容器
    createContainer(options = {}) {
        // 创建容器逻辑
        const container = document.createElement('div');
        // ... 容器内容生成逻辑
        return container;
    }
}
```

### 2.3 集成到UI框架

```javascript
class UI {
    constructor() {
        this.componentManager = new ComponentManager();
        this.init();
    }

    init() {
        // 初始化逻辑
    }

    getComponentManager() {
        return this.componentManager;
    }
}

// 在DOM加载完成后初始化UI
document.addEventListener('DOMContentLoaded', function() {
    window.ui = new UI();
});
```

## 3. 使用方法

### 3.1 弹窗模式

```javascript
openComponent({
    // 无需指定container，默认使用弹窗模式
    format: 'hex',
    // 其他配置选项
})
.then(result => {
    console.log('操作结果:', result);
})
.catch(error => {
    console.log('操作已取消:', error);
});
```

### 3.2 内联模式

```javascript
openComponent({
    mode: 'inline',
    container: '#containerId', // 指定容器
    format: 'rgb',
    // 其他配置选项
})
.then(result => {
    console.log('操作结果:', result);
})
.catch(error => {
    console.log('操作已取消:', error);
});
```

## 4. 示例实现

### 4.1 颜色选择器

```javascript
// 全局函数
function openColorPicker(options) {
    if (window.ui) {
        const colorPicker = window.ui.getColorPicker();
        if (options.container && typeof options.container === 'string') {
            options.container = document.querySelector(options.container);
        }
        return colorPicker.open(options);
    } else {
        return new Promise((resolve) => {
            setTimeout(() => {
                openColorPicker(options).then(resolve);
            }, 100);
        });
    }
}

// 使用示例
// 弹窗模式
openColorPicker({ format: 'hex' })
.then(color => console.log('选择的颜色:', color));

// 内联模式
openColorPicker({
    mode: 'inline',
    container: '#colorContainer',
    format: 'rgb'
})
.then(color => console.log('选择的颜色:', color));
```

### 4.2 主题选择器

```javascript
// 全局函数
function openThemeSelector(options) {
    if (window.ui) {
        const themeManager = window.ui.getThemeManager();
        if (options.container && typeof options.container === 'string') {
            options.container = document.querySelector(options.container);
        }
        themeManager.openThemeSelector(options);
    } else {
        setTimeout(() => openThemeSelector(options), 100);
    }
}

// 使用示例
// 弹窗模式
openThemeSelector({});

// 内联模式
openThemeSelector({
    mode: 'inline',
    container: '#themeContainer'
});
```

## 5. 注意事项

1. **容器选择器**：当使用内联模式时，确保指定的容器选择器能够正确找到DOM元素
2. **Promise处理**：弹窗和内联模式都返回Promise，用于处理用户操作结果
3. **样式一致性**：确保弹出内容的样式与应用整体风格一致
4. **响应式设计**：弹出内容应支持响应式布局，适应不同屏幕尺寸
5. **性能优化**：对于复杂的弹出内容，考虑使用虚拟滚动或分页加载
6. **无障碍访问**：确保弹出内容支持键盘导航和屏幕阅读器
7. **事件处理**：正确处理弹出内容中的事件，避免事件冒泡和默认行为
8. **内存管理**：及时清理不再使用的DOM元素，避免内存泄漏

## 6. 最佳实践

1. **统一入口**：所有弹出组件使用相同的调用方式，便于维护和扩展
2. **配置灵活**：支持丰富的配置选项，满足不同场景的需求
3. **动画效果**：添加适当的动画效果，提升用户体验
4. **错误处理**：完善的错误处理机制，确保组件稳定运行
5. **文档完善**：为每个弹出组件提供详细的使用文档
6. **测试覆盖**：编写充分的测试用例，确保组件功能正常

## 7. 总结

这种弹出机制提供了一种统一、灵活的方式来显示临时内容，支持弹窗和内联两种模式，适用于各种需要用户交互的场景。通过遵循本文档定义的标准实现方式，可以确保应用中所有弹出组件的一致性和可维护性。

这种设计模式已经在主题选择器和颜色选择器中得到了验证，是一种成熟、可靠的技术方案。