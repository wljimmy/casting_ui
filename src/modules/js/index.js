/*
 * Casting UI Framework
 * Version: 0.5.1
 * Module: index.js
 * Description: 模块加载器，按需加载各功能模块
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

// ==============================
// 环境检测（核心模块）
// ==============================
const CUIEnvironment = {
    browser: 'unknown',
    browserVersion: 0,
    platform: 'unknown',
    features: {
        nativeInputIcons: false,
        viewTransitions: false,
        containerQueries: false
    },
    verified: {
        browser: false,
        platform: false,
        isFake: false
    }
};

(function initEnv() {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    const vendor = navigator.vendor.toLowerCase();

    let detectedBrowser = 'unknown';
    let detectedVersion = 0;

    if ((ua.includes('edg') || ua.includes('edge')) && vendor.includes('microsoft')) {
        detectedBrowser = 'edge';
        const match = ua.match(/Edge\/(\d+)/) || ua.match(/edg\/(\d+)/);
        detectedVersion = match ? parseInt(match[1]) : 0;
    } else if (ua.includes('chrome') && !ua.includes('edg') && vendor.includes('google')) {
        detectedBrowser = 'chrome';
        const match = ua.match(/Chrome\/(\d+)/);
        detectedVersion = match ? parseInt(match[1]) : 0;
    } else if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('edg') && vendor.includes('apple')) {
        detectedBrowser = 'safari';
        const match = ua.match(/Version\/(\d+)/);
        detectedVersion = match ? parseInt(match[1]) : 0;
    } else if (ua.includes('firefox')) {
        detectedBrowser = 'firefox';
        const match = ua.match(/Firefox\/(\d+)/);
        detectedVersion = match ? parseInt(match[1]) : 0;
    } else if (ua.includes('opera') || ua.includes('opr')) {
        detectedBrowser = 'opera';
        const match = ua.match(/(?:Opera|OPR)\/(\d+)/);
        detectedVersion = match ? parseInt(match[1]) : 0;
    } else if (ua.includes('edg') && !ua.includes('chrome')) {
        detectedBrowser = 'edge';
        const match = ua.match(/edg\/(\d+)/);
        detectedVersion = match ? parseInt(match[1]) : 0;
    } else if (ua.includes('chrome') && !ua.includes('edg')) {
        detectedBrowser = 'chrome';
        const match = ua.match(/Chrome\/(\d+)/);
        detectedVersion = match ? parseInt(match[1]) : 0;
    } else if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('edg')) {
        detectedBrowser = 'safari';
        const match = ua.match(/Version\/(\d+)/);
        detectedVersion = match ? parseInt(match[1]) : 0;
    }

    CUIEnvironment.browser = detectedBrowser;
    CUIEnvironment.browserVersion = detectedVersion;
    CUIEnvironment.verified.browser = detectedBrowser !== 'unknown';

    let detectedPlatform = 'unknown';
    if (platform.includes('mac')) {
        detectedPlatform = /iphone|ipad|ipod/.test(ua) ? 'ios' : 'mac';
    } else if (platform.includes('win')) {
        detectedPlatform = 'windows';
    } else if (platform.includes('linux')) {
        detectedPlatform = 'linux';
    } else if (ua.includes('android')) {
        detectedPlatform = 'android';
    }

    CUIEnvironment.platform = detectedPlatform;
    CUIEnvironment.verified.platform = detectedPlatform !== 'unknown';

    CUIEnvironment.features.nativeInputIcons = detectNativeInputIcons();
    CUIEnvironment.features.viewTransitions = typeof document.startViewTransition === 'function';
    CUIEnvironment.features.containerQueries = CSS.supports('container-type: inline-size');

    // 暴露到全局
    window.CUI = window.CUI || {};
    window.CUI.env = CUIEnvironment;

    console.log('环境检测完成:', {
        browser: CUI.env.browser,
        platform: CUI.env.platform,
        browserVersion: CUI.env.browserVersion,
        hasNativeIcons: CUI.env.features.nativeInputIcons
    });
})();

function detectNativeInputIcons() {
    // Safari 完全不支持原生图标显示
    if (CUIEnvironment.browser === 'safari') {
        return false;
    }

    // Chrome 浏览器（版本号未知或已知支持）
    if (CUIEnvironment.browser === 'chrome') {
        return true;
    }

    // Edge 浏览器（版本号未知或已知支持）
    if (CUIEnvironment.browser === 'edge') {
        return true;
    }

    // Firefox 93+ 支持（版本号未知时保守返回 false）
    if (CUIEnvironment.browser === 'firefox' && CUIEnvironment.browserVersion >= 93) {
        return true;
    }

    // Opera 浏览器（版本号未知时保守返回 false）
    if (CUIEnvironment.browser === 'opera' && CUIEnvironment.browserVersion >= 66) {
        return true;
    }

    return false;
}

// ==============================
// 模块加载
// ==============================
// 优先加载调度器模块，随后加载DOM观察器和遮罩模块
import('./scheduler.js').then(() => {
    console.log('生命周期调度器模块加载完成');
    return import('./dom-observer.js');
}).then(() => {
    console.log('DOM观察器模块加载完成');
    return import('./overlay.js');
}).then(() => {
    console.log('独立遮罩模块加载完成');
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
    console.log('所有模块加载完成，开始启动生命周期流水线 Pipeline');
    return window.CUI.scheduler.runPipeline();
}).catch(error => {
    console.error('模块加载或生命周期流水线执行失败:', error);
});
