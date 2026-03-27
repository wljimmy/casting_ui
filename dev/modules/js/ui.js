/* 
 * Casting UI Framework
 * Version: 0.2.0
 * Module: ui.js
 * Description: UI框架模块，提供UI组件管理
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
        this.initMenus();
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

    // 菜单相关
    initMenus() {
        // 初始化菜单交互
        this.menu = {
            init: () => {
                // 初始化所有菜单
                this.initMenuEvents();
            },
            toggle: (menuId) => {
                // 切换菜单显示/隐藏
                const menu = document.getElementById(menuId);
                if (menu) {
                    menu.classList.toggle('menu-visible');
                }
            },
            setActive: (menuItem) => {
                // 设置菜单项为激活状态
                const menu = menuItem.closest('menu');
                menu.querySelectorAll('li').forEach(item => {
                    item.classList.remove('active');
                });
                menuItem.classList.add('active');
            },
            addItem: (menuId, parentItem, itemData) => {
                // 动态添加菜单项
                const menu = document.getElementById(menuId);
                if (!menu) return null;
                
                let parentElement = menu;
                if (parentItem) {
                    parentElement = document.querySelector(`#${menuId} li[data-id="${parentItem}"]`);
                    if (!parentElement) return null;
                    
                    // 如果父元素没有子菜单，创建一个
                    let submenu = parentElement.querySelector('ul');
                    if (!submenu) {
                        submenu = document.createElement('ul');
                        parentElement.appendChild(submenu);
                    }
                    parentElement = submenu;
                } else {
                    // 添加到根菜单
                    let rootUl = menu.querySelector('ul');
                    if (!rootUl) {
                        rootUl = document.createElement('ul');
                        menu.appendChild(rootUl);
                    }
                    parentElement = rootUl;
                }
                
                // 创建菜单项
                const li = document.createElement('li');
                li.setAttribute('data-id', itemData.id || `menu-item-${Date.now()}`);
                
                const a = document.createElement('a');
                a.href = itemData.href || '#';
                a.textContent = itemData.text;
                
                if (itemData.icon) {
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'menu-icon';
                    iconSpan.textContent = itemData.icon;
                    a.insertBefore(iconSpan, a.firstChild);
                }
                
                if (itemData.badge) {
                    const badgeSpan = document.createElement('span');
                    badgeSpan.className = `menu-badge badge badge-${itemData.badge.type || 'primary'}`;
                    badgeSpan.textContent = itemData.badge.text;
                    a.appendChild(badgeSpan);
                }
                
                if (itemData.data) {
                    for (const [key, value] of Object.entries(itemData.data)) {
                        a.setAttribute(`data-${key}`, value);
                    }
                }
                
                li.appendChild(a);
                parentElement.appendChild(li);
                
                // 重新初始化菜单事件
                this.initMenuEvents();
                
                return li;
            }
        };
        
        // 初始化菜单事件
        this.initMenuEvents();
    }

    // 初始化菜单事件
    initMenuEvents() {
        // 处理菜单项点击事件
        const menuItems = document.querySelectorAll('menu li');
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    // 阻止事件冒泡
                    e.stopPropagation();
                    
                    // 设置当前菜单项为激活状态
                    this.menu.setActive(item);
                    
                    // 处理子菜单
                    const submenu = item.querySelector('ul');
                    if (submenu) {
                        // 切换子菜单显示
                        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                        e.preventDefault();
                    }
                    
                    // 处理data属性
                    const dataHref = link.getAttribute('data-href');
                    const dataAction = link.getAttribute('data-action');
                    
                    if (dataHref) {
                        e.preventDefault();
                        // 处理链接跳转
                        window.location.href = dataHref;
                    }
                    
                    if (dataAction) {
                        e.preventDefault();
                        // 处理自定义动作
                        try {
                            const action = eval(dataAction);
                            if (typeof action === 'function') {
                                action();
                            }
                        } catch (error) {
                            console.error('Menu action error:', error);
                        }
                    }
                });
            }
        });
        
        // 点击其他地方关闭所有子菜单
        document.addEventListener('click', () => {
            document.querySelectorAll('menu ul ul').forEach(submenu => {
                submenu.style.display = 'none';
            });
        });
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