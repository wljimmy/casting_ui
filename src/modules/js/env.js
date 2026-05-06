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
    
    let detectedBrowser = 'unknown';
    let detectedVersion = 0;

    if (ua.includes('edg')) {
        detectedBrowser = 'edge';
        detectedVersion = parseInt(ua.match(/edg\/(\d+)/)?.[1]) || 0;
    } else if (ua.includes('chrome') && !ua.includes('edg')) {
        detectedBrowser = 'chrome';
        detectedVersion = parseInt(ua.match(/chrome\/(\d+)/)?.[1]) || 0;
    } else if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('edg')) {
        detectedBrowser = 'safari';
        detectedVersion = parseInt(ua.match(/version\/(\d+)/)?.[1]) || 0;
    } else if (ua.includes('firefox')) {
        detectedBrowser = 'firefox';
        detectedVersion = parseInt(ua.match(/firefox\/(\d+)/)?.[1]) || 0;
    } else if (ua.includes('opera') || ua.includes('opr')) {
        detectedBrowser = 'opera';
        detectedVersion = parseInt(ua.match(/(?:opera|opr)\/(\d+)/)?.[1]) || 0;
    }

    const verificationResults = verifyBrowser(detectedBrowser, detectedVersion);

    if (verificationResults.trusted) {
        CUIEnvironment.browser = detectedBrowser;
        CUIEnvironment.browserVersion = detectedVersion;
        CUIEnvironment.verified.browser = true;
    } else {
        CUIEnvironment.browser = verificationResults.inferredBrowser;
        CUIEnvironment.browserVersion = verificationResults.inferredVersion;
        CUIEnvironment.verified.browser = false;
        CUIEnvironment.verified.isFake = true;
    }

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

    const platformVerified = verifyPlatform(detectedPlatform);
    CUIEnvironment.platform = detectedPlatform;
    CUIEnvironment.verified.platform = platformVerified;

    CUIEnvironment.features.nativeInputIcons = checkNativeInputIcons();
    CUIEnvironment.features.viewTransitions = typeof document.startViewTransition === 'function';
    CUIEnvironment.features.containerQueries = CSS.supports('container-type: inline-size');
})();

function verifyBrowser(browser, version) {
    const result = {
        trusted: true,
        inferredBrowser: browser,
        inferredVersion: version
    };

    if (browser === 'chrome') {
        const hasChromeFeatures = window.chrome && typeof window.chrome.runtime !== 'undefined';
        if (!hasChromeFeatures) {
            result.trusted = false;
            result.inferredBrowser = CSS.supports('-webkit-appearance: none') ? 'safari' : 'unknown';
        }
    }

    if (browser === 'safari') {
        const isWebKit = navigator.vendor === 'Apple Computer, Inc.';
        if (!isWebKit) {
            result.trusted = false;
            result.inferredBrowser = 'chrome';
        }
    }

    if (browser === 'firefox') {
        const hasFirefoxFeatures = typeof InstallTrigger !== 'undefined';
        if (!hasFirefoxFeatures) {
            result.trusted = false;
            result.inferredBrowser = 'unknown';
        }
    }

    return result;
}

function verifyPlatform(platform) {
    if (platform === 'mac') {
        return navigator.vendor === 'Apple Computer, Inc.';
    }
    if (platform === 'windows') {
        return navigator.platform.includes('Win');
    }
    if (platform === 'ios') {
        return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) && navigator.maxTouchPoints > 1;
    }
    return true;
}

function checkNativeInputIcons() {
    try {
        const input = document.createElement('input');
        input.type = 'date';
        return !!window.getComputedStyle(input, '::-webkit-calendar-picker-indicator').content;
    } catch {
        return false;
    }
}

window.CUI = window.CUI || {};
window.CUI.env = CUIEnvironment;

export { CUIEnvironment };