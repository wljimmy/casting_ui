/*
 * Casting UI Framework
 * Version: 0.5.7
 * Module: index.js
 * Description: 模块入口文件，统一导入所有模块并启动生命周期 Pipeline
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

/**
 * 入口模块设计说明：
 * 
 * 1. 使用静态 import 语句，确保模块按顺序加载
 * 2. ES6 模块特性：所有 import 完成后才执行后续代码
 * 3. 所有模块注册完成后，启动 Pipeline
 * 4. 发布打包时，此文件作为入口，所有模块合并为单文件
 */

// ==============================
// 第一层：基础模块（无依赖）
// ==============================
import './env.js';           // 环境检测
import './scheduler.js';     // 生命周期调度器
import './utils.js';         // 工具函数

// ==============================
// 第二层：核心模块（依赖 scheduler）
// ==============================
import './core.js';          // 核心 API
import './dom-observer.js';  // DOM 观察器

// ==============================
// 第三层：基础组件（依赖 core, dom-observer）
// ==============================
import './template-engine.js';  // 模板引擎
import './ui.js';               // UI 基础组件
import './overlay.js';          // 遮罩层

// ==============================
// 第四层：功能组件（依赖基础组件）
// ==============================
import './modal.js';           // 弹窗
import './message.js';         // 消息提示
import './menu.js';            // 菜单
import './progress.js';        // 进度条
import './image-zoom.js';      // 图片放大
import './color-picker.js';    // 颜色选择器
import './theme-manager.js';   // 主题管理器
import './table.js';           // 表格组件（含注册表、数据层、渲染层、初始化模块）

// ==============================
// 第五层：表单组件（依赖功能组件）
// ==============================
import './form.js';            // 表单
import './input.js';           // 输入框

// ==============================
// 第六层：扩展模块（依赖表单组件）
// ==============================
import './location-data.js';      // 行政区划数据
import './idcard-validator.js';   // 身份证高级验证

// ==============================
// 启动生命周期 Pipeline
// ==============================
// 所有模块 import 完成后，执行以下代码
// 模块已通过 registerModule 注册到调度器
// 现在启动 Pipeline，按阶段执行各模块的生命周期钩子

if (window.CUI && window.CUI.scheduler) {
    window.CUI.scheduler.runPipeline().then(() => {
        console.log('[CUI] 框架初始化完成');
    }).catch(error => {
        console.error('[CUI] 框架初始化失败:', error);
    });
} else {
    console.warn('[CUI] 调度器未加载，框架无法启动');
}