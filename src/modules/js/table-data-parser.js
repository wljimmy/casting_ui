/* 
 * Casting UI Framework
 * Version: 0.6.0
 * Module: table-data-parser.js
 * Description: 表格数据解析器 - 支持HTML、CSV、JSON数据源，自带容错与数据对齐
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

import { debug } from './core.js';

/**
 * 触发超列异常的双重报错
 */
function reportExtraColumnsError(tableId, expectedCols, actualCols, rowIndex, rawRow) {
    const errMsg = `表格数据异常：实际数据列数 (${actualCols}) 超过表头标准列数 (${expectedCols})。`;
    console.error(`[CUI Table Error] 表格 ID: ${tableId || '未知'}。行号: ${rowIndex + 1}。标准列数: ${expectedCols}，实际列数: ${actualCols}。问题数据行:`, rawRow);
    
    if (typeof window !== 'undefined') {
        if (window.CUI && typeof window.CUI.showToast === 'function') {
            window.CUI.showToast('error', errMsg);
        } else {
            alert(errMsg);
        }
    }
}

/**
 * 表格数据注册表（全局统一托管所有表格实例及其内存数据）
 */
class TableDataRegistry {
    constructor() {
        this.registry = new Map();
    }

    register(id, tableData) {
        if (!id) return null;
        this.registry.set(id, tableData);
        debug('表格组件在注册表注册成功', null, { id, totalRows: tableData.data?.length || 0 });
        return id;
    }

    get(id) {
        return this.registry.get(id);
    }

    update(id, tableData) {
        if (this.registry.has(id)) {
            const current = this.registry.get(id);
            const updated = { ...current, ...tableData, updatedAt: new Date() };
            this.registry.set(id, updated);
            return true;
        }
        return false;
    }

    unregister(id) {
        return this.registry.delete(id);
    }

    has(id) {
        return this.registry.has(id);
    }

    clear() {
        this.registry.clear();
    }
}

/**
 * 表格数据解析器基类
 */
class TableDataParser {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    /**
     * 基础数据清洗与容错对齐逻辑
     * @param {Array} rawRows 二维数组或对象数组
     * @param {Array} headers 基准表头
     * @param {string} tableId 表格ID，用于报错定位
     * @returns {Array} 标准化的行数据
     */
    cleanAndAlignData(rawRows, headers, tableId) {
        if (!Array.isArray(rawRows)) return [];
        const expectedCols = headers.length;

        return rawRows.map((row, rowIndex) => {
            const cleanRow = { _id: rowIndex, _originalIndex: rowIndex };

            if (Array.isArray(row)) {
                // 1. 数组类型数据源（如 CSV 某一行，或 HTML 某一行，或 JSON 纯数组）
                const actualCols = row.length;

                if (actualCols < expectedCols) {
                    // 缺列自动补齐
                    const alignedRow = [...row];
                    while (alignedRow.length < expectedCols) {
                        alignedRow.push('');
                    }
                    headers.forEach((h, colIndex) => {
                        cleanRow[h.field] = alignedRow[colIndex] ?? '';
                    });
                    this.warnings.push(`行 ${rowIndex + 1} 列数不足 (${actualCols}/${expectedCols})，已补空列。`);
                } else if (actualCols > expectedCols) {
                    // 超列双重报错提示，截断处理以防止溢出
                    reportExtraColumnsError(tableId, expectedCols, actualCols, rowIndex, row);
                    headers.forEach((h, colIndex) => {
                        cleanRow[h.field] = row[colIndex] ?? '';
                    });
                } else {
                    // 列数正常
                    headers.forEach((h, colIndex) => {
                        cleanRow[h.field] = row[colIndex] ?? '';
                    });
                }
            } else if (typeof row === 'object' && row !== null) {
                // 2. 对象类型数据源（支持多冗余字段数据场景）
                // 遍历表头，进行精准匹配，若数据源缺失该字段则留空
                headers.forEach(h => {
                    cleanRow[h.field] = row[h.field] !== undefined && row[h.field] !== null ? row[h.field] : '';
                });

                // 系统冗余参数、多余无效字段：内存完整保留不丢失
                Object.keys(row).forEach(key => {
                    if (cleanRow[key] === undefined) {
                        cleanRow[key] = row[key];
                    }
                });
            } else {
                // 异常行容错：整行置空
                headers.forEach(h => {
                    cleanRow[h.field] = '';
                });
                this.warnings.push(`行 ${rowIndex + 1} 格式无效，已静默修复为空行。`);
            }

            return cleanRow;
        });
    }
}

/**
 * HTML 表格解析器
 */
