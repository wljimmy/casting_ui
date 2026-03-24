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
                // 检查是否已存在内联组件
                let existingComponent = container.querySelector(this.getInlineSelector());
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

                container.appendChild(componentContainer);

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

// 弹窗函数，返回Promise
function showModal(options) {
    debug('显示弹窗', options);
    
    // 生成唯一ID
    const id = options.id || `modal-${Date.now()}`;
    const overlayId = `${id}-overlay`;
    
    // 弹窗配置默认值
    const config = {
        title: options.title || '弹窗标题',
        content: options.content || '弹窗内容',
        buttons: options.buttons || [{ text: '关闭', type: 'secondary', action: 'close' }],
        position: options.position || '',
        glass: options.glass || false,
        inputs: options.inputs || []
    };
    
    return new Promise((resolve, reject) => {
        try {
            // 创建遮罩
            const overlay = showOverlay({
                id: overlayId,
                type: config.glass ? 'glass' : 'transparent',
                zIndex: 1000
            });
            
            // 创建弹窗内容元素
            const modalContent = document.createElement('div');
            modalContent.className = `modal-content ${config.position ? `modal-${config.position}` : ''}`;
            
            // 创建输入框HTML
            let inputsHTML = '';
            config.inputs.forEach((input, index) => {
                inputsHTML += `
                    <div class="input-group" style="margin-bottom: 12px;">
                        <label class="input-label">${input.label}</label>
                        <input type="${input.type || 'text'}" class="input" id="${id}-input-${index}" placeholder="${input.placeholder || ''}" value="${input.value || ''}">
                    </div>
                `;
            });
            
            // 创建按钮HTML
            let buttonsHTML = '';
            config.buttons.forEach((button, index) => {
                buttonsHTML += `<button class="btn btn-${button.type}" data-index="${index}">${button.text}</button>`;
            });
            
            // 构建弹窗内容
            modalContent.innerHTML = `
                <div class="modal-header">
                    <h4 class="modal-title">${config.title}</h4>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${config.content}</p>
                    ${inputsHTML}
                </div>
                <div class="modal-footer">
                    ${buttonsHTML}
                </div>
            `;
            
            // 添加到遮罩
            overlay.appendChild(modalContent);
            
            // 显示弹窗
            setTimeout(() => {
                overlay.classList.add('show');
            }, 10);
            
            // 处理按钮点击
            const buttons = modalContent.querySelectorAll('.modal-footer button');
            buttons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    // 收集输入内容
                    const inputs = {};
                    config.inputs.forEach((input, inputIndex) => {
                        const inputElement = document.getElementById(`${id}-input-${inputIndex}`);
                        if (inputElement) {
                            inputs[input.name || `input-${inputIndex}`] = inputElement.value;
                        }
                    });
                    
                    // 隐藏遮罩
                    overlay.classList.remove('show');
                    
                    // 动画结束后移除元素并返回结果
                    setTimeout(() => {
                        hideOverlay(overlayId);
                        resolve({
                            status: 'success',
                            button: config.buttons[index],
                            inputs: inputs
                        });
                    }, 300);
                });
            });
            
            // 处理关闭按钮点击
            const closeButton = modalContent.querySelector('.modal-close');
            closeButton.addEventListener('click', () => {
                overlay.classList.remove('show');
                setTimeout(() => {
                    hideOverlay(overlayId);
                    resolve({
                        status: 'closed',
                        button: null,
                        inputs: {}
                    });
                }, 300);
            });
            
            // 处理点击遮罩关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('show');
                    setTimeout(() => {
                        hideOverlay(overlayId);
                        resolve({
                            status: 'closed',
                            button: null,
                            inputs: {}
                        });
                    }, 300);
                }
            });
            
        } catch (error) {
            reject({
                status: 'error',
                error: error.message
            });
        }
    });
}

// 消息提示组件
function createMessage(options = {}) {
    const id = options.id || `message-${Date.now()}`;
    const type = options.type || 'info'; // info, success, warning, error
    const title = options.title || '消息';
    const content = options.content || '';
    const duration = options.duration;
    const position = options.position || 'top'; // top, bottom, left, right, center
    
    // 创建消息容器
    const message = document.createElement('div');
    message.id = id;
    message.className = `message message-${type} message-${position}`;
    message.style.cssText = `
        padding: 16px;
        background-color: var(--gray-100);
        border-radius: var(--radius-md);
        border-left: 4px solid var(--primary-color);
        box-shadow: var(--shadow-sm);
        transition: all var(--transition-normal);
    `;
    
    // 设置不同类型的边框颜色
    switch (type) {
        case 'success':
            message.style.borderLeftColor = 'var(--success-color)';
            break;
        case 'warning':
            message.style.borderLeftColor = 'var(--warning-color)';
            break;
        case 'error':
            message.style.borderLeftColor = 'var(--error-color)';
            break;
        default:
            message.style.borderLeftColor = 'var(--primary-color)';
    }
    
    // 构建消息内容
    message.innerHTML = `
        <h4>${title}</h4>
        <div>${content}</div>
    `;
    
    // 添加到页面
    const container = options.container || document.body;
    
    // 检查container是否为容器元素
    const isContainer = container.children.length > 0;
    
    if (isContainer) {
        // 如果是容器，在容器的最后一个元素后显示，宽度占据所有列
        message.style.width = '100%';
        message.style.margin = '16px 0';
        container.appendChild(message);
    } else {
        // 如果是普通元素，显示在该元素下部，和该元素等宽
        message.style.width = container.offsetWidth + 'px';
        message.style.marginTop = '16px';
        container.parentNode.insertBefore(message, container.nextSibling);
    }
    
    // 自动关闭
    if (duration !== undefined && duration !== 0) {
        // 确保持续时间至少为1秒
        const actualDuration = Math.max(1000, duration);
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-10px)';
            message.style.transition = 'all var(--transition-normal)';
            setTimeout(() => {
                if (document.getElementById(id)) {
                    if (isContainer) {
                        container.removeChild(message);
                    } else {
                        container.parentNode.removeChild(message);
                    }
                }
            }, 300);
        }, actualDuration);
    }
    
    return message;
}

