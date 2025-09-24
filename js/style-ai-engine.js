/**
 * 写真风格AI推荐引擎
 * 基于用户偏好、脸型、肤色等因素智能推荐最适合的写真风格
 */

class StyleAIEngine {
    constructor() {
        this.faceAnalysisModel = null;
        this.colorAnalysisModel = null;
        this.styleDatabase = null;
        this.userPreferences = new Map();
        this.sessionData = new Map();
        this.trendingStyles = [];
        
        this.init();
    }

    async init() {
        try {
            await this.loadModels();
            await this.loadStyleDatabase();
            this.initializeAnalytics();
            this.setupRealtimeUpdates();
            console.log('Style AI Engine initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Style AI Engine:', error);
        }
    }

    async loadModels() {
        // 模拟加载AI模型
        this.faceAnalysisModel = {
            analyzeFaceShape: (imageData) => {
                // 模拟脸型分析
                const shapes = ['oval', 'round', 'square', 'heart', 'diamond', 'long'];
                return shapes[Math.floor(Math.random() * shapes.length)];
            },
            
            detectFeatures: (imageData) => {
                return {
                    eyeShape: ['almond', 'round', 'monolid', 'hooded'][Math.floor(Math.random() * 4)],
                    noseShape: ['straight', 'button', 'aquiline', 'snub'][Math.floor(Math.random() * 4)],
                    lipShape: ['full', 'thin', 'wide', 'small'][Math.floor(Math.random() * 4)],
                    skinTone: this.analyzeSkinTone(imageData)
                };
            }
        };

        this.colorAnalysisModel = {
            analyzePersonalColors: (imageData) => {
                const seasons = ['spring', 'summer', 'autumn', 'winter'];
                const subtypes = ['light', 'warm', 'clear', 'soft', 'deep', 'cool'];
                
                return {
                    season: seasons[Math.floor(Math.random() * seasons.length)],
                    subtype: subtypes[Math.floor(Math.random() * subtypes.length)],
                    bestColors: this.generateColorPalette(),
                    avoidColors: this.generateAvoidColors()
                };
            }
        };
    }

    analyzeSkinTone(imageData) {
        // 模拟肤色分析
        const tones = {
            fair: { undertone: 'cool', rgb: [252, 228, 214] },
            light: { undertone: 'warm', rgb: [241, 194, 164] },
            medium: { undertone: 'neutral', rgb: [224, 172, 127] },
            tan: { undertone: 'warm', rgb: [198, 134, 90] },
            deep: { undertone: 'cool', rgb: [161, 102, 59] },
            dark: { undertone: 'warm', rgb: [110, 64, 25] }
        };
        
        const toneKeys = Object.keys(tones);
        const selectedTone = toneKeys[Math.floor(Math.random() * toneKeys.length)];
        return tones[selectedTone];
    }

    generateColorPalette() {
        const colorPalettes = {
            spring: ['#FFB6C1', '#98FB98', '#F0E68C', '#DDA0DD'],
            summer: ['#E6E6FA', '#B0E0E6', '#F0F8FF', '#FFE4E1'],
            autumn: ['#CD853F', '#D2691E', '#A0522D', '#8B4513'],
            winter: ['#000080', '#8B008B', '#DC143C', '#2F4F4F']
        };
        
        const seasons = Object.keys(colorPalettes);
        const season = seasons[Math.floor(Math.random() * seasons.length)];
        return colorPalettes[season];
    }

    generateAvoidColors() {
        return ['#FF6347', '#32CD32', '#FF1493', '#00CED1'];
    }

