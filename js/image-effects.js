/**
 * 高级图片特效和滤镜系统
 * 专业级图像处理和视觉效果
 */

class ImageEffectsEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.imageData = null;
        this.originalImageData = null;
        this.effects = new Map();
        this.presets = new Map();
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.loadEffects();
        this.loadPresets();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.cssText = `
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        `;
    }

    loadEffects() {
        // 基础滤镜效果
        this.effects.set('brightness', {
            name: '亮度',
            apply: (imageData, value) => this.adjustBrightness(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'basic'
        });

        this.effects.set('contrast', {
            name: '对比度',
            apply: (imageData, value) => this.adjustContrast(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'basic'
        });

        this.effects.set('saturation', {
            name: '饱和度',
            apply: (imageData, value) => this.adjustSaturation(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'basic'
        });

        this.effects.set('hue', {
            name: '色相',
            apply: (imageData, value) => this.adjustHue(imageData, value),
            range: { min: -180, max: 180, default: 0 },
            category: 'color'
        });

        this.effects.set('temperature', {
            name: '色温',
            apply: (imageData, value) => this.adjustTemperature(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'color'
        });

        this.effects.set('tint', {
            name: '色调',
            apply: (imageData, value) => this.adjustTint(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'color'
        });

        this.effects.set('exposure', {
            name: '曝光',
            apply: (imageData, value) => this.adjustExposure(imageData, value),
            range: { min: -200, max: 200, default: 0 },
            category: 'basic'
        });

        this.effects.set('highlights', {
            name: '高光',
            apply: (imageData, value) => this.adjustHighlights(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'tone'
        });

        this.effects.set('shadows', {
            name: '阴影',
            apply: (imageData, value) => this.adjustShadows(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'tone'
        });

        this.effects.set('whites', {
            name: '白色',
            apply: (imageData, value) => this.adjustWhites(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'tone'
        });

        this.effects.set('blacks', {
            name: '黑色',
            apply: (imageData, value) => this.adjustBlacks(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'tone'
        });

        this.effects.set('clarity', {
            name: '清晰度',
            apply: (imageData, value) => this.adjustClarity(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'detail'
        });

        this.effects.set('vibrance', {
            name: '自然饱和度',
            apply: (imageData, value) => this.adjustVibrance(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'color'
        });

        this.effects.set('dehaze', {
            name: '去雾',
            apply: (imageData, value) => this.adjustDehaze(imageData, value),
            range: { min: -100, max: 100, default: 0 },
            category: 'effect'
        });

        this.effects.set('grain', {
            name: '颗粒感',
            apply: (imageData, value) => this.addGrain(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'effect'
        });

        this.effects.set('vignette', {
            name: '暗角',
            apply: (imageData, value) => this.addVignette(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'effect'
        });

        this.effects.set('blur', {
            name: '模糊',
            apply: (imageData, value) => this.applyBlur(imageData, value),
            range: { min: 0, max: 10, default: 0 },
            category: 'effect'
        });

        this.effects.set('sharpen', {
            name: '锐化',
            apply: (imageData, value) => this.applySharpen(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'detail'
        });

        // 高级滤镜
        this.effects.set('vintage', {
            name: '复古',
            apply: (imageData, value) => this.applyVintage(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'style'
        });

        this.effects.set('sepia', {
            name: '褐色',
            apply: (imageData, value) => this.applySepia(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'style'
        });

        this.effects.set('blackAndWhite', {
            name: '黑白',
            apply: (imageData, value) => this.applyBlackAndWhite(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'style'
        });

        this.effects.set('crossProcess', {
            name: '交叉冲印',
            apply: (imageData, value) => this.applyCrossProcess(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'style'
        });

        this.effects.set('filmGrain', {
            name: '胶片颗粒',
            apply: (imageData, value) => this.applyFilmGrain(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'style'
        });

        this.effects.set('colorPop', {
            name: '色彩突出',
            apply: (imageData, value) => this.applyColorPop(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'style'
        });

        this.effects.set('drama', {
            name: '戏剧效果',
            apply: (imageData, value) => this.applyDrama(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'style'
        });

        this.effects.set('dreamy', {
            name: '梦幻效果',
            apply: (imageData, value) => this.applyDreamy(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'style'
        });

        this.effects.set('glow', {
            name: '发光效果',
            apply: (imageData, value) => this.applyGlow(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'effect'
        });

        this.effects.set('orton', {
            name: 'Orton效果',
            apply: (imageData, value) => this.applyOrton(imageData, value),
            range: { min: 0, max: 100, default: 0 },
            category: 'style'
        });
    }

    loadPresets() {
        this.presets.set('portrait', {
            name: '人像',
            description: '适合人像摄影的柔和效果',
            settings: {
                brightness: 5,
                contrast: 10,
                saturation: -10,
                highlights: -20,
                shadows: 15,
                clarity: -15,
                vibrance: 20,
                temperature: 5
            }
        });

        this.presets.set('landscape', {
            name: '风景',
            description: '增强风景照片的色彩和细节',
            settings: {
                contrast: 20,
                saturation: 15,
                clarity: 25,
                vibrance: 30,
                dehaze: 20,
                highlights: -15,
                shadows: 10
            }
        });

        this.presets.set('vintage', {
            name: '复古胶片',
            description: '经典胶片相机的复古效果',
            settings: {
                exposure: -10,
                contrast: 15,
                highlights: -30,
                shadows: 20,
                temperature: 15,
                tint: -5,
                vintage: 40,
                grain: 30,
                vignette: 25
            }
        });

        this.presets.set('blackWhite', {
            name: '黑白经典',
            description: '专业黑白摄影效果',
            settings: {
                blackAndWhite: 100,
                contrast: 25,
                clarity: 20,
                highlights: -20,
                shadows: 15,
                whites: 10,
                blacks: -10
            }
        });

        this.presets.set('fashion', {
            name: '时尚',
            description: '适合时尚摄影的高对比度效果',
            settings: {
                contrast: 30,
                saturation: 20,
                clarity: 35,
                highlights: -25,
                shadows: 5,
                vibrance: 25,
                sharpen: 20
            }
        });

        this.presets.set('dreamy', {
            name: '梦幻',
            description: '柔和梦幻的浪漫效果',
            settings: {
                brightness: 10,
                contrast: -10,
                saturation: -20,
                highlights: 15,
                clarity: -30,
                dreamy: 50,
                glow: 25,
                temperature: 10
            }
        });

        this.presets.set('dramatic', {
            name: '戏剧',
            description: '强烈戏剧化的视觉效果',
            settings: {
                contrast: 40,
                clarity: 50,
                highlights: -40,
                shadows: 30,
                blacks: -20,
                drama: 60,
                vignette: 35,
                saturation: 10
            }
        });

        this.presets.set('cinematic', {
            name: '电影',
            description: '电影级别的色彩分级',
            settings: {
                exposure: -5,
                contrast: 20,
                highlights: -30,
                shadows: 25,
                temperature: -5,
                tint: 5,
                saturation: -10,
                vibrance: 15,
                vignette: 20
            }
        });

        this.presets.set('natural', {
            name: '自然',
            description: '保持自然真实的色彩',
            settings: {
                contrast: 5,
                clarity: 10,
                vibrance: 15,
                highlights: -5,
                shadows: 5,
                dehaze: 10
            }
        });

        this.presets.set('warm', {
            name: '暖色调',
            description: '温暖舒适的色调',
            settings: {
                temperature: 25,
                tint: 5,
                exposure: 5,
                highlights: -10,
                shadows: 10,
                vibrance: 20,
                saturation: 5
            }
        });

        this.presets.set('cool', {
            name: '冷色调',
            description: '清冷现代的色调',
            settings: {
                temperature: -25,
                tint: -5,
                contrast: 15,
                highlights: -15,
                shadows: 5,
                clarity: 20,
                saturation: -5
            }
        });

        this.presets.set('matte', {
            name: '哑光',
            description: '现代哑光胶片效果',
            settings: {
                contrast: -15,
                highlights: -20,
                shadows: 20,
                whites: -20,
                blacks: 15,
                clarity: -10,
                grain: 15
            }
        });
    }

    setupEventListeners() {
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'r':
                        e.preventDefault();
                        this.reset();
                        break;
                }
            }
        });
    }

    // 基础调整方法
    adjustBrightness(imageData, value) {
        const data = imageData.data;
        const adjustment = value * 2.55; // 转换为0-255范围
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(0, Math.min(255, data[i] + adjustment));     // R
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adjustment)); // G
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adjustment)); // B
        }
        
        return imageData;
    }

    adjustContrast(imageData, value) {
        const data = imageData.data;
        const factor = (259 * (value + 255)) / (255 * (259 - value));
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
            data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
        }
        
        return imageData;
    }

    adjustSaturation(imageData, value) {
        const data = imageData.data;
        const saturation = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
            
            data[i] = Math.max(0, Math.min(255, gray + saturation * (r - gray)));
            data[i + 1] = Math.max(0, Math.min(255, gray + saturation * (g - gray)));
            data[i + 2] = Math.max(0, Math.min(255, gray + saturation * (b - gray)));
        }
        
        return imageData;
    }

    adjustHue(imageData, value) {
        const data = imageData.data;
        const hueShift = value * Math.PI / 180;
        
        for (let i = 0; i < data.length; i += 4) {
            const rgb = [data[i], data[i + 1], data[i + 2]];
            const hsv = this.rgbToHsv(rgb);
            
            hsv[0] = (hsv[0] + hueShift) % (2 * Math.PI);
            if (hsv[0] < 0) hsv[0] += 2 * Math.PI;
            
            const newRgb = this.hsvToRgb(hsv);
            data[i] = newRgb[0];
            data[i + 1] = newRgb[1];
            data[i + 2] = newRgb[2];
        }
        
        return imageData;
    }

    adjustTemperature(imageData, value) {
        const data = imageData.data;
        const temp = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            if (temp > 0) {
                // 暖色调 - 增加红色，减少蓝色
                data[i] = Math.min(255, data[i] + temp * 30);
                data[i + 2] = Math.max(0, data[i + 2] - temp * 30);
            } else {
                // 冷色调 - 增加蓝色，减少红色
                data[i] = Math.max(0, data[i] + temp * 30);
                data[i + 2] = Math.min(255, data[i + 2] - temp * 30);
            }
        }
        
        return imageData;
    }

    adjustTint(imageData, value) {
        const data = imageData.data;
        const tint = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            if (tint > 0) {
                // 洋红色调
                data[i] = Math.min(255, data[i] + tint * 20);
                data[i + 2] = Math.min(255, data[i + 2] + tint * 20);
                data[i + 1] = Math.max(0, data[i + 1] - tint * 10);
            } else {
                // 绿色调
                data[i + 1] = Math.min(255, data[i + 1] - tint * 20);
                data[i] = Math.max(0, data[i] + tint * 10);
                data[i + 2] = Math.max(0, data[i + 2] + tint * 10);
            }
        }
        
        return imageData;
    }

    adjustExposure(imageData, value) {
        const data = imageData.data;
        const exposure = Math.pow(2, value / 100);
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(0, Math.min(255, data[i] * exposure));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * exposure));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * exposure));
        }
        
        return imageData;
    }

    adjustHighlights(imageData, value) {
        const data = imageData.data;
        const adjustment = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            
            if (luminance > 128) {
                const factor = 1 + adjustment * (luminance - 128) / 127;
                data[i] = Math.max(0, Math.min(255, r * factor));
                data[i + 1] = Math.max(0, Math.min(255, g * factor));
                data[i + 2] = Math.max(0, Math.min(255, b * factor));
            }
        }
        
        return imageData;
    }

    adjustShadows(imageData, value) {
        const data = imageData.data;
        const adjustment = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            
            if (luminance < 128) {
                const factor = 1 + adjustment * (128 - luminance) / 128;
                data[i] = Math.max(0, Math.min(255, r * factor));
                data[i + 1] = Math.max(0, Math.min(255, g * factor));
                data[i + 2] = Math.max(0, Math.min(255, b * factor));
            }
        }
        
        return imageData;
    }

    adjustWhites(imageData, value) {
        const data = imageData.data;
        const adjustment = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            
            if (luminance > 200) {
                const factor = 1 + adjustment * (luminance - 200) / 55;
                data[i] = Math.max(0, Math.min(255, r * factor));
                data[i + 1] = Math.max(0, Math.min(255, g * factor));
                data[i + 2] = Math.max(0, Math.min(255, b * factor));
            }
        }
        
        return imageData;
    }

    adjustBlacks(imageData, value) {
        const data = imageData.data;
        const adjustment = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            
            if (luminance < 55) {
                const factor = 1 + adjustment * (55 - luminance) / 55;
                data[i] = Math.max(0, Math.min(255, r * factor));
                data[i + 1] = Math.max(0, Math.min(255, g * factor));
                data[i + 2] = Math.max(0, Math.min(255, b * factor));
            }
        }
        
        return imageData;
    }

    adjustClarity(imageData, value) {
        const data = imageData.data;
        const strength = value / 100;
        
        // 应用USM锐化算法的简化版本
        const width = imageData.width;
        const height = imageData.height;
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                // 获取周围像素
                const center = data[idx];
                const top = data[((y - 1) * width + x) * 4];
                const bottom = data[((y + 1) * width + x) * 4];
                const left = data[(y * width + (x - 1)) * 4];
                const right = data[(y * width + (x + 1)) * 4];
                
                // 计算拉普拉斯算子
                const laplacian = 4 * center - top - bottom - left - right;
                
                // 应用清晰度调整
                data[idx] = Math.max(0, Math.min(255, center + strength * laplacian * 0.2));
                data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + strength * laplacian * 0.2));
                data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + strength * laplacian * 0.2));
            }
        }
        
        return imageData;
    }

    adjustVibrance(imageData, value) {
        const data = imageData.data;
        const vibrance = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const max = Math.max(r, g, b);
            const avg = (r + g + b) / 3;
            const amt = (Math.abs(max - avg) * 2 / 255) * vibrance;
            
            if (r !== max) data[i] += (max - r) * amt;
            if (g !== max) data[i + 1] += (max - g) * amt;
            if (b !== max) data[i + 2] += (max - b) * amt;
        }
        
        return imageData;
    }

    adjustDehaze(imageData, value) {
        const data = imageData.data;
        const dehaze = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // 计算大气光
            const airlight = 255;
            const transmission = 1 - dehaze * 0.5;
            
            data[i] = Math.max(0, Math.min(255, (r - airlight) / Math.max(transmission, 0.1) + airlight));
            data[i + 1] = Math.max(0, Math.min(255, (g - airlight) / Math.max(transmission, 0.1) + airlight));
            data[i + 2] = Math.max(0, Math.min(255, (b - airlight) / Math.max(transmission, 0.1) + airlight));
        }
        
        return imageData;
    }

    // 特效方法
    addGrain(imageData, value) {
        const data = imageData.data;
        const grainAmount = value / 100 * 50;
        
        for (let i = 0; i < data.length; i += 4) {
            const grain = (Math.random() - 0.5) * grainAmount;
            data[i] = Math.max(0, Math.min(255, data[i] + grain));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
        }
        
        return imageData;
    }

    addVignette(imageData, value) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const vignetteStrength = value / 100;
        
        const centerX = width / 2;
        const centerY = height / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const distance = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));
                const vignette = 1 - (distance / maxDistance) * vignetteStrength;
                
                data[idx] *= vignette;
                data[idx + 1] *= vignette;
                data[idx + 2] *= vignette;
            }
        }
        
        return imageData;
    }

    applyBlur(imageData, value) {
        if (value === 0) return imageData;
        
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const radius = Math.floor(value);
        
        // 高斯模糊的简化实现
        const weights = this.getGaussianWeights(radius);
        const newData = new Uint8ClampedArray(data);
        
        // 水平模糊
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                let r = 0, g = 0, b = 0, totalWeight = 0;
                
                for (let i = -radius; i <= radius; i++) {
                    const xi = Math.max(0, Math.min(width - 1, x + i));
                    const weight = weights[i + radius];
                    const sampleIdx = (y * width + xi) * 4;
                    
                    r += data[sampleIdx] * weight;
                    g += data[sampleIdx + 1] * weight;
                    b += data[sampleIdx + 2] * weight;
                    totalWeight += weight;
                }
                
                newData[idx] = r / totalWeight;
                newData[idx + 1] = g / totalWeight;
                newData[idx + 2] = b / totalWeight;
            }
        }
        
        // 垂直模糊
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const idx = (y * width + x) * 4;
                let r = 0, g = 0, b = 0, totalWeight = 0;
                
                for (let i = -radius; i <= radius; i++) {
                    const yi = Math.max(0, Math.min(height - 1, y + i));
                    const weight = weights[i + radius];
                    const sampleIdx = (yi * width + x) * 4;
                    
                    r += newData[sampleIdx] * weight;
                    g += newData[sampleIdx + 1] * weight;
                    b += newData[sampleIdx + 2] * weight;
                    totalWeight += weight;
                }
                
                data[idx] = r / totalWeight;
                data[idx + 1] = g / totalWeight;
                data[idx + 2] = b / totalWeight;
            }
        }
        
        return imageData;
    }

    applySharpen(imageData, value) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const strength = value / 100;
        
        const kernel = [
            0, -1 * strength, 0,
            -1 * strength, 1 + 4 * strength, -1 * strength,
            0, -1 * strength, 0
        ];
        
        const newData = new Uint8ClampedArray(data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const sampleIdx = ((y + ky) * width + (x + kx)) * 4;
                            sum += data[sampleIdx + c] * kernel[(ky + 1) * 3 + (kx + 1)];
                        }
                    }
                    newData[idx + c] = Math.max(0, Math.min(255, sum));
                }
            }
        }
        
        data.set(newData);
        return imageData;
    }

    // 风格滤镜
    applyVintage(imageData, value) {
        const data = imageData.data;
        const strength = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // 复古色调映射
            const newR = r * (1 - strength * 0.3) + (r * 0.393 + g * 0.769 + b * 0.189) * strength;
            const newG = g * (1 - strength * 0.3) + (r * 0.349 + g * 0.686 + b * 0.168) * strength;
            const newB = b * (1 - strength * 0.3) + (r * 0.272 + g * 0.534 + b * 0.131) * strength;
            
            data[i] = Math.max(0, Math.min(255, newR));
            data[i + 1] = Math.max(0, Math.min(255, newG));
            data[i + 2] = Math.max(0, Math.min(255, newB));
        }
        
        return imageData;
    }

    applySepia(imageData, value) {
        const data = imageData.data;
        const strength = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const sepiaR = (r * 0.393 + g * 0.769 + b * 0.189);
            const sepiaG = (r * 0.349 + g * 0.686 + b * 0.168);
            const sepiaB = (r * 0.272 + g * 0.534 + b * 0.131);
            
            data[i] = Math.max(0, Math.min(255, r * (1 - strength) + sepiaR * strength));
            data[i + 1] = Math.max(0, Math.min(255, g * (1 - strength) + sepiaG * strength));
            data[i + 2] = Math.max(0, Math.min(255, b * (1 - strength) + sepiaB * strength));
        }
        
        return imageData;
    }

    applyBlackAndWhite(imageData, value) {
        const data = imageData.data;
        const strength = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const gray = r * 0.299 + g * 0.587 + b * 0.114;
            
            data[i] = r * (1 - strength) + gray * strength;
            data[i + 1] = g * (1 - strength) + gray * strength;
            data[i + 2] = b * (1 - strength) + gray * strength;
        }
        
        return imageData;
    }

    applyDreamy(imageData, value) {
        const data = imageData.data;
        const strength = value / 100;
        
        // 首先应用轻微的模糊和高光效果
        this.applyBlur(imageData, strength * 2);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // 增加亮度和减少对比度
            const dreamyR = r + (255 - r) * strength * 0.3;
            const dreamyG = g + (255 - g) * strength * 0.3;
            const dreamyB = b + (255 - b) * strength * 0.3;
            
            data[i] = Math.max(0, Math.min(255, dreamyR));
            data[i + 1] = Math.max(0, Math.min(255, dreamyG));
            data[i + 2] = Math.max(0, Math.min(255, dreamyB));
        }
        
        return imageData;
    }

    applyGlow(imageData, value) {
        const data = imageData.data;
        const strength = value / 100;
        const width = imageData.width;
        const height = imageData.height;
        
        // 创建发光效果
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                
                if (luminance > 180) {
                    const glowFactor = (luminance - 180) / 75 * strength;
                    data[idx] = Math.min(255, r + glowFactor * 50);
                    data[idx + 1] = Math.min(255, g + glowFactor * 50);
                    data[idx + 2] = Math.min(255, b + glowFactor * 50);
                }
            }
        }
        
        return imageData;
    }

    // 辅助方法
    rgbToHsv([r, g, b]) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        let h = 0;
        const s = max === 0 ? 0 : diff / max;
        const v = max;
        
        if (diff !== 0) {
            switch (max) {
                case r:
                    h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / diff + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / diff + 4) / 6;
                    break;
            }
        }
        
        return [h * 2 * Math.PI, s, v];
    }

    hsvToRgb([h, s, v]) {
        h = h / (2 * Math.PI);
        
        const c = v * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = v - c;
        
        let r, g, b;
        
        if (h < 1/6) {
            [r, g, b] = [c, x, 0];
        } else if (h < 2/6) {
            [r, g, b] = [x, c, 0];
        } else if (h < 3/6) {
            [r, g, b] = [0, c, x];
        } else if (h < 4/6) {
            [r, g, b] = [0, x, c];
        } else if (h < 5/6) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }
        
        return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255)
        ];
    }

    getGaussianWeights(radius) {
        const weights = [];
        const sigma = radius / 3;
        let sum = 0;
        
        for (let i = -radius; i <= radius; i++) {
            const weight = Math.exp(-(i * i) / (2 * sigma * sigma));
            weights.push(weight);
            sum += weight;
        }
        
        // 归一化
        return weights.map(w => w / sum);
    }

    // 公共API方法
    loadImage(imageElement) {
        this.canvas.width = imageElement.naturalWidth;
        this.canvas.height = imageElement.naturalHeight;
        
        this.ctx.drawImage(imageElement, 0, 0);
        this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.originalImageData = this.ctx.createImageData(this.imageData);
        this.originalImageData.data.set(this.imageData.data);
        
        this.saveState();
        return this.canvas;
    }

    applyEffect(effectName, value) {
        const effect = this.effects.get(effectName);
        if (!effect) return;
        
        // 从原始图像开始
        this.imageData.data.set(this.originalImageData.data);
        
        // 应用效果
        effect.apply(this.imageData, value);
        
        // 更新画布
        this.ctx.putImageData(this.imageData, 0, 0);
        
        this.saveState();
    }

    applyPreset(presetName) {
        const preset = this.presets.get(presetName);
        if (!preset) return;
        
        // 重置到原始图像
        this.reset();
        
        // 按顺序应用所有设置
        Object.entries(preset.settings).forEach(([effectName, value]) => {
            const effect = this.effects.get(effectName);
            if (effect) {
                effect.apply(this.imageData, value);
            }
        });
        
        // 更新画布
        this.ctx.putImageData(this.imageData, 0, 0);
        
        this.saveState();
    }

    reset() {
        if (this.originalImageData) {
            this.imageData.data.set(this.originalImageData.data);
            this.ctx.putImageData(this.imageData, 0, 0);
            this.saveState();
        }
    }

    saveState() {
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        const state = this.ctx.createImageData(this.imageData);
        state.data.set(this.imageData.data);
        this.history.push(state);
        
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const state = this.history[this.historyIndex];
            this.imageData.data.set(state.data);
            this.ctx.putImageData(this.imageData, 0, 0);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const state = this.history[this.historyIndex];
            this.imageData.data.set(state.data);
            this.ctx.putImageData(this.imageData, 0, 0);
        }
    }

    exportImage(format = 'png', quality = 0.9) {
        return this.canvas.toDataURL(`image/${format}`, quality);
    }

    getCanvas() {
        return this.canvas;
    }

    getEffects() {
        return Array.from(this.effects.entries()).map(([id, effect]) => ({
            id,
            name: effect.name,
            range: effect.range,
            category: effect.category
        }));
    }

    getPresets() {
        return Array.from(this.presets.entries()).map(([id, preset]) => ({
            id,
            name: preset.name,
            description: preset.description
        }));
    }
}

// 全局导出
window.ImageEffectsEngine = ImageEffectsEngine;
