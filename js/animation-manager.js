/**
 * 高级动画管理器
 * 专业的动画控制和序列管理系统
 */

class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.timelines = new Map();
        this.observers = new Map();
        this.animationQueue = [];
        this.isPlaying = false;
        this.globalSpeed = 1;
        this.presets = new Map();
        this.easing = new Map();
        
        this.init();
    }

    init() {
        this.setupEasingFunctions();
        this.setupPresets();
        this.setupIntersectionObserver();
        this.setupPerformanceOptimization();
    }

    setupEasingFunctions() {
        // 经典缓动函数
        this.easing.set('linear', t => t);
        this.easing.set('easeInQuad', t => t * t);
        this.easing.set('easeOutQuad', t => t * (2 - t));
        this.easing.set('easeInOutQuad', t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
        this.easing.set('easeInCubic', t => t * t * t);
        this.easing.set('easeOutCubic', t => --t * t * t + 1);
        this.easing.set('easeInOutCubic', t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);
        this.easing.set('easeInQuart', t => t * t * t * t);
        this.easing.set('easeOutQuart', t => 1 - --t * t * t * t);
        this.easing.set('easeInOutQuart', t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t);
        this.easing.set('easeInQuint', t => t * t * t * t * t);
        this.easing.set('easeOutQuint', t => 1 + --t * t * t * t * t);
        this.easing.set('easeInOutQuint', t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t);
        
        // 弹性缓动
        this.easing.set('easeInElastic', t => {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
        });
        
        this.easing.set('easeOutElastic', t => {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        });
        
        this.easing.set('easeInOutElastic', t => {
            const c5 = (2 * Math.PI) / 4.5;
            return t === 0 ? 0 : t === 1 ? 1 : t < 0.5
                ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
                : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
        });
        
        // 回弹缓动
        this.easing.set('easeInBounce', t => 1 - this.easing.get('easeOutBounce')(1 - t));
        
        this.easing.set('easeOutBounce', t => {
            const n1 = 7.5625;
            const d1 = 2.75;
            
            if (t < 1 / d1) {
                return n1 * t * t;
            } else if (t < 2 / d1) {
                return n1 * (t -= 1.5 / d1) * t + 0.75;
            } else if (t < 2.5 / d1) {
                return n1 * (t -= 2.25 / d1) * t + 0.9375;
            } else {
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        });
        
        this.easing.set('easeInOutBounce', t => {
            return t < 0.5
                ? (1 - this.easing.get('easeOutBounce')(1 - 2 * t)) / 2
                : (1 + this.easing.get('easeOutBounce')(2 * t - 1)) / 2;
        });
        
        // 自定义缓动
        this.easing.set('easeInBack', t => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return c3 * t * t * t - c1 * t * t;
        });
        
        this.easing.set('easeOutBack', t => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        });
        
        this.easing.set('easeInOutBack', t => {
            const c1 = 1.70158;
            const c2 = c1 * 1.525;
            return t < 0.5
                ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
                : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
        });
    }

    setupPresets() {
        // 淡入淡出预设
        this.presets.set('fadeIn', {
            keyframes: [
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ],
            options: { duration: 600, easing: 'easeOutCubic' }
        });

        this.presets.set('fadeOut', {
            keyframes: [
                { opacity: 1, transform: 'translateY(0)' },
                { opacity: 0, transform: 'translateY(-20px)' }
            ],
            options: { duration: 400, easing: 'easeInCubic' }
        });

        // 滑动预设
        this.presets.set('slideInLeft', {
            keyframes: [
                { transform: 'translateX(-100%)', opacity: 0 },
                { transform: 'translateX(0)', opacity: 1 }
            ],
            options: { duration: 500, easing: 'easeOutBack' }
        });

        this.presets.set('slideInRight', {
            keyframes: [
                { transform: 'translateX(100%)', opacity: 0 },
                { transform: 'translateX(0)', opacity: 1 }
            ],
            options: { duration: 500, easing: 'easeOutBack' }
        });

        this.presets.set('slideInUp', {
            keyframes: [
                { transform: 'translateY(100%)', opacity: 0 },
                { transform: 'translateY(0)', opacity: 1 }
            ],
            options: { duration: 600, easing: 'easeOutCubic' }
        });

        this.presets.set('slideInDown', {
            keyframes: [
                { transform: 'translateY(-100%)', opacity: 0 },
                { transform: 'translateY(0)', opacity: 1 }
            ],
            options: { duration: 600, easing: 'easeOutCubic' }
        });

        // 缩放预设
        this.presets.set('scaleIn', {
            keyframes: [
                { transform: 'scale(0)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 }
            ],
            options: { duration: 400, easing: 'easeOutBack' }
        });

        this.presets.set('scaleOut', {
            keyframes: [
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0)', opacity: 0 }
            ],
            options: { duration: 300, easing: 'easeInBack' }
        });

        // 旋转预设
        this.presets.set('rotateIn', {
            keyframes: [
                { transform: 'rotate(-180deg) scale(0)', opacity: 0 },
                { transform: 'rotate(0deg) scale(1)', opacity: 1 }
            ],
            options: { duration: 600, easing: 'easeOutElastic' }
        });

        this.presets.set('flipIn', {
            keyframes: [
                { transform: 'perspective(400px) rotateY(-90deg)', opacity: 0 },
                { transform: 'perspective(400px) rotateY(0deg)', opacity: 1 }
            ],
            options: { duration: 600, easing: 'easeOutBack' }
        });

        // 弹跳预设
        this.presets.set('bounceIn', {
            keyframes: [
                { transform: 'scale(0.3)', opacity: 0 },
                { transform: 'scale(1.05)' },
                { transform: 'scale(0.9)' },
                { transform: 'scale(1)', opacity: 1 }
            ],
            options: { duration: 600, easing: 'easeOutBounce' }
        });

        this.presets.set('bounceOut', {
            keyframes: [
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0.9)' },
                { transform: 'scale(1.05)' },
                { transform: 'scale(0.3)', opacity: 0 }
            ],
            options: { duration: 400, easing: 'easeInBounce' }
        });

        // 震动预设
        this.presets.set('shake', {
            keyframes: [
                { transform: 'translateX(0)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ],
            options: { duration: 600, easing: 'linear' }
        });

        // 脉冲预设
        this.presets.set('pulse', {
            keyframes: [
                { transform: 'scale(1)' },
                { transform: 'scale(1.05)' },
                { transform: 'scale(1)' }
            ],
            options: { duration: 1000, easing: 'easeInOutQuad', iterations: Infinity }
        });

        // 呼吸效果
        this.presets.set('breathe', {
            keyframes: [
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0.7, transform: 'scale(1.02)' },
                { opacity: 1, transform: 'scale(1)' }
            ],
            options: { duration: 2000, easing: 'easeInOutQuad', iterations: Infinity }
        });

        // 浮动效果
        this.presets.set('float', {
            keyframes: [
                { transform: 'translateY(0px)' },
                { transform: 'translateY(-10px)' },
                { transform: 'translateY(0px)' }
            ],
            options: { duration: 3000, easing: 'easeInOutQuad', iterations: Infinity }
        });

        // 摆动效果
        this.presets.set('swing', {
            keyframes: [
                { transform: 'rotate(0deg)' },
                { transform: 'rotate(10deg)' },
                { transform: 'rotate(-10deg)' },
                { transform: 'rotate(5deg)' },
                { transform: 'rotate(-5deg)' },
                { transform: 'rotate(0deg)' }
            ],
            options: { duration: 1000, easing: 'easeInOutQuad' }
        });

        // 橡皮筋效果
        this.presets.set('rubberBand', {
            keyframes: [
                { transform: 'scale(1)' },
                { transform: 'scale(1.25, 0.75)' },
                { transform: 'scale(0.75, 1.25)' },
                { transform: 'scale(1.15, 0.85)' },
                { transform: 'scale(0.95, 1.05)' },
                { transform: 'scale(1)' }
            ],
            options: { duration: 1000, easing: 'easeOutElastic' }
        });

        // 打字机效果
        this.presets.set('typewriter', {
            keyframes: [
                { width: '0%' },
                { width: '100%' }
            ],
            options: { duration: 2000, easing: 'linear' }
        });

        // 渐进模糊
        this.presets.set('blurIn', {
            keyframes: [
                { filter: 'blur(20px)', opacity: 0 },
                { filter: 'blur(0px)', opacity: 1 }
            ],
            options: { duration: 800, easing: 'easeOutCubic' }
        });

        // 色彩变换
        this.presets.set('colorShift', {
            keyframes: [
                { filter: 'hue-rotate(0deg)' },
                { filter: 'hue-rotate(360deg)' }
            ],
            options: { duration: 3000, easing: 'linear', iterations: Infinity }
        });
    }

    setupIntersectionObserver() {
        // 可见性观察器，用于触发滚动动画
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationName = element.dataset.scrollAnimation;
                    const delay = parseInt(element.dataset.scrollDelay) || 0;
                    
                    if (animationName) {
                        setTimeout(() => {
                            this.animate(element, animationName);
                        }, delay);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    setupPerformanceOptimization() {
        // 性能监控
        this.performanceMonitor = {
            frameCount: 0,
            lastTime: 0,
            fps: 60,
            isLowPerformance: false
        };

        // 监控帧率
        const monitorFPS = (currentTime) => {
            this.performanceMonitor.frameCount++;
            
            if (currentTime - this.performanceMonitor.lastTime >= 1000) {
                this.performanceMonitor.fps = this.performanceMonitor.frameCount;
                this.performanceMonitor.frameCount = 0;
                this.performanceMonitor.lastTime = currentTime;
                
                // 检测性能
                this.performanceMonitor.isLowPerformance = this.performanceMonitor.fps < 30;
                
                if (this.performanceMonitor.isLowPerformance) {
                    this.optimizeForLowPerformance();
                }
            }
            
            requestAnimationFrame(monitorFPS);
        };
        
        requestAnimationFrame(monitorFPS);
    }

    // 动画播放方法
    animate(element, presetName, customOptions = {}) {
        const preset = this.presets.get(presetName);
        if (!preset) {
            console.warn(`Animation preset "${presetName}" not found`);
            return Promise.reject(new Error(`Animation preset "${presetName}" not found`));
        }

        const options = { ...preset.options, ...customOptions };
        const keyframes = preset.keyframes;

        // 应用全局速度
        if (options.duration) {
            options.duration = options.duration / this.globalSpeed;
        }

        // 性能优化
        if (this.performanceMonitor.isLowPerformance) {
            options.duration = Math.min(options.duration || 0, 300);
        }

        // 创建动画ID
        const animationId = `${element.id || 'element'}_${Date.now()}_${Math.random()}`;

        // 使用Web Animations API
        const animation = element.animate(keyframes, options);
        
        // 存储动画引用
        this.animations.set(animationId, {
            animation,
            element,
            preset: presetName,
            startTime: Date.now()
        });

        // 清理完成的动画
        animation.addEventListener('finish', () => {
            this.animations.delete(animationId);
        });

        animation.addEventListener('cancel', () => {
            this.animations.delete(animationId);
        });

        return animation.finished;
    }

    // 创建动画时间线
    createTimeline(name) {
        const timeline = {
            animations: [],
            totalDuration: 0,
            isPlaying: false,
            currentTime: 0
        };
        
        this.timelines.set(name, timeline);
        return new AnimationTimeline(timeline, this);
    }

    // 批量动画
    animateSequence(elements, presetName, options = {}) {
        const { stagger = 100, direction = 'normal' } = options;
        const promises = [];
        
        const elementsArray = Array.from(elements);
        if (direction === 'reverse') {
            elementsArray.reverse();
        }
        
        elementsArray.forEach((element, index) => {
            const delay = index * stagger;
            const customOptions = { ...options, delay };
            
            setTimeout(() => {
                const promise = this.animate(element, presetName, customOptions);
                promises.push(promise);
            }, delay);
        });
        
        return Promise.all(promises);
    }

    // 动画组合
    animateGroup(animations) {
        const promises = animations.map(({ element, preset, options = {} }) => {
            return this.animate(element, preset, options);
        });
        
        return Promise.all(promises);
    }

    // 暂停所有动画
    pauseAll() {
        this.animations.forEach(({ animation }) => {
            animation.pause();
        });
        this.isPlaying = false;
    }

    // 恢复所有动画
    resumeAll() {
        this.animations.forEach(({ animation }) => {
            animation.play();
        });
        this.isPlaying = true;
    }

    // 停止所有动画
    stopAll() {
        this.animations.forEach(({ animation }) => {
            animation.cancel();
        });
        this.animations.clear();
        this.isPlaying = false;
    }

    // 设置全局速度
    setGlobalSpeed(speed) {
        this.globalSpeed = Math.max(0.1, Math.min(5, speed));
        
        // 更新当前播放的动画速度
        this.animations.forEach(({ animation }) => {
            animation.playbackRate = this.globalSpeed;
        });
    }

    // 注册滚动动画
    registerScrollAnimation(element, animationName, options = {}) {
        element.dataset.scrollAnimation = animationName;
        if (options.delay) {
            element.dataset.scrollDelay = options.delay;
        }
        
        this.intersectionObserver.observe(element);
    }

    // 注销滚动动画
    unregisterScrollAnimation(element) {
        this.intersectionObserver.unobserve(element);
        delete element.dataset.scrollAnimation;
        delete element.dataset.scrollDelay;
    }

    // 低性能优化
    optimizeForLowPerformance() {
        // 减少动画复杂度
        this.animations.forEach(({ animation, element }) => {
            if (animation.playState === 'running') {
                animation.playbackRate = 2; // 加速动画
            }
        });
        
        // 禁用某些高消耗动画
        const highCostAnimations = ['blurIn', 'colorShift'];
        highCostAnimations.forEach(name => {
            if (this.presets.has(name)) {
                const preset = this.presets.get(name);
                preset.options.duration = Math.min(preset.options.duration, 300);
            }
        });
    }

    // 性能统计
    getPerformanceStats() {
        return {
            fps: this.performanceMonitor.fps,
            activeAnimations: this.animations.size,
            isLowPerformance: this.performanceMonitor.isLowPerformance,
            globalSpeed: this.globalSpeed
        };
    }

    // 添加自定义预设
    addPreset(name, preset) {
        this.presets.set(name, preset);
    }

    // 移除预设
    removePreset(name) {
        this.presets.delete(name);
    }

    // 获取所有预设
    getPresets() {
        return Array.from(this.presets.keys());
    }

    // 添加自定义缓动函数
    addEasing(name, func) {
        this.easing.set(name, func);
    }

    // 清理资源
    destroy() {
        this.stopAll();
        this.intersectionObserver.disconnect();
        this.animations.clear();
        this.timelines.clear();
        this.observers.clear();
    }
}

// 动画时间线类
class AnimationTimeline {
    constructor(timeline, manager) {
        this.timeline = timeline;
        this.manager = manager;
    }

    add(element, presetName, options = {}) {
        const delay = options.delay || 0;
        const duration = options.duration || 1000;
        
        this.timeline.animations.push({
            element,
            presetName,
            options,
            startTime: this.timeline.totalDuration + delay
        });
        
        this.timeline.totalDuration = Math.max(
            this.timeline.totalDuration,
            this.timeline.totalDuration + delay + duration
        );
        
        return this;
    }

    play() {
        if (this.timeline.isPlaying) return Promise.resolve();
        
        this.timeline.isPlaying = true;
        this.timeline.currentTime = 0;
        
        const promises = this.timeline.animations.map(animation => {
            return new Promise(resolve => {
                setTimeout(() => {
                    this.manager.animate(
                        animation.element,
                        animation.presetName,
                        animation.options
                    ).then(resolve);
                }, animation.startTime);
            });
        });
        
        return Promise.all(promises).then(() => {
            this.timeline.isPlaying = false;
        });
    }

    pause() {
        this.timeline.isPlaying = false;
        // 暂停逻辑
    }

    stop() {
        this.timeline.isPlaying = false;
        this.timeline.currentTime = 0;
        // 停止逻辑
    }

    reset() {
        this.timeline.animations = [];
        this.timeline.totalDuration = 0;
        this.timeline.currentTime = 0;
    }
}

// 动画辅助工具
class AnimationUtils {
    static createCustomAnimation(keyframes, options) {
        return { keyframes, options };
    }

    static interpolate(start, end, progress) {
        return start + (end - start) * progress;
    }

    static parseTransform(transformString) {
        const transforms = {};
        const regex = /(\w+)\(([^)]*)\)/g;
        let match;
        
        while ((match = regex.exec(transformString)) !== null) {
            transforms[match[1]] = match[2];
        }
        
        return transforms;
    }

    static combineTransforms(transforms) {
        return Object.entries(transforms)
            .map(([key, value]) => `${key}(${value})`)
            .join(' ');
    }

    static getElementCenter(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    static isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );
    }

    static waitForAnimationFrame() {
        return new Promise(resolve => requestAnimationFrame(resolve));
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 全局实例
let animationManager;

document.addEventListener('DOMContentLoaded', () => {
    animationManager = new AnimationManager();
    
    // 自动注册具有动画属性的元素
    document.querySelectorAll('[data-animation]').forEach(element => {
        const animationName = element.dataset.animation;
        const delay = parseInt(element.dataset.animationDelay) || 0;
        const trigger = element.dataset.animationTrigger || 'scroll';
        
        if (trigger === 'scroll') {
            animationManager.registerScrollAnimation(element, animationName, { delay });
        } else if (trigger === 'immediate') {
            setTimeout(() => {
                animationManager.animate(element, animationName);
            }, delay);
        }
    });
    
    // 导出到全局
    window.animationManager = animationManager;
    window.AnimationManager = AnimationManager;
    window.AnimationTimeline = AnimationTimeline;
    window.AnimationUtils = AnimationUtils;
    
    console.log('Animation Manager initialized');
});

// 清理资源
window.addEventListener('beforeunload', () => {
    if (animationManager) {
        animationManager.destroy();
    }
});
