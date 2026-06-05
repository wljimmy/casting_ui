/* 
 * Casting UI Framework
 * Version: 0.3.0
 * Module: image-zoom.js
 * Description: 图片放大模块，支持点击图片放大查看
 * Copyright (c) 2026 Bingo工作室
 * @dependency: core
 * Email: wljimmy@hotmail.com
 */

import { debug } from './core.js';
import { domObserver } from './dom-observer.js';

// 图片放大全局函数
function zoomImage(src) {
    debug('放大图片', null, { src });
    
    // 检查是否已存在图片放大遮罩
    let overlay = document.getElementById('imageZoomOverlay');
    if (!overlay) {
        // 创建图片放大遮罩元素
        overlay = document.createElement('div');
        overlay.id = 'imageZoomOverlay';
        overlay.className="CUI-image-zoom-overlay";
        overlay.innerHTML = `
            <button class="image-zoom-close" data-action="closeImageZoom">&times;</button>
            <img id="imageZoomContent" class="image-zoom-content" src="" alt="放大图片">
        `;
        
        // 添加到body
        document.body.appendChild(overlay);
    }
    
    // 设置图片源并显示遮罩
    const content = document.getElementById('imageZoomContent');
    if (content) {
        content.src = src;
        setTimeout(() => {
            overlay.classList.add("CUI-show");
        }, 10);
    }
}

// 注册到全局生命周期调度器，声明强依赖核心
window.CUI.registerModule('imageZoom', {
    dependencies: ['core'],
    stages: {
        DOM_REGISTRY: () => {
            // 通过DOMObserver绑定关闭事件
            domObserver.onAdd('image-zoom-close', '.image-zoom-close', (el) => {
                el.addEventListener('click', () => {
                    closeImageZoom();
                });
            });
            
            // 通过DOMObserver绑定点击遮罩关闭事件
            domObserver.onAdd('image-zoom-overlay', '.image-zoom-overlay', (el) => {
                el.addEventListener('click', (e) => {
                    if (e.target === el) {
                        closeImageZoom();
                    }
                });
            });
        }
    }
});

function closeImageZoom() {
    debug('关闭图片放大', 'imageZoomOverlay');
    const overlay = document.getElementById('imageZoomOverlay');
    if (overlay) {
        overlay.classList.remove("CUI-show");
        // 动画结束后移除元素
        setTimeout(() => {
            if (document.getElementById('imageZoomOverlay')) {
                document.body.removeChild(overlay);
            }
        }, 300);
    }
}

// 导出
export { zoomImage, closeImageZoom };

// 避免全局变量冲突，使用更安全的命名空间
if (!window.CUI) {
    window.CUI = {};
}

// 暴露到全局
window.CUI.zoomImage = zoomImage;
window.CUI.closeImageZoom = closeImageZoom;