    async loadStyleDatabase() {
        this.styleDatabase = {
            styles: [
                {
                    id: 'korean-fresh',
                    name: '韩式清新',
                    category: 'fresh',
                    difficulty: 'easy',
                    popularity: 95,
                    suitableFaceShapes: ['oval', 'round', 'heart'],
                    suitableSkinTones: ['fair', 'light'],
                    colorScheme: ['soft-pink', 'cream', 'light-blue'],
                    makeupStyle: 'natural',
                    clothingStyle: 'casual-chic',
                    lightingSetup: 'soft-natural',
                    props: ['flowers', 'books', 'coffee'],
                    poses: ['sitting', 'lying', 'walking'],
                    mood: 'gentle',
                    ageGroups: ['teens', 'twenties', 'thirties'],
                    genderSuitability: ['female'],
                    seasonality: ['spring', 'summer'],
                    locationTypes: ['indoor', 'garden', 'cafe'],
                    timeOfDay: ['morning', 'afternoon'],
                    weatherConditions: ['sunny', 'cloudy'],
                    characteristics: {
                        sweetness: 90,
                        sophistication: 30,
                        drama: 10,
                        playfulness: 70,
                        elegance: 60
                    },
                    technicalRequirements: {
                        cameraSettings: {
                            aperture: 'f/2.8-f/4',
                            shutterSpeed: '1/60-1/125',
                            iso: '100-400'
                        },
                        lensRecommendations: ['50mm', '85mm'],
                        lightingEquipment: ['softbox', 'reflector'],
                        postProcessing: ['soft-filter', 'brightness-boost', 'warm-tone']
                    },
                    price: 298,
                    duration: 60,
                    includesChanges: 2,
                    retouchedPhotos: 15,
                    tags: ['流行', '甜美', '日系', '小清新']
                },
                {
                    id: 'vintage-glam',
                    name: '复古魅力',
                    category: 'vintage',
                    difficulty: 'intermediate',
                    popularity: 78,
                    suitableFaceShapes: ['oval', 'square', 'diamond'],
                    suitableSkinTones: ['medium', 'tan', 'deep'],
                    colorScheme: ['burgundy', 'gold', 'emerald'],
                    makeupStyle: 'dramatic',
                    clothingStyle: 'vintage-luxury',
                    lightingSetup: 'dramatic-contrast',
                    props: ['vintage-furniture', 'jewelry', 'flowers'],
                    poses: ['standing', 'sitting-elegant', 'profile'],
                    mood: 'sophisticated',
                    ageGroups: ['twenties', 'thirties', 'forties'],
                    genderSuitability: ['female', 'male'],
                    seasonality: ['autumn', 'winter'],
                    locationTypes: ['studio', 'hotel', 'mansion'],
                    timeOfDay: ['afternoon', 'evening'],
                    weatherConditions: ['any'],
                    characteristics: {
                        sweetness: 20,
                        sophistication: 95,
                        drama: 85,
                        playfulness: 30,
                        elegance: 90
                    },
                    technicalRequirements: {
                        cameraSettings: {
                            aperture: 'f/1.4-f/2.8',
                            shutterSpeed: '1/80-1/160',
                            iso: '200-800'
                        },
                        lensRecommendations: ['35mm', '50mm', '85mm'],
                        lightingEquipment: ['key-light', 'fill-light', 'background-light'],
                        postProcessing: ['film-grain', 'color-grading', 'contrast-enhancement']
                    },
                    price: 598,
                    duration: 90,
                    includesChanges: 3,
                    retouchedPhotos: 25,
                    tags: ['经典', '奢华', '怀旧', '高端']
                },
                {
                    id: 'modern-fashion',
                    name: '现代时尚',
                    category: 'fashion',
                    difficulty: 'advanced',
                    popularity: 87,
                    suitableFaceShapes: ['all'],
                    suitableSkinTones: ['all'],
                    colorScheme: ['black', 'white', 'neon-accents'],
                    makeupStyle: 'editorial',
                    clothingStyle: 'high-fashion',
                    lightingSetup: 'creative-dramatic',
                    props: ['geometric-shapes', 'mirrors', 'technology'],
                    poses: ['dynamic', 'editorial', 'conceptual'],
                    mood: 'edgy',
                    ageGroups: ['teens', 'twenties', 'thirties'],
                    genderSuitability: ['female', 'male', 'non-binary'],
                    seasonality: ['all'],
                    locationTypes: ['studio', 'urban', 'rooftop'],
                    timeOfDay: ['any'],
                    weatherConditions: ['any'],
                    characteristics: {
                        sweetness: 10,
                        sophistication: 70,
                        drama: 95,
                        playfulness: 60,
                        elegance: 50
                    },
                    technicalRequirements: {
                        cameraSettings: {
                            aperture: 'f/2.8-f/8',
                            shutterSpeed: '1/125-1/250',
                            iso: '100-1600'
                        },
                        lensRecommendations: ['24-70mm', '70-200mm'],
                        lightingEquipment: ['strobe', 'colored-gels', 'fog-machine'],
                        postProcessing: ['color-grading', 'contrast-boost', 'creative-effects']
                    },
                    price: 798,
                    duration: 120,
                    includesChanges: 4,
                    retouchedPhotos: 30,
                    tags: ['前卫', '时尚', '创意', '艺术']
                },
                {
                    id: 'natural-outdoor',
                    name: '自然户外',
                    category: 'fresh',
                    difficulty: 'easy',
                    popularity: 82,
                    suitableFaceShapes: ['all'],
                    suitableSkinTones: ['all'],
                    colorScheme: ['earth-tones', 'greens', 'sky-blue'],
                    makeupStyle: 'minimal',
                    clothingStyle: 'casual-natural',
                    lightingSetup: 'natural-light',
                    props: ['nature-elements', 'blankets', 'baskets'],
                    poses: ['walking', 'sitting-casual', 'laughing'],
                    mood: 'relaxed',
                    ageGroups: ['all'],
                    genderSuitability: ['female', 'male', 'family'],
                    seasonality: ['spring', 'summer', 'autumn'],
                    locationTypes: ['park', 'forest', 'beach', 'field'],
                    timeOfDay: ['golden-hour', 'blue-hour'],
                    weatherConditions: ['sunny', 'partly-cloudy'],
                    characteristics: {
                        sweetness: 60,
                        sophistication: 40,
                        drama: 20,
                        playfulness: 80,
                        elegance: 50
                    },
                    technicalRequirements: {
                        cameraSettings: {
                            aperture: 'f/1.8-f/4',
                            shutterSpeed: '1/250-1/500',
                            iso: '100-800'
                        },
                        lensRecommendations: ['35mm', '50mm', '85mm'],
                        lightingEquipment: ['reflector', 'diffuser'],
                        postProcessing: ['warm-tone', 'natural-enhancement', 'soft-contrast']
                    },
                    price: 398,
                    duration: 90,
                    includesChanges: 2,
                    retouchedPhotos: 20,
                    tags: ['自然', '清新', '户外', '生活']
                },
                {
                    id: 'artistic-portrait',
                    name: '艺术人像',
                    category: 'art',
                    difficulty: 'expert',
                    popularity: 65,
                    suitableFaceShapes: ['oval', 'square', 'diamond'],
                    suitableSkinTones: ['medium', 'tan', 'deep'],
                    colorScheme: ['monochrome', 'bold-contrasts'],
                    makeupStyle: 'artistic',
                    clothingStyle: 'conceptual',
                    lightingSetup: 'artistic-dramatic',
                    props: ['art-pieces', 'fabrics', 'shadows'],
                    poses: ['artistic', 'abstract', 'emotional'],
                    mood: 'contemplative',
                    ageGroups: ['twenties', 'thirties', 'forties', 'fifties'],
                    genderSuitability: ['female', 'male'],
                    seasonality: ['all'],
                    locationTypes: ['studio', 'gallery', 'artistic-spaces'],
                    timeOfDay: ['any'],
                    weatherConditions: ['any'],
                    characteristics: {
                        sweetness: 30,
                        sophistication: 95,
                        drama: 90,
                        playfulness: 20,
                        elegance: 85
                    },
                    technicalRequirements: {
                        cameraSettings: {
                            aperture: 'f/1.4-f/5.6',
                            shutterSpeed: '1/60-1/200',
                            iso: '100-3200'
                        },
                        lensRecommendations: ['50mm', '85mm', '135mm'],
                        lightingEquipment: ['beauty-dish', 'strip-light', 'background-light'],
                        postProcessing: ['black-white-conversion', 'artistic-filters', 'texture-enhancement']
                    },
                    price: 898,
                    duration: 150,
                    includesChanges: 5,
                    retouchedPhotos: 35,
                    tags: ['艺术', '创意', '情感', '专业']
                }
            ],
            
            trendingStyles: [
                { id: 'korean-fresh', trendScore: 95, reason: '韩流文化影响' },
                { id: 'modern-fashion', trendScore: 87, reason: '社交媒体流行' },
                { id: 'natural-outdoor', trendScore: 82, reason: '返璞归真趋势' }
            ],
            
            seasonalRecommendations: {
                spring: ['korean-fresh', 'natural-outdoor'],
                summer: ['natural-outdoor', 'modern-fashion'],
                autumn: ['vintage-glam', 'artistic-portrait'],
                winter: ['vintage-glam', 'modern-fashion']
            },
            
            ageGroupPreferences: {
                teens: ['korean-fresh', 'modern-fashion'],
                twenties: ['korean-fresh', 'modern-fashion', 'natural-outdoor'],
                thirties: ['vintage-glam', 'artistic-portrait', 'natural-outdoor'],
                forties: ['vintage-glam', 'artistic-portrait'],
                fifties: ['artistic-portrait', 'vintage-glam']
            }
        };
    }

