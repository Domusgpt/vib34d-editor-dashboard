/**
 * UnifiedReactivityBridge.js - The JS-CSS-GLSL Bridge
 * 
 * Creates synchronized multi-layer reactions across HTML/CSS/WebGL rendering layers.
 * Implements the "unified field" of reactivity where JavaScript serves as the central conductor
 * for all system-wide visual responses, ensuring perfect synchronization between:
 * - CSS Custom Properties and animations
 * - WebGL GLSL uniform updates  
 * - DOM class state management
 */

class UnifiedReactivityBridge {
    constructor(homeMaster, visualizers) {
        console.log('🌉 UnifiedReactivityBridge - Synchronizing multi-layer reactions...');
        
        this.homeMaster = homeMaster;
        this.visualizers = visualizers || [];
        this.presetManager = null;
        
        // CSS Custom Properties for unified reactivity (editor-configurable)
        this.cssProperties = {
            '--global-intensity': '0.0',
            '--chaos-intensity': '0.0', 
            '--micro-interaction-scale': '1.0',
            '--scroll-progress': '0.0',
            '--mouse-influence': '0.0',
            '--system-coherence': '1.0',
            '--dimensional-depth': '3.5',
            '--portal-energy': '0.0',
            
            // Editor dashboard parameters
            '--master-intensity': '0.8',
            '--grid-layers': '3',
            '--crystal-accents-enabled': '1',
            '--color-saturation': '0.9',
            '--animation-speed': '1.0',
            
            // Navigation parameters
            '--drag-threshold': '80',
            '--tension-buildup': '0.02',
            '--snap-strength': '1.0',
            
            // Content interaction
            '--content-gravity-strength': '0.3',
            '--content-gravity-radius': '150px',
            '--hover-scale-factor': '1.15',
            '--hover-glow-intensity': '0.6'
        };
        
        // CSS Animation library for coordinated effects
        this.animationClasses = {
            'vhs-glitch-effect': {
                duration: 'calc(2s / (1.0 + var(--global-intensity, 0) * 4.0))',
                properties: ['clip-path', 'text-shadow', 'animation']
            },
            'portal-transition-effect': {
                duration: 'calc(0.8s / (1.0 + var(--global-intensity, 0) * 2.0))',
                properties: ['filter', 'opacity', 'transform']
            },
            'reality-inverted': {
                duration: '1.2s',
                properties: ['filter', 'hue-rotate', 'invert']
            },
            'dimensional-shift': {
                duration: 'calc(1.0s * var(--system-coherence, 1.0))',
                properties: ['transform', 'perspective', 'transform-style']
            },
            'consciousness-breathing': {
                duration: 'calc(3.0s / var(--system-coherence, 1.0))',
                properties: ['opacity', 'transform', 'filter']
            }
        };
        
        // Event coordination system
        this.eventQueue = [];
        this.isProcessingEvents = false;
        this.maxEventsPerFrame = 3;
        
        // Performance monitoring
        this.performanceProfile = 'standard';
        this.frameTime = 0;
        this.lastFrameTime = performance.now();
        
        this.initialize();
    }
    
    setPresetManager(presetManager) {
        this.presetManager = presetManager;
        console.log('🔗 UnifiedReactivityBridge connected to PresetManager');
    }
    
    initialize() {
        this.setupCSSVariableSystem();
        this.setupEventCoordination();
        this.setupPerformanceMonitoring();
        this.startUpdateLoop();
        
        console.log('✅ UnifiedReactivityBridge initialized - Multi-layer synchronization active');
    }
    
    setupCSSVariableSystem() {
        // Initialize CSS custom properties on document root
        const root = document.documentElement;
        Object.entries(this.cssProperties).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        
        // Create dynamic CSS for animation classes
        this.injectDynamicCSS();
    }
    
