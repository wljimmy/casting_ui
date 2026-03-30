/* 
 * Casting UI Framework
 * Version: 0.2.0
 * Module: image-zoom.js
 * Description: 图片放大模块，支持点击图片放大查看
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

import { debug } from './core.js';

// 图片放大全局函数
function zoomImage(src) {
    debug('放大图片', null, { src });
    
    // 检查是否已存在图片放大遮罩
    let overlay = document.getElementById('imageZoomOverlay');
    if (!overlay) {
        // 创建图片放大遮罩元素
        overlay = document.createElement('div');
        overlay.id = 'imageZoomOverlay';
        overlay.className = 'image-zoom-overlay';
        overlay.innerHTML = `
            <button class="image-zoom-close" onclick="closeImageZoom()">&times;</button>
            <img id="imageZoomContent" class="image-zoom-content" src="" alt="放大图片">
        `;
        
        // 添加到body
        document.body.appendChild(overlay);
        
        // 点击遮罩关闭图片放大
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeImageZoom();
            }
        });
    }
    
    // 设置图片源并显示遮罩
    const content = document.getElementById('imageZoomContent');
    if (content) {
        content.src = src;
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
    }
}

function closeImageZoom() {
    debug('关闭图片放大', 'imageZoomOverlay');
    const overlay = document.getElementById('imageZoomOverlay');
    if (overlay) {
        overlay.classList.remove('show');
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

// 暴露到全局
window.zoomImage = zoomImage;
window.closeImageZoom = closeImageZoom;