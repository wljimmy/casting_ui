/* 
 * Casting UI Framework
 * Version: 0.5.1
 * Module: menu.js
 * Description: 菜单模块，支持多种菜单类型、多级嵌套、自动初始化、实例隔离与垃圾回收
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

import { debug } from './core.js';
import { domObserver } from './dom-observer.js';

// 标准菜单类名列表
const STANDARD_MENU_CLASSES = ['menu-sidebar', 'menu-popup', 'menu-inline'];

// 菜单实例管理器
class MenuManager {
    constructor() {
        this.instances = new Map();
        this.init();
    }

    init() {
        debug('菜单管理器初始化');
        this.scanAndInitMenus();
        this.registerObserver();
    }

    // 检查是否为标准菜单
    isStandardMenu(element) {
        return STANDARD_MENU_CLASSES.some(cls => element.classList.contains(cls));
    }

    // 检查菜单是否已构建
    isMenuBuilt(element) {
        return element.hasAttribute('data-menu-built');
    }

    // 标记菜单为已构建
    markMenuBuilt(element) {
        element.setAttribute('data-menu-built', 'true');
    }

    // 扫描并初始化页面上所有菜单
    scanAndInitMenus() {
        const menus = document.querySelectorAll('menu');
        debug('扫描到菜单数量', null, { count: menus.length });
        
        menus.forEach(menu => {
            if (this.isStandardMenu(menu) && !this.isMenuBuilt(menu) && !this.instances.has(menu.id)) {
                this.initMenu(menu);
            }
        });
    }

    // 初始化单个菜单
    initMenu(menuElement) {
        // 确保菜单有唯一ID
        const menuId = menuElement.id || `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (!menuElement.id) {
            menuElement.id = menuId;
        }

        // 创建菜单实例
        const menuInstance = new MenuInstance(menuElement, menuId);
        
        // 存储实例
        this.instances.set(menuId, menuInstance);
        this.markMenuBuilt(menuElement);
        debug('菜单实例创建', null, { menuId });

        return menuInstance;
    }

    // 销毁菜单实例
    destroyMenu(menuId) {
        const instance = this.instances.get(menuId);
        if (instance) {
            instance.destroy();
            this.instances.delete(menuId);
            debug('菜单实例销毁', null, { menuId });
        }
    }

    // 注册到统一DOM观察器
    registerObserver() {
        // 注册菜单增加事件
        domObserver.onAdd('menu-add', 'menu', (element) => {
            if (this.isStandardMenu(element) && !this.isMenuBuilt(element) && !this.instances.has(element.id)) {
                this.initMenu(element);
            }
        });

        // 注册菜单移除事件
        domObserver.onRemove('menu-remove', 'menu', (element) => {
            if (element.id) {
                this.destroyMenu(element.id);
            }
        });

        debug('菜单已注册到统一DOM观察器');
    }

    // 获取菜单实例
    getInstance(menuId) {
        return this.instances.get(menuId);
    }

    // 获取所有实例
    getAllInstances() {
        return Array.from(this.instances.values());
    }

    // JS API：从JSON配置创建菜单
    createMenu(config) {
        const { id, className, items, container } = config;
        
        // 创建menu元素
        const menuElement = document.createElement('menu');
        if (id) menuElement.id = id;
        if (className) menuElement.className = className;
        
        // 创建ul
        const ul = document.createElement('ul');
        
        // 递归创建菜单项
        const createItem = (itemData) => {
            const li = document.createElement('li');
            if (itemData.icon) li.setAttribute('data-icon', itemData.icon);
            if (itemData.badge) li.setAttribute('data-badge', itemData.badge);
            if (itemData.action) li.setAttribute('data-action', JSON.stringify(itemData.action));
            if (itemData.className) li.className = itemData.className;
            
            // 设置文本内容
            li.textContent = itemData.text || '';
            
            // 递归创建子菜单
            if (itemData.children && itemData.children.length > 0) {
                const subUl = document.createElement('ul');
                itemData.children.forEach(child => {
                    subUl.appendChild(createItem(child));
                });
                li.appendChild(subUl);
            }
            
            return li;
        };
        
        items.forEach(item => {
            ul.appendChild(createItem(item));
        });
        
        menuElement.appendChild(ul);
        
        // 如果指定了容器，插入到容器中
        if (container) {
            const containerElement = document.querySelector(container);
            if (containerElement) {
                containerElement.appendChild(menuElement);
            }
        }
        
        // 初始化菜单
        return this.initMenu(menuElement);
    }
}

// 单个菜单实例类
class MenuInstance {
    constructor(element, id) {
        this.element = element;
        this.id = id;
        this.boundHandleClick = this.handleClick.bind(this);
        this.init();
    }

    init() {
        debug('菜单实例初始化', this.element, { id: this.id });
        
        // 渲染图标和徽标
        this.renderIconsAndBadges();
        
        // 初始化子菜单状态
        this.initSubmenus();
        
        // 绑定事件
        this.bindEvents();
    }

    // 渲染图标和徽标
    renderIconsAndBadges() {
        const items = this.element.querySelectorAll('li');
        
        items.forEach(item => {
            // 确保有 a 标签
            let link = item.querySelector(':scope > a');
            if (!link) {
                // 提取文本内容
                let textContent = '';
                // 遍历子节点，提取文本，跳过 ul 子菜单
                for (let child of Array.from(item.childNodes)) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        textContent += child.textContent;
                    } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'UL') {
                        textContent += child.textContent;
                    }
                }
                
                // 移除原有的文本节点和非 ul 元素
                const childrenToRemove = [];
                for (let child of Array.from(item.childNodes)) {
                    if (child.nodeType === Node.TEXT_NODE || 
                        (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'UL')) {
                        childrenToRemove.push(child);
                    }
                }
                childrenToRemove.forEach(child => item.removeChild(child));
                
                // 创建 a 标签
                link = document.createElement('a');
                link.href = '#';
                
                // 创建菜单内容区域
                const menuContent = document.createElement('div');
                menuContent.className = 'menu-content';
                menuContent.textContent = textContent.trim();
                
                // 创建菜单右侧区域
                const menuRight = document.createElement('div');
                menuRight.className = 'menu-right';
                
                link.appendChild(menuContent);
                link.appendChild(menuRight);
                
                // 插入到 item 的开头（在 ul 子菜单之前）
                const firstChild = item.firstChild;
                if (firstChild) {
                    item.insertBefore(link, firstChild);
                } else {
                    item.appendChild(link);
                }
            }

            // 处理图标
            const iconName = item.getAttribute('data-icon');
            if (iconName) {
                this.renderIcon(link, iconName);
            }

            // 处理徽标
            const badgeName = item.getAttribute('data-badge');
            if (badgeName) {
                this.renderBadge(link, badgeName);
            }
            
            // 检查是否有子菜单，添加展开图标
            const submenu = item.querySelector(':scope > ul');
            if (submenu) {
                this.renderExpandIcon(link);
            }
        });
    }
    
    // 渲染展开图标
    renderExpandIcon(link) {
        let menuRight = link.querySelector('.menu-right');
        if (!menuRight) {
            menuRight = document.createElement('div');
            menuRight.className = 'menu-right';
            link.appendChild(menuRight);
        }
        
        // 检查是否已有展开图标
        if (menuRight.querySelector('.menu-icon')) {
            return;
        }
        
        // 使用绝对路径引用图标
        const basePath = '/icons/';
        
        // 创建图标元素并添加到menu-right中，而不是覆盖
        const iconSpan = document.createElement('span');
        iconSpan.className = 'menu-icon';
        iconSpan.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <use href="${basePath}outline/chevron-right.svg#icon"></use>
            </svg>
        `;
        menuRight.appendChild(iconSpan);
    }

    // 渲染单个图标
    renderIcon(link, iconName) {
        // 检查是否已有图标
        let iconContainer = link.querySelector('.menu-icon-container');
        if (!iconContainer) {
            iconContainer = document.createElement('span');
            iconContainer.className = 'menu-icon-container';
            // 插入到 menu-content 的开头
            const menuContent = link.querySelector('.menu-content');
            if (menuContent) {
                menuContent.insertBefore(iconContainer, menuContent.firstChild);
            } else {
                link.insertBefore(iconContainer, link.firstChild);
            }
        }

        // 创建图标 - 使用SVG文件
        if (iconName.endsWith('.svg')) {
            // 如果是SVG文件路径，使用SVG use引用
            // 使用绝对路径
            let iconPath = iconName;
            
            // 如果路径不是以 / 开头，添加绝对路径前缀
            if (!iconName.startsWith('/')) {
                const basePath = '/icons/';
                iconPath = `${basePath}${iconName}`;
            }
            
            iconContainer.innerHTML = `
                <span class="menu-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <use href="${iconPath}#icon"></use>
                    </svg>
                </span>
            `;
        } else {
            // 否则使用文本图标
            iconContainer.innerHTML = `<span class="menu-icon">${iconName}</span>`;
        }
    }

    // 渲染单个徽标
    renderBadge(link, badgeName) {
        // 检查是否已有徽标
        let badgeContainer = link.querySelector('.menu-badge-container');
        if (!badgeContainer) {
            badgeContainer = document.createElement('span');
            badgeContainer.className = 'menu-badge-container';
            // 插入到 menu-right 中
            let menuRight = link.querySelector('.menu-right');
            if (!menuRight) {
                menuRight = document.createElement('div');
                menuRight.className = 'menu-right';
                link.appendChild(menuRight);
            }
            menuRight.appendChild(badgeContainer);
        }

        // 创建徽标
        badgeContainer.innerHTML = `<span class="menu-badge badge badge-${badgeName.toLowerCase()}">${badgeName.toUpperCase()}</span>`;
    }

    // 初始化子菜单：为有子菜单的li添加menu-closed类
    initSubmenus() {
        const items = this.element.querySelectorAll('li');
        items.forEach(item => {
            const submenu = item.querySelector(':scope > ul');
            if (submenu) {
                item.classList.add('menu-closed');
            }
        });
    }

    // 绑定事件
    bindEvents() {
        this.element.addEventListener('click', this.boundHandleClick);
    }

    // 处理点击事件
    handleClick(e) {
        const item = e.target.closest('li');
        if (!item || !item.closest('menu') === this.element) return;

        e.stopPropagation();

        // 处理子菜单展开/折叠
        const submenu = item.querySelector(':scope > ul');
        if (submenu) {
            e.preventDefault();
            this.toggleSubmenu(item);
        }

        // 处理 data-action
        const actionData = item.getAttribute('data-action');
        if (actionData) {
            this.handleAction(actionData);
        }

        // 设置激活状态
        this.setActive(item);
    }

    // 切换子菜单：只切换menu-closed和menu-opened两个类
    toggleSubmenu(item) {
        const parentUl = item.parentElement;

        // 关闭同级其他展开的子菜单
        const siblingItems = parentUl.querySelectorAll(':scope > li.menu-opened');
        siblingItems.forEach(sibling => {
            if (sibling !== item) {
                sibling.classList.remove('menu-opened');
                sibling.classList.add('menu-closed');
            }
        });

        // 切换当前菜单
        if (item.classList.contains('menu-opened')) {
            item.classList.remove('menu-opened');
            item.classList.add('menu-closed');
        } else {
            item.classList.remove('menu-closed');
            item.classList.add('menu-opened');
        }
    }

    // 处理 data-action
    handleAction(actionData) {
        try {
            let action;
            try {
                action = JSON.parse(actionData);
            } catch (e) {
                // 如果不是JSON，尝试直接作为回调函数名
                if (typeof window[actionData] === 'function') {
                    window[actionData]();
                }
                return;
            }
            
            debug('处理菜单动作', null, action);

            // 加载页面
            if (action.url && action.container) {
                this.loadPage(action.url, action.container, action.callback);
            }
            
            // 调用回调函数
            if (action.callback && typeof window[action.callback] === 'function') {
                window[action.callback](action);
            }
        } catch (error) {
            console.error('解析 data-action 失败:', error);
        }
    }

    // 加载页面
    loadPage(url, container, callback) {
        const containerElement = document.querySelector(container);
        if (!containerElement) {
            console.error('容器未找到:', container);
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    containerElement.innerHTML = xhr.responseText;
                    
                    // 执行回调
                    if (callback && typeof window[callback] === 'function') {
                        window[callback]();
                    }

                    // 触发 Prism 代码高亮
                    if (typeof Prism !== 'undefined') {
                        Prism.highlightAll();
                    }
                } else {
                    console.error('加载页面失败:', xhr.status);
                }
            }
        };
        
        xhr.send();
    }

    // 设置激活状态
    setActive(item) {
        // 清除同级别其他菜单项的激活状态
        const parentUl = item.parentElement;
        parentUl.querySelectorAll(':scope > li').forEach(li => {
            li.classList.remove('menu-active');
        });
        
        // 设置当前菜单项为激活
        item.classList.add('menu-active');
    }

    // 销毁实例
    destroy() {
        debug('销毁菜单实例', this.element, { id: this.id });
        
        // 移除事件监听
        this.element.removeEventListener('click', this.boundHandleClick);
        
        // 移除构建状态标记
        this.element.removeAttribute('data-menu-built');
        
        // 清空引用
        this.element = null;
        this.boundHandleClick = null;
    }
}

// 创建全局菜单管理器实例
const menuManager = new MenuManager();

// 导出
export { menuManager, MenuManager, MenuInstance, STANDARD_MENU_CLASSES };

// 暴露到全局
window.CastingMenuManager = menuManager;
window.CastingMenu = {
    create: (config) => menuManager.createMenu(config),
    getInstance: (id) => menuManager.getInstance(id),
    getAllInstances: () => menuManager.getAllInstances(),
    destroy: (id) => menuManager.destroyMenu(id)
};
