/*
 * Casting UI Framework
 * Version: 0.6.0
 * Module: utils.js
 * Description: 通用工具函数集合
 */

class IdGenerator {
    constructor() {
        this.generatedIds = new Set();
        this.maxRetries = 100;
    }

    /**
     * 检查ID是否唯一
     * @param {string} id - 要检查的ID
     * @returns {boolean} 是否唯一
     */
    isIdUnique(id) {
        const existsInDom = document.getElementById(id) !== null;
        const existsInSet = this.generatedIds.has(id);
        return !existsInDom && !existsInSet;
    }

    /**
     * 生成唯一ID
     * @param {string} prefix - ID前缀，默认 'CUI-GEN'
     * @param {number} length - 随机部分长度，默认 8
     * @param {number} mode - 字符模式，默认 7
     * @returns {string} 唯一ID
     */
    generateId(prefix = 'CUI-GEN', length = 8, mode = 7) {
        let retries = 0;

        while (retries < this.maxRetries) {
            const randomPart = utils.randomString(length, mode);
            const id = `${prefix}-${randomPart}`;

            if (this.isIdUnique(id)) {
                this.generatedIds.add(id);
                return id;
            }

            retries++;
        }

        throw new Error(`生成ID失败，超过最大重试次数(${this.maxRetries})`);
    }

    /**
     * 获取所有已生成的ID
     * @returns {string[]} ID数组
     */
    getIds() {
        return Array.from(this.generatedIds);
    }

    /**
     * 清除所有记录
     */
    clearIds() {
        this.generatedIds.clear();
    }
}

export const utils = {
    // 四组字符集定义
    _charSets: {
        1: '0123456789',
        2: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        4: 'abcdefghijklmnopqrstuvwxyz',
        8: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    },

    // ID生成器实例
    _idGenerator: new IdGenerator(),

    /**
     * 生成指定长度和模式的随机字符串
     * @param {number} length - 长度，默认 8
     * @param {number} mode - 字符模式（1-15），默认 7
     * @returns {string} 随机字符串
     */
    randomString(length = 8, mode = 7) {
        // 验证参数
        if (!Number.isFinite(length) || length <= 0) {
            console.warn('[Utils] randomString: length必须是正整数，使用默认值8');
            length = 8;
        }

        if (!Number.isFinite(mode) || mode < 1 || mode > 15) {
            console.warn('[Utils] randomString: mode必须是1-15之间的整数，使用默认值7');
            mode = 7;
        }

        // 根据mode组合字符集
        let charset = '';
        if (mode & 1) charset += this._charSets[1]; // 数字
        if (mode & 2) charset += this._charSets[2]; // 大写
        if (mode & 4) charset += this._charSets[4]; // 小写
        if (mode & 8) charset += this._charSets[8]; // 符号

        // 确保至少有一个字符集
        if (charset === '') {
            console.warn('[Utils] randomString: mode无效，使用默认字符集');
            charset = this._charSets[1] + this._charSets[2] + this._charSets[4];
        }

        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            result += charset[randomIndex];
        }

        return result;
    },

    /**
     * 生成唯一ID（内部使用）
     * @param {string} prefix - ID前缀，默认 'CUI-GEN'
     * @param {number} length - 随机部分长度，默认 8
     * @param {number} mode - 字符模式，默认 7
     * @returns {string} 唯一ID
     */
    generateId(prefix = 'CUI-GEN', length = 8, mode = 7) {
        return this._idGenerator.generateId(prefix, length, mode);
    },

    /**
     * 获取所有已生成的ID（调试用）
     * @returns {string[]} ID数组
     */
    getGeneratedIds() {
        return this._idGenerator.getIds();
    },

    /**
     * 清除所有ID记录
     */
    clearGeneratedIds() {
        this._idGenerator.clearIds();
    },

    /**
     * 验证颜色值
     * @param {string} color - 颜色值
     * @returns {boolean} 是否有效
     */
    isValidColor(color) {
        if (!color || typeof color !== 'string') return false;

        const hexRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
        const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
        const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0(\.\d+)?|1(\.0+)?)\s*\)$/;

        return hexRegex.test(color) || rgbRegex.test(color) || rgbaRegex.test(color);
    },

    /**
     * 安全的JSON解析
     * @param {string} str - JSON字符串
     * @param {any} defaultValue - 默认值
     * @returns {any} 解析结果
     */
    safeJsonParse(str, defaultValue = null) {
        try {
            return JSON.parse(str);
        } catch {
            return defaultValue;
        }
    },

    /**
     * 安全的localStorage写入
     * @param {string} key - 存储键
     * @param {any} value - 存储值
     */
    safeLocalStorageSet(key, value) {
        try {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        } catch (error) {
            console.warn('[Utils] localStorage写入失败:', error);
        }
    },

    /**
     * 安全的localStorage读取
     * @param {string} key - 存储键
     * @param {any} defaultValue - 默认值
     * @returns {any} 读取结果
     */
    safeLocalStorageGet(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? this.safeJsonParse(value, value) : defaultValue;
        } catch (error) {
            console.warn('[Utils] localStorage读取失败:', error);
            return defaultValue;
        }
    },

    /**
     * 安全的localStorage删除
     * @param {string} key - 存储键
     */
    safeLocalStorageRemove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('[Utils] localStorage删除失败:', error);
        }
    },

    /**
     * 防抖函数
     * @param {Function} func - 要执行的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * 节流函数
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 限制时间（毫秒）
     * @returns {Function} 节流后的函数
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }
};

export default utils;