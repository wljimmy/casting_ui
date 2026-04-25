/**
 * Progress 进度条模块
 * 提供进度条的动态渲染和更新功能
 * 使用 dom.go() 接口控制进度
 * 支持自动初始化：<div class="progress" data-value="0" data-type="error"></div>
 */

import { domObserver } from './dom-observer.js';

class Progress {
    constructor(options = {}) {
        this.options = {
            value: options.value || 0,
            max: options.max || 100,
            type: options.type || 'primary',
            size: options.size || 'md',
            showLabel: options.showLabel || false,
            striped: options.striped || false,
            animated: options.animated || false,
            glass: options.glass || false,
            ...options
        };
        this.container = null;
        this.progressBar = null;
    }

    render(container) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.container) {
            console.error('Progress: 容器未找到');
            return this;
        }

        const percentage = Math.min(100, Math.max(0, (this.options.value / this.options.max) * 100));

        const classes = [
            'progress',
            `progress-${this.options.size}`,
            this.options.glass ? 'progress-glass' : ''
        ].filter(Boolean).join(' ');

        const barClasses = [
            'progress-bar',
            this.options.type,
            this.options.striped ? 'progress-stripes' : '',
            this.options.animated ? 'progress-animated' : ''
        ].filter(Boolean).join(' ');

        this.container.className = classes;
        this.container.innerHTML = `
            <div class="${barClasses}" style="width: ${percentage}%">
                ${this.options.showLabel ? `${Math.round(percentage)}%` : ''}
            </div>
        `;

        this.progressBar = this.container.querySelector('.progress-bar');
        return this;
    }

    setValue(value) {
        this.options.value = Math.min(this.options.max, Math.max(0, value));
        if (this.progressBar) {
            const percentage = (this.options.value / this.options.max) * 100;
            this.progressBar.style.width = `${percentage}%`;
            if (this.options.showLabel) {
                this.progressBar.textContent = `${Math.round(percentage)}%`;
            }
        }
        return this;
    }

    getValue() {
        return this.options.value;
    }

    increment(delta = 1) {
        this.setValue(this.options.value + delta);
        return this;
    }

    decrement(delta = 1) {
        this.setValue(this.options.value - delta);
        return this;
    }

    reset() {
        this.setValue(0);
        return this;
    }

    complete() {
        this.setValue(this.options.max);
        return this;
    }
}

window.Progress = Progress;

/**
 * DOM 助手对象
 * 用于通过 dom.go() 接口控制进度条
 */
class DOMHelper {
    constructor() {
        this.progressInstances = new Map();
    }

    /**
     * 初始化进度条并返回控制接口
     * @param {string|HTMLElement} container - 容器选择器或元素
     * @param {Object} options - 进度条配置选项
     * @returns {Object} 进度条控制接口 { go, increment, decrement, reset, complete, getValue }
     */
    init(container, options = {}) {
        const progress = new Progress(options);
        progress.render(container);

        const instanceId = typeof container === 'string'
            ? container
            : container.id || `progress-${Date.now()}`;

        const controlInterface = {
            go: (value) => {
                progress.setValue(value);
                return controlInterface;
            },
            increment: (delta = 1) => {
                progress.increment(delta);
                return controlInterface;
            },
            decrement: (delta = 1) => {
                progress.decrement(delta);
                return controlInterface;
            },
            reset: () => {
                progress.reset();
                return controlInterface;
            },
            complete: () => {
                progress.complete();
                return controlInterface;
            },
            getValue: () => progress.getValue(),
            getProgress: () => progress
        };

        this.progressInstances.set(instanceId, {
            progress,
            control: controlInterface
        });

        return controlInterface;
    }

    /**
     * 获取已存在的进度条控制接口
     * @param {string} instanceId - 实例ID（容器选择器或ID）
     * @returns {Object|null} 进度条控制接口
     */
    get(instanceId) {
        const instance = this.progressInstances.get(instanceId);
        return instance ? instance.control : null;
    }

    /**
     * 移除进度条实例
     * @param {string} instanceId - 实例ID
     */
    remove(instanceId) {
        this.progressInstances.delete(instanceId);
    }
}

const dom = new DOMHelper();
window.dom = dom;

/**
 * ProgressAutoInit 自动初始化类
 * 监听DOM变化，自动初始化带有 progress 类的元素
 */
class ProgressAutoInit {
    constructor() {
        this.init();
    }

    init() {
        domObserver.onAdd('progress-auto', '.progress', (el) => {
            this.autoRender(el);
        });

        domObserver.onRemove('progress-auto', '.progress', (el) => {
            const id = el.id || `#${el.className.split(' ').join('.')}`;
            dom.remove(id);
        });

        document.querySelectorAll('.progress').forEach(el => {
            this.autoRender(el);
        });
    }

    autoRender(el) {
        const options = {
            value: parseInt(el.dataset.value) || 0,
            type: el.dataset.type || 'primary',
            size: el.dataset.size || 'md',
            showLabel: el.dataset.showLabel === 'true',
            striped: el.dataset.striped === 'true',
            animated: el.dataset.animated === 'true',
            glass: el.dataset.glass === 'true'
        };

        const id = el.id || `#${el.className.split(' ').join('.')}`;
        dom.init(el, options);
    }
}

new ProgressAutoInit();