/**
 * VIB34D PROGRESSIVE ENHANCEMENT SYSTEM
 * 
 * Smart system that starts with minimal visualizers and progressively
 * adds more based on performance capabilities and user interaction.
 * 
 * Features:
 * - Performance-based scaling
 * - Gradual quality improvement
 * - Adaptive resource allocation
 * - Smart fallback strategies
 * - User interaction-driven enhancement
 */

class VIB34DProgressiveEnhancementSystem {
    constructor(performanceSystem, options = {}) {
        this.performanceSystem = performanceSystem;
        this.options = {
            initialVisualizerCount: options.initialVisualizerCount || 4,
            maxVisualizerCount: options.maxVisualizerCount || 33,
            performanceThreshold: options.performanceThreshold || 45, // FPS
            qualitySteps: options.qualitySteps || [0.1, 0.3, 0.5, 0.8, 1.0],
            enhancementInterval: options.enhancementInterval || 3000, // ms
            degradationThreshold: options.degradationThreshold || 30, // FPS
            ...options
        };

        // State management
        this.currentVisualizerCount = 0;
        this.currentQualityLevel = 0; // Index into qualitySteps
        this.isEnhancing = false;
        this.enhancementTimer = null;
        this.performanceHistory = [];
        this.userInteractionScore = 0;
        this.lastUserInteraction = Date.now();

        // Event tracking
        this.setupEventTracking();

        console.log('🚀 VIB34D Progressive Enhancement System initialized');
    }

    /**
     * Initialize the progressive enhancement system
     */
    async initialize() {
        console.log('🎯 Starting progressive enhancement...');
        
        // Start with minimal configuration
        await this.startMinimalConfiguration();
        
        // Begin enhancement cycle
        this.startEnhancementCycle();
        
        console.log('✅ Progressive enhancement active');
    }

    /**
     * Start with minimal visualizer configuration
     */
    async startMinimalConfiguration() {
        console.log(`🌱 Starting with ${this.options.initialVisualizerCount} visualizers`);
        
        this.currentVisualizerCount = this.options.initialVisualizerCount;
        this.currentQualityLevel = 0; // Start with lowest quality
        
        // Create initial visualizers with minimum quality
        await this.createVisualizersWithQuality(
            this.currentVisualizerCount,
            this.options.qualitySteps[this.currentQualityLevel]
        );
    }

    /**
     * Start the enhancement cycle
     */
    startEnhancementCycle() {
        if (this.enhancementTimer) {
            clearInterval(this.enhancementTimer);
        }

        this.enhancementTimer = setInterval(() => {
            this.evaluateAndEnhance();
        }, this.options.enhancementInterval);
    }

    /**
     * Stop the enhancement cycle
     */
    stopEnhancementCycle() {
        if (this.enhancementTimer) {
            clearInterval(this.enhancementTimer);
            this.enhancementTimer = null;
        }
    }

    /**
     * Evaluate current performance and enhance if possible
     */
    async evaluateAndEnhance() {
        if (this.isEnhancing) return;

        const currentPerformance = this.getCurrentPerformance();
        this.recordPerformance(currentPerformance);

        console.log(`📊 Performance evaluation: ${currentPerformance.fps} FPS, ${currentPerformance.memoryUsage.toFixed(1)} MB`);

        // Check if we need to degrade first
        if (this.shouldDegrade(currentPerformance)) {
            await this.degrade();
            return;
        }

        // Check if we can enhance
        if (this.shouldEnhance(currentPerformance)) {
            await this.enhance();
        }
    }

    /**
     * Get current performance metrics
     */
    getCurrentPerformance() {
        const stats = this.performanceSystem ? 
            this.performanceSystem.getPerformanceStats() : 
            { fps: 60, memoryUsage: { used: 0 } };

        return {
            fps: stats.fps || 60,
            memoryUsage: stats.memoryUsage ? stats.memoryUsage.used / (1024 * 1024) : 0,
            visualizerCount: stats.activeVisualizers || 0,
            timestamp: Date.now()
        };
    }

    /**
     * Record performance for trend analysis
     */
    recordPerformance(performance) {
        this.performanceHistory.push(performance);
        
        // Keep only last 10 entries
        if (this.performanceHistory.length > 10) {
            this.performanceHistory.shift();
        }
    }

