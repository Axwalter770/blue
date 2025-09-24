/**
 * 高级功能模块
 * 包含图片懒加载、虚拟滚动、动画效果、状态管理等专业功能
 */

// 状态管理模块
class StateManager {
    constructor() {
        this.state = {};
        this.listeners = {};
    }

    setState(key, value) {
        this.state[key] = value;
        this.notifyListeners(key, value);
    }

    getState(key) {
        return this.state[key];
    }

    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    }

    notifyListeners(key, value) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => callback(value));
        }
    }
}

// 全局状态管理器
const stateManager = new StateManager();

// 图片懒加载类
class LazyLoadImages {
    constructor(options = {}) {
        this.options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1,
            ...options
        };
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.options
            );
            this.observeImages();
        } else {
            // 回退方案
            this.loadAllImages();
        }
    }

    observeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.observer.observe(img));
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }

    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
    }
}

// 虚拟滚动类
class VirtualScroll {
    constructor(container, items, itemHeight, renderItem) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.renderItem = renderItem;
        this.visibleItems = [];
        this.scrollTop = 0;
        this.containerHeight = container.offsetHeight;
        this.totalHeight = items.length * itemHeight;
        
        this.init();
    }

    init() {
        this.container.style.height = `${this.totalHeight}px`;
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        
        this.container.addEventListener('scroll', this.handleScroll.bind(this));
        this.updateVisibleItems();
    }

    handleScroll() {
        this.scrollTop = this.container.scrollTop;
        this.updateVisibleItems();
    }

    updateVisibleItems() {
        const startIndex = Math.floor(this.scrollTop / this.itemHeight);
        const endIndex = Math.min(
            startIndex + Math.ceil(this.containerHeight / this.itemHeight) + 1,
            this.items.length
        );

        this.visibleItems = this.items.slice(startIndex, endIndex);
        this.render(startIndex);
    }

    render(startIndex) {
        this.container.innerHTML = '';
        
        this.visibleItems.forEach((item, index) => {
            const element = this.renderItem(item, startIndex + index);
            element.style.position = 'absolute';
            element.style.top = `${(startIndex + index) * this.itemHeight}px`;
            element.style.height = `${this.itemHeight}px`;
            this.container.appendChild(element);
        });
    }
}

// 动画效果类
class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.raf = null;
    }

    // 渐入动画
    fadeIn(element, duration = 500, delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transition = `opacity ${duration}ms ease-in-out`;
                element.style.opacity = '1';
                setTimeout(resolve, duration);
            }, delay);
        });
    }

    // 滑入动画
    slideIn(element, direction = 'up', duration = 500, delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                const transforms = {
                    up: 'translateY(50px)',
                    down: 'translateY(-50px)',
                    left: 'translateX(50px)',
                    right: 'translateX(-50px)'
                };

                element.style.transform = transforms[direction];
                element.style.opacity = '0';
                element.style.transition = `all ${duration}ms ease-out`;
                
                requestAnimationFrame(() => {
                    element.style.transform = 'translate(0)';
                    element.style.opacity = '1';
                });
                
                setTimeout(resolve, duration);
            }, delay);
        });
    }

    // 缩放动画
    scale(element, from = 0.8, to = 1, duration = 300) {
        return new Promise(resolve => {
            element.style.transform = `scale(${from})`;
            element.style.transition = `transform ${duration}ms ease-out`;
            
            requestAnimationFrame(() => {
                element.style.transform = `scale(${to})`;
            });
            
            setTimeout(resolve, duration);
        });
    }

    // 弹跳动画
    bounce(element, intensity = 0.1, duration = 600) {
        return new Promise(resolve => {
            const keyframes = [
                { transform: 'scale(1)', offset: 0 },
                { transform: `scale(${1 + intensity})`, offset: 0.5 },
                { transform: 'scale(1)', offset: 1 }
            ];

            const animation = element.animate(keyframes, {
                duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            animation.onfinish = resolve;
        });
    }

    // 序列动画
    sequence(animations) {
        return animations.reduce((promise, animation) => {
            return promise.then(() => animation());
        }, Promise.resolve());
    }

    // 并行动画
    parallel(animations) {
        return Promise.all(animations.map(animation => animation()));
    }
}

// 全局动画管理器
const animationManager = new AnimationManager();

// 滚动监听器类
class ScrollWatcher {
    constructor() {
        this.elements = new Map();
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    threshold: [0, 0.25, 0.5, 0.75, 1],
                    rootMargin: '-10px'
                }
            );
        }
    }

    watch(element, callback) {
        if (this.observer) {
            this.elements.set(element, callback);
            this.observer.observe(element);
        }
    }

    unwatch(element) {
        if (this.observer) {
            this.elements.delete(element);
            this.observer.unobserve(element);
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            const callback = this.elements.get(entry.target);
            if (callback) {
                callback(entry);
            }
        });
    }
}

