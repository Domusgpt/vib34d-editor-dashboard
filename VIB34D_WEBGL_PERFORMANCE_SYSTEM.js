/**
 * VIB34D WEBGL PERFORMANCE OPTIMIZATION SYSTEM
 * 
 * Advanced WebGL context pooling, resource management, and performance optimization
 * for handling 33+ simultaneous hypercube visualizations efficiently.
 * 
 * Features:
 * - WebGL context pooling and sharing
 * - Optimized shader compilation with caching
 * - Intelligent resource management
 * - Performance monitoring and adaptive scaling
 * - Memory usage tracking and cleanup
 * - Progressive enhancement support
 */

class VIB34DWebGLPerformanceSystem {
    constructor(options = {}) {
        this.options = {
            maxContexts: options.maxContexts || 16,
            maxConcurrentRenders: options.maxConcurrentRenders || 8,
            contextReusePriority: options.contextReusePriority || true,
            adaptiveQualityScaling: options.adaptiveQualityScaling || true,
            memoryThresholdMB: options.memoryThresholdMB || 256,
            performanceTarget: options.performanceTarget || 60, // FPS
            ...options
        };

        // Core systems
        this.contextPool = new WebGLContextPool(this.options);
        this.shaderCache = new ShaderCompilationCache();
        this.resourceManager = new WebGLResourceManager();
        this.performanceMonitor = new PerformanceMonitor(this.options);
        this.memoryTracker = new MemoryUsageTracker(this.options);
        
        // State management
        this.activeVisualizers = new Map();
        this.renderQueue = [];
        this.isInitialized = false;
        
        console.log('🚀 VIB34D WebGL Performance System initializing...');
        this.initialize();
    }

    async initialize() {
        try {
            // Initialize all subsystems
            await this.contextPool.initialize();
            await this.shaderCache.initialize();
            await this.resourceManager.initialize();
            await this.performanceMonitor.initialize();
            await this.memoryTracker.initialize();

            // Start performance monitoring
            this.startPerformanceMonitoring();
            
            this.isInitialized = true;
            console.log('✅ VIB34D WebGL Performance System ready');
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize WebGL Performance System:', error);
            return false;
        }
    }

    /**
     * Create an optimized WebGL visualizer with resource pooling
     */
    async createOptimizedVisualizer(canvas, config = {}) {
        if (!this.isInitialized) {
            console.warn('Performance system not initialized, using fallback');
            return this.createFallbackVisualizer(canvas, config);
        }

        try {
            // Get optimized WebGL context from pool
            const contextInfo = await this.contextPool.acquireContext(canvas);
            if (!contextInfo) {
                console.warn('No WebGL context available, using fallback');
                return this.createFallbackVisualizer(canvas, config);
            }

            // Create optimized visualizer
            const visualizer = new OptimizedVIB34DVisualizer(
                contextInfo,
                config,
                this.shaderCache,
                this.resourceManager,
                this.performanceMonitor
            );

            await visualizer.initialize();
            
            // Register with performance system
            this.activeVisualizers.set(visualizer.id, visualizer);
            this.performanceMonitor.registerVisualizer(visualizer);
            
            console.log(`✅ Created optimized visualizer: ${visualizer.id}`);
            return visualizer;
            
        } catch (error) {
            console.error('Failed to create optimized visualizer:', error);
            return this.createFallbackVisualizer(canvas, config);
        }
    }

    /**
     * Create fallback visualizer when WebGL is unavailable
     */
    createFallbackVisualizer(canvas, config) {
        console.log('🎨 Creating Canvas 2D fallback visualizer');
        
        if (window.VIB34D_WEBGL_FALLBACK) {
            return window.VIB34D_WEBGL_FALLBACK.createFallbackVisualizer(canvas, config);
        }
        
        console.warn('No fallback system available');
        return null;
    }

