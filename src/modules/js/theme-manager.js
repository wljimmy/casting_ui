/*
 * Casting UI Framework
 * Version: 0.7.0
 * Module: theme-manager.js
 * Description: 主题管理器 - 负责主题的加载、管理、切换和持久化
 * ID策略：所有系统生成的ID使用 CUI-GEN- 前缀 + 随机字符串
 */

import { PopupBase } from './core.js';
import { templateEngine } from './template-engine.js';
import { utils } from './utils.js';
import { themeManagerTemplates } from './templates/theme-manager.tpl.js';
import { commonTemplates } from './templates/common.tpl.js';

class ThemeManager extends PopupBase {
    constructor() {
        super();
        this.themes = [];
        this.currentTheme = null;
        this.isAddingTheme = false;
        this.isEditingTheme = false;
        this.editingThemeIndex = -1;
        this._listeners = [];
        this._isInitialized = false;
        this._initTemplates();
    }

    _initTemplates() {
        templateEngine.register('popupHeader', commonTemplates.popupHeader);
        templateEngine.register('popupFooter', commonTemplates.popupFooter);
        
        templateEngine.register('themeContainer', themeManagerTemplates.container);
        templateEngine.register('themeHeader', themeManagerTemplates.header);
        templateEngine.register('themeManagement', themeManagerTemplates.managementSection);
        templateEngine.register('themeCard', themeManagerTemplates.themeCard);
        templateEngine.register('themeEdit', themeManagerTemplates.editSection);
    }

    async init() {
        if (this._isInitialized) {
            console.warn('[ThemeManager] 已经初始化过了');
            return;
        }

        try {
            const response = await fetch('/themes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            this.themes = data.themes.map(theme => ({
                ...theme,
                isDefault: true
            }));

            this.loadCustomThemes();
            this._restoreCurrentTheme();