// 全局滚动监听器
const scrollWatcher = new ScrollWatcher();

// 缓存管理器
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.maxSize = 100;
        this.ttl = 5 * 60 * 1000; // 5分钟
    }

    set(key, value, ttl = this.ttl) {
        const expiry = Date.now() + ttl;
        this.cache.set(key, { value, expiry });
        
        if (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    has(key) {
        return this.get(key) !== null;
    }

    clear() {
        this.cache.clear();
    }
}

// 全局缓存管理器
const cacheManager = new CacheManager();

// 网络状态监听器
class NetworkManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.listeners = [];
        this.init();
    }

    init() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.notifyListeners('online');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.notifyListeners('offline');
        });
    }

    onStatusChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(status) {
        this.listeners.forEach(callback => callback(status, this.isOnline));
    }

    async checkConnection() {
        try {
            const response = await fetch('/favicon.ico', {
                method: 'HEAD',
                cache: 'no-cache'
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}

// 全局网络管理器
const networkManager = new NetworkManager();

// 性能监控器
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
        this.init();
    }

    init() {
        if ('PerformanceObserver' in window) {
            this.observeNavigationTiming();
            this.observeResourceTiming();
            this.observeLargestContentfulPaint();
            this.observeFirstInputDelay();
        }
    }

    observeNavigationTiming() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.metrics.navigationTiming = {
                    domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                    loadComplete: entry.loadEventEnd - entry.loadEventStart,
                    pageLoad: entry.loadEventEnd - entry.navigationStart
                };
            });
        });
        observer.observe({ entryTypes: ['navigation'] });
        this.observers.push(observer);
    }

    observeResourceTiming() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            this.metrics.resources = entries.map(entry => ({
                name: entry.name,
                duration: entry.duration,
                size: entry.transferSize
            }));
        });
        observer.observe({ entryTypes: ['resource'] });
        this.observers.push(observer);
    }

    observeLargestContentfulPaint() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(observer);
    }

    observeFirstInputDelay() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
            });
        });
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.push(observer);
    }

    getMetrics() {
        return { ...this.metrics };
    }

    measureCustom(name, fn) {
        const start = performance.now();
        const result = fn();
        const duration = performance.now() - start;
        
        if (!this.metrics.custom) {
            this.metrics.custom = {};
        }
        this.metrics.custom[name] = duration;
        
        return result;
    }

    disconnect() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// 全局性能监控器
const performanceMonitor = new PerformanceMonitor();

// 表单验证器
class FormValidator {
    constructor() {
        this.rules = {};
        this.messages = {
            required: '此字段为必填项',
            email: '请输入有效的邮箱地址',
            phone: '请输入有效的手机号码',
            minLength: '长度不能少于{min}个字符',
            maxLength: '长度不能超过{max}个字符',
            pattern: '格式不正确'
        };
    }

    addRule(fieldName, rule) {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push(rule);
    }