    /**
     * Dispose visualizer and release resources
     */
    disposeVisualizer(visualizer) {
        if (!visualizer || !visualizer.id) return;

        console.log(`🧹 Disposing visualizer: ${visualizer.id}`);

        // Remove from tracking
        this.activeVisualizers.delete(visualizer.id);
        this.performanceMonitor.unregisterVisualizer(visualizer);

        // Dispose visualizer resources
        if (typeof visualizer.dispose === 'function') {
            visualizer.dispose();
        }

        // Release context back to pool
        if (visualizer.contextInfo) {
            this.contextPool.releaseContext(visualizer.contextInfo);
        }

        console.log(`✅ Visualizer disposed: ${visualizer.id}`);
    }

    /**
     * Batch dispose multiple visualizers
     */
    disposeAllVisualizers() {
        console.log('🧹 Disposing all visualizers...');
        
        const visualizers = Array.from(this.activeVisualizers.values());
        let disposedCount = 0;

        visualizers.forEach(visualizer => {
            this.disposeVisualizer(visualizer);
            disposedCount++;
        });

        // Force memory cleanup
        this.memoryTracker.forceCleanup();

        console.log(`✅ Disposed ${disposedCount} visualizers`);
    }

    /**
     * Get system performance statistics
     */
    getPerformanceStats() {
        return {
            activeVisualizers: this.activeVisualizers.size,
            availableContexts: this.contextPool.getAvailableCount(),
            memoryUsage: this.memoryTracker.getCurrentUsage(),
            fps: this.performanceMonitor.getCurrentFPS(),
            renderTime: this.performanceMonitor.getAverageRenderTime(),
            shaderCacheHitRate: this.shaderCache.getHitRate(),
            isPerformanceGood: this.performanceMonitor.isPerformanceGood()
        };
    }

    /**
     * Adaptive quality scaling based on performance
     */
    updateQualitySettings() {
        if (!this.options.adaptiveQualityScaling) return;

        const stats = this.getPerformanceStats();
        
        if (!stats.isPerformanceGood) {
            console.log('📉 Performance degraded, reducing quality');
            this.activeVisualizers.forEach(visualizer => {
                if (visualizer.reduceQuality) {
                    visualizer.reduceQuality();
                }
            });
        } else if (stats.fps > this.options.performanceTarget * 1.2) {
            console.log('📈 Performance good, increasing quality');
            this.activeVisualizers.forEach(visualizer => {
                if (visualizer.increaseQuality) {
                    visualizer.increaseQuality();
                }
            });
        }
    }

    /**
     * Start performance monitoring loop
     */
    startPerformanceMonitoring() {
        const monitoringInterval = 2000; // 2 seconds

        setInterval(() => {
            this.updateQualitySettings();
            this.memoryTracker.checkMemoryThreshold();
            
            // Log stats periodically
            if (this.activeVisualizers.size > 0) {
                const stats = this.getPerformanceStats();
                console.log('📊 Performance Stats:', stats);
            }
        }, monitoringInterval);
    }

    /**
     * Emergency cleanup when memory threshold exceeded
     */
    emergencyCleanup() {
        console.warn('🚨 Emergency cleanup triggered');
        
        // Reduce quality on all visualizers
        this.activeVisualizers.forEach(visualizer => {
            if (visualizer.setMinimumQuality) {
                visualizer.setMinimumQuality();
            }
        });

        // Force resource cleanup
        this.resourceManager.forceCleanup();
        this.memoryTracker.forceCleanup();
        
        // Force garbage collection if available
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
    }
}

/**
 * WebGL Context Pool - Manages and reuses WebGL contexts efficiently
 */
class WebGLContextPool {
    constructor(options) {
        this.options = options;
        this.availableContexts = [];
        this.activeContexts = new Map();
        this.contextCounter = 0;
        this.maxContexts = options.maxContexts || 16;
    }

    async initialize() {
        console.log(`🏊 Initializing WebGL context pool (max: ${this.maxContexts})`);
        
        // Pre-create some contexts for immediate use
        const initialContexts = Math.min(4, this.maxContexts);
        for (let i = 0; i < initialContexts; i++) {
            await this.createPooledContext();
        }
        
        console.log(`✅ Context pool initialized with ${this.availableContexts.length} contexts`);
    }

