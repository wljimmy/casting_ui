/* 
 * Casting UI Framework
 * Version: 0.5.8
 * Module: table-data-parser.js
 * Description: 表格数据解析器 - 支持HTML、CSV、JSON数据源
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

import { debug } from './core.js';

/**
 * 表格数据结构
 * @typedef {Object} TableData
 * @property {Array<Object>} headers - 表头配置
 * @property {Array<Object>} data - 表格数据
 * @property {Array<Object>} footerData - 汇总行数据
 * @property {Object} metadata - 元数据（行数、列数等）
 */

/**
 * 解析结果
 * @typedef {Object} ParseResult
 * @property {boolean} success - 是否成功
 * @property {TableData|null} data - 解析后的数据
 * @property {Array<string>} errors - 错误信息
 * @property {Array<string>} warnings - 警告信息
 */

/**
 * 表格数据解析器基类
 */
class TableDataParser {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    /**
     * 解析数据
     * @param {*} input - 输入数据
     * @returns {ParseResult}
     */
    parse(input) {
        this.errors = [];
        this.warnings = [];
        
        try {
            const rawData = this.extractRawData(input);
            const validatedData = this.validateAndNormalize(rawData);
            const structuredData = this.buildTableStructure(validatedData);
            
            return {
                success: true,
                data: structuredData,
                errors: this.errors,
                warnings: this.warnings
            };
        } catch (error) {
            this.errors.push(error.message);
            return {
                success: false,
                data: null,
                errors: this.errors,
                warnings: this.warnings
            };
        }
    }

    /**
     * 提取原始数据（子类实现）
     */
    extractRawData(input) {
        throw new Error('子类必须实现 extractRawData 方法');
    }

    /**
     * 验证并标准化数据
     * @param {Array} rawData - 原始数据
     * @returns {Object} 标准化后的数据
     */
    validateAndNormalize(rawData) {
        if (!Array.isArray(rawData) || rawData.length === 0) {
            throw new Error('数据不能为空');
        }

        // 计算最大列数
        const maxCols = Math.max(...rawData.map(row => this.getRowLength(row)));

        // 标准化每行数据
        const normalizedRows = rawData.map((row, index) => {
            return this.normalizeRow(row, maxCols, index);
        });

        return {
            rows: normalizedRows,
            maxCols: maxCols,
            totalRows: rawData.length
        };
    }

    /**
     * 获取行数据长度
     */
    getRowLength(row) {
        if (Array.isArray(row)) {
            return row.length;
        } else if (typeof row === 'object' && row !== null) {
            return Object.keys(row).length;
        }
        return 0;
    }

    /**
     * 标准化单行数据（防呆处理）
     */
    normalizeRow(row, maxCols, rowIndex) {
        if (Array.isArray(row)) {
            // 数组数据：补齐空数据
            const normalized = [...row];
            while (normalized.length < maxCols) {
                normalized.push('');
                this.warnings.push(`第 ${rowIndex + 1} 行数据短缺，已补充空值`);
            }
            return normalized;
        } else if (typeof row === 'object' && row !== null) {
            // 对象数据：保持原样，由 buildTableStructure 处理
            return row;
        }
        throw new Error(`第 ${rowIndex + 1} 行数据格式无效`);
    }

    /**
     * 构建表格结构
     */
    buildTableStructure(normalizedData) {
        const { rows, maxCols, totalRows } = normalizedData;
        
        // 提取表头（第一行或对象键）
        let headers = this.extractHeaders(rows, maxCols);
        
        // 提取数据行
        let dataRows = rows.slice(1);
        if (dataRows.length === 0 && totalRows === 1) {
            // 如果只有一行数据，则为空数据
            dataRows = [];
        }

        // 转换为标准数据格式
        const headersList = headers.map((h, i) => ({
            field: h.field || `col_${i}`,
            label: h.label || h.text || h.value || `列${i + 1}`
        }));

        const data = dataRows.map((row, rowIndex) => {
            const rowData = { _id: rowIndex, _originalIndex: rowIndex };
            
            if (Array.isArray(row)) {
                headersList.forEach((header, colIndex) => {
                    rowData[header.field] = row[colIndex] ?? '';
                });
            } else {
                headersList.forEach((header) => {
                    rowData[header.field] = row[header.field] ?? '';
                });
            }
            
            return rowData;
        });

        return {
            headers: headersList,
            data: data,
            footerData: null,
            metadata: {
                totalRows: data.length,
                totalCols: headersList.length,
                hasHeader: totalRows > 0
            }
        };
    }