function showToast(type, message, position = 'top') {
    debug('显示Toast', null, { type, message, position });
    // 创建Toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} toast-${position}`;
    toast.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}
            ${type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' : ''}
            ${type === 'warning' ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>' : ''}
            ${type === 'info' ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>' : ''}
        </svg>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示Toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // 3秒后隐藏并移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function showLoading() {
    debug('显示加载遮罩', 'loadingOverlay');
    
    // 检查是否已存在加载遮罩
    let loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) {
        // 创建加载遮罩元素
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.style.display = 'none';
        loadingOverlay.innerHTML = '<div class="loading loading-lg"></div>';
        
        // 添加到body
        document.body.appendChild(loadingOverlay);
    }
    
    // 显示加载遮罩
    loadingOverlay.style.display = 'flex';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        // 隐藏后移除元素
        setTimeout(() => {
            if (document.getElementById('loadingOverlay')) {
                document.body.removeChild(loadingOverlay);
            }
        }, 300);
    }, 3000);
}

// 图片放大全局函数
function zoomImage(src) {
    debug('放大图片', null, { src });
    
    // 检查是否已存在图片放大遮罩
    let overlay = document.getElementById('imageZoomOverlay');
    if (!overlay) {
        // 创建图片放大遮罩元素
        overlay = document.createElement('div');
        overlay.id = 'imageZoomOverlay';
        overlay.className = 'image-zoom-overlay';
        overlay.innerHTML = `
            <button class="image-zoom-close" onclick="closeImageZoom()">&times;</button>
            <img id="imageZoomContent" class="image-zoom-content" src="" alt="放大图片">
        `;
        
        // 添加到body
        document.body.appendChild(overlay);
        
        // 点击遮罩关闭图片放大
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeImageZoom();
            }
        });
    }
    
    // 设置图片源并显示遮罩
    const content = document.getElementById('imageZoomContent');
    if (content) {
        content.src = src;
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
    }
}

function closeImageZoom() {
    debug('关闭图片放大', 'imageZoomOverlay');
    const overlay = document.getElementById('imageZoomOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        // 动画结束后移除元素
        setTimeout(() => {
            if (document.getElementById('imageZoomOverlay')) {
                document.body.removeChild(overlay);
            }
        }, 300);
    }
}

// 主题管理模块
class ThemeManager extends PopupBase {
    constructor() {
        super();
        this.themes = [];
        this.currentTheme = null;
    }

    async init() {
        try {
            // 加载主题配置（使用绝对路径）
            const response = await fetch('/themes.json');
            const data = await response.json();
            this.themes = data.themes;
            this.currentTheme = this.themes[0]; // 默认使用第一个主题
            this.applyTheme(this.currentTheme);
        } catch (error) {
            debug('加载主题配置失败', null, { error: error.message });
        }
    }

    applyTheme(theme) {
        if (!theme || !theme.colors) return;

        this.currentTheme = theme;
        const root = document.documentElement;

        // 应用主题颜色到CSS变量
        for (const [key, value] of Object.entries(theme.colors)) {
            root.style.setProperty(`--${key}`, value);
        }

        // 保存当前主题到本地存储
        localStorage.setItem('currentTheme', theme.name);
    }

    // 打开主题选择器
    openThemeSelector(options = {}) {
        return this.open(options);
    }

    // 模板方法实现
    getOverlayId() {
        return 'theme-selector-overlay';
    }

    getInlineSelector() {
        return '.theme-selector-inline';
    }

    getInlineClassName() {
        return 'theme-selector-inline';
    }

    getHeaderSelector() {
        return '.theme-selector-header';
    }

    getCloseReason() {
        return 'Theme selector closed';
    }

    getToggleReason() {
        return 'Theme selector toggled';
    }

    // 创建主题选择器容器
    createContainer(options = {}) {
        const { resolve, reject, overlay } = options;

        const container = document.createElement('div');
        container.className = 'theme-selector-container';
        container.style.cssText = `
            width: 90vw;
            max-width: 800px;
            max-height: 80vh;
            background: var(--bg-color);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        // 创建头部
        const header = document.createElement('div');
        header.className = 'theme-selector-header';
        header.style.cssText = `
            padding: var(--size-lg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            background: var(--bg-color);
            z-index: 10;
        `;

        const title = document.createElement('h3');
        title.textContent = '主题管理';
        title.style.cssText = `
            margin: 0;
            color: var(--text-primary);
        `;

        const closeButton = document.createElement('button');
        closeButton.className = 'theme-selector-close';
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-light);
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-sm);
            transition: all var(--transition-normal);
        `;

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.backgroundColor = 'var(--gray-100)';
            closeButton.style.color = 'var(--text-primary)';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.color = 'var(--text-light)';
        });

