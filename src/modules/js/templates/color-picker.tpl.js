/* 
 * Casting UI Framework
 * Version: 0.7.0
 * Module: color-picker.tpl.js
 * 设计原则：模板仅定义结构和类名，所有样式收敛至 color-picker.css
 * ID策略：{{变量名}} 占位符，由JS生成随机ID注入
 */

export const colorPickerTemplates = {
    container: `
        {{* CUI-GEN START: color-picker-container *}}
        <div class="CUI-color-picker">
            {{{header}}}
            <div class="CUI-color-picker-content">
                {{{content}}}
            </div>
            {{{footer}}}
        </div>
        {{* CUI-GEN END: color-picker-container *}}
    `,

    header: `
        {{* CUI-GEN START: color-picker-header *}}
        <div class="CUI-color-picker-header">
            <h3>颜色选择器</h3>
            <button id="{{closeBtnId}}" class="CUI-close-btn">&times;</button>
        </div>
        {{* CUI-GEN END: color-picker-header *}}
    `,

    hueSlider: `
        {{* CUI-GEN START: color-picker-hue *}}
        <div class="CUI-color-picker-hue">
            <input type="range" min="0" max="360" value="0" class="CUI-color-picker-hue-slider">
        </div>
        {{* CUI-GEN END: color-picker-hue *}}
    `,

    saturationCanvas: `
        {{* CUI-GEN START: color-picker-saturation *}}
        <div class="CUI-color-picker-saturation">
            <canvas class="CUI-color-picker-canvas" width="320" height="200"></canvas>
            <div class="CUI-color-picker-pointer"></div>
        </div>
        {{* CUI-GEN END: color-picker-saturation *}}
    `,

    brightnessSlider: `
        {{* CUI-GEN START: color-picker-brightness *}}
        <div class="CUI-color-picker-brightness">
            <input type="range" min="0" max="100" value="100" class="CUI-color-picker-brightness-slider">
        </div>
        {{* CUI-GEN END: color-picker-brightness *}}
    `,

    presetColors: `
        {{* CUI-GEN START: color-picker-presets *}}
        <div class="CUI-color-picker-presets">
            {{{presetButtons}}}
        </div>
        {{* CUI-GEN END: color-picker-presets *}}
    `,

    colorInputs: `
        {{* CUI-GEN START: color-picker-inputs *}}
        <div class="CUI-color-picker-inputs">
            <input id="{{hexInputId}}" type="text" class="CUI-color-picker-hex-input" value="{{currentColor}}" placeholder="HEX">
            <div class="CUI-color-picker-preview" style="background: {{currentColor}};"></div>
        </div>
        <div class="CUI-color-picker-format-buttons">
            {{{formatButtons}}}
        </div>
        {{* CUI-GEN END: color-picker-inputs *}}
    `,

    footer: `
        {{* CUI-GEN START: color-picker-footer *}}
        <div class="CUI-color-picker-footer">
            <button id="{{cancelBtnId}}" class="CUI-btn CUI-btn-secondary">取消</button>
            <button id="{{confirmBtnId}}" class="CUI-btn CUI-btn-primary">确定</button>
        </div>
        {{* CUI-GEN END: color-picker-footer *}}
    `
};

export default colorPickerTemplates;
