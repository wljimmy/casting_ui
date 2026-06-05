/* 
 * Casting UI Framework
 * Version: 0.7.0
 * Module: color-picker.js
 * Description: 颜色选择器模块，使用模板引擎重构
 * ID策略：所有系统生成的ID使用 CUI-GEN- 前缀 + 随机字符串
 * Copyright (c) 2026 Bingo工作室
 * @dependency: core, overlay
 * Email: wljimmy@hotmail.com
 */

import { PopupBase, debug } from './core.js';
import { templateEngine } from './template-engine.js';
import { utils } from './utils.js';
import { commonTemplates } from './templates/common.tpl.js';
import { colorPickerTemplates } from './templates/color-picker.tpl.js';

class ColorPicker extends PopupBase {
    constructor() {
        super();
        this.currentHue = 0;
        this.currentSaturation = 100;
        this.currentLightness = 50;
        this._initTemplates();
    }

    _initTemplates() {
        templateEngine.register('popupHeader', commonTemplates.popupHeader);
        templateEngine.register('popupFooter', commonTemplates.popupFooter);
        
        templateEngine.register('colorPickerContainer', colorPickerTemplates.container);
        templateEngine.register('colorPickerHeader', colorPickerTemplates.header);
        templateEngine.register('colorPickerHueSlider', colorPickerTemplates.hueSlider);
        templateEngine.register('colorPickerSaturationCanvas', colorPickerTemplates.saturationCanvas);
        templateEngine.register('colorPickerBrightnessSlider', colorPickerTemplates.brightnessSlider);
        templateEngine.register('colorPickerPresets', colorPickerTemplates.presetColors);
        templateEngine.register('colorPickerInputs', colorPickerTemplates.colorInputs);
        templateEngine.register('colorPickerFooter', colorPickerTemplates.footer);
    }

    init() {}

    open(options = {}) {
        const presetColors = options.presetColors || [
            '#165DFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
            '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
            '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000',
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        const format = options.format || 'hex';
        const initialColor = options.initialColor || '#165DFF';

        this._parseColor(initialColor);

        return super.open({ ...options, presetColors, format, initialColor });
    }

    _parseColor(color) {
        if (color.startsWith('#')) {
            const hex = color.replace('#', '');
            const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
            const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
            const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
            const hsl = this._rgbToHsl(r, g, b);
            this.currentHue = hsl[0];
            this.currentSaturation = hsl[1];
            this.currentLightness = hsl[2];
        } else if (color.startsWith('rgb')) {
            const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\s*(,\s*([\d.]+))?\)/);
            if (match) {
                const hsl = this._rgbToHsl(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
                this.currentHue = hsl[0];
                this.currentSaturation = hsl[1];
                this.currentLightness = hsl[2];
            }
        }
    }