    validate(formData) {
        const errors = {};
        
        for (const [fieldName, rules] of Object.entries(this.rules)) {
            const value = formData[fieldName];
            
            for (const rule of rules) {
                const error = this.validateRule(value, rule);
                if (error) {
                    if (!errors[fieldName]) {
                        errors[fieldName] = [];
                    }
                    errors[fieldName].push(error);
                    break; // 只显示第一个错误
                }
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    validateRule(value, rule) {
        switch (rule.type) {
            case 'required':
                if (!value || value.trim() === '') {
                    return this.messages.required;
                }
                break;
                
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailPattern.test(value)) {
                    return this.messages.email;
                }
                break;
                
            case 'phone':
                const phonePattern = /^1[3-9]\d{9}$/;
                if (value && !phonePattern.test(value)) {
                    return this.messages.phone;
                }
                break;
                
            case 'minLength':
                if (value && value.length < rule.value) {
                    return this.messages.minLength.replace('{min}', rule.value);
                }
                break;
                
            case 'maxLength':
                if (value && value.length > rule.value) {
                    return this.messages.maxLength.replace('{max}', rule.value);
                }
                break;
                
            case 'pattern':
                if (value && !rule.value.test(value)) {
                    return rule.message || this.messages.pattern;
                }
                break;
                
            case 'custom':
                return rule.validator(value);
        }
        
        return null;
    }
}

// 事件总线
class EventBus {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
}

// 全局事件总线
const eventBus = new EventBus();

// 工具函数
const Utils = {
    // 防抖函数
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 深拷贝
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },

    // 格式化日期
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    // 生成唯一ID
    generateId(prefix = '') {
        return prefix + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    },

    // 获取URL参数
    getUrlParams() {
        const params = {};
        const urlSearchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlSearchParams) {
            params[key] = value;
        }
        return params;
    },

    // 滚动到元素
    scrollToElement(element, offset = 0, behavior = 'smooth') {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior
        });
    },

    // 复制到剪贴板
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // 回退方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    },

    // 文件大小格式化
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// 初始化所有模块
document.addEventListener('DOMContentLoaded', () => {
    // 初始化图片懒加载
    new LazyLoadImages();
    
    // 初始化滚动动画
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
        scrollWatcher.watch(element, (entry) => {
            if (entry.isIntersecting && !element.classList.contains('animated')) {
                const animationType = element.getAttribute('data-animate');
                const delay = parseInt(element.getAttribute('data-delay') || '0');
                
                switch (animationType) {
                    case 'fadeIn':
                        animationManager.fadeIn(element, 500, delay);
                        break;
                    case 'slideIn':
                        const direction = element.getAttribute('data-direction') || 'up';
                        animationManager.slideIn(element, direction, 500, delay);
                        break;
                    case 'scale':
                        animationManager.scale(element, 0.8, 1, 500);
                        break;
                    case 'bounce':
                        animationManager.bounce(element, 0.1, 600);
                        break;
                }
                
                element.classList.add('animated');
            }
        });
    });
    
    // 发送页面加载完成事件
    eventBus.emit('pageLoaded', {
        url: window.location.href,
        timestamp: Date.now()
    });
});

// 导出到全局
window.StateManager = StateManager;
window.LazyLoadImages = LazyLoadImages;
window.VirtualScroll = VirtualScroll;
window.AnimationManager = AnimationManager;
window.ScrollWatcher = ScrollWatcher;
window.CacheManager = CacheManager;
window.NetworkManager = NetworkManager;
window.PerformanceMonitor = PerformanceMonitor;
window.FormValidator = FormValidator;
window.EventBus = EventBus;
window.Utils = Utils;

// 全局实例
window.stateManager = stateManager;
window.animationManager = animationManager;
window.scrollWatcher = scrollWatcher;
window.cacheManager = cacheManager;
window.networkManager = networkManager;
window.performanceMonitor = performanceMonitor;
window.eventBus = eventBus;

