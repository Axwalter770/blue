/**
 * 高级数据分析系统
 * 包含用户行为追踪、访问统计、热力图、A/B测试等功能
 */

class AnalyticsManager {
    constructor(options = {}) {
        this.options = {
            trackPageViews: true,
            trackClicks: true,
            trackScrolling: true,
            trackFormSubmissions: true,
            trackErrors: true,
            enableHeatmap: true,
            sessionTimeout: 30 * 60 * 1000, // 30分钟
            apiEndpoint: '/api/analytics',
            batchSize: 10,
            flushInterval: 5000, // 5秒
            ...options
        };

        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.events = [];
        this.heatmapData = [];
        this.performanceData = {};
        this.userAgent = this.parseUserAgent();
        this.viewport = this.getViewport();
        
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.setupEventListeners();
        this.startPerformanceMonitoring();
        this.setupPeriodicFlush();
        
        if (this.options.enableHeatmap) {
            this.initHeatmap();
        }
        
        console.log('Analytics: 初始化完成', {
            sessionId: this.sessionId,
            userId: this.userId
        });
    }

    // 生成会话ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 获取用户ID
    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }

    // 解析用户代理
    parseUserAgent() {
        const ua = navigator.userAgent;
        return {
            browser: this.getBrowser(ua),
            os: this.getOS(ua),
            device: this.getDevice(ua),
            isMobile: /Mobi|Android/i.test(ua),
            isTablet: /Tablet|iPad/i.test(ua)
        };
    }

    getBrowser(ua) {
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    getOS(ua) {
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Unknown';
    }

    getDevice(ua) {
        if (/Mobi|Android/i.test(ua)) return 'Mobile';
        if (/Tablet|iPad/i.test(ua)) return 'Tablet';
        return 'Desktop';
    }

    // 获取视窗信息
    getViewport() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            screenWidth: screen.width,
            screenHeight: screen.height,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio
        };
    }

    // 追踪页面加载
    trackPageLoad() {
        const event = {
            type: 'page_view',
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            timestamp: Date.now(),
            viewport: this.viewport,
            userAgent: this.userAgent,
            loadTime: this.getPageLoadTime()
        };

        this.track(event);
    }

    // 获取页面加载时间
    getPageLoadTime() {
        if (performance.timing) {
            return performance.timing.loadEventEnd - performance.timing.navigationStart;
        }
        return null;
    }

    // 设置事件监听器
    setupEventListeners() {
        // 点击事件
        if (this.options.trackClicks) {
            document.addEventListener('click', (e) => {
                this.trackClick(e);
            });
        }

        // 滚动事件
        if (this.options.trackScrolling) {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.trackScroll();
                }, 100);
            });
        }

        // 表单提交事件
        if (this.options.trackFormSubmissions) {
            document.addEventListener('submit', (e) => {
                this.trackFormSubmission(e);
            });
        }

        // 错误事件
        if (this.options.trackErrors) {
            window.addEventListener('error', (e) => {
                this.trackError(e);
            });

            window.addEventListener('unhandledrejection', (e) => {
                this.trackPromiseRejection(e);
            });
        }

        // 页面卸载事件
        window.addEventListener('beforeunload', () => {
            this.flush();
        });

        // 页面隐藏事件
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackPageHide();
            } else {
                this.trackPageShow();
            }
        });

        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.viewport = this.getViewport();
            this.trackViewportChange();
        });
    }

    // 追踪点击事件
    trackClick(event) {
        const element = event.target;
        const rect = element.getBoundingClientRect();
        
        const clickData = {
            type: 'click',
            element: {
                tagName: element.tagName,
                id: element.id,
                className: element.className,
                text: element.textContent?.substring(0, 100),
                href: element.href
            },
            position: {
                x: event.clientX,
                y: event.clientY,
                pageX: event.pageX,
                pageY: event.pageY
            },
            elementPosition: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            },
            timestamp: Date.now()
        };

        this.track(clickData);

        // 热力图数据
        if (this.options.enableHeatmap) {
            this.addHeatmapPoint(event.pageX, event.pageY);
        }
    }

    // 追踪滚动事件
    trackScroll() {
        const scrollData = {
            type: 'scroll',
            scrollTop: window.pageYOffset,
            scrollLeft: window.pageXOffset,
            documentHeight: document.documentElement.scrollHeight,
            viewportHeight: window.innerHeight,
            scrollPercentage: Math.round(
                (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            ),
            timestamp: Date.now()
        };

        this.track(scrollData);
    }

    // 追踪表单提交
    trackFormSubmission(event) {
        const form = event.target;
        const formData = new FormData(form);
        const fields = {};
        
        for (let [key, value] of formData.entries()) {
            // 不记录敏感信息
            if (!this.isSensitiveField(key)) {
                fields[key] = typeof value === 'string' ? value.substring(0, 100) : 'file';
            }
        }

        const submissionData = {
            type: 'form_submission',
            formId: form.id,
            formAction: form.action,
            formMethod: form.method,
            fieldCount: Object.keys(fields).length,
            fields: fields,
            timestamp: Date.now()
        };

        this.track(submissionData);
    }

    // 检查是否为敏感字段
    isSensitiveField(fieldName) {
        const sensitiveFields = ['password', 'credit_card', 'ssn', 'social_security'];
        return sensitiveFields.some(field => 
            fieldName.toLowerCase().includes(field)
        );
    }

    // 追踪错误
    trackError(event) {
        const errorData = {
            type: 'javascript_error',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now()
        };

        this.track(errorData);
    }

    // 追踪Promise拒绝
    trackPromiseRejection(event) {
        const rejectionData = {
            type: 'promise_rejection',
            reason: event.reason?.toString(),
            stack: event.reason?.stack,
            url: window.location.href,
            timestamp: Date.now()
        };

        this.track(rejectionData);
    }

    // 追踪页面隐藏
    trackPageHide() {
        const hideData = {
            type: 'page_hide',
            timeOnPage: Date.now() - this.pageLoadTime,
            timestamp: Date.now()
        };

        this.track(hideData);
    }

    // 追踪页面显示
    trackPageShow() {
        const showData = {
            type: 'page_show',
            timestamp: Date.now()
        };

        this.track(showData);
    }

    // 追踪视窗变化
    trackViewportChange() {
        const viewportData = {
            type: 'viewport_change',
            viewport: this.viewport,
            timestamp: Date.now()
        };

        this.track(viewportData);
    }

    // 性能监控
    startPerformanceMonitoring() {
        // 监控页面性能
        if ('PerformanceObserver' in window) {
            this.observePerformance();
        }

        // 监控资源加载
        this.monitorResourceLoading();
        
        // 监控内存使用
        this.monitorMemoryUsage();
    }

    observePerformance() {
        // 观察导航性能
        const navObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.performanceData.navigation = {
                    domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                    loadComplete: entry.loadEventEnd - entry.loadEventStart,
                    pageLoad: entry.loadEventEnd - entry.navigationStart,
                    firstPaint: entry.firstPaint,
                    firstContentfulPaint: entry.firstContentfulPaint
                };
            });
        });

        try {
            navObserver.observe({ entryTypes: ['navigation'] });
        } catch (e) {
            console.log('Navigation timing not supported');
        }

        // 观察最大内容绘制
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.performanceData.lcp = lastEntry.startTime;
        });

        try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('LCP not supported');
        }

        // 观察首次输入延迟
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.performanceData.fid = entry.processingStart - entry.startTime;
            });
        });

        try {
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.log('FID not supported');
        }
    }

    monitorResourceLoading() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            const resourceData = resources.map(resource => ({
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize,
                type: resource.initiatorType
            }));

            this.track({
                type: 'resource_performance',
                resources: resourceData,
                timestamp: Date.now()
            });
        });
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.performanceData.memory = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit
                };

                // 如果内存使用过高，发送警告
                if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
                    this.track({
                        type: 'memory_warning',
                        memoryUsage: this.performanceData.memory,
                        timestamp: Date.now()
                    });
                }
            }, 30000); // 每30秒检查一次
        }
    }

    // 热力图功能
    initHeatmap() {
        this.heatmapData = [];
    }

    addHeatmapPoint(x, y) {
        this.heatmapData.push({
            x: x,
            y: y,
            timestamp: Date.now()
        });

        // 限制热力图数据量
        if (this.heatmapData.length > 1000) {
            this.heatmapData = this.heatmapData.slice(-500);
        }
    }

    generateHeatmap() {
        if (!this.heatmapData.length) return null;

        // 创建热力图画布
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
        const ctx = canvas.getContext('2d');

        // 绘制热力图点
        this.heatmapData.forEach(point => {
            const gradient = ctx.createRadialGradient(
                point.x, point.y, 0,
                point.x, point.y, 50
            );
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(point.x - 50, point.y - 50, 100, 100);
        });

        return canvas.toDataURL();
    }

    // A/B测试功能
    setupABTest(testName, variants) {
        const testKey = `ab_test_${testName}`;
        let variant = localStorage.getItem(testKey);

        if (!variant) {
            variant = variants[Math.floor(Math.random() * variants.length)];
            localStorage.setItem(testKey, variant);
        }

        this.track({
            type: 'ab_test_assignment',
            testName: testName,
            variant: variant,
            timestamp: Date.now()
        });

        return variant;
    }

    trackABTestConversion(testName, conversionType = 'default') {
        const testKey = `ab_test_${testName}`;
        const variant = localStorage.getItem(testKey);

        if (variant) {
            this.track({
                type: 'ab_test_conversion',
                testName: testName,
                variant: variant,
                conversionType: conversionType,
                timestamp: Date.now()
            });
        }
    }

    // 用户细分
    segmentUser(attributes) {
        this.track({
            type: 'user_segmentation',
            attributes: attributes,
            timestamp: Date.now()
        });
    }

    // 自定义事件追踪
    trackCustomEvent(eventName, properties = {}) {
        this.track({
            type: 'custom_event',
            eventName: eventName,
            properties: properties,
            timestamp: Date.now()
        });
    }

    // 电商追踪
    trackPurchase(transactionData) {
        this.track({
            type: 'purchase',
            transactionId: transactionData.id,
            amount: transactionData.amount,
            currency: transactionData.currency,
            items: transactionData.items,
            timestamp: Date.now()
        });
    }

    trackAddToCart(productData) {
        this.track({
            type: 'add_to_cart',
            productId: productData.id,
            productName: productData.name,
            price: productData.price,
            quantity: productData.quantity,
            timestamp: Date.now()
        });
    }

    // 核心追踪方法
    track(event) {
        // 添加通用属性
        const enrichedEvent = {
            ...event,
            sessionId: this.sessionId,
            userId: this.userId,
            url: window.location.href,
            timestamp: event.timestamp || Date.now()
        };

        this.events.push(enrichedEvent);

        // 如果达到批次大小，立即发送
        if (this.events.length >= this.options.batchSize) {
            this.flush();
        }
    }

    // 设置定期刷新
    setupPeriodicFlush() {
        setInterval(() => {
            if (this.events.length > 0) {
                this.flush();
            }
        }, this.options.flushInterval);
    }

    // 发送数据
    async flush() {
        if (this.events.length === 0) return;

        const eventsToSend = [...this.events];
        this.events = [];

        try {
            const response = await fetch(this.options.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    events: eventsToSend,
                    sessionId: this.sessionId,
                    userId: this.userId,
                    timestamp: Date.now()
                })
            });

            if (!response.ok) {
                throw new Error(`Analytics API error: ${response.status}`);
            }

            console.log(`Analytics: 发送了 ${eventsToSend.length} 个事件`);
        } catch (error) {
            console.error('Analytics: 发送失败', error);
            
            // 如果发送失败，将事件放回队列
            this.events.unshift(...eventsToSend);
            
            // 存储到本地存储作为备份
            this.saveToLocalStorage(eventsToSend);
        }
    }

    // 保存到本地存储
    saveToLocalStorage(events) {
        try {
            const stored = JSON.parse(localStorage.getItem('analytics_offline_events') || '[]');
            stored.push(...events);
            
            // 限制存储大小
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }
            
            localStorage.setItem('analytics_offline_events', JSON.stringify(stored));
        } catch (error) {
            console.error('Analytics: 本地存储失败', error);
        }
    }

    // 从本地存储恢复
    restoreFromLocalStorage() {
        try {
            const stored = JSON.parse(localStorage.getItem('analytics_offline_events') || '[]');
            if (stored.length > 0) {
                this.events.push(...stored);
                localStorage.removeItem('analytics_offline_events');
                console.log(`Analytics: 恢复了 ${stored.length} 个离线事件`);
            }
        } catch (error) {
            console.error('Analytics: 恢复离线事件失败', error);
        }
    }

    // 获取分析数据
    getAnalyticsData() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            userAgent: this.userAgent,
            viewport: this.viewport,
            performanceData: this.performanceData,
            heatmapData: this.heatmapData,
            pendingEvents: this.events.length
        };
    }

    // 清理数据
    cleanup() {
        this.flush();
        this.events = [];
        this.heatmapData = [];
    }
}

// 初始化分析系统
let analyticsManager;

document.addEventListener('DOMContentLoaded', () => {
    analyticsManager = new AnalyticsManager({
        // 可以根据环境配置不同的选项
        apiEndpoint: '/api/analytics',
        enableHeatmap: true,
        trackClicks: true,
        trackScrolling: true
    });

    // 恢复离线事件
    analyticsManager.restoreFromLocalStorage();

    // 导出到全局
    window.analytics = analyticsManager;
    
    console.log('Analytics: 系统已启动');
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (analyticsManager) {
        analyticsManager.cleanup();
    }
});

// 导出分析管理器类
window.AnalyticsManager = AnalyticsManager;

