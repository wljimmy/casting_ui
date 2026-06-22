/**
 * 单元测试：CUITableRegistry 基础功能
 */
import { tableRegistryInstance } from '../modules/js/table-registry.js';

describe('CUITableRegistry', () => {
    const tableId = 'unit-test-table';
    const config = { type: 'display', dataSource: '' };

    test('register and getData', () => {
        tableRegistryInstance.register(tableId, config);
        expect(tableRegistryInstance.getData(tableId)).toEqual([]);
    });

    test('setData and event dispatch', () => {
        const data = [{ col1: 'a' }, { col1: 'b' }];
        const mockHandler = jest.fn();
        const el = document.createElement('table');
        el.id = tableId;
        document.body.appendChild(el);
        el.addEventListener('cui-table-data-updated', mockHandler);
        tableRegistryInstance.setData(tableId, data);
        expect(tableRegistryInstance.getData(tableId)).toBe(data);
        expect(mockHandler).toHaveBeenCalled();
        document.body.removeChild(el);
    });
});