    async analyzeUser(userData) {
        const analysis = {
            faceShape: null,
            features: null,
            colorAnalysis: null,
            preferences: new Map(),
            demographics: {
                age: userData.age || null,
                gender: userData.gender || null,
                location: userData.location || null
            }
        };

        if (userData.photo) {
            analysis.faceShape = this.faceAnalysisModel.analyzeFaceShape(userData.photo);
            analysis.features = this.faceAnalysisModel.detectFeatures(userData.photo);
            analysis.colorAnalysis = this.colorAnalysisModel.analyzePersonalColors(userData.photo);
        }

        if (userData.preferences) {
            userData.preferences.forEach((value, key) => {
                analysis.preferences.set(key, value);
            });
        }

        return analysis;
    }

    generateRecommendations(userAnalysis, context = {}) {
        const recommendations = [];
        const styles = this.styleDatabase.styles;

        // 计算每个风格的匹配度
        styles.forEach(style => {
            const score = this.calculateStyleScore(style, userAnalysis, context);
            recommendations.push({
                style,
                score,
                reasons: this.generateRecommendationReasons(style, userAnalysis, score)
            });
        });

        // 按分数排序
        recommendations.sort((a, b) => b.score - a.score);

        // 添加多样性
        const diversifiedRecommendations = this.addDiversity(recommendations);

        // 返回前10个推荐
        return diversifiedRecommendations.slice(0, 10).map(rec => ({
            ...rec,
            confidence: this.calculateConfidence(rec.score),
            personalizedPrice: this.calculatePersonalizedPrice(rec.style, userAnalysis)
        }));
    }

