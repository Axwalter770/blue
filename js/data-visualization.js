/**
 * 高级数据可视化组件库
 * 专业的图表和数据展示系统
 */

class DataVisualization {
    constructor() {
        this.charts = new Map();
        this.themes = new Map();
        this.animations = new Map();
        this.interactions = new Map();
        this.dataProcessors = new Map();
        
        this.init();
    }

    init() {
        this.setupThemes();
        this.setupDataProcessors();
        this.setupAnimations();
        this.setupInteractions();
    }

    setupThemes() {
        // 默认主题
        this.themes.set('default', {
            colors: {
                primary: '#667eea',
                secondary: '#764ba2',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6',
                gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
            },
            fonts: {
                title: '16px Arial, sans-serif',
                label: '12px Arial, sans-serif',
                tooltip: '14px Arial, sans-serif'
            },
            spacing: {
                margin: 20,
                padding: 15,
                gridGap: 10
            },
            animation: {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }
        });

        // 深色主题
        this.themes.set('dark', {
            colors: {
                primary: '#8b5cf6',
                secondary: '#a855f7',
                success: '#22c55e',
                warning: '#eab308',
                error: '#f87171',
                info: '#60a5fa',
                gradient: ['#8b5cf6', '#a855f7', '#f472b6', '#fb7185', '#60a5fa', '#34d399'],
                background: '#1f2937',
                surface: '#374151',
                text: '#f9fafb'
            },
            fonts: {
                title: '16px Arial, sans-serif',
                label: '12px Arial, sans-serif',
                tooltip: '14px Arial, sans-serif'
            },
            spacing: {
                margin: 20,
                padding: 15,
                gridGap: 10
            },
            animation: {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }
        });

        // 极简主题
        this.themes.set('minimal', {
            colors: {
                primary: '#000000',
                secondary: '#6b7280',
                success: '#059669',
                warning: '#d97706',
                error: '#dc2626',
                info: '#2563eb',
                gradient: ['#000000', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6']
            },
            fonts: {
                title: '16px "Helvetica Neue", Arial, sans-serif',
                label: '12px "Helvetica Neue", Arial, sans-serif',
                tooltip: '14px "Helvetica Neue", Arial, sans-serif'
            },
            spacing: {
                margin: 30,
                padding: 20,
                gridGap: 15
            },
            animation: {
                duration: 400,
                easing: 'ease-out'
            }
        });
    }

    setupDataProcessors() {
        // 数据聚合器
        this.dataProcessors.set('aggregate', (data, groupBy, aggregateBy, operation = 'sum') => {
            const grouped = {};
            
            data.forEach(item => {
                const key = item[groupBy];
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(item[aggregateBy]);
            });

            return Object.entries(grouped).map(([key, values]) => {
                let result;
                switch (operation) {
                    case 'sum':
                        result = values.reduce((sum, val) => sum + val, 0);
                        break;
                    case 'avg':
                        result = values.reduce((sum, val) => sum + val, 0) / values.length;
                        break;
                    case 'max':
                        result = Math.max(...values);
                        break;
                    case 'min':
                        result = Math.min(...values);
                        break;
                    case 'count':
                        result = values.length;
                        break;
                    default:
                        result = values.reduce((sum, val) => sum + val, 0);
                }
                
                return { [groupBy]: key, [aggregateBy]: result };
            });
        });

        // 数据过滤器
        this.dataProcessors.set('filter', (data, filters) => {
            return data.filter(item => {
                return Object.entries(filters).every(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.includes(item[key]);
                    } else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
                        return item[key] >= value.min && item[key] <= value.max;
                    } else {
                        return item[key] === value;
                    }
                });
            });
        });

        // 数据排序器
        this.dataProcessors.set('sort', (data, sortBy, order = 'asc') => {
            return [...data].sort((a, b) => {
                const aVal = a[sortBy];
                const bVal = b[sortBy];
                
                if (order === 'asc') {
                    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                } else {
                    return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
                }
            });
        });

        // 数据变换器
        this.dataProcessors.set('transform', (data, transformFn) => {
            return data.map(transformFn);
        });

        // 时间序列处理器
        this.dataProcessors.set('timeSeries', (data, dateField, interval = 'day') => {
            const grouped = {};
            
            data.forEach(item => {
                const date = new Date(item[dateField]);
                let key;
                
                switch (interval) {
                    case 'hour':
                        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
                        break;
                    case 'day':
                        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                        break;
                    case 'week':
                        const week = this.getWeekNumber(date);
                        key = `${date.getFullYear()}-W${week}`;
                        break;
                    case 'month':
                        key = `${date.getFullYear()}-${date.getMonth()}`;
                        break;
                    case 'year':
                        key = date.getFullYear().toString();
                        break;
                    default:
                        key = date.toISOString().split('T')[0];
                }
                
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(item);
            });

            return Object.entries(grouped).map(([key, items]) => ({
                period: key,
                count: items.length,
                data: items
            }));
        });
    }

    setupAnimations() {
        // 渐入动画
        this.animations.set('fadeIn', (element, duration = 800) => {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease-in-out`;
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
            });
        });

        // 滑入动画
        this.animations.set('slideIn', (element, direction = 'bottom', duration = 800) => {
            const transforms = {
                top: 'translateY(-50px)',
                bottom: 'translateY(50px)',
                left: 'translateX(-50px)',
                right: 'translateX(50px)'
            };
            
            element.style.transform = transforms[direction];
            element.style.opacity = '0';
            element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
            
            requestAnimationFrame(() => {
                element.style.transform = 'translate(0, 0)';
                element.style.opacity = '1';
            });
        });

        // 缩放动画
        this.animations.set('scaleIn', (element, duration = 800) => {
            element.style.transform = 'scale(0)';
            element.style.opacity = '0';
            element.style.transition = `transform ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity ${duration}ms ease-out`;
            
            requestAnimationFrame(() => {
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
            });
        });

        // 数值动画
        this.animations.set('countUp', (element, from, to, duration = 1000) => {
            const start = Date.now();
            const step = () => {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = this.easeOutQuart(progress);
                const current = from + (to - from) * easeProgress;
                
                element.textContent = Math.round(current).toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };
            
            requestAnimationFrame(step);
        });

        // 绘制动画
        this.animations.set('drawPath', (path, duration = 1000) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
            
            requestAnimationFrame(() => {
                path.style.strokeDashoffset = '0';
            });
        });
    }

    setupInteractions() {
        // 悬停高亮
        this.interactions.set('hover', (element, options = {}) => {
            const { highlightColor = '#667eea', scale = 1.05 } = options;
            
            element.addEventListener('mouseenter', () => {
                element.style.transform = `scale(${scale})`;
                element.style.filter = `drop-shadow(0 4px 8px ${highlightColor}40)`;
                element.style.transition = 'transform 0.2s ease, filter 0.2s ease';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
                element.style.filter = 'none';
            });
        });

        // 点击波纹效果
        this.interactions.set('ripple', (element, options = {}) => {
            const { color = 'rgba(102, 126, 234, 0.3)' } = options;
            
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: ${color};
                    transform: translate(-50%, -50%);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                element.style.position = 'relative';
                element.style.overflow = 'hidden';
                element.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // 工具提示
        this.interactions.set('tooltip', (element, content, options = {}) => {
            const { position = 'top', theme = 'dark' } = options;
            
            const tooltip = document.createElement('div');
            tooltip.className = `tooltip tooltip-${theme}`;
            tooltip.textContent = content;
            tooltip.style.cssText = `
                position: absolute;
                padding: 8px 12px;
                background: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
                color: ${theme === 'dark' ? '#ffffff' : '#1f2937'};
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
                z-index: 1000;
            `;
            
            element.addEventListener('mouseenter', () => {
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                
                let left, top;
                
                switch (position) {
                    case 'top':
                        left = rect.left + (rect.width - tooltipRect.width) / 2;
                        top = rect.top - tooltipRect.height - 8;
                        break;
                    case 'bottom':
                        left = rect.left + (rect.width - tooltipRect.width) / 2;
                        top = rect.bottom + 8;
                        break;
                    case 'left':
                        left = rect.left - tooltipRect.width - 8;
                        top = rect.top + (rect.height - tooltipRect.height) / 2;
                        break;
                    case 'right':
                        left = rect.right + 8;
                        top = rect.top + (rect.height - tooltipRect.height) / 2;
                        break;
                    default:
                        left = rect.left + (rect.width - tooltipRect.width) / 2;
                        top = rect.top - tooltipRect.height - 8;
                }
                
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.style.opacity = '1';
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 200);
            });
        });
    }

    // 创建条形图
    createBarChart(container, data, options = {}) {
        const {
            theme = 'default',
            animated = true,
            interactive = true,
            responsive = true,
            title = '',
            xAxis = {},
            yAxis = {},
            colors = null
        } = options;

        const themeConfig = this.themes.get(theme);
        const chartColors = colors || themeConfig.colors.gradient;

        const chartContainer = this.createChartContainer(container, title, themeConfig);
        const svg = this.createSVG(chartContainer, responsive);
        
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };
        const width = svg.clientWidth - margin.left - margin.right;
        const height = svg.clientHeight - margin.top - margin.bottom;

        // 创建坐标轴
        const xScale = this.createBandScale(data.map(d => d.label), [0, width]);
        const yScale = this.createLinearScale([0, Math.max(...data.map(d => d.value))], [height, 0]);

        const g = this.createGroup(svg, margin.left, margin.top);

        // 绘制坐标轴
        this.drawXAxis(g, xScale, height, xAxis);
        this.drawYAxis(g, yScale, yAxis);

        // 绘制条形
        const bars = this.createBars(g, data, xScale, yScale, height, chartColors);

        // 添加动画
        if (animated) {
            this.animateBars(bars, themeConfig.animation.duration);
        }

        // 添加交互
        if (interactive) {
            this.addBarInteractions(bars, data);
        }

        const chartId = this.generateChartId();
        this.charts.set(chartId, {
            container: chartContainer,
            svg,
            data,
            options,
            type: 'bar'
        });

        return chartId;
    }

    // 创建折线图
    createLineChart(container, data, options = {}) {
        const {
            theme = 'default',
            animated = true,
            interactive = true,
            responsive = true,
            title = '',
            xAxis = {},
            yAxis = {},
            colors = null,
            smooth = false
        } = options;

        const themeConfig = this.themes.get(theme);
        const chartColors = colors || themeConfig.colors.gradient;

        const chartContainer = this.createChartContainer(container, title, themeConfig);
        const svg = this.createSVG(chartContainer, responsive);
        
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };
        const width = svg.clientWidth - margin.left - margin.right;
        const height = svg.clientHeight - margin.top - margin.bottom;

        const xScale = this.createLinearScale([0, data.length - 1], [0, width]);
        const yScale = this.createLinearScale(
            [Math.min(...data.map(d => d.value)), Math.max(...data.map(d => d.value))],
            [height, 0]
        );

        const g = this.createGroup(svg, margin.left, margin.top);

        // 绘制坐标轴
        this.drawXAxis(g, xScale, height, xAxis);
        this.drawYAxis(g, yScale, yAxis);

        // 创建线条路径
        const line = this.createLinePath(data, xScale, yScale, smooth);
        const path = this.drawLine(g, line, chartColors[0]);

        // 创建数据点
        const points = this.createLinePoints(g, data, xScale, yScale, chartColors[0]);

        // 添加动画
        if (animated) {
            this.animateLine(path, themeConfig.animation.duration);
            this.animatePoints(points, themeConfig.animation.duration);
        }

        // 添加交互
        if (interactive) {
            this.addLineInteractions(points, data);
        }

        const chartId = this.generateChartId();
        this.charts.set(chartId, {
            container: chartContainer,
            svg,
            data,
            options,
            type: 'line'
        });

        return chartId;
    }

    // 创建饼图
    createPieChart(container, data, options = {}) {
        const {
            theme = 'default',
            animated = true,
            interactive = true,
            responsive = true,
            title = '',
            showLabels = true,
            showPercentages = true,
            colors = null,
            innerRadius = 0
        } = options;

        const themeConfig = this.themes.get(theme);
        const chartColors = colors || themeConfig.colors.gradient;

        const chartContainer = this.createChartContainer(container, title, themeConfig);
        const svg = this.createSVG(chartContainer, responsive);
        
        const width = svg.clientWidth;
        const height = svg.clientHeight;
        const radius = Math.min(width, height) / 2 - 20;

        const g = this.createGroup(svg, width / 2, height / 2);

        // 计算角度
        const total = data.reduce((sum, d) => sum + d.value, 0);
        let currentAngle = 0;

        const slices = data.map((d, i) => {
            const startAngle = currentAngle;
            const endAngle = currentAngle + (d.value / total) * 2 * Math.PI;
            currentAngle = endAngle;

            return {
                ...d,
                startAngle,
                endAngle,
                color: chartColors[i % chartColors.length]
            };
        });

        // 绘制扇形
        const paths = this.drawPieSlices(g, slices, radius, innerRadius);

        // 添加标签
        if (showLabels) {
            this.drawPieLabels(g, slices, radius, showPercentages, total);
        }

        // 添加动画
        if (animated) {
            this.animatePieSlices(paths, themeConfig.animation.duration);
        }

        // 添加交互
        if (interactive) {
            this.addPieInteractions(paths, slices);
        }

        const chartId = this.generateChartId();
        this.charts.set(chartId, {
            container: chartContainer,
            svg,
            data,
            options,
            type: 'pie'
        });

        return chartId;
    }

    // 创建面积图
    createAreaChart(container, data, options = {}) {
        const {
            theme = 'default',
            animated = true,
            interactive = true,
            responsive = true,
            title = '',
            xAxis = {},
            yAxis = {},
            colors = null,
            stacked = false,
            smooth = false
        } = options;

        const themeConfig = this.themes.get(theme);
        const chartColors = colors || themeConfig.colors.gradient;

        const chartContainer = this.createChartContainer(container, title, themeConfig);
        const svg = this.createSVG(chartContainer, responsive);
        
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };
        const width = svg.clientWidth - margin.left - margin.right;
        const height = svg.clientHeight - margin.top - margin.bottom;

        const xScale = this.createLinearScale([0, data.length - 1], [0, width]);
        const yScale = this.createLinearScale(
            [0, Math.max(...data.map(d => d.value))],
            [height, 0]
        );

        const g = this.createGroup(svg, margin.left, margin.top);

        // 绘制坐标轴
        this.drawXAxis(g, xScale, height, xAxis);
        this.drawYAxis(g, yScale, yAxis);

        // 创建面积路径
        const areaPath = this.createAreaPath(data, xScale, yScale, height, smooth);
        const path = this.drawArea(g, areaPath, chartColors[0]);

        // 添加动画
        if (animated) {
            this.animateArea(path, themeConfig.animation.duration);
        }

        const chartId = this.generateChartId();
        this.charts.set(chartId, {
            container: chartContainer,
            svg,
            data,
            options,
            type: 'area'
        });

        return chartId;
    }

    // 创建散点图
    createScatterChart(container, data, options = {}) {
        const {
            theme = 'default',
            animated = true,
            interactive = true,
            responsive = true,
            title = '',
            xAxis = {},
            yAxis = {},
            colors = null,
            pointSize = 5
        } = options;

        const themeConfig = this.themes.get(theme);
        const chartColors = colors || themeConfig.colors.gradient;

        const chartContainer = this.createChartContainer(container, title, themeConfig);
        const svg = this.createSVG(chartContainer, responsive);
        
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };
        const width = svg.clientWidth - margin.left - margin.right;
        const height = svg.clientHeight - margin.top - margin.bottom;

        const xScale = this.createLinearScale(
            [Math.min(...data.map(d => d.x)), Math.max(...data.map(d => d.x))],
            [0, width]
        );
        const yScale = this.createLinearScale(
            [Math.min(...data.map(d => d.y)), Math.max(...data.map(d => d.y))],
            [height, 0]
        );

        const g = this.createGroup(svg, margin.left, margin.top);

        // 绘制坐标轴
        this.drawXAxis(g, xScale, height, xAxis);
        this.drawYAxis(g, yScale, yAxis);

        // 绘制散点
        const points = this.drawScatterPoints(g, data, xScale, yScale, pointSize, chartColors);

        // 添加动画
        if (animated) {
            this.animateScatterPoints(points, themeConfig.animation.duration);
        }

        // 添加交互
        if (interactive) {
            this.addScatterInteractions(points, data);
        }

        const chartId = this.generateChartId();
        this.charts.set(chartId, {
            container: chartContainer,
            svg,
            data,
            options,
            type: 'scatter'
        });

        return chartId;
    }

    // 创建雷达图
    createRadarChart(container, data, options = {}) {
        const {
            theme = 'default',
            animated = true,
            interactive = true,
            responsive = true,
            title = '',
            colors = null,
            levels = 5,
            showAxes = true,
            showDots = true
        } = options;

        const themeConfig = this.themes.get(theme);
        const chartColors = colors || themeConfig.colors.gradient;

        const chartContainer = this.createChartContainer(container, title, themeConfig);
        const svg = this.createSVG(chartContainer, responsive);
        
        const width = svg.clientWidth;
        const height = svg.clientHeight;
        const radius = Math.min(width, height) / 2 - 40;
        const center = { x: width / 2, y: height / 2 };

        const g = this.createGroup(svg, center.x, center.y);

        // 绘制网格
        if (showAxes) {
            this.drawRadarGrid(g, data.length, radius, levels);
            this.drawRadarAxes(g, data, radius);
        }

        // 绘制雷达区域
        const radarPath = this.createRadarPath(data, radius);
        const path = this.drawRadarArea(g, radarPath, chartColors[0]);

        // 绘制数据点
        if (showDots) {
            const points = this.drawRadarPoints(g, data, radius, chartColors[0]);
            
            if (animated) {
                this.animateRadarPoints(points, themeConfig.animation.duration);
            }
        }

        // 添加动画
        if (animated) {
            this.animateRadarArea(path, themeConfig.animation.duration);
        }

        const chartId = this.generateChartId();
        this.charts.set(chartId, {
            container: chartContainer,
            svg,
            data,
            options,
            type: 'radar'
        });

        return chartId;
    }

    // 辅助方法
    createChartContainer(container, title, theme) {
        const chartDiv = document.createElement('div');
        chartDiv.className = 'chart-container';
        chartDiv.style.cssText = `
            background: ${theme.colors.background || '#ffffff'};
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: ${theme.spacing.padding}px;
            margin: ${theme.spacing.margin}px;
            position: relative;
        `;

        if (title) {
            const titleElement = document.createElement('h3');
            titleElement.textContent = title;
            titleElement.style.cssText = `
                margin: 0 0 ${theme.spacing.padding}px 0;
                font: ${theme.fonts.title};
                color: ${theme.colors.text || '#1f2937'};
                text-align: center;
            `;
            chartDiv.appendChild(titleElement);
        }

        if (typeof container === 'string') {
            document.querySelector(container).appendChild(chartDiv);
        } else {
            container.appendChild(chartDiv);
        }

        return chartDiv;
    }

    createSVG(container, responsive = true) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        
        if (responsive) {
            svg.style.cssText = `
                width: 100%;
                height: 300px;
                display: block;
            `;
        } else {
            svg.setAttribute('width', '600');
            svg.setAttribute('height', '400');
        }

        container.appendChild(svg);
        return svg;
    }

    createGroup(parent, x = 0, y = 0) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${x}, ${y})`);
        parent.appendChild(g);
        return g;
    }

    createBandScale(domain, range) {
        const bandwidth = (range[1] - range[0]) / domain.length;
        return {
            domain,
            range,
            bandwidth,
            scale: (value) => {
                const index = domain.indexOf(value);
                return range[0] + index * bandwidth;
            }
        };
    }

    createLinearScale(domain, range) {
        const domainSpan = domain[1] - domain[0];
        const rangeSpan = range[1] - range[0];
        
        return {
            domain,
            range,
            scale: (value) => {
                const normalized = (value - domain[0]) / domainSpan;
                return range[0] + normalized * rangeSpan;
            }
        };
    }

    generateChartId() {
        return `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    // 公共API方法
    updateChart(chartId, newData) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        chart.data = newData;
        // 重新渲染图表
        this.renderChart(chart);
    }

    destroyChart(chartId) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        chart.container.remove();
        this.charts.delete(chartId);
    }

    setTheme(chartId, themeName) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        chart.options.theme = themeName;
        this.renderChart(chart);
    }

    exportChart(chartId, format = 'png') {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        // 导出图表为图片
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 实现SVG到Canvas的转换逻辑
        // 这里是简化版本，实际实现会更复杂
        
        return canvas.toDataURL(`image/${format}`);
    }

    getChartStats(chartId) {
        const chart = this.charts.get(chartId);
        if (!chart) return null;

        return {
            id: chartId,
            type: chart.type,
            dataPoints: chart.data.length,
            theme: chart.options.theme,
            animated: chart.options.animated,
            interactive: chart.options.interactive
        };
    }

    getAllCharts() {
        return Array.from(this.charts.keys());
    }

    // 数据处理公共方法
    processData(data, processorName, ...args) {
        const processor = this.dataProcessors.get(processorName);
        if (!processor) {
            throw new Error(`Data processor "${processorName}" not found`);
        }

        return processor(data, ...args);
    }

    addDataProcessor(name, processor) {
        this.dataProcessors.set(name, processor);
    }

    addTheme(name, theme) {
        this.themes.set(name, theme);
    }

    addAnimation(name, animation) {
        this.animations.set(name, animation);
    }

    addInteraction(name, interaction) {
        this.interactions.set(name, interaction);
    }
}

// 导出全局实例
window.DataVisualization = DataVisualization;

// 使用示例和工具函数
const ChartUtils = {
    generateSampleData: (type, count = 10) => {
        switch (type) {
            case 'bar':
                return Array.from({ length: count }, (_, i) => ({
                    label: `项目 ${i + 1}`,
                    value: Math.floor(Math.random() * 100) + 10
                }));
            
            case 'line':
                return Array.from({ length: count }, (_, i) => ({
                    label: `时间 ${i + 1}`,
                    value: Math.floor(Math.random() * 100) + 10
                }));
            
            case 'pie':
                return Array.from({ length: count }, (_, i) => ({
                    label: `分类 ${i + 1}`,
                    value: Math.floor(Math.random() * 50) + 5
                }));
            
            case 'scatter':
                return Array.from({ length: count }, () => ({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    label: `点 ${Math.floor(Math.random() * 1000)}`
                }));
            
            case 'radar':
                return Array.from({ length: count }, (_, i) => ({
                    axis: `维度 ${i + 1}`,
                    value: Math.random() * 100
                }));
            
            default:
                return [];
        }
    },

    formatNumber: (num, decimals = 0) => {
        return num.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    formatPercentage: (value, total) => {
        const percentage = (value / total) * 100;
        return `${percentage.toFixed(1)}%`;
    },

    generateColorPalette: (count, baseColor = '#667eea') => {
        const colors = [];
        const baseHue = parseInt(baseColor.slice(1), 16);
        
        for (let i = 0; i < count; i++) {
            const hue = (baseHue + (i * 360 / count)) % 360;
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        
        return colors;
    },

    downloadChart: (chartId, filename = 'chart') => {
        const dataViz = window.dataVisualization;
        if (dataViz) {
            const dataUrl = dataViz.exportChart(chartId, 'png');
            const link = document.createElement('a');
            link.download = `${filename}.png`;
            link.href = dataUrl;
            link.click();
        }
    }
};

window.ChartUtils = ChartUtils;
