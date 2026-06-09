/* 
 * Casting UI Framework
 * Version: 0.8.0
 * Module: scheduler.js
 * Description: 统一生命周期调度器，负责各个功能模块的分阶段加载与沙箱错误隔离
 * Copyright (c) 2026 Bingo工作室
 * Email: wljimmy@hotmail.com
 */

class LifecycleScheduler {
    constructor() {
        this.modules = new Map(); // 存储已注册的模块 { name: { config, status } }
        this.failedModules = new Set(); // 发生严重故障被强行隔离的模块名称
        this.stagesOrder = ['ENV', 'CORE', 'DOM_REGISTRY', 'INTERACTION', 'READY'];
        this.currentStage = null;
    }

    /**
     * 注册功能模块
     * @param {string} name 模块唯一标识符
     * @param {object} config 模块生命周期钩子配置 { stages: { ENV: fn, CORE: fn, ... } }
     */
    register(name, config) {
        if (this.modules.has(name)) {
            console.warn(`[CUI Scheduler] 模块名已存在，正在覆盖注册: ${name}`);
        }
        
        this.modules.set(name, {
            config: config || {},
            status: 'registered'
        });
        
        if (window.CUI && window.CUI.DEBUG_MODE) {
            console.log(`%c[CUI Scheduler] 模块已注册: ${name}`, 'color: #909399;');
        }
    }

    /**
     * 顺序运行生命周期 Pipeline
     */
    async runPipeline() {
        if (window.CUI && window.CUI.DEBUG_MODE) {
            console.log('%c[CUI Scheduler] 开始启动生命周期流水线 Pipeline...', 'color: #165DFF; font-weight: bold; font-size: 13px;');
        }

        for (const stage of this.stagesOrder) {
            this.currentStage = stage;
            
            if (window.CUI && window.CUI.DEBUG_MODE) {
                console.log(`%c[CUI Scheduler] ➔ 进入生命周期阶段: ${stage}`, 'color: #165DFF; font-weight: bold;');
            }

            for (const [name, module] of this.modules.entries()) {
                // 如果该模块已经在前面的某个阶段由于抛出异常被隔离，后续阶段全部跳过它
                if (this.failedModules.has(name)) {
                    continue;
                }

                // 级联依赖检查：如果上游依赖发生故障，当前模块级联被安全隔离停运，防止嵌套崩溃
                const deps = module.config.dependencies || [];
                const brokenDep = deps.find(dep => this.failedModules.has(dep));
                if (brokenDep) {
                    this.failedModules.add(name);
                    module.status = 'failed_cascade';
                    console.warn(
                        `%c[CUI Scheduler 级联隔离] 模块 "${name}" 已被安全停运！\n` +
                        `原因：其依赖的上游依赖模块 "${brokenDep}" 发生崩溃被隔离。\n` +
                        `依赖列表: [${deps.join(', ')}]`,
                        'color: #E6A23C; font-weight: bold; font-size: 11px;'
                    );
                    continue;
                }

                const hook = module.config.stages?.[stage];
                if (typeof hook === 'function') {
                    try {
                        module.status = `running_${stage}`;
                        await hook();
                        module.status = `completed_${stage}`;
                    } catch (error) {
                        this.handleModuleError(name, stage, error);
                    }
                }
            }
        }

        // 标记 Pipeline 完成
        this._pipelineComplete = true;
        
        // 触发 Pipeline 完成事件
        document.dispatchEvent(new CustomEvent('cui-pipeline-complete'));
        
        if (window.CUI && window.CUI.DEBUG_MODE) {
            console.log('%c[CUI Scheduler] ✔ 所有功能模块加载执行成功，CUI 已完全就位！', 'color: #67C23A; font-weight: bold; font-size: 13px;');
        }
    }

    /**
     * 沙箱故障捕获、控制台美化日志输出、开发弹窗强提示与模块强行隔离
     */
    handleModuleError(moduleName, stage, error) {
        // 1. 将故障模块记入隔离黑名单
        this.failedModules.add(moduleName);
        const module = this.modules.get(moduleName);
        if (module) {
            module.status = 'failed';
        }

        // 2. 打印极度详尽的红色日志
        console.error(
            `%c[Casting UI 运行期故障] 模块 "${moduleName}" 在生命周期 [${stage}] 阶段执行中崩溃！\n` +
            `该模块已被框架强制隔离，后续的生命周期方法将不再调用，以防干扰其余正常模块。\n` +
            `━━━━━━━━━━━━━━━━━━━━━━ 错误详情 ━━━━━━━━━━━━━━━━━━━━━━\n` +
            `● 模块名: ${moduleName}\n` +
            `● 故障阶段: ${stage}\n` +
            `● 详细信息: ${error.message}\n` +
            `● 堆栈信息:\n`,
            'color: #F56C6C; font-weight: bold; font-size: 13px;',
            error
        );

        // 3. 开发阶段（DEBUG_MODE开启）弹出原生强提示框，帮助开发者极速定位
        const isDebug = window.CUI && (window.CUI.DEBUG_MODE || window.CUI.env?.DEBUG_MODE);
        if (isDebug) {
            // 使用简短且格式化美观的弹框
            setTimeout(() => {
                alert(
                    `【Casting UI 运行期错误警报】\n` +
                    `────────────────────\n` +
                    `● 故障模块: ${moduleName}\n` +
                    `● 崩溃阶段: ${stage}\n` +
                    `● 错误原因: ${error.message}\n\n` +
                    `⚠️ 该模块已实施【强隔离沙箱处理】，其他健康模块将继续运行。\n` +
                    `请打开浏览器控制台(Console)排查具体的代码行号与堆栈。`
                );
            }, 0);
        }
    }
}

// 保证命名空间完整
window.CUI = window.CUI || {};

// 实例化全局唯一的调度器并提供外部注册 API
const scheduler = new LifecycleScheduler();
window.CUI.scheduler = scheduler;
window.CUI.registerModule = scheduler.register.bind(scheduler);

export { LifecycleScheduler, scheduler };
export default scheduler;
