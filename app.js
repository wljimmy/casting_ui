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

// 全局函数，用于在HTML中调用
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
class ThemeManager {
    constructor() {
        this.themes = [];
        this.currentTheme = null;
        this.init();
    }

    async init() {
        try {
            // 加载主题配置
            const response = await fetch('themes.json');
            const data = await response.json();
            this.themes = data.themes;
            this.currentTheme = this.themes[0]; // 默认使用第一个主题
            this.applyTheme(this.currentTheme);
            this.createThemeSelector();
        } catch (error) {
            console.error('加载主题配置失败:', error);
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

    createThemeSelector() {
        // 创建主题选择器容器
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'theme-selector';
        selectorContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1000;
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            padding: var(--size-md);
            box-shadow: var(--shadow-md);
        `;

        // 创建标题
        const title = document.createElement('h4');
        title.textContent = '主题选择';
        title.style.cssText = `
            margin: 0 0 var(--size-md) 0;
            font-size: 16px;
            color: var(--text-primary);
        `;
        selectorContainer.appendChild(title);

        // 创建主题选择列表
        const themeList = document.createElement('div');
        themeList.className = 'theme-list';
        themeList.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: var(--size-sm);
        `;

        // 添加主题选项
        this.themes.forEach(theme => {
            const themeOption = document.createElement('button');
            themeOption.className = 'theme-option';
            themeOption.textContent = theme.name;
            themeOption.style.cssText = `
                padding: var(--size-sm) var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: ${theme.name === this.currentTheme?.name ? 'var(--primary-color)' : 'var(--bg-color)'};
                color: ${theme.name === this.currentTheme?.name ? 'white' : 'var(--text-primary)'};
                cursor: pointer;
                transition: all var(--transition-normal);
                text-align: left;
            `;

            themeOption.addEventListener('click', () => {
                this.applyTheme(theme);
                // 更新所有主题选项的样式
                document.querySelectorAll('.theme-option').forEach(option => {
                    option.style.background = option.textContent === theme.name ? 'var(--primary-color)' : 'var(--bg-color)';
                    option.style.color = option.textContent === theme.name ? 'white' : 'var(--text-primary)';
                });
            });

            themeList.appendChild(themeOption);
        });

        selectorContainer.appendChild(themeList);
        document.body.appendChild(selectorContainer);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemes() {
        return this.themes;
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
}

// 在DOM加载完成后初始化UI
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM加载完成，初始化UI');
    const ui = new UI();
});