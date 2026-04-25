/* 
 * Casting UI Framework
 * Version: 0.3.0
 * Module: status.js
 * Description: 状态栏模块
 * Copyright (c) 2026 Bingo工作室
 */

class StatusBar {
    constructor(options = {}) {
        this.options = {
            type: options.type || 'default',
            size: options.size || 'md',
            items: options.items || [],
            glass: options.glass || false,
            dark: options.dark || false,
            primary: options.primary || false,
            ...options
        };
        this.container = null;
    }

    render(container) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;

        if (!this.container) {
            console.error('StatusBar: 容器未找到');
            return this;
        }

        const classes = [
            'status-bar',
            `status-bar-${this.options.size}`,
            this.options.glass ? 'status-bar-glass' : '',
            this.options.dark ? 'status-bar-dark' : '',
            this.options.primary ? 'status-bar-primary' : ''
        ].filter(Boolean).join(' ');

        this.container.className = classes;

        if (this.options.items.length > 0) {
            this.container.innerHTML = this.options.items.map(item => `
                <div class="status-bar-item">
                    ${item.indicator ? `<span class="status-indicator ${item.indicator}"></span>` : ''}
                    <span>${item.text || ''}</span>
                </div>
            `).join('');
        }

        return this;
    }

    updateItems(items) {
        this.options.items = items;
        if (this.container) {
            this.container.innerHTML = items.map(item => `
                <div class="status-bar-item">
                    ${item.indicator ? `<span class="status-indicator ${item.indicator}"></span>` : ''}
                    <span>${item.text || ''}</span>
                </div>
            `).join('');
        }
        return this;
    }

    setItem(index, item) {
        if (this.options.items[index]) {
            this.options.items[index] = item;
            this.updateItems(this.options.items);
        }
        return this;
    }
}

// 避免全局变量冲突，使用更安全的命名空间
if (!window.CUI) {
    window.CUI = {};
}

window.CUI.StatusBar = StatusBar;