    async createPooledContext() {
        try {
            // Create a canvas for the pooled context
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            canvas.style.display = 'none';
            
            // Try to get WebGL context
            const gl = canvas.getContext('webgl', {
                alpha: true,
                antialias: false, // Disable for performance
                depth: true,
                premultipliedAlpha: false,
                preserveDrawingBuffer: false,
                powerPreference: 'high-performance'
            }) || canvas.getContext('experimental-webgl');

            if (!gl) {
                console.warn('Failed to create WebGL context for pool');
                return null;
            }

            const contextInfo = {
                id: `context-${++this.contextCounter}`,
                gl,
                canvas,
                isAvailable: true,
                lastUsed: Date.now(),
                assignedCanvas: null
            };

            this.availableContexts.push(contextInfo);
            console.log(`➕ Created pooled context: ${contextInfo.id}`);
            
            return contextInfo;
        } catch (error) {
            console.error('Error creating pooled context:', error);
            return null;
        }
    }

    async acquireContext(targetCanvas) {
        // Try to get an available context
        let contextInfo = this.availableContexts.pop();
        
        // Create new context if none available and under limit
        if (!contextInfo && this.getTotalContextCount() < this.maxContexts) {
            contextInfo = await this.createPooledContext();
        }

        if (!contextInfo) {
            console.warn('No WebGL contexts available');
            return null;
        }

        // Assign context to target canvas
        contextInfo.isAvailable = false;
        contextInfo.assignedCanvas = targetCanvas;
        contextInfo.lastUsed = Date.now();
        
        this.activeContexts.set(contextInfo.id, contextInfo);
        
        // Transfer rendering to target canvas when needed
        this.setupContextForCanvas(contextInfo, targetCanvas);
        
        console.log(`🎯 Acquired context ${contextInfo.id} for canvas`);
        return contextInfo;
    }

    setupContextForCanvas(contextInfo, targetCanvas) {
        // Create a render function that draws to the target canvas
        const sourceCanvas = contextInfo.canvas;
        const targetCtx = targetCanvas.getContext('2d');
        
        contextInfo.renderToTarget = () => {
            if (targetCtx && sourceCanvas) {
                targetCtx.drawImage(sourceCanvas, 0, 0, targetCanvas.width, targetCanvas.height);
            }
        };
        
        // Resize source canvas to match target
        sourceCanvas.width = targetCanvas.width;
        sourceCanvas.height = targetCanvas.height;
        contextInfo.gl.viewport(0, 0, sourceCanvas.width, sourceCanvas.height);
    }

    releaseContext(contextInfo) {
        if (!contextInfo || !this.activeContexts.has(contextInfo.id)) {
            return;
        }

        console.log(`🔄 Releasing context: ${contextInfo.id}`);
        
        // Clear the context
        const gl = contextInfo.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // Reset context state
        contextInfo.isAvailable = true;
        contextInfo.assignedCanvas = null;
        contextInfo.renderToTarget = null;
        contextInfo.lastUsed = Date.now();

        // Move back to available pool
        this.activeContexts.delete(contextInfo.id);
        this.availableContexts.push(contextInfo);
    }

    getAvailableCount() {
        return this.availableContexts.length;
    }

    getTotalContextCount() {
        return this.availableContexts.length + this.activeContexts.size;
    }

    cleanup() {
        console.log('🧹 Cleaning up WebGL context pool');
        
        // Release all contexts
        [...this.activeContexts.values()].forEach(contextInfo => {
            this.releaseContext(contextInfo);
        });

        // Clean up canvas elements
        this.availableContexts.forEach(contextInfo => {
            if (contextInfo.canvas && contextInfo.canvas.parentNode) {
                contextInfo.canvas.parentNode.removeChild(contextInfo.canvas);
            }
        });

        this.availableContexts = [];
        this.activeContexts.clear();
    }
}

/**
 * Shader Compilation Cache - Caches compiled shaders for reuse
 */
