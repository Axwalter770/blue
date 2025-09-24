/**
 * 移动端优化组件库
 * 专为手机用户体验设计的高级交互组件
 */

class MobileComponents {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isScrolling = false;
        this.components = new Map();
        
        this.init();
    }

    init() {
        this.detectMobile();
        this.setupTouchHandlers();
        this.initializeComponents();
        this.optimizeForMobile();
    }

    detectMobile() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isAndroid = /Android/.test(navigator.userAgent);
        
        // 添加设备类名
        document.body.classList.toggle('is-mobile', this.isMobile);
        document.body.classList.toggle('is-touch', this.isTouch);
        document.body.classList.toggle('is-ios', this.isIOS);
        document.body.classList.toggle('is-android', this.isAndroid);
    }

    setupTouchHandlers() {
        // 全局触摸事件处理
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
        this.isScrolling = false;
    }

    handleTouchMove(event) {
        if (!this.touchStartX || !this.touchStartY) return;

        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        const diffX = this.touchStartX - touchX;
        const diffY = this.touchStartY - touchY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // 水平滑动
            this.isScrolling = false;
        } else {
            // 垂直滑动
            this.isScrolling = true;
        }
    }

    handleTouchEnd(event) {
        if (!this.touchStartX || !this.touchStartY) return;

        this.touchEndX = event.changedTouches[0].clientX;
        this.touchEndY = event.changedTouches[0].clientY;

        this.detectSwipe();
        this.resetTouch();
    }

    detectSwipe() {
        const threshold = 50;
        const diffX = this.touchStartX - this.touchEndX;
        const diffY = this.touchStartY - this.touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                this.emitSwipe('left');
            } else {
                this.emitSwipe('right');
            }
        } else if (Math.abs(diffY) > threshold) {
            if (diffY > 0) {
                this.emitSwipe('up');
            } else {
                this.emitSwipe('down');
            }
        }
    }

    emitSwipe(direction) {
        const swipeEvent = new CustomEvent('mobileSwipe', {
            detail: { direction, touchStartX: this.touchStartX, touchStartY: this.touchStartY }
        });
        document.dispatchEvent(swipeEvent);
    }

    resetTouch() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
    }

    initializeComponents() {
        this.initBottomSheet();
        this.initPullToRefresh();
        this.initSwipeActions();
        this.initVirtualKeyboard();
        this.initHapticFeedback();
        this.initSafeArea();
    }

    // 底部抽屉组件
    initBottomSheet() {
        const bottomSheets = document.querySelectorAll('[data-bottom-sheet]');
        
        bottomSheets.forEach(sheet => {
            const bottomSheet = new BottomSheet(sheet);
            this.components.set(sheet, bottomSheet);
        });
    }

    // 下拉刷新组件
    initPullToRefresh() {
        const refreshContainers = document.querySelectorAll('[data-pull-refresh]');
        
        refreshContainers.forEach(container => {
            const pullRefresh = new PullToRefresh(container);
            this.components.set(container, pullRefresh);
        });
    }

    // 滑动操作组件
    initSwipeActions() {
        const swipeItems = document.querySelectorAll('[data-swipe-actions]');
        
        swipeItems.forEach(item => {
            const swipeAction = new SwipeAction(item);
            this.components.set(item, swipeAction);
        });
    }

    // 虚拟键盘处理
    initVirtualKeyboard() {
        if (this.isMobile) {
            this.virtualKeyboard = new VirtualKeyboardHandler();
        }
    }

    // 触觉反馈
    initHapticFeedback() {
        this.haptic = new HapticFeedback();
    }

    // 安全区域处理
    initSafeArea() {
        this.safeArea = new SafeAreaHandler();
    }

    optimizeForMobile() {
        if (!this.isMobile) return;

        // 优化点击延迟
        this.eliminateClickDelay();
        
        // 优化滚动性能
        this.optimizeScrolling();
        
        // 优化图片加载
        this.optimizeImages();
        
        // 优化表单输入
        this.optimizeForms();
    }

    eliminateClickDelay() {
        // 使用FastClick或类似的解决方案
        const style = document.createElement('style');
        style.textContent = `
            * {
                touch-action: manipulation;
            }
            
            button, [role="button"], input[type="submit"] {
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }
        `;
        document.head.appendChild(style);
    }

    optimizeScrolling() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: contain;
            }
            
            .scroll-container {
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(style);
    }

    optimizeImages() {
        // 为图片添加懒加载和响应式处理
        const images = document.querySelectorAll('img:not([data-optimized])');
        
        images.forEach(img => {
            img.setAttribute('data-optimized', 'true');
            
            // 添加加载状态
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            
            img.addEventListener('error', function() {
                this.classList.add('error');
            });
        });
    }

    optimizeForms() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // 优化输入类型
            if (input.type === 'tel') {
                input.setAttribute('inputmode', 'tel');
            } else if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
            } else if (input.type === 'number') {
                input.setAttribute('inputmode', 'numeric');
            }
            
            // 防止缩放
            input.addEventListener('focus', function() {
                if (this.getAttribute('data-no-zoom') !== null) {
                    const viewport = document.querySelector('meta[name=viewport]');
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.getAttribute('data-no-zoom') !== null) {
                    const viewport = document.querySelector('meta[name=viewport]');
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                }
            });
        });
    }
}

