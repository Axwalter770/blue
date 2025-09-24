/**
 * 高端图片展示引擎
 * 专业的瀑布流布局和图片管理系统
 */

class GalleryEngine {
    constructor(container) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.items = [];
        this.filteredItems = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.itemsPerPage = 15;
        this.isLoading = false;
        this.columns = 3;
        this.columnHeights = [];
        this.gap = 24;
        this.animations = new Map();
        this.observers = new Map();
        
        this.init();
    }

    init() {
        this.setupContainer();
        this.createColumns();
        this.loadSampleData();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.calculateColumns();
    }

    setupContainer() {
        if (!this.container) return;
        
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.innerHTML = '';
    }

    createColumns() {
        this.columnHeights = new Array(this.columns).fill(0);
        for (let i = 0; i < this.columns; i++) {
            const column = document.createElement('div');
            column.className = `gallery-column gallery-column-${i}`;
            column.style.cssText = `
                position: absolute;
                top: 0;
                width: calc((100% - ${(this.columns - 1) * this.gap}px) / ${this.columns});
                left: calc(${i} * (100% / ${this.columns}) + ${i * this.gap}px);
            `;
            this.container.appendChild(column);
        }
    }

    loadSampleData() {
        // 生成示例作品数据
        const styles = [
            { name: '清新自然', category: 'fresh', colors: ['#E8F5E8', '#F0F8E8', '#E8F8F0'] },
            { name: '复古典雅', category: 'vintage', colors: ['#F5E6D3', '#E8D5C4', '#F0E6D6'] },
            { name: '时尚前卫', category: 'fashion', colors: ['#E0E7FF', '#F0F4FF', '#E8EFFF'] },
            { name: '艺术创作', category: 'art', colors: ['#F3E8FF', '#F8F0FF', '#F0E8FF'] },
            { name: '简约现代', category: 'minimal', colors: ['#F8F9FA', '#F1F3F4', '#E9ECEF'] },
            { name: '浪漫梦幻', category: 'romantic', colors: ['#FDF2F8', '#FCE7F3', '#FAE8FF'] },
            { name: '都市风情', category: 'urban', colors: ['#F1F5F9', '#E2E8F0', '#CBD5E1'] },
            { name: '自然风光', category: 'nature', colors: ['#ECFDF5', '#D1FAE5', '#A7F3D0'] }
        ];

        const descriptions = [
            '温柔午后的阳光透过窗棂，洒在她的脸上',
            '都市霓虹下的时尚剪影，展现现代女性的独立与自信',
            '复古胶片的质感，重现黄金年代的经典魅力',
            '艺术与现实的完美融合，每一帧都是诗意的表达',
            '极简主义的美学追求，在留白中寻找内心的宁静',
            '梦幻般的色彩搭配，营造浪漫的童话氛围',
            '繁华都市中的一抹宁静，捕捉现代生活的真实瞬间',
            '大自然的鬼斧神工，与人物的完美和谐'
        ];

        const tags = [
            ['温柔', '自然', '清新'],
            ['时尚', '都市', '现代'],
            ['复古', '经典', '胶片'],
            ['艺术', '创意', '唯美'],
            ['简约', '现代', '纯净'],
            ['浪漫', '梦幻', '甜美'],
            ['都市', '生活', '真实'],
            ['自然', '和谐', '宁静']
        ];

        for (let i = 1; i <= 50; i++) {
            const styleIndex = Math.floor(Math.random() * styles.length);
            const style = styles[styleIndex];
            
            this.items.push({
                id: i,
                title: `${style.name} ${String(i).padStart(2, '0')}`,
                description: descriptions[styleIndex],
                category: style.category,
                tags: tags[styleIndex],
                height: Math.floor(Math.random() * 300) + 250,
                width: 300,
                color: style.colors[Math.floor(Math.random() * style.colors.length)],
                featured: Math.random() > 0.7,
                likes: Math.floor(Math.random() * 100) + 10,
                views: Math.floor(Math.random() * 1000) + 100,
                created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
            });
        }

        this.filteredItems = [...this.items];
        this.render();
    }

    setupEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // 滚动加载更多
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateItem(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
    }

    calculateColumns() {
        const containerWidth = this.container.offsetWidth;
        const minColumnWidth = 300;
        const newColumns = Math.floor(containerWidth / (minColumnWidth + this.gap));
        
        if (newColumns !== this.columns && newColumns > 0) {
            this.columns = Math.max(1, Math.min(newColumns, 4));
            this.recreateColumns();
        }
    }

    recreateColumns() {
        this.container.innerHTML = '';
        this.createColumns();
        this.columnHeights = new Array(this.columns).fill(0);
        this.render();
    }

    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.calculateColumns();
        }, 250);
    }

    handleScroll() {
        if (this.isLoading) return;
        
        const scrollTop = window.pageYOffset;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        
        if (scrollTop + clientHeight >= scrollHeight - 1000) {
            this.loadMore();
        }
    }

    filter(category) {
        this.currentFilter = category;
        this.currentPage = 1;
        
        if (category === 'all') {
            this.filteredItems = [...this.items];
        } else {
            this.filteredItems = this.items.filter(item => item.category === category);
        }
        
        this.clearContainer();
        this.render();
    }

    search(query) {
        const searchTerm = query.toLowerCase();
        
        if (searchTerm === '') {
            this.filteredItems = [...this.items];
        } else {
            this.filteredItems = this.items.filter(item => 
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        this.clearContainer();
        this.render();
    }

    clearContainer() {
        this.container.querySelectorAll('.gallery-item').forEach(item => {
            item.remove();
        });
        this.columnHeights.fill(0);
    }

    render() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredItems.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const item = this.filteredItems[i];
            if (item) {
                this.createItem(item, i - startIndex);
            }
        }
        
        this.updateContainerHeight();
    }

    createItem(data, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.id = data.id;
        item.dataset.category = data.category;
        
        const aspectRatio = data.height / data.width;
        const itemHeight = 300 * aspectRatio;
        
        item.style.cssText = `
            width: 100%;
            margin-bottom: ${this.gap}px;
            border-radius: 16px;
            overflow: hidden;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            opacity: 0;
            transform: translateY(50px);
        `;
        
        item.innerHTML = this.createItemHTML(data, itemHeight);
        
        // 找到最短的列
        const shortestColumn = this.getShortestColumn();
        const column = this.container.querySelector(`.gallery-column-${shortestColumn}`);
        
        column.appendChild(item);
        this.columnHeights[shortestColumn] += itemHeight + this.gap;
        
        // 设置动画
        setTimeout(() => {
            this.animateItem(item);
        }, index * 100);
        
        // 添加事件监听
        this.addItemEventListeners(item, data);
        
        // 添加到观察器
        this.observer.observe(item);
    }

    createItemHTML(data, height) {
        return `
            <div class="gallery-item-image" style="height: ${height}px; background: linear-gradient(135deg, ${data.color}, ${this.adjustColor(data.color, -10)}); position: relative; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 2rem;">
                <i class="fas fa-camera"></i>
                
                <!-- 悬停遮罩 -->
                <div class="gallery-item-overlay" style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)); opacity: 0; transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; text-align: center; padding: 20px;">
                    <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; transform: translateY(20px); transition: transform 0.3s ease 0.1s;">${data.title}</h3>
                    <p style="font-size: 0.9rem; opacity: 0.9; transform: translateY(20px); transition: transform 0.3s ease 0.2s; margin-bottom: 12px;">${data.description}</p>
                    <div style="display: flex; gap: 8px; transform: translateY(20px); transition: transform 0.3s ease 0.3s;">
                        <span style="background: rgba(255, 255, 255, 0.2); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-heart mr-1"></i>${data.likes}</span>
                        <span style="background: rgba(255, 255, 255, 0.2); padding: 4px 8px; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-eye mr-1"></i>${data.views}</span>
                    </div>
                </div>
                
                <!-- 标签 -->
                <div class="gallery-item-tags" style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px;">
                    ${data.tags.slice(0, 2).map(tag => `
                        <span style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; color: #374151;">${tag}</span>
                    `).join('')}
                </div>
                
                ${data.featured ? `
                    <div class="gallery-item-featured" style="position: absolute; top: 12px; right: 12px; background: linear-gradient(135deg, #fa709a, #fee140); color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">精选</div>
                ` : ''}
            </div>
            
            <div class="gallery-item-info" style="padding: 20px;">
                <h4 style="font-size: 1.2rem; font-weight: 700; color: #374151; margin-bottom: 8px;">${data.title}</h4>
                <p style="color: #6b7280; font-size: 0.9rem; line-height: 1.5; margin-bottom: 12px;">${data.description}</p>
                <div style="display: flex; justify-content: between; align-items: center;">
                    <div style="display: flex; gap: 6px;">
                        ${data.tags.map(tag => `
                            <span style="background: #f3f4f6; color: #6b7280; padding: 2px 8px; border-radius: 8px; font-size: 0.75rem;">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    addItemEventListeners(item, data) {
        // 悬停效果
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-8px)';
            item.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            
            const overlay = item.querySelector('.gallery-item-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.querySelectorAll('h3, p, div').forEach((el, index) => {
                    el.style.transform = 'translateY(0)';
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            
            const overlay = item.querySelector('.gallery-item-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.querySelectorAll('h3, p, div').forEach((el, index) => {
                    el.style.transform = 'translateY(20px)';
                });
            }
        });
        
        // 点击事件
        item.addEventListener('click', () => {
            this.openLightbox(data);
        });
    }

    animateItem(item) {
        if (item.style.opacity === '1') return;
        
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }

    getShortestColumn() {
        let shortest = 0;
        for (let i = 1; i < this.columnHeights.length; i++) {
            if (this.columnHeights[i] < this.columnHeights[shortest]) {
                shortest = i;
            }
        }
        return shortest;
    }

    updateContainerHeight() {
        const maxHeight = Math.max(...this.columnHeights);
        this.container.style.height = maxHeight + 'px';
    }

    loadMore() {
        if (this.isLoading) return;
        if ((this.currentPage * this.itemsPerPage) >= this.filteredItems.length) return;
        
        this.isLoading = true;
        this.currentPage++;
        
        // 模拟加载延迟
        setTimeout(() => {
            this.render();
            this.isLoading = false;
        }, 500);
    }

    openLightbox(data) {
        // 创建灯箱
        const lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        lightbox.innerHTML = `
            <div class="lightbox-content" style="max-width: 90vw; max-height: 90vh; background: white; border-radius: 20px; overflow: hidden; transform: scale(0.8); transition: transform 0.3s ease; box-shadow: 0 40px 120px rgba(0, 0, 0, 0.3);">
                <div class="lightbox-image" style="height: 60vh; background: linear-gradient(135deg, ${data.color}, ${this.adjustColor(data.color, -10)}); display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 4rem;">
                    <i class="fas fa-camera"></i>
                </div>
                <div class="lightbox-info" style="padding: 30px;">
                    <h3 style="font-size: 2rem; font-weight: 700; color: #374151; margin-bottom: 12px;">${data.title}</h3>
                    <p style="color: #6b7280; font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">${data.description}</p>
                    <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                        ${data.tags.map(tag => `
                            <span style="background: #f3f4f6; color: #6b7280; padding: 6px 12px; border-radius: 12px; font-size: 0.9rem; font-weight: 500;">${tag}</span>
                        `).join('')}
                    </div>
                    <div style="display: flex; justify-content: between; align-items: center; color: #9ca3af; font-size: 0.9rem;">
                        <span><i class="fas fa-heart mr-2"></i>${data.likes} 喜欢</span>
                        <span><i class="fas fa-eye mr-2"></i>${data.views} 浏览</span>
                        <span><i class="fas fa-calendar mr-2"></i>${data.created.toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <button class="lightbox-close" style="position: absolute; top: 20px; right: 20px; width: 50px; height: 50px; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border: none; border-radius: 50%; color: white; font-size: 1.5rem; cursor: pointer; transition: all 0.3s ease;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // 动画显示
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
            lightbox.querySelector('.lightbox-content').style.transform = 'scale(1)';
        });
        
        // 关闭事件
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            lightbox.querySelector('.lightbox-content').style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    adjustColor(hex, percent) {
        // 简单的颜色调整函数
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const B = (num >> 8 & 0x00FF) + amt;
        const G = (num & 0x0000FF) + amt;
        
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
                      (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + 
                      (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
    }

    // 公共方法
    addItem(data) {
        this.items.push(data);
        if (this.currentFilter === 'all' || data.category === this.currentFilter) {
            this.filteredItems.push(data);
            this.createItem(data, this.filteredItems.length - 1);
        }
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.filteredItems = this.filteredItems.filter(item => item.id !== id);
        
        const element = this.container.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.remove();
            this.rebalanceColumns();
        }
    }

    rebalanceColumns() {
        const items = Array.from(this.container.querySelectorAll('.gallery-item'));
        this.columnHeights.fill(0);
        
        items.forEach(item => {
            const shortestColumn = this.getShortestColumn();
            const column = this.container.querySelector(`.gallery-column-${shortestColumn}`);
            column.appendChild(item);
            
            const height = item.offsetHeight;
            this.columnHeights[shortestColumn] += height + this.gap;
        });
        
        this.updateContainerHeight();
    }

    getStats() {
        return {
            totalItems: this.items.length,
            filteredItems: this.filteredItems.length,
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            columns: this.columns,
            filter: this.currentFilter
        };
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
        
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// 高级筛选组件
class GalleryFilter {
    constructor(gallery, container) {
        this.gallery = gallery;
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.activeFilter = 'all';
        
        this.init();
    }

    init() {
        this.createFilterButtons();
        this.setupEventListeners();
    }

    createFilterButtons() {
        const filters = [
            { id: 'all', name: '全部作品', icon: 'fas fa-th-large' },
            { id: 'fresh', name: '清新自然', icon: 'fas fa-leaf' },
            { id: 'vintage', name: '复古典雅', icon: 'fas fa-camera-retro' },
            { id: 'fashion', name: '时尚前卫', icon: 'fas fa-star' },
            { id: 'art', name: '艺术创作', icon: 'fas fa-palette' },
            { id: 'minimal', name: '简约现代', icon: 'fas fa-minus' },
            { id: 'romantic', name: '浪漫梦幻', icon: 'fas fa-heart' },
            { id: 'urban', name: '都市风情', icon: 'fas fa-building' },
            { id: 'nature', name: '自然风光', icon: 'fas fa-mountain' }
        ];

        const filterNav = document.createElement('div');
        filterNav.className = 'gallery-filter-nav';
        filterNav.style.cssText = `
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 8px;
            margin: 40px auto;
            max-width: fit-content;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
            justify-content: center;
        `;

        filters.forEach(filter => {
            const button = document.createElement('button');
            button.className = 'gallery-filter-button';
            button.dataset.filter = filter.id;
            button.innerHTML = `<i class="${filter.icon} mr-2"></i>${filter.name}`;
            
            button.style.cssText = `
                padding: 12px 20px;
                border: none;
                background: transparent;
                border-radius: 12px;
                font-weight: 600;
                color: #64748b;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
                display: flex;
                align-items: center;
            `;
            
            if (filter.id === this.activeFilter) {
                button.classList.add('active');
                button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                button.style.color = 'white';
                button.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
            }
            
            filterNav.appendChild(button);
        });

        if (this.container) {
            this.container.appendChild(filterNav);
        }
    }

    setupEventListeners() {
        if (!this.container) return;
        
        this.container.addEventListener('click', (e) => {
            if (e.target.matches('.gallery-filter-button') || e.target.closest('.gallery-filter-button')) {
                const button = e.target.matches('.gallery-filter-button') ? e.target : e.target.closest('.gallery-filter-button');
                const filter = button.dataset.filter;
                this.setActiveFilter(filter);
            }
        });
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        // 更新按钮状态
        this.container.querySelectorAll('.gallery-filter-button').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'transparent';
            btn.style.color = '#64748b';
            btn.style.boxShadow = 'none';
        });
        
        const activeButton = this.container.querySelector(`[data-filter="${filter}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            activeButton.style.color = 'white';
            activeButton.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
        }
        
        // 应用筛选
        this.gallery.filter(filter);
    }
}

