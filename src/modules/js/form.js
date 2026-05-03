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
        this.processForms();
        this.setupObserver();
    },

    processForms() {
        document.querySelectorAll('form').forEach(form => {
            if (form.classList.contains('CUI-form') && !this.processedForms.has(form)) {
                this.processedForms.add(form);
                this.processForm(form);
            }
        });
    },

    processForm(form) {
        this.wrapInCard(form);
        this.wrapButtons(form);
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
        const buttons = form.querySelectorAll('button:not(.CUI-form-actions *), input[type="submit"], input[type="button"], input[type="reset"]');
        if (buttons.length === 0) return;

        let actionsContainer = form.querySelector('.CUI-form-actions');
        if (!actionsContainer) {
            actionsContainer = document.createElement('div');
            actionsContainer.className = 'CUI-form-actions';
            form.appendChild(actionsContainer);
        }

        buttons.forEach(btn => {
            if (!btn.classList.contains('btn')) {
                btn.classList.add('btn');
            }
            if (btn.type === 'submit' && !btn.classList.contains('btn-primary')) {
                btn.classList.add('btn-primary');
            } else if (!btn.classList.contains('btn-primary') && !btn.classList.contains('btn-secondary')) {
                btn.classList.add('btn-secondary');
            }
            if (btn.parentElement !== actionsContainer) {
                actionsContainer.appendChild(btn);
            }
        });
    },

    setupObserver() {
        if (typeof CastingDOMObserver !== 'undefined') {
            CastingDOMObserver.onAdd('form-processor', 'form.CUI-form', (form) => {
                if (!this.processedForms.has(form)) {
                    this.processedForms.add(form);
                    this.processForm(form);
                }
            });
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CUIFormProcessor.init());
} else {
    CUIFormProcessor.init();
}

window.CUI = window.CUI || {};
window.CUI.form = CUIFormProcessor;
