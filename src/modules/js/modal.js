/* 
 * Casting UI Framework
 * Version: 0.3.0
 * Module: modal.js
 * Description: 弹窗模块，提供模态框功能
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

import { debug, showOverlay, hideOverlay } from './core.js';

// 弹窗函数，返回Promise
function showModal(options) {
    debug('显示弹窗', options);
    
    // 生成唯一ID
    const id = options.id || `modal-${Date.now()}`;
    const overlayId = `${id}-overlay`;
    
    // 弹窗配置默认值
    const config = {
        title: options.title || '弹窗标题',
        content: options.content || '弹窗内容',
        buttons: options.buttons || [{ text: '关闭', type: 'secondary', action: 'close' }],
        position: options.position || '',
        glass: options.glass || false,
        inputs: options.inputs || []
    };
    
    return new Promise((resolve, reject) => {
        try {
            // 创建遮罩
            const overlay = showOverlay({
                id: overlayId,
                type: config.glass ? 'glass' : 'transparent',
                zIndex: 1000
            });
            
            // 创建弹窗内容元素
            const modalContent = document.createElement('div');
            modalContent.className = `modal-content ${config.position ? `modal-${config.position}` : ''}`;
            
            // 创建输入框HTML
            let inputsHTML = '';
            config.inputs.forEach((input, index) => {
                inputsHTML += `
                    <div class="input-group" style="margin-bottom: 12px;">
                        <label class="input-label">${input.label}</label>
                        <input type="${input.type || 'text'}" class="input" id="${id}-input-${index}" placeholder="${input.placeholder || ''}" value="${input.value || ''}">
                    </div>
                `;
            });
            
            // 创建按钮HTML
            let buttonsHTML = '';
            config.buttons.forEach((button, index) => {
                buttonsHTML += `<button class="btn btn-${button.type}" data-index="${index}">${button.text}</button>`;
            });
            
            // 构建弹窗内容
            modalContent.innerHTML = `
                <div class="modal-header">
                    <h4 class="modal-title">${config.title}</h4>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${config.content}</p>
                    ${inputsHTML}
                </div>
                <div class="modal-footer">
                    ${buttonsHTML}
                </div>
            `;
            
            // 添加到遮罩
            overlay.appendChild(modalContent);
            
            // 显示弹窗
            setTimeout(() => {
                overlay.classList.add('show');
            }, 10);
            
            // 处理按钮点击
            const buttons = modalContent.querySelectorAll('.modal-footer button');
            buttons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    // 收集输入内容
                    const inputs = {};
                    config.inputs.forEach((input, inputIndex) => {
                        const inputElement = document.getElementById(`${id}-input-${inputIndex}`);
                        if (inputElement) {
                            inputs[input.name || `input-${inputIndex}`] = inputElement.value;
                        }
                    });
                    
                    // 执行按钮的 action 回调函数
                    const buttonConfig = config.buttons[index];
                    if (typeof buttonConfig.action === 'function') {
                        buttonConfig.action();
                    }
                    
                    // 隐藏遮罩
                    overlay.classList.remove('show');
                    
                    // 动画结束后移除元素并返回结果
                    setTimeout(() => {
                        hideOverlay(overlayId);
                        resolve({
                            status: 'success',
                            button: buttonConfig,
                            inputs: inputs
                        });
                    }, 300);
                });
            });
            
            // 处理关闭按钮点击
            const closeButton = modalContent.querySelector('.modal-close');
            closeButton.addEventListener('click', () => {
                overlay.classList.remove('show');
                setTimeout(() => {
                    hideOverlay(overlayId);
                    resolve({
                        status: 'closed',
                        button: null,
                        inputs: {}
                    });
                }, 300);
            });
            
            // 处理点击遮罩关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('show');
                    setTimeout(() => {
                        hideOverlay(overlayId);
                        resolve({
                            status: 'closed',
                            button: null,
                            inputs: {}
                        });
                    }, 300);
                }
            });
            
        } catch (error) {
            reject({
                status: 'error',
                error: error.message
            });
        }
    });
}

// 导出
export { showModal };

// 暴露到全局
window.showModal = showModal;