    /**
     * 提取表头
     */
    extractHeaders(rows, maxCols) {
        if (rows.length === 0) return [];
        
        const firstRow = rows[0];
        
        if (Array.isArray(firstRow)) {
            // 数组格式：使用第一行作为表头
            return firstRow.map((cell, i) => ({
                field: `col_${i}`,
                label: String(cell ?? `列${i + 1}`)
            }));
        } else if (typeof firstRow === 'object') {
            // 对象格式：使用对象的键作为表头
            const keys = Object.keys(firstRow);
            return keys.map(key => ({
                field: key,
                label: this.formatHeaderLabel(key)
            }));
        }
        
        return [];
    }

    /**
     * 格式化表头标签
     */
    formatHeaderLabel(field) {
        // 下划线转驼峰
        const formatted = field.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        // 驼峰转空格
        const withSpaces = formatted.replace(/([A-Z])/g, ' $1');
        // 首字母大写
        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    }
}

/**
 * HTML表格解析器
 */
class HTMLTableParser extends TableDataParser {
    /**
     * 从HTML表格元素提取数据
     */
    extractRawData(input) {
        if (typeof input === 'string') {
            // 可能是选择器或HTML字符串
            if (input.trim().startsWith('<')) {
                // HTML字符串
                const parser = new DOMParser();
                const doc = parser.parseFromString(input, 'text/html');
                input = doc.querySelector('table');
            } else {
                // 选择器
                input = document.querySelector(input);
            }
        }

        if (!input || input.tagName !== 'TABLE') {
            throw new Error('无效的HTML表格元素');
        }

        const rows = [];
        const tbody = input.querySelector('tbody');
        const thead = input.querySelector('thead');
        
        // 提取表头
        if (thead) {
            const headerRows = thead.querySelectorAll('tr');
            headerRows.forEach(tr => {
                const cells = Array.from(tr.querySelectorAll('th, td'));
                rows.push(cells.map(cell => cell.textContent.trim()));
            });
        }

        // 提取数据行
        const dataBody = tbody || input;
        const dataRows = dataBody.querySelectorAll('tr');
        dataRows.forEach(tr => {
            const cells = Array.from(tr.querySelectorAll('td'));
            if (cells.length > 0) {
                rows.push(cells.map(cell => this.extractCellValue(cell)));
            }
        });

        if (rows.length === 0) {
            throw new Error('表格中没有找到有效数据');
        }

        return rows;
    }

    /**
     * 提取单元格值
     */
    extractCellValue(cell) {
        // 检查是否有data属性
        const dataValue = cell.getAttribute('data-value');
        if (dataValue) return dataValue;

        // 检查是否有data-type属性
        const dataType = cell.getAttribute('data-type');
        if (dataType) {
            return {
                value: cell.textContent.trim(),
                type: dataType
            };
        }

        return cell.textContent.trim();
    }

    /**
     * 构建表格结构（覆盖父类）
     */
    buildTableStructure(normalizedData) {
        const { rows, maxCols, totalRows } = normalizedData;
        
        // 计算表头行数（如果有thead的话）
        let headers = [];
        let dataRows = rows;
        
        // 检查是否有多级表头
        const thead = document.querySelector('thead');
        if (thead) {
            const headerRows = thead.querySelectorAll('tr');
            if (headerRows.length > 1) {
                // 多级表头
                headers = this.extractMultiLevelHeaders(thead);
                dataRows = rows.slice(headerRows.length);
            } else {
                headers = this.extractHeaders(rows, maxCols);
                dataRows = rows.slice(1);
            }
        } else {
            headers = this.extractHeaders(rows, maxCols);
            dataRows = rows.slice(1);
        }

        // 转换为标准数据格式
        const headersList = headers.map((h, i) => ({
            field: h.field || `col_${i}`,
            label: h.label || h.text || h.value || `列${i + 1}`,
            colspan: h.colspan || 1,
            rowspan: h.rowspan || 1
        }));

        const data = dataRows.map((row, rowIndex) => {
            const rowData = { _id: rowIndex, _originalIndex: rowIndex };
            
            if (Array.isArray(row)) {
                headersList.forEach((header, colIndex) => {
                    const cellValue = row[colIndex];
                    if (typeof cellValue === 'object' && cellValue !== null) {
                        rowData[header.field] = cellValue.value ?? '';
                        rowData[`_${header.field}_type`] = cellValue.type;
                    } else {
                        rowData[header.field] = cellValue ?? '';
                    }
                });
            } else {
                headersList.forEach((header) => {
                    rowData[header.field] = row[header.field] ?? '';
                });
            }
            
            return rowData;
        });

        // 检查是否需要汇总行
        let footerData = null;
        const tfoot = document.querySelector('tfoot');
        if (tfoot) {
            const footerCells = Array.from(tfoot.querySelectorAll('td'));
            if (footerCells.length > 0) {
                footerData = {};
                headersList.forEach((header, i) => {
                    footerData[header.field] = footerCells[i]?.textContent.trim() || '';
                });
            }
        }

        return {
            headers: headersList,
            data: data,
            footerData: footerData,
            metadata: {
                totalRows: data.length,
                totalCols: headersList.length,
                hasHeader: true,
                hasMultiLevelHeader: thead && thead.querySelectorAll('tr').length > 1
            }
        };
    }

