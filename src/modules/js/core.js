/* 
 * Casting UI Framework
 * Version: 0.3.0
 * Module: core.js
 * Description: 核心模块，提供调试、遮罩、弹窗基类等功能
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
                const overlayObj = window.CUI.overlay({
                    type: 'transparent',
                    zIndex: 1000
                });
                const overlayElement = overlayObj.element;
                // 为了兼容旧版逻辑 依然绑定 id
                overlayElement.id = this.getOverlayId();
                this._currentOverlayObj = overlayObj;

                const container = this.createContainer({ ...options, resolve, reject, overlay: overlayElement });
                overlayElement.appendChild(container);

                overlayElement.addEventListener('click', (e) => {
                    if (e.target === overlayElement) {
                        this.close();
                        reject(this.getCloseReason());
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

    close() {
        if (this._currentOverlayObj) {
            this._currentOverlayObj.close();
            this._currentOverlayObj = null;
        } else {
            // 降级兼容：如果不是通过新方法创建的
            const overlay = document.getElementById(this.getOverlayId());
            if (overlay && overlay.parentNode) {
                window.CUI.overlay.close(overlay.parentNode);
            }
        }
    }

    // 子类需要实现的方法
    createContainer(options) {
        throw new Error('Subclass must implement createContainer method');
    }
}

// 导出
export { DEBUG_MODE, debug, PopupBase };

// 保证命名空间完整
if (!window.CUI) {
    window.CUI = {};
}

// 注册到全局生命周期调度器（如果调度器已加载）
if (typeof window.CUI.registerModule === 'function') {
    window.CUI.registerModule('core', {
        stages: {
            CORE: () => {
                window.CUI.DEBUG_MODE = DEBUG_MODE;
                window.CUI.debug = debug;
                window.CUI.PopupBase = PopupBase;
            }
        }
    });
} else {
    // 调度器未加载时直接释放 API
    window.CUI.DEBUG_MODE = DEBUG_MODE;
    window.CUI.debug = debug;
    window.CUI.PopupBase = PopupBase;
}