// 搜索组件
class GallerySearch {
    constructor(gallery, container) {
        this.gallery = gallery;
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.searchTimeout = null;
        
        this.init();
    }

    init() {
        this.createSearchInput();
        this.setupEventListeners();
    }

    createSearchInput() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'gallery-search-container';
        searchContainer.style.cssText = `
            position: relative;
            max-width: 600px;
            margin: 40px auto;
            padding: 0 20px;
        `;
        
        searchContainer.innerHTML = `
            <div style="position: relative; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <input type="text" class="gallery-search-input" placeholder="搜索风格、主题或颜色..." style="width: 100%; padding: 20px 60px 20px 24px; border: none; outline: none; font-size: 1.1rem; background: transparent;">
                <button class="gallery-search-button" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border: none; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        `;
        
        if (this.container) {
            this.container.appendChild(searchContainer);
        }
    }

    setupEventListeners() {
        const input = this.container?.querySelector('.gallery-search-input');
        const button = this.container?.querySelector('.gallery-search-button');
        
        if (input) {
            input.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.gallery.search(e.target.value);
                }, 300);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.gallery.search(e.target.value);
                }
            });
        }
        
        if (button) {
            button.addEventListener('click', () => {
                const query = input?.value || '';
                this.gallery.search(query);
            });
        }
    }
}

// 全局导出
window.GalleryEngine = GalleryEngine;
window.GalleryFilter = GalleryFilter;
window.GallerySearch = GallerySearch;
