// 基础交互框架
class UI {
    constructor() {
        this.init();
    }

    init() {
        // 初始化所有交互组件
        this.initModals();
        this.initToasts();
        this.initImageZoom();
        this.initFormValidation();
        this.initCollapsePanels();
    }

    // 折叠面板相关
    initCollapsePanels() {
        const collapseHeaders = document.querySelectorAll('.collapse-header');
        collapseHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const panel = header.parentElement;
                panel.classList.toggle('active');
                const content = panel.querySelector('.collapse-content');
                const icon = header.querySelector('span');
                if (panel.classList.contains('active')) {
                    icon.textContent = '▲';
                } else {
                    icon.textContent = '▼';
                }
            });
        });
    }

    // 弹窗相关
    initModals() {
        // 弹窗基础逻辑
        this.modal = {
            show: (options) => {
                // 实现弹窗显示逻辑
            },
            hide: () => {
                // 实现弹窗隐藏逻辑
            }
        };
    }

    // Toast相关
    initToasts() {
        // Toast基础逻辑
        this.toast = {
            success: (message, options = {}) => {
                this.showToast('success', message, options);
            },
            error: (message, options = {}) => {
                this.showToast('error', message, options);
            },
            warning: (message, options = {}) => {
                this.showToast('warning', message, options);
            },
            info: (message, options = {}) => {
                this.showToast('info', message, options);
            },
            showToast: (type, message, options) => {
                // 实现Toast显示逻辑
            }
        };
    }

    // 全局函数，用于在HTML中调用
    window.showModal = function(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('show');
        }
    };

    window.hideModal = function(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('show');
        }
    };

    window.showToast = function(type, message, position = 'top') {
        // 创建Toast元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} toast-${position}`;
        toast.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}
                ${type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' : ''}
                ${type === 'warning' ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>' : ''}
                ${type === 'info' ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>' : ''}
            </svg>
            <span>${message}</span>
        `;
        
        // 添加到页面
        document.body.appendChild(toast);
        
        // 显示Toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // 3秒后隐藏并移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    };

    window.showLoading = function() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
            // 3秒后自动隐藏
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 3000);
        }
    };

    // 图片放大相关
    initImageZoom() {
        // 图片放大基础逻辑
        this.imageZoom = {
            init: () => {
                // 初始化图片点击放大功能
            },
            show: (imageSrc) => {
                // 实现图片放大显示逻辑
            },
            hide: () => {
                // 实现图片放大隐藏逻辑
            }
        };
    }

    // 图片放大全局函数
    window.zoomImage = function(src) {
        const overlay = document.getElementById('imageZoomOverlay');
        const content = document.getElementById('imageZoomContent');
        if (overlay && content) {
            content.src = src;
            overlay.classList.add('show');
        }
    };

    window.closeImageZoom = function() {
        const overlay = document.getElementById('imageZoomOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    };

    // 点击遮罩关闭图片放大
    document.addEventListener('click', function(e) {
        const overlay = document.getElementById('imageZoomOverlay');
        if (overlay && e.target === overlay) {
            overlay.classList.remove('show');
        }
    });

    // 表单验证相关
    initFormValidation() {
        // 表单验证基础逻辑
        this.formValidation = {
            validate: (form) => {
                // 实现表单验证逻辑
            },
            addRule: (field, rule, message) => {
                // 添加验证规则
            }
        };
    }
}

// 初始化UI框架
const ui = new UI();

// 导出UI实例
export default ui;