    /**
     * 提取多级表头
     */
    extractMultiLevelHeaders(thead) {
        const headerRows = thead.querySelectorAll('tr');
        const headers = [];
        
        headerRows.forEach((tr, rowIndex) => {
            const cells = Array.from(tr.querySelectorAll('th, td'));
            cells.forEach((cell, cellIndex) => {
                const colspan = parseInt(cell.getAttribute('colspan')) || 1;
                const rowspan = parseInt(cell.getAttribute('rowspan')) || 1;
                const text = cell.textContent.trim();
                
                if (rowIndex === headerRows.length - 1) {
                    // 最后一级表头
                    headers.push({
                        field: `col_${cellIndex}`,
                        label: text,
                        colspan: colspan,
                        rowspan: rowspan
                    });
                }
            });
        });
        
        return headers;
    }
}

/**
 * CSV数据解析器
 */
class CSVParser extends TableDataParser {
    constructor(options = {}) {
        super();
        this.options = {
            delimiter: options.delimiter || ',',
            quote: options.quote || '"',
            hasHeader: options.hasHeader !== undefined ? options.hasHeader : true,
            skipEmptyLines: options.skipEmptyLines !== undefined ? options.skipEmptyLines : true,
            ...options
        };
    }

    /**
     * 解析CSV数据
     */
    extractRawData(input) {
        if (typeof input !== 'string') {
            throw new Error('CSV数据必须是字符串格式');
        }

        const lines = input.split(/\r?\n/);
        const rows = [];
        
        lines.forEach((line, index) => {
            if (this.options.skipEmptyLines && line.trim() === '') {
                return;
            }
            
            const row = this.parseCSVLine(line);
            if (row.length > 0) {
                rows.push(row);
            } else {
                this.warnings.push(`第 ${index + 1} 行为空，已跳过`);
            }
        });

        if (rows.length === 0) {
            throw new Error('CSV数据为空');
        }

        return rows;
    }