class HTMLTableParser extends TableDataParser {
    /**
     * 解析页面原生 HTML Table 结构（最高优先级）
     * @param {HTMLTableElement} tableElement HTML 表格 DOM 元素
     * @returns {Object} 解析后的标准化表格数据
     */
    parse(tableElement) {
        if (!tableElement || tableElement.tagName !== 'TABLE') {
            throw new Error('无效的 HTML 表格元素');
        }

        const tableId = tableElement.id;
        const thead = tableElement.querySelector('thead');
        const tbody = tableElement.querySelector('tbody');
        const tfoot = tableElement.querySelector('tfoot');

        // 1. 提取表头配置
        const headers = [];
        if (thead) {
            const ths = thead.querySelectorAll('tr:last-child th');
            ths.forEach((th, index) => {
                const field = th.getAttribute('data-field') || th.textContent.trim() || `col_${index}`;
                const label = th.textContent.trim() || field;
                const type = th.getAttribute('data-type') || 'text';
                const summary = th.getAttribute('data-summary') || '';
                headers.push({ field, label, type, summary, element: th });
            });
        }

        // 2. 提取表尾自定义汇总初始配置（如有）
        const footerData = {};
        if (tfoot) {
            const footerCells = tfoot.querySelectorAll('tr:first-child td, tr:first-child th');
            headers.forEach((h, index) => {
                const cell = footerCells[index];
                if (cell) {
                    const cellText = cell.textContent.trim();
                    // 仅当 td 有文本内容时，才算作“用户手动自定义的展示内容”
                    if (cellText !== '') {
                        footerData[h.field] = cellText;
                    }
                }
            });
        }

        // 3. 提取表体原生数据
        const rawRows = [];
        if (tbody) {
            const trs = tbody.querySelectorAll('tr');
            trs.forEach(tr => {
                const tds = tr.querySelectorAll('td');
                if (tds.length > 0) {
                    const rowData = Array.from(tds).map(td => {
                        const val = td.getAttribute('data-value');
                        return val !== null ? val : td.textContent.trim();
                    });
                    rawRows.push(rowData);
                }
            });
        }

        // 4. 清洗与对齐数据
        const cleanRows = this.cleanAndAlignData(rawRows, headers, tableId);

        return {
            headers,
            data: cleanRows,
            footerData,
            metadata: {
                totalRows: cleanRows.length,
                totalCols: headers.length,
                hasHeader: headers.length > 0,
                hasFooter: !!tfoot
            }
        };
    }
}

/**
 * CSV 格式解析器
 */
class CSVParser extends TableDataParser {
    /**
     * 解析 CSV 文本数据
     * @param {string} csvText CSV 字符串
     * @param {Object} options 包含 headers 基准的配置项
     * @param {string} tableId 表格ID
     * @returns {Object} 解析结果
     */
    parse(csvText, options = {}, tableId = '') {
        if (typeof csvText !== 'string') {
            throw new Error('CSV 数据源必须是字符串');
        }

        const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
        if (lines.length === 0) {
            return { headers: [], data: [], footerData: {} };
        }

        // 解析每行 CSV 数据
        const rawRows = lines.map(line => this.parseCSVLine(line));

        let headers = options.headers || [];
        let dataStartIdx = 0;

        // 若没有外部传入的 thead 表头，则将 CSV 首行当作表头
        if (headers.length === 0) {
            const firstLine = rawRows[0];
            headers = firstLine.map((h, index) => ({
                field: h || `col_${index}`,
                label: h || `列${index + 1}`,
                type: 'text',
                summary: ''
            }));
            dataStartIdx = 1;
        }

        const cleanRows = this.cleanAndAlignData(rawRows.slice(dataStartIdx), headers, tableId);

        return {
            headers,
            data: cleanRows,
            footerData: {},
            metadata: {
                totalRows: cleanRows.length,
                totalCols: headers.length
            }
        };
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        const delimiter = ',';
        const quote = '"';

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (inQuotes) {
                if (char === quote && nextChar === quote) {
                    current += quote;
                    i++;
                } else if (char === quote) {
                    inQuotes = false;
                } else {
                    current += char;
                }
            } else {
                if (char === quote) {
                    inQuotes = true;
                } else if (char === delimiter) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
        }
        result.push(current.trim());
        return result;
    }
}

/**
 * JSON 格式解析器
 */
