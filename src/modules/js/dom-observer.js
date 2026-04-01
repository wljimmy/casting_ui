/* 
 * Casting UI Framework
 * Version: 0.5.0
 * Module: dom-observer.js
 * Description: 统一DOM变化监听模块，使用MutationObserver监测页面DOM变化
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

import { debug } from './core.js';

/**
 * DOMObserver 类
 * 
 * 统一的DOM变化监听模块，使用MutationObserver监测整个文档的DOM变化。
 * 支持注册两类事件处理函数：
 *  - 增加事件：当DOM元素被添加到页面时触发
 *  - 移除事件：当DOM元素从页面移除时触发
 * 
 * 设计目标：
 *  - 避免多个模块重复创建MutationObserver
 *  - 统一管理所有DOM变化监听
 *  - 各模块只需注册自己的选择器和处理函数
 */
class DOMObserver {
  /**
   * 构造函数
   * 初始化观察者实例，创建处理函数映射，并启动监听
   */
  constructor() {
    this.observer = null;           // MutationObserver实例
    this.addHandlers = new Map();    // 增加事件处理函数映射 { key: { selector, handler } }
    this.removeHandlers = new Map(); // 移除事件处理函数映射 { key: { selector, handler } }
    this.init();
  }

  /**
   * 初始化DOM观察器
   * 创建MutationObserver实例，配置观察选项，并开始观察document.body
   */
  init() {
    debug('DOMObserver初始化');

    // 创建MutationObserver实例，监听DOM变化
    this.observer = new MutationObserver(mutations => {
      const added = new Set();   // 收集所有新增的元素（包括子元素）
      const removed = new Set(); // 收集所有移除的元素（包括子元素）

      // 遍历所有mutation记录
      for (const mut of mutations) {
        // 收集新增元素及其所有子元素
        for (const node of mut.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            added.add(node);
            node.querySelectorAll('*').forEach(el => added.add(el));
          }
        }
        // 收集删除元素及其所有子元素
        for (const node of mut.removedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            removed.add(node);
            node.querySelectorAll('*').forEach(el => removed.add(el));
          }
        }
      }
      // 触发移除事件处理函数
      this.#trigger(removed, this.removeHandlers);
      // 触发增加事件处理函数
      this.#trigger(added, this.addHandlers);

    });

    // 开始观察document.body
    // childList: true - 监听子节点的添加/删除
    // subtree: true - 监听所有后代节点的变化
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });

    debug('DOM观察器已启动');
  }

  /**
   * 统一触发逻辑（私有方法）
   * 遍历元素集合，检查是否匹配选择器，匹配则调用对应的处理函数
   * 
   * @private
   * @param {Set<Element>} elements - 元素集合
   * @param {Map} handlers - 处理函数映射
   */
  #trigger(elements, handlers) {
    // 如果元素集合为空，直接返回
    if (elements.size === 0) return;

    // 遍历所有处理函数
    handlers.forEach(({ selector, handler }, key) => {
      // 遍历所有元素
      elements.forEach(el => {
        try {
          // 如果元素匹配选择器，则调用处理函数
          // 使用可选链操作符(?.)避免元素没有matches方法的情况
          el.matches?.(selector) && handler(el);
        } catch (e) {
          // 捕获并记录处理函数执行过程中的错误
          console.error(`处理事件失败 [${key}]:`, e);
        }
      });
    });
  }

  /**
   * 注册DOM元素增加事件
   * 当匹配selector的元素被添加到页面时，会调用handler函数
   * 
   * @param {string} key - 唯一标识，用于后续取消注册
   * @param {string} selector - CSS选择器，用于匹配目标元素
   * @param {Function} handler - 处理函数，参数为匹配的元素
   */
  onAdd(key, selector, handler) {
    this.addHandlers.set(key, { selector, handler });
    debug(`注册增加事件: ${key}`, null, { selector });
  }

  /**
   * 注册DOM元素移除事件
   * 当匹配selector的元素从页面移除时，会调用handler函数
   * 
   * @param {string} key - 唯一标识，用于后续取消注册
   * @param {string} selector - CSS选择器，用于匹配目标元素
   * @param {Function} handler - 处理函数，参数为匹配的元素
   */
  onRemove(key, selector, handler) {
    this.removeHandlers.set(key, { selector, handler });
    debug(`注册移除事件: ${key}`, null, { selector });
  }

  /**
   * 取消注册事件
   * 同时取消增加事件和移除事件的注册
   * 
   * @param {string} key - 要取消的事件标识
   */
  off(key) {
    this.addHandlers.delete(key);
    this.removeHandlers.delete(key);
    debug(`取消注册: ${key}`);
  }

  /**
   * 销毁DOM观察器
   * 停止观察，清空所有处理函数
   */
  destroy() {
    // 停止观察（使用可选链避免observer为null的情况）
    this.observer?.disconnect();
    // 清空处理函数映射
    this.addHandlers.clear();
    this.removeHandlers.clear();
    debug('DOMObserver已销毁');
  }
}

// 创建全局单例实例
const domObserver = new DOMObserver();

// 导出
export { domObserver, DOMObserver };

// 暴露到全局作用域，方便非模块化环境使用
window.CastingDOMObserver = domObserver;