class ShaderCompilationCache {
    constructor() {
        this.shaderCache = new Map();
        this.programCache = new Map();
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    async initialize() {
        console.log('🎨 Initializing shader compilation cache');
        // Pre-compile common shaders here if needed
    }

    getShader(gl, type, source) {
        const cacheKey = `${type}-${this.hashString(source)}`;
        
        if (this.shaderCache.has(cacheKey)) {
            this.cacheHits++;
            return this.shaderCache.get(cacheKey);
        }

        this.cacheMisses++;
        
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        this.shaderCache.set(cacheKey, shader);
        return shader;
    }

    getProgram(gl, vertexSource, fragmentSource) {
        const cacheKey = `${this.hashString(vertexSource)}-${this.hashString(fragmentSource)}`;
        
        if (this.programCache.has(cacheKey)) {
            this.cacheHits++;
            return this.programCache.get(cacheKey);
        }

        this.cacheMisses++;

        const vertexShader = this.getShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.getShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

        if (!vertexShader || !fragmentShader) {
            return null;
        }

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            return null;
        }

        this.programCache.set(cacheKey, program);
        return program;
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    getHitRate() {
        const total = this.cacheHits + this.cacheMisses;
        return total > 0 ? this.cacheHits / total : 0;
    }

    cleanup() {
        this.shaderCache.clear();
        this.programCache.clear();
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }
}

/**
 * WebGL Resource Manager - Manages buffers, textures, and other GL resources
 */
class WebGLResourceManager {
    constructor() {
        this.buffers = new Map();
        this.textures = new Map();
        this.vertexArrays = new Map();
        this.resourceCounter = 0;
    }

    async initialize() {
        console.log('📦 Initializing WebGL resource manager');
    }

    createBuffer(gl, data, type = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW) {
        const id = `buffer-${++this.resourceCounter}`;
        const buffer = gl.createBuffer();
        
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, data, usage);
        
        this.buffers.set(id, {
            buffer,
            type,
            size: data.byteLength,
            created: Date.now()
        });

        return { id, buffer };
    }

    createTexture(gl, width, height, format = gl.RGBA, type = gl.UNSIGNED_BYTE) {
        const id = `texture-${++this.resourceCounter}`;
        const texture = gl.createTexture();
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        this.textures.set(id, {
            texture,
            width,
            height,
            format,
            type,
            created: Date.now()
        });

        return { id, texture };
    }

    releaseBuffer(gl, id) {
        const bufferInfo = this.buffers.get(id);
        if (bufferInfo) {
            gl.deleteBuffer(bufferInfo.buffer);
            this.buffers.delete(id);
        }
    }

    releaseTexture(gl, id) {
        const textureInfo = this.textures.get(id);
        if (textureInfo) {
            gl.deleteTexture(textureInfo.texture);
            this.textures.delete(id);
        }
    }

    getTotalMemoryUsage() {
        let bufferMemory = 0;
        let textureMemory = 0;

        this.buffers.forEach(info => {
            bufferMemory += info.size;
        });

        this.textures.forEach(info => {
            textureMemory += info.width * info.height * 4; // Assume RGBA
        });

        return { bufferMemory, textureMemory, total: bufferMemory + textureMemory };
    }

    forceCleanup() {
        console.log('🧹 Force cleaning WebGL resources');
        // Implementation would clean up old unused resources
    }
}

/**
 * Performance Monitor - Tracks FPS and render times
 */
class PerformanceMonitor {
    constructor(options) {
        this.options = options;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.renderTimes = [];
        this.currentFPS = 0;
        this.targetFPS = options.performanceTarget || 60;
    }

    async initialize() {
        console.log('📊 Initializing performance monitor');
        this.startFPSTracking();
    }

    startFPSTracking() {
        const trackFPS = () => {
            const now = performance.now();
            this.frameCount++;
            
            if (now - this.lastTime >= 1000) {
                this.currentFPS = this.frameCount;
                this.frameCount = 0;
                this.lastTime = now;
            }
            
            requestAnimationFrame(trackFPS);
        };
        
        trackFPS();
    }

    recordRenderTime(time) {
        this.renderTimes.push(time);
        if (this.renderTimes.length > 100) {
            this.renderTimes.shift();
        }
    }

    getCurrentFPS() {
        return this.currentFPS;
    }