    calculateStyleScore(style, userAnalysis, context) {
        let score = 0;
        const weights = {
            faceShape: 0.2,
            skinTone: 0.15,
            features: 0.1,
            colorAnalysis: 0.15,
            demographics: 0.1,
            preferences: 0.2,
            trending: 0.05,
            seasonal: 0.05
        };

        // 脸型匹配
        if (userAnalysis.faceShape && style.suitableFaceShapes.includes(userAnalysis.faceShape)) {
            score += weights.faceShape * 100;
        } else if (style.suitableFaceShapes.includes('all')) {
            score += weights.faceShape * 80;
        }

        // 肤色匹配
        if (userAnalysis.features && userAnalysis.features.skinTone) {
            const skinToneKey = this.getSkinToneKey(userAnalysis.features.skinTone);
            if (style.suitableSkinTones.includes(skinToneKey) || style.suitableSkinTones.includes('all')) {
                score += weights.skinTone * 100;
            }
        }

        // 个人色彩分析匹配
        if (userAnalysis.colorAnalysis) {
            const colorMatch = this.checkColorCompatibility(style.colorScheme, userAnalysis.colorAnalysis);
            score += weights.colorAnalysis * colorMatch;
        }

        // 年龄匹配
        if (userAnalysis.demographics.age) {
            const ageGroup = this.getAgeGroup(userAnalysis.demographics.age);
            if (style.ageGroups.includes(ageGroup)) {
                score += weights.demographics * 100;
            }
        }

        // 性别匹配
        if (userAnalysis.demographics.gender && style.genderSuitability.includes(userAnalysis.demographics.gender)) {
            score += weights.demographics * 50;
        }

        // 用户偏好匹配
        if (userAnalysis.preferences.size > 0) {
            const preferenceScore = this.calculatePreferenceScore(style, userAnalysis.preferences);
            score += weights.preferences * preferenceScore;
        }

        // 趋势加分
        const trendingStyle = this.styleDatabase.trendingStyles.find(t => t.id === style.id);
        if (trendingStyle) {
            score += weights.trending * trendingStyle.trendScore;
        }

        // 季节性加分
        const currentSeason = this.getCurrentSeason();
        if (style.seasonality.includes(currentSeason) || style.seasonality.includes('all')) {
            score += weights.seasonal * 100;
        }

        // 上下文加分
        if (context.occasion && this.isStyleSuitableForOccasion(style, context.occasion)) {
            score += 10;
        }

        if (context.budget && style.price <= context.budget) {
            score += 5;
        }

        return Math.min(score, 100); // 确保分数不超过100
    }

