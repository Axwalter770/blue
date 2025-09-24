/**
 * 高级灯箱效果库
 * 支持图片预览、缩放、旋转、分享等功能
 */

class Lightbox {
    constructor(options = {}) {
        this.options = {
            selector: '[data-lightbox]',
            closeOnEscape: true,
            closeOnOutsideClick: true,
            showCounter: true,
            showZoom: true,
            showRotate: true,
            showShare: true,
            showDownload: true,
            enableSwipe: true,
            preloadNext: true,
            animation: 'fade',
            animationSpeed: 300,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            ...options
        };

        this.images = [];
        this.currentIndex = 0;
        this.isOpen = false;
        this.zoom = 1;
        this.rotation = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;

        this.init();
    }

    init() {
        this.createHTML();
        this.bindEvents();
        this.collectImages();
    }

    createHTML() {
        // 创建灯箱容器
        this.overlay = document.createElement('div');
        this.overlay.className = 'lightbox-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.options.backgroundColor};
            z-index: 9999;
            display: none;
            opacity: 0;
            transition: opacity ${this.options.animationSpeed}ms ease;
        `;

        // 创建容器
        this.container = document.createElement('div');
        this.container.className = 'lightbox-container';
        this.container.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // 创建图片容器
        this.imageContainer = document.createElement('div');
        this.imageContainer.className = 'lightbox-image-container';
        this.imageContainer.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            cursor: grab;
        `;

        // 创建图片元素
        this.image = document.createElement('img');
        this.image.className = 'lightbox-image';
        this.image.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
            user-select: none;
            pointer-events: none;
        `;

        // 创建加载指示器
        this.loader = document.createElement('div');
        this.loader.className = 'lightbox-loader';
        this.loader.innerHTML = '<div class="spinner"></div>';
        this.loader.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 20px;
        `;

        // 创建工具栏
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'lightbox-toolbar';
        this.toolbar.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 10;
        `;

        // 创建控制按钮
        this.createControls();

        // 创建导航按钮
        this.createNavigation();

        // 创建计数器
        if (this.options.showCounter) {
            this.counter = document.createElement('div');
            this.counter.className = 'lightbox-counter';
            this.counter.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                background: rgba(0, 0, 0, 0.5);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
            `;
        }