    getAverageRenderTime() {
        if (this.renderTimes.length === 0) return 0;
        return this.renderTimes.reduce((a, b) => a + b) / this.renderTimes.length;
    }

    isPerformanceGood() {
        return this.currentFPS >= this.targetFPS * 0.8;
    }

    registerVisualizer(visualizer) {
        // Track visualizer performance
    }

    unregisterVisualizer(visualizer) {
        // Stop tracking visualizer
    }
}

/**
 * Memory Usage Tracker - Monitors and manages memory usage
 */
class MemoryUsageTracker {
    constructor(options) {
        this.options = options;
        this.memoryThreshold = (options.memoryThresholdMB || 256) * 1024 * 1024;
        this.lastCleanup = Date.now();
    }

    async initialize() {
        console.log('💾 Initializing memory usage tracker');
    }

    getCurrentUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return { used: 0, total: 0, limit: 0 };
    }

    checkMemoryThreshold() {
        const usage = this.getCurrentUsage();
        if (usage.used > this.memoryThreshold) {
            console.warn('🚨 Memory threshold exceeded:', usage);
            return true;
        }
        return false;
    }

    forceCleanup() {
        console.log('🧹 Force memory cleanup');
        this.lastCleanup = Date.now();
        
        // Clear various caches and trigger garbage collection
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
    }
}

/**
 * Optimized VIB34D Visualizer with performance enhancements
 */
