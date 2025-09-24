/**
 * 专业写真风格定制系统
 * 提供深度个性化的风格定制功能
 */

class StyleCustomizer {
    constructor() {
        this.activeStyle = null;
        this.customizations = new Map();
        this.presets = new Map();
        this.history = [];
        this.maxHistorySize = 50;
        this.previewMode = false;
        this.canvas = null;
        this.context = null;
        
        this.init();
    }

    init() {
        this.loadPresets();
        this.setupEventListeners();
        this.initializePreviewSystem();
        this.loadUserCustomizations();
    }

    loadPresets() {
        // 预设风格组合
        this.presets.set('romantic-soft', {
            name: '浪漫柔美',
            description: '营造温柔梦幻的浪漫氛围',
            settings: {
                saturation: 75,
                brightness: 85,
                contrast: 60,
                warmth: 80,
                softness: 90,
                vignette: 40,
                colorGrading: {
                    highlights: { r: 255, g: 240, b: 235 },
                    shadows: { r: 220, g: 210, b: 200 },
                    midtones: { r: 245, g: 225, b: 215 }
                },
                filters: ['soft-focus', 'warm-tone', 'gentle-blur'],
                mood: 'dreamy'
            },
            makeupStyle: {
                base: 'natural-glow',
                eyes: 'soft-smokey',
                lips: 'nude-pink',
                cheeks: 'natural-flush'
            },
            lightingSetup: {
                type: 'soft-window',
                direction: 'front-45',
                intensity: 70,
                fillRatio: 0.3
            },
            poses: ['sitting-graceful', 'lying-elegant', 'standing-gentle'],
            props: ['flowers', 'soft-fabrics', 'vintage-books'],
            colorPalette: ['#FFE4E6', '#FDF2F8', '#F3F4F6', '#E5E7EB']
        });

        this.presets.set('urban-edgy', {
            name: '都市个性',
            description: '展现现代都市的前卫个性',
            settings: {
                saturation: 95,
                brightness: 75,
                contrast: 85,
                warmth: 45,
                softness: 20,
                vignette: 60,
                colorGrading: {
                    highlights: { r: 240, g: 245, b: 250 },
                    shadows: { r: 20, g: 25, b: 35 },
                    midtones: { r: 130, g: 135, b: 145 }
                },
                filters: ['high-contrast', 'cool-tone', 'sharp-details'],
                mood: 'dynamic'
            },
            makeupStyle: {
                base: 'matte-perfection',
                eyes: 'dramatic-liner',
                lips: 'bold-red',
                cheeks: 'sculpted'
            },
            lightingSetup: {
                type: 'strobe-dramatic',
                direction: 'side-harsh',
                intensity: 90,
                fillRatio: 0.1
            },
            poses: ['standing-confident', 'walking-dynamic', 'sitting-assertive'],
            props: ['geometric-shapes', 'urban-elements', 'modern-tech'],
            colorPalette: ['#1F2937', '#374151', '#6B7280', '#F3F4F6']
        });

        this.presets.set('vintage-classic', {
            name: '复古经典',
            description: '重现黄金时代的经典魅力',
            settings: {
                saturation: 65,
                brightness: 70,
                contrast: 75,
                warmth: 85,
                softness: 60,
                vignette: 80,
                colorGrading: {
                    highlights: { r: 250, g: 235, b: 215 },
                    shadows: { r: 100, g: 85, b: 70 },
                    midtones: { r: 180, g: 160, b: 140 }
                },
                filters: ['sepia-tone', 'film-grain', 'aged-photo'],
                mood: 'nostalgic'
            },
            makeupStyle: {
                base: 'classic-elegance',
                eyes: 'winged-liner',
                lips: 'classic-red',
                cheeks: 'subtle-contour'
            },
            lightingSetup: {
                type: 'classic-portrait',
                direction: 'rembrandt',
                intensity: 80,
                fillRatio: 0.4
            },
            poses: ['sitting-elegant', 'standing-regal', 'profile-classic'],
            props: ['vintage-furniture', 'classic-accessories', 'old-books'],
            colorPalette: ['#8B4513', '#CD853F', '#DEB887', '#F5DEB3']
        });

        this.presets.set('fresh-natural', {
            name: '清新自然',
            description: '展现纯净自然的清新气质',
            settings: {
                saturation: 80,
                brightness: 90,
                contrast: 65,
                warmth: 75,
                softness: 85,
                vignette: 20,
                colorGrading: {
                    highlights: { r: 255, g: 255, b: 250 },
                    shadows: { r: 200, g: 210, b: 215 },
                    midtones: { r: 230, g: 235, b: 240 }
                },
                filters: ['natural-enhancement', 'fresh-tone', 'soft-clarity'],
                mood: 'peaceful'
            },
            makeupStyle: {
                base: 'dewy-natural',
                eyes: 'fresh-neutral',
                lips: 'natural-tint',
                cheeks: 'healthy-glow'
            },
            lightingSetup: {
                type: 'natural-light',
                direction: 'diffused',
                intensity: 75,
                fillRatio: 0.5
            },
            poses: ['walking-natural', 'sitting-relaxed', 'laughing-candid'],
            props: ['natural-elements', 'simple-flowers', 'organic-textures'],
            colorPalette: ['#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC']
        });

        this.presets.set('artistic-expression', {
            name: '艺术表达',
            description: '突破常规的创意艺术表现',
            settings: {
                saturation: 70,
                brightness: 60,
                contrast: 90,
                warmth: 50,
                softness: 30,
                vignette: 70,
                colorGrading: {
                    highlights: { r: 245, g: 240, b: 255 },
                    shadows: { r: 30, g: 20, b: 40 },
                    midtones: { r: 140, g: 130, b: 160 }
                },
                filters: ['artistic-filter', 'dramatic-shadows', 'creative-color'],
                mood: 'contemplative'
            },
            makeupStyle: {
                base: 'artistic-concept',
                eyes: 'creative-color',
                lips: 'artistic-statement',
                cheeks: 'sculptural'
            },
            lightingSetup: {
                type: 'creative-dramatic',
                direction: 'artistic-angle',
                intensity: 85,
                fillRatio: 0.2
            },
            poses: ['artistic-pose', 'conceptual-gesture', 'emotional-expression'],
            props: ['art-pieces', 'creative-elements', 'abstract-shapes'],
            colorPalette: ['#4C1D95', '#7C3AED', '#A855F7', '#C084FC']
        });
    }

