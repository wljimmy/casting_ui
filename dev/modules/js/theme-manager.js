/* 
 * Casting UI Framework
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

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