    /**
     * Check if we should degrade performance
     */
    shouldDegrade(performance) {
        // Immediate degradation if FPS is too low
        if (performance.fps < this.options.degradationThreshold) {
            return true;
        }

        // Check performance trend
        if (this.performanceHistory.length >= 3) {
            const recent = this.performanceHistory.slice(-3);
            const avgFPS = recent.reduce((sum, p) => sum + p.fps, 0) / recent.length;
            
            if (avgFPS < this.options.performanceThreshold) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if we should enhance performance
     */
    shouldEnhance(performance) {
        // Don't enhance if already at maximum
        if (this.currentVisualizerCount >= this.options.maxVisualizerCount && 
            this.currentQualityLevel >= this.options.qualitySteps.length - 1) {
            return false;
        }

        // Good performance allows enhancement
        if (performance.fps > this.options.performanceThreshold + 10) {
            return true;
        }

        // User interaction bonus
        const timeSinceInteraction = Date.now() - this.lastUserInteraction;
        if (timeSinceInteraction < 10000 && this.userInteractionScore > 5) {
            return performance.fps > this.options.performanceThreshold;
        }

        return false;
    }

    /**
     * Enhance the visualization
     */
    async enhance() {
        this.isEnhancing = true;
        
        try {
            // Determine enhancement strategy
            const strategy = this.determineEnhancementStrategy();
            
            switch (strategy) {
                case 'add_visualizers':
                    await this.addVisualizers();
                    break;
                case 'improve_quality':
                    await this.improveQuality();
                    break;
                case 'both':
                    if (Math.random() > 0.5) {
                        await this.addVisualizers();
                    } else {
                        await this.improveQuality();
                    }
                    break;
            }
            
        } catch (error) {
            console.error('Enhancement failed:', error);
        } finally {
            this.isEnhancing = false;
        }
    }

    /**
     * Degrade the visualization to maintain performance
     */
    async degrade() {
        this.isEnhancing = true;
        
        try {
            // Determine degradation strategy
            if (this.currentQualityLevel > 0) {
                await this.reduceQuality();
            } else if (this.currentVisualizerCount > 1) {
                await this.removeVisualizers();
            }
            
        } catch (error) {
            console.error('Degradation failed:', error);
        } finally {
            this.isEnhancing = false;
        }
    }

    /**
     * Determine the best enhancement strategy
     */
    determineEnhancementStrategy() {
        const canAddVisualizers = this.currentVisualizerCount < this.options.maxVisualizerCount;
        const canImproveQuality = this.currentQualityLevel < this.options.qualitySteps.length - 1;
        
        if (canAddVisualizers && canImproveQuality) {
            // Consider user interaction and current state
            if (this.userInteractionScore > 8) {
                return 'both';
            } else if (this.currentVisualizerCount < 8) {
                return 'add_visualizers';
            } else {
                return 'improve_quality';
            }
        } else if (canAddVisualizers) {
            return 'add_visualizers';
        } else if (canImproveQuality) {
            return 'improve_quality';
        }
        
        return 'none';
    }

    /**
     * Add more visualizers
     */
    async addVisualizers() {
        const increment = this.calculateVisualizerIncrement();
        const newCount = Math.min(
            this.currentVisualizerCount + increment,
            this.options.maxVisualizerCount
        );
        
        if (newCount > this.currentVisualizerCount) {
            console.log(`📈 Adding visualizers: ${this.currentVisualizerCount} → ${newCount}`);
            
            const currentQuality = this.options.qualitySteps[this.currentQualityLevel];
            const newVisualizers = newCount - this.currentVisualizerCount;
            
            await this.createVisualizersWithQuality(newVisualizers, currentQuality);
            this.currentVisualizerCount = newCount;
            
            // Trigger progressive enhancement event
            this.triggerEnhancementEvent('visualizers_added', {
                oldCount: this.currentVisualizerCount - newVisualizers,
                newCount: newCount,
                quality: currentQuality
            });
        }
    }

    /**
     * Remove visualizers to improve performance
     */
    async removeVisualizers() {
        const decrement = Math.ceil(this.currentVisualizerCount * 0.25);
        const newCount = Math.max(1, this.currentVisualizerCount - decrement);
        
        console.log(`📉 Removing visualizers: ${this.currentVisualizerCount} → ${newCount}`);
        
        await this.removeVisualizersToCount(newCount);
        this.currentVisualizerCount = newCount;
        
        this.triggerEnhancementEvent('visualizers_removed', {
            oldCount: this.currentVisualizerCount + decrement,
            newCount: newCount
        });
    }

    /**
     * Improve quality of existing visualizers
     */
    async improveQuality() {
        if (this.currentQualityLevel < this.options.qualitySteps.length - 1) {
            this.currentQualityLevel++;
            const newQuality = this.options.qualitySteps[this.currentQualityLevel];
            
            console.log(`✨ Improving quality: ${newQuality}x`);
            
            await this.setAllVisualizersQuality(newQuality);
            
            this.triggerEnhancementEvent('quality_improved', {
                qualityLevel: this.currentQualityLevel,
                qualityValue: newQuality
            });
        }
    }

    /**
     * Reduce quality to improve performance
     */
    async reduceQuality() {
        if (this.currentQualityLevel > 0) {
            this.currentQualityLevel--;
            const newQuality = this.options.qualitySteps[this.currentQualityLevel];
            
            console.log(`🔽 Reducing quality: ${newQuality}x`);
            
            await this.setAllVisualizersQuality(newQuality);
            
            this.triggerEnhancementEvent('quality_reduced', {
                qualityLevel: this.currentQualityLevel,
                qualityValue: newQuality
            });
        }
    }

    /**
     * Calculate how many visualizers to add
     */
    calculateVisualizerIncrement() {
        const performance = this.getCurrentPerformance();
        
        if (performance.fps > 55) {
            return Math.min(4, this.options.maxVisualizerCount - this.currentVisualizerCount);
        } else if (performance.fps > 50) {
            return Math.min(2, this.options.maxVisualizerCount - this.currentVisualizerCount);
        } else {
            return 1;
        }
    }

    /**
     * Setup event tracking for user interactions
     */
    setupEventTracking() {
        // Track mouse movements
        document.addEventListener('mousemove', () => {
            this.recordUserInteraction(1);
        });

        // Track clicks
        document.addEventListener('click', () => {
            this.recordUserInteraction(3);
        });

        // Track keyboard interactions
        document.addEventListener('keydown', () => {
            this.recordUserInteraction(2);
        });

        // Track touch events
        document.addEventListener('touchstart', () => {
            this.recordUserInteraction(2);
        });

        // Track scroll events
        document.addEventListener('scroll', () => {
            this.recordUserInteraction(1);
        });
    }

    /**
     * Record user interaction for enhancement scoring
     */
    recordUserInteraction(score) {
        this.userInteractionScore += score;
        this.lastUserInteraction = Date.now();
        
        // Decay interaction score over time
        const decayRate = 0.1;
        this.userInteractionScore = Math.max(0, this.userInteractionScore * (1 - decayRate));
    }

    /**
     * Trigger enhancement events for external listeners
     */
    triggerEnhancementEvent(type, data) {
        const event = new CustomEvent('vib34d-enhancement', {
            detail: { type, data, timestamp: Date.now() }
        });
        
        document.dispatchEvent(event);
        
        console.log(`🎯 Enhancement event: ${type}`, data);
    }

    /**
     * Create visualizers with specific quality
     */
    async createVisualizersWithQuality(count, quality) {
        if (!this.performanceSystem) {
            console.warn('No performance system available for visualizer creation');
            return;
        }

        // This is a placeholder - would be implemented by the calling system
        console.log(`Creating ${count} visualizers with quality ${quality}x`);
    }

    /**
     * Remove visualizers to reach target count
     */
    async removeVisualizersToCount(targetCount) {
        // This is a placeholder - would be implemented by the calling system
        console.log(`Removing visualizers to reach count: ${targetCount}`);
    }

    /**
     * Set quality for all visualizers
     */
    async setAllVisualizersQuality(quality) {
        // This is a placeholder - would be implemented by the calling system
        console.log(`Setting all visualizers to quality: ${quality}x`);
    }

    /**
     * Get current enhancement status
     */
    getStatus() {
        return {
            currentVisualizerCount: this.currentVisualizerCount,
            maxVisualizerCount: this.options.maxVisualizerCount,
            currentQualityLevel: this.currentQualityLevel,
            currentQuality: this.options.qualitySteps[this.currentQualityLevel],
            userInteractionScore: this.userInteractionScore,
            isEnhancing: this.isEnhancing,
            performanceHistory: this.performanceHistory.slice(-5) // Last 5 entries
        };
    }

    /**
     * Force enhancement regardless of performance
     */
    async forceEnhance() {
        console.log('🔥 Forcing enhancement...');
        await this.enhance();
    }

    /**
     * Force degradation regardless of performance
     */
    async forceDegrade() {
        console.log('❄️ Forcing degradation...');
        await this.degrade();
    }

    /**
     * Reset to minimal configuration
     */
    async resetToMinimal() {
        console.log('🔄 Resetting to minimal configuration...');
        
        this.currentVisualizerCount = this.options.initialVisualizerCount;
        this.currentQualityLevel = 0;
        this.userInteractionScore = 0;
        this.performanceHistory = [];
        
        await this.startMinimalConfiguration();
    }

    /**
     * Cleanup and dispose
     */
    dispose() {
        console.log('🧹 Disposing progressive enhancement system...');
        
        this.stopEnhancementCycle();
        
        // Remove event listeners would be done here
        // (Currently using anonymous functions, so can't remove easily)
        
        this.performanceSystem = null;
        this.performanceHistory = [];
        
        console.log('✅ Progressive enhancement system disposed');
    }
}

/**
 * Progressive Enhancement Manager
 * Integrates with existing VIB34D systems
 */
class VIB34DProgressiveEnhancementManager {
    constructor(editorDashboard, performanceSystem) {
        this.editorDashboard = editorDashboard;
        this.performanceSystem = performanceSystem;
        this.enhancementSystem = null;
        
        this.isEnabled = true;
        this.visualizerQueue = [];
        this.enhancementConfig = {
            geometryTypes: ['hypercube', 'hypersphere', 'hypertetrahedron', 'torus', 'klein', 'fractal', 'wave', 'crystal'],
            defaultVisualizerConfig: {
                dimension: 4.0,
                morphFactor: 0.7,
                gridDensity: 8.0,
                rotationSpeed: 0.5,
                patternIntensity: 1.0
            }
        };
    }

    /**
     * Initialize the enhancement manager
     */
    async initialize() {
        console.log('🎯 Initializing Progressive Enhancement Manager...');
        
        if (!this.performanceSystem) {
            console.warn('No performance system available, progressive enhancement disabled');
            this.isEnabled = false;
            return false;
        }

        // Create enhancement system
        this.enhancementSystem = new VIB34DProgressiveEnhancementSystem(this.performanceSystem, {
            initialVisualizerCount: 4,
            maxVisualizerCount: 33,
            performanceThreshold: 45,
            qualitySteps: [0.2, 0.4, 0.6, 0.8, 1.0],
            enhancementInterval: 4000
        });

        // Override enhancement system methods to integrate with editor
        this.setupEnhancementIntegration();

        // Listen for enhancement events
        this.setupEnhancementEventListeners();

        // Initialize enhancement
        await this.enhancementSystem.initialize();

        console.log('✅ Progressive Enhancement Manager ready');
        return true;
    }

    /**
     * Setup integration between enhancement system and editor dashboard
     */
    setupEnhancementIntegration() {
        // Override createVisualizersWithQuality
        this.enhancementSystem.createVisualizersWithQuality = async (count, quality) => {
            await this.createVisualizersWithQuality(count, quality);
        };

        // Override removeVisualizersToCount
        this.enhancementSystem.removeVisualizersToCount = async (targetCount) => {
            await this.removeVisualizersToCount(targetCount);
        };

        // Override setAllVisualizersQuality
        this.enhancementSystem.setAllVisualizersQuality = async (quality) => {
            await this.setAllVisualizersQuality(quality);
        };
    }

    /**
     * Create visualizers with specific quality level
     */
    async createVisualizersWithQuality(count, quality) {
        console.log(`🎨 Creating ${count} visualizers with quality ${quality}x`);
        
        for (let i = 0; i < count; i++) {
            try {
                // Select geometry type
                const geometryType = this.enhancementConfig.geometryTypes[
                    this.editorDashboard.elements.size % this.enhancementConfig.geometryTypes.length
                ];

                // Create visualizer config
                const config = {
                    ...this.enhancementConfig.defaultVisualizerConfig,
                    geometryType,
                    gridDensity: this.enhancementConfig.defaultVisualizerConfig.gridDensity * quality,
                    qualityLevel: quality
                };

                // Create element in canvas
                const canvasContent = document.getElementById('canvas-content');
                if (canvasContent) {
                    const x = Math.random() * (canvasContent.clientWidth - 200);
                    const y = Math.random() * (canvasContent.clientHeight - 120);
                    
                    this.editorDashboard.createElement({
                        type: 'progressive-' + geometryType,
                        geometry: geometryType,
                        name: `Auto ${geometryType}`
                    }, x, y);
                }

                // Small delay to prevent overwhelming
                if (i > 0 && i % 2 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

            } catch (error) {
                console.error(`Failed to create progressive visualizer ${i + 1}:`, error);
            }
        }
    }

    /**
     * Remove visualizers to reach target count
     */
    async removeVisualizersToCount(targetCount) {
        const currentCount = this.editorDashboard.elements.size;
        const removeCount = currentCount - targetCount;
        
        if (removeCount <= 0) return;
        
        console.log(`🗑️ Removing ${removeCount} visualizers (${currentCount} → ${targetCount})`);
        
        // Get progressive visualizers (those created automatically)
        const progressiveElements = Array.from(this.editorDashboard.elements.entries())
            .filter(([id, element]) => element.type.startsWith('progressive-'))
            .slice(0, removeCount);
        
        // Remove them
        progressiveElements.forEach(([id, element]) => {
            this.editorDashboard.disposeElement(id);
        });
    }

    /**
     * Set quality for all visualizers
     */
    async setAllVisualizersQuality(quality) {
        console.log(`🎛️ Setting quality to ${quality}x for all visualizers`);
        
        this.editorDashboard.elements.forEach((elementData, id) => {
            if (elementData.visualizer && elementData.visualizer.updateParameters) {
                const newGridDensity = this.enhancementConfig.defaultVisualizerConfig.gridDensity * quality;
                
                elementData.visualizer.updateParameters({
                    gridDensity: newGridDensity
                });
                
                // Update stored properties
                elementData.properties.gridDensity = newGridDensity;
                
                // Update quality level tracking
                if (elementData.visualizer.setQualityLevel) {
                    elementData.visualizer.setQualityLevel(quality);
                }
            }
        });
    }

    /**
     * Setup event listeners for enhancement events
     */
    setupEnhancementEventListeners() {
        document.addEventListener('vib34d-enhancement', (event) => {
            const { type, data } = event.detail;
            
            // Update UI to reflect enhancement changes
            this.updateEnhancementUI(type, data);
            
            // Log enhancement activity
            console.log(`🎯 Enhancement: ${type}`, data);
        });
    }

    /**
     * Update UI to show enhancement status
     */
    updateEnhancementUI(type, data) {
        // This could update a UI panel showing enhancement status
        // For now, just update the code output to show current state
        if (this.editorDashboard.selectedElement) {
            this.editorDashboard.generateCodeForElement(this.editorDashboard.selectedElement);
        }
    }

    /**
     * Enable/disable progressive enhancement
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        
        if (enabled && this.enhancementSystem) {
            this.enhancementSystem.startEnhancementCycle();
            console.log('✅ Progressive enhancement enabled');
        } else if (this.enhancementSystem) {
            this.enhancementSystem.stopEnhancementCycle();
            console.log('⏸️ Progressive enhancement disabled');
        }
    }

    /**
     * Get enhancement status for UI display
     */
    getStatus() {
        if (!this.enhancementSystem) {
            return { enabled: false, status: 'Not available' };
        }

        return {
            enabled: this.isEnabled,
            ...this.enhancementSystem.getStatus()
        };
    }

    /**
     * Dispose enhancement manager
     */
    dispose() {
        console.log('🧹 Disposing Progressive Enhancement Manager...');
        
        if (this.enhancementSystem) {
            this.enhancementSystem.dispose();
            this.enhancementSystem = null;
        }
        
        this.editorDashboard = null;
        this.performanceSystem = null;
        
        console.log('✅ Progressive Enhancement Manager disposed');
    }
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.VIB34DProgressiveEnhancementSystem = VIB34DProgressiveEnhancementSystem;
    window.VIB34DProgressiveEnhancementManager = VIB34DProgressiveEnhancementManager;
    
    console.log('🎯 VIB34D Progressive Enhancement System loaded');
}

console.log('✅ VIB34D Progressive Enhancement System ready');