    setupEventListeners() {
        // 预设选择
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-preset]')) {
                this.applyPreset(e.target.dataset.preset);
            }
        });

        // 滑块控制
        document.addEventListener('input', (e) => {
            if (e.target.matches('[data-setting]')) {
                this.updateSetting(e.target.dataset.setting, e.target.value);
            }
        });

        // 颜色选择
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-color]')) {
                this.selectColor(e.target.dataset.color);
            }
        });

        // 氛围选择
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-mood]')) {
                this.selectMood(e.target.dataset.mood);
            }
        });

        // 历史记录
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-history-action]')) {
                this.handleHistoryAction(e.target.dataset.historyAction);
            }
        });

        // 保存和分享
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-save-action]')) {
                this.handleSaveAction(e.target.dataset.saveAction);
            }
        });
    }

    initializePreviewSystem() {
        const previewContainer = document.getElementById('customizer-preview');
        if (previewContainer) {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            this.canvas.width = 400;
            this.canvas.height = 600;
            this.canvas.style.maxWidth = '100%';
            this.canvas.style.height = 'auto';
            previewContainer.appendChild(this.canvas);
            
            this.renderPreview();
        }
    }

    applyPreset(presetId) {
        const preset = this.presets.get(presetId);
        if (!preset) return;

        // 保存当前状态到历史
        this.saveToHistory();

        // 应用预设
        this.activeStyle = { ...preset };
        this.customizations.clear();
        
        // 更新UI
        this.updateControlValues(preset.settings);
        this.updateColorPalette(preset.colorPalette);
        this.updateMoodSelection(preset.settings.mood);
        
        // 更新预览
        this.renderPreview();

        // 触觉反馈
        if (window.mobileComponents?.haptic) {
            window.mobileComponents.haptic.light();
        }

        // 发送事件
        this.dispatchCustomEvent('presetApplied', { presetId, preset });
    }

    updateSetting(settingName, value) {
        if (!this.activeStyle) {
            this.activeStyle = { settings: {} };
        }

        const numericValue = parseFloat(value);
        this.activeStyle.settings[settingName] = numericValue;
        this.customizations.set(settingName, numericValue);

        // 实时更新预览
        this.renderPreview();

        // 发送事件
        this.dispatchCustomEvent('settingChanged', { settingName, value: numericValue });
    }

    selectColor(colorId) {
        if (!this.activeStyle) return;

        const colorPalettes = {
            'warm': ['#FFE4B5', '#FFDAB9', '#FFB6C1', '#FFA07A'],
            'cool': ['#E0F6FF', '#B0E0E6', '#87CEEB', '#87CEFA'],
            'neutral': ['#F5F5DC', '#F0F0F0', '#DCDCDC', '#D3D3D3'],
            'vibrant': ['#FF6347', '#FF4500', '#FF1493', '#FF69B4'],
            'earth': ['#8FBC8F', '#9ACD32', '#32CD32', '#228B22'],
            'monochrome': ['#000000', '#696969', '#A9A9A9', '#FFFFFF']
        };

        if (colorPalettes[colorId]) {
            this.activeStyle.colorPalette = colorPalettes[colorId];
            this.updateColorPalette(colorPalettes[colorId]);
            this.renderPreview();
        }

        // 更新UI选择状态
        document.querySelectorAll('[data-color]').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-color="${colorId}"]`)?.classList.add('selected');

        this.dispatchCustomEvent('colorChanged', { colorId, palette: colorPalettes[colorId] });
    }

    selectMood(moodId) {
        if (!this.activeStyle) return;

        const moodSettings = {
            'dreamy': {
                softness: 85,
                brightness: 80,
                contrast: 55,
                vignette: 40
            },
            'dramatic': {
                softness: 20,
                brightness: 70,
                contrast: 90,
                vignette: 70
            },
            'peaceful': {
                softness: 75,
                brightness: 85,
                contrast: 60,
                vignette: 30
            },
            'energetic': {
                softness: 30,
                brightness: 90,
                contrast: 80,
                vignette: 20
            },
            'mysterious': {
                softness: 40,
                brightness: 50,
                contrast: 85,
                vignette: 80
            },
            'elegant': {
                softness: 60,
                brightness: 75,
                contrast: 70,
                vignette: 50
            }
        };

        if (moodSettings[moodId]) {
            Object.assign(this.activeStyle.settings, moodSettings[moodId]);
            this.activeStyle.settings.mood = moodId;
            
            this.updateControlValues(this.activeStyle.settings);
            this.renderPreview();
        }

        // 更新UI选择状态
        document.querySelectorAll('[data-mood]').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-mood="${moodId}"]`)?.classList.add('selected');

        this.dispatchCustomEvent('moodChanged', { moodId, settings: moodSettings[moodId] });
    }

    updateControlValues(settings) {
        Object.entries(settings).forEach(([key, value]) => {
            const control = document.querySelector(`[data-setting="${key}"]`);
            if (control && typeof value === 'number') {
                control.value = value;
                
                // 更新显示值
                const display = control.parentElement.querySelector('.setting-value');
                if (display) {
                    display.textContent = value;
                }
            }
        });
    }

    updateColorPalette(palette) {
        const container = document.querySelector('.color-palette-preview');
        if (container && palette) {
            container.innerHTML = '';
            palette.forEach(color => {
                const colorDiv = document.createElement('div');
                colorDiv.className = 'color-swatch';
                colorDiv.style.backgroundColor = color;
                colorDiv.style.width = '30px';
                colorDiv.style.height = '30px';
                colorDiv.style.borderRadius = '4px';
                colorDiv.style.margin = '2px';
                container.appendChild(colorDiv);
            });
        }
    }

    updateMoodSelection(mood) {
        const moodElement = document.querySelector(`[data-mood="${mood}"]`);
        if (moodElement) {
            document.querySelectorAll('[data-mood]').forEach(el => {
                el.classList.remove('selected');
            });
            moodElement.classList.add('selected');
        }
    }

    renderPreview() {
        if (!this.canvas || !this.context) return;

        const ctx = this.context;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制背景渐变
        const gradient = this.createBackgroundGradient();
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 应用设置效果
        if (this.activeStyle?.settings) {
            this.applyVisualEffects(ctx, width, height);
        }

        // 绘制预览元素
        this.drawPreviewElements(ctx, width, height);

        // 应用后期效果
        this.applyPostEffects(ctx, width, height);
    }

    createBackgroundGradient() {
        const ctx = this.context;
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        
        if (this.activeStyle?.colorPalette) {
            const colors = this.activeStyle.colorPalette;
            gradient.addColorStop(0, colors[0] || '#f0f0f0');
            gradient.addColorStop(0.5, colors[1] || '#e0e0e0');
            gradient.addColorStop(1, colors[2] || '#d0d0d0');
        } else {
            gradient.addColorStop(0, '#f8f9fa');
            gradient.addColorStop(1, '#e9ecef');
        }

        return gradient;
    }

    applyVisualEffects(ctx, width, height) {
        const settings = this.activeStyle.settings;
        
        // 亮度调整
        if (settings.brightness !== undefined) {
            const alpha = (settings.brightness - 50) / 100;
            if (alpha > 0) {
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
                ctx.fillRect(0, 0, width, height);
            } else {
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillStyle = `rgba(0, 0, 0, ${Math.abs(alpha) * 0.3})`;
                ctx.fillRect(0, 0, width, height);
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        // 晕影效果
        if (settings.vignette > 0) {
            this.applyVignette(ctx, width, height, settings.vignette / 100);
        }
    }

    applyVignette(ctx, width, height, intensity) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.max(width, height) * 0.8;

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.6})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    drawPreviewElements(ctx, width, height) {
        // 绘制简化的人像轮廓
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // 头部轮廓
        const headX = width * 0.5;
        const headY = height * 0.25;
        const headRadius = width * 0.15;
        ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
        
        // 肩膀轮廓
        ctx.moveTo(width * 0.25, height * 0.45);
        ctx.quadraticCurveTo(width * 0.5, height * 0.4, width * 0.75, height * 0.45);
        ctx.lineTo(width * 0.8, height * 0.9);
        ctx.lineTo(width * 0.2, height * 0.9);
        ctx.closePath();
        
        ctx.stroke();

        // 根据风格添加装饰元素
        this.drawStyleElements(ctx, width, height);
    }

    drawStyleElements(ctx, width, height) {
        if (!this.activeStyle) return;

        const mood = this.activeStyle.settings.mood;
        
        switch (mood) {
            case 'dreamy':
                this.drawFloatingElements(ctx, width, height, '✨');
                break;
            case 'dramatic':
                this.drawShadowElements(ctx, width, height);
                break;
            case 'peaceful':
                this.drawNatureElements(ctx, width, height);
                break;
            case 'energetic':
                this.drawDynamicElements(ctx, width, height);
                break;
        }
    }

    drawFloatingElements(ctx, width, height, symbol) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '16px Arial';
        
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillText(symbol, x, y);
        }
    }

    drawShadowElements(ctx, width, height) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * 0.1);
        ctx.lineTo(width * 0.3, height * 0.3);
        ctx.lineTo(width * 0.1, height * 0.5);
        ctx.closePath();
        ctx.fill();
    }

    drawNatureElements(ctx, width, height) {
        ctx.strokeStyle = 'rgba(34, 139, 34, 0.5)';
        ctx.lineWidth = 2;
        
        // 简单的叶子形状
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI);
            ctx.stroke();
        }
    }

    drawDynamicElements(ctx, width, height) {
        ctx.strokeStyle = 'rgba(255, 69, 0, 0.6)';
        ctx.lineWidth = 3;
        
        // 动态线条
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
            ctx.stroke();
        }
    }

    applyPostEffects(ctx, width, height) {
        const settings = this.activeStyle?.settings;
        if (!settings) return;

        // 软化效果
        if (settings.softness > 50) {
            ctx.filter = `blur(${(settings.softness - 50) / 50}px)`;
            ctx.drawImage(this.canvas, 0, 0);
            ctx.filter = 'none';
        }
    }

    saveToHistory() {
        if (this.activeStyle) {
            this.history.push(JSON.parse(JSON.stringify(this.activeStyle)));
            
            // 限制历史记录数量
            if (this.history.length > this.maxHistorySize) {
                this.history.shift();
            }
        }
    }

    handleHistoryAction(action) {
        switch (action) {
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'clear-history':
                this.clearHistory();
                break;
        }
    }

    undo() {
        if (this.history.length > 0) {
            const previousState = this.history.pop();
            this.activeStyle = previousState;
            this.updateControlValues(previousState.settings);
            this.renderPreview();
            
            this.dispatchCustomEvent('undoApplied', { state: previousState });
        }
    }

    redo() {
        // 简化的重做功能
        console.log('Redo functionality would be implemented here');
    }

    clearHistory() {
        this.history = [];
        this.dispatchCustomEvent('historyCleared');
    }

    handleSaveAction(action) {
        switch (action) {
            case 'save-preset':
                this.saveAsPreset();
                break;
            case 'export-settings':
                this.exportSettings();
                break;
            case 'share-style':
                this.shareStyle();
                break;
            case 'apply-to-booking':
                this.applyToBooking();
                break;
        }
    }

    saveAsPreset() {
        if (!this.activeStyle) return;

        const presetName = prompt('请输入预设名称:');
        if (presetName) {
            const presetId = `custom-${Date.now()}`;
            this.presets.set(presetId, {
                ...this.activeStyle,
                name: presetName,
                isCustom: true
            });

            // 保存到本地存储
            this.saveCustomizations();

            this.dispatchCustomEvent('presetSaved', { presetId, name: presetName });
        }
    }

    exportSettings() {
        if (!this.activeStyle) return;

        const exportData = {
            version: '1.0',
            timestamp: Date.now(),
            style: this.activeStyle,
            customizations: Object.fromEntries(this.customizations)
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `style-settings-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.dispatchCustomEvent('settingsExported', exportData);
    }

    shareStyle() {
        if (!this.activeStyle) return;

        const shareData = {
            title: '我的专属写真风格',
            text: `看看我定制的写真风格: ${this.activeStyle.name || '个性化风格'}`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            // 复制到剪贴板
            const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('风格信息已复制到剪贴板！');
            });
        }

        this.dispatchCustomEvent('styleShared', shareData);
    }

    applyToBooking() {
        if (!this.activeStyle) return;

        // 保存当前风格到预约系统
        localStorage.setItem('customizedStyle', JSON.stringify(this.activeStyle));
        
        // 跳转到预约页面
        window.location.href = 'booking.html?customStyle=true';

        this.dispatchCustomEvent('styleAppliedToBooking', this.activeStyle);
    }

    saveCustomizations() {
        const data = {
            presets: Object.fromEntries(Array.from(this.presets.entries()).filter(([id, preset]) => preset.isCustom)),
            recentStyles: this.history.slice(-10),
            preferences: Object.fromEntries(this.customizations)
        };

        localStorage.setItem('styleCustomizations', JSON.stringify(data));
    }

    loadUserCustomizations() {
        try {
            const data = JSON.parse(localStorage.getItem('styleCustomizations') || '{}');
            
            if (data.presets) {
                Object.entries(data.presets).forEach(([id, preset]) => {
                    this.presets.set(id, preset);
                });
            }

            if (data.recentStyles) {
                this.history = data.recentStyles;
            }

            if (data.preferences) {
                Object.entries(data.preferences).forEach(([key, value]) => {
                    this.customizations.set(key, value);
                });
            }
        } catch (error) {
            console.warn('Failed to load user customizations:', error);
        }
    }

    generateStyleReport() {
        if (!this.activeStyle) return null;

        return {
            styleId: this.activeStyle.id || 'custom',
            styleName: this.activeStyle.name || '个性化风格',
            settings: this.activeStyle.settings,
            colorPalette: this.activeStyle.colorPalette,
            characteristics: this.calculateStyleCharacteristics(),
            suitability: this.analyzeSuitability(),
            technicalSpecs: this.generateTechnicalSpecs(),
            estimatedPrice: this.calculateEstimatedPrice(),
            recommendations: this.generateStyleRecommendations()
        };
    }

    calculateStyleCharacteristics() {
        const settings = this.activeStyle?.settings || {};
        
        return {
            sweetness: Math.max(0, 100 - settings.contrast + settings.softness) / 2,
            sophistication: (settings.contrast + (100 - settings.brightness)) / 2,
            drama: settings.contrast * (settings.vignette / 100),
            playfulness: (settings.brightness + settings.saturation) / 2,
            elegance: (settings.softness + (100 - settings.saturation)) / 2
        };
    }

    analyzeSuitability() {
        const characteristics = this.calculateStyleCharacteristics();
        
        return {
            occasions: this.getSuitableOccasions(characteristics),
            ageGroups: this.getSuitableAgeGroups(characteristics),
            seasons: this.getSuitableSeasons(),
            timeOfDay: this.getSuitableTimeOfDay(characteristics)
        };
    }

    getSuitableOccasions(characteristics) {
        const occasions = [];
        
        if (characteristics.elegance > 70) occasions.push('formal', 'wedding');
        if (characteristics.playfulness > 70) occasions.push('casual', 'celebration');
        if (characteristics.sophistication > 70) occasions.push('professional', 'portrait');
        if (characteristics.sweetness > 70) occasions.push('romantic', 'anniversary');
        
        return occasions;
    }

    getSuitableAgeGroups(characteristics) {
        const ageGroups = [];
        
        if (characteristics.playfulness > 60) ageGroups.push('teens', 'twenties');
        if (characteristics.sophistication > 60) ageGroups.push('thirties', 'forties');
        if (characteristics.elegance > 70) ageGroups.push('forties', 'fifties');
        
        return ageGroups.length > 0 ? ageGroups : ['all'];
    }

    getSuitableSeasons() {
        const settings = this.activeStyle?.settings || {};
        const seasons = [];
        
        if (settings.warmth > 60) seasons.push('spring', 'autumn');
        if (settings.warmth < 40) seasons.push('winter');
        if (settings.brightness > 70) seasons.push('summer');
        
        return seasons.length > 0 ? seasons : ['all'];
    }

    getSuitableTimeOfDay(characteristics) {
        const times = [];
        
        if (characteristics.drama > 60) times.push('evening', 'golden-hour');
        if (characteristics.sweetness > 60) times.push('morning', 'afternoon');
        if (characteristics.sophistication > 70) times.push('afternoon', 'evening');
        
        return times.length > 0 ? times : ['any'];
    }

    generateTechnicalSpecs() {
        const settings = this.activeStyle?.settings || {};
        
        return {
            lighting: this.recommendLighting(settings),
            camera: this.recommendCameraSettings(settings),
            postProcessing: this.recommendPostProcessing(settings),
            makeup: this.recommendMakeup(settings)
        };
    }

    recommendLighting(settings) {
        if (settings.softness > 70) return 'soft-natural';
        if (settings.contrast > 80) return 'dramatic-contrast';
        if (settings.brightness > 80) return 'bright-diffused';
        return 'balanced-portrait';
    }

    recommendCameraSettings(settings) {
        return {
            aperture: settings.softness > 70 ? 'f/1.4-f/2.8' : 'f/2.8-f/5.6',
            iso: settings.brightness > 70 ? '100-400' : '200-800',
            focus: settings.softness > 80 ? 'soft-focus' : 'sharp-focus'
        };
    }

    recommendPostProcessing(settings) {
        const processes = [];
        
        if (settings.warmth > 60) processes.push('warm-tone');
        if (settings.warmth < 40) processes.push('cool-tone');
        if (settings.softness > 70) processes.push('soft-filter');
        if (settings.contrast > 80) processes.push('contrast-boost');
        if (settings.vignette > 50) processes.push('vignette-effect');
        
        return processes;
    }

    recommendMakeup(settings) {
        if (settings.drama > 70) return 'dramatic-editorial';
        if (settings.softness > 70) return 'natural-soft';
        if (settings.sophistication > 70) return 'classic-elegant';
        return 'natural-enhancement';
    }

    calculateEstimatedPrice() {
        const basePrice = 298;
        const settings = this.activeStyle?.settings || {};
        
        let complexity = 0;
        complexity += settings.contrast > 80 ? 50 : 0;
        complexity += settings.vignette > 60 ? 30 : 0;
        complexity += settings.softness > 80 ? 40 : 0;
        
        const customizationFee = Object.keys(this.customizations).length * 20;
        
        return {
            base: basePrice,
            complexity: complexity,
            customization: customizationFee,
            total: basePrice + complexity + customizationFee
        };
    }

    generateStyleRecommendations() {
        const characteristics = this.calculateStyleCharacteristics();
        const recommendations = [];
        
        if (characteristics.sweetness > 70) {
            recommendations.push('考虑添加鲜花道具增强甜美感');
        }
        
        if (characteristics.drama > 70) {
            recommendations.push('建议使用戏剧性光影效果');
        }
        
        if (characteristics.elegance > 70) {
            recommendations.push('推荐优雅的服装和姿态');
        }
        
        return recommendations;
    }

    dispatchCustomEvent(eventName, detail = {}) {
        const event = new CustomEvent(`styleCustomizer:${eventName}`, {
            detail: { ...detail, timestamp: Date.now() },
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // 公共API方法
    getActiveStyle() {
        return this.activeStyle;
    }

    getCustomizations() {
        return Object.fromEntries(this.customizations);
    }

    getAvailablePresets() {
        return Array.from(this.presets.entries()).map(([id, preset]) => ({
            id,
            name: preset.name,
            description: preset.description,
            isCustom: preset.isCustom || false
        }));
    }

    resetToDefaults() {
        this.activeStyle = null;
        this.customizations.clear();
        this.renderPreview();
        this.dispatchCustomEvent('resetToDefaults');
    }

    importSettings(settingsData) {
        try {
            this.activeStyle = settingsData.style;
            this.customizations = new Map(Object.entries(settingsData.customizations || {}));
            this.updateControlValues(this.activeStyle.settings);
            this.renderPreview();
            this.dispatchCustomEvent('settingsImported', settingsData);
            return true;
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }
}

// 全局实例
let styleCustomizer;

document.addEventListener('DOMContentLoaded', () => {
    styleCustomizer = new StyleCustomizer();
    
    // 导出到全局
    window.styleCustomizer = styleCustomizer;
    window.StyleCustomizer = StyleCustomizer;
    
    console.log('Style Customizer initialized');
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StyleCustomizer;
}