    /**
     * 解析单行CSV
     */
    parseCSVLine(line) {
        const { delimiter, quote } = this.options;
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (inQuotes) {
                if (char === quote && nextChar === quote) {
                    // 转义的引号
                    current += quote;
                    i++;
                } else if (char === quote) {
                    // 引号结束
                    inQuotes = false;
                } else {
                    current += char;
                }
            } else {
                if (char === quote) {
                    // 引号开始
                    inQuotes = true;
                } else if (char === delimiter) {
                    // 分隔符
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

    /**
     * 验证并标准化数据（覆盖父类）
     */
    validateAndNormalize(rawData) {
        // CSV不需要额外的标准化，因为我们已经在解析时处理了
        return {
            rows: rawData,
            maxCols: Math.max(...rawData.map(row => row.length)),
            totalRows: rawData.length
        };
    }
}

/**
 * JSON数据解析器
 */
class JSONParser extends TableDataParser {
    /**
     * 解析JSON数据
     */
    extractRawData(input) {
        let jsonData = input;
        
        if (typeof input === 'string') {
            try {
                jsonData = JSON.parse(input);
            } catch (error) {
                throw new Error(`JSON解析失败: ${error.message}`);
            }
        }

        if (Array.isArray(jsonData)) {
            return jsonData;
        }

        if (typeof jsonData === 'object' && jsonData !== null) {
            // 检查是否是表格格式
            if (jsonData.headers && Array.isArray(jsonData.headers)) {
                // 标准表格格式
                const rows = [jsonData.headers];
                if (jsonData.data && Array.isArray(jsonData.data)) {
                    rows.push(...jsonData.data);
                }
                return rows;
            }

            // 对象数组
            if (jsonData.data && Array.isArray(jsonData.data)) {
                return jsonData.data;
            }

            // 单个对象
            if (jsonData.rows && Array.isArray(jsonData.rows)) {
                return jsonData.rows;
            }

            // 尝试转换对象为数组
            const keys = Object.keys(jsonData);
            if (keys.length > 0 && typeof jsonData[keys[0]] === 'object') {
                // 对象包含对象数组
                return Object.values(jsonData);
            }

            // 单行对象
            return [jsonData];
        }

        throw new Error('无效的JSON数据格式');
    }

    /**
     * 构建表格结构（覆盖父类）
     */
    buildTableStructure(normalizedData) {
        const { rows, maxCols, totalRows } = normalizedData;
        
        let headers = [];
        let dataRows = rows;

        // 检查第一行是否是对象
        if (totalRows > 0) {
            const firstRow = rows[0];
            if (typeof firstRow === 'object' && !Array.isArray(firstRow)) {
                // 对象数组：键作为表头
                headers = Object.keys(firstRow).map(key => ({
                    field: key,
                    label: this.formatHeaderLabel(key)
                }));
                dataRows = rows;
            } else if (Array.isArray(firstRow)) {
                // 数组格式
                headers = this.extractHeaders(rows, maxCols);
                dataRows = rows.slice(1);
            }
        }

        // 转换为标准数据格式
        const headersList = headers.map((h, i) => ({
            field: h.field || `col_${i}`,
            label: h.label || h.text || h.value || `列${i + 1}`
        }));

        const data = dataRows.map((row, rowIndex) => {
            const rowData = { _id: rowIndex, _originalIndex: rowIndex };
            
            if (Array.isArray(row)) {
                headersList.forEach((header, colIndex) => {
                    rowData[header.field] = row[colIndex] ?? '';
                });
            } else if (typeof row === 'object' && row !== null) {
                headersList.forEach((header) => {
                    rowData[header.field] = row[header.field] ?? '';
                });
            }
            
            return rowData;
        });

        return {
            headers: headersList,
            data: data,
            footerData: null,
            metadata: {
                totalRows: data.length,
                totalCols: headersList.length,
                hasHeader: typeof rows[0] === 'object' && !Array.isArray(rows[0])
            }
        };
    }
}

/**
 * 表格数据注册表
 */
class TableDataRegistry {
    constructor() {
        this.registry = new Map();
        this.idCounter = 0;
    }

    /**
     * 注册表格数据
     * @param {string} id - 表格ID
     * @param {TableData} data - 表格数据
     * @param {Object} options - 配置选项
     * @returns {string} 注册ID
     */
    register(id, data, options = {}) {
        const registerId = id || `table_data_${++this.idCounter}`;
        
        const tableData = {
            id: registerId,
            data: data,
            headers: data.headers,
            rows: data.data,
            footerData: data.footerData,
            metadata: data.metadata,
            config: {
                striped: options.striped !== undefined ? options.striped : true,
                sortable: options.sortable !== undefined ? options.sortable : true,
                filterable: options.filterable !== undefined ? options.filterable : true,
                ...options
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.registry.set(registerId, tableData);
        debug('表格数据已注册', null, { id: registerId, totalRows: data.data?.length || 0 });
        
        return registerId;
    }

    /**
     * 获取表格数据
     */
    get(id) {
        return this.registry.get(id);
    }

    /**
     * 获取所有注册数据
     */
    getAll() {
        return Array.from(this.registry.values());
    }

    /**
     * 更新表格数据
     */
    update(id, data) {
        const tableData = this.registry.get(id);
        if (tableData) {
            tableData.data = data;
            tableData.rows = data.data;
            tableData.headers = data.headers;
            tableData.footerData = data.footerData;
            tableData.metadata = data.metadata;
            tableData.updatedAt = new Date();
            return true;
        }
        return false;
    }

    /**
     * 删除注册数据
     */
    unregister(id) {
        return this.registry.delete(id);
    }

    /**
     * 检查是否已注册
     */
    has(id) {
        return this.registry.has(id);
    }

    /**
     * 获取统计数据
     */
    getStats() {
        return {
            total: this.registry.size,
            totalRows: Array.from(this.registry.values()).reduce((sum, t) => sum + (t.data?.data?.length || 0), 0),
            totalCols: Array.from(this.registry.values()).reduce((sum, t) => sum + (t.data?.headers?.length || 0), 0)
        };
    }

    /**
     * 清空注册表
     */
    clear() {
        this.registry.clear();
        this.idCounter = 0;
    }
}

/**
 * 表格数据管理器（统一入口）
 */
class TableDataManager {
    constructor() {
        this.registry = new TableDataRegistry();
        this.htmlParser = new HTMLTableParser();
        this.csvParser = new CSVParser();
        this.jsonParser = new JSONParser();
    }

    /**
     * 自动识别数据格式并解析
     * @param {*} data - 输入数据
     * @param {Object} options - 配置选项
     * @returns {ParseResult}
     */
    parse(data, options = {}) {
        // 检测数据格式
        const type = this.detectDataType(data);
        
        debug('开始解析数据', null, { detectedType: type });
        
        let parser;
        switch (type) {
            case 'html':
                parser = this.htmlParser;
                break;
            case 'csv':
                parser = this.csvParser;
                break;
            case 'json':
                parser = this.jsonParser;
                break;
            default:
                return {
                    success: false,
                    data: null,
                    errors: ['无法识别数据格式'],
                    warnings: []
                };
        }

        const result = parser.parse(data);
        
        if (result.success && options.register !== false) {
            this.registry.register(options.id, result.data, options);
        }
        
        return result;
    }

    /**
     * 检测数据格式
     */
    detectDataType(data) {
        if (typeof data === 'string') {
            const trimmed = data.trim();
            
            // HTML检测
            if (trimmed.startsWith('<table') || trimmed.startsWith('<thead')) {
                return 'html';
            }
            
            // JSON检测
            if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                try {
                    JSON.parse(trimmed);
                    return 'json';
                } catch (e) {
                    // 不是JSON，继续检测
                }
            }
            
            // CSV检测（包含逗号或制表符）
            if (trimmed.includes(',') || trimmed.includes('\t')) {
                return 'csv';
            }
        }
        
        // DOM元素检测
        if (data instanceof Element || data instanceof HTMLTableElement) {
            return 'html';
        }
        
        // 对象检测
        if (typeof data === 'object' && data !== null) {
            return 'json';
        }
        
        return 'unknown';
    }

    /**
     * 解析HTML表格
     */
    parseHTML(elementOrSelector) {
        return this.parse(elementOrSelector, { register: true });
    }

    /**
     * 解析CSV数据
     */
    parseCSV(csvString, options = {}) {
        return this.parse(csvString, { ...options, register: true });
    }

    /**
     * 解析JSON数据
     */
    parseJSON(jsonStringOrObject, options = {}) {
        return this.parse(jsonStringOrObject, { ...options, register: true });
    }

    /**
     * 获取注册的数据
     */
    getData(id) {
        return this.registry.get(id);
    }

    /**
     * 更新数据
     */
    updateData(id, data) {
        const result = this.parse(data, { register: false });
        if (result.success) {
            return this.registry.update(id, result.data);
        }
        return false;
    }

    /**
     * 导出数据为JSON
     */
    exportJSON(id) {
        const tableData = this.registry.get(id);
        if (tableData) {
            return JSON.stringify(tableData.data, null, 2);
        }
        return null;
    }

    /**
     * 导出数据为CSV
     */
    exportCSV(id) {
        const tableData = this.registry.get(id);
        if (!tableData) return null;

        const { headers, data } = tableData.data;
        const lines = [];

        // 表头
        lines.push(headers.map(h => h.label).join(','));

        // 数据行
        data.forEach(row => {
            const values = headers.map(h => {
                const value = row[h.field] ?? '';
                // 转义CSV值
                if (String(value).includes(',') || String(value).includes('"')) {
                    return `"${String(value).replace(/"/g, '""')}"`;
                }
                return value;
            });
            lines.push(values.join(','));
        });

        return lines.join('\n');
    }

    /**
     * 获取统计信息
     */
    getStats() {
        return this.registry.getStats();
    }

    /**
     * 检查数据是否存在
     */
    hasData(id) {
        return this.registry.has(id);
    }

    /**
     * 删除数据
     */
    removeData(id) {
        return this.registry.unregister(id);
    }
}

// 创建全局单例
const tableDataManager = new TableDataManager();

// 导出
export { 
    TableDataParser, 
    HTMLTableParser, 
    CSVParser, 
    JSONParser, 
    TableDataRegistry,
    TableDataManager,
    tableDataManager 
};