        closeButton.addEventListener('click', () => {
            if (overlay) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    hideOverlay('theme-selector-overlay');
                    if (reject) reject('Theme selector closed');
                }, 300);
            } else {
                const inlineSelector = closeButton.closest('.theme-selector-inline');
                if (inlineSelector) {
                    inlineSelector.style.display = 'none';
                    if (reject) reject('Theme selector closed');
                }
            }
        });

        header.appendChild(title);
        header.appendChild(closeButton);
        container.appendChild(header);

        // 创建内容区域
        const content = document.createElement('div');
        content.className = 'theme-selector-content';
        content.style.cssText = `
            padding: var(--size-lg);
            overflow-y: auto;
            flex: 1;
        `;

        // 创建主题管理区域
        const themeManagement = document.createElement('div');
        themeManagement.className = 'theme-management';
        themeManagement.style.cssText = `
            margin-bottom: var(--size-xl);
        `;

        const managementTitle = document.createElement('h4');
        managementTitle.textContent = '主题管理';
        managementTitle.style.cssText = `
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;

        const managementButtons = document.createElement('div');
        managementButtons.className = 'management-buttons';
        managementButtons.style.cssText = `
            display: flex;
            gap: var(--size-md);
            margin-bottom: var(--size-md);
        `;

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-primary';
        addButton.textContent = '添加主题';
        addButton.style.cssText = `
            padding: var(--size-sm) var(--size-md);
            border: none;
            border-radius: var(--radius-sm);
            background: var(--primary-color);
            color: white;
            cursor: pointer;
            transition: all var(--transition-normal);
        `;

        const importButton = document.createElement('button');
        importButton.className = 'btn btn-default';
        importButton.textContent = '导入主题';
        importButton.style.cssText = `
            padding: var(--size-sm) var(--size-md);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            background: var(--bg-color);
            color: var(--text-primary);
            cursor: pointer;
            transition: all var(--transition-normal);
        `;

        const exportButton = document.createElement('button');
        exportButton.className = 'btn btn-default';
        exportButton.textContent = '导出主题';
        exportButton.style.cssText = `
            padding: var(--size-sm) var(--size-md);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            background: var(--bg-color);
            color: var(--text-primary);
            cursor: pointer;
            transition: all var(--transition-normal);
        `;

        managementButtons.appendChild(addButton);
        managementButtons.appendChild(importButton);
        managementButtons.appendChild(exportButton);
        themeManagement.appendChild(managementTitle);
        themeManagement.appendChild(managementButtons);

        // 创建主题列表
        const themeListSection = document.createElement('div');
        themeListSection.className = 'theme-list-section';
        themeListSection.style.cssText = `
            margin-bottom: var(--size-xl);
        `;

        const themeListTitle = document.createElement('h4');
        themeListTitle.textContent = '主题列表';
        themeListTitle.style.cssText = `
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;

        const themeList = document.createElement('div');
        themeList.className = 'theme-list';
        themeList.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: var(--size-md);
        `;

        // 添加主题选项
        if (this.themes && this.themes.length > 0) {
            this.themes.forEach(theme => {
                const themeCard = document.createElement('div');
                themeCard.className = 'theme-card';
                themeCard.style.cssText = `
                    padding: var(--size-md);
                    border: 2px solid ${theme.name === this.currentTheme?.name ? 'var(--primary-color)' : 'var(--border-color)'};
                    border-radius: var(--radius-md);
                    background: var(--bg-color);
                    cursor: pointer;
                    transition: all var(--transition-normal);
                    position: relative;
                `;

                themeCard.addEventListener('mouseenter', () => {
                    themeCard.style.boxShadow = 'var(--shadow-md)';
                });

                themeCard.addEventListener('mouseleave', () => {
                    themeCard.style.boxShadow = 'none';
                });

                themeCard.addEventListener('click', () => {
                    this.applyTheme(theme);
                    // 更新所有主题卡片的样式
                    document.querySelectorAll('.theme-card').forEach(card => {
                        const cardName = card.querySelector('.theme-card-name').textContent;
                        card.style.borderColor = cardName === theme.name ? 'var(--primary-color)' : 'var(--border-color)';
                    });
                });

                const themeName = document.createElement('div');
                themeName.className = 'theme-card-name';
                themeName.textContent = theme.name;
                themeName.style.cssText = `
                    font-weight: 600;
                    margin-bottom: var(--size-sm);
                    color: var(--text-primary);
                `;

                const colorPreview = document.createElement('div');
                colorPreview.className = 'color-preview';
                colorPreview.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--size-xs);
                    margin-bottom: var(--size-sm);
                `;

                // 添加颜色块
                const colors = [
                    theme.colors['primary-color'],
                    theme.colors['bg-color'],
                    theme.colors['gray-100'],
                    theme.colors['text-primary']
                ];

                colors.forEach(color => {
                    const colorBox = document.createElement('div');
                    colorBox.className = 'color-box';
                    colorBox.style.cssText = `
                        width: 100%;
                        aspect-ratio: 1;
                        border-radius: var(--radius-sm);
                        background-color: ${color};
                        border: 1px solid var(--border-color);
                    `;
                    colorPreview.appendChild(colorBox);
                });

                const actionButtons = document.createElement('div');
                actionButtons.className = 'theme-card-actions';
                actionButtons.style.cssText = `
                    display: flex;
                    gap: var(--size-xs);
                    margin-top: var(--size-sm);
                `;

                const editButton = document.createElement('button');
                editButton.className = 'btn btn-sm btn-default';
                editButton.textContent = '编辑';
                editButton.style.cssText = `
                    padding: 4px 8px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    background: var(--bg-color);
                    color: var(--text-primary);
                    cursor: pointer;
                    font-size: 12px;
                    flex: 1;
                `;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-sm btn-error';
                deleteButton.textContent = '删除';
                deleteButton.style.cssText = `
                    padding: 4px 8px;
                    border: 1px solid var(--error-color);
                    border-radius: var(--radius-sm);
                    background: var(--bg-color);
                    color: var(--error-color);
                    cursor: pointer;
                    font-size: 12px;
                    flex: 1;
                `;

                actionButtons.appendChild(editButton);
                actionButtons.appendChild(deleteButton);
                themeCard.appendChild(themeName);
                themeCard.appendChild(colorPreview);
                themeCard.appendChild(actionButtons);
                themeList.appendChild(themeCard);
            });
        } else {
            // 显示加载中提示
            const loadingMessage = document.createElement('div');
            loadingMessage.textContent = '主题加载中...';
            loadingMessage.style.cssText = `
                text-align: center;
                padding: var(--size-lg);
                color: var(--text-secondary);
            `;
            themeList.appendChild(loadingMessage);
        }

        themeListSection.appendChild(themeListTitle);
        themeListSection.appendChild(themeList);

        // 创建示例组件区域
        const exampleSection = document.createElement('div');
        exampleSection.className = 'example-section';

        const exampleTitle = document.createElement('h4');
        exampleTitle.textContent = '示例组件';
        exampleTitle.style.cssText = `
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;

        const exampleComponent = document.createElement('div');
        exampleComponent.className = 'example-component';
        exampleComponent.style.cssText = `
            padding: var(--size-lg);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            background: var(--bg-color);
        `;

        // 示例组件HTML
        exampleComponent.innerHTML = `
            <div class="component-demo">
                <div class="main-content">
                    <h1 class="magazine-title">Modern Magazine Layout</h1>
                    <h2 class="magazine-subtitle">现代杂志风设计 · 配色方案预览</h2>
                    <p class="magazine-paragraph">
                        这是一套为现代杂志设计的配色方案，兼顾视觉高级感与阅读舒适度。主色调采用低饱和的高级色系，中性灰层次分明，功能色克制且醒目，完美适配图文混排的杂志排版需求。
                    </p>
                    <img src="https://picsum.photos/800/400?1" class="magazine-img">
                    <p class="magazine-paragraph">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p class="magazine-paragraph">
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 杂志排版的核心是色彩层次与阅读节奏，这套配色方案通过主色、中性色的精准搭配，营造出既时尚又不失温度的视觉体验。
                    </p>
                </div>

                <div class="sidebar">
                    <div class="btn-group">
                        <div class="btn-title">按钮组件</div>
                        <button class="btn btn-primary">主色调按钮</button>
                        <button class="btn btn-default">默认按钮</button>
                    </div>
                    <div class="tag-group">
                        <div class="btn-title">功能色标签</div>
                        <span class="tag tag-success">成功</span>
                        <span class="tag tag-warning">警告</span>
                        <span class="tag tag-error">错误</span>
                        <span class="tag tag-info">信息</span>
                    </div>
                    <div class="text-group">
                        <div class="btn-title">文本色层次</div>
                        <div class="text-item text-primary">主要文本色</div>
                        <div class="text-item text-secondary">次要文本色</div>
                        <div class="text-item text-light">辅助文本色</div>
                        <div class="text-item text-disabled">禁用文本色</div>
                    </div>
                    <div class="bg-group">
                        <div class="btn-title">背景色示例</div>
                        <div class="bg-item bg-primary">主色背景</div>
                        <div class="bg-item bg-gray">灰色背景</div>
                        <div class="bg-item bg-white">白色背景</div>
                    </div>
                </div>
            </div>
        `;

        // 添加示例组件样式
        const exampleStyle = document.createElement('style');
        exampleStyle.textContent = `
            .component-demo {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: var(--size-lg);
            }

            .main-content h1 {
                color: var(--primary-color);
                margin-bottom: var(--size-md);
            }

            .main-content h2 {
                color: var(--text-primary);
                margin-bottom: var(--size-md);
            }

            .main-content p {
                color: var(--text-secondary);
                margin-bottom: var(--size-md);
                line-height: 1.6;
            }

            .magazine-img {
                width: 100%;
                border-radius: var(--radius-md);
                margin: var(--size-md) 0;
            }

            .sidebar {
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            }

            .btn-group, .tag-group, .text-group, .bg-group {
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            }

            .btn-title {
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            }

            .btn {
                display: block;
                width: 100%;
                padding: var(--size-sm);
                margin-bottom: var(--size-xs);
                border: none;
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: all var(--transition-normal);
            }

            .btn-primary {
                background: var(--primary-color);
                color: white;
            }

            .btn-default {
                background: var(--bg-color);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
            }

            .tag {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
            }

            .tag-success {
                background: var(--success-color);
                color: white;
            }

            .tag-warning {
                background: var(--warning-color);
                color: white;
            }

            .tag-error {
                background: var(--error-color);
                color: white;
            }

            .tag-info {
                background: var(--info-color);
                color: white;
            }

            .text-item {
                margin-bottom: var(--size-xs);
            }

            .text-primary {
                color: var(--text-primary);
            }

            .text-secondary {
                color: var(--text-secondary);
            }

            .text-light {
                color: var(--text-light);
            }

            .text-disabled {
                color: var(--text-disabled);
            }

            .bg-item {
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: white;
                text-align: center;
            }

            .bg-primary {
                background: var(--primary-color);
            }

            .bg-gray {
                background: var(--gray-100);
                color: var(--text-primary);
            }

            .bg-white {
                background: var(--bg-color);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
            }

            @media (max-width: 768px) {
                .component-demo {
                    grid-template-columns: 1fr;
                }
            }
        `;

        exampleSection.appendChild(exampleTitle);
        exampleSection.appendChild(exampleComponent);
        exampleSection.appendChild(exampleStyle);

        content.appendChild(themeManagement);
        content.appendChild(themeListSection);
        content.appendChild(exampleSection);
        container.appendChild(content);

        return container;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemes() {
        return this.themes;
    }
}

// 颜色选择器类
class ColorPicker extends PopupBase {
    constructor() {
        super();
    }

    init() {
        // 初始化颜色选择器
    }

    // 打开颜色选择器
    open(options = {}) {
        const presetColors = options.presetColors || [
            '#165DFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
            '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
            '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000'
        ];
        const format = options.format || 'hex'; // hex, rgb, rgba

        return super.open({ ...options, presetColors, format });
    }

    // 模板方法实现
    getOverlayId() {
        return 'color-picker-overlay';
    }

    getInlineSelector() {
        return '.color-picker-inline';
    }

    getInlineClassName() {
        return 'color-picker-inline';
    }

    getHeaderSelector() {
        return '.color-picker-header';
    }

    getCloseReason() {
        return 'Color picker closed';
    }

    getToggleReason() {
        return 'Color picker toggled';
    }

    // 创建颜色选择器容器
    createContainer(options = {}) {
        const { presetColors, format, resolve, reject, overlay } = options;

        const container = document.createElement('div');
        container.className = 'color-picker-container';
        container.style.cssText = `
            width: 90vw;
            max-width: 500px;
            max-height: 70vh;
            background: var(--bg-color);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        // 创建头部
        const header = document.createElement('div');
        header.className = 'color-picker-header';
        header.style.cssText = `
            padding: var(--size-lg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            background: var(--bg-color);
            z-index: 10;
        `;

        const title = document.createElement('h3');
        title.textContent = '颜色选择器';
        title.style.cssText = `
            margin: 0;
            color: var(--text-primary);
        `;

        const closeButton = document.createElement('button');
        closeButton.className = 'color-picker-close';
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-light);
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-sm);
            transition: all var(--transition-normal);
        `;

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.backgroundColor = 'var(--gray-100)';
            closeButton.style.color = 'var(--text-primary)';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.color = 'var(--text-light)';
        });

        closeButton.addEventListener('click', () => {
            if (overlay) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    hideOverlay('color-picker-overlay');
                    reject('Color picker closed');
                }, 300);
            } else {
                const inlinePicker = closeButton.closest('.color-picker-inline');
                if (inlinePicker) {
                    inlinePicker.style.display = 'none';
                    reject('Color picker closed');
                }
            }
        });

        header.appendChild(title);
        header.appendChild(closeButton);
        container.appendChild(header);

        // 创建内容区域
        const content = document.createElement('div');
        content.className = 'color-picker-content';
        content.style.cssText = `
            padding: var(--size-lg);
            overflow-y: auto;
            flex: 1;
        `;

        // 创建颜色预览
        const colorPreview = document.createElement('div');
        colorPreview.className = 'color-preview-section';
        colorPreview.style.cssText = `
            margin-bottom: var(--size-lg);
        `;

        const previewTitle = document.createElement('h4');
        previewTitle.textContent = '颜色预览';
        previewTitle.style.cssText = `
            margin: 0 0 var(--size-sm) 0;
            color: var(--text-primary);
            font-size: 14px;
        `;

        const previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container';
        previewContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: var(--size-sm);
        `;

        const colorDisplay = document.createElement('div');
        colorDisplay.className = 'color-display';
        colorDisplay.style.cssText = `
            width: 60px;
            height: 60px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            background-color: #165DFF;
        `;

        const colorInfo = document.createElement('div');
        colorInfo.className = 'color-info';
        colorInfo.style.cssText = `
            flex: 1;
        `;

        const colorValue = document.createElement('div');
        colorValue.className = 'color-value';
        colorValue.style.cssText = `
            font-family: monospace;
            padding: var(--size-xs);
            background: var(--gray-100);
            border-radius: var(--radius-sm);
            margin-bottom: var(--size-xs);
            font-size: 12px;
        `;
        colorValue.textContent = '#165DFF';

        const formatSelector = document.createElement('div');
        formatSelector.className = 'format-selector';
        formatSelector.style.cssText = `
            display: flex;
            gap: var(--size-xs);
        `;

        const formatOptions = ['hex', 'rgb', 'rgba'];
        formatOptions.forEach(fmt => {
            const formatOption = document.createElement('button');
            formatOption.className = `format-option ${fmt === format ? 'active' : ''}`;
            formatOption.textContent = fmt.toUpperCase();
            formatOption.style.cssText = `
                padding: 2px 8px;
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: ${fmt === format ? 'var(--primary-color)' : 'var(--bg-color)'};
                color: ${fmt === format ? 'white' : 'var(--text-primary)'};
                cursor: pointer;
                font-size: 10px;
            `;

            formatOption.addEventListener('click', () => {
                // 更新激活状态
                document.querySelectorAll('.format-option').forEach(opt => {
                    opt.style.background = 'var(--bg-color)';
                    opt.style.color = 'var(--text-primary)';
                });
                formatOption.style.background = 'var(--primary-color)';
                formatOption.style.color = 'white';

                // 更新格式并重新显示颜色值
                const currentColor = colorDisplay.style.backgroundColor;
                const newFormat = fmt;
                const formattedColor = this.formatColor(currentColor, newFormat);
                colorValue.textContent = formattedColor;
            });

            formatSelector.appendChild(formatOption);
        });

        colorInfo.appendChild(colorValue);
        colorInfo.appendChild(formatSelector);
        previewContainer.appendChild(colorDisplay);
        previewContainer.appendChild(colorInfo);
        colorPreview.appendChild(previewTitle);
        colorPreview.appendChild(previewContainer);

        // 创建预设颜色
        const presetColorsSection = document.createElement('div');
        presetColorsSection.className = 'preset-colors-section';
        presetColorsSection.style.cssText = `
            margin-bottom: var(--size-lg);
        `;

        const presetTitle = document.createElement('h4');
        presetTitle.textContent = '预设颜色';
        presetTitle.style.cssText = `
            margin: 0 0 var(--size-sm) 0;
            color: var(--text-primary);
            font-size: 14px;
        `;

        const presetGrid = document.createElement('div');
        presetGrid.className = 'preset-grid';
        presetGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
            gap: var(--size-xs);
        `;

        presetColors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.cssText = `
                width: 100%;
                aspect-ratio: 1;
                border-radius: var(--radius-sm);
                background-color: ${color};
                border: 1px solid transparent;
                cursor: pointer;
                transition: all var(--transition-normal);
            `;

            colorBox.addEventListener('mouseenter', () => {
                colorBox.style.transform = 'scale(1.1)';
                colorBox.style.boxShadow = 'var(--shadow-md)';
            });

            colorBox.addEventListener('mouseleave', () => {
                colorBox.style.transform = 'scale(1)';
                colorBox.style.boxShadow = 'none';
            });

            colorBox.addEventListener('click', () => {
                colorDisplay.style.backgroundColor = color;
                const formattedColor = this.formatColor(color, format);
                colorValue.textContent = formattedColor;
            });

            presetGrid.appendChild(colorBox);
        });

        presetColorsSection.appendChild(presetTitle);
        presetColorsSection.appendChild(presetGrid);

        // 创建标准色盘
        const colorWheelSection = document.createElement('div');
        colorWheelSection.className = 'color-wheel-section';
        colorWheelSection.style.cssText = `
            margin-bottom: var(--size-xl);
        `;

        const wheelTitle = document.createElement('h4');
        wheelTitle.textContent = '标准色盘';
        wheelTitle.style.cssText = `
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;

        const colorWheel = document.createElement('div');
        colorWheel.className = 'color-wheel';
        colorWheel.style.cssText = `
            width: 100%;
            height: 200px;
            border-radius: var(--radius-md);
            background: linear-gradient(to right, red, yellow, lime, aqua, blue, magenta, red);
            position: relative;
            cursor: crosshair;
            margin-bottom: var(--size-md);
        `;

        // 添加亮度滑块
        const brightnessSlider = document.createElement('input');
        brightnessSlider.type = 'range';
        brightnessSlider.min = '0';
        brightnessSlider.max = '100';
        brightnessSlider.value = '100';
        brightnessSlider.className = 'brightness-slider';
        brightnessSlider.style.cssText = `
            width: 100%;
            height: 6px;
            border-radius: var(--radius-full);
            background: linear-gradient(to right, black, white);
            outline: none;
            -webkit-appearance: none;
        `;

        brightnessSlider.addEventListener('input', () => {
            const brightness = brightnessSlider.value;
            colorWheel.style.filter = `brightness(${brightness}%)`;
        });

        colorWheel.addEventListener('click', (e) => {
            const rect = colorWheel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 创建临时 canvas 来获取点击位置的颜色
            const canvas = document.createElement('canvas');
            canvas.width = rect.width;
            canvas.height = rect.height;
            const ctx = canvas.getContext('2d');
            
            // 绘制渐变
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, 'red');
            gradient.addColorStop(1/6, 'yellow');
            gradient.addColorStop(2/6, 'lime');
            gradient.addColorStop(3/6, 'aqua');
            gradient.addColorStop(4/6, 'blue');
            gradient.addColorStop(5/6, 'magenta');
            gradient.addColorStop(1, 'red');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 获取点击位置的颜色
            const imageData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b] = imageData.data;
            const color = `rgb(${r}, ${g}, ${b})`;
            
            colorDisplay.style.backgroundColor = color;
            const formattedColor = this.formatColor(color, format);
            colorValue.textContent = formattedColor;
        });

        colorWheelSection.appendChild(wheelTitle);
        colorWheelSection.appendChild(colorWheel);
        colorWheelSection.appendChild(brightnessSlider);

        // 创建颜色输入
        const colorInputSection = document.createElement('div');
        colorInputSection.className = 'color-input-section';
        colorInputSection.style.cssText = `
            margin-bottom: var(--size-xl);
        `;

        const inputTitle = document.createElement('h4');
        inputTitle.textContent = '手动输入';
        inputTitle.style.cssText = `
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;

        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        inputContainer.style.cssText = `
            display: flex;
            gap: var(--size-sm);
        `;

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'color-input';
        colorInput.style.cssText = `
            width: 50px;
            height: 32px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            cursor: pointer;
        `;

        colorInput.addEventListener('change', () => {
            const color = colorInput.value;
            colorDisplay.style.backgroundColor = color;
            const formattedColor = this.formatColor(color, format);
            colorValue.textContent = formattedColor;
        });

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'text-input';
        textInput.style.cssText = `
            flex: 1;
            padding: var(--size-xs) var(--size-sm);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            font-family: monospace;
            font-size: 12px;
        `;
        textInput.value = '#165DFF';

        textInput.addEventListener('input', () => {
            const color = textInput.value;
            try {
                colorDisplay.style.backgroundColor = color;
            } catch (e) {
                // 忽略无效颜色
            }
        });

        inputContainer.appendChild(colorInput);
        inputContainer.appendChild(textInput);
        colorInputSection.appendChild(inputTitle);
        colorInputSection.appendChild(inputContainer);

        // 创建按钮区域
        const buttonSection = document.createElement('div');
        buttonSection.className = 'button-section';
        buttonSection.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: var(--size-sm);
            padding-top: var(--size-sm);
            border-top: 1px solid var(--border-color);
        `;

        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-default';
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: var(--size-xs) var(--size-sm);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            background: var(--bg-color);
            color: var(--text-primary);
            cursor: pointer;
            transition: all var(--transition-normal);
            font-size: 12px;
        `;

        cancelButton.addEventListener('click', () => {
            if (overlay) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    hideOverlay('color-picker-overlay');
                    reject('Color picker cancelled');
                }, 300);
            } else {
                const inlinePicker = cancelButton.closest('.color-picker-inline');
                if (inlinePicker) {
                    inlinePicker.style.display = 'none';
                    reject('Color picker cancelled');
                }
            }
        });

        const confirmButton = document.createElement('button');
        confirmButton.className = 'btn btn-primary';
        confirmButton.textContent = '确认';
        confirmButton.style.cssText = `
            padding: var(--size-xs) var(--size-sm);
            border: none;
            border-radius: var(--radius-sm);
            background: var(--primary-color);
            color: white;
            cursor: pointer;
            transition: all var(--transition-normal);
            font-size: 12px;
        `;

        confirmButton.addEventListener('click', () => {
            const color = colorDisplay.style.backgroundColor;
            const formattedColor = this.formatColor(color, format);
            
            if (overlay) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    hideOverlay('color-picker-overlay');
                    resolve(formattedColor);
                }, 300);
            } else {
                const inlinePicker = confirmButton.closest('.color-picker-inline');
                if (inlinePicker) {
                    inlinePicker.style.display = 'none';
                    resolve(formattedColor);
                }
            }
        });

        buttonSection.appendChild(cancelButton);
        buttonSection.appendChild(confirmButton);

        content.appendChild(colorPreview);
        content.appendChild(colorWheelSection);
        content.appendChild(presetColorsSection);
        content.appendChild(colorInputSection);
        content.appendChild(buttonSection);
        container.appendChild(content);

        return container;
    }

    // 格式化颜色
    formatColor(color, format) {
        try {
            if (format === 'hex') {
                // 如果是rgb或rgba格式，转换为hex
                if (color.startsWith('rgb')) {
                    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\s*(,\s*([\d.]+))?\)/);
                    if (rgbMatch) {
                        const r = parseInt(rgbMatch[1]);
                        const g = parseInt(rgbMatch[2]);
                        const b = parseInt(rgbMatch[3]);
                        const a = rgbMatch[5] ? parseFloat(rgbMatch[5]) : 1;
                        
                        if (a === 1) {
                            return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                        } else {
                            return `rgba(${r}, ${g}, ${b}, ${a})`;
                        }
                    }
                }
                return color.toUpperCase();
            } else if (format === 'rgb') {
                // 如果是hex格式，转换为rgb
                if (color.startsWith('#')) {
                    const hex = color.replace('#', '');
                    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
                    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
                    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
                    return `rgb(${r}, ${g}, ${b})`;
                } else if (color.startsWith('rgba')) {
                    return color.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)$/, ')');
                }
                return color;
            } else if (format === 'rgba') {
                // 如果是hex格式，转换为rgba
                if (color.startsWith('#')) {
                    const hex = color.replace('#', '');
                    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
                    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
                    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
                    return `rgba(${r}, ${g}, ${b}, 1)`;
                } else if (color.startsWith('rgb')) {
                    return color.replace('rgb', 'rgba').replace(')', ', 1)');
                }
                return color;
            }
            return color;
        } catch (error) {
            return color;
        }
    }
}

// 基础交互框架
class UI {
    constructor() {
        this.themeManager = new ThemeManager();
        this.init();
    }

    init() {
        // 初始化所有交互组件
        this.initModals();
        this.initToasts();
        this.initImageZoom();
        this.initFormValidation();
        this.initCollapsePanels();
    }

    // 折叠面板相关
    initCollapsePanels() {
        const collapseHeaders = document.querySelectorAll('.collapse-header');
        collapseHeaders.forEach(header => {
            header.addEventListener('click', () => {
                debug('折叠面板点击', header, { panelId: header.parentElement.id });
                const panel = header.parentElement;
                panel.classList.toggle('active');
                const content = panel.querySelector('.collapse-content');
                const icon = header.querySelector('span');
                if (panel.classList.contains('active')) {
                    icon.textContent = '▲';
                } else {
                    icon.textContent = '▼';
                }
            });
        });
    }

    // 弹窗相关
    initModals() {
        // 弹窗基础逻辑
        this.modal = {
            show: (options) => {
                // 实现弹窗显示逻辑
            },
            hide: () => {
                // 实现弹窗隐藏逻辑
            }
        };
    }

    // Toast相关
    initToasts() {
        // Toast基础逻辑
        this.toast = {
            success: (message, options = {}) => {
                this.showToast('success', message, options);
            },
            error: (message, options = {}) => {
                this.showToast('error', message, options);
            },
            warning: (message, options = {}) => {
                this.showToast('warning', message, options);
            },
            info: (message, options = {}) => {
                this.showToast('info', message, options);
            },
            showToast: (type, message, options) => {
                // 实现Toast显示逻辑
            }
        };
    }

    // 图片放大相关
    initImageZoom() {
        // 图片放大基础逻辑
        this.imageZoom = {
            init: () => {
                // 初始化图片点击放大功能
            },
            show: (imageSrc) => {
                // 实现图片放大显示逻辑
            },
            hide: () => {
                // 实现图片放大隐藏逻辑
            }
        };
    }

    // 表单验证相关
    initFormValidation() {
        // 表单验证基础逻辑
        this.formValidation = {
            validate: (form) => {
                // 实现表单验证逻辑
            },
            addRule: (field, rule, message) => {
                // 添加验证规则
            }
        };
    }

    // 主题管理相关
    getThemeManager() {
        return this.themeManager;
    }

    // 颜色选择器相关
    getColorPicker() {
        if (!this.colorPicker) {
            this.colorPicker = new ColorPicker();
        }
        return this.colorPicker;
    }
}

// 全局主题选择器函数
function openThemeSelector(options) {
    debug('启动主题选择器', null, options);
    if (window.ui) {
        debug('UI实例存在，获取ThemeManager', null, { ui: window.ui });
        const themeManager = window.ui.getThemeManager();
        // 处理容器选择器
        if (options.container && typeof options.container === 'string') {
            debug('处理容器选择器', options.container, { selector: options.container });
            options.container = document.querySelector(options.container);
            debug('容器元素', options.container, { container: options.container });
        }
        debug('调用ThemeManager.openThemeSelector', themeManager);
        themeManager.openThemeSelector(options);
    } else {
        debug('UI实例不存在，延迟重试', null, { retry: true });
        // 如果UI实例还未创建，延迟重试
        setTimeout(() => openThemeSelector(options), 100);
    }
}

// 颜色选择器函数
function openColorPicker(options) {
    debug('启动颜色选择器', null, options);
    if (window.ui) {
        debug('UI实例存在，调用颜色选择器', null, { ui: window.ui });
        const colorPicker = window.ui.getColorPicker();
        // 处理容器选择器
        if (options.container && typeof options.container === 'string') {
            debug('处理容器选择器', options.container, { selector: options.container });
            options.container = document.querySelector(options.container);
            debug('容器元素', options.container, { container: options.container });
        }
        debug('调用ColorPicker.open', colorPicker);
        return colorPicker.open(options);
    } else {
        debug('UI实例不存在，延迟重试', null, { retry: true });
        // 如果UI实例还未创建，延迟重试
        return new Promise((resolve) => {
            setTimeout(() => {
                openColorPicker(options).then(resolve);
            }, 100);
        });
    }
}

// 在DOM加载完成后初始化UI
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM加载完成，初始化UI');
    window.ui = new UI();
});