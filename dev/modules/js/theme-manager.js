/* 
 * Casting UI Framework
 * Version: 0.2.0
 * Module: theme-manager.js
 * Description: 主题管理模块，支持主题切换和自定义主题
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

// 主题管理模块
class ThemeManager extends PopupBase {
    constructor() {
        super();
        this.themes = [];
        this.currentTheme = null;
        this.isAddingTheme = false;
        this.isEditingTheme = false;
        this.editingThemeIndex = -1;
    }

    async init() {
        try {
            // 加载主题配置（使用绝对路径）
            const response = await fetch('/themes.json');
            const data = await response.json();
            // 将所有从配置文件加载的主题标记为预设主题
            this.themes = data.themes.map(theme => ({
                ...theme,
                isDefault: true
            }));
            
            // 从本地存储加载自定义主题
            this.loadCustomThemes();
            
            // 恢复上次使用的主题
            const savedThemeName = localStorage.getItem('currentTheme');
            if (savedThemeName) {
                const savedTheme = this.themes.find(theme => theme.name === savedThemeName);
                if (savedTheme) {
                    this.currentTheme = savedTheme;
                } else {
                    this.currentTheme = this.themes[0]; // 默认使用第一个主题
                }
            } else {
                this.currentTheme = this.themes[0]; // 默认使用第一个主题
            }
            
            this.applyTheme(this.currentTheme);
        } catch (error) {
            debug('加载主题配置失败', null, { error: error.message });
        }
    }
    
    // 从本地存储加载自定义主题
    loadCustomThemes() {
        try {
            const customThemes = localStorage.getItem('customThemes');
            if (customThemes) {
                const parsedThemes = JSON.parse(customThemes);
                // 过滤掉与预设主题同名的主题，避免重复加载
                const defaultThemeNames = this.themes.map(theme => theme.name);
                const filteredThemes = parsedThemes.filter(theme => !defaultThemeNames.includes(theme.name));
                this.themes = [...this.themes, ...filteredThemes];
            }
        } catch (error) {
            debug('加载自定义主题失败', null, { error: error.message });
        }
    }
    
    // 保存自定义主题到本地存储
    saveCustomThemes() {
        try {
            const customThemes = this.themes.filter(theme => !theme.isDefault);
            localStorage.setItem('customThemes', JSON.stringify(customThemes));
        } catch (error) {
            debug('保存自定义主题失败', null, { error: error.message });
        }
    }
    
    // 添加主题
    addTheme(theme) {
        // 校验主题名称唯一性
        if (this.themes.some(existingTheme => existingTheme.name === theme.name)) {
            throw new Error('主题名称已存在');
        }
        
        theme.isDefault = false;
        this.themes.push(theme);
        this.saveCustomThemes();
        return theme;
    }
    
    // 编辑主题
    editTheme(index, theme) {
        if (index >= 0 && index < this.themes.length && !this.themes[index].isDefault) {
            // 校验主题名称唯一性，排除当前正在编辑的主题
            if (this.themes.some((existingTheme, i) => i !== index && existingTheme.name === theme.name)) {
                throw new Error('主题名称已存在');
            }
            
            this.themes[index] = { ...theme, isDefault: false };
            this.saveCustomThemes();
            return true;
        }
        return false;
    }
    
    // 删除主题
    deleteTheme(index) {
        if (index >= 0 && index < this.themes.length && !this.themes[index].isDefault) {
            const isCurrentTheme = this.themes[index].name === this.currentTheme?.name;
            this.themes.splice(index, 1);
            this.saveCustomThemes();
            
            // 如果删除的是当前主题，切换到默认主题
            if (isCurrentTheme) {
                const defaultTheme = this.themes.find(theme => theme.isDefault) || this.themes[0];
                this.applyTheme(defaultTheme);
            }
            
            return true;
        }
        return false;
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

        // 检查是否在添加或编辑主题
        if (this.isAddingTheme || this.isEditingTheme) {
            // 创建主题编辑界面
            const themeEditSection = document.createElement('div');
            themeEditSection.className = 'theme-edit-section';
            
            const editTitle = document.createElement('h4');
            editTitle.textContent = this.isAddingTheme ? '添加主题' : '编辑主题';
            editTitle.style.cssText = `
                margin: 0 0 var(--size-md) 0;
                color: var(--text-primary);
            `;
            
            // 获取默认主题作为基础
            const defaultTheme = this.themes.find(theme => theme.isDefault) || this.themes[0];
            const editingTheme = this.isEditingTheme ? this.themes[this.editingThemeIndex] : defaultTheme;
            
            // 主题表单
            const themeForm = document.createElement('form');
            themeForm.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;
            
            // 主题名称
            const nameGroup = document.createElement('div');
            nameGroup.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-sm);
            `;
            
            const nameLabel = document.createElement('label');
            nameLabel.textContent = '主题名称';
            nameLabel.style.cssText = `
                font-weight: 600;
                color: var(--text-primary);
            `;
            
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = this.isEditingTheme ? editingTheme.name : '';
            nameInput.placeholder = '请输入主题名称';
            nameInput.style.cssText = `
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                font-size: 14px;
            `;
            
            nameGroup.appendChild(nameLabel);
            nameGroup.appendChild(nameInput);
            
            // 主题描述
            const descriptionGroup = document.createElement('div');
            descriptionGroup.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-sm);
            `;
            
            const descriptionLabel = document.createElement('label');
            descriptionLabel.textContent = '主题描述';
            descriptionLabel.style.cssText = `
                font-weight: 600;
                color: var(--text-primary);
            `;
            
            const descriptionTextarea = document.createElement('textarea');
            descriptionTextarea.value = this.isEditingTheme ? (editingTheme.description || '') : '';
            descriptionTextarea.placeholder = '请输入主题描述';
            descriptionTextarea.rows = 3;
            descriptionTextarea.style.cssText = `
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                font-size: 14px;
                resize: vertical;
            `;
            
            descriptionGroup.appendChild(descriptionLabel);
            descriptionGroup.appendChild(descriptionTextarea);
            
            // 颜色配置
            const colorsGroup = document.createElement('div');
            colorsGroup.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;
            
            const colorsLabel = document.createElement('h5');
            colorsLabel.textContent = '颜色配置';
            colorsLabel.style.cssText = `
                margin: 0;
                color: var(--text-primary);
            `;
            
            colorsGroup.appendChild(colorsLabel);
            
            // 颜色配置网格
            const colorsGrid = document.createElement('div');
            colorsGrid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--size-md);
            `;
            
            // 颜色配置项
            const colorConfig = [
                { key: 'primary-color', label: '主色调' },
                { key: 'bg-color', label: '背景色' },
                { key: 'text-primary', label: '主要文本色' },
                { key: 'text-secondary', label: '次要文本色' },
                { key: 'text-light', label: '辅助文本色' },
                { key: 'text-disabled', label: '禁用文本色' },
                { key: 'border-color', label: '边框色' },
                { key: 'gray-100', label: '浅灰色' },
                { key: 'gray-200', label: '中灰色' },
                { key: 'gray-300', label: '深灰色' },
                { key: 'success-color', label: '成功色' },
                { key: 'warning-color', label: '警告色' },
                { key: 'error-color', label: '错误色' },
                { key: 'info-color', label: '信息色' }
            ];
            
            colorConfig.forEach(config => {
                const colorItem = document.createElement('div');
                colorItem.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: var(--size-sm);
                `;
                
                const colorLabel = document.createElement('label');
                colorLabel.textContent = config.label;
                colorLabel.style.cssText = `
                    width: 100px;
                    font-size: 14px;
                    color: var(--text-secondary);
                `;
                
                const colorInput = document.createElement('div');
                colorInput.className = 'color-picker-trigger';
                colorInput.style.cssText = `
                    width: 50px;
                    height: 32px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    background-color: ${editingTheme.colors[config.key] || '#000000'};
                    cursor: pointer;
                    transition: all var(--transition-normal);
                `;
                
                const colorValue = document.createElement('input');
                colorValue.type = 'text';
                colorValue.value = editingTheme.colors[config.key] || '#000000';
                colorValue.style.cssText = `
                    flex: 1;
                    padding: var(--size-xs) var(--size-sm);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    font-size: 14px;
                `;
                
                // 使用框架的颜色选择器
                colorInput.addEventListener('click', async () => {
                    try {
                        const result = await openColorPicker({
                            presetColors: [
                                '#165DFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
                                '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'
                            ],
                            format: 'hex',
                            initialColor: colorValue.value
                        });
                        if (result) {
                            colorValue.value = result;
                            colorInput.style.backgroundColor = result;
                            updateThemePreview();
                        }
                    } catch (error) {
                        // 颜色选择器被取消
                    }
                });
                
                colorValue.addEventListener('input', () => {
                    // 简单的颜色格式验证
                    if (/^#[0-9A-Fa-f]{6}$/.test(colorValue.value)) {
                        colorInput.style.backgroundColor = colorValue.value;
                        updateThemePreview();
                    }
                });
                
                colorItem.appendChild(colorLabel);
                colorItem.appendChild(colorInput);
                colorItem.appendChild(colorValue);
                colorsGrid.appendChild(colorItem);
            });
            
            colorsGroup.appendChild(colorsGrid);
            
            // 主题预览
            const previewGroup = document.createElement('div');
            previewGroup.style.cssText = `
                margin-top: var(--size-md);
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;
            
            const previewLabel = document.createElement('h5');
            previewLabel.textContent = '主题预览';
            previewLabel.style.cssText = `
                margin: 0 0 var(--size-md) 0;
                color: var(--text-primary);
            `;
            
            const previewContent = document.createElement('div');
            previewContent.id = 'theme-preview';
            previewContent.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-lg);
            `;
            
            // 复用应用主题的预览组件
            const componentDemo = document.createElement('div');
            componentDemo.className = 'component-demo';
            componentDemo.style.cssText = `
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: var(--size-lg);
            `;
            
            const mainContent = document.createElement('div');
            mainContent.className = 'main-content';
            mainContent.innerHTML = `
                <h1 class="magazine-title">Modern Magazine Layout</h1>
                <h2 class="magazine-subtitle">现代杂志风设计 · 配色方案预览</h2>
                <p class="magazine-paragraph">
                    这是一套为现代杂志设计的配色方案，兼顾视觉高级感与阅读舒适度。主色调采用低饱和的高级色系，中性灰层次分明，功能色克制且醒目，完美适配图文混排的杂志排版需求。
                </p>
                <p class="magazine-paragraph">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            `;
            
            const sidebar = document.createElement('div');
            sidebar.className = 'sidebar';
            sidebar.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;
            
            // 按钮组件
            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';
            btnGroup.style.cssText = `
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;
            
            const btnTitle = document.createElement('div');
            btnTitle.className = 'btn-title';
            btnTitle.textContent = '按钮组件';
            btnTitle.style.cssText = `
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;
            
            const primaryBtn = document.createElement('button');
            primaryBtn.className = 'btn btn-primary';
            primaryBtn.textContent = '主色调按钮';
            primaryBtn.style.cssText = `
                display: block;
                width: 100%;
                padding: var(--size-sm);
                margin-bottom: var(--size-xs);
                border: none;
                border-radius: var(--radius-sm);
                background: var(--primary-color);
                color: white;
                cursor: pointer;
                transition: all var(--transition-normal);
            `;
            
            const defaultBtn = document.createElement('button');
            defaultBtn.className = 'btn btn-default';
            defaultBtn.textContent = '默认按钮';
            defaultBtn.style.cssText = `
                display: block;
                width: 100%;
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: var(--bg-color);
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-normal);
            `;
            
            btnGroup.appendChild(btnTitle);
            btnGroup.appendChild(primaryBtn);
            btnGroup.appendChild(defaultBtn);
            
            // 功能色标签
            const tagGroup = document.createElement('div');
            tagGroup.className = 'tag-group';
            tagGroup.style.cssText = `
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;
            
            const tagTitle = document.createElement('div');
            tagTitle.className = 'btn-title';
            tagTitle.textContent = '功能色标签';
            tagTitle.style.cssText = `
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;
            
            const successTag = document.createElement('span');
            successTag.className = 'tag tag-success';
            successTag.textContent = '成功';
            successTag.style.cssText = `
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--success-color);
                color: white;
            `;
            
            const warningTag = document.createElement('span');
            warningTag.className = 'tag tag-warning';
            warningTag.textContent = '警告';
            warningTag.style.cssText = `
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--warning-color);
                color: white;
            `;
            
            const errorTag = document.createElement('span');
            errorTag.className = 'tag tag-error';
            errorTag.textContent = '错误';
            errorTag.style.cssText = `
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--error-color);
                color: white;
            `;
            
            const infoTag = document.createElement('span');
            infoTag.className = 'tag tag-info';
            infoTag.textContent = '信息';
            infoTag.style.cssText = `
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--info-color);
                color: white;
            `;
            
            tagGroup.appendChild(tagTitle);
            tagGroup.appendChild(successTag);
            tagGroup.appendChild(warningTag);
            tagGroup.appendChild(errorTag);
            tagGroup.appendChild(infoTag);
            
            // 文本色层次
            const textGroup = document.createElement('div');
            textGroup.className = 'text-group';
            textGroup.style.cssText = `
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;
            
            const textTitle = document.createElement('div');
            textTitle.className = 'btn-title';
            textTitle.textContent = '文本色层次';
            textTitle.style.cssText = `
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;
            
            const primaryText = document.createElement('div');
            primaryText.className = 'text-item text-primary';
            primaryText.textContent = '主要文本色';
            primaryText.style.cssText = `
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
            `;
            
            const secondaryText = document.createElement('div');
            secondaryText.className = 'text-item text-secondary';
            secondaryText.textContent = '次要文本色';
            secondaryText.style.cssText = `
                margin-bottom: var(--size-xs);
                color: var(--text-secondary);
            `;
            
            const lightText = document.createElement('div');
            lightText.className = 'text-item text-light';
            lightText.textContent = '辅助文本色';
            lightText.style.cssText = `
                margin-bottom: var(--size-xs);
                color: var(--text-light);
            `;
            
            const disabledText = document.createElement('div');
            disabledText.className = 'text-item text-disabled';
            disabledText.textContent = '禁用文本色';
            disabledText.style.cssText = `
                margin-bottom: var(--size-xs);
                color: var(--text-disabled);
            `;
            
            textGroup.appendChild(textTitle);
            textGroup.appendChild(primaryText);
            textGroup.appendChild(secondaryText);
            textGroup.appendChild(lightText);
            textGroup.appendChild(disabledText);
            
            // 背景色示例
            const bgGroup = document.createElement('div');
            bgGroup.className = 'bg-group';
            bgGroup.style.cssText = `
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;
            
            const bgTitle = document.createElement('div');
            bgTitle.className = 'btn-title';
            bgTitle.textContent = '背景色示例';
            bgTitle.style.cssText = `
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;
            
            const primaryBg = document.createElement('div');
            primaryBg.className = 'bg-item bg-primary';
            primaryBg.textContent = '主色背景';
            primaryBg.style.cssText = `
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: white;
                text-align: center;
                background: var(--primary-color);
            `;
            
            const grayBg = document.createElement('div');
            grayBg.className = 'bg-item bg-gray';
            grayBg.textContent = '灰色背景';
            grayBg.style.cssText = `
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
                text-align: center;
                background: var(--gray-100);
            `;
            
            const whiteBg = document.createElement('div');
            whiteBg.className = 'bg-item bg-white';
            whiteBg.textContent = '白色背景';
            whiteBg.style.cssText = `
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
                text-align: center;
                background: var(--bg-color);
                border: 1px solid var(--border-color);
            `;
            
            bgGroup.appendChild(bgTitle);
            bgGroup.appendChild(primaryBg);
            bgGroup.appendChild(grayBg);
            bgGroup.appendChild(whiteBg);
            
            sidebar.appendChild(btnGroup);
            sidebar.appendChild(tagGroup);
            sidebar.appendChild(textGroup);
            sidebar.appendChild(bgGroup);
            
            componentDemo.appendChild(mainContent);
            componentDemo.appendChild(sidebar);
            previewContent.appendChild(componentDemo);
            
            // 添加响应式样式
            const previewStyle = document.createElement('style');
            previewStyle.textContent = `
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

                @media (max-width: 768px) {
                    .component-demo {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            
            previewGroup.appendChild(previewLabel);
            previewGroup.appendChild(previewContent);
            previewGroup.appendChild(previewStyle);
            
            // 按钮组
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = `
                display: flex;
                gap: var(--size-md);
                margin-top: var(--size-md);
            `;
            
            const saveButton = document.createElement('button');
            saveButton.type = 'button';
            saveButton.className = 'btn btn-primary';
            saveButton.textContent = '保存';
            saveButton.style.cssText = `
                padding: var(--size-sm) var(--size-md);
                border: none;
                border-radius: var(--radius-sm);
                background: var(--primary-color);
                color: white;
                cursor: pointer;
                transition: all var(--transition-normal);
            `;
            
            saveButton.addEventListener('click', () => {
                const themeName = nameInput.value.trim();
                if (!themeName) {
                    alert('请输入主题名称');
                    return;
                }
                
                // 检查主题名称是否已存在
                if (!this.isEditingTheme && this.themes.some(theme => theme.name === themeName)) {
                    alert('主题名称已存在');
                    return;
                }
                
                // 收集颜色配置
                const colors = {};
                colorConfig.forEach(config => {
                    const colorInputs = colorsGrid.querySelectorAll('input[type="text"]');
                    if (colorInputs && colorInputs[colorConfig.indexOf(config)]) {
                        const colorValue = colorInputs[colorConfig.indexOf(config)];
                        colors[config.key] = colorValue.value;
                    }
                });
                
                const theme = {
                    name: themeName,
                    description: descriptionTextarea.value.trim(),
                    colors: colors
                };
                
                if (this.isAddingTheme) {
                    this.addTheme(theme);
                } else if (this.isEditingTheme) {
                    this.editTheme(this.editingThemeIndex, theme);
                }
                
                // 保存后切换回主题列表
                this.isAddingTheme = false;
                this.isEditingTheme = false;
                this.editingThemeIndex = -1;
                this.refreshContainer(container, options);
            });
            
            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.className = 'btn btn-default';
            cancelButton.textContent = '取消';
            cancelButton.style.cssText = `
                padding: var(--size-sm) var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: var(--bg-color);
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-normal);
            `;
            
            cancelButton.addEventListener('click', () => {
                this.isAddingTheme = false;
                this.isEditingTheme = false;
                this.editingThemeIndex = -1;
                this.refreshContainer(container, options);
            });
            
            buttonGroup.appendChild(saveButton);
            buttonGroup.appendChild(cancelButton);
            
            // 组装表单
            themeForm.appendChild(nameGroup);
            themeForm.appendChild(descriptionGroup);
            themeForm.appendChild(colorsGroup);
            themeForm.appendChild(previewGroup);
            themeForm.appendChild(buttonGroup);
            
            themeEditSection.appendChild(editTitle);
            themeEditSection.appendChild(themeForm);
            content.appendChild(themeEditSection);
            
            // 更新主题预览
            function updateThemePreview() {
                const root = document.documentElement;
                colorConfig.forEach(config => {
                    const colorInputs = colorsGrid.querySelectorAll('input[type="text"]');
                    if (colorInputs && colorInputs[colorConfig.indexOf(config)]) {
                        const colorValue = colorInputs[colorConfig.indexOf(config)];
                        root.style.setProperty(`--${config.key}`, colorValue.value);
                    }
                });
            }
            
        } else {
            // 创建主题管理区域
            const themeManagement = this.createThemeManagement(container, options);
            content.appendChild(themeManagement);
            
            // 创建主题列表
            const themeListSection = this.createThemeList(container, options);
            content.appendChild(themeListSection);

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
            
            content.appendChild(exampleSection);
        }
        
        container.appendChild(content);

        return container;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemes() {
        return this.themes;
    }
    
    // 创建主题管理区域
    createThemeManagement(container, options) {
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
        
        addButton.addEventListener('click', () => {
            this.isAddingTheme = true;
            this.isEditingTheme = false;
            this.editingThemeIndex = -1;
            this.refreshContainer(container, options);
        });

        managementButtons.appendChild(addButton);
        themeManagement.appendChild(managementTitle);
        themeManagement.appendChild(managementButtons);
        
        return themeManagement;
    }
    
    // 创建主题列表
    createThemeList(container, options) {
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

                // 添加主题描述
                if (theme.description) {
                    const themeDescription = document.createElement('div');
                    themeDescription.className = 'theme-card-description';
                    themeDescription.textContent = theme.description;
                    themeDescription.style.cssText = `
                        font-size: 12px;
                        color: var(--text-secondary);
                        margin-bottom: var(--size-sm);
                        line-height: 1.4;
                    `;
                    themeCard.appendChild(themeDescription);
                }

                // 标记预设主题
                if (theme.isDefault) {
                    const defaultBadge = document.createElement('div');
                    defaultBadge.textContent = '预设';
                    defaultBadge.style.cssText = `
                        position: absolute;
                        bottom: var(--size-xs);
                        right: var(--size-xs);
                        padding: 2px 8px;
                        background: var(--primary-color);
                        color: white;
                        font-size: 10px;
                        border-radius: var(--radius-sm);
                    `;
                    themeCard.appendChild(defaultBadge);
                }

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

                // 只有非默认主题显示操作按钮
                if (!theme.isDefault) {
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
                    
                    editButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // 阻止冒泡，避免触发主题选择
                        this.isEditingTheme = true;
                        this.isAddingTheme = false;
                        this.editingThemeIndex = this.themes.indexOf(theme);
                        this.refreshContainer(container, options);
                    });

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
                    
                    deleteButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // 阻止冒泡，避免触发主题选择
                        if (confirm('确定要删除这个主题吗？')) {
                            const index = this.themes.indexOf(theme);
                            this.deleteTheme(index);
                            this.refreshContainer(container, options);
                        }
                    });

                    actionButtons.appendChild(editButton);
                    actionButtons.appendChild(deleteButton);
                    themeCard.appendChild(actionButtons);
                }

                themeCard.appendChild(themeName);
                themeCard.appendChild(colorPreview);
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
        
        return themeListSection;
    }
    
    // 刷新容器
    refreshContainer(container, options) {
        // 清空容器内容
        container.innerHTML = '';
        
        // 重新创建头部
        const { resolve, reject, overlay } = options;
        
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
        
        // 检查是否在添加或编辑主题
        if (this.isAddingTheme || this.isEditingTheme) {
            // 创建主题编辑界面
            const themeEditSection = document.createElement('div');
            themeEditSection.className = 'theme-edit-section';
            
            const editTitle = document.createElement('h4');
            editTitle.textContent = this.isAddingTheme ? '添加主题' : '编辑主题';
            editTitle.style.cssText = `
                margin: 0 0 var(--size-md) 0;
                color: var(--text-primary);
            `;
            
            // 获取默认主题作为基础
            const defaultTheme = this.themes.find(theme => theme.isDefault) || this.themes[0];
            const editingTheme = this.isEditingTheme ? this.themes[this.editingThemeIndex] : defaultTheme;
            
            // 主题表单
            const themeForm = document.createElement('form');
            themeForm.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;
            
            // 主题名称
            const nameGroup = document.createElement('div');
            nameGroup.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-sm);
            `;
            
            const nameLabel = document.createElement('label');
            nameLabel.textContent = '主题名称';
            nameLabel.style.cssText = `
                font-weight: 600;
                color: var(--text-primary);
            `;
            
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = this.isEditingTheme ? editingTheme.name : '';
            nameInput.placeholder = '请输入主题名称';
            nameInput.style.cssText = `
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                font-size: 14px;
            `;
            
            nameGroup.appendChild(nameLabel);
            nameGroup.appendChild(nameInput);
            
            // 主题描述
            const descriptionGroup = document.createElement('div');
            descriptionGroup.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-sm);
            `;
            
            const descriptionLabel = document.createElement('label');
            descriptionLabel.textContent = '主题描述';
            descriptionLabel.style.cssText = `
                font-weight: 600;
                color: var(--text-primary);
            `;
            
            const descriptionTextarea = document.createElement('textarea');
            descriptionTextarea.value = this.isEditingTheme ? (editingTheme.description || '') : '';
            descriptionTextarea.placeholder = '请输入主题描述';
            descriptionTextarea.rows = 3;
            descriptionTextarea.style.cssText = `
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                font-size: 14px;
                resize: vertical;
            `;
            
            descriptionGroup.appendChild(descriptionLabel);
            descriptionGroup.appendChild(descriptionTextarea);
            
            // 颜色配置
            const colorsGroup = document.createElement('div');
            colorsGroup.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;
            
            const colorsLabel = document.createElement('h5');
            colorsLabel.textContent = '颜色配置';
            colorsLabel.style.cssText = `
                margin: 0;
                color: var(--text-primary);
            `;
            
            colorsGroup.appendChild(colorsLabel);
            
            // 颜色配置网格
            const colorsGrid = document.createElement('div');
            colorsGrid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--size-md);
            `;
            
            // 颜色配置项
            const colorConfig = [
                { key: 'primary-color', label: '主色调' },
                { key: 'bg-color', label: '背景色' },
                { key: 'text-primary', label: '主要文本色' },
                { key: 'text-secondary', label: '次要文本色' },
                { key: 'text-light', label: '辅助文本色' },
                { key: 'text-disabled', label: '禁用文本色' },
                { key: 'border-color', label: '边框色' },
                { key: 'gray-100', label: '浅灰色' },
                { key: 'gray-200', label: '中灰色' },
                { key: 'gray-300', label: '深灰色' },
                { key: 'success-color', label: '成功色' },
                { key: 'warning-color', label: '警告色' },
                { key: 'error-color', label: '错误色' },
                { key: 'info-color', label: '信息色' }
            ];
            
            colorConfig.forEach(config => {
                const colorItem = document.createElement('div');
                colorItem.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: var(--size-sm);
                `;
                
                const colorLabel = document.createElement('label');
                colorLabel.textContent = config.label;
                colorLabel.style.cssText = `
                    width: 100px;
                    font-size: 14px;
                    color: var(--text-secondary);
                `;
                
                const colorInput = document.createElement('div');
                colorInput.className = 'color-picker-trigger';
                colorInput.style.cssText = `
                    width: 50px;
                    height: 32px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    background-color: ${editingTheme.colors[config.key] || '#000000'};
                    cursor: pointer;
                    transition: all var(--transition-normal);
                `;
                
                const colorValue = document.createElement('input');
                colorValue.type = 'text';
                colorValue.value = editingTheme.colors[config.key] || '#000000';
                colorValue.style.cssText = `
                    flex: 1;
                    padding: var(--size-xs) var(--size-sm);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    font-size: 14px;
                `;
                
                // 使用框架的颜色选择器
                colorInput.addEventListener('click', async () => {
                    try {
                        const result = await openColorPicker({
                            presetColors: [
                                '#165DFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
                                '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'
                            ],
                            format: 'hex',
                            initialColor: colorValue.value
                        });
                        if (result) {
                            colorValue.value = result;
                            colorInput.style.backgroundColor = result;
                            updateThemePreview();
                        }
                    } catch (error) {
                        // 颜色选择器被取消
                    }
                });
                
                colorValue.addEventListener('input', () => {
                    // 简单的颜色格式验证
                    if (/^#[0-9A-Fa-f]{6}$/.test(colorValue.value)) {
                        colorInput.style.backgroundColor = colorValue.value;
                        updateThemePreview();
                    }
                });
                
                colorItem.appendChild(colorLabel);
                colorItem.appendChild(colorInput);
                colorItem.appendChild(colorValue);
                colorsGrid.appendChild(colorItem);
            });
            
            colorsGroup.appendChild(colorsGrid);
            
            // 主题预览
            const previewGroup = document.createElement('div');
            previewGroup.style.cssText = `
                margin-top: var(--size-md);
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;
            
            const previewLabel = document.createElement('h5');
            previewLabel.textContent = '主题预览';
            previewLabel.style.cssText = `
                margin: 0 0 var(--size-md) 0;
                color: var(--text-primary);
            `;
            
            const previewContent = document.createElement('div');
            previewContent.id = 'theme-preview';
            previewContent.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-lg);
            `;
            
            // 复用应用主题的预览组件
            const componentDemo = document.createElement('div');
            componentDemo.className = 'component-demo';
            componentDemo.style.cssText = `
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: var(--size-lg);
            `;
            
            const mainContent = document.createElement('div');
            mainContent.className = 'main-content';
            mainContent.innerHTML = `
                <h1 class="magazine-title">Modern Magazine Layout</h1>
                <h2 class="magazine-subtitle">现代杂志风设计 · 配色方案预览</h2>
                <p class="magazine-paragraph">
                    这是一套为现代杂志设计的配色方案，兼顾视觉高级感与阅读舒适度。主色调采用低饱和的高级色系，中性灰层次分明，功能色克制且醒目，完美适配图文混排的杂志排版需求。
                </p>
                <p class="magazine-paragraph">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            `;
            
            const sidebar = document.createElement('div');
            sidebar.className = 'sidebar';
            sidebar.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: var(--size-md);
            `;
            
            // 按钮组件
            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';
            btnGroup.style.cssText = `
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;
            
            const btnTitle = document.createElement('div');
            btnTitle.className = 'btn-title';
            btnTitle.textContent = '按钮组件';
            btnTitle.style.cssText = `
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;
            
            const primaryBtn = document.createElement('button');
            primaryBtn.className = 'btn btn-primary';
            primaryBtn.textContent = '主色调按钮';
            primaryBtn.style.cssText = `
                display: block;
                width: 100%;
                padding: var(--size-sm);
                margin-bottom: var(--size-xs);
                border: none;
                border-radius: var(--radius-sm);
                background: var(--primary-color);
                color: white;
                cursor: pointer;
                transition: all var(--transition-normal);
            `;
            
            const defaultBtn = document.createElement('button');
            defaultBtn.className = 'btn btn-default';
            defaultBtn.textContent = '默认按钮';
            defaultBtn.style.cssText = `
                display: block;
                width: 100%;
                padding: var(--size-sm);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: var(--bg-color);
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-normal);
            `;
            
            btnGroup.appendChild(btnTitle);
            btnGroup.appendChild(primaryBtn);
            btnGroup.appendChild(defaultBtn);
            
            // 功能色标签
            const tagGroup = document.createElement('div');
            tagGroup.className = 'tag-group';
            tagGroup.style.cssText = `
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;
            
            const tagTitle = document.createElement('div');
            tagTitle.className = 'btn-title';
            tagTitle.textContent = '功能色标签';
            tagTitle.style.cssText = `
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;
            
            const successTag = document.createElement('span');
            successTag.className = 'tag tag-success';
            successTag.textContent = '成功';
            successTag.style.cssText = `
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--success-color);
                color: white;
            `;
            
            const warningTag = document.createElement('span');
            warningTag.className = 'tag tag-warning';
            warningTag.textContent = '警告';
            warningTag.style.cssText = `
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--warning-color);
                color: white;
            `;
            
            const errorTag = document.createElement('span');
            errorTag.className = 'tag tag-error';
            errorTag.textContent = '错误';
            errorTag.style.cssText = `
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--error-color);
                color: white;
            `;
            
            const infoTag = document.createElement('span');
            infoTag.className = 'tag tag-info';
            infoTag.textContent = '信息';
            infoTag.style.cssText = `
                display: inline-block;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                margin-right: var(--size-xs);
                margin-bottom: var(--size-xs);
                background: var(--info-color);
                color: white;
            `;
            
            tagGroup.appendChild(tagTitle);
            tagGroup.appendChild(successTag);
            tagGroup.appendChild(warningTag);
            tagGroup.appendChild(errorTag);
            tagGroup.appendChild(infoTag);
            
            // 文本色层次
            const textGroup = document.createElement('div');
            textGroup.className = 'text-group';
            textGroup.style.cssText = `
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;
            
            const textTitle = document.createElement('div');
            textTitle.className = 'btn-title';
            textTitle.textContent = '文本色层次';
            textTitle.style.cssText = `
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;
            
            const primaryText = document.createElement('div');
            primaryText.className = 'text-item text-primary';
            primaryText.textContent = '主要文本色';
            primaryText.style.cssText = `
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
            `;
            
            const secondaryText = document.createElement('div');
            secondaryText.className = 'text-item text-secondary';
            secondaryText.textContent = '次要文本色';
            secondaryText.style.cssText = `
                margin-bottom: var(--size-xs);
                color: var(--text-secondary);
            `;
            
            const lightText = document.createElement('div');
            lightText.className = 'text-item text-light';
            lightText.textContent = '辅助文本色';
            lightText.style.cssText = `
                margin-bottom: var(--size-xs);
                color: var(--text-light);
            `;
            
            const disabledText = document.createElement('div');
            disabledText.className = 'text-item text-disabled';
            disabledText.textContent = '禁用文本色';
            disabledText.style.cssText = `
                margin-bottom: var(--size-xs);
                color: var(--text-disabled);
            `;
            
            textGroup.appendChild(textTitle);
            textGroup.appendChild(primaryText);
            textGroup.appendChild(secondaryText);
            textGroup.appendChild(lightText);
            textGroup.appendChild(disabledText);
            
            // 背景色示例
            const bgGroup = document.createElement('div');
            bgGroup.className = 'bg-group';
            bgGroup.style.cssText = `
                padding: var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                background: var(--bg-color);
            `;
            
            const bgTitle = document.createElement('div');
            bgTitle.className = 'btn-title';
            bgTitle.textContent = '背景色示例';
            bgTitle.style.cssText = `
                font-weight: 600;
                margin-bottom: var(--size-sm);
                color: var(--text-primary);
            `;
            
            const primaryBg = document.createElement('div');
            primaryBg.className = 'bg-item bg-primary';
            primaryBg.textContent = '主色背景';
            primaryBg.style.cssText = `
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: white;
                text-align: center;
                background: var(--primary-color);
            `;
            
            const grayBg = document.createElement('div');
            grayBg.className = 'bg-item bg-gray';
            grayBg.textContent = '灰色背景';
            grayBg.style.cssText = `
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
                text-align: center;
                background: var(--gray-100);
            `;
            
            const whiteBg = document.createElement('div');
            whiteBg.className = 'bg-item bg-white';
            whiteBg.textContent = '白色背景';
            whiteBg.style.cssText = `
                padding: var(--size-sm);
                border-radius: var(--radius-sm);
                margin-bottom: var(--size-xs);
                color: var(--text-primary);
                text-align: center;
                background: var(--bg-color);
                border: 1px solid var(--border-color);
            `;
            
            bgGroup.appendChild(bgTitle);
            bgGroup.appendChild(primaryBg);
            bgGroup.appendChild(grayBg);
            bgGroup.appendChild(whiteBg);
            
            sidebar.appendChild(btnGroup);
            sidebar.appendChild(tagGroup);
            sidebar.appendChild(textGroup);
            sidebar.appendChild(bgGroup);
            
            componentDemo.appendChild(mainContent);
            componentDemo.appendChild(sidebar);
            previewContent.appendChild(componentDemo);
            
            // 添加响应式样式
            const previewStyle = document.createElement('style');
            previewStyle.textContent = `
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

                @media (max-width: 768px) {
                    .component-demo {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            
            previewGroup.appendChild(previewLabel);
            previewGroup.appendChild(previewContent);
            previewGroup.appendChild(previewStyle);
            
            // 按钮组
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = `
                display: flex;
                gap: var(--size-md);
                margin-top: var(--size-md);
            `;
            
            const saveButton = document.createElement('button');
            saveButton.type = 'button';
            saveButton.className = 'btn btn-primary';
            saveButton.textContent = '保存';
            saveButton.style.cssText = `
                padding: var(--size-sm) var(--size-md);
                border: none;
                border-radius: var(--radius-sm);
                background: var(--primary-color);
                color: white;
                cursor: pointer;
                transition: all var(--transition-normal);
            `;
            
            saveButton.addEventListener('click', () => {
                const themeName = nameInput.value.trim();
                if (!themeName) {
                    alert('请输入主题名称');
                    return;
                }
                
                // 检查主题名称是否已存在
                if (!this.isEditingTheme && this.themes.some(theme => theme.name === themeName)) {
                    alert('主题名称已存在');
                    return;
                }
                
                // 收集颜色配置
                const colors = {};
                colorConfig.forEach(config => {
                    const colorInputs = colorsGrid.querySelectorAll('input[type="text"]');
                    if (colorInputs && colorInputs[colorConfig.indexOf(config)]) {
                        const colorValue = colorInputs[colorConfig.indexOf(config)];
                        colors[config.key] = colorValue.value;
                    }
                });
                
                const theme = {
                    name: themeName,
                    description: descriptionTextarea.value.trim(),
                    colors: colors
                };
                
                if (this.isAddingTheme) {
                    this.addTheme(theme);
                } else if (this.isEditingTheme) {
                    this.editTheme(this.editingThemeIndex, theme);
                }
                
                // 保存后切换回主题列表
                this.isAddingTheme = false;
                this.isEditingTheme = false;
                this.editingThemeIndex = -1;
                this.refreshContainer(container, options);
            });
            
            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.className = 'btn btn-default';
            cancelButton.textContent = '取消';
            cancelButton.style.cssText = `
                padding: var(--size-sm) var(--size-md);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: var(--bg-color);
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-normal);
            `;
            
            cancelButton.addEventListener('click', () => {
                this.isAddingTheme = false;
                this.isEditingTheme = false;
                this.editingThemeIndex = -1;
                this.refreshContainer(container, options);
            });
            
            buttonGroup.appendChild(saveButton);
            buttonGroup.appendChild(cancelButton);
            
            // 组装表单
            themeForm.appendChild(nameGroup);
            themeForm.appendChild(descriptionGroup);
            themeForm.appendChild(colorsGroup);
            themeForm.appendChild(previewGroup);
            themeForm.appendChild(buttonGroup);
            
            themeEditSection.appendChild(editTitle);
            themeEditSection.appendChild(themeForm);
            content.appendChild(themeEditSection);
            
            // 更新主题预览
            function updateThemePreview() {
                const root = document.documentElement;
                colorConfig.forEach(config => {
                    const colorInputs = colorsGrid.querySelectorAll('input[type="text"]');
                    if (colorInputs && colorInputs[colorConfig.indexOf(config)]) {
                        const colorValue = colorInputs[colorConfig.indexOf(config)];
                        root.style.setProperty(`--${config.key}`, colorValue.value);
                    }
                });
            }
            
        } else {
            // 创建主题管理区域
            const themeManagement = this.createThemeManagement(container, options);
            content.appendChild(themeManagement);
            
            // 创建主题列表
            const themeListSection = this.createThemeList(container, options);
            content.appendChild(themeListSection);

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
            
            content.appendChild(exampleSection);
        }
        
        container.appendChild(content);
    }
}