            this._isInitialized = true;
            console.debug('[ThemeManager] 初始化成功', { element: this.element });
        } catch (error) {
            console.error('[ThemeManager] 初始化失败:', error);
            this._useDefaultTheme();
        }
    }

    _useDefaultTheme() {
        this.themes = [{
            name: '默认主题',
            description: '系统默认主题',
            isDefault: true,
            colors: {
                'primary-color': '#165DFF',
                'bg-color': '#FFFFFF',
                'text-primary': '#212529'
            }
        }];
        this.currentTheme = this.themes[0];
        this.applyTheme(this.currentTheme);
    }

    loadCustomThemes() {
        try {
            const customThemes = localStorage.getItem('customThemes');
            if (customThemes) {
                const parsedThemes = JSON.parse(customThemes);
                const defaultNames = this.themes.map(t => t.name);
                const filtered = parsedThemes.filter(t => !defaultNames.includes(t.name));
                this.themes = [...this.themes, ...filtered];
            }
        } catch (error) {
            console.error('[ThemeManager] 加载自定义主题失败:', error);
        }
    }

    saveCustomThemes() {
        try {
            const customThemes = this.themes.filter(t => !t.isDefault);
            localStorage.setItem('customThemes', JSON.stringify(customThemes));
        } catch (error) {
            console.error('[ThemeManager] 保存自定义主题失败:', error);
        }
    }

    _restoreCurrentTheme() {
        const savedName = localStorage.getItem('currentTheme');
        if (savedName) {
            const found = this.themes.find(t => t.name === savedName);
            if (found) {
                this.currentTheme = found;
                this.applyTheme(found);
                return;
            }
        }
        
        const defaultTheme = this.themes.find(t => t.isDefault) || this.themes[0];
        this.currentTheme = defaultTheme;
        this.applyTheme(defaultTheme);
    }

    applyTheme(theme) {
        if (!theme || !theme.colors) {
            console.warn('[ThemeManager] 无效的主题数据');
            return;
        }

        this.currentTheme = theme;
        const root = document.documentElement;

        for (const [key, value] of Object.entries(theme.colors)) {
            root.style.setProperty(`--${key}`, value);
        }

        localStorage.setItem('currentTheme', theme.name);
        this._notifyListeners('themeChanged', theme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemes() {
        return [...this.themes];
    }

    addTheme(theme) {
        if (!this._validateThemeName(theme.name)) {
            throw new Error('主题名称已存在');
        }
        
        const newTheme = {
            ...theme,
            isDefault: false
        };
        
        this.themes.push(newTheme);
        this.saveCustomThemes();
        this._notifyListeners('themeAdded', newTheme);
        
        return newTheme;
    }

    deleteTheme(index) {
        if (index < 0 || index >= this.themes.length) {
            console.warn('[ThemeManager] 无效的索引');
            return false;
        }
        
        const theme = this.themes[index];
        if (theme.isDefault) {
            console.warn('[ThemeManager] 不能删除预设主题');
            return false;
        }
        
        const isCurrent = theme.name === this.currentTheme?.name;
        const deleted = this.themes.splice(index, 1)[0];
        
        this.saveCustomThemes();
        
        if (isCurrent) {
            const fallback = this.themes.find(t => t.isDefault) || this.themes[0];
            this.applyTheme(fallback);
        }
        
        this._notifyListeners('themeDeleted', deleted);
        return true;
    }

    _validateThemeName(name, excludeIndex = -1) {
        return !this.themes.some((t, i) => i !== excludeIndex && t.name === name);
    }

    on(event, callback) {
        if (typeof callback !== 'function') {
            console.warn('[ThemeManager] 回调必须是函数');
            return;
        }
        this._listeners.push({ event, callback });
    }

    off(event, callback) {
        this._listeners = this._listeners.filter(
            l => !(l.event === event && l.callback === callback)
        );
    }

    _notifyListeners(event, data) {
        this._listeners.forEach(l => {
            if (l.event === event) {
                try {
                    l.callback(data);
                } catch (e) {
                    console.error('[ThemeManager] 监听器错误:', e);
                }
            }
        });
    }

    getOverlayId() {
        return 'theme-manager-overlay';
    }

    async openThemeSelector() {
        if (!this._isInitialized) {
            await this.init();
        }
        
        return new Promise((resolve, reject) => {
            this.open({ resolve, reject });
        });
    }

    createContainer(options) {
        const closeBtnId = utils.generateId('CUI-GEN', 8, 7);
        const addBtnId = utils.generateId('CUI-GEN', 8, 7);

        const headerHtml = templateEngine.render('themeHeader', { closeBtnId });

        let contentHtml;
        if (this.isAddingTheme || this.isEditingTheme) {
            const editResult = this._renderEditSection();
            contentHtml = editResult.html;
            this._editIds = {
                nameInputId: editResult.nameInputId,
                descInputId: editResult.descInputId,
                cancelBtnId: editResult.cancelBtnId,
                saveBtnId: editResult.saveBtnId
            };
        } else {
            contentHtml = this._renderViewSection(addBtnId);
        }

        const html = templateEngine.render('themeContainer', {
            header: headerHtml,
            content: contentHtml
        });

        const container = templateEngine.toElement(html);

        if (!container) {
            console.error('[ThemeManager] 创建容器失败');
            return null;
        }

        this._bindContainerEvents(container, { ...options, closeBtnId, addBtnId });

        return container;
    }

    _renderViewSection(addBtnId) {
        const managementHtml = templateEngine.render('themeManagement', { addBtnId });
        const { html: themeCardsHtml, bindings } = this._renderThemeCards();
        this._cardBindings = bindings;

        return `
            ${managementHtml}
            <div class="CUI-theme-list">
                ${themeCardsHtml}
            </div>
        `;
    }

    _renderThemeCards() {
        const result = this.themes.map((theme, index) => {
            const isActive = theme.name === this.currentTheme?.name;
            const colors = theme.colors || {};

            const swatches = [
                { key: 'primary-color', label: '主色' },
                { key: 'text-primary', label: '文字' },
                { key: 'text-secondary', label: '次要' },
                { key: 'bg-color', label: '背景' },
                { key: 'border-color', label: '边框' },
                { key: 'success-color', label: '成功' },
                { key: 'warning-color', label: '警告' },
                { key: 'error-color', label: '错误' }
            ].filter(item => colors[item.key])
            .map(item => `<span class="CUI-theme-card-swatch"><span class="CUI-theme-card-swatch-color" style="background: ${colors[item.key]};"></span><span class="CUI-theme-card-swatch-label">${item.label}</span></span>`)
            .join('');

            const cardId = utils.generateId('CUI-GEN', 8, 7);
            const editBtnId = utils.generateId('CUI-GEN', 8, 7);
            const deleteBtnId = utils.generateId('CUI-GEN', 8, 7);

            const html = templateEngine.render('themeCard', {
                cardId,
                editBtnId,
                deleteBtnId,
                activeClass: isActive ? ' CUI-active' : '',
                name: theme.name,
                description: theme.description || '',
                index: index + 1,
                editable: !theme.isDefault,
                bgColor: colors['bg-color'] || '#FFFFFF',
                textPrimary: colors['text-primary'] || colors['textPrimary'] || '#212529',
                textSecondary: colors['text-secondary'] || colors['textSecondary'] || '#6C757D',
                primaryColor: colors['primary-color'] || colors['primaryColor'] || '#165DFF',
                borderColor: colors['border-color'] || colors['borderColor'] || '#E9ECEF',
                swatches
            });

            return { html, cardId, editBtnId, deleteBtnId, index };
        });

        return {
            html: result.map(item => item.html).join(''),
            bindings: result.map(item => ({ cardId: item.cardId, index: item.index }))
        };
    }

    _renderEditSection() {
        const theme = this.themes[this.editingThemeIndex];
        const nameInputId = utils.generateId('CUI-GEN', 8, 7);
        const descInputId = utils.generateId('CUI-GEN', 8, 7);
        const cancelBtnId = utils.generateId('CUI-GEN', 8, 7);
        const saveBtnId = utils.generateId('CUI-GEN', 8, 7);

        const colorKeys = [
            { key: 'primary-color', label: '主色' },
            { key: 'text-primary', label: '文字' },
            { key: 'text-secondary', label: '次要' },
            { key: 'bg-color', label: '背景' },
            { key: 'border-color', label: '边框' },
            { key: 'success-color', label: '成功' },
            { key: 'warning-color', label: '警告' },
            { key: 'error-color', label: '错误' }
        ];

        const colors = theme?.colors || {};
        const colorFields = colorKeys.map(item => {
            const inputId = utils.generateId('CUI-GEN', 8, 7);
            const value = colors[item.key] || '#000000';
            return `<label class="CUI-theme-edit-color" for="${inputId}">
                <span class="CUI-theme-edit-color-swatch" style="background: ${value};"></span>
                <span class="CUI-theme-edit-color-label">${item.label}</span>
                <input id="${inputId}" type="color" class="CUI-theme-edit-color-input" value="${value}" data-color-key="${item.key}">
            </label>`;
        }).join('');

        const html = templateEngine.render('themeEdit', {
            mode: this.isAddingTheme ? '添加主题' : '编辑主题',
            name: theme?.name || '',
            description: theme?.description || '',
            nameInputId,
            descInputId,
            cancelBtnId,
            saveBtnId,
            colorFields
        });

        return { html, nameInputId, descInputId, cancelBtnId, saveBtnId, colorKeys };
    }

    _bindContainerEvents(container, options) {
        const { closeBtnId, addBtnId } = options;

        const closeBtn = container.querySelector(`#${closeBtnId}`);
        closeBtn?.addEventListener('click', () => {
            this._closePopup(options);
        });

        const addBtn = container.querySelector(`#${addBtnId}`);
        addBtn?.addEventListener('click', () => {
            this._startAdd();
            this.refreshContainer();
        });

        const themeList = container.querySelector('.CUI-theme-list');
        if (themeList) {
            themeList.addEventListener('click', (e) => {
                const card = e.target.closest('.CUI-theme-card');
                if (!card) return;

                const cardId = card.id;
                const binding = this._cardBindings?.find(b => b.cardId === cardId);
                if (!binding) return;

                const editBtn = e.target.closest('.CUI-btn-secondary');
                const deleteBtn = e.target.closest('.CUI-btn-danger');

                if (deleteBtn) {
                    e.stopPropagation();
                    if (confirm(`确定删除主题「${this.themes[binding.index].name}」吗？`)) {
                        this.deleteTheme(binding.index);
                        this.refreshContainer();
                    }
                    return;
                }

                if (editBtn) {
                    e.stopPropagation();
                    this._startEdit(binding.index);
                    this.refreshContainer();
                    return;
                }

                const theme = this.themes[binding.index];
                this.applyTheme(theme);
                this.refreshContainer();
            });
        }

        if (this._editIds) {
            const cancelBtn = container.querySelector(`#${this._editIds.cancelBtnId}`);
            const saveBtn = container.querySelector(`#${this._editIds.saveBtnId}`);

            cancelBtn?.addEventListener('click', () => {
                this._cancelEdit();
                this.refreshContainer();
            });

            saveBtn?.addEventListener('click', () => {
                this._saveTheme(options);
            });

            container.querySelectorAll('.CUI-theme-edit-color-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const swatch = input.previousElementSibling.previousElementSibling;
                    if (swatch) {
                        swatch.style.background = e.target.value;
                    }
                });
            });
        }
    }

    _startAdd() {
        this.isAddingTheme = true;
        this.isEditingTheme = false;
        this.editingThemeIndex = -1;
    }

    _startEdit(index) {
        if (index < 0 || index >= this.themes.length) {
            console.warn('[ThemeManager] 无效的索引');
            return;
        }

        this.isAddingTheme = false;
        this.isEditingTheme = true;
        this.editingThemeIndex = index;
    }

    _cancelEdit() {
        this.isAddingTheme = false;
        this.isEditingTheme = false;
        this.editingThemeIndex = -1;
    }

    _saveTheme(options) {
        if (!this._editIds) {
            console.error('[ThemeManager] 找不到编辑区域ID');
            return;
        }

        const nameInput = document.querySelector(`#${this._editIds.nameInputId}`);
        const descInput = document.querySelector(`#${this._editIds.descInputId}`);

        if (!nameInput) {
            console.error('[ThemeManager] 找不到主题名称输入框');
            return;
        }

        const name = nameInput.value.trim();
        const description = descInput?.value.trim() || '';

        if (!name) {
            alert('请输入主题名称');
            return;
        }

        if (!this._validateThemeName(name, this.editingThemeIndex)) {
            alert('主题名称已存在');
            return;
        }

        const colorInputs = document.querySelectorAll('.CUI-theme-edit-color-input');
        const colors = {};
        let hasInvalidColor = false;
        colorInputs.forEach(input => {
            const key = input.dataset.colorKey;
            const val = input.value.trim();
            if (val) colors[key] = val;
        });

        if (this.isAddingTheme) {
            const newTheme = {
                name,
                description,
                isDefault: false,
                colors: Object.keys(colors).length > 0 ? colors : {
                    'primary-color': '#165DFF',
                    'bg-color': '#FFFFFF',
                    'text-primary': '#212529',
                    'text-secondary': '#6B7280',
                    'border-color': '#E5E7EB',
                    'success-color': '#10B981',
                    'warning-color': '#F59E0B',
                    'error-color': '#EF4444',
                    'info-color': '#3B82F6'
                }
            };

            this.addTheme(newTheme);
            alert('主题添加成功');
        } else if (this.isEditingTheme && this.editingThemeIndex >= 0) {
            const theme = this.themes[this.editingThemeIndex];
            theme.name = name;
            theme.description = description;
            if (Object.keys(colors).length > 0) {
                theme.colors = { ...theme.colors, ...colors };
            }

            this.saveCustomThemes();
            this._notifyListeners('themeUpdated', theme);
            alert('主题修改成功');
        }

        this._cancelEdit();
        this.refreshContainer();
    }

    _closePopup(options) {
        this._cancelEdit();
        if (options?.resolve) {
            options.resolve(this.currentTheme);
        }
        this.close();
    }

    refreshContainer() {
        const overlay = document.querySelector(`#${this.getOverlayId()}`);
        if (!overlay) {
            console.warn('[ThemeManager] 找不到遮罩层');
            return;
        }

        const existingContainer = overlay.querySelector('.CUI-theme-selector');
        if (existingContainer) {
            overlay.removeChild(existingContainer);
        }

        const newContainer = this.createContainer({
            resolve: null,
            reject: null,
            overlay
        });

        if (newContainer) {
            overlay.appendChild(newContainer);
        }
    }
}

export const themeManager = new ThemeManager();
export { ThemeManager };
export default themeManager;
