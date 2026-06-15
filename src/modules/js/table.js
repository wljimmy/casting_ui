/* 
 * Casting UI Framework
 * Version: 0.5.8
 * Module: table.js
 * Description: 表格组件
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

import { debug } from './core.js';
import { tableDataManager } from './table-data-parser.js';

class TableManager {
    constructor(cellEventManager) {
        this.cellEventManager = cellEventManager || new CellEventManager();
        this.tables = new Map();
        this.init();
    }

    init() {
        this.initTables();
        this.startTableObserver();
    }

    initTables() {
        const tables = document.querySelectorAll('table[data-cui-table]');
        tables.forEach(table => {
            this.createTable(table);
        });
    }

    startTableObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'TABLE' && node.hasAttribute('data-cui-table')) {
                            this.createTable(node);
                        }
                        const tables = node.querySelectorAll('table[data-cui-table]');
                        tables.forEach(table => {
                            this.createTable(table);
                        });
                    }
                });
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    createTable(element) {
        const tableId = element.id || `cui-table-${Date.now()}`;
        if (!element.id) {
            element.id = tableId;
        }

        if (this.tables.has(tableId)) {
            return;
        }

        const config = this.parseConfig(element);
        
        if (config.type === 'display') {
            this.renderCardFromElement(element, config);
            return;
        }

        const tableObj = new Table(element, config, this.cellEventManager);
        this.tables.set(tableId, tableObj);
        debug('表格组件初始化完成', element, { id: tableId, config });
        return tableObj;
    }

    parseConfig(element) {
        const configStr = element.getAttribute('data-cui-table');
        let config = {};

        if (configStr) {
            try {
                config = JSON.parse(configStr);
            } catch (e) {
                debug('表格配置解析失败', element, { error: e.message });
            }
        }

        // 数据源自动解析
        const dataSource = config.dataSource;
        if (dataSource) {
            const parsedData = this.parseDataSource(dataSource, element);
            if (parsedData) {
                config.headers = config.headers || parsedData.headers;
                config.data = config.data || parsedData.data;
                config.footerData = config.footerData || parsedData.footerData;
            }
        }

        return {
            type: config.type || 'functional',
            sortable: config.sortable !== undefined ? config.sortable : true,
            filterable: config.filterable !== undefined ? config.filterable : true,
            frozenRows: config.frozenRows || [],
            frozenCols: config.frozenCols || [],
            hasFirstCol: config.hasFirstCol !== undefined ? config.hasFirstCol : false,
            hasLastCol: config.hasLastCol !== undefined ? config.hasLastCol : false,
            hasFooter: config.hasFooter !== undefined ? config.hasFooter : false,
            pagination: config.pagination !== undefined ? config.pagination : false,
            pageSize: config.pageSize || 10,
            ellipsis: config.ellipsis !== undefined ? config.ellipsis : true,
            maxHeight: config.maxHeight || 500,
            striped: config.striped !== undefined ? config.striped : true,
            ...config
        };
    }

    /**
     * 解析数据源
     */
    parseDataSource(dataSource, element) {
        // 支持多种数据源格式
        if (typeof dataSource === 'string') {
            // 可能是选择器、URL或内联数据
            if (dataSource.startsWith('#') || dataSource.startsWith('.')) {
                // 选择器：尝试从DOM获取数据
                const targetElement = document.querySelector(dataSource);
                if (targetElement) {
                    return tableDataManager.parse(targetElement).data;
                }
            } else if (dataSource.startsWith('http')) {
                // URL：需要fetch获取
                debug('远程数据源暂不支持，请使用内联数据或CSV/JSON', element);
                return null;
            } else {
                // 内联数据：尝试解析
                try {
                    const parsed = tableDataManager.parse(dataSource);
                    if (parsed.success) {
                        return parsed.data;
                    }
                } catch (e) {
                    debug('数据源解析失败', element, { error: e.message });
                }
            }
        } else if (Array.isArray(dataSource)) {
            // 直接数组数据
            const parsed = tableDataManager.parse(dataSource);
            if (parsed.success) {
                return parsed.data;
            }
        } else if (typeof dataSource === 'object') {
            // 对象数据
            const parsed = tableDataManager.parse(dataSource);
            if (parsed.success) {
                return parsed.data;
            }
        }
        
        return null;
    }

    getTable(tableId) {
        return this.tables.get(tableId);
    }

    /**
     * 获取数据管理器
     */
    getDataManager() {
        return tableDataManager;
    }

    /**
     * 解析外部数据并渲染表格
     */
    parseAndRender(data, options = {}) {
        return tableDataManager.parse(data, { ...options, register: true });
    }

    /**
     * 获取已注册的数据
     */
    getTableData(id) {
        return tableDataManager.getData(id);
    }

    /**
     * 导出数据
     */
    exportData(id, format = 'json') {
        if (format === 'json') {
            return tableDataManager.exportJSON(id);
        } else if (format === 'csv') {
            return tableDataManager.exportCSV(id);
        }
        return null;
    }

    destroyTable(tableId) {
        const table = this.tables.get(tableId);
        if (table) {
            table.destroy();
            this.tables.delete(tableId);
        }
    }

    render(config) {
        const container = config.container;
        if (!container) {
            debug('表格渲染失败：未指定容器', null, { error: 'container is required' });
            return null;
        }

        const containerElement = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;

        if (!containerElement) {
            debug('表格渲染失败：容器不存在', null, { container });
            return null;
        }

        if (config.type === 'display') {
            return this.renderCard(config, containerElement);
        }

        const tableElement = document.createElement('table');
        tableElement.id = `cui-table-${Date.now()}`;
        tableElement.setAttribute('data-cui-table', JSON.stringify(config));
        
        if (config.headers && config.data) {
            this.generateTableFromData(tableElement, config);
        }

        containerElement.innerHTML = '';
        containerElement.appendChild(tableElement);

        return this.createTable(tableElement);
    }

    renderCard(config, containerElement) {
        const headers = config.headers;
        const data = config.data;

        containerElement.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'CUI-table-display';

        const stripedClass = config.striped ? 'CUI-table-striped' : 'CUI-table-plain';
        let html = `<table class="CUI-table ${stripedClass}">`;
        html += '<thead><tr>';
        headers.forEach((header) => {
            html += `<th>${header.label}</th>`;
        });
        html += '</tr></thead><tbody>';

        data.forEach((row, rowIndex) => {
            html += `<tr data-row-id="${row._id || row.id || rowIndex}">`;
            headers.forEach((header) => {
                const value = this.formatCellValue(row[header.field], header.type);
                html += `<td>${value}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';

        card.innerHTML = html;
        containerElement.appendChild(card);
        return null;
    }

    renderCardFromElement(element, config) {
        const card = document.createElement('div');
        card.className = 'CUI-table-display';
        element.classList.add('CUI-table');
        
        if (config.striped) {
            element.classList.add('CUI-table-striped');
        } else {
            element.classList.add('CUI-table-plain');
        }
        
        const parent = element.parentNode;
        if (parent) {
            parent.replaceChild(card, element);
            card.appendChild(element);
        }
    }

    formatCellValue(value, type, config) {
        if (value === undefined || value === null) return '';
        const str = String(value);
        config = config || {};
        
        switch (type) {
            case 'id':
            case 'idcard':
            case 'phone':
            case 'password':
                // 掩码类型由 generateTableFromData 通过 data-masked 处理
                // 此处仅返回铭文（伪类覆盖显示掩码，hover显示铭文）
                return this._escapeHtml(str);
            case 'currency': {
                // 货币：符号左对齐，数字右对齐，统一小数位
                const symbol = config.currencySymbol || '¥';
                const decimals = config.decimals !== undefined ? config.decimals : 2;
                const num = parseFloat(str);
                if (isNaN(num)) return str;
                const formatted = num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return `<span class="CUI-table-cell-currency"><span class="CUI-currency-symbol">${this._escapeHtml(symbol)}</span><span class="CUI-currency-amount">${formatted}</span></span>`;
            }
            case 'number': {
                const decimals = config.decimals !== undefined ? config.decimals : 0;
                const num = parseFloat(str);
                if (isNaN(num)) return str;
                if (decimals === 0) {
                    // 整数：原样返回，仅右对齐（由 CUI-td-number 处理）
                    return String(num);
                }
                // 小数：返回原始值（千分符通过伪类掩码显示，由 generateTableFromData 处理）
                return String(num.toFixed(decimals));
            }
            case 'password': {
                // 密码：星号掩码，鼠标移入显示铭文
                let asteriskCount = 6;
                if (str.length >= 8 && str.length <= 12) asteriskCount = 10;
                else if (str.length > 12) asteriskCount = 16;
                const stars = '*'.repeat(asteriskCount);
                return `<span class="CUI-table-cell-password" data-full="${this._escapeHtml(str)}" data-masked="${this._escapeHtml(stars)}"></span>`;
            }
            case 'email': {
                // 邮箱：邮箱链接
                return `<a href="mailto:${this._escapeHtml(str)}" class="CUI-table-cell-email">${this._escapeHtml(str)}</a>`;
            }
            case 'link': {
                // 链接：可配置前缀
                const prefix = config.linkPrefix || '';
                const href = prefix + str;
                return `<a href="${this._escapeHtml(href)}" class="CUI-table-cell-link" target="_blank" rel="noopener">${this._escapeHtml(str)}</a>`;
            }
            case 'image':
                return `<img src="${this._escapeHtml(str)}" alt="" style="width:40px;height:40px;border-radius:4px;object-fit:cover;" loading="lazy">`;
            default:
                return this._escapeHtml(str);
        }
    }

    /**
     * 获取掩码显示文本（用于 data-masked）
     */
    getCellMask(type, value) {
        if (value === undefined || value === null) return null;
        const str = String(value);

        switch (type) {
            case 'id': {
                if (str.length <= 4) return str;
                return this._maskByWidth(str);
            }
            case 'idcard': {
                if (str.length === 18) {
                    return str.replace(/^(\d{6})\d{8}(\d{4})$/, '$1********$2');
                }
                return null;
            }
            case 'phone': {
                if (str.length === 11) {
                    return str.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
                }
                return null;
            }
            case 'password': {
                let count = 6;
                if (str.length >= 8 && str.length <= 12) count = 10;
                else if (str.length > 12) count = 16;
                return '*'.repeat(count);
            }
            default:
                return null;
        }
    }

    /**
     * 按显示宽度掩码：1/4 明码 + 1/2 星号 + 1/4 明码
     * 半角字符=1单位，全角字符=2单位，掩码时1单位→1个星号
     */
    _maskByWidth(str) {
        const chars = [...str];
        const widths = chars.map(c => {
            const code = c.charCodeAt(0);
            return (code > 0x2E80 && code < 0x9FFF) || code >= 0xFF01 ? 2 : 1;
        });
        const totalWidth = widths.reduce((s, w) => s + w, 0);

        const frontTarget = Math.floor(totalWidth / 4);
        const backTarget = Math.floor(totalWidth / 4);

        let result = '';
        let accumulated = 0;
        let i = 0;

        // 前 1/4 明码
        while (i < chars.length && accumulated < frontTarget) {
            result += chars[i];
            accumulated += widths[i];
            i++;
        }

        // 中间 1/2 星号（1单位→1星号，2单位→2星号）
        const middleEnd = totalWidth - backTarget;
        while (i < chars.length && accumulated < middleEnd) {
            result += '*'.repeat(widths[i]);
            accumulated += widths[i];
            i++;
        }

        // 后 1/4 明码
        while (i < chars.length) {
            result += chars[i];
            i++;
        }

        return result;
    }

    /**
     * 判断是否为掩码类型
     */
    isMaskedType(type) {
        return type === 'id' || type === 'idcard' || type === 'phone' || type === 'password';
    }

    _escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /**
     * 自动检测字段类型（货币/数字）
     * @param {Array} headers 表头配置
     * @param {Array} data 数据
     * @param {Object} config 表格配置
     * @returns {Array} 补充了type的headers
     */
    autoDetectTypes(headers, data, config) {
        // 全局关闭自动检测
        if (config.autoFormat === false) return headers;

        if (!data || data.length === 0) return headers;

        const sampleSize = Math.min(10, data.length);

        return headers.map(header => {
            // 单列关闭自动检测，或已有手动标注类型
            if (header.autoFormat === false) return header;
            if (header.type) return header;

            // 采样判断
            const samples = [];
            for (let i = 0; i < sampleSize; i++) {
                samples.push(data[i][header.field]);
            }
            const nonEmpty = samples.filter(v => v !== undefined && v !== null && v !== '');

            if (nonEmpty.length === 0) return header;

            // 检测货币：货币符号+数字
            const currencyPattern = /^[¥$€£]\s*-?\d+(\.\d+)?$/;
            const allCurrency = nonEmpty.every(v => currencyPattern.test(String(v).trim()));
            if (allCurrency) {
                const match = String(nonEmpty[0]).trim().match(/^([¥$€£])/);
                return { ...header, type: 'currency', currencySymbol: match ? match[1] : '¥' };
            }

            // 检测数字：全部为数值类型或纯数字字符串
            const allNumeric = nonEmpty.every(v => {
                if (typeof v === 'number') return true;
                if (typeof v === 'string' && /^\d+(\.\d+)?$/.test(v.trim())) return true;
                return false;
            });
            if (allNumeric) {
                // 检查是否有小数
                const hasDecimal = nonEmpty.some(v => String(v).includes('.'));
                return { ...header, type: 'number', decimals: hasDecimal ? 2 : 0 };
            }

            return header;
        });
    }

    generateTableFromData(tableElement, config) {
        const headers = config.headers;
        const data = config.data;
        const frozenCols = config.frozenCols || [];

        // 应用自动类型检测
        if (!config._detected) {
            const detectedHeaders = this.autoDetectTypes(headers, data, config);
            config.headers = detectedHeaders;
            config._detected = true;
        }

        // 确保使用检测后的 headers（包含自动识别的类型信息）
        const activeHeaders = config.headers;

        let html = '';

        if (config.headerGroups && config.headerGroups.length > 0) {
            html += '<thead>';
            config.headerGroups.forEach((group) => {
                html += '<tr>';
                group.forEach((header) => {
                    const colspan = header.colspan || 1;
                    const rowspan = header.rowspan || 1;
                    html += `<th colspan="${colspan}" rowspan="${rowspan}">${header.label}</th>`;
                });
                html += '</tr>';
            });
            html += '</thead>';
        } else {
            html += '<thead><tr>';
            activeHeaders.forEach((header, index) => {
                const sortable = header.sortable !== undefined ? header.sortable : config.sortable;
                const frozenClass = this.getFrozenColClass(index, frozenCols, config);
                const colspan = header.colspan || 1;
                const rowspan = header.rowspan || 1;
                
                html += `<th ${sortable ? 'data-sortable="true"' : ''} 
                    class="${frozenClass}"
                    data-field="${header.field || ''}"
                    colspan="${colspan}" rowspan="${rowspan}">${header.label}</th>`;
            });
            html += '</tr></thead>';
        }

        html += '<tbody>';
        data.forEach((row, rowIndex) => {
            html += `<tr data-row-id="${row._id || row.id || rowIndex}">`;
            activeHeaders.forEach((header, colIndex) => {
                const field = header.field || colIndex;
                const value = row[field];
                const frozenClass = this.getFrozenColClass(colIndex, frozenCols, config);
                const colspan = header.colspan || 1;
                const rowspan = header.rowspan || 1;
                
                const rawValue = value !== undefined ? value : '';
                let cellContent = rawValue !== '' ? this.formatCellValue(value, header.type, header) : '';

                // 掩码类型：铭文为实际DOM内容，伪类覆盖显示掩码
                let cellClasses = frozenClass;
                let extraAttr = '';
                if (this.isMaskedType(header.type)) {
                    const maskedText = this.getCellMask(header.type, value);
                    if (maskedText !== null) {
                        cellClasses += ' CUI-table-cell-masked';
                        extraAttr = ` data-masked="${this._escapeHtml(maskedText)}" data-type="${header.type}"`;
                    }
                } else if (header.type === 'number' && header.decimals && header.decimals > 0) {
                    // 小数数字：千分符通过伪类掩码显示，DOM保留原始值
                    const num = typeof value === 'number' ? value : parseFloat(value);
                    if (!isNaN(num)) {
                        const formatted = num.toFixed(header.decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        cellClasses += ' CUI-td-number CUI-table-cell-masked';
                        extraAttr = ` data-masked="${this._escapeHtml(formatted)}"`;
                    } else {
                        cellClasses += ' CUI-td-number';
                    }
                } else if (header.type === 'number') {
                    // 整数：仅右对齐，无掩码
                    cellClasses += ' CUI-td-number';
                }

                html += `<td class="${cellClasses}"${extraAttr}
                    data-value="${this._escapeHtml(String(rawValue))}"
                    data-field="${field}"
                    colspan="${colspan}" rowspan="${rowspan}">${cellContent}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody>';

        if (config.hasFooter && config.footerData) {
            html += '<tfoot class="CUI-table-footer"><tr>';
            headers.forEach((header, index) => {
                const frozenClass = this.getFrozenColClass(index, frozenCols, config);
                const footerValue = config.footerData[header.field] || '';
                html += `<td class="${frozenClass}">${footerValue}</td>`;
            });
            html += '</tr></tfoot>';
        }

        tableElement.innerHTML = html;
    }

    getFrozenColClass(index, frozenCols, config) {
        const classes = [];
        if (index === 0 && config.hasFirstCol) classes.push('CUI-table-first-col');
        if (index === this._getHeaderCount(config) - 1 && config.hasLastCol) classes.push('CUI-table-last-col');
        if (frozenCols.includes(index)) classes.push('CUI-table-col-frozen');
        return classes.join(' ');
    }

    _getHeaderCount(config) {
        if (config.headers) return config.headers.length;
        return 0;
    }
}

class CellEventManager {
    constructor() {
        this._handlers = {
            click: [],
            hover: [],
            dblclick: [],
            focus: []
        };
        this._typeHandlers = {};
    }

    /**
     * 注册单元格事件监听
     * @param {string} tableId 表格ID
     * @param {string} eventType 事件类型：click|hover|dblclick
     * @param {Function} callback 回调函数，接收 {tableId, rowIndex, colIndex, field, value, element, event}
     */
    on(tableId, eventType, callback) {
        if (!this._handlers[eventType]) {
            this._handlers[eventType] = [];
        }
        this._handlers[eventType].push({ tableId, callback });
        return this;
    }

    /**
     * 按数据类型注册事件监听
     * @param {string} tableId 表格ID
     * @param {string} dataType 数据类型：id|currency|password|email|link|number
     * @param {string} eventType 事件类型
     * @param {Function} callback 回调函数
     */
    onType(tableId, dataType, eventType, callback) {
        const key = `${tableId}:${dataType}`;
        if (!this._typeHandlers[key]) {
            this._typeHandlers[key] = [];
        }
        this._typeHandlers[key].push({ eventType, callback });
        return this;
    }

    /**
     * 移除事件监听
     */
    off(tableId, eventType, callback) {
        if (this._handlers[eventType]) {
            this._handlers[eventType] = this._handlers[eventType].filter(
                h => !(h.tableId === tableId && (!callback || h.callback === callback))
            );
        }
        return this;
    }

    /**
     * 触发单元格事件（由框架内部调用）
     */
    _trigger(event, tableId, cellData) {
        const eventType = event.type;
        // 按事件类型触发
        if (this._handlers[eventType]) {
            this._handlers[eventType].forEach(h => {
                if (h.tableId === tableId || h.tableId === '*') {
                    h.callback({ ...cellData, event });
                }
            });
        }
        // 按数据类型触发
        if (cellData.dataType) {
            const typeKey = `${tableId}:${cellData.dataType}`;
            const typeKeyWild = `*:${cellData.dataType}`;
            const handlers = [
                ...(this._typeHandlers[typeKey] || []),
                ...(this._typeHandlers[typeKeyWild] || [])
            ];
            handlers.forEach(h => {
                if (h.eventType === eventType || h.eventType === '*') {
                    h.callback({ ...cellData, event });
                }
            });
        }
    }
}

class Table {
    constructor(element, config, cellEventManager) {
        this.element = element;
        this.config = config || {};
        this.cellEventManager = cellEventManager;
        this.originalData = [];
        this.currentData = [];
        this.rowTemplates = {};
        this.sortField = null;
        this.sortOrder = 'asc';
        this.currentPage = 1;
        this.filterText = '';

        this.init();
    }

    init() {
        this.wrapTable();
        this.storeOriginalData();
        this.setupSorting();
        this.setupFilter();
        this.setupPagination();
        this.setupRowActions();
        this.handleLongText();
        this.setupCellEvents();
    }

    setupCellEvents() {
        if (!this.cellEventManager) return;

        const tableId = this.element.id;
        const self = this;

        // 提取单元格数据的公共逻辑
        const getCellData = (event) => {
            const td = event.target.closest('td');
            if (!td) return null;
            const tr = td.closest('tr');
            const rowIndex = Array.from(tr.parentNode.children).indexOf(tr);
            const colIndex = Array.from(td.parentNode.children).indexOf(td);
            return {
                rowIndex,
                colIndex,
                field: td.getAttribute('data-field') || '',
                value: td.getAttribute('data-value') || td.textContent.trim(),
                element: td,
                dataType: this._detectCellType(td)
            };
        };

        // 单元格点击委托
        this.element.addEventListener('click', (event) => {
            const cellData = getCellData(event);
            if (cellData) {
                self.cellEventManager._trigger(event, tableId, cellData);
            }
        });

        // 鼠标悬浮委托
        this.element.addEventListener('mouseover', (event) => {
            const cellData = getCellData(event);
            if (cellData) {
                self.cellEventManager._trigger(event, tableId, cellData);
            }
        });
    }

    _detectCellType(td) {
        if (td.classList.contains('CUI-table-cell-masked')) {
            const type = td.getAttribute('data-type');
            if (type) return type;
        }
        if (td.querySelector('.CUI-table-cell-currency')) return 'currency';
        if (td.querySelector('.CUI-table-cell-number')) return 'number';
        if (td.querySelector('.CUI-table-cell-email')) return 'email';
        if (td.querySelector('.CUI-table-cell-link')) return 'link';
        return null;
    }

    wrapTable() {
        if (this.element.classList.contains('CUI-table')) {
            return;
        }

        const container = document.createElement('div');
        container.className = 'CUI-table-container';
        
        const scrollY = document.createElement('div');
        scrollY.className = 'CUI-table-scroll-y';
        scrollY.style.maxHeight = `${this.config.maxHeight}px`;
        
        const scrollX = document.createElement('div');
        scrollX.className = 'CUI-table-scroll-x';

        this.element.classList.add('CUI-table');
        
        if (this.config.striped) {
            this.element.classList.add('CUI-table-striped');
        } else {
            this.element.classList.add('CUI-table-plain');
        }

        if (this.config.filterable || this.config.pagination) {
            const topToolbar = document.createElement('div');
            topToolbar.className = 'CUI-table-toolbar';
            topToolbar.innerHTML = `
                <div class="CUI-table-toolbar-left">
                    ${this.config.filterable ? `
                        <div class="CUI-table-filter-wrapper">
                            <input type="search" name="search" class="CUI-input" placeholder="搜索..." id="${this.element.id}-search">
                        </div>
                    ` : ''}
                    <div class="CUI-table-actions">
                        <button class="CUI-btn CUI-btn-sm CUI-btn-secondary" data-action="action1">操作1</button>
                        <button class="CUI-btn CUI-btn-sm CUI-btn-secondary" data-action="action2">操作2</button>
                        <button class="CUI-btn CUI-btn-sm CUI-btn-secondary" data-action="action3">操作3</button>
                        <button class="CUI-btn CUI-btn-sm CUI-btn-secondary" data-action="action4">操作4</button>
                        <button class="CUI-btn CUI-btn-sm CUI-btn-secondary" data-action="action5">操作5</button>
                    </div>
                </div>
                <div class="CUI-table-toolbar-right">
                    <span>共 <span id="${this.element.id}-total">0</span> 条数据</span>
                </div>
            `;
            container.appendChild(topToolbar);
        }

        const clonedTable = this.element.cloneNode(true);
        scrollX.appendChild(clonedTable);
        scrollY.appendChild(scrollX);
        container.appendChild(scrollY);

        if (this.config.pagination) {
            const bottomToolbar = document.createElement('div');
            bottomToolbar.className = 'CUI-table-toolbar';
            bottomToolbar.innerHTML = `
                <div class="CUI-table-toolbar-left">
                </div>
                <div class="CUI-table-toolbar-right">
                    <div class="CUI-table-pagination" id="${this.element.id}-pagination"></div>
                </div>
            `;
            container.appendChild(bottomToolbar);
        }

        const originalParent = this.element.parentNode;
        if (originalParent) {
            originalParent.replaceChild(container, this.element);
        }
        
        this.element = container.querySelector('table');
        this.container = container;
        this.scrollY = scrollY;
        this.scrollX = scrollX;

        this.setupHeaderSticky();
    }

    setupHeaderSticky() {
        const thead = this.element.querySelector('thead');
        if (thead) {
            thead.classList.add('CUI-table-header');
        }
        
        if (this.scrollX) {
            this.scrollX.addEventListener('scroll', (e) => {
                this.handleHorizontalScroll(e.target.scrollLeft);
            });
        }
    }

    handleHorizontalScroll(scrollLeft) {
        const firstCols = this.element.querySelectorAll('tbody .CUI-table-first-col');
        const lastCols = this.element.querySelectorAll('tbody .CUI-table-last-col');
        
        firstCols.forEach(col => {
            col.style.position = 'relative';
            col.style.left = `${scrollLeft}px`;
            col.style.zIndex = '5';
        });
        
        lastCols.forEach(col => {
            col.style.position = 'relative';
            col.style.left = `${scrollLeft}px`;
            col.style.zIndex = '5';
        });
    }

    storeOriginalData() {
        const rows = this.element.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            const rowId = row.getAttribute('data-row-id') || index;
            const rowData = {
                _originalIndex: index,
                _id: rowId,
                cells: []
            };
            
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                // 优先使用 data-value（格式化后的原始值），没有则用 textContent
                const rawValue = cell.getAttribute('data-value');
                rowData.cells.push(rawValue !== null ? rawValue : cell.textContent.trim());
            });
            
            this.originalData.push(rowData);
            this.rowTemplates[rowId] = row.outerHTML;
        });
        
        this.currentData = [...this.originalData];
        this.updateTotal();
    }

    setupSorting() {
        if (!this.config.sortable) return;

        const headers = this.element.querySelectorAll('th[data-sortable="true"]');
        headers.forEach((header) => {
            header.classList.add('CUI-table-sortable');
            
            header.addEventListener('click', () => {
                const field = header.getAttribute('data-field');
                this.sort(field);
            });
        });
    }

    sort(field) {
        const headers = this.element.querySelectorAll('th');
        
        headers.forEach(h => {
            h.classList.remove('CUI-table-sort-asc', 'CUI-table-sort-desc');
        });

        if (this.sortField === field) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortOrder = 'asc';
        }

        const header = this.element.querySelector(`th[data-field="${field}"]`) || this.element.querySelector('th:first-child');
        if (header) {
            header.classList.add(this.sortOrder === 'asc' ? 'CUI-table-sort-asc' : 'CUI-table-sort-desc');
        }

        this.currentData.sort((a, b) => {
            const aValue = field ? a.cells[this.getFieldIndex(field)] : a.cells[0];
            const bValue = field ? b.cells[this.getFieldIndex(field)] : b.cells[0];
            
            if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
                return this.sortOrder === 'asc' 
                    ? parseFloat(aValue) - parseFloat(bValue)
                    : parseFloat(bValue) - parseFloat(aValue);
            }
            
            return this.sortOrder === 'asc'
                ? aValue.localeCompare(bValue, 'zh-CN')
                : bValue.localeCompare(aValue, 'zh-CN');
        });

        this.updateDisplay();
    }

    getFieldIndex(field) {
        const headers = this.element.querySelectorAll('th');
        for (let i = 0; i < headers.length; i++) {
            if (headers[i].getAttribute('data-field') === field) {
                return i;
            }
        }
        return 0;
    }

    setupFilter() {
        if (!this.config.filterable) return;

        const filterInput = document.getElementById(`${this.element.id}-search`);
        if (filterInput) {
            filterInput.addEventListener('input', (e) => {
                this.filterText = e.target.value.toLowerCase();
                this.filter();
            });
        }
    }

    filter() {
        if (!this.filterText.trim()) {
            this.currentData = [...this.originalData];
        } else {
            this.currentData = this.originalData.filter(row => {
                return row.cells.some(cell => 
                    cell.toLowerCase().includes(this.filterText)
                );
            });
        }
        
        this.currentPage = 1;
        this.updateDisplay();
        this.updatePagination();
    }

    setupPagination() {
        if (!this.config.pagination) return;
        this.updatePagination();
    }

    updatePagination() {
        if (!this.config.pagination) return;

        const paginationContainer = document.getElementById(`${this.element.id}-pagination`);
        if (!paginationContainer) return;

        const total = this.currentData.length;
        const totalPages = Math.ceil(total / this.config.pageSize);

        let html = '';
        
        html += `<button class="CUI-table-page-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="prev">上一页</button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="CUI-table-page-btn ${this.currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        html += `<button class="CUI-table-page-btn ${this.currentPage === totalPages ? 'disabled' : ''}" data-page="next">下一页</button>`;

        paginationContainer.innerHTML = html;

        paginationContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.CUI-table-page-btn');
            if (!btn || btn.disabled) return;

            const page = btn.getAttribute('data-page');
            if (page === 'prev') {
                this.goToPage(this.currentPage - 1);
            } else if (page === 'next') {
                this.goToPage(this.currentPage + 1);
            } else {
                this.goToPage(parseInt(page));
            }
        });
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.currentData.length / this.config.pageSize);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.updateDisplay();
        this.updatePagination();
    }

    updateDisplay() {
        const tbody = this.element.querySelector('tbody');
        if (!tbody) return;

        const start = (this.currentPage - 1) * this.config.pageSize;
        const end = start + this.config.pageSize;
        const displayData = this.config.pagination 
            ? this.currentData.slice(start, end)
            : this.currentData;

        let html = '';
        displayData.forEach(rowData => {
            const template = this.rowTemplates[rowData._id];
            if (template) {
                html += template;
            }
        });

        tbody.innerHTML = html;

        this.handleLongText();
        this.setupRowActions();
    }

    updateTotal() {
        const totalSpan = document.getElementById(`${this.element.id}-total`);
        if (totalSpan) {
            totalSpan.textContent = this.originalData.length;
        }
    }

    setupRowActions() {
        const links = this.element.querySelectorAll('.CUI-table-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const actionStr = link.getAttribute('data-action');
                if (actionStr) {
                    try {
                        const action = JSON.parse(decodeURIComponent(actionStr));
                        this.handleAction(action);
                    } catch (e) {
                        debug('行操作解析失败', link, { error: e.message });
                    }
                }
            });
        });
    }

    handleAction(action) {
        if (typeof window[action.fn] === 'function') {
            window[action.fn](action.params);
        } else if (action.url) {
            window.location.href = action.url;
        } else if (action.callback && typeof action.callback === 'function') {
            action.callback(action.params);
        }
        
        debug('执行行操作', null, { action });
    }

    handleLongText() {
        if (!this.config.ellipsis) return;

        const cells = this.element.querySelectorAll('tbody td');
        cells.forEach(cell => {
            if (cell.textContent.length > 50) {
                cell.classList.add('CUI-table-text-ellipsis');
                cell.title = cell.textContent;
            }
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    refresh(data) {
        if (data) {
            this.originalData = data.map((row, index) => ({
                _originalIndex: index,
                _id: row._id || row.id || index,
                cells: Object.values(row).filter(v => typeof v !== 'object')
            }));
            this.currentData = [...this.originalData];
            this.rowTemplates = {};
            this.currentPage = 1;
            this.filterText = '';
            this.updateTotal();
            this.updateDisplay();
            this.updatePagination();
        }
    }

    getData() {
        return this.currentData;
    }

    getOriginalData() {
        return this.originalData;
    }
}

function initTableManager() {
    debug('初始化表格组件管理器');
    const cellEventManager = new CellEventManager();
    const tableManager = new TableManager(cellEventManager);
    
    if (window.CUI) {
        window.CUI.table = tableManager;
        window.CUI.table.cellEvents = cellEventManager;
    }
}

if (typeof window.CUI.registerModule === 'function') {
    window.CUI.registerModule('table', {
        dependencies: ['core'],
        stages: {
            READY: () => {
                initTableManager();
            }
        }
    });
} else {
    window.addEventListener('DOMContentLoaded', initTableManager);
}

export { TableManager, Table };
window.TableManager = TableManager;
window.Table = Table;