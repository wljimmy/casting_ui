/* 
 * Casting UI Framework
 * Version: 0.2.0
 * Module: color-picker.js
 * Description: 颜色选择器模块，支持多种颜色格式
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

// 颜色选择器类
class ColorPicker extends PopupBase {
    constructor() {
        super();
    }

    init() {
        // 初始化颜色选择器
    }

    // 打开颜色选择器
    open(options = {}) {
        const presetColors = options.presetColors || [
            '#165DFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
            '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
            '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000'
        ];
        const format = options.format || 'hex'; // hex, rgb, rgba

        return super.open({ ...options, presetColors, format });
    }

    // 模板方法实现
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
        return '.color-picker-header';
    }

    getCloseReason() {
        return 'Color picker closed';
    }

    getToggleReason() {
        return 'Color picker toggled';
    }

    // 创建颜色选择器容器
    createContainer(options = {}) {
        const { presetColors, format, resolve, reject, overlay } = options;

        const container = document.createElement('div');
        container.className = 'color-picker-container';
        container.style.cssText = `
            width: 90vw;
            max-width: 500px;
            max-height: 70vh;
            background: var(--bg-color);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        // 创建头部
        const header = document.createElement('div');
        header.className = 'color-picker-header';
        header.style.cssText = `
            padding: var(--size-lg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            background: var(--bg-color);
            z-index: 10;
        `;

        const title = document.createElement('h3');
        title.textContent = '颜色选择器';
        title.style.cssText = `
            margin: 0;
            color: var(--text-primary);
        `;

        const closeButton = document.createElement('button');
        closeButton.className = 'color-picker-close';
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-light);
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-sm);
            transition: all var(--transition-normal);
        `;

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.backgroundColor = 'var(--gray-100)';
            closeButton.style.color = 'var(--text-primary)';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.color = 'var(--text-light)';
        });

        closeButton.addEventListener('click', () => {
            if (overlay) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    hideOverlay('color-picker-overlay');
                    reject('Color picker closed');
                }, 300);
            } else {
                const inlinePicker = closeButton.closest('.color-picker-inline');
                if (inlinePicker) {
                    inlinePicker.style.display = 'none';
                    reject('Color picker closed');
                }
            }
        });

        header.appendChild(title);
        header.appendChild(closeButton);
        container.appendChild(header);

        // 创建内容区域
        const content = document.createElement('div');
        content.className = 'color-picker-content';
        content.style.cssText = `
            padding: var(--size-lg);
            overflow-y: auto;
            flex: 1;
        `;

        // 创建颜色预览
        const colorPreview = document.createElement('div');
        colorPreview.className = 'color-preview-section';
        colorPreview.style.cssText = `
            margin-bottom: var(--size-lg);
        `;

        const previewTitle = document.createElement('h4');
        previewTitle.textContent = '颜色预览';
        previewTitle.style.cssText = `
            margin: 0 0 var(--size-sm) 0;
            color: var(--text-primary);
            font-size: 14px;
        `;

        const previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container';
        previewContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: var(--size-sm);
        `;

        const initialColor = options.initialColor || '#165DFF';
        
        const colorDisplay = document.createElement('div');
        colorDisplay.className = 'color-display';
        colorDisplay.style.cssText = `
            width: 60px;
            height: 60px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            background-color: ${initialColor};
        `;

        const colorInfo = document.createElement('div');
        colorInfo.className = 'color-info';
        colorInfo.style.cssText = `
            flex: 1;
        `;

        const colorValue = document.createElement('div');
        colorValue.className = 'color-value';
        colorValue.style.cssText = `
            font-family: monospace;
            padding: var(--size-xs);
            background: var(--gray-100);
            border-radius: var(--radius-sm);
            margin-bottom: var(--size-xs);
            font-size: 12px;
        `;
        colorValue.textContent = initialColor;

        const formatSelector = document.createElement('div');
        formatSelector.className = 'format-selector';
        formatSelector.style.cssText = `
            display: flex;
            gap: var(--size-xs);
        `;

        const formatOptions = ['hex', 'rgb', 'rgba'];
        formatOptions.forEach(fmt => {
            const formatOption = document.createElement('button');
            formatOption.className = `format-option ${fmt === format ? 'active' : ''}`;
            formatOption.textContent = fmt.toUpperCase();
            formatOption.style.cssText = `
                padding: 2px 8px;
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                background: ${fmt === format ? 'var(--primary-color)' : 'var(--bg-color)'};
                color: ${fmt === format ? 'white' : 'var(--text-primary)'};
                cursor: pointer;
                font-size: 10px;
            `;

            formatOption.addEventListener('click', () => {
                // 更新激活状态
                document.querySelectorAll('.format-option').forEach(opt => {
                    opt.style.background = 'var(--bg-color)';
                    opt.style.color = 'var(--text-primary)';
                });
                formatOption.style.background = 'var(--primary-color)';
                formatOption.style.color = 'white';

                // 更新格式并重新显示颜色值
                const currentColor = colorDisplay.style.backgroundColor;
                const newFormat = fmt;
                const formattedColor = this.formatColor(currentColor, newFormat);
                colorValue.textContent = formattedColor;
            });

            formatSelector.appendChild(formatOption);
        });

        colorInfo.appendChild(colorValue);
        colorInfo.appendChild(formatSelector);
        previewContainer.appendChild(colorDisplay);
        previewContainer.appendChild(colorInfo);
        colorPreview.appendChild(previewTitle);
        colorPreview.appendChild(previewContainer);

        // 创建预设颜色
        const presetColorsSection = document.createElement('div');
        presetColorsSection.className = 'preset-colors-section';
        presetColorsSection.style.cssText = `
            margin-bottom: var(--size-lg);
        `;

        const presetTitle = document.createElement('h4');
        presetTitle.textContent = '预设颜色';
        presetTitle.style.cssText = `
            margin: 0 0 var(--size-sm) 0;
            color: var(--text-primary);
            font-size: 14px;
        `;

        const presetGrid = document.createElement('div');
        presetGrid.className = 'preset-grid';
        presetGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
            gap: var(--size-xs);
        `;

        presetColors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.cssText = `
                width: 100%;
                aspect-ratio: 1;
                border-radius: var(--radius-sm);
                background-color: ${color};
                border: 1px solid transparent;
                cursor: pointer;
                transition: all var(--transition-normal);
            `;

            colorBox.addEventListener('mouseenter', () => {
                colorBox.style.transform = 'scale(1.1)';
                colorBox.style.boxShadow = 'var(--shadow-md)';
            });

            colorBox.addEventListener('mouseleave', () => {
                colorBox.style.transform = 'scale(1)';
                colorBox.style.boxShadow = 'none';
            });

            colorBox.addEventListener('click', () => {
                colorDisplay.style.backgroundColor = color;
                const formattedColor = this.formatColor(color, format);
                colorValue.textContent = formattedColor;
            });

            presetGrid.appendChild(colorBox);
        });

        presetColorsSection.appendChild(presetTitle);
        presetColorsSection.appendChild(presetGrid);

        // 创建标准色盘
        const colorWheelSection = document.createElement('div');
        colorWheelSection.className = 'color-wheel-section';
        colorWheelSection.style.cssText = `
            margin-bottom: var(--size-xl);
        `;

        const wheelTitle = document.createElement('h4');
        wheelTitle.textContent = '标准色盘';
        wheelTitle.style.cssText = `
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;

        const colorWheel = document.createElement('div');
        colorWheel.className = 'color-wheel';
        colorWheel.style.cssText = `
            width: 100%;
            height: 200px;
            border-radius: var(--radius-md);
            background: linear-gradient(to right, red, yellow, lime, aqua, blue, magenta, red);
            position: relative;
            cursor: crosshair;
            margin-bottom: var(--size-md);
        `;

        // 添加亮度滑块
        const brightnessSlider = document.createElement('input');
        brightnessSlider.type = 'range';
        brightnessSlider.min = '0';
        brightnessSlider.max = '100';
        brightnessSlider.value = '100';
        brightnessSlider.className = 'brightness-slider';
        brightnessSlider.style.cssText = `
            width: 100%;
            height: 6px;
            border-radius: var(--radius-full);
            background: linear-gradient(to right, black, white);
            outline: none;
            -webkit-appearance: none;
        `;

        brightnessSlider.addEventListener('input', () => {
            const brightness = brightnessSlider.value;
            colorWheel.style.filter = `brightness(${brightness}%)`;
        });

        colorWheel.addEventListener('click', (e) => {
            const rect = colorWheel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 创建临时 canvas 来获取点击位置的颜色
            const canvas = document.createElement('canvas');
            canvas.width = rect.width;
            canvas.height = rect.height;
            const ctx = canvas.getContext('2d');
            
            // 绘制渐变
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, 'red');
            gradient.addColorStop(1/6, 'yellow');
            gradient.addColorStop(2/6, 'lime');
            gradient.addColorStop(3/6, 'aqua');
            gradient.addColorStop(4/6, 'blue');
            gradient.addColorStop(5/6, 'magenta');
            gradient.addColorStop(1, 'red');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 获取点击位置的颜色
            const imageData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b] = imageData.data;
            const color = `rgb(${r}, ${g}, ${b})`;
            
            colorDisplay.style.backgroundColor = color;
            const formattedColor = this.formatColor(color, format);
            colorValue.textContent = formattedColor;
        });

        colorWheelSection.appendChild(wheelTitle);
        colorWheelSection.appendChild(colorWheel);
        colorWheelSection.appendChild(brightnessSlider);

        // 创建颜色输入
        const colorInputSection = document.createElement('div');
        colorInputSection.className = 'color-input-section';
        colorInputSection.style.cssText = `
            margin-bottom: var(--size-xl);
        `;

        const inputTitle = document.createElement('h4');
        inputTitle.textContent = '手动输入';
        inputTitle.style.cssText = `
            margin: 0 0 var(--size-md) 0;
            color: var(--text-primary);
        `;

        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        inputContainer.style.cssText = `
            display: flex;
            gap: var(--size-sm);
        `;

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'color-input';
        colorInput.style.cssText = `
            width: 50px;
            height: 32px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            cursor: pointer;
        `;
        colorInput.value = initialColor;

        colorInput.addEventListener('change', () => {
            const color = colorInput.value;
            colorDisplay.style.backgroundColor = color;
            const formattedColor = this.formatColor(color, format);
            colorValue.textContent = formattedColor;
        });

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'text-input';
        textInput.style.cssText = `
            flex: 1;
            padding: var(--size-xs) var(--size-sm);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            font-family: monospace;
            font-size: 12px;
        `;
        textInput.value = initialColor;

        textInput.addEventListener('input', () => {
            const color = textInput.value;
            try {
                colorDisplay.style.backgroundColor = color;
            } catch (e) {
                // 忽略无效颜色
            }
        });

        inputContainer.appendChild(colorInput);
        inputContainer.appendChild(textInput);
        colorInputSection.appendChild(inputTitle);
        colorInputSection.appendChild(inputContainer);

        // 创建按钮区域
        const buttonSection = document.createElement('div');
        buttonSection.className = 'button-section';
        buttonSection.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: var(--size-sm);
            padding-top: var(--size-sm);
            border-top: 1px solid var(--border-color);
        `;

        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-default';
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: var(--size-xs) var(--size-sm);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            background: var(--bg-color);
            color: var(--text-primary);
            cursor: pointer;
            transition: all var(--transition-normal);
            font-size: 12px;
        `;

        cancelButton.addEventListener('click', () => {
            if (overlay) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    hideOverlay('color-picker-overlay');
                    reject('Color picker cancelled');
                }, 300);
            } else {
                const inlinePicker = cancelButton.closest('.color-picker-inline');
                if (inlinePicker) {
                    inlinePicker.style.display = 'none';
                    reject('Color picker cancelled');
                }
            }
        });

        const confirmButton = document.createElement('button');
        confirmButton.className = 'btn btn-primary';
        confirmButton.textContent = '确认';
        confirmButton.style.cssText = `
            padding: var(--size-xs) var(--size-sm);
            border: none;
            border-radius: var(--radius-sm);
            background: var(--primary-color);
            color: white;
            cursor: pointer;
            transition: all var(--transition-normal);
            font-size: 12px;
        `;

        confirmButton.addEventListener('click', () => {
            const color = colorDisplay.style.backgroundColor;
            const formattedColor = this.formatColor(color, format);
            
            if (overlay) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    hideOverlay('color-picker-overlay');
                    resolve(formattedColor);
                }, 300);
            } else {
                const inlinePicker = confirmButton.closest('.color-picker-inline');
                if (inlinePicker) {
                    inlinePicker.style.display = 'none';
                    resolve(formattedColor);
                }
            }
        });

        buttonSection.appendChild(cancelButton);
        buttonSection.appendChild(confirmButton);

        content.appendChild(colorPreview);
        content.appendChild(colorWheelSection);
        content.appendChild(presetColorsSection);
        content.appendChild(colorInputSection);
        content.appendChild(buttonSection);
        container.appendChild(content);

        return container;
    }

    // 格式化颜色
    formatColor(color, format) {
        try {
            if (format === 'hex') {
                // 如果是rgb或rgba格式，转换为hex
                if (color.startsWith('rgb')) {
                    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\s*(,\s*([\d.]+))?\)/);
                    if (rgbMatch) {
                        const r = parseInt(rgbMatch[1]);
                        const g = parseInt(rgbMatch[2]);
                        const b = parseInt(rgbMatch[3]);
                        const a = rgbMatch[5] ? parseFloat(rgbMatch[5]) : 1;
                        
                        if (a === 1) {
                            return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                        } else {
                            return `rgba(${r}, ${g}, ${b}, ${a})`;
                        }
                    }
                }
                return color.toUpperCase();
            } else if (format === 'rgb') {
                // 如果是hex格式，转换为rgb
                if (color.startsWith('#')) {
                    const hex = color.replace('#', '');
                    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
                    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
                    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
                    return `rgb(${r}, ${g}, ${b})`;
                } else if (color.startsWith('rgba')) {
                    return color.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)$/, ')');
                }
                return color;
            } else if (format === 'rgba') {
                // 如果是hex格式，转换为rgba
                if (color.startsWith('#')) {
                    const hex = color.replace('#', '');
                    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
                    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
                    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
                    return `rgba(${r}, ${g}, ${b}, 1)`;
                } else if (color.startsWith('rgb')) {
                    return color.replace('rgb', 'rgba').replace(')', ', 1)');
                }
                return color;
            }
            return color;
        } catch (error) {
            return color;
        }
    }
}

// 导出打开颜色选择器的函数
function openColorPicker(options = {}) {
    return new Promise((resolve, reject) => {
        const colorPicker = new ColorPicker();
        colorPicker.open({ ...options, resolve, reject });
    });
}