    injectDynamicCSS() {
        const style = document.createElement('style');
        style.id = 'vib3-unified-reactivity-css';
        
        style.textContent = `
            /* VHS/Glitch Effect with dynamic intensity */
            .vhs-glitch-effect {
                position: relative;
            }
            
            .vhs-glitch-effect[data-text]::before,
            .vhs-glitch-effect[data-text]::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-color, #0a0a0a);
                overflow: hidden;
                animation-duration: calc(2s / (1.0 + var(--global-intensity, 0) * 4.0));
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                animation-direction: alternate-reverse;
            }
            
            .vhs-glitch-effect[data-text]::before {
                left: calc(2px * var(--chaos-intensity, 0));
                text-shadow: calc(-1px * var(--chaos-intensity, 0)) 0 red;
                animation-name: vhs-noise-1;
            }
            
            .vhs-glitch-effect[data-text]::after {
                left: calc(-2px * var(--chaos-intensity, 0));
                text-shadow: calc(-1px * var(--chaos-intensity, 0)) 0 blue;
                animation-name: vhs-noise-2;
            }
            
            /* Portal Transition with chromatic aberration */
            .portal-transition-effect {
                animation: chromatic-portal var(--portal-duration, 0.8s) ease-out forwards;
                animation-duration: calc(0.8s / (1.0 + var(--global-intensity, 0) * 2.0));
            }
            
            @keyframes chromatic-portal {
                0% {
                    filter: none;
                    opacity: 1;
                }
                25% {
                    filter: drop-shadow(calc(3px * var(--portal-energy, 1)) 0 0 red) 
                            drop-shadow(calc(-3px * var(--portal-energy, 1)) 0 0 cyan);
                }
                50% {
                    filter: drop-shadow(calc(6px * var(--portal-energy, 1)) 0 0 red) 
                            drop-shadow(calc(-6px * var(--portal-energy, 1)) 0 0 cyan);
                    opacity: 1;
                }
                99% {
                    filter: drop-shadow(calc(20px * var(--portal-energy, 1)) 0 0 red) 
                            drop-shadow(calc(-20px * var(--portal-energy, 1)) 0 0 cyan);
                    opacity: 0;
                }
                100% {
                    filter: none;
                    opacity: 0;
                }
            }
            
            /* Reality Inversion */
            .reality-inverted {
                filter: invert(1) hue-rotate(180deg) contrast(var(--chaos-intensity, 1));
                transition: filter 0.3s ease;
            }
            
            /* Dimensional Shift */
            .dimensional-shift {
                transform: perspective(calc(1200px + var(--dimensional-depth, 3.5) * 200px)) 
                          rotateX(calc(var(--mouse-influence, 0) * 5deg)) 
                          rotateY(calc(var(--mouse-influence, 0) * 3deg));
                transition: transform calc(0.3s * var(--system-coherence, 1.0)) ease-out;
            }
            
            /* Consciousness Breathing */
            .consciousness-breathing {
                animation: unified-breathing calc(3s / var(--system-coherence, 1.0)) ease-in-out infinite;
            }
            
            @keyframes unified-breathing {
                0%, 100% {
                    transform: scale(1) translateZ(0);
                    opacity: var(--global-intensity, 0.8);
                }
                50% {
                    transform: scale(calc(1 + var(--global-intensity, 0) * 0.05)) translateZ(calc(var(--dimensional-depth, 3.5) * 10px));
                    opacity: calc(var(--global-intensity, 0.8) + 0.1);
                }
            }
            
            /* Micro-interactions with global scaling */
            .micro-interactive:hover {
                transform: scale(var(--micro-interaction-scale, 1.05));
                transition: transform 0.2s ease;
            }
            
            /* Responsive visual elements */
            .reactive-element {
                opacity: calc(0.5 + var(--global-intensity, 0) * 0.5);
                transform: translateY(calc(var(--scroll-progress, 0) * -10px));
                filter: brightness(calc(1 + var(--global-intensity, 0) * 0.3));
                transition: all 0.1s ease;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupEventCoordination() {
        // Intercept and coordinate all interaction events
        this.setupMouseCoordination();
        this.setupScrollCoordination();
        this.setupClickCoordination();
        this.setupKeyboardCoordination();
    }
    
    setupMouseCoordination() {
        let mouseTimeout;
        
        document.addEventListener('mousemove', (e) => {
            const mouseData = {
                x: e.clientX / window.innerWidth,
                y: 1.0 - (e.clientY / window.innerHeight),
                velocity: Math.sqrt(e.movementX**2 + e.movementY**2),
                timestamp: performance.now()
            };
            
            this.queueEvent('mouse', mouseData);
            
            // Auto-decay mouse influence
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.updateCSSProperty('--mouse-influence', '0.0');
            }, 100);
        });
    }
    
    setupScrollCoordination() {
        let scrollAccumulation = 0;
        let scrollTimeout;
        
        document.addEventListener('wheel', (e) => {
            const velocity = Math.abs(e.deltaY);
            const direction = e.deltaY > 0 ? 1 : -1;
            
            scrollAccumulation += velocity;
            
            const scrollData = {
                velocity: velocity,
                direction: direction,
                accumulated: scrollAccumulation,
                position: window.scrollY,
                timestamp: performance.now()
            };
            
            this.queueEvent('scroll', scrollData);
            
            // Decay scroll accumulation
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                scrollAccumulation *= 0.9;
                if (scrollAccumulation < 1) scrollAccumulation = 0;
            }, 100);
        });
    }
    
    setupClickCoordination() {
        document.addEventListener('click', (e) => {
            const clickData = {
                x: e.clientX / window.innerWidth,
                y: 1.0 - (e.clientY / window.innerHeight),
                target: e.target,
                timestamp: performance.now()
            };
            
            this.queueEvent('click', clickData);
        });
    }
    
    setupKeyboardCoordination() {
        document.addEventListener('keydown', (e) => {
            // Special key combinations for debug/effects
            if (e.ctrlKey && e.shiftKey) {
                switch(e.key) {
                    case 'G': // Glitch effect
                        this.triggerEffect('reality-glitch');
                        break;
                    case 'P': // Portal burst
                        this.triggerEffect('portal-burst');
                        break;
                    case 'D': // Dimensional shift
                        this.triggerEffect('dimensional-shift');
                        break;
                }
            }
        });
    }
    
    queueEvent(type, data) {
        this.eventQueue.push({ type, data, timestamp: performance.now() });
        
        // Prevent queue overflow
        if (this.eventQueue.length > 50) {
            this.eventQueue = this.eventQueue.slice(-30);
        }
    }
    
    processEventQueue() {
        if (this.isProcessingEvents || this.eventQueue.length === 0) return;
        
        this.isProcessingEvents = true;
        const eventsThisFrame = Math.min(this.maxEventsPerFrame, this.eventQueue.length);
        
        for (let i = 0; i < eventsThisFrame; i++) {
            const event = this.eventQueue.shift();
            this.processEvent(event.type, event.data);
        }
        
        this.isProcessingEvents = false;
    }
    
    processEvent(type, data) {
        switch(type) {
            case 'mouse':
                this.processMouse(data);
                break;
            case 'scroll':
                this.processScroll(data);
                break;
            case 'click':
                this.processClick(data);
                break;
            case 'editorUpdate':
                this.processEditorUpdate(data);
                break;
            case 'cubeNavigation':
                this.processCubeNavigation(data);
                break;
            case 'visualizerInteraction': // New case
                if (this.homeMaster && this.homeMaster.handleVisualizerInteraction) {
                    this.homeMaster.handleVisualizerInteraction(data);
                } else {
                    console.warn("HomeMaster or handleVisualizerInteraction not found for visualizerInteraction event.", data);
                }
                break;
            default:
                console.warn(`Bridge: Unknown event type to process: ${type}`, data);
        }
    }
    
    /**
     * Process editor dashboard parameter updates
     */
    processEditorUpdate(data) {
        console.log(`🎛️ Editor parameter update: ${data.parameter} = ${data.value}`);
        
        switch(data.parameter) {
            case 'visualIntensity':
                this.updateCSSProperty('--master-intensity', data.value.toString());
                break;
            case 'gridComplexity':
                this.updateCSSProperty('--grid-layers', data.value.toString());
                break;
            case 'crystallineAccents':
                this.updateCSSProperty('--crystal-accents-enabled', data.value ? '1' : '0');
                break;
            case 'colorVibrancy':
                this.updateCSSProperty('--color-saturation', data.value.toString());
                break;
            case 'animationSpeed':
                this.updateCSSProperty('--animation-speed', data.value.toString());
                break;
        }
        
        // Update HomeMaster with new parameter
        if (this.homeMaster.updateFromEditor) {
            this.homeMaster.updateFromEditor(data.parameter, data.value);
        }
        
        // Sync all visualizers
        this.syncAllLayers();
    }
    
    /**
     * Process cube navigation events with editor configuration
     */
    processCubeNavigation(data) {
        const { direction, tension, snapPoint } = data;
        
        // Apply drag threshold from editor config
        const dragThreshold = parseFloat(this.cssProperties['--drag-threshold']);
        const tensionRate = parseFloat(this.cssProperties['--tension-buildup']);
        const snapStrength = parseFloat(this.cssProperties['--snap-strength']);
        
        if (tension * 100 < dragThreshold) {
            // Build tension visual feedback
            this.updateCSSProperty('--cube-tension', (tension * tensionRate).toString());
            return;
        }
        
        // Trigger navigation with snap feedback
        this.updateCSSProperty('--portal-energy', snapStrength.toString());
        
        // Register with HomeMaster
        if (this.homeMaster.registerInteraction) {
            this.homeMaster.registerInteraction('cubeRotation', tension * snapStrength);
        }
        
        console.log(`🎲 Cube navigation: ${direction} (tension: ${tension}, snap: ${snapStrength})`);
    }
    
    processMouse(data) {
        const intensity = Math.min(1.0, data.velocity / 40);
        
        // Update CSS variables
        this.updateCSSProperty('--mouse-influence', intensity.toFixed(3));
        this.updateCSSProperty('--micro-interaction-scale', (1.0 + intensity * 0.05).toFixed(3));
        
        // Update HomeMaster
        this.homeMaster.updateInteraction('mouse', {
            x: data.x,
            y: data.y,
            intensity: intensity
        });
        
        // Update WebGL visualizers
        this.visualizers.forEach(viz => {
            if (viz.updateInteraction) {
                viz.updateInteraction(data.x, data.y, intensity);
            }
        });
    }
    
    processScroll(data) {
        const normalizedVelocity = Math.min(1.0, data.velocity / 100);
        const chaosIntensity = Math.min(1.0, data.accumulated / 500);
        
        // Update CSS variables
        this.updateCSSProperty('--global-intensity', normalizedVelocity.toFixed(3));
        this.updateCSSProperty('--chaos-intensity', chaosIntensity.toFixed(3));
        this.updateCSSProperty('--scroll-progress', (data.position / document.body.scrollHeight).toFixed(3));
        
        // Check for portal burst threshold
        if (data.velocity > 1500) {
            this.triggerPortalBurst(data.velocity);
        }
        
        // Update HomeMaster
        this.homeMaster.updateInteraction('scroll', {
            velocity: normalizedVelocity,
            chaos: chaosIntensity
        });
        
        // Update WebGL visualizers
        this.visualizers.forEach(viz => {
            if (viz.updateChaos) {
                viz.updateChaos(chaosIntensity);
            }
        });
    }
    
    processClick(data) {
        // Update CSS variables for click pulse
        this.updateCSSProperty('--global-intensity', '1.0');
        
        // Auto-decay after click
        setTimeout(() => {
            this.updateCSSProperty('--global-intensity', '0.0');
        }, 300);
        
        // Update HomeMaster
        this.homeMaster.updateInteraction('click', {
            x: data.x,
            y: data.y
        });
        
        // Update WebGL visualizers
        this.visualizers.forEach(viz => {
            if (viz.triggerClick) {
                viz.triggerClick(data.x, data.y);
            }
        });
        
        // Create CSS ripple effect
        this.createRippleEffect(data.x * window.innerWidth, data.y * window.innerHeight);
    }
    
    triggerPortalBurst(velocity) {
        const intensity = Math.min(2.0, velocity / 1000);
        
        // Update CSS for portal effect
        this.updateCSSProperty('--portal-energy', intensity.toFixed(3));
        this.updateCSSProperty('--chaos-intensity', '1.0');
        
        // Add portal burst class to body
        document.body.classList.add('portal-transition-effect');
        
        // Remove class after animation
        setTimeout(() => {
            document.body.classList.remove('portal-transition-effect');
            this.updateCSSProperty('--portal-energy', '0.0');
        }, 800);
        
        console.log(`🌀 Portal Burst triggered - velocity: ${velocity}, intensity: ${intensity}`);
    }
    
    triggerEffect(effectName) {
        switch(effectName) {
            case 'reality-glitch':
                this.triggerRealityGlitch();
                break;
            case 'portal-burst':
                this.triggerPortalBurst(2000);
                break;
            case 'dimensional-shift':
                this.triggerDimensionalShift();
                break;
        }
    }
    
    triggerRealityGlitch() {
        // CSS reality inversion
        document.body.classList.add('reality-inverted');
        this.updateCSSProperty('--chaos-intensity', '1.0');
        
        // Update HomeMaster for coordinated effect
        this.homeMaster.updateInteraction('click', { intensity: 1.0 });
        
        // WebGL inversion
        this.visualizers.forEach(viz => {
            if (viz.updateParameters) {
                viz.updateParameters({ 
                    glitchIntensity: 1.0,
                    colorInvert: true 
                });
            }
        });
        
        // Remove effect after duration
        setTimeout(() => {
            document.body.classList.remove('reality-inverted');
            this.updateCSSProperty('--chaos-intensity', '0.0');
        }, 1200);
        
        console.log('⚡ Reality Glitch triggered - Full system inversion');
    }
    
    triggerDimensionalShift() {
        const newDimension = 3.8;
        
        // CSS dimensional shift
        this.updateCSSProperty('--dimensional-depth', newDimension.toString());
        document.body.classList.add('dimensional-shift');
        
        // HomeMaster dimension update
        this.homeMaster.overrideParameters({ dimension: newDimension });
        
        // WebGL dimension update
        this.visualizers.forEach(viz => {
            if (viz.updateParameters) {
                viz.updateParameters({ dimension: newDimension });
            }
        });
        
        // Return to baseline
        setTimeout(() => {
            document.body.classList.remove('dimensional-shift');
            this.updateCSSProperty('--dimensional-depth', '3.5');
            this.homeMaster.overrideParameters({ dimension: 3.5 });
        }, 2000);
        
        console.log(`🌌 Dimensional Shift triggered - New dimension: ${newDimension}`);
    }
    
    createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'unified-ripple-effect';
        ripple.style.cssText = `
            position: fixed;
            left: ${x - 50}px;
            top: ${y - 50}px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.6) 0%, transparent 70%);
            pointer-events: none;
            z-index: 10000;
            animation: ripple-expand 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            document.body.removeChild(ripple);
        }, 600);
    }
    
    updateCSSProperty(property, value) {
        this.cssProperties[property] = value;
        document.documentElement.style.setProperty(property, value);
    }
    
    setupPerformanceMonitoring() {
        // Adjust performance based on frame rate
        setInterval(() => {
            const currentTime = performance.now();
            this.frameTime = currentTime - this.lastFrameTime;
            this.lastFrameTime = currentTime;
            
            // Adjust event processing based on performance
            if (this.frameTime > 32) { // < 30 FPS
                this.maxEventsPerFrame = 1;
                this.performanceProfile = 'minimal';
            } else if (this.frameTime > 20) { // < 50 FPS
                this.maxEventsPerFrame = 2;
                this.performanceProfile = 'standard';
            } else {
                this.maxEventsPerFrame = 3;
                this.performanceProfile = 'premium';
            }
        }, 1000);
    }
    
    startUpdateLoop() {
        const update = () => {
            this.processEventQueue();
            
            // Update system coherence based on HomeMaster state
            if (this.homeMaster) {
                const systemState = this.homeMaster.getSystemState();
                this.updateCSSProperty('--system-coherence', systemState.masterState.coherence.toFixed(3));
            }
            
            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
        console.log('🔄 UnifiedReactivityBridge update loop started - Multi-layer synchronization active');
    }
    
    /**
     * Sync all visual layers with current parameter state
     */
    syncAllLayers() {
        // Update all CSS custom properties
        Object.entries(this.cssProperties).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        
        // Update WebGL visualizers
        const currentSectionKey = this.homeMaster?.masterState?.activeSection;
        let sectionParams = null;
        let geometryThemeName = null;

        if (currentSectionKey !== undefined && this.homeMaster?.getParametersForSection) {
            sectionParams = this.homeMaster.getParametersForSection(currentSectionKey);
            geometryThemeName = sectionParams?.geometryThemeName; // Assumes HomeMaster provides this
        }

        const webGLGlobalParams = this.getWebGLParameters(); // General reactive parameters

        this.visualizers.forEach(viz => {
            if (!viz) return;

            // Update general reactive parameters
            if (viz.updateParameters) {
                viz.updateParameters(webGLGlobalParams);
            }

            // Update theme/geometry if it has changed for the section
            if (geometryThemeName && viz.setTheme && viz.currentTheme !== geometryThemeName) {
                // Check currentTheme to prevent redundant setTheme calls if possible
                // Note: viz.currentTheme would need to be exposed or tracked by the bridge if not already.
                // For now, we assume setTheme handles internal checks or is safe to call.
                viz.setTheme(geometryThemeName);
                console.log(`🎨 Bridge updated viz ${viz.instanceId || viz.role || 'unknown'} to theme: ${geometryThemeName}`);
            } else if (geometryThemeName && viz.setTheme && !viz.hasOwnProperty('currentTheme')) {
                 // If viz doesn't track currentTheme, call setTheme anyway if geometryThemeName is available
                viz.setTheme(geometryThemeName);
            }
        });
        
        console.log('🔄 All visual layers synchronized');
    }
    
    /**
     * Get current parameters formatted for WebGL shaders
     */
    getWebGLParameters() {
        return {
            masterIntensity: parseFloat(this.cssProperties['--master-intensity']),
            gridLayers: parseInt(this.cssProperties['--grid-layers']),
            colorSaturation: parseFloat(this.cssProperties['--color-saturation']),
            animationSpeed: parseFloat(this.cssProperties['--animation-speed']),
            contentGravityStrength: parseFloat(this.cssProperties['--content-gravity-strength']),
            globalIntensity: parseFloat(this.cssProperties['--global-intensity']),
            chaosIntensity: parseFloat(this.cssProperties['--chaos-intensity']),
            dimensionalDepth: parseFloat(this.cssProperties['--dimensional-depth'])
        };
    }
    
    /**
     * Update parameter from editor dashboard
     */
    updateFromEditor(parameter, value) {
        this.queueEvent('editorUpdate', { parameter, value });
    }
    
    /**
     * Trigger cube navigation event
     */
    triggerCubeNavigation(direction, tension, snapPoint = false) {
        this.queueEvent('cubeNavigation', { direction, tension, snapPoint });
    }
    
    // Public API for manual effect triggering
    setPreset(presetName) {
        if (this.presetManager) {
            const preset = this.presetManager.getInteractionPreset(presetName);
            if (preset) {
                this.queueEvent('preset', { preset: preset });
            }
        }
    }
    
    getSystemState() {
        return {
            cssProperties: {...this.cssProperties},
            eventQueueLength: this.eventQueue.length,
            performanceProfile: this.performanceProfile,
            frameTime: this.frameTime,
            visualizerCount: this.visualizers.length,
            editorParameters: this.getWebGLParameters(),
            isEditorConnected: !!this.homeMaster?.editorConfig,
            scrollableElementsState: this.homeMaster?.masterState?.scrollableElementsState || {}
        };
    }

    // Helper to ensure CSS property for a scrollable element exists if needed by other systems
    // For now, primarily relies on setting directly.
    _ensureScrollCssProperties(elementId) {
        const xVar = `--${elementId}-scroll-x`;
        const yVar = `--${elementId}-scroll-y`;
        if (!this.cssProperties.hasOwnProperty(xVar)) {
            // console.log(`Bridge: Registering new scroll CSS var: ${xVar}`);
            // this.cssProperties[xVar] = '0px'; // Initialize if needed, but direct setProperty is primary
        }
        if (!this.cssProperties.hasOwnProperty(yVar)) {
            // console.log(`Bridge: Registering new scroll CSS var: ${yVar}`);
            // this.cssProperties[yVar] = '0px';
        }
    }

    // Modified startUpdateLoop to include syncing scroll states
    startUpdateLoop() {
        const update = () => {
            this.processEventQueue(); // Process interactions that might change HomeMaster state

            // Update system coherence based on HomeMaster state
            if (this.homeMaster) {
                const systemState = this.homeMaster.getSystemState();
                this.updateCSSProperty('--system-coherence', systemState.masterState.coherence.toFixed(3));

                // Sync scrollable elements states
                if (this.homeMaster.masterState.scrollableElementsState) {
                    for (const elementId in this.homeMaster.masterState.scrollableElementsState) {
                        const state = this.homeMaster.masterState.scrollableElementsState[elementId];
                        if (state) {
                            this.updateCSSProperty(`--${elementId}-scroll-x`, `${state.offsetX || 0}px`);
                            this.updateCSSProperty(`--${elementId}-scroll-y`, `${state.offsetY || 0}px`);
                        }
                    }
                }

                // Sync card DOM effects states
                if (this.homeMaster.masterState.cardDomEffects) {
                    for (const cardId_DOM in this.homeMaster.masterState.cardDomEffects) { // Renamed to avoid conflict if cardId is a local var
                        const effects = this.homeMaster.masterState.cardDomEffects[cardId_DOM];
                        const cardElement = document.getElementById(cardId_DOM); // Get the card DOM element

                        if (cardElement) {
                            for (const effectName in effects) {
                                const anim = effects[effectName];
                                if (anim && anim.hasOwnProperty('current')) {
                                    let value = anim.current;
                                    let unit = '';
                                    if (effectName.endsWith('_px')) {
                                        unit = 'px';
                                    } else if (effectName.endsWith('_percent')) {
                                        unit = '%';
                                    }

                                    const cssVarName = `--self-${effectName.replace('_px', '').replace('_percent', '')}`;

                                    // For zIndex, ensure it's an integer and no unit
                                    if (effectName === 'zIndex') {
                                        cardElement.style.setProperty(cssVarName, Math.round(value).toString());
                                    } else if (effectName === 'borderColor') { // borderColor is a string
                                        cardElement.style.setProperty(cssVarName, value.toString());
                                    }
                                    else {
                                        cardElement.style.setProperty(cssVarName, `${value}${unit}`);
                                    }
                                }
                            }
                        }
                    }
                }
                 // Sync global content gravity CSS vars (if CSS uses them directly, though WebGL also gets them)
                if (this.homeMaster.masterState.contentGravityState) {
                    const cgs = this.homeMaster.masterState.contentGravityState;
                    this.updateCSSProperty('--content-gravity-x-css', `${cgs.targetX * 100}%`); // Example for CSS %
                    this.updateCSSProperty('--content-gravity-y-css', `${cgs.targetY * 100}%`);
                    this.updateCSSProperty('--content-flow-strength-css', `${cgs.strength}`);
                }


            }

            // Potentially other periodic sync tasks from syncAllLayers could be moved here too
            // For instance, syncing WebGL visualizers if their params change often without specific events.
            // However, syncAllLayers is usually called on explicit state changes.
            // For scrolling, which updates frequently via HomeMaster's loop, this direct sync is better.


            // --- CARD FOCUS MODE SYNCHRONIZATION ---
            const { focusedCardId, focusModeAnimation } = ms;
            const allCards = document.querySelectorAll('.blog-card'); // Consider caching this query if performance is an issue

            // 1. Page Overlay
            let overlayEl = document.getElementById('page-focus-overlay');
            if (focusModeAnimation.pageOverlay && focusModeAnimation.pageOverlay.startTime > 0) {
                if (!overlayEl) {
                    overlayEl = document.createElement('div');
                    overlayEl.id = 'page-focus-overlay';
                    overlayEl.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:900; pointer-events:none;"; // z-index should be below focused card (1000) but above others
                    document.body.appendChild(overlayEl);
                }
                overlayEl.style.opacity = focusModeAnimation.pageOverlay.currentOpacity.toFixed(3);
                overlayEl.style.backgroundColor = focusModeAnimation.pageOverlay.backgroundColor;
                overlayEl.style.display = focusModeAnimation.pageOverlay.currentOpacity > 0.001 ? 'block' : 'none';

                const focusPreset = this.homeMaster.editorConfig?.interactionPresets?.cardFocusMode;
                if (focusPreset?.pageBackgroundEffect?.applyTo) {
                    const bgEffectTarget = document.querySelector(focusPreset.pageBackgroundEffect.applyTo);
                    if (bgEffectTarget && focusPreset.pageBackgroundEffect.backdropBlur) {
                             const blurAmount = focusModeAnimation.pageOverlay.currentOpacity * parseFloat(focusPreset.pageBackgroundEffect.backdropBlur || "0px");
                             // document.documentElement.style.setProperty('--page-content-area-blur', `${blurAmount}px`); // If using CSS var for blur
                             bgEffectTarget.style.filter = `blur(${blurAmount}px)`; // Direct blur on target
                    } else if (bgEffectTarget && parseFloat(document.documentElement.style.getPropertyValue('--page-content-area-blur') || "0px") > 0) {
                        // bgEffectTarget.style.filter = 'none'; // Clear if no blur specified or opacity is zero
                        document.documentElement.style.setProperty('--page-content-area-blur', `0px`);
                    }
                }

            } else if (overlayEl && (!focusModeAnimation.pageOverlay || focusModeAnimation.pageOverlay.currentOpacity <= 0.001)) {
                overlayEl.style.display = 'none';
                const focusPreset = this.homeMaster.editorConfig?.interactionPresets?.cardFocusMode;
                 if (focusPreset?.pageBackgroundEffect?.applyTo) {
                    const bgEffectTarget = document.querySelector(focusPreset.pageBackgroundEffect.applyTo);
                    if (bgEffectTarget) {
                        // bgEffectTarget.style.filter = 'none';
                         document.documentElement.style.setProperty('--page-content-area-blur', `0px`);
                    }
                 }
            }


            // 2. Focused and Observer Cards
            allCards.forEach(cardElement => {
                const cardId = cardElement.id;
                if (!cardId) return;

                let isCurrentlyFocused = focusedCardId === cardId;
                let isActiveFocusTarget = isCurrentlyFocused && focusModeAnimation.targetCard && focusModeAnimation.targetCard.startTime > 0;
                let isActiveFocusObserver = focusedCardId && !isCurrentlyFocused && focusModeAnimation.observerCardsEffect && focusModeAnimation.observerCardsEffect.startTime > 0;

                if (isActiveFocusTarget) {
                    const styles = focusModeAnimation.targetCard.current;
                    for (const prop in styles) {
                        if (styles[prop] !== undefined) {
                            // Special handling for transform properties if they are individual
                            if (prop === 'scale') { // Assuming scale is part of transform
                                cardElement.style.transform = `translate(-50%, -50%) scale(${styles[prop]})`; // Keep centering if it was fixed
                            } else if (prop === 'borderHighlightColor') {
                                cardElement.style.borderColor = styles[prop];
                            } else if (prop === 'borderHighlightWidth') {
                                cardElement.style.borderWidth = styles[prop];
                                cardElement.style.borderStyle = parseFloat(styles[prop]) > 0 ? (this.homeMaster.editorConfig?.interactionPresets?.cardFocusMode?.targetCardAnimation?.targetState?.borderStyle || 'solid') : 'none';
                            } else {
                                cardElement.style[prop] = typeof styles[prop] === 'number' && !['opacity', 'zIndex', 'scale'].includes(prop) ? `${styles[prop]}px` : styles[prop];
                            }
                        }
                    }
                } else if (isActiveFocusObserver) {
                    const styles = focusModeAnimation.observerCardsEffect.current;
                    let obsTransform = "";
                    let obsFilter = "";
                    for (const prop in styles) {
                        if (styles[prop] !== undefined) {
                            if (prop === 'scale') {
                                obsTransform += ` scale(${styles[prop]})`;
                            } else if (prop === 'opacity') {
                                cardElement.style.opacity = styles[prop];
                            } else if (prop === 'blur') {
                                obsFilter += ` blur(${styles[prop].toString().endsWith('px') ? styles[prop] : styles[prop]+'px'})`;
                            }
                        }
                    }
                    cardElement.style.transform = obsTransform.trim() || 'none'; // Explicitly set to none if empty
                    cardElement.style.filter = obsFilter.trim() || 'none';
                } else { // Not focused, not an observer, or focus ended - should revert to normal state
                         // This relies on cardDomEffects taking over for normal state styling for opacity/transform/filter.
                         // Explicitly reset properties unique to focus mode if they persist.
                    if (cardElement.style.position === 'fixed' && !isActiveFocusTarget) {
                        const originalCardState = ms.cardFocusData[cardId]?.originalStyle || {};
                        cardElement.style.position = originalCardState.position || this.homeMaster._getDefaultDomEffectValue('position', true);
                        cardElement.style.width = originalCardState.width || this.homeMaster._getDefaultDomEffectValue('width', true);
                        cardElement.style.height = originalCardState.height || this.homeMaster._getDefaultDomEffectValue('height', true);
                        cardElement.style.left = originalCardState.left || this.homeMaster._getDefaultDomEffectValue('left', true);
                        cardElement.style.top = originalCardState.top || this.homeMaster._getDefaultDomEffectValue('top', true);
                        cardElement.style.zIndex = originalCardState.zIndex || this.homeMaster._getDefaultDomEffectValue('zIndex', true);
                        // cardElement.style.borderColor = originalCardState.borderColor || this.homeMaster._getDefaultDomEffectValue('borderColor', true);
                        // cardElement.style.borderWidth = originalCardState.borderWidth || this.homeMaster._getDefaultDomEffectValue('borderHighlightWidth', true);
                        // cardElement.style.borderStyle = parseFloat(cardElement.style.borderWidth) > 0 ? 'solid' : 'none';

                        // If cardDomEffects handles transform/opacity, they will be set by that system.
                        // If not, ensure they are reset here too.
                        // cardElement.style.transform = 'scale(1)'; // Or original transform
                        // cardElement.style.opacity = '1';      // Or original opacity
                    }
                     if (cardElement.style.filter.includes('blur') && !isActiveFocusObserver) {
                         cardElement.style.filter = 'none';
                     }
                }
            });

            // 3. Emerging Buttons
            let buttonsContainer = focusedCardId ? document.getElementById(`${focusedCardId}-buttons-container`) : null;
            if (focusedCardId && !buttonsContainer) {
                 const focusedCardElement = document.getElementById(focusedCardId);
                 if (focusedCardElement) {
                    buttonsContainer = document.createElement('div');
                    buttonsContainer.id = `${focusedCardId}-buttons-container`;
                    const btnPresetConfig = this.homeMaster.editorConfig?.interactionPresets?.cardFocusMode?.emergingButtons;
                    if(btnPresetConfig?.containerStyles) {
                        Object.assign(buttonsContainer.style, btnPresetConfig.containerStyles);
                    } else { // Fallback basic styling for button container
                        buttonsContainer.style.position = 'absolute';
                        buttonsContainer.style.bottom = '20px';
                        buttonsContainer.style.left = '50%';
                        buttonsContainer.style.transform = 'translateX(-50%)';
                        buttonsContainer.style.display = 'flex';
                        buttonsContainer.style.gap = '10px';
                        buttonsContainer.style.zIndex = '1001'; // Above focused card
                    }
                    focusedCardElement.appendChild(buttonsContainer);
                 }
            }

            if (buttonsContainer) {
                // More efficient button handling: create/remove only when state changes drastically
                const existingButtonIds = Array.from(buttonsContainer.children).map(btn => btn.id);
                const requiredButtonIds = Object.values(ms.emergingButtonsStates)
                                           .filter(bs => bs.cardId === focusedCardId && bs.isVisible)
                                           .map(bs => bs.preset.id);

                // Remove buttons no longer needed
                existingButtonIds.forEach(btnId => {
                    if (!requiredButtonIds.includes(btnId)) {
                        const btnEl = document.getElementById(btnId);
                        if (btnEl) btnEl.remove();
                    }
                });

                if (ms.emergingButtonsStates) {
                    Object.values(ms.emergingButtonsStates).forEach(btnState => {
                        if (btnState.cardId === focusedCardId) { // Process all buttons for the current card, visibility handled by opacity/display
                            let buttonEl = document.getElementById(btnState.preset.id);
                            if (btnState.isVisible && !buttonEl) { // Create if visible and not existing
                                buttonEl = document.createElement('button');
                                buttonEl.id = btnState.preset.id;
                                buttonEl.setAttribute('data-no-emergence', 'true'); // Prevent VIB34D Emerging Button System conflict
                                buttonsContainer.appendChild(buttonEl); // Append early

                                buttonEl.setAttribute('aria-label', btnState.preset.ariaLabel || btnState.preset.text);
                                if (btnState.preset.iconClass) {
                                    const icon = document.createElement('i');
                                    icon.className = btnState.preset.iconClass;
                                    buttonEl.appendChild(icon);
                                    if (btnState.preset.text) buttonEl.appendChild(document.createTextNode(' ' + btnState.preset.text));
                                } else {
                                    buttonEl.textContent = btnState.preset.text;
                                }

                                const globalButtonStyles = this.homeMaster.editorConfig?.interactionPresets?.cardFocusMode?.emergingButtons?.buttonStyles;
                                if (globalButtonStyles) Object.assign(buttonEl.style, globalButtonStyles);
                                if (btnState.preset.stylePreset) buttonEl.classList.add(btnState.preset.stylePreset); // CSS class based
                                if (btnState.preset.styles) Object.assign(buttonEl.style, btnState.preset.styles); // Inline override
                                if (btnState.preset.position) Object.assign(buttonEl.style, btnState.preset.position);


                                buttonEl.addEventListener('click', (e) => {
                                    e.stopPropagation(); // Prevent click from bubbling to card/visualizer
                                    this.notifyFocusModeButtonAction(btnState.preset.action, btnState.cardId, btnState.preset.id);
                                });
                            }

                            if (buttonEl) { // Update existing or newly created button
                                const opac = btnState.animation?.opacity?.current !== undefined ? btnState.animation.opacity.current.toFixed(3) : (btnState.isVisible ? '1' : '0');
                                buttonEl.style.opacity = opac;
                                buttonEl.style.display = (btnState.isVisible && parseFloat(opac) > 0.01) ? (this.homeMaster.editorConfig?.interactionPresets?.cardFocusMode?.emergingButtons?.containerStyles?.display || 'inline-block') : 'none';

                                // Handle other animated properties if any, e.g., transform for slide-in
                                if(btnState.animation?.transform) {
                                    buttonEl.style.transform = btnState.animation.transform.current; // Assuming current is a valid CSS transform string
                                }
                            }
                        }
                    });
                }
            } else if (focusedCardId === null && document.getElementById(`${ms.lastFocusedCardId}-buttons-container`)) {
                // If focus ended, ensure previous card's button container is cleared/hidden.
                // This requires storing lastFocusedCardId or iterating all potential button containers.
                // Simpler: if buttonsContainer for a card exists but that card is not focused, clear it.
                allCards.forEach(card => {
                    const btnContainer = document.getElementById(`${card.id}-buttons-container`);
                    if (btnContainer && card.id !== focusedCardId) btnContainer.innerHTML = '';
                });

            }
            // --- END CARD FOCUS MODE SYNCHRONIZATION ---

            requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
        // console.log('🔄 UnifiedReactivityBridge update loop started - Multi-layer synchronization active'); // Already logged
    }

    notifyFocusModeButtonAction(action, cardId, buttonId) {
        if (this.homeMaster && this.homeMaster.handleFocusModeButtonAction) {
            this.homeMaster.handleFocusModeButtonAction({ action, cardId, buttonId });
        }
    }

    // Redefined getWebGLParameters to source from HomeMaster
    // Now accepts vizInfo = { id, role } to provide context for the specific visualizer
    getWebGLParameters(vizInfo = {}) {
        if (!this.homeMaster || !this.homeMaster.masterState) {
            console.warn("Bridge: HomeMaster not available for getWebGLParameters");
            return {};
        }

        const ms = this.homeMaster.masterState;
        const currentSectionKey = ms.activeSection;
        const sectionParams = this.homeMaster.getParametersForSection(currentSectionKey) || {};

        // Consolidate all relevant parameters for visualizers
        const paramsForVisualizers = {
            // From masterState directly (or editorOverrides if they exist)
            intensity: this.homeMaster.masterState.editorOverrides.intensity !== undefined ? this.homeMaster.masterState.editorOverrides.intensity : sectionParams.intensity, // Prioritize editor override for global intensity
            speed: this.homeMaster.masterState.editorOverrides.speed !== undefined ? this.homeMaster.masterState.editorOverrides.speed : sectionParams.speed,
            density: this.homeMaster.masterState.editorOverrides.density !== undefined ? (this.homeMaster.masterState.editorOverrides.density / 3.0) : sectionParams.density, // Normalize editor's 1-5 scale

            // Section-specific params (already incorporate masterState by getParametersForSection)
            baseColor: sectionParams.baseColor,
            geometry: sectionParams.geometry, // The numeric ID
            geometryThemeName: sectionParams.geometryThemeName, // The string name for setTheme
            dimension: sectionParams.dimension,
            morphFactor: sectionParams.complexity, // Assuming complexity maps to morphFactor

            // Interaction-driven states from masterState
            chaosIntensity: ms.scrollChaos, // General chaos from scroll
            gridVibrance: ms.editorOverrides.colorVibrancy || 1.0, // Example, map colorVibrancy to gridVibrance
            sectionFocus: ms.activeHoverVisualizerId !== undefined ? 1.0 : 0.0, // Example: if a visualizer is hovered
            portalIntensity: ms.isPortalling || ms.currentDragTension, // Example: combine effects
            microChaos: ms.currentDragTension * 0.5, // Example: derive from drag tension
            inverseFlow: (ms.currentDragTension > 0.5) ? 0.3 : 0.0, // Example

            // Content guidance - these should ideally be managed by HomeMaster too
            // For now, if they are still CSS variables, they might be missed here.
            // Let's assume HomeMaster will have them if they are to be reactive.
            contentGravityX: ms.contentGravityTarget?.x || 0.5,
            contentGravityY: ms.contentGravityTarget?.y || 0.5,
            contentFlowStrength: ms.contentGravityActive ? 0.8 : 0.0, // Example
            textProximity: ms.focusedTextElement ? 1.0 : 0.0, // Example

            // Pass through any other relevant masterState properties or editorOverrides
            ...ms.editorOverrides, // e.g., colorVibrancy

            // Add visualizer-specific interaction states
            isCurrentlyHovered: (ms.hoveredVisualizerInfo?.id === vizInfo.id),
            normalizedMouseXOnViz: (ms.hoveredVisualizerInfo?.id === vizInfo.id) ? ms.hoveredVisualizerInfo.x : 0.5, // Default to center if not hovered
            normalizedMouseYOnViz: (ms.hoveredVisualizerInfo?.id === vizInfo.id) ? ms.hoveredVisualizerInfo.y : 0.5,

            // Example for click state - might be a momentary trigger rather than a persistent param
            // isCurrentlyClicked: (ms.clickedVisualizerInfo?.id === vizInfo.id && ms.clickedVisualizerInfo?.eventType === 'mousedown'), // if tracking press
        };

        // Add animated parameters from visualizerParameterTargets
        const vizTargets = ms.visualizerParameterTargets?.[vizInfo.id];
        if (vizTargets) {
            for (const paramName in vizTargets) {
                if (vizTargets[paramName] && vizTargets[paramName].hasOwnProperty('current')) {
                    paramsForVisualizers[paramName] = vizTargets[paramName].current;
                } else {
                     // If only target is set but no animation state, pass target, or default.
                     // This case should ideally be handled by HomeMaster initializing .current
                    paramsForVisualizers[paramName] = vizTargets[paramName].target !== undefined ? vizTargets[paramName].target : 1.0; // Default e.g. for multipliers
                }
            }
        } else {
            // Default values for parameters if no specific targets (e.g., for densityMultiplier)
            if (paramsForVisualizers.densityMultiplier === undefined) { // Check if not already set by a global override
                 paramsForVisualizers.densityMultiplier = 1.0; // Default if no animation target
            }
        }

        // Clean up undefined properties - this loop is fine as a general safeguard
        for (const key in paramsForVisualizers) {
            if (paramsForVisualizers[key] === undefined) {
                // console.warn(`WebGL param ${key} for visualizer ${vizInfo.id} is undefined. Check HomeMaster state or getParametersForSection.`);
                // Setting a sensible default or removing might be better depending on shader robustness
                // For example, if a shader expects a number, undefined could break it.
                // delete paramsForVisualizers[key]; // Or assign a default like 0 or false
            }
        }
        // if(vizInfo.id) console.log(`Bridge: getWebGLParameters for ${vizInfo.id}:`, paramsForVisualizers.isCurrentlyHovered);
        return paramsForVisualizers;
    }

    // syncAllLayers will now use the new getWebGLParameters, passing vizInfo
     syncAllLayers() {
        // Update all CSS custom properties
        Object.entries(this.cssProperties).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });

        this.visualizers.forEach(viz => {
            if (!viz) return;

            // Prepare vizInfo - Ensure viz has an instanceId or a unique role identifier
            const vizId = viz.instanceId || viz.role; // Fallback to role if instanceId isn't set
            if (!vizId) {
                console.warn("Visualizer missing instanceId and role, cannot tailor parameters.", viz);
            }
            const vizInfo = { id: vizId, role: viz.role };
            const webGLParams = this.getWebGLParameters(vizInfo); // Pass context

            if (viz.updateParameters) {
                viz.updateParameters(webGLParams);
            }
        });

        console.log('🔄 All visual layers synchronized using HomeMaster state (with per-visualizer context).');
    }
}

export default UnifiedReactivityBridge;