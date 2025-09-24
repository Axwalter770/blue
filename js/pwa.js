/**
 * PWA安装和管理功能
 * 处理Service Worker注册、安装提示、更新通知等
 */

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.updateAvailable = false;
        this.registration = null;
        
        this.init();
    }

    async init() {
        // 检查PWA支持
        if (!this.isPWASupported()) {
            console.log('PWA: 当前浏览器不支持PWA功能');
            return;
        }

        // 注册Service Worker
        await this.registerServiceWorker();
        
        // 监听安装提示
        this.listenForInstallPrompt();
        
        // 检查安装状态
        this.checkInstallStatus();
        
        // 监听应用更新
        this.listenForUpdates();
        
        // 显示安装横幅
        this.showInstallBanner();
        
        // 处理网络状态
        this.handleNetworkStatus();
    }

    isPWASupported() {
        return 'serviceWorker' in navigator && 'PushManager' in window;
    }

    async registerServiceWorker() {
        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('PWA: Service Worker 注册成功', this.registration);
            
            // 监听Service Worker状态变化
            this.registration.addEventListener('updatefound', () => {
                console.log('PWA: Service Worker 更新可用');
                this.updateAvailable = true;
                this.showUpdateNotification();
            });
            
        } catch (error) {
            console.error('PWA: Service Worker 注册失败', error);
        }
    }

    listenForInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA: 安装提示事件触发');
            
            // 阻止默认的安装提示
            e.preventDefault();
            
            // 保存事件，稍后使用
            this.deferredPrompt = e;
            
            // 显示自定义安装按钮
            this.showInstallButton();
        });

        // 监听安装成功事件
        window.addEventListener('appinstalled', () => {
            console.log('PWA: 应用安装成功');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showSuccessMessage('应用安装成功！');
            
            // 清理安装提示
            this.deferredPrompt = null;
        });
    }

    async showInstallPrompt() {
        if (!this.deferredPrompt) {
            console.log('PWA: 没有可用的安装提示');
            return;
        }

        try {
            // 显示安装提示
            this.deferredPrompt.prompt();
            
            // 等待用户响应
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log('PWA: 用户安装选择', outcome);
            
            if (outcome === 'accepted') {
                this.showSuccessMessage('正在安装应用...');
            } else {
                this.showInfoMessage('您可以稍后通过浏览器菜单安装应用');
            }
            
            // 清理
            this.deferredPrompt = null;
            
        } catch (error) {
            console.error('PWA: 安装提示显示失败', error);
        }
    }

    checkInstallStatus() {
        // 检查是否在独立模式下运行（已安装）
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('PWA: 应用正在独立模式下运行');
        }

        // 检查是否从主屏幕启动
        if (document.referrer.startsWith('android-app://')) {
            this.isInstalled = true;
            console.log('PWA: 应用从主屏幕启动');
        }
    }

    showInstallButton() {
        if (this.isInstalled) return;

        // 检查是否已存在安装按钮
        if (document.getElementById('pwa-install-button')) return;

        const installButton = document.createElement('div');
        installButton.id = 'pwa-install-button';
        installButton.className = 'fixed bottom-4 right-4 z-50 animate-bounce';
        installButton.innerHTML = `
            <div class="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 transition-all duration-300 flex items-center space-x-3">
                <i class="fas fa-download"></i>
                <div>
                    <div class="font-semibold text-sm">安装蓝柚</div>
                    <div class="text-xs opacity-80">体验更好的移动端</div>
                </div>
                <button class="ml-2 text-blue-200 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        installButton.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'I') {
                this.showInstallPrompt();
            }
        });

        document.body.appendChild(installButton);

        // 添加安装提示动画
        setTimeout(() => {
            installButton.classList.remove('animate-bounce');
        }, 3000);
    }

    hideInstallButton() {
        const installButton = document.getElementById('pwa-install-button');
        if (installButton) {
            installButton.remove();
        }
    }

    showInstallBanner() {
        if (this.isInstalled) return;

        // 检查是否已显示过横幅
        if (localStorage.getItem('pwa-banner-dismissed')) return;

        // 延迟显示横幅
        setTimeout(() => {
            this.createInstallBanner();
        }, 5000);
    }

    createInstallBanner() {
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'fixed top-16 left-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-lg z-40 animate-slide-down';
        banner.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <i class="fas fa-mobile-alt text-xl"></i>
                    </div>
                    <div>
                        <div class="font-semibold">安装蓝柚应用</div>
                        <div class="text-sm opacity-90">快速访问，离线可用</div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button id="install-banner-btn" class="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        安装
                    </button>
                    <button id="dismiss-banner-btn" class="text-white hover:text-gray-200">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // 绑定事件
        document.getElementById('install-banner-btn').addEventListener('click', () => {
            this.showInstallPrompt();
            banner.remove();
        });

        document.getElementById('dismiss-banner-btn').addEventListener('click', () => {
            banner.remove();
            localStorage.setItem('pwa-banner-dismissed', 'true');
        });

        // 自动隐藏
        setTimeout(() => {
            if (banner.parentElement) {
                banner.remove();
            }
        }, 15000);
    }

    listenForUpdates() {
        if (!navigator.serviceWorker) return;

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('PWA: Service Worker 控制器已更改');
            window.location.reload();
        });

        // 监听SW消息
        navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('PWA: 收到Service Worker消息', event.data);
            
            if (event.data.type === 'UPDATE_AVAILABLE') {
                this.showUpdateNotification();
            }
        });
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.id = 'pwa-update-notification';
        notification.className = 'fixed bottom-4 left-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-up';
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-download text-xl"></i>
                    <div>
                        <div class="font-semibold">新版本可用</div>
                        <div class="text-sm opacity-90">点击更新以获取最新功能</div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button id="update-btn" class="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        更新
                    </button>
                    <button id="update-dismiss-btn" class="text-white hover:text-gray-200">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // 绑定事件
        document.getElementById('update-btn').addEventListener('click', () => {
            this.updateApp();
            notification.remove();
        });

        document.getElementById('update-dismiss-btn').addEventListener('click', () => {
            notification.remove();
        });
    }

    async updateApp() {
        if (!this.registration) return;

        try {
            // 跳过等待，立即激活新的Service Worker
            if (this.registration.waiting) {
                this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            
            this.showSuccessMessage('正在更新应用...');
            
            // 刷新页面以使用新的Service Worker
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            console.error('PWA: 更新失败', error);
            this.showErrorMessage('更新失败，请刷新页面重试');
        }
    }

    handleNetworkStatus() {
        // 监听网络状态变化
        window.addEventListener('online', () => {
            console.log('PWA: 网络已连接');
            this.showSuccessMessage('网络已连接');
            this.hideOfflineIndicator();
        });

        window.addEventListener('offline', () => {
            console.log('PWA: 网络已断开');
            this.showInfoMessage('网络已断开，某些功能可能无法使用');
            this.showOfflineIndicator();
        });

        // 初始状态检查
        if (!navigator.onLine) {
            this.showOfflineIndicator();
        }
    }

    showOfflineIndicator() {
        if (document.getElementById('offline-indicator')) return;

        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.className = 'fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50';
        indicator.innerHTML = `
            <i class="fas fa-wifi-slash mr-2"></i>
            离线模式 - 某些功能可能无法使用
        `;

        document.body.appendChild(indicator);
    }

    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // 消息提示方法
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showInfoMessage(message) {
        this.showMessage(message, 'info');
    }

    showMessage(message, type = 'info') {
        const colors = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            info: 'bg-blue-600'
        };

        const messageEl = document.createElement('div');
        messageEl.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
        messageEl.textContent = message;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    // 获取PWA状态信息
    getStatus() {
        return {
            supported: this.isPWASupported(),
            installed: this.isInstalled,
            updateAvailable: this.updateAvailable,
            online: navigator.onLine
        };
    }

    // 请求推送通知权限
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('PWA: 浏览器不支持通知');
            return false;
        }

        const permission = await Notification.requestPermission();
        console.log('PWA: 通知权限', permission);
        
        return permission === 'granted';
    }

    // 显示本地通知
    showNotification(title, options = {}) {
        if (Notification.permission === 'granted') {
            const defaultOptions = {
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                vibrate: [100, 50, 100],
                ...options
            };

            return new Notification(title, defaultOptions);
        }
    }

    // 添加到主屏幕提示（iOS Safari）
    showIOSInstallPrompt() {
        if (this.isIOSDevice() && !this.isInstalled) {
            const prompt = document.createElement('div');
            prompt.className = 'fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50';
            prompt.innerHTML = `
                <div class="text-center">
                    <div class="mb-2">
                        <i class="fas fa-share text-blue-400"></i>
                        点击分享按钮
                    </div>
                    <div class="mb-2">然后选择</div>
                    <div class="font-semibold">
                        <i class="fas fa-plus-square text-green-400 mr-2"></i>
                        添加到主屏幕
                    </div>
                </div>
                <button class="absolute top-2 right-2 text-gray-400 hover:text-white" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;

            document.body.appendChild(prompt);

            setTimeout(() => {
                if (prompt.parentElement) {
                    prompt.remove();
                }
            }, 10000);
        }
    }

    isIOSDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    // 预缓存重要资源
    async precacheResources(urls) {
        if (!this.registration) return;

        try {
            this.registration.active.postMessage({
                type: 'CACHE_URLS',
                urls: urls
            });
            
            console.log('PWA: 开始预缓存资源', urls);
        } catch (error) {
            console.error('PWA: 预缓存失败', error);
        }
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-down {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slide-up {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes fade-in {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .animate-slide-down {
        animation: slide-down 0.5s ease-out;
    }

    .animate-slide-up {
        animation: slide-up 0.5s ease-out;
    }

    .animate-fade-in {
        animation: fade-in 0.3s ease-out;
    }

    .animate-bounce {
        animation: bounce 1s infinite;
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(style);

// 初始化PWA管理器
let pwaManager;

document.addEventListener('DOMContentLoaded', () => {
    pwaManager = new PWAManager();
    
    // 导出到全局
    window.pwaManager = pwaManager;
    
    // iOS设备显示安装提示
    if (pwaManager.isIOSDevice() && !pwaManager.isInstalled) {
        setTimeout(() => {
            pwaManager.showIOSInstallPrompt();
        }, 3000);
    }
});

// 导出PWA管理器类
window.PWAManager = PWAManager;

