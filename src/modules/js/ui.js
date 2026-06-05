/* 
 * Casting UI Framework
 * Version: 0.2.1
 * Module: ui.js
 * Description: UI框架模块，提供UI组件管理
 * Copyright (c) 2026 Bingo工作室
 * @dependency: core, colorPicker, modal
 * Email: wljimmy@hotmail.com
 */

import { debug } from './core.js';
import { ThemeManager } from './theme-manager.js';
import { ColorPicker } from './color-picker.js';

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
        this.initRightSidebarDrawer();
    }

    // 右侧移动端抽屉
    initRightSidebarDrawer() {
        const rightSidebar = document.querySelector('.CUI-sidebar-right');
        if (!rightSidebar || document.querySelector('.CUI-sidebar-right-trigger')) return;

        // 仅在拥有右侧边栏时创建右侧抽屉边缘拉环标签
        const rightTrigger = document.createElement('div');
        rightTrigger.className = 'CUI-sidebar-right-trigger';
        // 左指小箭头
        rightTrigger.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        `;

        const backdrop = document.createElement('div');
        backdrop.className = 'CUI-sidebar-right-backdrop';

        document.body.appendChild(rightTrigger);
        document.body.appendChild(backdrop);

        // 点击拉环展开/收起抽屉
        rightTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.classList.toggle('CUI-right-drawer-opened');
        });

        // 点击遮罩收起抽屉
        backdrop.addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.classList.remove('CUI-right-drawer-opened');
        });
        
        debug('移动端右侧抽屉拉环标签注入成功');
    }

    // 折叠面板相关
    initCollapsePanels() {
        const collapseHeaders = document.querySelectorAll('.CUI-collapse-header');
        collapseHeaders.forEach(header => {
            header.addEventListener('click', () => {
                debug('折叠面板点击', header, { panelId: header.parentElement.id });
                const panel = header.parentElement;
                panel.classList.toggle('CUI-active');
                const content = panel.querySelector('.CUI-collapse-content');
                const icon = header.querySelector('span');
                if (panel.classList.contains('CUI-active')) {
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
        // 菜单对象集合
        this.menus = new Map();
        
        // 初始化菜单交互
        this.menu = {
            init: () => {
                // 初始化所有菜单
                this.initMenuEvents();
                // 启动实时监听
                this.startMenuObserver();
            },
            toggle: (menuId) => {
                // 切换菜单显示/隐藏
                const menu = document.getElementById(menuId);
                if (menu) {
                    if (menu.classList.contains('CUI-menu-hidden')) {
                        menu.classList.remove('CUI-menu-hidden');
                        menu.classList.add('CUI-menu-visible');
                    } else {
                        menu.classList.remove('CUI-menu-visible');
                        menu.classList.add('CUI-menu-hidden');
                    }
                }
            },
            setActive: (menuItem) => {
                // 设置菜单项为激活状态
                const menu = menuItem.closest('menu');
                menu.querySelectorAll('li').forEach(item => {
                    item.classList.remove('CUI-active');
                });
                menuItem.classList.add('CUI-active');
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
                    iconSpan.className = 'CUI-menu-icon';
                    iconSpan.textContent = itemData.icon;
                    a.insertBefore(iconSpan, a.firstChild);
                }
                
                if (itemData.badge) {
                    const badgeSpan = document.createElement('span');
                    badgeSpan.className = `CUI-menu-badge CUI-badge CUI-badge-${itemData.badge.type || 'primary'}`;
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
        // 启动实时监听
        this.startMenuObserver();
    }

    // 启动菜单观察者
    startMenuObserver() {
        // 创建MutationObserver来监听DOM变化
        this.menuObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 检查添加的节点
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查是否是menu元素
                        if (node.tagName === 'MENU') {
                            this.initMenu(node);
                        }
                        // 检查是否包含menu元素
                        const menus = node.querySelectorAll('menu');
                        menus.forEach(menu => {
                            this.initMenu(menu);
                        });
                    }
                });
                
                // 检查移除的节点
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查是否是menu元素
                        if (node.tagName === 'MENU') {
                            this.destroyMenu(node);
                        }
                        // 检查是否包含menu元素
                        const menus = node.querySelectorAll('menu');
                        menus.forEach(menu => {
                            this.destroyMenu(menu);
                        });
                    }
                });
            });
        });
        
        // 开始观察整个文档
        this.menuObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化单个菜单
    initMenu(menu) {
        // 为菜单生成唯一ID
        const menuId = menu.id || `menu-${Date.now()}`;
        if (!menu.id) {
            menu.id = menuId;
        }
        
        // 初始化子菜单为收起状态
        menu.querySelectorAll('ul ul').forEach(submenu => {
            submenu.classList.add('CUI-collapsed');
        });
        
        // 创建菜单对象
        const menuObj = {
            element: menu,
            id: menuId,
            // 菜单项点击处理
            handleClick: (e) => {
                // 找到被点击的菜单项li
                const item = e.target.closest('menu li');
                if (item && item.closest('menu') === menu) {
                    e.stopPropagation();
                    
                    // 设置当前菜单项为激活状态
                    this.menu.setActive(item);
                    
                    // 关闭当前菜单中所有展开的子菜单
                    const allExpandedItems = menu.querySelectorAll('li.CUI-expanded');
                    allExpandedItems.forEach(expandedItem => {
                        const expandedSubmenu = expandedItem.querySelector(':scope > ul');
                        if (expandedSubmenu) {
                            expandedSubmenu.classList.add('CUI-collapsed');
                            expandedItem.classList.remove('CUI-expanded');
                        }
                    });
                    
                    // 处理子菜单
                    const submenu = item.querySelector(':scope > ul');
                    if (submenu) {
                        // 展开当前子菜单
                        submenu.classList.remove('CUI-collapsed');
                        item.classList.add('CUI-expanded');
                    }
                    
                    // 查找菜单项内的链接（如果有）
                    const link = item.querySelector('a');
                    if (link) {
                        // 处理onclick属性
                        if (link.hasAttribute('onclick')) {
                            e.preventDefault();
                            // 移除onclick属性，执行它，然后重新添加
                            const onclick = link.getAttribute('onclick');
                            link.removeAttribute('onclick');
                            setTimeout(() => {
                                try {
                                    eval(onclick);
                                } catch (error) {
                                    console.error('Menu onclick error:', error);
                                }
                                link.setAttribute('onclick', onclick);
                            }, 0);
                        } else {
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
                        }
                    } else {
                        // 没有链接的菜单项，直接处理data属性
                        const dataHref = item.getAttribute('data-href');
                        const dataAction = item.getAttribute('data-action');
                        
                        if (dataHref) {
                            // 处理链接跳转
                            window.location.href = dataHref;
                        }
                        
                        if (dataAction) {
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
                    }
                }
            }
        };
        
        // 添加点击事件监听器
        menu.addEventListener('click', menuObj.handleClick);
        
        // 存储菜单对象
        this.menus.set(menuId, menuObj);
    }

    // 销毁菜单
    destroyMenu(menu) {
        const menuId = menu.id;
        if (this.menus.has(menuId)) {
            const menuObj = this.menus.get(menuId);
            // 移除事件监听器
            menu.removeEventListener('click', menuObj.handleClick);
            // 从集合中移除
            this.menus.delete(menuId);
        }
    }

    // 初始化菜单事件
    initMenuEvents() {
        // 初始化所有菜单
        const menus = document.querySelectorAll('menu');
        menus.forEach(menu => {
            // 检查菜单是否已经初始化
            const menuId = menu.id || `menu-${Date.now()}`;
            if (!this.menus.has(menuId)) {
                this.initMenu(menu);
            }
        });
    }
}

// 全局主题选择器函数
function openThemeSelector(options) {
    debug('启动主题选择器', null, options);
    if (window.CUI) {
        debug('CUI实例存在，获取ThemeManager', null, { ui: window.CUI });
        const themeManager = window.CUI.getThemeManager();
        // 处理容器选择器
        if (options.container && typeof options.container === 'string') {
            debug('处理容器选择器', options.container, { selector: options.container });
            options.container = document.querySelector(options.container);
            debug('容器元素', options.container, { container: options.container });
        }
        debug('调用ThemeManager.openThemeSelector', themeManager);
        themeManager.openThemeSelector(options);
    } else {
        debug('CUI实例不存在，延迟重试', null, { retry: true });
        // 如果CUI实例还未创建，延迟重试
        setTimeout(() => openThemeSelector(options), 100);
    }
}

// 颜色选择器函数
function openColorPicker(options) {
    debug('启动颜色选择器', null, options);
    if (window.CUI) {
        debug('CUI实例存在，调用颜色选择器', null, { ui: window.CUI });
        const colorPicker = window.CUI.getColorPicker();
        // 处理容器选择器
        if (options.container && typeof options.container === 'string') {
            debug('处理容器选择器', options.container, { selector: options.container });
            options.container = document.querySelector(options.container);
            debug('容器元素', options.container, { container: options.container });
        }
        debug('调用ColorPicker.open', colorPicker);
        return colorPicker.open(options);
    } else {
        debug('CUI实例不存在，延迟重试', null, { retry: true });
        // 如果CUI实例还未创建，延迟重试
        return new Promise((resolve) => {
            setTimeout(() => {
                openColorPicker(options).then(resolve);
            }, 100);
        });
    }
}

function initUI() {
    debug('初始化CUI UI系统');
    const oldCUI = window.CUI || {};
    const uiInstance = new UI();
    
    // 合并之前已经挂载到 window.CUI 的各种模块和变量，防止被 new UI() 粗暴覆盖
    Object.assign(uiInstance, oldCUI);
    window.CUI = uiInstance;
}

// 注册到全局生命周期调度器，声明对 core, colorPicker, modal 的依赖，并在最后的 READY 阶段启动整个UI系统
window.CUI.registerModule('ui', {
    dependencies: ['core', 'colorPicker', 'modal'],
    stages: {
        READY: () => {
            initUI();
        }
    }
});

// 导出
export { UI, openThemeSelector, openColorPicker };

// 暴露到全局
window.UI = UI;
window.openThemeSelector = openThemeSelector;
window.openColorPicker = openColorPicker;