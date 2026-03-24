/* 
 * Casting UI Framework
 * Version: 0.2.0
 * Module: index.js
 * Description: 模块加载器，按需加载各功能模块
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

// 加载核心模块
import('./core.js').then(module => {
    // 核心模块加载完成后，加载其他模块
    return Promise.all([
        import('./modal.js'),
        import('./message.js'),
        import('./image-zoom.js'),
        import('./color-picker.js'),
        import('./theme-manager.js'),
        import('./ui.js')
    ]);
}).then(() => {
    console.log('所有模块加载完成');
}).catch(error => {
    console.error('模块加载失败:', error);
});