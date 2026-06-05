/*
 * Casting UI Framework
 * Module: idcard-validator.js
 * Description: 身份证高级验证模块，支持分段解析、校验码验证、实时状态更新
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

/**
 * @dependency: location-data
 * 
 * CUI.idcardValidator 模块
 * 触发条件：data-validate="idcard-adv"
 * 
 * 功能：
 *   1. 身份证号码分段解析（省/市/区/生日/性别）
 *   2. 校验码验证（ISO 7064 MOD 11-2）
 *   3. 状态挂靠到注册表（node.idcard）
 *   4. 实时解析（逐位解析）
 *   5. 调用 location-data 模块获取行政区划名称
 */

// 校验码加权因子
const IDCARD_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const IDCARD_CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

const CUIIdCardValidator = {
    _dataReady: false,
    
    /**
     * 等待数据加载完成
     * @returns {Promise<boolean>}
     */
    waitForData() {
        if (this._dataReady) return Promise.resolve(true);
        
        if (!window.CUI || !window.CUI.locationData) {
            return Promise.resolve(false);
        }
        
        // 如果数据已加载
        if (window.CUI.locationData._loaded) {
            this._dataReady = true;
            return Promise.resolve(true);
        }
        
        // 如果正在加载，等待完成
        if (window.CUI.locationData._loading) {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (window.CUI.locationData._loaded) {
                        clearInterval(checkInterval);
                        this._dataReady = true;
                        resolve(true);
                    }
                }, 50);
            });
        }
        
        // 如果数据未加载，触发加载
        return window.CUI.locationData.load().then(() => {
            this._dataReady = true;
            return true;
        });
    },

    /**
     * 解析身份证号码
     * @param {string} value - 身份证号码（已清理）
     * @returns {Promise<Object>} 解析状态对象
     */
    parse(value) {
        const self = this;
        
        // 等待数据加载
        return this.waitForData().then(function() {
            // 清理输入（只保留数字和X/x）
            const cleanValue = value.replace(/[^0-9Xx]/g, '');
            const len = cleanValue.length;
            
            // 初始化状态
            const state = {
                status: 'parsing',
                phase: 0,
                province: { code: '', name: '', valid: null },
                city: { code: '', name: '', valid: null },
                district: { code: '', name: '', valid: null },
                birth: { date: '', year: '', month: '', day: '', age: 0, valid: null },
                gender: '',
                checksumValid: null,
                isValid: false,
                displayText: '',
                error: ''
            };
            
            // 空值
            if (len === 0) {
                state.status = 'waiting';
                return state;
            }
            
            // 位数过多
            if (len > 18) {
                state.status = 'error';
                state.error = '身份证号位数不正确';
                return state;
            }
        
        // 阶段1：省级代码（2位）
        if (len >= 2) {
            state.phase = 1;
            const provinceCode = cleanValue.substring(0, 2);
            state.province.code = provinceCode;
            
            // 尝试获取省份名称
            if (window.CUI && window.CUI.locationData && window.CUI.locationData._loaded) {
                const province = window.CUI.locationData.getProvince(provinceCode);
                if (province) {
                    state.province.name = province.name;
                    state.province.valid = true;
                } else {
                    state.province.name = `省码${provinceCode}`;
                    state.province.valid = false;
                    state.status = 'error';
                    state.error = '省级代码无效';
                    return state;
                }
            } else {
                // 数据未加载，使用代码显示（不标记错误）
                state.province.name = `省码${provinceCode}`;
                state.province.valid = null;
            }
        }
        
        // 阶段2：地级代码（4位）
        if (len >= 4) {
            state.phase = 2;
            const cityCode = cleanValue.substring(0, 4);
            state.city.code = cityCode;
            
            if (window.CUI && window.CUI.locationData && window.CUI.locationData._loaded) {
                const city = window.CUI.locationData.getCity(cityCode);
                if (city) {
                    state.city.name = city.name;
                    state.city.valid = true;
                } else {
                    // 直辖市没有市级，使用省级名称作为市级显示
                    state.city.name = state.province.name;
                    state.city.valid = true;
                }
            } else {
                state.city.name = `市码${cityCode}`;
                state.city.valid = null;
            }
        }
        
        // 阶段3：县级代码（6位）
        if (len >= 6) {
            state.phase = 3;
            const districtCode = cleanValue.substring(0, 6);
            state.district.code = districtCode;
            
            if (window.CUI && window.CUI.locationData && window.CUI.locationData._loaded) {
                const district = window.CUI.locationData.getDistrict(districtCode);
                if (district) {
                    state.district.name = district.name;
                    state.district.valid = true;
                } else {
                    state.district.name = `区码${districtCode}`;
                    state.district.valid = false;
                    state.status = 'error';
                    state.error = '区级代码无效';
                    return state;
                }
            } else {
                state.district.name = `区码${districtCode}`;
                state.district.valid = null;
            }
        }
        
        // 阶段4：出生日期（8位）
        if (len >= 14) {
            state.phase = 4;
            const year = cleanValue.substring(6, 10);
            const month = cleanValue.substring(10, 12);
            const day = cleanValue.substring(12, 14);
            
            state.birth.year = year;
            state.birth.month = month;
            state.birth.day = day;
            
            // 验证日期有效性
            const birthDate = new Date(`${year}-${month}-${day}`);
            const isValidDate = birthDate instanceof Date && !isNaN(birthDate) &&
                birthDate.getFullYear() === parseInt(year) &&
                (birthDate.getMonth() + 1) === parseInt(month) &&
                birthDate.getDate() === parseInt(day);
            
            if (isValidDate) {
                state.birth.date = `${year}-${month}-${day}`;
                state.birth.valid = true;
                
                // 计算年龄
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                state.birth.age = age;
            } else {
                state.birth.valid = false;
                state.status = 'error';
                state.error = '出生日期无效';
                return state;
            }
        }
        
        // 阶段5：性别（17位）
        if (len >= 17) {
            state.phase = 5;
            const seqCode = cleanValue.substring(14, 17);
            const genderCode = parseInt(seqCode);
            state.gender = genderCode % 2 === 1 ? 'male' : 'female';
        }
        
        // 阶段6：完整验证（18位）
        if (len === 18) {
            state.phase = 6;
            
            // 校验码验证
            const checksumValid = self.validateChecksum(cleanValue);
            state.checksumValid = checksumValid;
            
            if (checksumValid) {
                state.status = 'valid';
                state.isValid = true;
            } else {
                state.status = 'error';
                state.error = '校验码错误';
                return state;
            }
        }
        
        // 生成显示文本
        state.displayText = self.generateDisplayText(state);
        
        return state;
        });
    },

    /**
     * 验证校验码（ISO 7064 MOD 11-2）
     * @param {string} idcard - 18位身份证号码
     * @returns {boolean} 校验码是否正确
     */
    validateChecksum(idcard) {
        if (idcard.length !== 18) return false;
        
        let sum = 0;
        for (let i = 0; i < 17; i++) {
            sum += parseInt(idcard[i]) * IDCARD_WEIGHTS[i];
        }
        
        const remainder = sum % 11;
        const expectedChecksum = IDCARD_CHECK_CODES[remainder];
        const actualChecksum = idcard[17].toUpperCase();
        
        return expectedChecksum === actualChecksum;
    },

    /**
     * 生成显示文本
     * @param {Object} state - 解析状态对象
     * @returns {string} 显示文本
     */
    generateDisplayText(state) {
        const parts = [];
        
        // 省市区（含历史数据备注）
        if (state.province.name) {
            let provinceText = state.province.name;
            if (state.province.isHistorical && state.province.mergedTo) {
                provinceText += `(已合并至${state.province.mergedTo})`;
            }
            parts.push(provinceText);
        }
        
        if (state.city.name) {
            let cityText = state.city.name;
            if (state.city.isHistorical && state.city.mergedTo) {
                cityText += `(已合并至${state.city.mergedTo})`;
            }
            parts.push(cityText);
        }
        
        if (state.district.name) {
            let districtText = state.district.name;
            if (state.district.isHistorical && state.district.mergedTo) {
                districtText += `(已合并至${state.district.mergedTo})`;
            }
            parts.push(districtText);
        }
        
        // 出生日期
        if (state.birth.date && state.birth.valid) {
            const year = state.birth.year;
            const month = state.birth.month;
            const day = state.birth.day;
            const age = state.birth.age;
            parts.push(`${year}年${month}月${day}日 ${age}岁`);
        }
        
        // 性别
        if (state.gender) {
            parts.push(state.gender === 'male' ? '男性' : '女性');
        }
        
        return parts.join(' ');
    },

    /**
     * 初始化身份证高级验证
     */
    init() {
        if (window.__CUI_IDCARD_VALIDATOR_INITIALIZED__) return;
        window.__CUI_IDCARD_VALIDATOR_INITIALIZED__ = true;
        
        // 先扫描现有的 idcard-adv 元素，设置默认提示/错误信息
        const existingWrappers = document.querySelectorAll('.CUI-input-box[data-validate="idcard-adv"]');
        existingWrappers.forEach(wrapper => {
            this._setupDefaultMessages(wrapper);
        });
        
        // 使用 DOMObserver 监听新添加的 idcard-adv 元素
        if (window.CUI && window.CUI.CastingDOMObserver) {
            window.CUI.CastingDOMObserver.addSelector('.CUI-input-box[data-validate="idcard-adv"]', (wrapper) => {
                this._setupDefaultMessages(wrapper);
            });
        }
        
        // 监听 input 事件（实时解析）
        document.addEventListener('input', (e) => {
            const target = e.target;
            if (!target.matches('input')) return;
            
            // 检查父元素 .CUI-input-box 的 data-validate 属性
            const wrapper = target.closest('.CUI-input-box');
            if (!wrapper) return;
            
            const validateType = wrapper.dataset.validate;
            if (validateType !== 'idcard-adv') return;
            
            const value = target.value;
            this.parse(value).then((state) => {
                this.updateRegistryState(target, state);
                this.updateMessageDisplay(target, state);
            });
        });
        
        // 监听 blur 事件（验证完整性）
        document.addEventListener('blur', (e) => {
            const target = e.target;
            if (!target.matches('input')) return;
            
            // 检查父元素 .CUI-input-box 的 data-validate 属性
            const wrapper = target.closest('.CUI-input-box');
            if (!wrapper) return;
            
            const validateType = wrapper.dataset.validate;
            if (validateType !== 'idcard-adv') return;
            
            const value = target.value.replace(/[^0-9Xx]/g, '');
            
            // 获取路径用于调用 API
            const form = target.closest('form');
            const parentId = form && form.id ? form.id : null;
            const path = parentId ? `${parentId}.${target.name}` : target.name;
            
            if (value.length === 18) {
                this.parse(value).then((state) => {
                    const isValid = state.isValid;
                    this.updateRegistryValid(target, isValid);
                    this.updateValidationClass(wrapper, value.length > 0, isValid);
                    
                    if (!isValid && state.error) {
                        // 使用新 API 设置错误信息
                        if (window.CUI && window.CUI.input) {
                            window.CUI.input.setError(path, state.error);
                        }
                    }
                });
            } else if (value.length > 0 && value.length < 18) {
                // 输入不完整，显示错误信息
                this.updateRegistryValid(target, false);
                this.updateValidationClass(wrapper, true, false);
                
                if (window.CUI && window.CUI.input) {
                    window.CUI.input.setError(path, '身份证号不完整，请输入18位身份证号');
                }
            } else {
                // 空值，清除错误状态
                this.updateValidationClass(wrapper, false, false);
                
                if (window.CUI && window.CUI.input) {
                    window.CUI.input.clearMessages(path);
                }
            }
        }, true);
        
        console.log('[CUIIdCardValidator] 模块初始化完成');
    },

    /**
     * 设置默认的提示和错误信息
     * @param {HTMLElement} wrapper - CUI-input-box 元素
     */
    _setupDefaultMessages(wrapper) {
        // 设置默认 Info 提示
        const infoEl = wrapper.querySelector('.CUI-input__info .CUI-message div');
        if (infoEl && !infoEl.textContent.trim()) {
            infoEl.textContent = '请输入正确的中华人民共和国18位身份证';
        }
        
        // 设置默认 Error 错误
        const errorEl = wrapper.querySelector('.CUI-input__error .CUI-message div');
        if (errorEl && !errorEl.textContent.trim()) {
            errorEl.textContent = '身份证号格式不正确';
        }
    },

    /**
     * 更新注册表状态
     * @param {HTMLElement} input - 输入框元素
     * @param {Object} state - 解析状态对象
     */
    updateRegistryState(input, state) {
        if (!window.CUI || !window.CUI.input) return;
        
        const form = input.closest('form');
        const parentId = form && form.id ? form.id : null;
        const path = parentId ? `${parentId}.${input.name}` : input.name;
        
        const node = window.CUI.input.get(path);
        if (node) {
            node.idcard = state;
            node.value = input.value;
        }
    },

    /**
     * 更新注册表 valid 状态
     * @param {HTMLElement} input - 输入框元素
     * @param {boolean} isValid - 是否有效
     */
    updateRegistryValid(input, isValid) {
        if (!window.CUI || !window.CUI.input) return;
        
        const form = input.closest('form');
        const parentId = form && form.id ? form.id : null;
        const path = parentId ? `${parentId}.${input.name}` : input.name;
        
        const node = window.CUI.input.get(path);
        if (node) {
            node.valid = isValid;
        }
    },

    /**
     * 更新验证 CSS 类
     * @param {HTMLElement} wrapper - 包装元素
     * @param {boolean} hasValue - 是否有值
     * @param {boolean} isValid - 是否有效
     */
    updateValidationClass(wrapper, hasValue, isValid) {
        if (!wrapper) return;
        
        wrapper.classList.remove('CUI-is-error', 'CUI-is-success', 'CUI-input--error', 'CUI-input--success');
        
        if (hasValue) {
            if (isValid) {
                wrapper.classList.add('CUI-is-success');
            } else {
                wrapper.classList.add('CUI-is-error');
            }
        }
    },

    /**
     * 更新消息显示
     * 使用框架标准结构：.CUI-input__info 和 .CUI-input__error
     * 注意：外观由 CSS 控制，JavaScript 只设置内容
     * @param {HTMLElement} input - 输入框元素
     * @param {Object} state - 解析状态对象
     */
    updateMessageDisplay(input, state) {
        const wrapper = input.closest('.CUI-input-box');
        if (!wrapper) return;
        
        const infoEl = wrapper.querySelector('.CUI-input__info');
        const errorEl = wrapper.querySelector('.CUI-input__error');
        
        if (state.error) {
            if (errorEl) {
                const msgEl = errorEl.querySelector('.CUI-message div');
                if (msgEl) msgEl.textContent = state.error;
            }
        } else if (state.displayText) {
            if (infoEl) {
                const msgEl = infoEl.querySelector('.CUI-message div');
                if (msgEl) msgEl.textContent = state.displayText;
            }
        } else if (state.status === 'waiting') {
            if (infoEl) {
                const msgEl = infoEl.querySelector('.CUI-message div');
                if (msgEl) msgEl.textContent = '请输入正确的中华人民共和国18位身份证';
            }
        }
    }
};

// 注册到全局
(function() {
    if (!window.CUI) window.CUI = {};
    window.CUI.idcardValidator = CUIIdCardValidator;
    
    // 如果调度器可用，在 INTERACTION 阶段初始化
    if (typeof window.CUI.registerModule === 'function') {
        window.CUI.registerModule('idcardValidator', {
            stages: {
                INTERACTION: () => {
                    CUIIdCardValidator.init();
                }
            },
            dependencies: ['input', 'locationData']
        });
    } else {
        // 独立加载时直接初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => CUIIdCardValidator.init());
        } else {
            CUIIdCardValidator.init();
        }
    }
})();

// 导出（ES6 模块）
export default CUIIdCardValidator;