// 底部抽屉组件
class BottomSheet {
    constructor(element) {
        this.element = element;
        this.isOpen = false;
        this.startY = 0;
        this.currentY = 0;
        this.isDragging = false;
        
        this.init();
    }

    init() {
        this.element.style.transform = 'translateY(100%)';
        this.element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        this.setupEventListeners();
        this.createBackdrop();
    }

    setupEventListeners() {
        // 触摸事件
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // 触发器
        const triggers = document.querySelectorAll(`[data-bottom-sheet-trigger="${this.element.id}"]`);
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => this.open());
        });
    }

    createBackdrop() {
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'bottom-sheet-backdrop';
        this.backdrop.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        `;
        
        this.backdrop.addEventListener('click', () => this.close());
        document.body.appendChild(this.backdrop);
    }

    handleTouchStart(event) {
        this.startY = event.touches[0].clientY;
        this.isDragging = true;
        this.element.style.transition = 'none';
    }

    handleTouchMove(event) {
        if (!this.isDragging) return;
        
        this.currentY = event.touches[0].clientY;
        const deltaY = this.currentY - this.startY;
        
        if (deltaY > 0) {
            this.element.style.transform = `translateY(${deltaY}px)`;
        }
    }

    handleTouchEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        const deltaY = this.currentY - this.startY;
        
        if (deltaY > 100) {
            this.close();
        } else {
            this.element.style.transform = 'translateY(0)';
        }
    }

    open() {
        this.isOpen = true;
        this.element.style.transform = 'translateY(0)';
        this.backdrop.style.opacity = '1';
        this.backdrop.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        
        // 触觉反馈
        if (window.mobileComponents && window.mobileComponents.haptic) {
            window.mobileComponents.haptic.light();
        }
    }

    close() {
        this.isOpen = false;
        this.element.style.transform = 'translateY(100%)';
        this.backdrop.style.opacity = '0';
        this.backdrop.style.visibility = 'hidden';
        document.body.style.overflow = '';
        
        // 触觉反馈
        if (window.mobileComponents && window.mobileComponents.haptic) {
            window.mobileComponents.haptic.light();
        }
    }
}

// 下拉刷新组件
class PullToRefresh {
    constructor(container) {
        this.container = container;
        this.refreshThreshold = 80;
        this.startY = 0;
        this.currentY = 0;
        this.isPulling = false;
        this.isRefreshing = false;
        
        this.init();
    }

    init() {
        this.createRefreshIndicator();
        this.setupEventListeners();
    }

    createRefreshIndicator() {
        this.indicator = document.createElement('div');
        this.indicator.className = 'pull-refresh-indicator';
        this.indicator.innerHTML = `
            <div class="refresh-spinner">
                <i class="fas fa-sync-alt"></i>
            </div>
            <div class="refresh-text">下拉刷新</div>
        `;
        this.indicator.style.cssText = `
            position: absolute;
            top: -60px;
            left: 0;
            right: 0;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            transition: transform 0.3s ease;
        `;
        
        this.container.style.position = 'relative';
        this.container.insertBefore(this.indicator, this.container.firstChild);
    }

    setupEventListeners() {
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(event) {
        if (this.container.scrollTop === 0) {
            this.startY = event.touches[0].clientY;
            this.isPulling = true;
        }
    }

    handleTouchMove(event) {
        if (!this.isPulling || this.isRefreshing) return;
        
        this.currentY = event.touches[0].clientY;
        const deltaY = this.currentY - this.startY;
        
        if (deltaY > 0) {
            event.preventDefault();
            const pullDistance = Math.min(deltaY, this.refreshThreshold * 1.5);
            this.indicator.style.transform = `translateY(${pullDistance}px)`;
            
            if (pullDistance >= this.refreshThreshold) {
                this.indicator.classList.add('ready');
                this.indicator.querySelector('.refresh-text').textContent = '释放刷新';
            } else {
                this.indicator.classList.remove('ready');
                this.indicator.querySelector('.refresh-text').textContent = '下拉刷新';
            }
        }
    }

    handleTouchEnd() {
        if (!this.isPulling) return;
        
        this.isPulling = false;
        const deltaY = this.currentY - this.startY;
        
        if (deltaY >= this.refreshThreshold) {
            this.refresh();
        } else {
            this.indicator.style.transform = 'translateY(-60px)';
        }
    }

    async refresh() {
        this.isRefreshing = true;
        this.indicator.style.transform = 'translateY(0)';
        this.indicator.querySelector('.refresh-text').textContent = '刷新中...';
        this.indicator.querySelector('.refresh-spinner').style.animation = 'spin 1s linear infinite';
        
        // 触发自定义刷新事件
        const refreshEvent = new CustomEvent('pullRefresh', { bubbles: true });
        this.container.dispatchEvent(refreshEvent);
        
        // 模拟刷新延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.finishRefresh();
    }

    finishRefresh() {
        this.isRefreshing = false;
        this.indicator.style.transform = 'translateY(-60px)';
        this.indicator.querySelector('.refresh-text').textContent = '刷新完成';
        this.indicator.querySelector('.refresh-spinner').style.animation = '';
        this.indicator.classList.remove('ready');
        
        setTimeout(() => {
            this.indicator.querySelector('.refresh-text').textContent = '下拉刷新';
        }, 1000);
    }
}

// 滑动操作组件
class SwipeAction {
    constructor(element) {
        this.element = element;
        this.startX = 0;
        this.currentX = 0;
        this.isSwiping = false;
        this.threshold = 60;
        
        this.init();
    }

    init() {
        this.createActionButtons();
        this.setupEventListeners();
    }

    createActionButtons() {
        const actions = this.element.getAttribute('data-swipe-actions').split(',');
        
        this.actionsContainer = document.createElement('div');
        this.actionsContainer.className = 'swipe-actions';
        this.actionsContainer.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            display: flex;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = `swipe-action-btn swipe-action-${action}`;
            button.textContent = this.getActionText(action);
            button.style.cssText = `
                padding: 0 20px;
                background: ${this.getActionColor(action)};
                color: white;
                border: none;
                cursor: pointer;
            `;
            
            button.addEventListener('click', () => {
                const actionEvent = new CustomEvent('swipeAction', {
                    detail: { action, element: this.element }
                });
                document.dispatchEvent(actionEvent);
            });
            
            this.actionsContainer.appendChild(button);
        });
        
        this.element.style.position = 'relative';
        this.element.appendChild(this.actionsContainer);
    }

    getActionText(action) {
        const texts = {
            'delete': '删除',
            'edit': '编辑',
            'share': '分享',
            'archive': '归档'
        };
        return texts[action] || action;
    }

    getActionColor(action) {
        const colors = {
            'delete': '#ef4444',
            'edit': '#3b82f6',
            'share': '#10b981',
            'archive': '#f59e0b'
        };
        return colors[action] || '#6b7280';
    }

    setupEventListeners() {
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(event) {
        this.startX = event.touches[0].clientX;
        this.isSwiping = true;
        this.element.style.transition = 'none';
    }

    handleTouchMove(event) {
        if (!this.isSwiping) return;
        
        this.currentX = event.touches[0].clientX;
        const deltaX = this.startX - this.currentX;
        
        if (deltaX > 0) {
            const swipeDistance = Math.min(deltaX, this.actionsContainer.offsetWidth);
            this.element.style.transform = `translateX(-${swipeDistance}px)`;
        }
    }

    handleTouchEnd() {
        if (!this.isSwiping) return;
        
        this.isSwiping = false;
        this.element.style.transition = 'transform 0.3s ease';
        
        const deltaX = this.startX - this.currentX;
        
        if (deltaX >= this.threshold) {
            this.element.style.transform = `translateX(-${this.actionsContainer.offsetWidth}px)`;
        } else {
            this.element.style.transform = 'translateX(0)';
        }
    }
}

// 虚拟键盘处理
class VirtualKeyboardHandler {
    constructor() {
        this.initialViewportHeight = window.innerHeight;
        this.isKeyboardOpen = false;
        
        this.init();
    }

    init() {
        // 监听视窗高度变化
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // 监听输入框焦点
        document.addEventListener('focusin', this.handleFocusIn.bind(this));
        document.addEventListener('focusout', this.handleFocusOut.bind(this));
    }

    handleResize() {
        const currentHeight = window.innerHeight;
        const heightDifference = this.initialViewportHeight - currentHeight;
        
        if (heightDifference > 150) {
            // 键盘打开
            if (!this.isKeyboardOpen) {
                this.isKeyboardOpen = true;
                document.body.classList.add('keyboard-open');
                this.adjustLayout(heightDifference);
            }
        } else {
            // 键盘关闭
            if (this.isKeyboardOpen) {
                this.isKeyboardOpen = false;
                document.body.classList.remove('keyboard-open');
                this.resetLayout();
            }
        }
    }

    handleFocusIn(event) {
        if (this.isInputElement(event.target)) {
            event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    handleFocusOut() {
        // 延迟执行，避免键盘关闭时的闪烁
        setTimeout(() => {
            if (!document.activeElement || !this.isInputElement(document.activeElement)) {
                this.resetLayout();
            }
        }, 100);
    }

    isInputElement(element) {
        const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT'];
        return inputTypes.includes(element.tagName);
    }

    adjustLayout(keyboardHeight) {
        // 调整固定位置元素
        const fixedElements = document.querySelectorAll('.fixed-bottom, .selection-panel');
        fixedElements.forEach(element => {
            element.style.transform = `translateY(-${keyboardHeight}px)`;
        });
    }

    resetLayout() {
        const fixedElements = document.querySelectorAll('.fixed-bottom, .selection-panel');
        fixedElements.forEach(element => {
            element.style.transform = '';
        });
    }
}

// 触觉反馈
class HapticFeedback {
    constructor() {
        this.isSupported = 'vibrate' in navigator;
    }

    light() {
        if (this.isSupported) {
            navigator.vibrate(10);
        }
    }

    medium() {
        if (this.isSupported) {
            navigator.vibrate(20);
        }
    }

    heavy() {
        if (this.isSupported) {
            navigator.vibrate(30);
        }
    }

    success() {
        if (this.isSupported) {
            navigator.vibrate([10, 10, 10]);
        }
    }

    error() {
        if (this.isSupported) {
            navigator.vibrate([30, 10, 30]);
        }
    }

    selection() {
        if (this.isSupported) {
            navigator.vibrate(5);
        }
    }
}

// 安全区域处理
class SafeAreaHandler {
    constructor() {
        this.init();
    }

    init() {
        this.detectSafeArea();
        this.applySafeAreaStyles();
    }

    detectSafeArea() {
        // 检测是否有安全区域
        this.hasSafeArea = CSS.supports('padding-top: env(safe-area-inset-top)');
        
        if (this.hasSafeArea) {
            document.body.classList.add('has-safe-area');
        }
    }

    applySafeAreaStyles() {
        if (!this.hasSafeArea) return;
        
        const style = document.createElement('style');
        style.textContent = `
            .safe-area-top {
                padding-top: env(safe-area-inset-top);
            }
            
            .safe-area-bottom {
                padding-bottom: env(safe-area-inset-bottom);
            }
            
            .safe-area-left {
                padding-left: env(safe-area-inset-left);
            }
            
            .safe-area-right {
                padding-right: env(safe-area-inset-right);
            }
            
            .safe-area-inset {
                padding-top: env(safe-area-inset-top);
                padding-right: env(safe-area-inset-right);
                padding-bottom: env(safe-area-inset-bottom);
                padding-left: env(safe-area-inset-left);
            }
        `;
        document.head.appendChild(style);
    }
}

// 移动端性能优化工具
class MobilePerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.optimizeAnimations();
        this.optimizeScrolling();
        this.manageMemory();
    }

    optimizeImages() {
        // 根据设备像素比优化图片
        const pixelRatio = window.devicePixelRatio || 1;
        const images = document.querySelectorAll('img[data-responsive]');
        
        images.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                if (pixelRatio > 2) {
                    img.src = src.replace(/\.(jpg|png)$/, '@3x.$1');
                } else if (pixelRatio > 1) {
                    img.src = src.replace(/\.(jpg|png)$/, '@2x.$1');
                } else {
                    img.src = src;
                }
            }
        });
    }

    optimizeAnimations() {
        // 减少动画以提高性能
        if (this.isLowEndDevice()) {
            document.body.classList.add('reduce-animations');
            
            const style = document.createElement('style');
            style.textContent = `
                .reduce-animations *,
                .reduce-animations *::before,
                .reduce-animations *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    optimizeScrolling() {
        // 优化滚动性能
        const scrollContainers = document.querySelectorAll('.scroll-container');
        
        scrollContainers.forEach(container => {
            container.style.willChange = 'scroll-position';
            container.style.transform = 'translateZ(0)';
        });
    }

    manageMemory() {
        // 内存管理
        let memoryWarningShown = false;
        
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
                
                if (usageRatio > 0.8 && !memoryWarningShown) {
                    console.warn('High memory usage detected');
                    memoryWarningShown = true;
                    this.triggerGarbageCollection();
                }
            }, 10000);
        }
    }

    triggerGarbageCollection() {
        // 触发垃圾回收的建议
        if (window.gc) {
            window.gc();
        }
        
        // 清理不必要的事件监听器
        this.cleanupEventListeners();
    }

    cleanupEventListeners() {
        // 清理废弃的事件监听器
        const elements = document.querySelectorAll('[data-cleanup]');
        elements.forEach(element => {
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
        });
    }

    isLowEndDevice() {
        // 检测是否为低端设备
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        
        return memory <= 2 || cores <= 2;
    }
}

