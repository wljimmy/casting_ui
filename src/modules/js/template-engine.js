/*
 * Casting UI Framework
 * Version: 0.6.0
 * Module: template-engine.js
 * Description: 轻量级模板引擎，支持变量替换、注释和条件判断
 */

class TemplateEngine {
    constructor() {
        this.templates = {};
    }

    register(name, template) {
        if (!name || typeof name !== 'string') {
            console.warn('[TemplateEngine] 模板名称必须是字符串');
            return;
        }
        if (!template || typeof template !== 'string') {
            console.warn('[TemplateEngine] 模板内容必须是字符串');
            return;
        }
        this.templates[name] = template;
    }

    get(name) {
        const template = this.templates[name];
        if (!template) {
            console.warn(`[TemplateEngine] 未找到模板: ${name}`);
        }
        return template || '';
    }

    render(template, data = {}) {
        if (!template || typeof template !== 'string') {
            console.warn('[TemplateEngine] 模板必须是字符串');
            return '';
        }

        let html = this.templates[template] || template;

        // 1. 渲染注释（保留注释 {{* ... *}} -> <!-- ... -->）
        html = this._renderComments(html);

        // 2. 渲染条件语句 {{#if variable}}...{{/if}}
        html = this._renderIf(html, data);

        // 3. 渲染变量（处理默认值）
        html = this._renderVariables(html, data);

        return html.trim();
    }

    _renderComments(html) {
        return html.replace(/\{\{\* (.+?) \*\}\}/g, (match, comment) => {
            return `<!-- ${comment} -->`;
        });
    }

    _renderIf(html, data) {
        // 处理 {{#if variable}}...{{/if}}
        const ifRegex = /\{\{\#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
        
        html = html.replace(ifRegex, (match, variable, content) => {
            const value = data[variable];
            
            // 判断条件：存在且不为空字符串、不为false、不为0
            const isTruthy = value !== undefined && 
                            value !== null && 
                            value !== '' && 
                            value !== false && 
                            value !== 0;
            
            return isTruthy ? content : '';
        });

        return html;
    }

    _renderVariables(html, data) {
        // {{{variable||default}}} 不转义的带默认值变量
        html = html.replace(/\{\{\{(\w+)\|\|(.+?)\}\}\}/g, (match, key, defaultValue) => {
            const value = data[key];
            if (value === undefined || value === null || value === '') {
                return defaultValue;
            }
            return value;
        });

        // {{{variable}}} 不转义的HTML变量
        html = html.replace(/\{\{\{(\w+)\}\}\}/g, (match, key) => {
            const value = data[key];
            if (value === undefined || value === null) {
                return '';
            }
            return value;
        });

        // {{variable||default}} 带默认值的变量
        html = html.replace(/\{\{(\w+)\|\|(.+?)\}\}/g, (match, key, defaultValue) => {
            const value = data[key];
            if (value === undefined || value === null || value === '') {
                return defaultValue;
            }
            return this._escapeHtml(value);
        });

        // {{variable}} 普通变量
        html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            const value = data[key];
            if (value === undefined || value === null) {
                return '';
            }
            return this._escapeHtml(value);
        });

        return html;
    }

    _escapeHtml(value) {
        if (typeof value !== 'string') {
            return value;
        }
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return value.replace(/[&<>"']/g, m => map[m]);
    }

    toElement(html) {
        if (!html) {
            console.warn('[TemplateEngine] HTML为空');
            return null;
        }

        try {
            const template = document.createElement('template');
            template.innerHTML = html;
            return template.content.firstElementChild;
        } catch (error) {
            console.error('[TemplateEngine] HTML解析失败:', error);
            return null;
        }
    }

    renderElement(template, data = {}) {
        const html = this.render(template, data);
        return this.toElement(html);
    }
}

export const templateEngine = new TemplateEngine();

export default templateEngine;