    getSkinToneKey(skinTone) {
        const rgb = skinTone.rgb;
        const brightness = (rgb[0] + rgb[1] + rgb[2]) / 3;
        
        if (brightness > 230) return 'fair';
        if (brightness > 200) return 'light';
        if (brightness > 150) return 'medium';
        if (brightness > 100) return 'tan';
        if (brightness > 50) return 'deep';
        return 'dark';
    }

    checkColorCompatibility(styleColors, colorAnalysis) {
        // 简化的颜色兼容性检查
        const seasonalColors = {
            spring: ['warm', 'bright', 'clear'],
            summer: ['cool', 'soft', 'muted'],
            autumn: ['warm', 'deep', 'rich'],
            winter: ['cool', 'clear', 'bright']
        };

        const userSeasonColors = seasonalColors[colorAnalysis.season] || [];
        let compatibility = 0;

        styleColors.forEach(color => {
            if (colorAnalysis.bestColors.includes(color)) {
                compatibility += 25;
            }
        });

        return Math.min(compatibility, 100);
    }

    getAgeGroup(age) {
        if (age < 20) return 'teens';
        if (age < 30) return 'twenties';
        if (age < 40) return 'thirties';
        if (age < 50) return 'forties';
        return 'fifties';
    }

    calculatePreferenceScore(style, preferences) {
        let score = 0;
        let totalWeight = 0;

        // 风格特征偏好
        const characteristics = ['sweetness', 'sophistication', 'drama', 'playfulness', 'elegance'];
        characteristics.forEach(char => {
            if (preferences.has(char)) {
                const userPref = preferences.get(char);
                const styleValue = style.characteristics[char];
                const match = 100 - Math.abs(userPref - styleValue);
                score += match * 0.2;
                totalWeight += 0.2;
            }
        });

        // 类别偏好
        if (preferences.has('category') && preferences.get('category') === style.category) {
            score += 100 * 0.3;
            totalWeight += 0.3;
        }

        // 难度偏好
        if (preferences.has('difficulty')) {
            const difficultyMatch = {
                'easy': ['easy'],
                'intermediate': ['easy', 'intermediate'],
                'advanced': ['intermediate', 'advanced'],
                'expert': ['advanced', 'expert']
            };
            
            const userDifficulty = preferences.get('difficulty');
            if (difficultyMatch[userDifficulty].includes(style.difficulty)) {
                score += 100 * 0.2;
                totalWeight += 0.2;
            }
        }

        // 预算偏好
        if (preferences.has('budget')) {
            const budget = preferences.get('budget');
            if (style.price <= budget) {
                score += 100 * 0.3;
                totalWeight += 0.3;
            } else {
                const overBudget = ((style.price - budget) / budget) * 100;
                score += Math.max(0, 100 - overBudget) * 0.3;
                totalWeight += 0.3;
            }
        }

        return totalWeight > 0 ? score / totalWeight : 50; // 默认中等分数
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    isStyleSuitableForOccasion(style, occasion) {
        const occasionMapping = {
            'wedding': ['vintage-glam', 'artistic-portrait'],
            'graduation': ['korean-fresh', 'natural-outdoor'],
            'professional': ['modern-fashion', 'artistic-portrait'],
            'casual': ['korean-fresh', 'natural-outdoor'],
            'special-event': ['vintage-glam', 'modern-fashion']
        };

        return occasionMapping[occasion]?.includes(style.id) || false;
    }

    generateRecommendationReasons(style, userAnalysis, score) {
        const reasons = [];

        // 基于分析的原因
        if (userAnalysis.faceShape && style.suitableFaceShapes.includes(userAnalysis.faceShape)) {
            reasons.push(`非常适合您的${this.getFaceShapeDescription(userAnalysis.faceShape)}脸型`);
        }

        if (userAnalysis.features?.skinTone) {
            const skinToneKey = this.getSkinToneKey(userAnalysis.features.skinTone);
            if (style.suitableSkinTones.includes(skinToneKey)) {
                reasons.push(`完美匹配您的肤色`);
            }
        }

        if (userAnalysis.colorAnalysis) {
            const colorMatch = this.checkColorCompatibility(style.colorScheme, userAnalysis.colorAnalysis);
            if (colorMatch > 50) {
                reasons.push(`与您的个人色彩完美搭配`);
            }
        }

        // 基于流行趋势的原因
        const trendingStyle = this.styleDatabase.trendingStyles.find(t => t.id === style.id);
        if (trendingStyle && trendingStyle.trendScore > 80) {
            reasons.push(`当前最受欢迎的风格`);
        }

        // 基于季节的原因
        const currentSeason = this.getCurrentSeason();
        if (style.seasonality.includes(currentSeason)) {
            reasons.push(`${this.getSeasonDescription(currentSeason)}首选风格`);
        }

        // 基于特征的原因
        if (style.characteristics.elegance > 80) {
            reasons.push('展现优雅气质');
        }
        if (style.characteristics.sweetness > 80) {
            reasons.push('突出甜美魅力');
        }
        if (style.characteristics.sophistication > 80) {
            reasons.push('彰显成熟魅力');
        }

        return reasons.slice(0, 3); // 最多返回3个原因
    }

    getFaceShapeDescription(faceShape) {
        const descriptions = {
            'oval': '椭圆形',
            'round': '圆形',
            'square': '方形',
            'heart': '心形',
            'diamond': '菱形',
            'long': '长形'
        };
        return descriptions[faceShape] || faceShape;
    }

    getSeasonDescription(season) {
        const descriptions = {
            'spring': '春季',
            'summer': '夏季',
            'autumn': '秋季',
            'winter': '冬季'
        };
        return descriptions[season] || season;
    }

    addDiversity(recommendations) {
        const diversified = [];
        const categoryCounts = new Map();
        const maxPerCategory = 3;

        recommendations.forEach(rec => {
            const category = rec.style.category;
            const currentCount = categoryCounts.get(category) || 0;

            if (currentCount < maxPerCategory) {
                diversified.push(rec);
                categoryCounts.set(category, currentCount + 1);
            }
        });

        // 如果多样化后数量不足，添加剩余的高分推荐
        if (diversified.length < 10) {
            recommendations.forEach(rec => {
                if (diversified.length >= 10) return;
                if (!diversified.includes(rec)) {
                    diversified.push(rec);
                }
            });
        }

        return diversified;
    }

    calculateConfidence(score) {
        if (score >= 90) return 'very-high';
        if (score >= 75) return 'high';
        if (score >= 60) return 'medium';
        if (score >= 45) return 'low';
        return 'very-low';
    }

    calculatePersonalizedPrice(style, userAnalysis) {
        let price = style.price;
        let discount = 0;

        // 新用户折扣
        if (this.isNewUser(userAnalysis)) {
            discount += 0.1; // 10% 折扣
        }

        // 会员折扣
        if (userAnalysis.membershipLevel) {
            const memberDiscounts = {
                'bronze': 0.05,
                'silver': 0.1,
                'gold': 0.15,
                'platinum': 0.2
            };
            discount += memberDiscounts[userAnalysis.membershipLevel] || 0;
        }

        // 季节性折扣
        const currentSeason = this.getCurrentSeason();
        if (style.seasonality.includes(currentSeason)) {
            discount += 0.05; // 5% 季节折扣
        }

        // 应用折扣
        const finalPrice = Math.round(price * (1 - Math.min(discount, 0.3))); // 最大30%折扣
        
        return {
            originalPrice: price,
            finalPrice,
            discount: Math.round(discount * 100),
            savings: price - finalPrice
        };
    }

    isNewUser(userAnalysis) {
        // 简单的新用户检测逻辑
        return !userAnalysis.previousSessions || userAnalysis.previousSessions.length === 0;
    }

    // 实时学习和优化
    recordUserInteraction(userId, styleId, interaction) {
        const key = `${userId}_${styleId}`;
        if (!this.sessionData.has(key)) {
            this.sessionData.set(key, {
                views: 0,
                clicks: 0,
                bookings: 0,
                ratings: []
            });
        }

        const data = this.sessionData.get(key);
        
        switch (interaction.type) {
            case 'view':
                data.views++;
                break;
            case 'click':
                data.clicks++;
                break;
            case 'booking':
                data.bookings++;
                break;
            case 'rating':
                data.ratings.push(interaction.value);
                break;
        }

        this.sessionData.set(key, data);
        this.updateRecommendationModel(userId, styleId, data);
    }

    updateRecommendationModel(userId, styleId, interactionData) {
        // 更新用户偏好模型
        const conversionRate = interactionData.bookings / Math.max(interactionData.views, 1);
        const avgRating = interactionData.ratings.length > 0 
            ? interactionData.ratings.reduce((a, b) => a + b, 0) / interactionData.ratings.length 
            : 0;

        // 更新风格受欢迎度
        const style = this.styleDatabase.styles.find(s => s.id === styleId);
        if (style) {
            style.popularity = Math.min(100, style.popularity + conversionRate * 10 + avgRating);
        }

        // 更新趋势数据
        const trendingStyle = this.styleDatabase.trendingStyles.find(t => t.id === styleId);
        if (trendingStyle) {
            trendingStyle.trendScore = Math.min(100, trendingStyle.trendScore + conversionRate * 5);
        }
    }

    initializeAnalytics() {
        this.analytics = {
            totalRecommendations: 0,
            successfulBookings: 0,
            averageUserSatisfaction: 0,
            popularStyles: new Map(),
            conversionRates: new Map()
        };
    }

    setupRealtimeUpdates() {
        // 模拟实时更新
        setInterval(() => {
            this.updateTrendingStyles();
            this.optimizeRecommendations();
        }, 300000); // 每5分钟更新一次
    }

    updateTrendingStyles() {
        // 基于最近的用户交互更新趋势风格
        const styleScores = new Map();
        
        this.sessionData.forEach((data, key) => {
            const styleId = key.split('_')[1];
            const score = data.bookings * 10 + data.clicks * 2 + data.views;
            styleScores.set(styleId, (styleScores.get(styleId) || 0) + score);
        });

        // 更新趋势列表
        const trendingArray = Array.from(styleScores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([styleId, score]) => ({
                id: styleId,
                trendScore: Math.min(100, score / 10),
                reason: '用户行为驱动'
            }));

        this.styleDatabase.trendingStyles = trendingArray;
    }

    optimizeRecommendations() {
        // 基于性能数据优化推荐算法
        console.log('Optimizing recommendation engine based on user feedback');
    }

    // 导出学习到的偏好数据
    exportUserPreferences(userId) {
        const userInteractions = Array.from(this.sessionData.entries())
            .filter(([key]) => key.startsWith(userId))
            .map(([key, data]) => ({
                styleId: key.split('_')[1],
                ...data
            }));

        return {
            userId,
            interactions: userInteractions,
            preferences: this.inferPreferences(userInteractions),
            recommendations: this.getTopRecommendations(userId)
        };
    }

    inferPreferences(interactions) {
        const preferences = new Map();
        
        // 基于用户交互推断偏好
        interactions.forEach(interaction => {
            const style = this.styleDatabase.styles.find(s => s.id === interaction.styleId);
            if (style && interaction.bookings > 0) {
                // 用户预订的风格表明偏好
                preferences.set('category', style.category);
                preferences.set('difficulty', style.difficulty);
                
                Object.entries(style.characteristics).forEach(([char, value]) => {
                    const currentPref = preferences.get(char) || 0;
                    preferences.set(char, (currentPref + value) / 2);
                });
            }
        });

        return preferences;
    }

    getTopRecommendations(userId) {
        const userPrefs = this.inferPreferences(
            Array.from(this.sessionData.entries())
                .filter(([key]) => key.startsWith(userId))
                .map(([key, data]) => ({
                    styleId: key.split('_')[1],
                    ...data
                }))
        );

        const mockUserAnalysis = {
            preferences: userPrefs,
            demographics: { age: 25, gender: 'female' }
        };

        return this.generateRecommendations(mockUserAnalysis);
    }
}

// 全局实例
let styleAI;

document.addEventListener('DOMContentLoaded', async () => {
    styleAI = new StyleAIEngine();
    
    // 导出到全局
    window.styleAI = styleAI;
    window.StyleAIEngine = StyleAIEngine;
    
    console.log('Style AI Engine loaded successfully');
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StyleAIEngine;
}

