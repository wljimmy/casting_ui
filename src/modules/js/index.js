/* 
 * Casting UI Framework
 * Version: 0.5.1
 * Module: index.js
 * Description: 模块加载器，按需加载各功能模块
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

// 首先加载环境检测模块
import('./env.js').then(() => {
    console.log('环境检测模块加载完成:', {
        browser: CUI.env.browser,
        platform: CUI.env.platform,
        hasNativeIcons: CUI.env.features.nativeInputIcons
    });

    // 优先加载DOM观察器模块
    return import('./dom-observer.js');
}).then(() => {
    console.log('DOM观察器模块加载完成');

    // 加载核心模块
    return import('./core.js');
}).then(module => {
    // 核心模块加载完成后，加载其他模块
    return Promise.all([
        import('./modal.js'),
        import('./message.js'),
        import('./image-zoom.js'),
        import('./color-picker.js'),
        import('./theme-manager.js'),
        import('./menu.js'),
        import('./ui.js'),
        import('./progress.js'),
        import('./input.js'),
        import('./form.js')
    ]);
}).then(() => {
    console.log('所有模块加载完成');
}).catch(error => {
    console.error('模块加载失败:', error);
});