// 全局初始化
let mobileComponents;

document.addEventListener('DOMContentLoaded', () => {
    mobileComponents = new MobileComponents();
    
    // 性能优化
    new MobilePerformanceOptimizer();
    
    // 导出到全局
    window.mobileComponents = mobileComponents;
    window.MobileComponents = MobileComponents;
    window.BottomSheet = BottomSheet;
    window.PullToRefresh = PullToRefresh;
    window.SwipeAction = SwipeAction;
    window.HapticFeedback = HapticFeedback;
    
    console.log('Mobile components initialized');
});

// 添加移动端CSS
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    /* 移动端基础样式 */
    .is-mobile {
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    
    .is-touch button,
    .is-touch [role="button"] {
        min-height: 44px;
        min-width: 44px;
    }
    
    /* 触摸反馈 */
    .touch-feedback {
        position: relative;
        overflow: hidden;
    }
    
    .touch-feedback::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
    }
    
    .touch-feedback:active::after {
        width: 200px;
        height: 200px;
    }
    
    /* 安全区域 */
    @supports (padding-top: env(safe-area-inset-top)) {
        .safe-area-top {
            padding-top: env(safe-area-inset-top);
        }
        
        .safe-area-bottom {
            padding-bottom: env(safe-area-inset-bottom);
        }
    }
    
    /* 键盘适配 */
    .keyboard-open .fixed-bottom {
        transition: transform 0.3s ease;
    }
    
    /* 下拉刷新动画 */
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .refresh-spinner {
        transition: transform 0.3s ease;
    }
    
    .pull-refresh-indicator.ready .refresh-spinner {
        transform: rotate(180deg);
    }
`;

document.head.appendChild(mobileStyles);

