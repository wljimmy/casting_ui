/* 
 * Casting UI Framework
 * Version: 0.5.3
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
        this.sidebarMenu = null; // 存储侧边栏菜单引用
        this.originalPosition = null; // 存储菜单原始位置信息
        this.init();
    }

    init() {
        debug('菜单管理器初始化');
        this.setupResponsiveSidebar();
        this.scanAndInitMenus();
        this.registerObserver();
        this.addBodySidebarClickListener();
    }

    // 添加body下侧边栏菜单点击事件监听
    addBodySidebarClickListener() {
        // 监听body下的menu.menu-sidebar点击事件
        document.addEventListener('click', (e) => {
            const target = e.target.closest('menu.menu-sidebar');
            if (target && target.parentElement === document.body) {
                // 阻止事件冒泡，只激活菜单自己的行为
                e.stopPropagation();
                // 切换.head-menu-opened类到menu元素上
                target.classList.toggle('head-menu-opened');
            }
        });
    }

    // 设置响应式侧边栏
    setupResponsiveSidebar() {
        // 读取页面中的第一个侧边栏菜单
        this.sidebarMenu = document.querySelector('menu.menu-sidebar');
        if (this.sidebarMenu) {
            // 保存原始位置信息
            this.originalPosition = {
                parent: this.sidebarMenu.parentElement,
                nextSibling: this.sidebarMenu.nextSibling
            };
            // 输出原始代码
            const originalCode = this.sidebarMenu.outerHTML;
            debug('找到侧边栏菜单', this.sidebarMenu, { id: this.sidebarMenu.id, originalCode });
            
            // 监听页面大小变化
            this.addResizeListener();
            // 初始检查
            this.checkAndAdjustSidebar();
        } else {
            debug('未找到侧边栏菜单');
        }
    }

    // 添加窗口大小变化监听器
    addResizeListener() {
        const resizeHandler = () => {
            this.checkAndAdjustSidebar();
        };
        window.addEventListener('resize', resizeHandler);
        // 存储监听器以便后续清理
        this.resizeHandler = resizeHandler;
    }

    // 检查并调整侧边栏位置
    checkAndAdjustSidebar() {
        if (!this.sidebarMenu) return;
        
        // 检查是否为手机端
        const isMobile = window.innerWidth < 768 || window.matchMedia('(max-width: 767px)').matches;
        
        if (isMobile) {
            // 移动到body顶部
            this.moveSidebarToTop();
        } else {
            // 还原到原始位置
            this.restoreSidebarPosition();
        }
    }

    // 将侧边栏移动到body顶部
    moveSidebarToTop() {
        if (!this.sidebarMenu || this.sidebarMenu.parentElement === document.body) return;
        
        // 直接移动到body顶部
        document.body.insertBefore(this.sidebarMenu, document.body.firstChild);
    }

    // 还原侧边栏到原始位置
    restoreSidebarPosition() {
        if (!this.sidebarMenu || !this.originalPosition) return;
        
        const { parent, nextSibling } = this.originalPosition;
        if (this.sidebarMenu.parentElement !== parent) {
            // 直接移动到原始位置
            if (nextSibling) {
                parent.insertBefore(this.sidebarMenu, nextSibling);
            } else {
                parent.appendChild(this.sidebarMenu);
            }
        }
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

        // 创建菜单实例（不自动初始化）
        const menuInstance = new MenuInstance(menuElement, menuId);
        
        // 存储实例
        this.instances.set(menuId, menuInstance);
        this.markMenuBuilt(menuElement);
        debug('菜单实例创建', null, { menuId });
        
        // 如果是内联菜单，先转换结构，创建弹出菜单
        if (menuElement.classList.contains('menu-inline')) {
            const innerPopups = menuInstance.convertToNestedPopupStructure();
            
            // 递归初始化这些弹出菜单
            innerPopups.forEach(popup => {
                if (!this.isMenuBuilt(popup) && !this.instances.has(popup.id)) {
                    this.initMenu(popup);
                }
            });
        }
        
        // 最后才初始化这个菜单实例（渲染图标、徽标、绑定事件等）
        menuInstance.init();

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

    // 切换菜单显示/隐藏
    toggle(menuId) {
        const menu = document.getElementById(menuId);
        if (!menu) return;

        // 如果是弹出菜单或内联菜单，先关闭其他已打开的同级菜单
        if (menu.classList.contains('menu-popup')) {
            // 查找所有已显示的弹出菜单
            const visiblePopups = document.querySelectorAll('.menu-popup.menu-visible');
            visiblePopups.forEach(popup => {
                if (popup.id !== menuId) {
                    popup.classList.remove('menu-visible');
                    popup.classList.add('menu-hidden');
                    debug('关闭其他弹出菜单', null, { id: popup.id });
                }
            });
        }

        // 切换当前菜单的显示/隐藏状态
        if (menu.classList.contains('menu-hidden')) {
            menu.classList.remove('menu-hidden');
            menu.classList.add('menu-visible');
            debug('显示菜单', null, { id: menuId });
        } else {
            menu.classList.remove('menu-visible');
            menu.classList.add('menu-hidden');
            debug('隐藏菜单', null, { id: menuId });
        }
    }

    // 递归创建菜单项（通用方法）
        createItem(itemData) {
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
                    subUl.appendChild(this.createItem(child));
                });
                li.appendChild(subUl);
            }
            
            return li;
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
            
            // 添加菜单项
            items.forEach(item => {
                ul.appendChild(this.createItem(item));
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

        // JS API：添加菜单项/子菜单项
        addItems(config) {
            const { target, isSubmenu = false, items } = config;
            
            // 获取目标元素
            let targetElement;
            if (typeof target === 'string') {
                targetElement = document.querySelector(target);
            } else if (target instanceof HTMLElement) {
                targetElement = target;
            }
            
            if (!targetElement) {
                debug('添加菜单项失败：未找到目标元素', null, config);
                return null;
            }

            // 查找菜单实例
            const menuElement = targetElement.closest('menu');
            if (!menuElement) {
                debug('添加菜单项失败：未找到菜单容器', null, config);
                return null;
            }

            const menuId = menuElement.id;
            const menuInstance = this.instances.get(menuId);
            
            if (!menuInstance) {
                debug('添加菜单项失败：未找到菜单实例', null, { menuId });
                return null;
            }

            if (isSubmenu) {
                // 添加为子菜单
                let subUl = targetElement.querySelector(':scope > ul');
                
                if (!subUl) {
                    // 没有子菜单，创建新的
                    subUl = document.createElement('ul');
                    targetElement.appendChild(subUl);
                    // 初始化为关闭状态
                    targetElement.classList.add('menu-closed');
                }
                
                // 添加子菜单项
                items.forEach(item => {
                    subUl.appendChild(this.createItem(item));
                });
                
                // 重新渲染图标和徽标
                menuInstance.renderIconsAndBadges();
                debug('添加子菜单项成功', null, { menuId, target: targetElement });
                
            } else {
                // 添加为同级菜单项
                let parentUl = targetElement.parentElement;
                
                // 如果目标不在 ul 中，查找最近的 ul
                if (!parentUl || parentUl.tagName !== 'UL') {
                    parentUl = targetElement.querySelector(':scope > ul');
                }
                
                if (!parentUl || parentUl.tagName !== 'UL') {
                    debug('添加菜单项失败：未找到合适的父级ul', null, config);
                    return null;
                }
                
                // 在目标后面添加
                const nextSibling = targetElement.nextSibling;
                items.forEach(item => {
                    const newItem = this.createItem(item);
                    if (nextSibling) {
                        parentUl.insertBefore(newItem, nextSibling);
                    } else {
                        parentUl.appendChild(newItem);
                    }
                });
                
                // 重新渲染图标和徽标
                menuInstance.renderIconsAndBadges();
                debug('添加菜单项成功', null, { menuId, target: targetElement });
            }
            
            return menuInstance;
        }
}

// 单个菜单实例类
class MenuInstance {
    constructor(element, id) {
        this.element = element;
        this.id = id;
        this.boundHandleClick = this.handleClick.bind(this);
        this.eventListeners = []; // 存储所有添加的事件监听器，用于清理
        // 不在这里自动调用 init()，而是由 MenuManager 控制
    }

    init() {
        debug('菜单实例初始化', this.element, { id: this.id });
        
        // 渲染图标和徽标
        this.renderIconsAndBadges();
        
        // 初始化子菜单状态
        this.initSubmenus();
        
        // 绑定事件
        this.bindEvents();
        
        // 为内联菜单和弹出菜单添加自动触发功能
        this.initAutoTrigger();
    }

    /**
     * 转换内联菜单结构：把第二级 ul 替换成 menu.menu-popup
     * 内联菜单的一级菜单项点击时会弹出子菜单，而不是展开
     * @returns {Array<HTMLElement>} 创建的弹出菜单元素数组
     */
    convertToNestedPopupStructure() {
        const items = this.element.querySelectorAll(':scope > ul > li');
        const createdPopups = [];
        
        items.forEach((item, index) => {
            const subUl = item.querySelector(':scope > ul');
            
            if (subUl) {
                // 创建弹出菜单容器
                const popupMenu = document.createElement('menu');
                popupMenu.className = 'menu-popup menu-hidden';
                // 给弹出菜单一个唯一ID，确保不重复
                const popupId = `${this.id}-popup-${index}`;
                popupMenu.id = popupId;
                
                // 把 ul 的内容深拷贝到弹出菜单中
                popupMenu.appendChild(subUl.cloneNode(true));
                
                // 用新创建的弹出菜单替换原来的 ul
                item.replaceChild(popupMenu, subUl);
                
                // 将创建的弹出菜单添加到返回数组中
                createdPopups.push(popupMenu);
                
                debug('内联菜单结构转换完成', null, { itemIndex: index, popupId });
            }
        });
        
        return createdPopups;
    }

    /**
     * 渲染菜单的图标、徽标和展开图标
     * 1. 为每个菜单项创建a标签（如果还没有）
     * 2. 根据data-icon属性渲染图标
     * 3. 根据data-badge属性渲染徽标
     * 4. 为有子菜单的项添加展开图标
     */
    renderIconsAndBadges() {
        const items = this.element.querySelectorAll('li');
        
        items.forEach(item => {
            // 确保有 a 标签
            let link = item.querySelector(':scope > a');
            if (!link) {
                // 提取文本内容 - 跳过 ul 和 menu 子菜单
                let textContent = '';
                for (let child of Array.from(item.childNodes)) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        textContent += child.textContent;
                    } else if (child.nodeType === Node.ELEMENT_NODE && 
                               child.tagName !== 'UL' && 
                               child.tagName !== 'MENU') {
                        textContent += child.textContent;
                    }
                }
                
                // 移除原有的文本节点和非 ul/menu 元素
                const childrenToRemove = [];
                for (let child of Array.from(item.childNodes)) {
                    if (child.nodeType === Node.TEXT_NODE || 
                        (child.nodeType === Node.ELEMENT_NODE && 
                         child.tagName !== 'UL' && 
                         child.tagName !== 'MENU')) {
                        childrenToRemove.push(child);
                    }
                }
                childrenToRemove.forEach(child => item.removeChild(child));
                
                // 创建a标签，设置为javascript:void(0)避免页面跳转
                link = document.createElement('a');
                link.href = 'javascript:void(0);'
                
                // 创建菜单文本区域容器
                const menuText = document.createElement('div');
                menuText.className = 'menu-text';
                
                // 设置文字内容到menu-text容器中
                const textNode = document.createTextNode(textContent.trim());
                menuText.appendChild(textNode);
                
                // 将menuText添加到a标签末尾
                link.appendChild(menuText);
                
                // 插入到 item 的开头（在 ul/menu 子菜单之前）
                const firstChild = item.firstChild;
                if (firstChild) {
                    item.insertBefore(link, firstChild);
                } else {
                    item.appendChild(link);
                }
            }

            // 处理图标 - 如果有data-icon属性
            const iconName = item.getAttribute('data-icon');
            if (iconName) {
                this.renderIcon(link, iconName);
            }

            // 处理徽标 - 如果有data-badge属性
            const badgeName = item.getAttribute('data-badge');
            if (badgeName) {
                this.renderBadge(link, badgeName);
            }
            
            // 检查是否有子菜单（ul 或 menu），添加展开图标
            const submenu = item.querySelector(':scope > ul, :scope > menu');
            if (submenu) {
                this.renderExpandIcon(link);
            }
        });
    }
    
    // 渲染展开图标
    renderExpandIcon(link) {
        // 检查是否已有展开图标
        if (link.querySelector('.menu-expand-icon')) {
            return;
        }
        
        // 使用绝对路径引用图标
        const basePath = '/icons/';
        
        // 创建图标元素并添加到a标签末尾（在menu-text外面）
        const iconSpan = document.createElement('span');
        iconSpan.className = 'menu-expand-icon menu-icon';
        iconSpan.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <use href="${basePath}outline/chevron-right.svg#icon"></use>
            </svg>
        `;
        link.appendChild(iconSpan);
    }

    // 渲染单个图标
    renderIcon(link, iconName) {
        // 检查是否已有图标
        let iconContainer = link.querySelector('.menu-icon-container');
        if (!iconContainer) {
            iconContainer = document.createElement('span');
            iconContainer.className = 'menu-icon-container';
            // 直接插入到a标签的开头
            link.insertBefore(iconContainer, link.firstChild);
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
        // 检查是否已有徽章
        if (link.querySelector('.badge')) {
            return;
        }

        // 直接在a标签后添加badge元素
        const badge = document.createElement('span');
        badge.className = `badge ${badgeName.toLowerCase()}`;
        
        // 插入到a标签的末尾
        link.appendChild(badge);
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

    // 安全添加事件监听器并跟踪
    addEventListener(target, event, handler, options) {
        target.addEventListener(event, handler, options);
        this.eventListeners.push({ target, event, handler, options });
    }

    // 绑定事件
    bindEvents() {
        this.addEventListener(this.element, 'click', this.boundHandleClick);
    }

    // 为内联菜单和弹出菜单添加自动触发功能
    initAutoTrigger() {
        // 检查是否是内联菜单中的弹出菜单（被内联菜单控制，不使用data-trigger）
        const isInnerPopupOfInline = this.element.closest('menu.menu-inline') !== null;
        
        // 弹出菜单：通过 data-trigger 属性找到触发按钮
        if (this.element.classList.contains('menu-popup') && !isInnerPopupOfInline) {
            const triggerId = this.element.getAttribute('data-trigger');
            if (triggerId) {
                const triggerButton = document.getElementById(triggerId);
                if (triggerButton) {
                    // 添加按钮点击事件
                    const triggerClickHandler = (e) => {
                        e.stopPropagation();
                        this.toggle();
                    };
                    this.addEventListener(triggerButton, 'click', triggerClickHandler);
                    
                    // 点击页面其他地方关闭菜单
                    const documentClickHandler = (e) => {
                        if (!this.element.classList.contains('menu-hidden') && 
                            !this.element.contains(e.target) && 
                            !triggerButton.contains(e.target)) {
                            this.hide();
                        }
                    };
                    this.addEventListener(document, 'click', documentClickHandler);
                    
                    debug('弹出菜单自动触发已初始化', null, { triggerId, menuId: this.id });
                }
            }
        }
        
        // 内联菜单：自动为一级 li 添加按钮点击监听
        if (this.element.classList.contains('menu-inline')) {
            const items = this.element.querySelectorAll(':scope > ul > li');
            items.forEach(item => {
                const link = item.querySelector(':scope > a');
                const submenu = item.querySelector(':scope > menu');
                
                if (link && submenu) {
                    // 为子菜单添加默认隐藏类
                    if (!submenu.classList.contains('menu-hidden')) {
                        submenu.classList.add('menu-hidden');
                    }
                    
                    // 添加按钮点击事件
                    const linkClickHandler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // 关闭其他已打开的内联菜单
                        const allOpenMenus = this.element.querySelectorAll(':scope > ul > li > menu:not(.menu-hidden)');
                        allOpenMenus.forEach(menu => {
                            if (menu !== submenu) {
                                menu.classList.add('menu-hidden');
                            }
                        });
                        
                        // 切换当前子菜单
                        if (submenu.classList.contains('menu-hidden')) {
                            submenu.classList.remove('menu-hidden');
                        } else {
                            submenu.classList.add('menu-hidden');
                        }
                    };
                    this.addEventListener(link, 'click', linkClickHandler);
                } else if (link && !submenu) {
                    // 没有子菜单的一级菜单项，直接执行data-action
                    const linkClickHandler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // 关闭其他已打开的内联菜单
                        const allOpenMenus = this.element.querySelectorAll(':scope > ul > li > menu:not(.menu-hidden)');
                        allOpenMenus.forEach(menu => {
                            menu.classList.add('menu-hidden');
                        });
                    };
                    this.addEventListener(link, 'click', linkClickHandler);
                }
            });
            
            // 点击页面其他地方关闭所有内联菜单
            const documentClickHandlerInline = (e) => {
                const allOpenMenus = this.element.querySelectorAll(':scope > ul > li > menu:not(.menu-hidden)');
                allOpenMenus.forEach(menu => {
                    if (!menu.contains(e.target)) {
                        menu.classList.add('menu-hidden');
                    }
                });
            };
            this.addEventListener(document, 'click', documentClickHandlerInline);
            
            debug('内联菜单自动触发已初始化', null, { menuId: this.id });
        }
    }

    // 切换菜单显示/隐藏
    toggle() {
        if (this.element.classList.contains('menu-hidden')) {
            this.show();
        } else {
            this.hide();
        }
    }

    // 显示菜单
    show() {
        this.element.classList.remove('menu-hidden');
        this.element.classList.add('menu-visible');
        debug('显示菜单', null, { id: this.id });
    }

    // 隐藏菜单
    hide() {
        this.element.classList.remove('menu-visible');
        this.element.classList.add('menu-hidden');
        debug('隐藏菜单', null, { id: this.id });
    }



    /**
     * 处理菜单点击事件
     * 1. 处理子菜单的展开/折叠
     * 2. 处理data-action回调
     * 3. 为侧边菜单设置激活状态
     * @param {Event} e - 点击事件对象
     */
    handleClick(e) {
        const item = e.target.closest('li');
        // 确保点击的是当前菜单内的菜单项
        if (!item || item.closest('menu') !== this.element) return;

        e.stopPropagation();

        // 处理子菜单展开/折叠（仅针对ul类型的子菜单）
        const submenu = item.querySelector(':scope > ul');
        if (submenu) {
            e.preventDefault();
            
            // 检查当前菜单项是否是已展开状态
            if (item.classList.contains('menu-opened')) {
                // 当前是展开状态，切换为关闭状态
                item.classList.remove('menu-opened');
                item.classList.add('menu-closed');
            } else {
                // 当前是关闭状态，先关闭同ul下的所有已展开子菜单
                const parentUl = item.parentElement;
                const allOpenedItems = parentUl.querySelectorAll('li.menu-opened');
                allOpenedItems.forEach(openedItem => {
                    openedItem.classList.remove('menu-opened');
                    openedItem.classList.add('menu-closed');
                });
                
                // 展开当前菜单
                item.classList.remove('menu-closed');
                item.classList.add('menu-opened');
            }
        } else {
            // 没有子菜单的情况
            // 先关闭同ul下的所有已展开子菜单
            const parentUl = item.parentElement;
            const allOpenedItems = parentUl.querySelectorAll('li.menu-opened');
            allOpenedItems.forEach(openedItem => {
                openedItem.classList.remove('menu-opened');
                openedItem.classList.add('menu-closed');
            });
            
            // 处理 data-action 回调
            const actionData = item.getAttribute('data-action');
            if (actionData) {
                this.handleAction(actionData);
            }

            // 只有侧边菜单才设置激活状态
            if (this.element.classList.contains('menu-sidebar')) {
                this.setActive(item);
            }
        }
    }



    // 处理 data-action
    handleAction(actionData) {
        try {
            // 验证输入不为空
            if (!actionData || typeof actionData !== 'string') {
                console.log('无效的菜单动作数据');
                return;
            }

            let action;
            try {
                action = JSON.parse(actionData);
            } catch (e) {
                // 如果不是JSON，尝试直接作为回调函数名
                // 验证函数名格式 - 只允许字母、数字、下划线
                if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(actionData)) {
                    if (typeof window[actionData] === 'function') {
                        window[actionData]();
                    } else {
                        console.log('不可识别的菜单动作:', actionData);
                    }
                } else {
                    console.log('无效的函数名格式:', actionData);
                }
                return;
            }
            
            debug('处理菜单动作', null, action);

            // 验证action对象
            if (!action || typeof action !== 'object') {
                console.log('无效的action对象');
                return;
            }

            // 检查是否是可识别的行为
            const hasValidAction = (action.url && action.container) || (action.callback && typeof action.callback === 'string');
            
            if (hasValidAction) {
                // 加载页面
                if (action.url && action.container) {
                    this.loadPage(action.url, action.container, action.callback);
                }
                
                // 调用回调函数 - 验证函数名格式
                if (action.callback && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(action.callback)) {
                    if (typeof window[action.callback] === 'function') {
                        window[action.callback](action);
                    }
                }
            } else {
                console.log('不可识别的菜单动作:', action);
            }
        } catch (error) {
            // 解析失败，输出到控制台
            console.error('解析 data-action 失败:', error);
            console.log('原始 actionData:', actionData);
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
        // 清除整个菜单中所有菜单项的激活状态
        this.element.querySelectorAll('li').forEach(li => {
            li.classList.remove('menu-active');
        });
        
        // 设置当前菜单项为激活
        item.classList.add('menu-active');
    }

    // 销毁实例
    destroy() {
        debug('销毁菜单实例', this.element, { id: this.id });
        
        // 清理所有添加的事件监听器
        this.eventListeners.forEach(listener => {
            listener.target.removeEventListener(listener.event, listener.handler, listener.options);
        });
        this.eventListeners = [];
        
        // 移除构建状态标记
        if (this.element) {
            this.element.removeAttribute('data-menu-built');
        }
        
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
    addItems: (config) => menuManager.addItems(config),
    getInstance: (id) => menuManager.getInstance(id),
    getAllInstances: () => menuManager.getAllInstances(),
    destroy: (id) => menuManager.destroyMenu(id),
    // 响应式侧边栏相关方法
    moveSidebarToTop: () => menuManager.moveSidebarToTop(),
    restoreSidebarPosition: () => menuManager.restoreSidebarPosition(),
    checkAndAdjustSidebar: () => menuManager.checkAndAdjustSidebar()
};