    _rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
                default: h = 0;
            }
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }

    _hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    _hslToHex(h, s, l) {
        const [r, g, b] = this._hslToRgb(h, s, l);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    _hslToRgbString(h, s, l) {
        const [r, g, b] = this._hslToRgb(h, s, l);
        return `rgb(${r}, ${g}, ${b})`;
    }

    _hslToRgbaString(h, s, l, alpha = 1) {
        const [r, g, b] = this._hslToRgb(h, s, l);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    getOverlayId() {
        return 'color-picker-overlay';
    }

    getInlineSelector() {
        return '.color-picker-inline';
    }

    getInlineClassName() {
        return 'color-picker-inline';
    }

    getHeaderSelector() {
        return '.CUI-popup-header';
    }

    getCloseReason() {
        return 'Color picker closed';
    }

    getToggleReason() {
        return 'Color picker toggled';
    }

    createContainer(options = {}) {
        const { presetColors, format, initialColor, resolve, reject, overlay } = options;

        const closeBtnId = utils.generateId('CUI-GEN', 8, 7);
        const hexInputId = utils.generateId('CUI-GEN', 8, 7);
        const cancelBtnId = utils.generateId('CUI-GEN', 8, 7);
        const confirmBtnId = utils.generateId('CUI-GEN', 8, 7);

        const header = templateEngine.render('colorPickerHeader', { closeBtnId });

        const hueSlider = templateEngine.render('colorPickerHueSlider');
        const saturationCanvas = templateEngine.render('colorPickerSaturationCanvas');
        const brightnessSlider = templateEngine.render('colorPickerBrightnessSlider');
        const presetButtons = presetColors.map(color => 
            `<button class="CUI-color-picker-preset" data-color="${color}"></button>`
        ).join('');
        const presets = templateEngine.render('colorPickerPresets', { presetButtons });
        
        const formatButtons = ['hex', 'rgb', 'rgba'].map(fmt => {
            const active = fmt === format;
            return `<button class="CUI-btn CUI-btn-sm ${active ? 'CUI-btn-primary' : 'CUI-btn-secondary'}" data-format="${fmt}">${fmt.toUpperCase()}</button>`;
        }).join('');
        
        const colorInputs = templateEngine.render('colorPickerInputs', {
            hexInputId,
            currentColor: initialColor,
            formatButtons
        });

        const footer = templateEngine.render('colorPickerFooter', { 
            cancelBtnId,
            confirmBtnId
        });

        const content = hueSlider + saturationCanvas + brightnessSlider + presets + colorInputs;
        
        const html = templateEngine.render('colorPickerContainer', {
            header,
            content,
            footer
        });

        const container = templateEngine.toElement(html);

        this._bindEvents(container, { ...options, closeBtnId, hexInputId, cancelBtnId, confirmBtnId });
        this._initCanvas(container);

        return container;
    }

    _initCanvas(container) {
        const canvas = container.querySelector('.CUI-color-picker-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const w = parseInt(canvas.getAttribute('width')) || 320;
        const h = parseInt(canvas.getAttribute('height')) || 200;

        this._drawSaturationCanvas(ctx, w, h);
    }

    _drawSaturationCanvas(ctx, width, height) {
        if (!ctx) return;

        const hueColor = this._hslToRgbString(this.currentHue, 100, 50);

        const satGradient = ctx.createLinearGradient(0, 0, width, 0);
        satGradient.addColorStop(0, 'hsl(0, 0%, 100%)');
        satGradient.addColorStop(1, hueColor);
        ctx.fillStyle = satGradient;
        ctx.fillRect(0, 0, width, height);

        const lightGradient = ctx.createLinearGradient(0, 0, 0, height);
        lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        lightGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.fillStyle = lightGradient;
        ctx.fillRect(0, 0, width, height);
    }

    _updatePointer(container) {
        const pointer = container.querySelector('.CUI-color-picker-pointer');
        const canvas = container.querySelector('.CUI-color-picker-canvas');
        if (!pointer || !canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (this.currentSaturation / 100) * rect.width;
        const y = ((100 - this.currentLightness) / 100) * rect.height;

        pointer.style.left = `${x}px`;
        pointer.style.top = `${y}px`;
    }

    _updatePreview(container) {
        const preview = container.querySelector('.CUI-color-picker-preview');
        const hexInput = container.querySelector('.CUI-color-picker-hex-input');
        if (!preview || !hexInput) return;

        const hex = this._hslToHex(this.currentHue, this.currentSaturation, this.currentLightness);
        preview.style.background = hex;
        hexInput.value = hex;
    }

    _bindEvents(container, options) {
        const { presetColors, format, resolve, reject, overlay, closeBtnId, hexInputId, cancelBtnId, confirmBtnId } = options;

        const closeBtn = container.querySelector(`#${closeBtnId}`);
        closeBtn?.addEventListener('click', () => {
            this._closePicker(overlay, reject, 'Color picker closed');
        });

        const hueSlider = container.querySelector('.CUI-color-picker-hue-slider');
        hueSlider?.addEventListener('input', (e) => {
            this.currentHue = parseInt(e.target.value);
            const canvas = container.querySelector('.CUI-color-picker-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                this._drawSaturationCanvas(ctx, canvas.width, canvas.height);
            }
            this._updatePreview(container);
        });

        const canvas = container.querySelector('.CUI-color-picker-canvas');
        canvas?.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.currentSaturation = Math.round((x / rect.width) * 100);
            this.currentLightness = Math.round(100 - (y / rect.height) * 100);

            this._updatePointer(container);
            this._updatePreview(container);
        });

        const brightnessSlider = container.querySelector('.CUI-color-picker-brightness-slider');
        brightnessSlider?.addEventListener('input', (e) => {
            this.currentLightness = parseInt(e.target.value);
            this._updatePointer(container);
            this._updatePreview(container);
        });

        container.querySelectorAll('.CUI-color-picker-preset').forEach(btn => {
            btn.style.backgroundColor = btn.dataset.color;
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                this._parseColor(color);
                const canvasEl = container.querySelector('.CUI-color-picker-canvas');
                if (canvasEl) {
                    const ctx = canvasEl.getContext('2d');
                    this._drawSaturationCanvas(ctx, canvasEl.width, canvasEl.height);
                }
                this._updatePointer(container);
                this._updatePreview(container);
            });
        });

        container.querySelectorAll('.CUI-btn[data-format]').forEach(btn => {
            btn.addEventListener('click', () => {
                const newFormat = btn.dataset.format;
                const hexInput = container.querySelector(`#${hexInputId}`);
                if (!hexInput) return;

                const currentHex = hexInput.value;
                let formattedValue = currentHex;

                if (newFormat === 'rgb') {
                    const [r, g, b] = this._hslToRgb(this.currentHue, this.currentSaturation, this.currentLightness);
                    formattedValue = `rgb(${r}, ${g}, ${b})`;
                } else if (newFormat === 'rgba') {
                    const [r, g, b] = this._hslToRgb(this.currentHue, this.currentSaturation, this.currentLightness);
                    formattedValue = `rgba(${r}, ${g}, ${b}, 1)`;
                }

                hexInput.value = formattedValue;
            });
        });

        const cancelBtn = container.querySelector(`#${cancelBtnId}`);
        cancelBtn?.addEventListener('click', () => {
            this._closePicker(overlay, reject, 'Color picker closed');
        });

        const confirmBtn = container.querySelector(`#${confirmBtnId}`);
        confirmBtn?.addEventListener('click', () => {
            const hexInput = container.querySelector(`#${hexInputId}`);
            const selectedColor = hexInput?.value || this._hslToHex(this.currentHue, this.currentSaturation, this.currentLightness);
            
            this._closePicker(overlay, null, null);
            if (resolve) resolve(selectedColor);
        });
    }

    _closePicker(overlay, reject, reason) {
        if (overlay) {
            this.close();
            if (reject && reason) reject(reason);
        }
    }
}

const colorPicker = new ColorPicker();

async function openColorPicker(options = {}) {
    return colorPicker.open(options);
}

export { colorPicker, openColorPicker, ColorPicker };
export default colorPicker;

// 保证命名空间完整
if (!window.CUI) {
    window.CUI = {};
}

// 注册到全局生命周期调度器，声明对 core, overlay 的强依赖关系
window.CUI.registerModule('colorPicker', {
    dependencies: ['core', 'overlay'],
    stages: {
        CORE: () => {
            window.CUI.colorPicker = colorPicker;
            window.CUI.openColorPicker = openColorPicker;
        }
    }
});
