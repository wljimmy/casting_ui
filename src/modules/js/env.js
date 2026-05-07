/*
 * Casting UI Framework
 * Version: 0.5.1
 * Module: env.js
 * Description: 环境检测模块 - 检测浏览器、平台和功能支持
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

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

(function init() {
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

    CUIEnvironment.features.nativeInputIcons = checkNativeInputIcons();
    CUIEnvironment.features.viewTransitions = typeof document.startViewTransition === 'function';
    CUIEnvironment.features.containerQueries = CSS.supports('container-type: inline-size');
})();

function checkNativeInputIcons() {
    try {
        const input = document.createElement('input');
        input.type = 'date';
        input.style.cssText = 'position: fixed; top: -1000px; left: -1000px; opacity: 0; pointer-events: none;';
        document.body.appendChild(input);
        
        const pseudoStyle = window.getComputedStyle(input, '::-webkit-calendar-picker-indicator');

        const content = pseudoStyle.content;
        const width = pseudoStyle.width;
        const height = pseudoStyle.height;
        const backgroundImage = pseudoStyle.backgroundImage;
        const display = pseudoStyle.display;
        const opacity = pseudoStyle.opacity;

        document.body.removeChild(input);

        return (
            (content && content !== 'none' && content.length > 0) ||
            (width !== '0px' && height !== '0px') ||
            (backgroundImage && backgroundImage !== 'none') ||
            (display !== 'none' && opacity !== '0')
        );
    } catch {
        return false;
    }
}

window.CUI = window.CUI || {};
window.CUI.env = CUIEnvironment;

export { CUIEnvironment };