class JSONParser extends TableDataParser {
    /**
     * 解析 JSON 数据源
     * @param {string|Array|Object} jsonInput JSON输入
     * @param {Object} options 包含 headers 基准的配置项
     * @param {string} tableId 表格ID
     * @returns {Object} 解析结果
     */
    parse(jsonInput, options = {}, tableId = '') {
        let jsonObj = jsonInput;
        if (typeof jsonInput === 'string') {
            try {
                jsonObj = JSON.parse(jsonInput);
            } catch (e) {
                throw new Error(`JSON 解析失败: ${e.message}`);
            }
        }

        let rawRows = [];
        let jsonHeaders = null;
        let jsonFooterData = {};

        // 识别 JSON 数据格式
        if (Array.isArray(jsonObj)) {
            // 格式 A: 纯对象数组 [ { field1: val1, ... }, ... ]
            rawRows = jsonObj;
        } else if (jsonObj && typeof jsonObj === 'object') {
            // 格式 B: 包裹型结构 { headers: [], data: [], footerData: {} }
            if (Array.isArray(jsonObj.data)) {
                rawRows = jsonObj.data;
            } else if (Array.isArray(jsonObj.rows)) {
                rawRows = jsonObj.rows;
            }
            if (Array.isArray(jsonObj.headers)) {
                jsonHeaders = jsonObj.headers;
            }
            if (jsonObj.footerData) {
                jsonFooterData = jsonObj.footerData;
            }
        }

        let headers = options.headers || [];

        // 若没有外部传入的 HTML thead，并且数据自带表头，则使用数据自带表头
        if (headers.length === 0) {
            if (jsonHeaders) {
                headers = jsonHeaders.map((h, index) => {
                    if (typeof h === 'string') {
                        return { field: h, label: h, type: 'text', summary: '' };
                    }
                    return {
                        field: h.field || `col_${index}`,
                        label: h.label || h.field || `列${index + 1}`,
                        type: h.type || 'text',
                        summary: h.summary || ''
                    };
                });
            } else if (rawRows.length > 0 && !Array.isArray(rawRows[0]) && typeof rawRows[0] === 'object') {
                // 基于第一行对象的 Key 自动推导表头
                headers = Object.keys(rawRows[0]).map(key => ({
                    field: key,
                    label: key,
                    type: 'text',
                    summary: ''
                }));
            }
        }

        const cleanRows = this.cleanAndAlignData(rawRows, headers, tableId);

        return {
            headers,
            data: cleanRows,
            footerData: jsonFooterData,
            metadata: {
                totalRows: cleanRows.length,
                totalCols: headers.length
            }
        };
    }
}

/**
 * 表格数据管理器（重构后的核心入口，支持数据清洗与统一分发）
 */
class TableDataManager {
    constructor() {
        this.registry = new TableDataRegistry();
        this.htmlParser = new HTMLTableParser();
        this.csvParser = new CSVParser();
        this.jsonParser = new JSONParser();
    }

    /**
     * 自动识别格式并清洗解析数据源
     * @param {*} data 原始数据（可以是DOM, JSON对象, CSV字符串等）
     * @param {Object} options 解析与表头映射配置
     * @returns {Object} 标准化后的表格结构数据
     */
    parse(data, options = {}) {
        const formatType = this.detectDataType(data);
        const tableId = options.id || '';
        let result;

        try {
            switch (formatType) {
                case 'html':
                    result = this.htmlParser.parse(data);
                    break;
                case 'csv':
                    result = this.csvParser.parse(data, options, tableId);
                    break;
                case 'json':
                    result = this.jsonParser.parse(data, options, tableId);
                    break;
                default:
                    throw new Error('未识别的数据格式，无法完成解析');
            }
            
            // 仅在明确要求注册时写入全局注册表
            if (options.register !== false && tableId) {
                this.registry.register(tableId, {
                    id: tableId,
                    headers: result.headers,
                    data: result.data,
                    footerData: result.footerData,
                    metadata: result.metadata,
                    config: options.config || {}
                });
            }

            return { success: true, data: result };
        } catch (error) {
            console.error('[CUI Table Parser Error]', error);
            return { success: false, error: error.message };
        }
    }

    detectDataType(data) {
        if (data instanceof Element || data instanceof HTMLTableElement) {
            return 'html';
        }
        if (typeof data === 'string') {
            const trimmed = data.trim();
            if (trimmed.startsWith('<table') || trimmed.startsWith('<thead') || trimmed.startsWith('<table>')) {
                return 'html';
            }
            if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                return 'json';
            }
            if (trimmed.includes(',') || trimmed.includes('\n')) {
                return 'csv';
            }
        }
        if (typeof data === 'object' && data !== null) {
            return 'json';
        }
        return 'unknown';
    }

    getData(id) {
        const item = this.registry.get(id);
        return item ? item.data : null;
    }

    getHeaders(id) {
        const item = this.registry.get(id);
        return item ? item.headers : null;
    }

    getFooterData(id) {
        const item = this.registry.get(id);
        return item ? item.footerData : null;
    }

    updateData(id, cleanData) {
        return this.registry.update(id, { data: cleanData });
    }

    exportJSON(id) {
        const tableItem = this.registry.get(id);
        if (!tableItem) return null;
        return JSON.stringify(tableItem.data, null, 2);
    }

    exportCSV(id) {
        const tableItem = this.registry.get(id);
        if (!tableItem) return null;

        const headers = tableItem.headers;
        const data = tableItem.data;
        const lines = [];

        // 写入表头
        lines.push(headers.map(h => `"${String(h.label).replace(/"/g, '""')}"`).join(','));

        // 写入数据
        data.forEach(row => {
            const rowValues = headers.map(h => {
                const val = row[h.field] ?? '';
                return `"${String(val).replace(/"/g, '""')}"`;
            });
            lines.push(rowValues.join(','));
        });

        return lines.join('\n');
    }
}

// 创建全局单例
const tableDataManager = new TableDataManager();

export { 
    TableDataParser, 
    HTMLTableParser, 
    CSVParser, 
    JSONParser, 
    TableDataRegistry,
    TableDataManager,
    tableDataManager 
};
