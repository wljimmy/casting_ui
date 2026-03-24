/* 
 * Casting UI Framework
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

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