/*
 * Casting UI Framework
 * Version: 0.3.0
 * Module: common.tpl.js
 * Description: 通用模板定义（弹窗头部、底部等可复用组件）
 */

export const commonTemplates = {
    // ==================== 通用弹窗头部 ====================
    popupHeader: `
        <div class="CUI-popup-header" style="
            padding: var(--size-lg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            background: var(--bg-color);
            z-index: 10;
        ">
            <h3 class="CUI-popup-title" style="margin: 0; color: var(--text-primary); font-size: var(--font-size-lg);">
                {{title||'弹窗'}}
            </h3>
            <button class="CUI-popup-close" style="
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--text-light);
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-sm);
                transition: all var(--transition-normal);
            ">×</button>
        </div>
    `,

    // ==================== 通用弹窗底部 ====================
    popupFooter: `
        <div class="CUI-popup-footer" style="
            padding: var(--size-md) var(--size-lg);
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: var(--size-sm);
            justify-content: flex-end;
        ">
            {{#if showCancel}}
            <button class="CUI-btn CUI-btn-secondary" style="
                padding: var(--size-xs) var(--size-lg);
                border-radius: var(--radius-md);
                border: none;
                cursor: pointer;
                font-size: var(--font-size-sm);
                background: var(--secondary-color);
                color: var(--text-primary);
            ">取消</button>
            {{/if}}
            <button class="CUI-btn CUI-btn-primary" style="
                padding: var(--size-xs) var(--size-lg);
                border-radius: var(--radius-md);
                border: none;
                cursor: pointer;
                font-size: var(--font-size-sm);
                background: var(--primary-color);
                color: white;
            ">
                {{confirmText||'确定'}}
            </button>
        </div>
    `,

    // ==================== 通用按钮组 ====================
    buttonGroup: `
        <div class="CUI-btn-group" style="display: flex; gap: var(--size-sm); {{extraStyle||''}}">
            {{#each buttons}}
                <button class="CUI-btn CUI-btn-{{type||'default'}}" {{#if action}}data-action="{{action}}"{{/if}} style="
                    padding: var(--size-xs) var(--size-lg);
                    border-radius: var(--radius-md);
                    border: none;
                    cursor: pointer;
                    font-size: var(--font-size-sm);
                ">
                    {{label||'按钮'}}
                </button>
            {{/each}}
        </div>
    `,

    // ==================== 通用输入框 ====================
    inputField: `
        <div class="CUI-input-field" style="margin-bottom: var(--size-md);">
            <label class="CUI-input-label" style="
                display: block;
                margin-bottom: var(--size-xs);
                color: var(--text-secondary);
                font-size: var(--font-size-sm);
            ">
                {{label||'标签'}} {{#if required}}<span style="color: var(--error-color); margin-left: 2px;">*</span>{{/if}}
            </label>
            <input
                type="{{type||'text'}}"
                class="CUI-input {{className||''}}"
                name="{{name||''}}"
                value="{{value||''}}"
                placeholder="{{placeholder||''}}"
                {{#if disabled}}disabled{{/if}}
                style="
                    width: {{width||'100%'}};
                    padding: var(--size-sm);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background: var(--bg-color);
                    color: var(--text-primary);
                    font-size: var(--font-size-base);
                "
            />
        </div>
    `,

    // ==================== 通用卡片 ====================
    card: `
        <div class="CUI-card" style="
            background: var(--bg-color);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
            padding: var(--size-lg);
            {{extraStyle||''}}
        ">
            {{content||''}}
        </div>
    `,

    // ==================== 通用分割线 ====================
    divider: `
        <div class="CUI-divider" style="
            height: 1px;
            background: var(--border-color);
            margin: {{margin||'var(--size-lg) 0'}};
        "></div>
    `,

    // ==================== 通用空状态 ====================
    emptyState: `
        <div class="CUI-empty-state" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--size-2xl);
        ">
            <div class="CUI-empty-icon" style="
                font-size: 48px;
                color: var(--text-light);
                margin-bottom: var(--size-md);
            ">
                {{icon||'📭'}}
            </div>
            <div class="CUI-empty-text" style="
                color: var(--text-secondary);
                font-size: var(--font-size-base);
            ">
                {{text||'暂无数据'}}
            </div>
        </div>
    `,

    // ==================== 通用加载状态 ====================
    loadingState: `
        <div class="CUI-loading-state" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--size-2xl);
        ">
            <div class="CUI-loading-spinner" style="
                width: 32px;
                height: 32px;
                border: 3px solid var(--border-color);
                border-top-color: var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: var(--size-md);
            "></div>
            <div class="CUI-loading-text" style="
                color: var(--text-secondary);
                font-size: var(--font-size-sm);
            ">
                {{text||'加载中...'}}
            </div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
        </div>
    `,

    // ==================== 通用提示信息 ====================
    alertMessage: `
        <div class="CUI-alert CUI-alert-{{type||'info'}}" style="
            padding: var(--size-md);
            border-radius: var(--radius-md);
            margin-bottom: var(--size-md);
            background: {{backgroundColor}};
            color: {{textColor}};
            display: flex;
            align-items: center;
            gap: var(--size-sm);
        ">
            <span class="CUI-alert-icon">{{icon}}</span>
            <span class="CUI-alert-text">{{message}}</span>
        </div>
    `
};

export default commonTemplates;