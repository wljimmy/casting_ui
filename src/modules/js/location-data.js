/*
 * Casting UI Framework
 * Module: location-data.js
 * Description: 行政区划数据基础模块，管理数据加载、版本管理、查询接口
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

/**
 * @dependency: 无（独立基础模块）
 * 
 * CUI.locationData 模块
 * 功能：
 *   1. 异步加载行政区划数据（JSON）
 *   2. 加载历史行政区划数据（已撤销但仍有有效身份证的代码）
 *   3. 数据版本管理（日期版本号）
 *   4. 提供查询接口（按代码查省/市/区名称）
 *   5. 容错处理（加载失败时返回代码而非名称）
 *   6. 全局状态维护（是否已加载、版本号）
 */

const CUILocationData = {
    // 状态
    _loaded: false,
    _loading: false,
    _version: null,
    _data: null,
    _historicalData: null,
    _error: null,
    
    // 索引（O(1) 查找）
    _index: {
        province: new Map(),   // 2位代码 -> 省份信息
        city: new Map(),       // 4位代码 -> 城市信息
        district: new Map()    // 6位代码 -> 区县信息
    },
    
    // 历史数据索引
    _historicalIndex: {
        province: new Map(),   // 2位代码 -> 历史省份信息
        city: new Map(),       // 4位代码 -> 历史城市信息
        district: new Map()    // 6位代码 -> 历史区县信息
    },
    
    // 数据路径
    _dataPath: '/location/administrative_divisions.json',
    _versionPath: '/location/version.json',
    _historicalPath: '/location/historical_divisions.json',

    /**
     * 获取当前状态
     * @returns {Object} 状态对象
     */
    getStatus() {
        return {
            loaded: this._loaded,
            loading: this._loading,
            version: this._version,
            error: this._error,
            hasHistorical: this._historicalData !== null
        };
    },

    /**
     * 加载行政区划数据
     * @returns {Promise<boolean>} 是否加载成功
     */
    async load() {
        if (this._loaded || this._loading) {
            return this._loaded;
        }
        
        this._loading = true;
        this._error = null;
        
        try {
            // 并行加载版本号、数据和历史数据
            const [versionRes, dataRes, historicalRes] = await Promise.all([
                fetch(this._versionPath),
                fetch(this._dataPath),
                fetch(this._historicalPath)
            ]);
            
            if (!versionRes.ok || !dataRes.ok) {
                throw new Error('数据文件加载失败');
            }
            
            const versionData = await versionRes.json();
            const divisionData = await dataRes.json();
            
            // 历史数据加载失败不影响主功能
            let historicalData = null;
            if (historicalRes.ok) {
                try {
                    historicalData = await historicalRes.json();
                } catch (e) {
                    console.warn('[CUILocationData] 历史数据解析失败，将忽略');
                }
            }
            
            this._version = versionData.version || null;
            this._data = divisionData;
            this._historicalData = historicalData;
            
            // 构建索引
            this._buildIndex();
            this._buildHistoricalIndex();
            
            this._loaded = true;
            this._loading = false;
            
            console.log(`[CUILocationData] 数据加载成功，版本: ${this._version}，历史数据: ${this._historicalData ? '已加载' : '未加载'}`);
            return true;
            
        } catch (error) {
            this._loading = false;
            this._error = error.message;
            console.warn(`[CUILocationData] 数据加载失败: ${error.message}`);
            return false;
        }
    },

    /**
     * 构建索引（O(1) 查找）
     */
    _buildIndex() {
        if (!this._data) return;
        
        this._data.forEach(item => {
            const code = item.code;
            const level = item.level;
            
            if (level === 1) {
                // 省级：取前2位
                this._index.province.set(code.substring(0, 2), item);
            } else if (level === 2) {
                // 地级：取前4位
                this._index.city.set(code.substring(0, 4), item);
            } else if (level === 3) {
                // 县级：取前6位
                this._index.district.set(code.substring(0, 6), item);
            }
        });
        
        console.log(`[CUILocationData] 索引构建完成: 省 ${this._index.province.size} / 市 ${this._index.city.size} / 区 ${this._index.district.size}`);
    },

    /**
     * 构建历史数据索引
     */
    _buildHistoricalIndex() {
        if (!this._historicalData || !this._historicalData.data) return;
        
        this._historicalData.data.forEach(item => {
            const code = item.code;
            const level = item.level;
            
            if (level === 1) {
                // 省级：取前2位
                this._historicalIndex.province.set(code.substring(0, 2), item);
            } else if (level === 2) {
                // 地级：取前4位
                this._historicalIndex.city.set(code.substring(0, 4), item);
            } else if (level === 3) {
                // 县级：取前6位
                this._historicalIndex.district.set(code.substring(0, 6), item);
            }
            
            // 处理子级数据
            if (item.children && item.children.length > 0) {
                item.children.forEach(child => {
                    const childCode = child.code;
                    const childLevel = child.level;
                    
                    if (childLevel === 3) {
                        this._historicalIndex.district.set(childCode.substring(0, 6), child);
                    }
                });
            }
        });
        
        console.log(`[CUILocationData] 历史索引构建完成: 省 ${this._historicalIndex.province.size} / 市 ${this._historicalIndex.city.size} / 区 ${this._historicalIndex.district.size}`);
    },

    /**
     * 查询省份信息（含历史数据）
     * @param {string} code - 2位省级代码
     * @returns {Object|null} 省份信息 { code, name, isHistorical } 或 null
     */
    getProvince(code) {
        if (!this._loaded) return null;
        
        // 先查当前数据
        const current = this._index.province.get(code);
        if (current) {
            return { code: current.code, name: current.name, isHistorical: false };
        }
        
        // 再查历史数据
        const historical = this._historicalIndex.province.get(code);
        if (historical) {
            return {
                code: historical.code,
                name: historical.name,
                isHistorical: true,
                status: historical.status,
                mergedTo: historical.mergedTo,
                year: historical.year
            };
        }
        
        return null;
    },

    /**
     * 查询城市信息（含历史数据）
     * @param {string} code - 4位城市代码
     * @returns {Object|null} 城市信息 { code, name, isHistorical } 或 null
     */
    getCity(code) {
        if (!this._loaded) return null;
        
        // 先查当前数据
        const current = this._index.city.get(code);
        if (current) {
            return { code: current.code, name: current.name, isHistorical: false };
        }
        
        // 再查历史数据
        const historical = this._historicalIndex.city.get(code);
        if (historical) {
            return {
                code: historical.code,
                name: historical.name,
                isHistorical: true,
                status: historical.status,
                mergedTo: historical.mergedTo,
                year: historical.year
            };
        }
        
        return null;
    },

    /**
     * 查询区县信息（含历史数据）
     * @param {string} code - 6位区县代码
     * @returns {Object|null} 区县信息 { code, name, isHistorical } 或 null
     */
    getDistrict(code) {
        if (!this._loaded) return null;
        
        // 先查当前数据
        const current = this._index.district.get(code);
        if (current) {
            return { code: current.code, name: current.name, isHistorical: false };
        }
        
        // 再查历史数据
        const historical = this._historicalIndex.district.get(code);
        if (historical) {
            return {
                code: historical.code,
                name: historical.name,
                isHistorical: true,
                status: historical.status,
                mergedTo: historical.mergedTo,
                year: historical.year
            };
        }
        
        return null;
    },

    /**
     * 查询完整行政区划信息（省+市+区，含历史数据）
     * @param {string} code - 6位行政区划代码
     * @returns {Object} 行政区划信息
     */
    getFullDivision(code) {
        const provinceCode = code.substring(0, 2);
        const cityCode = code.substring(0, 4);
        const districtCode = code.substring(0, 6);
        
        const province = this.getProvince(provinceCode);
        const city = this.getCity(cityCode);
        const district = this.getDistrict(districtCode);
        
        return {
            province: province || { code: provinceCode, name: `省码${provinceCode}`, isHistorical: false },
            city: city || { code: cityCode, name: `市码${cityCode}`, isHistorical: false },
            district: district || { code: districtCode, name: `区码${districtCode}`, isHistorical: false }
        };
    },

    /**
     * 检查行政区划代码是否有效（含历史数据）
     * @param {string} code - 行政区划代码
     * @param {number} level - 级别（1=省, 2=市, 3=区）
     * @returns {boolean} 是否有效
     */
    isValidCode(code, level) {
        if (!this._loaded) return false;
        
        if (level === 1) {
            return this._index.province.has(code.substring(0, 2)) || 
                   this._historicalIndex.province.has(code.substring(0, 2));
        } else if (level === 2) {
            return this._index.city.has(code.substring(0, 4)) || 
                   this._historicalIndex.city.has(code.substring(0, 4));
        } else if (level === 3) {
            return this._index.district.has(code.substring(0, 6)) || 
                   this._historicalIndex.district.has(code.substring(0, 6));
        }
        
        return false;
    }
};

// 注册到全局
(function() {
    if (!window.CUI) window.CUI = {};
    window.CUI.locationData = CUILocationData;
    
    // 如果调度器可用，在 ENV 阶段加载数据
    if (typeof window.CUI.registerModule === 'function') {
        window.CUI.registerModule('locationData', {
            stages: {
                ENV: async () => {
                    await CUILocationData.load();
                }
            },
            dependencies: []
        });
    } else {
        // 调度器不可用时，独立加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                CUILocationData.load();
            });
        } else {
            CUILocationData.load();
        }
    }
})();

// 导出（ES6 模块）
export default CUILocationData;