class OptimizedVIB34DVisualizer {
    constructor(contextInfo, config, shaderCache, resourceManager, performanceMonitor) {
        this.id = `visualizer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.contextInfo = contextInfo;
        this.gl = contextInfo.gl;
        this.config = config;
        this.shaderCache = shaderCache;
        this.resourceManager = resourceManager;
        this.performanceMonitor = performanceMonitor;
        
        this.isRunning = false;
        this.qualityLevel = 1.0;
        this.lastRenderTime = 0;
        
        console.log(`🎨 Creating optimized visualizer: ${this.id}`);
    }

    async initialize() {
        // Initialize shaders using cache
        this.initializeShaders();
        this.initializeBuffers();
        this.setupUniforms();
        
        console.log(`✅ Optimized visualizer initialized: ${this.id}`);
    }

    initializeShaders() {
        // Use the existing VIB34D shader system with caching
        const vertexSource = this.getVertexShader();
        const fragmentSource = this.getFragmentShader();
        
        this.program = this.shaderCache.getProgram(this.gl, vertexSource, fragmentSource);
        if (!this.program) {
            throw new Error('Failed to create shader program');
        }
    }

    initializeBuffers() {
        // Create buffers using resource manager
        const vertices = new Float32Array([
            -1, -1,  1, -1,  -1, 1,
            -1,  1,  1, -1,   1, 1
        ]);
        
        this.bufferInfo = this.resourceManager.createBuffer(this.gl, vertices);
    }

    setupUniforms() {
        this.uniforms = {
            time: this.gl.getUniformLocation(this.program, 'u_time'),
            dimension: this.gl.getUniformLocation(this.program, 'u_dimension'),
            morphFactor: this.gl.getUniformLocation(this.program, 'u_morphFactor'),
            gridDensity: this.gl.getUniformLocation(this.program, 'u_gridDensity'),
            rotationSpeed: this.gl.getUniformLocation(this.program, 'u_rotationSpeed')
        };
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.render();
        console.log(`🎬 Started optimized visualizer: ${this.id}`);
    }

    stop() {
        this.isRunning = false;
        console.log(`⏹️ Stopped optimized visualizer: ${this.id}`);
    }

    render() {
        if (!this.isRunning) return;
        
        const startTime = performance.now();
        
        const gl = this.gl;
        
        // Clear and setup
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Use program and set uniforms
        gl.useProgram(this.program);
        
        // Update uniforms based on config and quality level
        gl.uniform1f(this.uniforms.time, Date.now() * 0.001);
        gl.uniform1f(this.uniforms.dimension, this.config.dimension || 4.0);
        gl.uniform1f(this.uniforms.morphFactor, this.config.morphFactor || 0.7);
        gl.uniform1f(this.uniforms.gridDensity, (this.config.gridDensity || 8.0) * this.qualityLevel);
        gl.uniform1f(this.uniforms.rotationSpeed, this.config.rotationSpeed || 0.5);
        
        // Bind buffer and draw
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferInfo.buffer);
        const positionLocation = gl.getAttribLocation(this.program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        // Copy to target canvas if needed
        if (this.contextInfo.renderToTarget) {
            this.contextInfo.renderToTarget();
        }
        
        // Performance tracking
        const renderTime = performance.now() - startTime;
        this.performanceMonitor.recordRenderTime(renderTime);
        this.lastRenderTime = renderTime;
        
        // Continue rendering
        requestAnimationFrame(() => this.render());
    }

    updateParameters(params) {
        Object.assign(this.config, params);
    }

    reduceQuality() {
        this.qualityLevel = Math.max(0.1, this.qualityLevel * 0.8);
        console.log(`📉 Reduced quality for ${this.id}: ${this.qualityLevel.toFixed(2)}`);
    }

    increaseQuality() {
        this.qualityLevel = Math.min(1.0, this.qualityLevel * 1.1);
        console.log(`📈 Increased quality for ${this.id}: ${this.qualityLevel.toFixed(2)}`);
    }

    setMinimumQuality() {
        this.qualityLevel = 0.1;
        console.log(`⚡ Set minimum quality for ${this.id}`);
    }

    getVertexShader() {
        return `
            attribute vec2 a_position;
            varying vec2 v_position;
            
            void main() {
                v_position = a_position;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;
    }

    getFragmentShader() {
        // Use simplified shader for performance
        return `
            precision mediump float;
            varying vec2 v_position;
            
            uniform float u_time;
            uniform float u_dimension;
            uniform float u_morphFactor;
            uniform float u_gridDensity;
            uniform float u_rotationSpeed;
            
            float grid(vec2 p, float density) {
                vec2 coord = p * density;
                vec2 g = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
                float line = min(g.x, g.y);
                return 1.0 - min(line, 1.0);
            }
            
            void main() {
                vec2 p = v_position;
                
                // Animated rotation
                float angle = u_time * u_rotationSpeed;
                float c = cos(angle);
                float s = sin(angle);
                mat2 rot = mat2(c, -s, s, c);
                p = rot * p;
                
                // Grid pattern
                float g = grid(p, u_gridDensity);
                
                // 4D effect
                float w = sin(u_time + length(p) * 3.0) * u_morphFactor;
                g += grid(p + vec2(w * 0.1), u_gridDensity * 0.7) * 0.5;
                
                // Color based on dimension
                vec3 color = mix(
                    vec3(1.0, 0.0, 1.0), // Magenta for 3D
                    vec3(0.0, 1.0, 1.0), // Cyan for 4D
                    smoothstep(3.0, 4.0, u_dimension)
                );
                
                gl_FragColor = vec4(color * g, 1.0);
            }
        `;
    }

    dispose() {
        console.log(`🧹 Disposing optimized visualizer: ${this.id}`);
        
        this.stop();
        
        // Release WebGL resources
        if (this.bufferInfo) {
            this.resourceManager.releaseBuffer(this.gl, this.bufferInfo.id);
        }
        
        // Clear references
        this.contextInfo = null;
        this.gl = null;
        this.config = null;
        
        console.log(`✅ Optimized visualizer disposed: ${this.id}`);
    }
}

// Export for browser use
if (typeof window !== 'undefined') {
    window.VIB34DWebGLPerformanceSystem = VIB34DWebGLPerformanceSystem;
    window.OptimizedVIB34DVisualizer = OptimizedVIB34DVisualizer;
    
    // Create global performance system instance
    window.VIB34D_PERFORMANCE_SYSTEM = null;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.VIB34D_PERFORMANCE_SYSTEM = new VIB34DWebGLPerformanceSystem();
        });
    } else {
        window.VIB34D_PERFORMANCE_SYSTEM = new VIB34DWebGLPerformanceSystem();
    }
    
    console.log('🚀 VIB34D WebGL Performance System loaded');
}

console.log('✅ VIB34D WebGL Performance Optimization System ready');