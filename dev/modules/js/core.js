/* 
 * Casting UI Framework
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

// 调试开关
const DEBUG_MODE = true;

// 调试函数
function debug(action, element, details = {}) {
    if (DEBUG_MODE) {
        console.log(`[DEBUG] ${action}`, {
            element: element instanceof Element ? element.tagName + (element.id ? `#${element.id}` : '') : element,
            details
        });
    }
}

// 遮罩组件
function createOverlay(options = {}) {
    const id = options.id || `overlay-${Date.now()}`;
    const type = options.type || 'transparent'; // transparent 或 glass
    const zIndex = options.zIndex || 9999;
    
    // 检查是否已存在遮罩
    let overlay = document.getElementById(id);
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = id;
        overlay.className = `overlay overlay-${type}`;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: ${zIndex};
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all var(--transition-normal);
        `;
        
        // 添加到body
        document.body.appendChild(overlay);
    }
    
    return overlay;
}

// 显示遮罩
function showOverlay(options = {}) {
    const overlay = createOverlay(options);
    
    // 显示遮罩
    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
    }, 10);
    
    return overlay;
}

// 隐藏遮罩
function hideOverlay(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (document.getElementById(id)) {
                document.body.removeChild(overlay);
            }
        }, 300);
    }
}



// 弹出机制基类
class PopupBase {
    constructor() {
        this.init();
    }

    init() {
        // 初始化基础设置
    }

    // 打开组件
    open(options = {}) {
        const mode = options.mode || (options.container ? 'inline' : 'modal');
        const container = options.container;

        if (mode === 'modal') {
            return this.openModal(options);
        } else if (mode === 'inline' && container) {
            return this.openInline(options);
        }

        return Promise.reject('Invalid mode or container');
    }

    // 弹窗模式
    openModal(options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const overlay = showOverlay({
                    id: this.getOverlayId(),
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
                            hideOverlay(this.getOverlayId());
                            reject(this.getCloseReason());
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
                // 获取容器元素
                let containerElement;
                if (typeof container === 'string') {
                    containerElement = document.querySelector(container);
                } else {
                    containerElement = container;
                }

                // 检查容器是否存在
                if (!containerElement) {
                    reject('Container not found');
                    return;
                }

                // 检查是否已存在内联组件
                let existingComponent = containerElement.querySelector(this.getInlineSelector());
                if (existingComponent) {
                    // 切换显示/隐藏
                    existingComponent.style.display = existingComponent.style.display === 'none' ? 'block' : 'none';
                    return Promise.reject(this.getToggleReason());
                }

                // 创建组件容器
                const componentContainer = this.createContainer({ ...restOptions, resolve, reject });
                componentContainer.className = this.getInlineClassName();
                componentContainer.style.cssText = this.getInlineStyle();

                // 移除固定定位相关样式
                const header = componentContainer.querySelector(this.getHeaderSelector());
                if (header) {
                    this.adjustInlineHeader(header);
                }

                containerElement.appendChild(componentContainer);
                resolve(componentContainer);

            } catch (error) {
                reject(error);
            }
        });
    }

    // 模板方法，子类需要实现
    getOverlayId() {
        return 'popup-overlay';
    }

    getInlineSelector() {
        return '.popup-inline';
    }

    getInlineClassName() {
        return 'popup-inline';
    }

    getInlineStyle() {
        return `
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
    }

    getHeaderSelector() {
        return '.popup-header';
    }

    adjustInlineHeader(header) {
        header.style.position = 'relative';
        header.style.top = '0';
        header.style.left = '0';
        header.style.right = '0';
    }

    getCloseReason() {
        return 'Popup closed';
    }

    getToggleReason() {
        return 'Popup toggled';
    }

    // 子类需要实现的方法
    createContainer(options) {
        throw new Error('Subclass must implement createContainer method');
    }
}