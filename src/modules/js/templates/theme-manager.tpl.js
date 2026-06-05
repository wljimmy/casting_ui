/*
 * Casting UI Framework
 * Version: 0.7.0
 * Module: theme-manager.tpl.js
 * 设计原则：模板仅定义结构和类名，所有样式收敛至 theme-manager.css
 * ID策略：{{变量名}} 占位符，由JS生成随机ID注入
 */

export const themeManagerTemplates = {
    container: `
        {{* CUI-GEN START: theme-selector-container *}}
        <div class="CUI-theme-selector">
            {{{header}}}
            {{{content}}}
        </div>
        {{* CUI-GEN END: theme-selector-container *}}
    `,

    header: `
        {{* CUI-GEN START: theme-header *}}
        <div class="CUI-theme-header">
            <h2 class="CUI-theme-title">主题管理</h2>
            <button id="{{closeBtnId}}" class="CUI-close-btn">&times;</button>
        </div>
        {{* CUI-GEN END: theme-header *}}
    `,

    managementSection: `
        {{* CUI-GEN START: theme-management *}}
        <div class="CUI-theme-management">
            <h3 class="CUI-theme-management-title">主题列表</h3>
            <button id="{{addBtnId}}" class="CUI-btn CUI-btn-primary">添加主题</button>
        </div>
        {{* CUI-GEN END: theme-management *}}
    `,

    themeCard: `
        {{* CUI-GEN START: theme-card *}}
        <div id="{{cardId}}" class="CUI-theme-card{{activeClass}}">
            <div class="CUI-theme-card-preview" style="background: {{bgColor}};">
                <div class="CUI-theme-card-preview-body">
                    <h3 style="margin: 0 0 12px 0; font-weight: 700; color: {{textPrimary}};">{{name}}</h3>
                    <h4 class="CUI-text-sm" style="margin: 8px 0 6px 0; font-weight: 600; color: {{textSecondary}};">风格特点</h4>
                    <p class="CUI-text-sm" style="margin: 0 0 14px 0; color: {{textSecondary}};">{{description}}</p>
                    <h4 class="CUI-text-sm" style="margin: 8px 0 6px 0; font-weight: 600; color: {{textSecondary}};">色彩体系</h4>
                    <p class="CUI-text-sm" style="margin: 0 0 14px 0; color: {{textSecondary}};">涵盖主色、文字、边框及功能色，在不同场景下均能保持一致的视觉语言与舒适的阅读体验。</p>
                    <ul class="CUI-text-sm" style="margin: 0 0 18px 0; padding-left: 18px; color: {{textSecondary}};">
                        <li>主色：品牌视觉的核心识别要素</li>
                        <li>中性灰：构建清晰的内容层级关系</li>
                        <li>功能色：成功、警告、错误等状态反馈</li>
                    </ul>
                    <div style="display: flex; gap: 8px;">
                        <span class="CUI-btn CUI-btn-sm" style="background: {{primaryColor}}; border-color: {{primaryColor}}; color: {{bgColor}}; cursor: default;">主要按钮</span>
                        <span class="CUI-btn CUI-btn-sm" style="border-color: {{borderColor}}; color: {{textPrimary}}; cursor: default;">次要按钮</span>
                        <span class="CUI-btn CUI-btn-sm" style="border-color: {{borderColor}}; color: {{textPrimary}}; cursor: default;">普通按钮</span>
                    </div>
                </div>
            </div>
            <div class="CUI-theme-card-footer">
                <div class="CUI-theme-card-swatches">
                    {{#if swatches}}
                        {{{swatches}}}
                    {{/if}}
                </div>
                {{#if editable}}
                <div class="CUI-theme-card-actions">
                    <button id="{{editBtnId}}" class="CUI-btn CUI-btn-sm CUI-btn-secondary">编辑</button>
                    <button id="{{deleteBtnId}}" class="CUI-btn CUI-btn-sm CUI-btn-danger">删除</button>
                </div>
                {{/if}}
            </div>
        </div>
        {{* CUI-GEN END: theme-card *}}
    `,

    editSection: `
        {{* CUI-GEN START: theme-edit *}}
        <div class="CUI-theme-edit">
            <h3 class="CUI-theme-edit-title">{{mode}}</h3>
            <div class="CUI-theme-edit-group">
                <label class="CUI-theme-edit-label">主题名称</label>
                <input id="{{nameInputId}}" type="text" class="CUI-input CUI-theme-edit-input" value="{{name}}" placeholder="请输入主题名称">
            </div>
            <div class="CUI-theme-edit-group">
                <label class="CUI-theme-edit-label">主题描述</label>
                <textarea id="{{descInputId}}" class="CUI-input CUI-theme-edit-textarea" placeholder="请输入主题描述">{{description}}</textarea>
            </div>
            <h4 class="CUI-theme-edit-title" style="font-size: var(--font-size-lg);">色彩配置</h4>
            <div class="CUI-theme-edit-colors">
                {{{colorFields}}}
            </div>
            <div class="CUI-theme-edit-actions">
                <button id="{{cancelBtnId}}" class="CUI-btn CUI-btn-secondary">取消</button>
                <button id="{{saveBtnId}}" class="CUI-btn CUI-btn-primary">保存</button>
            </div>
        </div>
        {{* CUI-GEN END: theme-edit *}}
    `
};
