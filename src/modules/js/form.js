/*
 * Casting UI Framework
 * Version: 0.3.0
 * Module: form.js
 * Description: Form 表单布局 - 灵活列数版
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

const CUIFormProcessor = {
    processedForms: new WeakSet(),

    init() {
        this.setupObserver();
        this.processForms();
    },

    processForms() {
        document.querySelectorAll('form.CUI-form').forEach(form => {
            this.processForm(form);
        });
    },

    processForm(form) {
        if (this.isProcessed(form)) return;
        this.markProcessed(form);
        
        this.wrapInCard(form);
        this.wrapButtons(form);
    },

    isProcessed(form) {
        return form.classList.contains('CUI-form-processed') || this.processedForms.has(form);
    },

    markProcessed(form) {
        form.classList.add('CUI-form-processed');
        this.processedForms.add(form);
    },

    wrapInCard(form) {
        if (form.parentElement && form.parentElement.classList.contains('CUI-form-card')) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'CUI-form-card';

        const parent = form.parentElement;
        const nextSibling = form.nextSibling;
        parent.insertBefore(card, nextSibling);
        card.appendChild(form);
    },

    wrapButtons(form) {
        const buttons = form.querySelectorAll('button:not(.CUI-form-actions *):not(.CUI-input-box *), input[type="submit"]:not(.CUI-input-box *), input[type="button"]:not(.CUI-input-box *), input[type="reset"]:not(.CUI-input-box *)');
        if (buttons.length === 0) return;

        let actionsContainer = form.querySelector('.CUI-form-actions');
        if (!actionsContainer) {
            actionsContainer = document.createElement('div');
            actionsContainer.className = 'CUI-form-actions';
            form.appendChild(actionsContainer);
        }

        buttons.forEach(btn => {
            if (!btn.classList.contains('btn')) {
                btn.classList.add("CUI-btn");
            }
            if (btn.type === 'submit' && !btn.classList.contains('btn-primary')) {
                btn.classList.add("CUI-btn-primary");
            } else if (!btn.classList.contains('btn-primary') && !btn.classList.contains('btn-secondary')) {
                btn.classList.add("CUI-btn-secondary");
            }
            if (btn.parentElement !== actionsContainer) {
                actionsContainer.appendChild(btn);
            }
        });
    },

    setupObserver() {
        if (typeof CastingDOMObserver !== 'undefined') {
            CastingDOMObserver.onAdd('form-processor', 'form.CUI-form', (form) => {
                this.processForm(form);
            });
        }
    }
};

window.CUI = window.CUI || {};
window.CUI.form = CUIFormProcessor;

// 注册到全局生命周期调度器，在 DOM_REGISTRY 阶段由调度器驱动
window.CUI.registerModule('form', {
    stages: {
        DOM_REGISTRY: () => {
            CUIFormProcessor.init();
        }
    }
});