/* 
 * Casting UI Framework
 * Version: 0.3.0
 * Module: message.js
 * Description: 消息提示模块，提供Toast、Loading等功能
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

import { debug } from './core.js';

// 消息提示组件
function createMessage(options = {}) {
    const id = options.id || `message-${Date.now()}`;
    const type = options.type || 'info'; // info, success, warning, error
    const title = options.title || '消息';
    const content = options.content || '';
    const duration = options.duration;
    const position = options.position || 'top'; // top, bottom, left, right, center
    
    // 创建消息容器
    const message = document.createElement('div');
    message.id = id;
    message.className = `message message-${type} message-${position}`;
    message.style.cssText = `
        padding: 16px;
        background-color: var(--gray-100);
        border-radius: var(--radius-md);
        border-left: 4px solid var(--primary-color);
        box-shadow: var(--shadow-sm);
        transition: all var(--transition-normal);
    `;
    
    // 设置不同类型的边框颜色
    switch (type) {
        case 'success':
            message.style.borderLeftColor = 'var(--success-color)';
            break;
        case 'warning':
            message.style.borderLeftColor = 'var(--warning-color)';
            break;
        case 'error':
            message.style.borderLeftColor = 'var(--error-color)';
            break;
        default:
            message.style.borderLeftColor = 'var(--primary-color)';
    }
    
    // 构建消息内容
    message.innerHTML = `
        <h4>${title}</h4>
        <div>${content}</div>
    `;
    
    // 添加到页面
    const container = options.container || document.body;
    
    // 检查container是否为容器元素
    const isContainer = container.children.length > 0;
    
    if (isContainer) {
        // 如果是容器，在容器的最后一个元素后显示，宽度占据所有列
        message.style.width = '100%';
        message.style.margin = '16px 0';
        container.appendChild(message);
    } else {
        // 如果是普通元素，显示在该元素下部，和该元素等宽
        message.style.width = container.offsetWidth + 'px';
        message.style.marginTop = '16px';
        container.parentNode.insertBefore(message, container.nextSibling);
    }
    
    // 自动关闭
    if (duration !== undefined && duration !== 0) {
        // 确保持续时间至少为1秒
        const actualDuration = Math.max(1000, duration);
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-10px)';
            message.style.transition = 'all var(--transition-normal)';
            setTimeout(() => {
                if (document.getElementById(id)) {
                    if (isContainer) {
                        container.removeChild(message);
                    } else {
                        container.parentNode.removeChild(message);
                    }
                }
            }, 300);
        }, actualDuration);
    }
    
    return message;
}

function showToast(type, message, position = 'top') {
    debug('显示Toast', null, { type, message, position });
    // 创建Toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} toast-${position}`;
    toast.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}
            ${type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' : ''}
            ${type === 'warning' ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>' : ''}
            ${type === 'info' ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>' : ''}
        </svg>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示Toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // 3秒后隐藏并移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}



function showLoading(text = '加载中...') {
    debug('显示加载遮罩', 'loadingOverlay');
    
    // 检查是否已存在加载遮罩
    let loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) {
        // 创建加载遮罩元素
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.style.display = 'none';
        loadingOverlay.innerHTML = `<div class="loading loading-lg"></div><p style="margin-top: 10px; color: var(--text-primary);">${text}</p>`;
        
        // 添加到body
        document.body.appendChild(loadingOverlay);
    }
    
    // 显示加载遮罩
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.flexDirection = 'column';
    loadingOverlay.style.alignItems = 'center';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        // 隐藏后移除元素
        setTimeout(() => {
            if (document.getElementById('loadingOverlay')) {
                document.body.removeChild(loadingOverlay);
            }
        }, 300);
    }, 3000);
}

// 隐藏加载遮罩
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        // 隐藏后移除元素
        setTimeout(() => {
            if (document.getElementById('loadingOverlay')) {
                document.body.removeChild(loadingOverlay);
            }
        }, 300);
    }
}

// 导出
export { createMessage, showToast, showLoading, hideLoading };

// 暴露到全局
window.createMessage = createMessage;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;