        // 创建描述
        this.caption = document.createElement('div');
        this.caption.className = 'lightbox-caption';
        this.caption.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            text-align: center;
            color: white;
            background: rgba(0, 0, 0, 0.5);
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 16px;
            display: none;
        `;

        // 组装结构
        this.imageContainer.appendChild(this.image);
        this.imageContainer.appendChild(this.loader);
        
        this.container.appendChild(this.imageContainer);
        this.container.appendChild(this.toolbar);
        this.container.appendChild(this.prevBtn);
        this.container.appendChild(this.nextBtn);
        
        if (this.options.showCounter) {
            this.container.appendChild(this.counter);
        }
        
        this.container.appendChild(this.caption);
        
        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);

        // 添加CSS样式
        this.addStyles();
    }

    createControls() {
        const buttonStyle = `
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
            backdrop-filter: blur(10px);
        `;

        // 关闭按钮
        this.closeBtn = document.createElement('button');
        this.closeBtn.innerHTML = '×';
        this.closeBtn.style.cssText = buttonStyle + 'font-size: 24px;';
        this.closeBtn.addEventListener('click', () => this.close());

        // 缩放按钮
        if (this.options.showZoom) {
            this.zoomInBtn = document.createElement('button');
            this.zoomInBtn.innerHTML = '🔍+';
            this.zoomInBtn.style.cssText = buttonStyle;
            this.zoomInBtn.addEventListener('click', () => this.zoomIn());

            this.zoomOutBtn = document.createElement('button');
            this.zoomOutBtn.innerHTML = '🔍-';
            this.zoomOutBtn.style.cssText = buttonStyle;
            this.zoomOutBtn.addEventListener('click', () => this.zoomOut());

            this.resetZoomBtn = document.createElement('button');
            this.resetZoomBtn.innerHTML = '⟲';
            this.resetZoomBtn.style.cssText = buttonStyle;
            this.resetZoomBtn.addEventListener('click', () => this.resetZoom());
        }

        // 旋转按钮
        if (this.options.showRotate) {
            this.rotateBtn = document.createElement('button');
            this.rotateBtn.innerHTML = '↻';
            this.rotateBtn.style.cssText = buttonStyle;
            this.rotateBtn.addEventListener('click', () => this.rotate());
        }

        // 分享按钮
        if (this.options.showShare) {
            this.shareBtn = document.createElement('button');
            this.shareBtn.innerHTML = '📤';
            this.shareBtn.style.cssText = buttonStyle;
            this.shareBtn.addEventListener('click', () => this.share());
        }

        // 下载按钮
        if (this.options.showDownload) {
            this.downloadBtn = document.createElement('button');
            this.downloadBtn.innerHTML = '💾';
            this.downloadBtn.style.cssText = buttonStyle;
            this.downloadBtn.addEventListener('click', () => this.download());
        }

        // 全屏按钮
        this.fullscreenBtn = document.createElement('button');
        this.fullscreenBtn.innerHTML = '⛶';
        this.fullscreenBtn.style.cssText = buttonStyle;
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // 添加按钮到工具栏
        this.toolbar.appendChild(this.closeBtn);
        
        if (this.options.showZoom) {
            this.toolbar.appendChild(this.zoomInBtn);
            this.toolbar.appendChild(this.zoomOutBtn);
            this.toolbar.appendChild(this.resetZoomBtn);
        }
        
        if (this.options.showRotate) {
            this.toolbar.appendChild(this.rotateBtn);
        }
        
        if (this.options.showShare) {
            this.toolbar.appendChild(this.shareBtn);
        }
        
        if (this.options.showDownload) {
            this.toolbar.appendChild(this.downloadBtn);
        }
        
        this.toolbar.appendChild(this.fullscreenBtn);
    }

    createNavigation() {
        const navStyle = `
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            opacity: 0.7;
        `;

        this.prevBtn = document.createElement('button');
        this.prevBtn.innerHTML = '‹';
        this.prevBtn.style.cssText = navStyle + 'left: 20px;';
        this.prevBtn.addEventListener('click', () => this.prev());

        this.nextBtn = document.createElement('button');
        this.nextBtn.innerHTML = '›';
        this.nextBtn.style.cssText = navStyle + 'right: 20px;';
        this.nextBtn.addEventListener('click', () => this.next());
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .lightbox-overlay button:hover {
                background: rgba(255, 255, 255, 0.4) !important;
                transform: scale(1.1);
            }
            
            .lightbox-image-container:active {
                cursor: grabbing !important;
            }
            
            .lightbox-loader .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @media (max-width: 768px) {
                .lightbox-toolbar {
                    top: 10px !important;
                    right: 10px !important;
                    gap: 8px !important;
                }
                
                .lightbox-toolbar button {
                    width: 36px !important;
                    height: 36px !important;
                    font-size: 14px !important;
                }
                
                .lightbox-counter {
                    bottom: 10px !important;
                }
                
                .lightbox-caption {
                    bottom: 10px !important;
                    left: 10px !important;
                    right: 10px !important;
                    font-size: 14px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    if (this.options.closeOnEscape) this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
                case '+':
                case '=':
                    this.zoomIn();
                    break;
                case '-':
                    this.zoomOut();
                    break;
                case '0':
                    this.resetZoom();
                    break;
                case 'r':
                case 'R':
                    this.rotate();
                    break;
            }
        });

        // 点击外部关闭
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay && this.options.closeOnOutsideClick) {
                this.close();
            }
        });

        // 鼠标滚轮缩放
        this.imageContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });

        // 触摸事件（移动端支持）
        if (this.options.enableSwipe) {
            this.bindTouchEvents();
        }

        // 拖拽事件
        this.bindDragEvents();
    }

    bindTouchEvents() {
        let startX, startY, initialDistance;

        this.imageContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
            }
        });

        this.imageContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 2) {
                // 双指缩放
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = currentDistance / initialDistance;
                this.zoom *= scale;
                this.zoom = Math.max(0.5, Math.min(3, this.zoom));
                this.updateTransform();
                initialDistance = currentDistance;
            }
        });

        this.imageContainer.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1 && startX !== undefined) {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = startX - endX;
                const diffY = startY - endY;

                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }
            }
        });
    }

    bindDragEvents() {
        this.imageContainer.addEventListener('mousedown', (e) => {
            if (this.zoom > 1) {
                this.isDragging = true;
                this.startX = e.clientX - this.translateX;
                this.startY = e.clientY - this.translateY;
                this.imageContainer.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.translateX = e.clientX - this.startX;
                this.translateY = e.clientY - this.startY;
                this.updateTransform();
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.imageContainer.style.cursor = 'grab';
        });
    }

    collectImages() {
        const imageElements = document.querySelectorAll(this.options.selector);
        this.images = Array.from(imageElements).map((el, index) => ({
            src: el.dataset.src || el.src || el.href,
            caption: el.dataset.caption || el.alt || el.title || '',
            element: el,
            index
        }));

        // 绑定点击事件
        imageElements.forEach((el, index) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(index);
            });
        });
    }

    open(index = 0) {
        this.currentIndex = index;
        this.isOpen = true;
        this.zoom = 1;
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;

        // 显示遮罩
        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // 动画显示
        setTimeout(() => {
            this.overlay.style.opacity = '1';
        }, 10);

        this.loadImage(this.currentIndex);
        this.updateCounter();
        this.updateNavigation();
    }

    close() {
        this.isOpen = false;
        this.overlay.style.opacity = '0';
        
        setTimeout(() => {
            this.overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, this.options.animationSpeed);
    }

    loadImage(index) {
        if (index < 0 || index >= this.images.length) return;

        const imageData = this.images[index];
        
        // 显示加载指示器
        this.loader.style.display = 'block';
        this.image.style.display = 'none';

        // 预加载图片
        const img = new Image();
        img.onload = () => {
            this.image.src = img.src;
            this.image.style.display = 'block';
            this.loader.style.display = 'none';
            
            // 更新描述
            if (imageData.caption) {
                this.caption.textContent = imageData.caption;
                this.caption.style.display = 'block';
            } else {
                this.caption.style.display = 'none';
            }

            // 重置变换
            this.resetTransform();
            
            // 预加载下一张
            if (this.options.preloadNext) {
                this.preloadImages();
            }
        };
        
        img.onerror = () => {
            this.loader.style.display = 'none';
            this.image.style.display = 'block';
            this.image.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfmlKDnvKHlpLHotKU8L3RleHQ+PC9zdmc+';
        };
        
        img.src = imageData.src;
    }

    preloadImages() {
        const preloadIndexes = [
            this.currentIndex + 1,
            this.currentIndex - 1
        ].filter(i => i >= 0 && i < this.images.length);

        preloadIndexes.forEach(index => {
            const img = new Image();
            img.src = this.images[index].src;
        });
    }

    next() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.loadImage(this.currentIndex);
            this.updateCounter();
            this.updateNavigation();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.loadImage(this.currentIndex);
            this.updateCounter();
            this.updateNavigation();
        }
    }

    zoomIn() {
        this.zoom = Math.min(3, this.zoom + 0.2);
        this.updateTransform();
    }

    zoomOut() {
        this.zoom = Math.max(0.5, this.zoom - 0.2);
        this.updateTransform();
    }

    resetZoom() {
        this.zoom = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    rotate() {
        this.rotation = (this.rotation + 90) % 360;
        this.updateTransform();
    }

    resetTransform() {
        this.zoom = 1;
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    updateTransform() {
        this.image.style.transform = `scale(${this.zoom}) rotate(${this.rotation}deg) translate(${this.translateX}px, ${this.translateY}px)`;
    }

    updateCounter() {
        if (this.options.showCounter && this.counter) {
            this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        }
    }

    updateNavigation() {
        this.prevBtn.style.display = this.currentIndex > 0 ? 'flex' : 'none';
        this.nextBtn.style.display = this.currentIndex < this.images.length - 1 ? 'flex' : 'none';
    }

    share() {
        const imageData = this.images[this.currentIndex];
        
        if (navigator.share) {
            navigator.share({
                title: '分享图片',
                text: imageData.caption || '',
                url: imageData.src
            });
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(imageData.src).then(() => {
                this.showMessage('图片链接已复制到剪贴板');
            });
        }
    }

    download() {
        const imageData = this.images[this.currentIndex];
        const link = document.createElement('a');
        link.href = imageData.src;
        link.download = `image-${this.currentIndex + 1}.jpg`;
        link.click();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.overlay.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    showMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 2000);
    }

    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 销毁实例
    destroy() {
        if (this.overlay) {
            this.overlay.remove();
        }
        
        // 移除事件监听器
        const imageElements = document.querySelectorAll(this.options.selector);
        imageElements.forEach(el => {
            el.removeEventListener('click', this.handleClick);
        });
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化默认灯箱
    window.lightbox = new Lightbox();
    
    // 为gallery页面的图片添加特殊处理
    if (window.location.pathname.includes('gallery.html')) {
        initializeGalleryLightbox();
    }
});

function initializeGalleryLightbox() {
    // 为gallery图片添加data-lightbox属性
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach((img, index) => {
        img.setAttribute('data-lightbox', 'gallery');
        img.setAttribute('data-caption', img.alt || `图片 ${index + 1}`);
        
        // 添加点击事件
        img.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            window.lightbox.open(index);
        });
    });
}

// 导出到全局
window.Lightbox = Lightbox;

