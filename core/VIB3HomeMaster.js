/**
 * VIB3HomeMaster.js - The Single Source of Truth
 * 
 * Implements the "Foundational Trinity" principle: Home-Master Controls Everything
 * This is the central authority that drives all 13 visualizers in the NEOSKEUOMORPHIC_HOLOGRAPHIC_UI
 * through fixed modifiers, ensuring deep visual coherence across the entire system.
 * 
 * Architecture: Master State → Section Parameters → Role-Specific Instance Parameters
 */

class VIB3HomeMaster {
    constructor() {
        console.log('🏠 VIB3HomeMaster - Single Source of Truth Initializing...');
        
        // Initialize context manager for bulletproof state preservation
        this.contextManager = null;
        this.initializeContextManager();
        
        // Configuration system integration
        this.editorConfig = null;
        this.loadEditorConfiguration();
        
        // Master State - The single source of truth for all visual parameters
        this.masterState = {
            intensity: 0.8,        // Global energy level (0.0 - 1.0)
            speed: 1.0,           // Global animation speed multiplier
            density: 1.0,         // Global grid density multiplier  
            dimension: 3.5,       // 4D projection dimension (3.0 - 4.0)
            complexity: 0.5,      // Morphing and chaos intensity
            coherence: 1.0,       // System-wide visual unity factor
            
            // Interactive state
            mouseIntensity: 0.0,
            clickPulse: 0.0,
            scrollChaos: 0.0,
            
            // Current section context
            activeSection: 0,     // 0=home, 1=tech, 2=media, 3=audio, 4=quantum
            transitionProgress: 1.0,
            
            // Editor configuration state
            editorOverrides: {},

            // Navigation interaction states
            currentDragTension: 0.0, // Tension for cube drag (0-1)
            isPortalling: 0.0, // Flag/intensity for portal transition effect
            navigationEffectTimers: {}, // To handle timed effects

            // Universal Scroll System State
            scrollableElementsState: {}, // Keyed by element ID
                                         // Each entry: { offsetX, offsetY, isDragging, snapBackTargetX, snapBackTargetY, snapBackStartTime, momentumVelocityX, momentumVelocityY, profileName, contentDimensionX, contentDimensionY, viewportDimensionX, viewportDimensionY, lastRawX, lastRawY, startX, startY, initialOffsetX, initialOffsetY, currentVelocityX, currentVelocityY, lastMoveTime }
            activeDragScrollElementId: null,

            // Visualizer-specific interaction states
            hoveredVisualizerInfo: null, // { id, role, x, y, clientX, clientY }
            clickedVisualizerInfo: null,  // { id, role, x, y, button, eventType, timestamp }, potentially timed/cleared

            // State for managing ecosystem effects on individual visualizers
            visualizerParameterTargets: {}, // e.g., { vizId1: { densityMultiplier: { target: 0.5, current:1.0, startTime:0, duration:300, easing:'ease-out' } }, ... }
            activeClickAnimation: null,    // e.g., { visualizerId: string, phaseIndex: number, phaseStartTime: number, clickPreset: object }

            activeVisualizers: {}, // Stores { vizId: { role: 'card', /* other static info if needed */ } }

            // States for card-specific hover effects (DOM and Visualizer)
            // cardDomEffects will store animation targets for CSS properties of the .blog-card elements
            cardDomEffects: {}, // { cardId: { scale: {current, target,...}, opacity:{...}, borderColor:{...}, etc. } }
            // cardVisualizerEffects was conceptual; specific viz params like opacity go into visualizerParameterTargets
            // boardVisualizerEffect was conceptual; board opacity goes into visualizerParameterTargets['board-viz-id']

            contentGravityState: {
                isActive: false,
                targetX: 0.5, targetY: 0.5, // Default center
                strength: 0.0, // Current animated strength
                targetStrength: 0.0, // Target strength for animation
                animation: null // { startTime, duration, easing }
            },

            // Card Focus Mode State
            focusedCardId: null,
            cardFocusData: {}, // Stores original styles and animation states for cards during focus mode
                               // cardId: { originalStyle: {}, isFocused, isObserver, animation: {} }
            focusModeAnimation: { // Primary animation targets for focus mode transitions
                targetCard: null, // { from:{}, current:{}, target:{}, startTime, duration, easing, onComplete }
                observerCardsEffect: null, // { from:{}, current:{}, target:{}, startTime, duration, easing }
                pageOverlay: null, // { fromOpacity, currentOpacity, targetOpacity, backgroundColor, startTime, duration, easing }
            },
            emergingButtonsStates: {}, // Keyed by buttonId: { cardId, preset, isVisible, animation: {} },

            // Global Mouse Effects State
            globalMouseX: 0.5, // Normalized X (0 left, 1 right), window-relative
            globalMouseY: 0.5, // Normalized Y (0 top, 1 bottom), window-relative
            lastGlobalMouseActivityTime: 0, // Timestamp of the last mouse move event
            globalMouseEffectsState: {}, // Stores current animated values for global effects
                                         // e.g., { effectId: { paramName: { current, target, baseValue, smoothingFactor }, ... } }
            globalMouseIdleTimeout: 2000, // ms before global mouse effects start reverting

            // Card Content Expansion State (within Focus Mode)
            expandedCardContent: null, // Stores the cardId if its content is expanded, else null
            cardInternalAnimations: {},  // Stores animation states for elements within the focused card
                                         // Structure: { cardId: { selector: { currentOpacity, targetOpacity, etc... } } }
        };
        
        // Section Modifiers - Relational mathematical relationships (configurable)
        // Each section's parameters = masterState × sectionModifier
        this.sectionModifiers = {
            0: { // HOME - Hypercube Foundation
                intensityMod: 1.0, speedMod: 1.0, densityMod: 1.0, complexityMod: 1.0,
                geometry: 0.0, geometryThemeName: 'hypercube',
                baseColor: [1.0, 0.0, 1.0], name: 'HOME'
            },
            1: { // TECH - Tetrahedron Precision  
                intensityMod: 0.8, speedMod: 0.6, densityMod: 0.7, complexityMod: 0.4,
                geometry: 1.0, geometryThemeName: 'tetrahedron',
                baseColor: [0.0, 1.0, 1.0], name: 'TECH'
            },
            2: { // MEDIA - Sphere Potential (Note: Research/Wave uses faceIndex 2 in DualNav, section 4 in HomeMaster)
                 // For now, let's assume direct mapping of section index to these themes for simplicity here.
                 // DualNav's targetFaceIndex will map to these sectionKeys.
                intensityMod: 1.3, speedMod: 1.4, densityMod: 1.2, complexityMod: 1.1,
                geometry: 2.0, geometryThemeName: 'sphere',
                baseColor: [1.0, 1.0, 0.0], name: 'MEDIA'
            },
            3: { // AUDIO - Torus Flow
                intensityMod: 0.9, speedMod: 1.1, densityMod: 0.8, complexityMod: 0.9,
                geometry: 3.0, geometryThemeName: 'torus',
                baseColor: [0.0, 1.0, 0.0], name: 'AUDIO'
            },
            4: { // QUANTUM - Wave Nexus (Corresponds to Research, faceIndex 2)
                intensityMod: 1.5, speedMod: 1.2, densityMod: 1.4, complexityMod: 1.3,
                geometry: 6.0, geometryThemeName: 'wave',
                baseColor: [1.0, 0.0, 0.5], name: 'QUANTUM'
            },
            // It seems DualNavigationSystem uses faceIndex 5 for CONTEXT (Crystal)
            // HomeMaster needs a section for this if it's a primary navigable target.
            // visual-styles.json maps "mandelbulb" to 7.0, but "crystal" is not explicitly ID'd there.
            // ReactiveHyperAVCore.themeConfigs has 'crystal' with geometry: 7.0
            // Let's add a section 5 for CONTEXT/Crystal.
            5: { // CONTEXT - Crystal Lattice (Corresponds to faceIndex 5)
                intensityMod: 0.9, speedMod: 0.7, densityMod: 1.1, complexityMod: 0.6,
                geometry: 7.0, geometryThemeName: 'crystal', // Assuming 7.0 is Crystal ID
                baseColor: [0.0, 0.7, 1.0], name: 'CONTEXT' // Example color
            },
            6: { // INNOVATION - Fractal Emergence (Corresponds to faceIndex 4)
                intensityMod: 1.2, speedMod: 1.3, densityMod: 1.3, complexityMod: 1.4,
                geometry: 8.0, geometryThemeName: 'fractal',
                baseColor: [0.8, 0.3, 0.9], name: 'INNOVATION'
            },
            7: { // SYNTHESIS - Klein Bottle (Corresponds to faceIndex 6)
                intensityMod: 1.1, speedMod: 0.9, densityMod: 1.0, complexityMod: 1.2,
                geometry: 5.0, geometryThemeName: 'klein',
                baseColor: [0.9, 0.6, 0.2], name: 'SYNTHESIS'
            }
            // Note: DualNavigationSystem also refers to faceIndex 4 (Innovation/Fractal)
            // and potentially 6 (Klein), 7 (Torus, different from Audio's Torus unless IDs are shared)
            // This mapping between DualNav faceIndex and HomeMaster sectionKey needs to be robust.
            // For now, this covers the primary targets from navigation-config.json:
            // HOME (0->0), TECH (1->1), RESEARCH (2->4, Wave), CONTEXT (5->5, Crystal)
        };
        
        // Ensure all section keys used by DualNavigationSystem exist here.
        // DualNav uses faceIndices: 0 (Home), 1 (Tech), 2 (Research), 5 (Context).
        // Mapping: DualNav FaceIndex -> HomeMaster Section Key
        // 0 -> 0 (Home/Hypercube)
        // 1 -> 1 (Tech/Tetrahedron)
        // 2 -> 4 (Research/Wave) - Section 4 in HomeMaster is Quantum/Wave
        // 5 -> 5 (Context/Crystal) - Added Section 5 in HomeMaster for Crystal

        // The `geometryThemeName` should align with keys in `ReactiveHyperAVCore.themeConfigs`

        // Instance Role Modifiers - Applied after section calculation
        // These create the multi-layer depth system found in NEOSKEUOMORPHIC_HOLOGRAPHIC_UI
        this.instanceRoles = {
            'background': {
                gridScale: 0.4,
                morphScale: 0.2,
                rotationScale: 0.3,
                dimensionBoost: -0.2,
                interactionSensitivity: 0.3,
                color: 'base'
            },
            'shadow': {
                gridScale: 0.8,
                morphScale: 0.3,
                rotationScale: 0.5,
                dimensionBoost: -0.1,
                interactionSensitivity: 0.5,
                color: 'darken'
            },
            'content': {
                gridScale: 1.0,
                morphScale: 1.0,
                rotationScale: 1.0,
                dimensionBoost: 0.0,
                interactionSensitivity: 1.0,
                color: 'base'
            },
            'highlight': {
                gridScale: 1.5,
                morphScale: 0.8,
                rotationScale: 1.2,
                dimensionBoost: 0.1,
                interactionSensitivity: 1.2,
                color: 'brighten'
            },
            'accent': {
                gridScale: 0.6,
                morphScale: 0.4,
                rotationScale: 0.4,
                dimensionBoost: 0.2,
                interactionSensitivity: 1.5,
                color: 'complement'
            },
            'board': {
                gridScale: 0.3,
                morphScale: 0.1,
                rotationScale: 0.2,
                dimensionBoost: -0.3,
                interactionSensitivity: 0.2,
                color: 'base',
                opacity: 0.8,
                zOffset: -0.5
            },
            'bezel': {
                gridScale: 0.5,
                morphScale: 0.15,
                rotationScale: 0.25,
                dimensionBoost: -0.15,
                interactionSensitivity: 0.4,
                color: 'darken',
                opacity: 0.9,
                zOffset: -0.25
            },
            'frame': {
                gridScale: 0.7,
                morphScale: 0.2,
                rotationScale: 0.3,
                dimensionBoost: -0.05,
                interactionSensitivity: 0.6,
                color: 'base',
                opacity: 0.95,
                zOffset: -0.1
            },
            'glow': {
                gridScale: 1.8,
                morphScale: 0.6,
                rotationScale: 0.8,
                dimensionBoost: 0.3,
                interactionSensitivity: 2.0,
                color: 'brighten',
                opacity: 0.3,
                zOffset: 0.2
            },
            'particle': {
                gridScale: 2.0,
                morphScale: 1.5,
                rotationScale: 1.8,
                dimensionBoost: 0.4,
                interactionSensitivity: 2.5,
                color: 'complement',
                opacity: 0.2,
                zOffset: 0.3
            },
            'card': {
                gridScale: 1.2,
                morphScale: 0.9,
                rotationScale: 1.1,
                dimensionBoost: 0.05,
                interactionSensitivity: 1.3,
                color: 'base',
                opacity: 1.0,
                zOffset: 0.0
            }
        };
        
        // Interaction decay rates
        this.decayRates = {
            mouseIntensity: 0.95,
            clickPulse: 0.92,
            scrollChaos: 0.96
        };
        
        // Performance monitoring
        this.lastUpdateTime = performance.now();
        this.updateInterval = 16; // ~60fps
        
        this.startUpdateLoop();
    }
    
    /**
     * Load editor dashboard configuration
     */
    async loadEditorConfiguration() {
        try {
            // Load main editor dashboard config
            const editorDashResponse = await fetch('./presets/editor-dashboard-config.json');
            if (!editorDashResponse.ok) throw new Error(`Failed to load editor-dashboard-config.json: ${editorDashResponse.statusText}`);
            this.editorConfig = await editorDashResponse.json();
            console.log('📊 Editor dashboard configuration loaded:', this.editorConfig.editorDashboard?.version || 'unknown version');

            // Load navigation config
            try {
                const navConfigResponse = await fetch('./presets/navigation-config.json');
                if (!navConfigResponse.ok) throw new Error(`Failed to load navigation-config.json: ${navConfigResponse.statusText}`);
                const navigationConfig = await navConfigResponse.json();
                this.editorConfig.navigationConfig = navigationConfig; // Store it within editorConfig
                console.log('🧭 Navigation configuration loaded successfully.');
            } catch (navError) {
                console.warn(`⚠️ Navigation configuration not found or failed to load: ${navError.message}. Navigation will use defaults.`);
                if (!this.editorConfig.navigationConfig) { // ensure structure exists
                    this.editorConfig.navigationConfig = { navigationParameters: {}, edgeMappings: {} };
                }
            }

            // Load scroll physics presets
            try {
                const scrollPhysicsResponse = await fetch('./presets/scroll-physics-presets.json');
                if (!scrollPhysicsResponse.ok) throw new Error(`Failed to load scroll-physics-presets.json: ${scrollPhysicsResponse.statusText}`);
                this.editorConfig.scrollPhysicsPresets = await scrollPhysicsResponse.json();
                console.log('📜 Scroll physics presets loaded successfully.');
            } catch (scrollError) {
                console.warn(`⚠️ Scroll physics presets not found or failed to load: ${scrollError.message}. Scroll system may use hardcoded defaults or fail.`);
                if(!this.editorConfig.scrollPhysicsPresets) { // ensure structure exists
                    this.editorConfig.scrollPhysicsPresets = { defaultProfile: {}, profiles: {} };
                }
            }
            
            // Apply master controls from config
            this.applyEditorMasterControls();

            // Make UnifiedReactivityBridge aware of new navigation CSS properties
            this.propagateNavigationConfigToBridge();

        } catch (error) {
            console.warn(`⚠️ Core editor configuration error: ${error.message}. Using defaults.`);
            // Ensure the editorConfig object and its nested properties are initialized even if loading fails
            if (!this.editorConfig) this.editorConfig = {};
            if (!this.editorConfig.editorDashboard) this.editorConfig.editorDashboard = { masterControls: {}, pageRelations: {} };
            if (!this.editorConfig.navigationConfig) this.editorConfig.navigationConfig = { navigationParameters: {}, edgeMappings: {} };
            if (!this.editorConfig.scrollPhysicsPresets) this.editorConfig.scrollPhysicsPresets = { defaultProfile: {}, profiles: {} };
        }
    }
    
    /**
     * Apply editor master control defaults
     */
    applyEditorMasterControls() {
        const masterControls = this.editorConfig?.editorDashboard?.masterControls;
        if (!masterControls) return;
        
        if (masterControls.visualIntensity) {
            this.masterState.intensity = masterControls.visualIntensity.default;
        }
        if (masterControls.animationSpeed) {
            this.masterState.speed = masterControls.animationSpeed.default;
        }
        if (masterControls.gridComplexity) {
            this.masterState.density = masterControls.gridComplexity.default / 3.0; // Normalize
        }
        
        console.log('🎛️ Master controls applied from editor config');
    }
    
    /**
     * Update parameter from editor dashboard
     */
    updateFromEditor(parameter, value) {
        console.log(`🎛️ Editor update: ${parameter} = ${value}`);
        
        switch(parameter) {
            case 'visualIntensity':
                this.masterState.intensity = value;
                this.masterState.editorOverrides.intensity = value;
                break;
            case 'animationSpeed':
                this.masterState.speed = value;
                this.masterState.editorOverrides.speed = value;
                break;
            case 'gridComplexity':
                this.masterState.density = value / 3.0; // Normalize from 1-5 to 0.33-1.67
                this.masterState.editorOverrides.density = value;
                break;
            case 'colorVibrancy':
                this.masterState.editorOverrides.colorVibrancy = value;
                break;
        }
        
        // Trigger immediate parameter sync
        if (window.vib3Bridge) {
            window.vib3Bridge.syncAllLayers();
        }
    }
    
    /**
     * Get the derived parameters for a specific section with editor configuration
     * This implements both "Home-Master Controls Everything" and relational modifiers
     */
    getParametersForSection(sectionKey) {
        const modifier = this.sectionModifiers[sectionKey];
        if (!modifier) {
            console.warn(`[VIB3HomeMaster] Unknown section: ${sectionKey}`);
            return this.getParametersForSection(0); // Default to HOME
        }
        
        // Check context manager for cached parameters first
        if (this.contextManager) {
            const cachedParams = this.contextManager.getCachedParameters(
                this.masterState.activeSection, sectionKey, 'section'
            );
            if (cachedParams) {
                return cachedParams;
            }
        }
        
        // Get page relation config from editor
        const pageRelation = this.editorConfig?.editorDashboard?.pageRelations?.[this.getSectionName(sectionKey)];
        
        // Calculate final modifiers (config overrides defaults)
        const finalIntensityMod = pageRelation?.modifiers?.intensityModifier || modifier.intensityMod;
        const finalSpeedMod = pageRelation?.modifiers?.speedModifier || modifier.speedMod;
        const finalGridMod = pageRelation?.modifiers?.gridModifier || modifier.densityMod;
        const finalComplexityMod = pageRelation?.modifiers?.complexityModifier || modifier.complexityMod;
        
        // Apply section modifiers to master state
        const baseParams = {
            geometry: modifier.geometry,
            intensity: this.masterState.intensity * finalIntensityMod,
            speed: this.masterState.speed * finalSpeedMod,
            density: this.masterState.density * finalGridMod,
            dimension: this.masterState.dimension,
            complexity: this.masterState.complexity * finalComplexityMod,
            baseColor: pageRelation?.colorBase || modifier.baseColor,
            
            // Interactive parameters (applied globally)
            mouseIntensity: this.masterState.mouseIntensity,
            clickPulse: this.masterState.clickPulse,
            scrollChaos: this.masterState.scrollChaos,
            
            // Coherence factor ensures system-wide unity
            coherence: this.masterState.coherence
        };
        
        // Apply editor overrides
        if (this.masterState.editorOverrides.colorVibrancy) {
            baseParams.colorVibrancy = this.masterState.editorOverrides.colorVibrancy;
        }
        
        // Cache the calculated parameters for future use
        if (this.contextManager) {
            this.contextManager.cacheParameters(
                this.masterState.activeSection, sectionKey, 'section', baseParams
            );
        }
        
        return baseParams;
    }
    
    /**
     * Get section name from key for editor config lookup
     * Updated to support all 8 hypercube faces
     */
    getSectionName(sectionKey) {
        const sectionNames = [
            'home',      // 0: HOME - Hypercube Foundation
            'tech',      // 1: TECH - Tetrahedron Precision
            'media',     // 2: MEDIA - Sphere Potential
            'audio',     // 3: AUDIO - Torus Flow
            'quantum',   // 4: QUANTUM - Wave Nexus
            'context',   // 5: CONTEXT - Crystal Lattice
            'innovation',// 6: INNOVATION - Fractal Emergence
            'synthesis'  // 7: SYNTHESIS - Klein Bottle
        ];
        return sectionNames[sectionKey] || 'home';
    }
    
    /**
     * Get final parameters for a specific visualizer instance
     * Applies role-based modifiers to section parameters
     */
    getInstanceParameters(sectionKey, role) {
        const sectionParams = this.getParametersForSection(sectionKey);
        const roleConfig = this.instanceRoles[role];
        
        if (!roleConfig) {
            console.warn(`[VIB3HomeMaster] Unknown role: ${role}`);
            return sectionParams;
        }
        
        // Check context manager for cached instance parameters
        if (this.contextManager) {
            const cachedParams = this.contextManager.getCachedParameters(
                this.masterState.activeSection, sectionKey, role
            );
            if (cachedParams) {
                return cachedParams;
            }
        }
        
        // Apply role-specific modifiers
        const finalParams = {
            geometry: sectionParams.geometry,
            gridDensity: sectionParams.density * roleConfig.gridScale,
            rotationSpeed: sectionParams.speed * roleConfig.rotationScale,
            morphFactor: sectionParams.complexity * roleConfig.morphScale,
            dimension: sectionParams.dimension + roleConfig.dimensionBoost,
            intensity: sectionParams.intensity,
            
            // Role-specific visual properties
            opacity: roleConfig.opacity || 1.0,
            zOffset: roleConfig.zOffset || 0.0,
            
            // Color modifications based on role
            baseColor: this.applyColorModification(sectionParams.baseColor, roleConfig.color),
            
            // Interactive responsiveness
            mouseIntensity: sectionParams.mouseIntensity * roleConfig.interactionSensitivity,
            clickPulse: sectionParams.clickPulse * roleConfig.interactionSensitivity,
            scrollChaos: sectionParams.scrollChaos * roleConfig.interactionSensitivity,
            
            // System coherence
            coherence: sectionParams.coherence
        };
        
        // Cache the calculated instance parameters for future use
        if (this.contextManager) {
            this.contextManager.cacheParameters(
                this.masterState.activeSection, sectionKey, role, finalParams
            );
        }
        
        return finalParams;
    }
    
    /**
     * Initialize context manager for bulletproof state preservation
     */
    async initializeContextManager() {
        try {
            // Import context manager if not already available
            if (typeof VIB34DContextManager === 'undefined') {
                console.log('📦 Loading VIB34DContextManager...');
                // In a real implementation, you might dynamically import here
                await this.loadContextManager();
            }
            
            this.contextManager = new VIB34DContextManager();
            
            // Set up context preservation events
            this.setupContextPreservation();
            
            console.log('✅ Context Manager initialized successfully');
            
        } catch (error) {
            console.warn('⚠️ Failed to initialize Context Manager:', error);
            this.contextManager = null;
        }
    }
    
    /**
     * Load context manager dynamically (fallback)
     */
    async loadContextManager() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = './core/VIB34DContextManager.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Set up context preservation event listeners
     */
    setupContextPreservation() {
        if (!this.contextManager) return;
        
        // Listen for section changes in transitionToSection
        const originalTransitionToSection = this.transitionToSection.bind(this);
        this.transitionToSection = (newSection) => {
            const oldSection = this.masterState.activeSection;
            const result = originalTransitionToSection(newSection);
            
            // Notify context manager of section transition
            if (oldSection !== newSection) {
                this.contextManager.handleFaceTransition({
                    fromFace: oldSection,
                    toFace: newSection,
                    transitionType: 'section_change',
                    preserveContext: true
                });
            }
            
            return result;
        };
        
        // Listen for parameter changes
        const originalSetParameter = this.setParameter.bind(this);
        this.setParameter = (parameterId, value) => {
            const oldValue = this.getParameterValue(parameterId);
            const result = originalSetParameter(parameterId, value);
            
            // Notify context manager of parameter change
            this.contextManager.handleParameterChange({
                parameterId,
                oldValue,
                newValue: value,
                source: 'manual',
                timestamp: Date.now()
            });
            
            return result;
        };
    }
    
    /**
     * Get current parameter value for context tracking
     */
    getParameterValue(parameterId) {
        switch (parameterId) {
            case 'intensity': return this.masterState.intensity;
            case 'speed': return this.masterState.speed;
            case 'density': return this.masterState.density;
            case 'dimension': return this.masterState.dimension;
            case 'complexity': return this.masterState.complexity;
            case 'coherence': return this.masterState.coherence;
            default: return null;
        }
    }
    
    /**
     * Enable context manager debug mode
     */
    enableContextDebug(enabled = true) {
        if (this.contextManager) {
            this.contextManager.setDebugMode(enabled);
        }
    }
    
    /**
     * Get context manager metrics
     */
    getContextMetrics() {
        return this.contextManager ? this.contextManager.getMetrics() : null;
    }
    
    /**
     * Force save current state
     */
    saveCurrentState() {
        if (this.contextManager) {
            this.contextManager.saveCurrentState();
        }
    }
    
    /**
     * Clear all context cache
     */
    clearContextCache() {
        if (this.contextManager) {
            this.contextManager.clearCache();
        }
    }
    
    /**
     * Apply color modifications based on role
     */
    applyColorModification(baseColor, colorMod) {
        switch(colorMod) {
            case 'darken':
                return baseColor.map(c => c * 0.7);
            case 'brighten':
                return baseColor.map(c => Math.min(1.0, c * 1.3));
            case 'complement':
                // Simple complement calculation
                return [1.0 - baseColor[0], 1.0 - baseColor[1], 1.0 - baseColor[2]];
            case 'base':
            default:
                return [...baseColor];
        }
    }
    
    /**
     * Update master state based on user interactions
     */
    updateInteraction(type, data) {
        switch(type) {
            case 'mouse': // This case is for global mouse data
                this.masterState.mouseIntensity = Math.min(1.0, data.intensity); // Overall activity intensity
                this.masterState.globalMouseX = data.x; // Normalized X (0-1, left to right)
                this.masterState.globalMouseY = data.y; // Normalized Y (0-1, top to bottom by Bridge, but often shaders expect 0 bottom, 1 top)
                                                        // Let's assume data.y is 0 top, 1 bottom from Bridge for consistency here.
                this.masterState.lastGlobalMouseActivityTime = performance.now();
                this._updateGlobalMouseEffectTargets();
                break;
                
            case 'click':
                this.masterState.clickPulse = Math.min(1.0, this.masterState.clickPulse + 0.8);
                break;
                
            case 'scroll':
                this.masterState.scrollChaos = Math.min(1.0, Math.abs(data.chaos));
                // Scroll can also affect global intensity
                this.masterState.intensity = Math.min(1.0, 
                    this.masterState.intensity + Math.abs(data.velocity) * 0.1);
                break;
                
            case 'section':
                this.transitionToSection(data.section);
                break;
        }
    }
    
    /**
     * Transition to a new section with smooth interpolation and context preservation
     */
    transitionToSection(newSection) {
        if (newSection === this.masterState.activeSection) return;
        
        // Validate section exists (support for all 8 hypercube faces)
        if (!this.sectionModifiers[newSection]) {
            console.warn(`[VIB3HomeMaster] Invalid section: ${newSection}. Available sections: 0-7. Falling back to HOME.`);
            newSection = 0;
        }
        
        console.log(`🌀 VIB3HomeMaster transitioning: ${this.sectionModifiers[this.masterState.activeSection].name} → ${this.sectionModifiers[newSection].name}`);
        
        // Trigger preloading of adjacent faces if context manager is available
        if (this.contextManager) {
            this.contextManager.preloadAdjacentFaces(newSection);
        }
        
        this.masterState.activeSection = newSection;
        this.masterState.transitionProgress = 0.0;
        
        // Trigger coherence enhancement during transitions
        this.masterState.coherence = 1.5; // Temporarily boost system unity
        
        // Dispatch event for context manager and other systems
        window.dispatchEvent(new CustomEvent('vib34d:faceTransition', {
            detail: {
                fromFace: this.masterState.activeSection,
                toFace: newSection,
                transitionType: 'section_change',
                preserveContext: true
            }
        }));
    }
    
    /**
     * Main update loop - applies decay and manages transitions
     */
    startUpdateLoop() {
        const update = (currentTime) => {
            const deltaTime = currentTime - this.lastUpdateTime;
            
            if (deltaTime >= this.updateInterval) {
                // Apply decay to interactive parameters
                this.masterState.mouseIntensity *= this.decayRates.mouseIntensity;
                this.masterState.clickPulse *= this.decayRates.clickPulse;
                this.masterState.scrollChaos *= this.decayRates.scrollChaos;
                
                // Smooth transition progress
                if (this.masterState.transitionProgress < 1.0) {
                    this.masterState.transitionProgress = Math.min(1.0, 
                        this.masterState.transitionProgress + 0.02);
                }
                
                // Return coherence to baseline
                if (this.masterState.coherence > 1.0) {
                    this.masterState.coherence *= 0.98;
                }
                
                // Return intensity to baseline when no interaction
                if (this.masterState.mouseIntensity < 0.01 && 
                    this.masterState.clickPulse < 0.01 && 
                    this.masterState.scrollChaos < 0.01) {
                    this.masterState.intensity *= 0.99;
                    this.masterState.intensity = Math.max(0.3, this.masterState.intensity); // Minimum baseline
                }

                // Process scrollable elements for momentum and snap-back
                for (const elementId in this.masterState.scrollableElementsState) {
                    const state = this.masterState.scrollableElementsState[elementId];
                    if (!state) continue;

                    const profile = this.editorConfig.scrollPhysicsPresets?.profiles?.[state.profileName] ||
                                    this.editorConfig.scrollPhysicsPresets?.defaultProfile ||
                                    { sensitivity: {x:1,y:1}, dragThreshold: {value:5}, snapBack: {enabled:true, springTension:100, damping:15}, momentum: {enabled:true, friction:0.05, minVelocityToSustain:0.1}};

                    let needsSync = false;

                    // Momentum
                    if (profile.momentum?.enabled && (state.momentumVelocityX || state.momentumVelocityY)) {
                        const friction = profile.momentum.friction || 0.05;
                        state.offsetX += state.momentumVelocityX;
                        state.offsetY += state.momentumVelocityY;
                        state.momentumVelocityX *= (1 - friction);
                        state.momentumVelocityY *= (1 - friction);

                        if (Math.abs(state.momentumVelocityX) < (profile.momentum.minVelocityToSustain || 0.1)) state.momentumVelocityX = 0;
                        if (Math.abs(state.momentumVelocityY) < (profile.momentum.minVelocityToSustain || 0.1)) state.momentumVelocityY = 0;

                        needsSync = true;

                        if (state.momentumVelocityX === 0 && state.momentumVelocityY === 0 && profile.snapBack?.enabled && state.snapBackTargetX === null) {
                            state.snapBackTargetX = 0; // Snap to origin after momentum
                            state.snapBackTargetY = 0;
                            state.snapBackStartTime = currentTime;
                        }
                    }

                    // Snap-back
                    if (profile.snapBack?.enabled && state.snapBackTargetX !== null) {
                        const tension = profile.snapBack.springTension || 100;
                        const dampingRatio = profile.snapBack.damping || 15; // This is more like a damping coefficient, not ratio

                        const dx = state.snapBackTargetX - state.offsetX;
                        const dy = state.snapBackTargetY - state.offsetY;

                        // Simplified spring model (critical damping-like behavior)
                        // Adjust speed of snapback by a factor, e.g., 0.1 for slower, 0.3 for faster
                        const snapSpeedFactor = 0.15; // Make this configurable later if needed

                        state.offsetX += dx * snapSpeedFactor;
                        state.offsetY += dy * snapSpeedFactor;
                        needsSync = true;

                        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                            state.offsetX = state.snapBackTargetX;
                            state.offsetY = state.snapBackTargetY;
                            state.snapBackTargetX = null;
                            state.snapBackTargetY = null;
                            state.snapBackStartTime = 0;
                            console.log(`SnapBack complete for ${elementId}`);
                        }
                    }
                    // TODO: If needsSync and window.vib3Bridge, consider a targeted update for this element's scroll state
                    // For now, global syncAllLayers will pick it up, or rely on bridge's own update loop.
                }

                // Process visualizer parameter animations (e.g., for hover/click ecosystem effects)
                for (const vizId in this.masterState.visualizerParameterTargets) {
                    for (const paramName in this.masterState.visualizerParameterTargets[vizId]) {
                        const anim = this.masterState.visualizerParameterTargets[vizId][paramName];
                        if (anim && anim.startTime > 0) { // Animation is active
                            const elapsedTime = currentTime - anim.startTime;
                            let progress = Math.min(elapsedTime / anim.duration, 1.0);

                            let easedProgress = this._applyEasing(progress, anim.easing);

                            // For 'multiplyBase' operations, targetValue is the multiplier.
                            // Current value should interpolate from its start (e.g. 1.0 for multiplier) to target multiplier.
                            let startValue = (anim.operation === "multiplyBase" || paramName === 'densityMultiplier') ? 1.0 : (anim.initialValue !== undefined ? anim.initialValue : 0); // Assuming initialValue was stored or default to 0/1

                            // If we didn't store initialValue when setting target, we assume transition is from a 'neutral' state for multipliers (1.0)
                            // or from a zero-point for additive/set unless a 'current' was captured.
                            // The 'current' in anim object is meant to be the animated value.
                            if(anim.fromValue === undefined) anim.fromValue = anim.current; // Capture starting point of this animation segment


                            if (anim.operation === "multiplyBase" || anim.operation === "set" || anim.operation === "add") { // Treat add like set for interpolation target
                                anim.current = anim.fromValue + (anim.target - anim.fromValue) * easedProgress;
                            }
                            // Multiply operations might need different interpolation if 'value' is a factor e.g. current * (targetFactor - 1) * progress
                            // The current setup for multiplyBase in presets implies target is the final multiplier.

                            // console.log(`Animating ${vizId}.${paramName}: current=${anim.current.toFixed(2)}, progress=${easedProgress.toFixed(2)}`);

                            if (progress >= 1.0) {
                                anim.current = anim.target;
                                anim.startTime = 0; // Mark as complete
                                anim.fromValue = undefined; // Reset for next animation
                                // console.log(`Animation complete for ${vizId}.${paramName}`);
                            }
                        }
                    }
                }

                // Process active click animation phases
                if (this.masterState.activeClickAnimation) {
                    const animState = this.masterState.activeClickAnimation;
                    const phaseConfig = animState.clickPreset.phases[animState.phaseIndex];
                    if (phaseConfig && phaseConfig.animation) {
                        const elapsedTime = currentTime - animState.phaseStartTime;
                        if (elapsedTime >= (phaseConfig.animation.duration + (phaseConfig.animation.delay || 0))) {
                            animState.phaseIndex++;
                            if (animState.phaseIndex < animState.clickPreset.phases.length) {
                                this._applyClickAnimationPhase(animState);
                            } else {
                                this.masterState.activeClickAnimation = null;
                            }
                        }
                    }
                }

                // Process card DOM effect animations
                for (const cardId in this.masterState.cardDomEffects) {
                    for (const effectName in this.masterState.cardDomEffects[cardId]) {
                        const anim = this.masterState.cardDomEffects[cardId][effectName];
                        if (anim && anim.startTime > 0) {
                            const elapsedTime = currentTime - anim.startTime;
                            const progress = Math.min(elapsedTime / anim.duration, 1.0);
                            const easedProgress = this._applyEasing(progress, anim.easing);

                            anim.current = anim.fromValue + (anim.target - anim.fromValue) * easedProgress;

                            if (progress >= 1.0) {
                                anim.current = anim.target;
                                anim.startTime = 0; // Mark as complete
                                anim.fromValue = undefined;
                            }
                        }
                    }
                }

                // Process content gravity strength animation
                const gravityAnim = this.masterState.contentGravityState.animation;
                if (this.masterState.contentGravityState.isActive && gravityAnim && gravityAnim.startTime > 0) {
                    const elapsedTime = currentTime - gravityAnim.startTime;
                    const progress = Math.min(elapsedTime / gravityAnim.duration, 1.0);
                    const easedProgress = this._applyEasing(progress, gravityAnim.easing);

                    this.masterState.contentGravityState.strength = gravityAnim.fromStrength + (this.masterState.contentGravityState.targetStrength - gravityAnim.fromStrength) * easedProgress;

                    if (progress >= 1.0) {
                        this.masterState.contentGravityState.strength = this.masterState.contentGravityState.targetStrength;
                        this.masterState.contentGravityState.animation = null; // Clear animation
                    }
                } else if (!this.masterState.contentGravityState.isActive && this.masterState.contentGravityState.strength > 0 && gravityAnim && gravityAnim.startTime > 0) {
                     // Animating strength back to 0 if isActive becomes false
                    const elapsedTime = currentTime - gravityAnim.startTime;
                    const progress = Math.min(elapsedTime / gravityAnim.duration, 1.0);
                    const easedProgress = this._applyEasing(progress, gravityAnim.easing);

                    this.masterState.contentGravityState.strength = gravityAnim.fromStrength * (1.0 - easedProgress); //Decay from fromStrength to 0

                    if (progress >= 1.0) {
                        this.masterState.contentGravityState.strength = 0;
                        this.masterState.contentGravityState.animation = null;
                    }
                }

                const now = currentTime; // Consistent time for this frame's updates

                // Process Card Internal Animations (for content expansion)
                if (this.masterState.expandedCardContent && this.masterState.cardInternalAnimations[this.masterState.expandedCardContent]) {
                    const cardAnims = this.masterState.cardInternalAnimations[this.masterState.expandedCardContent];
                    for (const selector in cardAnims) {
                        const elementAnimState = cardAnims[selector];
                        for (const prop in elementAnimState) {
                            const anim = elementAnimState[prop];
                            if (anim && anim.startTime > 0) {
                                const elapsed = now - anim.startTime;
                                const progress = Math.min(elapsed / anim.duration, 1.0);
                                const easedProgress = this._applyEasing(progress, anim.easing);

                                if (typeof anim.target === 'number' && typeof anim.fromValue === 'number') {
                                    anim.current = anim.fromValue + (anim.target - anim.fromValue) * easedProgress;
                                } else { // For string values (like height: "0%", overflow: "hidden")
                                    anim.current = progress < 0.5 ? anim.fromValue : anim.target;
                                    if (progress >= 1.0) anim.current = anim.target;
                                }

                                if (progress >= 1.0) {
                                    anim.current = anim.target;
                                    anim.startTime = 0; // Mark as complete
                                }
                            }
                        }
                    }
                }

                // Process Global Mouse Effects animations
                const globalMouseConfig = this.editorConfig?.interactionPresets?.globalMouseEffects;
                if (globalMouseConfig?.enabled) {
                    // Check for mouse inactivity to revert effects
                    if (now - (this.masterState.lastGlobalMouseActivityTime || 0) > (this.masterState.globalMouseIdleTimeout || 2000)) {
                        this._revertGlobalMouseEffectTargets();
                    }

                    for (const effectId in this.masterState.globalMouseEffectsState) {
                        const effectState = this.masterState.globalMouseEffectsState[effectId];
                        for (const paramKey in effectState) { // e.g., translateX, viewAngleOffsetX_value
                            const paramAnim = effectState[paramKey];
                            if (paramAnim.target !== undefined && paramAnim.current !== paramAnim.target) {
                                paramAnim.current += (paramAnim.target - paramAnim.current) * paramAnim.smoothingFactor;
                                if (Math.abs(paramAnim.current - paramAnim.target) < 0.001) { // Threshold to snap
                                    paramAnim.current = paramAnim.target;
                                }

                                // If this global effect targets a visualizer parameter, update visualizerParameterTargets
                                // This assumes effectId might be complex like "effectPresetId_paramName" or similar,
                                // or we find the original effect preset to know its type and targetVisualizerId.
                                const originalEffectPreset = globalMouseConfig.effects.find(eff => eff.id === effectId);
                                if (originalEffectPreset?.type === 'visualizerParameter') {
                                    const vizParamPreset = originalEffectPreset.parameters.find(p => p.name === paramKey); // paramKey should be the actual viz param name
                                    if (vizParamPreset) {
                                         this._setVisualizerParameterTarget(
                                            originalEffectPreset.targetVisualizerId,
                                            paramKey, // This should be the actual parameter name like 'viewAngleOffsetX'
                                            paramAnim.current, // Target for this animation frame is the current smoothed value
                                            this.updateInterval, // Duration until next frame approx
                                            'linear', // Easing for this small step
                                            'set' // Operation
                                        );
                                        // Ensure the visualizerParameterTargets reflects the immediate 'current' value for bridge pickup
                                        if(this.masterState.visualizerParameterTargets[originalEffectPreset.targetVisualizerId] && this.masterState.visualizerParameterTargets[originalEffectPreset.targetVisualizerId][paramKey]){
                                            this.masterState.visualizerParameterTargets[originalEffectPreset.targetVisualizerId][paramKey].current = paramAnim.current;
                                            this.masterState.visualizerParameterTargets[originalEffectPreset.targetVisualizerId][paramKey].target = paramAnim.current; // Target this immediate value
                                            this.masterState.visualizerParameterTargets[originalEffectPreset.targetVisualizerId][paramKey].startTime = 0; // Mark as no further animation needed by this system
                                        }
                                    }
                                }
                            }
                        }
                    }
                }


                // Process Card Focus Mode Animations
                if (this.masterState.focusedCardId) {
                    const anims = this.masterState.focusModeAnimation;

                    // Target Card Animation
                    if (anims.targetCard && anims.targetCard.startTime > 0) {
                        const anim = anims.targetCard;
                        const elapsed = now - anim.startTime;
                        const progress = Math.min(elapsed / anim.duration, 1.0);
                        const easedProgress = this._applyEasing(progress, anim.easing);

                        for (const key in anim.target) {
                            if (anim.from[key] === undefined) {
                                anim.from[key] = this.masterState.cardDomEffects[this.masterState.focusedCardId]?.[key]?.current || this._getDefaultDomEffectValue(key, true);
                            }
                            const fromVal = anim.from[key];
                            const targetVal = anim.target[key];

                            if (typeof targetVal === 'number' && typeof fromVal === 'number') {
                                anim.current[key] = fromVal + (targetVal - fromVal) * easedProgress;
                            } else {
                                anim.current[key] = progress < 0.5 ? fromVal : targetVal;
                                if (progress === 1.0) anim.current[key] = targetVal;
                            }
                        }
                        if (progress >= 1.0) {
                            anim.current = { ...anim.target };
                            anim.startTime = 0;
                            if (anim.onComplete) anim.onComplete();
                        }
                    }

                    // Observer Cards Animation
                    if (anims.observerCardsEffect && anims.observerCardsEffect.startTime > 0) {
                        const anim = anims.observerCardsEffect;
                        const elapsed = now - anim.startTime;
                        const progress = Math.min(elapsed / anim.duration, 1.0);
                        const easedProgress = this._applyEasing(progress, anim.easing);

                        for (const key in anim.target) {
                             if (anim.from[key] === undefined) {
                                anim.from[key] = this._getDefaultDomEffectValue(key, false);
                            }
                            const fromVal = anim.from[key];
                            const targetVal = anim.target[key];

                            if (typeof targetVal === 'number' && typeof fromVal === 'number') {
                                 anim.current[key] = fromVal + (targetVal - fromVal) * easedProgress;
                            } else {
                                anim.current[key] = progress < 0.5 ? fromVal : targetVal;
                                 if (progress === 1.0) anim.current[key] = targetVal;
                            }
                        }
                        if (progress >= 1.0) {
                            anim.current = { ...anim.target };
                            anim.startTime = 0;
                            if (anim.onComplete) anim.onComplete();
                        }
                    }

                    // Page Overlay Animation
                    if (anims.pageOverlay && anims.pageOverlay.startTime > 0) {
                        const anim = anims.pageOverlay;
                        const elapsed = now - anim.startTime;
                        const progress = Math.min(elapsed / anim.duration, 1.0);
                        const easedProgress = this._applyEasing(progress, anim.easing);

                        anim.currentOpacity = anim.fromOpacity + (anim.targetOpacity - anim.fromOpacity) * easedProgress;

                        if (progress >= 1.0) {
                            anim.currentOpacity = anim.targetOpacity;
                            anim.startTime = 0;
                            if (anim.onComplete) anim.onComplete();
                        }
                    }
                }


                // Process Emerging Buttons Animations
                for (const buttonId in this.masterState.emergingButtonsStates) {
                    const btnState = this.masterState.emergingButtonsStates[buttonId];
                    if (btnState.animation?.opacity && btnState.animation.opacity.startTime > 0 && now >= btnState.animation.opacity.startTime) {
                        const anim = btnState.animation.opacity;
                        if (anim.fromValue === undefined) anim.fromValue = 0;

                        const elapsed = now - anim.startTime;
                        const timeSinceAnimStart = Math.max(0, elapsed);
                        const progress = Math.min(timeSinceAnimStart / anim.duration, 1.0);
                        const easedProgress = this._applyEasing(progress, anim.easing);

                        anim.current = anim.fromValue + (anim.target - anim.fromValue) * easedProgress;

                        if (anim.current > 0.01) btnState.isVisible = true;

                        if (progress >= 1.0) {
                            anim.current = anim.target;
                            anim.startTime = 0;
                            if (anim.target === 0) btnState.isVisible = false;
                            if (anim.onComplete) anim.onComplete();
                        }
                    }
                }


                this.lastUpdateTime = currentTime;
            }
            
            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
        console.log('🔄 VIB3HomeMaster update loop started - Managing 13 visualizers hierarchically');
    }
    
    /**
     * Get current system state for debugging/monitoring
     */
    getSystemState() {
        return {
            masterState: {...this.masterState},
            currentSection: this.sectionModifiers[this.masterState.activeSection],
            totalVisualizers: Object.keys(this.instanceRoles).length * Object.keys(this.sectionModifiers).length
        };
    }
    
    /**
     * Register interaction with editor-configurable responses
     */
    registerInteraction(type, intensity, duration = 1000) {
        const interactionConfig = this.editorConfig?.editorDashboard?.interactionPresets;
        
        console.log(`🎮 Interaction registered: ${type} (intensity: ${intensity}, duration: ${duration})`);
        
        const applyEffect = (effectConfig, effectIntensity) => {
            if (!effectConfig || !effectConfig.enabled || !effectConfig.affectsState) return;

            const stateChange = effectConfig.affectsState;
            const targetParam = stateChange.parameter;
            let valueToApply = stateChange.valueFromIntensity ? effectIntensity : stateChange.value;

            if (this.masterState.hasOwnProperty(targetParam)) {
                switch (stateChange.operation) {
                    case 'set':
                        this.masterState[targetParam] = valueToApply;
                        break;
                    case 'add':
                        this.masterState[targetParam] = (this.masterState[targetParam] || 0) + valueToApply;
                        break;
                    case 'multiply':
                        this.masterState[targetParam] = (this.masterState[targetParam] || 1) * valueToApply;
                        break;
                    default:
                        console.warn(`Unknown operation: ${stateChange.operation} for ${type}`);
                        return;
                }
                console.log(`MasterState.${targetParam} updated to ${this.masterState[targetParam]} by ${type}`);

                if (stateChange.duration) {
                    // Clear any existing timer for this parameter to avoid conflicts
                    if (this.masterState.navigationEffectTimers[targetParam]) {
                        clearTimeout(this.masterState.navigationEffectTimers[targetParam]);
                    }
                    // Set a timer to revert the effect or decay it
                    // For simplicity, this example reverts to a baseline or pre-effect state.
                    // More complex decay logic could be implemented in the main update loop.
                    const originalValue = targetParam === "intensity" ? (this.masterState.editorOverrides.intensity || 0.8) :
                                          targetParam === "complexity" ? (this.masterState.editorOverrides.complexity || 0.5) : // Assuming a base complexity
                                          0; // Default revert value for other params like currentDragTension or isPortalling

                    this.masterState.navigationEffectTimers[targetParam] = setTimeout(() => {
                        // More sophisticated revert: check if it was additive or multiplicative
                        if (stateChange.operation === 'add') {
                             this.masterState[targetParam] -= valueToApply; // Approximate revert
                        } else if (stateChange.operation === 'multiply') {
                            this.masterState[targetParam] /= valueToApply; // Approximate revert
                        } else { // set
                            this.masterState[targetParam] = originalValue;
                        }
                        console.log(`MasterState.${targetParam} reverted after duration for ${type}. New value: ${this.masterState[targetParam]}`);
                        delete this.masterState.navigationEffectTimers[targetParam];
                    }, stateChange.duration);
                }
            } else {
                console.warn(`Unknown masterState parameter: ${targetParam} for ${type}`);
            }
        };

        switch(type) {
            case 'cubeRotation': // Existing, potentially keep or integrate with new ones
                if (interactionConfig?.cubeNavigation?.enabled) {
                    // This seems to affect mouseIntensity, which might be fine.
                    // Or, cubeRotation could have its own entry in interactionPresets.
                    const config = interactionConfig.cubeNavigation; // This is for nav parameters, not effects.
                                                                    // Let's assume 'cubeRotation' directly influences a master state like 'rotationSpeedMultiplier'
                    // this.masterState.rotationSpeedMultiplier = intensity; // Example
                    console.log("Processing cubeRotation interaction - current logic updates mouseIntensity indirectly.");
                    // The original logic:
                     const tensionStrength = interactionConfig.cubeNavigation.tensionBuildup?.default || 0.02;
                     this.updateInteraction('mouse', { intensity: intensity * tensionStrength });
                }
                break;

            case 'tensionBuild': // From navigation-config.json, via DualNavigationSystem
                if (interactionConfig?.tensionBuild?.enabled) {
                    applyEffect(interactionConfig.tensionBuild, intensity);
                    if (interactionConfig.tensionBuild.secondaryEffect) { // Handle secondary effect if defined
                        applyEffect(interactionConfig.tensionBuild.secondaryEffect, intensity);
                    }
                }
                break;

            case 'cubeTension': // From DualNavigationSystem
                if (interactionConfig?.cubeTension?.enabled) {
                    applyEffect(interactionConfig.cubeTension, intensity);
                     if (interactionConfig.cubeTension.secondaryEffect) {
                        applyEffect(interactionConfig.cubeTension.secondaryEffect, intensity);
                    }
                }
                break;

            case 'portalTransitionEffect': // From navigation-config.json, via DualNavigationSystem
                 if (interactionConfig?.portalTransitionEffect?.enabled) {
                    applyEffect(interactionConfig.portalTransitionEffect, intensity);
                     if (interactionConfig.portalTransitionEffect.secondaryEffect) {
                        applyEffect(interactionConfig.portalTransitionEffect.secondaryEffect, intensity);
                    }
                }
                break;

            case 'hover': // Existing
                if (interactionConfig?.hoverEffects?.enabled) {
                    const config = interactionConfig.hoverEffects;
                    const glowIntensity = config.glowIntensity?.default || 0.6;
                    this.updateInteraction('mouse', { intensity: intensity * glowIntensity });
                }
                break;
                
            case 'contentGravity': // Existing
                if (interactionConfig?.contentGravity?.enabled) {
                    const config = interactionConfig.contentGravity;
                    const gravityStrength = config.gravityStrength?.default || 0.3;
                    this.masterState.editorOverrides.contentGravity = gravityStrength; // This seems like an override, not a temporary effect.
                }
                break;
            default:
                console.warn(`Unhandled interaction type in registerInteraction: ${type}`);
        }
    }

    // Specific handler for scroll interactions, separate from generic registerInteraction
    // to handle more complex data objects and state management per element.
    handleScrollInteraction(type, data) {
        console.log(`📜 Scroll Interaction: ${type}`, data);
        const { elementId } = data;

        if (!elementId) {
            console.warn("Scroll interaction missing elementId", data);
            return;
        }

        // Ensure element state exists
        if (!this.masterState.scrollableElementsState[elementId]) {
            this.masterState.scrollableElementsState[elementId] = {
                offsetX: 0, offsetY: 0,
                isDragging: false,
                snapBackTargetX: null, snapBackTargetY: null, snapBackStartTime: 0,
                momentumVelocityX: 0, momentumVelocityY: 0,
                profileName: data.profileName || 'defaultProfile',
                lastRawX: 0, lastRawY: 0 // For calculating deltas and velocity
            };
        }
        const elementState = this.masterState.scrollableElementsState[elementId];

        // Determine profile (default or specific)
        const profile = this.editorConfig.scrollPhysicsPresets?.profiles?.[elementState.profileName] ||
                        this.editorConfig.scrollPhysicsPresets?.defaultProfile ||
                        { sensitivity: {x:1,y:1}, dragThreshold: {value:5}, snapBack: {enabled:true, springTension:100, damping:15}, momentum: {enabled:true, friction:0.05, minVelocityToSustain: 0.1}, allowedDirections: {value: "all"} };


        switch (type) {
            case 'dragScrollStart':
                // data: { elementId, startX, startY, profileName? }
                if (this.masterState.activeDragScrollElementId && this.masterState.activeDragScrollElementId !== elementId) {
                    // End previous drag if a new one starts on a different element
                    this.handleScrollInteraction('dragScrollEnd', { elementId: this.masterState.activeDragScrollElementId, velocityX:0, velocityY:0 });
                }
                this.masterState.activeDragScrollElementId = elementId;
                elementState.isDragging = true;
                elementState.startX = data.startX; // Store initial drag position on screen
                elementState.startY = data.startY;
                elementState.initialOffsetX = elementState.offsetX; // Store offset at drag start
                elementState.initialOffsetY = elementState.offsetY;
                elementState.momentumVelocityX = 0; // Stop any existing momentum/snap
                elementState.momentumVelocityY = 0;
                elementState.snapBackTargetX = null;
                elementState.snapBackTargetY = null;
                console.log(`DragScrollStart on ${elementId}: StartX=${elementState.startX}, InitialOffsetX=${elementState.initialOffsetX}`);
                break;

            case 'dragScrollMove':
                // data: { elementId, currentX, currentY }
                if (this.masterState.activeDragScrollElementId !== elementId || !elementState.isDragging) return;

                const deltaX = data.currentX - elementState.startX;
                const deltaY = data.currentY - elementState.startY;

                if (profile.allowedDirections.value === 'vertical') {
                    elementState.offsetX = elementState.initialOffsetX; // Keep X fixed
                    elementState.offsetY = elementState.initialOffsetY + (deltaY * (profile.sensitivity.y || 1.0));
                } else if (profile.allowedDirections.value === 'horizontal') {
                    elementState.offsetX = elementState.initialOffsetX + (deltaX * (profile.sensitivity.x || 1.0));
                    elementState.offsetY = elementState.initialOffsetY; // Keep Y fixed
                } else { // all
                    elementState.offsetX = elementState.initialOffsetX + (deltaX * (profile.sensitivity.x || 1.0));
                    elementState.offsetY = elementState.initialOffsetY + (deltaY * (profile.sensitivity.y || 1.0));
                }

                // For momentum calculation at dragEnd
                const timeNow = performance.now();
                const moveDeltaTime = (timeNow - (elementState.lastMoveTime || timeNow)) / 1000; // seconds
                if (moveDeltaTime > 0) {
                    elementState.currentVelocityX = (data.currentX - elementState.lastRawX) / moveDeltaTime;
                    elementState.currentVelocityY = (data.currentY - elementState.lastRawY) / moveDeltaTime;
                }
                elementState.lastMoveTime = timeNow;
                elementState.lastRawX = data.currentX;
                elementState.lastRawY = data.currentY;

                // Placeholder for Infinite Scroll Logic (Vertical Example)
                if (profile.infiniteScroll?.enabled && (profile.allowedDirections.value === 'all' || profile.allowedDirections.value === 'vertical')) {
                    const contentH = elementState.contentDimensionY || 0;
                    const viewportH = elementState.viewportDimensionY || 0;

                    if (contentH > viewportH) { // Only loop if content is larger than viewport
                        const scrollableDist = contentH - viewportH;
                        // Simple modulo-like looping. A more robust solution would involve content duplication strategy.
                        if (elementState.offsetY < -scrollableDist) {
                            elementState.offsetY += scrollableDist;
                            elementState.initialOffsetY += scrollableDist; // Adjust initial offset to maintain relative drag
                            console.log(`Infinite scroll (bottom loop) for ${elementId}, new offsetY: ${elementState.offsetY}`);
                        } else if (elementState.offsetY > 0) {
                            elementState.offsetY -= scrollableDist;
                            elementState.initialOffsetY -= scrollableDist;
                            console.log(`Infinite scroll (top loop) for ${elementId}, new offsetY: ${elementState.offsetY}`);
                        }
                    }
                }
                // Similar placeholder for Horizontal Infinite Scroll
                if (profile.infiniteScroll?.enabled && (profile.allowedDirections.value === 'all' || profile.allowedDirections.value === 'horizontal')) {
                    const contentW = elementState.contentDimensionX || 0;
                    const viewportW = elementState.viewportDimensionX || 0;
                     if (contentW > viewportW) {
                        const scrollableDist = contentW - viewportW;
                        if (elementState.offsetX < -scrollableDist) {
                            elementState.offsetX += scrollableDist;
                            elementState.initialOffsetX += scrollableDist;
                        } else if (elementState.offsetX > 0) {
                            elementState.offsetX -= scrollableDist;
                            elementState.initialOffsetX -= scrollableDist;
                        }
                    }
                }


                // console.log(`DragScrollMove on ${elementId}: OffsetX=${elementState.offsetX.toFixed(2)}, OffsetY=${elementState.offsetY.toFixed(2)}`);
                break;

            case 'dragScrollEnd':
                // data: { elementId } (velocities are now calculated in dragScrollMove)
                if (this.masterState.activeDragScrollElementId !== elementId || !elementState.isDragging) return;

                elementState.isDragging = false;
                this.masterState.activeDragScrollElementId = null;

                if (profile.momentum?.enabled) {
                    elementState.momentumVelocityX = elementState.currentVelocityX * 0.016 || 0; // Scale to pixels per frame approx
                    elementState.momentumVelocityY = elementState.currentVelocityY * 0.016 || 0;
                    console.log(`DragScrollEnd on ${elementId}: Momentum enabled. VelX=${elementState.momentumVelocityX.toFixed(2)}, VelY=${elementState.momentumVelocityY.toFixed(2)}`);
                } else if (profile.snapBack?.enabled) {
                    elementState.snapBackTargetX = 0; // Assuming snap to center/origin
                    elementState.snapBackTargetY = 0;
                    elementState.snapBackStartTime = performance.now();
                    console.log(`DragScrollEnd on ${elementId}: SnapBack enabled.`);
                }
                elementState.currentVelocityX = 0;
                elementState.currentVelocityY = 0;
                break;

            default:
                console.warn(`Unhandled scroll interaction type: ${type}`);
        }
    }
    
    /**
     * Get current configuration state for editor dashboard
     */
    getEditorState() {
        return {
            masterState: {...this.masterState},
            editorConfig: this.editorConfig,
            currentParameters: this.getParametersForSection(this.masterState.activeSection),
            availablePresets: this.editorConfig?.editorDashboard || {}
        };
    }
    
    /**
     * Manual parameter override for specific effects
     */
    overrideParameters(overrides) {
        Object.assign(this.masterState, overrides);
        Object.assign(this.masterState.editorOverrides, overrides);
    }
    
    /**
     * Reset to baseline state
     */
    reset() {
        this.masterState = {
            intensity: 0.5,
            speed: 0.5,
            density: 1.0,
            dimension: 3.5,
            complexity: 0.5,
            coherence: 1.0,
            mouseIntensity: 0.0,
            clickPulse: 0.0,
            scrollChaos: 0.0,
            activeSection: 0,
            transitionProgress: 1.0
        };
        
        console.log('🔄 VIB3HomeMaster reset to baseline state');
    }

    registerVisualizer(vizId, vizRole) {
        if (!vizId) {
            console.warn("VIB3HomeMaster: Attempted to register visualizer with no ID.");
            return;
        }
        this.masterState.activeVisualizers[vizId] = { role: vizRole || 'unknown' };
        console.log(`👁️ Visualizer registered: ${vizId} (role: ${vizRole})`);
        // Initialize its parameter targets if not already present
        if (!this.masterState.visualizerParameterTargets[vizId]) {
            this.masterState.visualizerParameterTargets[vizId] = {};
        }
    }

    unregisterVisualizer(vizId) {
        if (this.masterState.activeVisualizers[vizId]) {
            delete this.masterState.activeVisualizers[vizId];
            delete this.masterState.visualizerParameterTargets[vizId]; // Also clear any animation targets
            console.log(`👁️ Visualizer unregistered: ${vizId}`);
        }
    }

    _applyEasing(t, easingFunction = "linear") {
        switch (easingFunction) {
            case "ease-out": return 1 - Math.pow(1 - t, 3); // Cubic ease-out
            case "ease-in": return t * t * t; // Cubic ease-in
            case "ease-in-out": return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            default: return t; // linear
        }
    }

    _setVisualizerParameterTarget(vizId, paramName, targetValue, duration, easing, operation = "set") {
        if (!this.masterState.visualizerParameterTargets[vizId]) {
            this.masterState.visualizerParameterTargets[vizId] = {};
        }

        const currentParamState = this.masterState.visualizerParameterTargets[vizId][paramName];
        let currentValue = currentParamState ? currentParamState.current : undefined;

        // If currentValue is undefined, try to get it from the visualizer's base theme or default
        // This part is tricky as HomeMaster doesn't directly know viz's current state before bridge sync.
        // For densityMultiplier, we assume a base of 1.0 if not set.
        if (currentValue === undefined && paramName === 'densityMultiplier') {
            currentValue = 1.0;
        }
        // For other params, a more robust initial value fetching might be needed if not simply 'setting'.

        this.masterState.visualizerParameterTargets[vizId][paramName] = {
            current: currentValue !== undefined ? currentValue : targetValue, // Start from current if known, else jump to target (or handle better)
            target: targetValue,
            startTime: performance.now(),
            duration: duration || 300, // Default duration if not specified
            easing: easing || "linear",
            operation: operation
        };
         // console.log(`Set target for ${vizId}.${paramName}:`, this.masterState.visualizerParameterTargets[vizId][paramName]);
    }


    handleVisualizerInteraction(data) {
        // data: { type, elementId, canvasRole, normalizedX, normalizedY, clientX, clientY, button, timestamp }
        const prevHoveredId = this.masterState.hoveredVisualizerInfo?.id;

        switch (data.type) {
            case 'mousemove':
            case 'touchstart':
            case 'touchmove':
                this.masterState.hoveredVisualizerInfo = {
                    id: data.elementId, role: data.canvasRole, x: data.normalizedX, y: data.normalizedY,
                    clientX: data.clientX, clientY: data.clientY
                };

                if (prevHoveredId !== data.elementId) { // Hover has changed to a new element or from null
                    const hoverPreset = this.editorConfig?.interactionPresets?.visualizerHoverEcosystem;
                    if (hoverPreset?.enabled) {
                        const targetParam = hoverPreset.targetEffect.parameterToChange;
                        const observerParam = hoverPreset.observerEffect.parameterToChange; // Could be same as targetParam

                        // Revert previously hovered element to observer state (or normal if no observers)
                        if (prevHoveredId) {
                             this._setVisualizerParameterTarget(
                                prevHoveredId,
                                targetParam, // Assuming target and observer affect same param type for simplicity in revert
                                hoverPreset.observerEffect.value, // Make it behave like an observer now
                                hoverPreset.animation.duration,
                                hoverPreset.animation.easingFunction,
                                hoverPreset.observerEffect.operation || "set"
                            );
                        }

                        // Apply target effect to newly hovered element
                        this._setVisualizerParameterTarget(
                            data.elementId,
                            targetParam,
                            hoverPreset.targetEffect.value,
                            hoverPreset.animation.duration,
                            hoverPreset.animation.easingFunction,
                            hoverPreset.targetEffect.operation || "set"
                        );

                        // Apply observer effect to all other visualizers
                        for (const vizId in this.masterState.activeVisualizers) {
                            if (vizId !== data.elementId && vizId !== prevHoveredId) { // Don't re-apply to new target or just-reverted prev target
                                this._setVisualizerParameterTarget(
                                    vizId,
                                    observerParam,
                                    hoverPreset.observerEffect.value,
                                    hoverPreset.animation.duration,
                                    hoverPreset.animation.easingFunction,
                                    hoverPreset.observerEffect.operation || "set"
                                );
                            }
                        }
                        console.log(`Hover ecosystem effect triggered for target ${data.elementId}.`);
                    }
                } else if (!data.elementId && prevHoveredId) { // Mouse moved off all known visualizers (conceptual: this event isn't sent yet)
                     const hoverPreset = this.editorConfig?.interactionPresets?.visualizerHoverEcosystem;
                     if (hoverPreset?.enabled) {
                        // Revert all to normal
                         for (const vizId in this.masterState.activeVisualizers) {
                            this._setVisualizerParameterTarget(
                                vizId,
                                hoverPreset.targetEffect.parameterToChange, // Assuming same param for simplicity
                                1.0, // Normal state
                                hoverPreset.animation.duration,
                                hoverPreset.animation.easingFunction,
                                "set"
                            );
                        }
                        console.log(`Hover cleared, all visualizers reverting to normal.`);
                     }
                }
                break;

            case 'mousedown':
                this.masterState.clickedVisualizerInfo = {
                    id: data.elementId, role: data.canvasRole, x: data.normalizedX, y: data.normalizedY,
                    button: data.button, eventType: 'mousedown', timestamp: data.timestamp
                };
                // Logic for "press" part of click can go here if distinct from full "click"
                break;

            case 'click':
                this.masterState.clickedVisualizerInfo = {
                    id: data.elementId, role: data.canvasRole, x: data.normalizedX, y: data.normalizedY,
                    button: data.button, eventType: 'click', timestamp: data.timestamp
                };

                const clickPreset = this.editorConfig?.interactionPresets?.visualizerClickEcosystem;
                if (clickPreset?.enabled && clickPreset.phases && clickPreset.phases.length > 0) {
                    this.masterState.activeClickAnimation = {
                        visualizerId: data.elementId,
                        phaseIndex: 0,
                        phaseStartTime: performance.now(),
                        clickPreset: clickPreset // Store the whole preset for easy access to phases
                    };
                    // Initial application of phase 0 targets
                    this._applyClickAnimationPhase(this.masterState.activeClickAnimation);
                    console.log(`Click animation started for ${data.elementId}, phase 0.`);
                }
                break;

            case 'mouseup':
            case 'touchend':
                // Could clear hoveredVisualizerInfo if no other touches are active, or if mouse leaves canvas.
                // This requires more complex global mouse/touch tracking.
                // For now, hover state persists until a new hover occurs.
                if (this.masterState.hoveredVisualizerInfo && this.masterState.hoveredVisualizerInfo.id === data.elementId && data.type === 'touchend') {
                     // Conceptual: if this was the last touch, clear hover.
                     // This is simplified as we don't have full multi-touch tracking here.
                     // Also, on mouse systems, mouseleave is needed.
                     const hoverPreset = this.editorConfig?.interactionPresets?.visualizerHoverEcosystem;
                     if (hoverPreset?.enabled) {
                         this._setVisualizerParameterTarget(
                             data.elementId, // The one that was just 'touchend'-ed
                             hoverPreset.observerEffect.parameterToChange, // Revert to observer (normal) state
                             1.0, // Assuming 1.0 is normal
                             hoverPreset.animation.duration,
                             hoverPreset.animation.easingFunction,
                             "set"
                         );
                     }
                    // this.masterState.hoveredVisualizerInfo = null; // This would make it flicker if another finger still on it.
                }
                break;

            default:
                console.warn(`VIB3HomeMaster: Unhandled visualizerInteraction type: ${data.type}`, data);
        }
    }

    _applyClickAnimationPhase(animationState) {
        if (!animationState || !animationState.clickPreset || !animationState.clickPreset.phases) return;

        const phaseConfig = animationState.clickPreset.phases[animationState.phaseIndex];
        if (!phaseConfig) {
            // console.log("Click animation complete or invalid phase for " + animationState.visualizerId);
            this.masterState.activeClickAnimation = null; // End animation
            return;
        }

        console.log(`Applying click animation phase ${animationState.phaseIndex} for ${animationState.visualizerId}`);
        animationState.phaseStartTime = performance.now(); // Reset start time for this phase

        // Apply to target
        if (phaseConfig.targetEffect) {
            this._setVisualizerParameterTarget(
                animationState.visualizerId,
                phaseConfig.targetEffect.parameterToChange,
                phaseConfig.targetEffect.value,
                phaseConfig.animation.duration,
                phaseConfig.animation.easingFunction,
                phaseConfig.targetEffect.operation || "set"
            );
        }

        // Apply to observers (conceptual - needs list of all visualizer IDs)
        // For each other visualizerId:
        // if (phaseConfig.observerEffect) {
        //     this._setVisualizerParameterTarget(
        //         otherVisualizerId,
        //         phaseConfig.observerEffect.parameterToChange,
        //         phaseConfig.observerEffect.value,
        //         phaseConfig.animation.duration,
        //         phaseConfig.animation.easingFunction,
        //         phaseConfig.observerEffect.operation || "set"
        //     );
        // }
        // For now, only target is animated in this simplified example for click.
        // A full ecosystem click would require iterating all visualizers.

        // Check for focus mode trigger from click preset
        if (phaseConfig.targetEffect && phaseConfig.targetEffect.activateCardFocus && animationState.visualizerId) {
            const vizInfo = this.masterState.activeVisualizers[animationState.visualizerId];
            if (vizInfo && vizInfo.role === 'card') {
                const cardId = animationState.visualizerId.replace("-visualizer", ""); // Derive cardId
                if (cardId) {
                    this._initiateCardFocusMode(cardId);
                } else {
                    console.warn("Could not derive cardId for focus mode from visualizer:", animationState.visualizerId);
                }
            }
        }
    }

    // Helper for setting card DOM effect targets
    _setCardDomEffectTarget(cardId, effectName, targetValue, presetAnimationConfig, currentDomValues = {}) {
        if (!this.masterState.cardDomEffects[cardId]) {
            this.masterState.cardDomEffects[cardId] = {};
        }
        if (!this.masterState.cardDomEffects[cardId][effectName]) {
            this.masterState.cardDomEffects[cardId][effectName] = {};
        }

        const animState = this.masterState.cardDomEffects[cardId][effectName];
        animState.fromValue = animState.current !== undefined ? animState.current : (currentDomValues[effectName] || this._getDefaultDomEffectValue(effectName));
        animState.current = animState.fromValue;
        animState.target = targetValue;
        animState.startTime = performance.now();
        animState.duration = presetAnimationConfig.duration || 600; // Default from cardHoverEffects preset
        animState.easing = presetAnimationConfig.easingFunction || "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        // console.log(`Set DOM Effect for ${cardId}.${effectName}:`, animState);
    }

    _getDefaultDomEffectValue(effectName) {
        switch(effectName) {
            case 'scale': return 1.0;
            case 'opacity': return 1.0;
            case 'translateZ_px': return 0;
            case 'borderColor': return 'rgba(255, 255, 255, 0.18)'; // Default from .blog-card
            case 'backdropBlur_px': return 20; // Approximate default
            case 'backdropSaturate_percent': return 180; // Approximate default
            case 'zIndex': return 5; // Default z-index
            default: return 0;
        }
    }

    // Modified handleVisualizerInteraction to include card DOM effects
    handleVisualizerInteraction(data) {
        const prevHoveredVisualizerInfo = this.masterState.hoveredVisualizerInfo;
        const newHoveredVisualizerId = data.type === 'mousemove' || data.type === 'touchstart' || data.type === 'touchmove' ? data.elementId : null;

        // Update general hoveredVisualizerInfo
        if (newHoveredVisualizerId) {
            this.masterState.hoveredVisualizerInfo = {
                id: data.elementId, role: data.canvasRole, x: data.normalizedX, y: data.normalizedY,
                clientX: data.clientX, clientY: data.clientY,
                // Attempt to get card center if it's a card visualizer
                cardCenterX: data.canvasRole === 'card' ? (data.rect?.left + data.rect?.width / 2) / window.innerWidth : undefined,
                cardCenterY: data.canvasRole === 'card' ? 1.0 - (data.rect?.top + data.rect?.height / 2) / window.innerHeight : undefined,
            };
        } else if (data.type === 'visualizerMouseLeave' && prevHoveredVisualizerInfo && prevHoveredVisualizerInfo.id === data.elementId) {
            // This 'visualizerMouseLeave' event type would need to be sent by ReactiveHyperAVCore
            this.masterState.hoveredVisualizerInfo = null;
        }


        // --- Ecosystem Density Effect (from previous step, slightly refined) ---
        const densityHoverPreset = this.editorConfig?.interactionPresets?.visualizerHoverEcosystem;
        if (densityHoverPreset?.enabled) {
            const targetParam = densityHoverPreset.targetEffect.parameterToChange;
            const observerParam = densityHoverPreset.observerEffect.parameterToChange;
            const animConfig = densityHoverPreset.animation;

            if (prevHoveredVisualizerInfo?.id !== newHoveredVisualizerId) {
                // Revert previously hovered (if any) to observer state or normal
                if (prevHoveredVisualizerInfo?.id) {
                    this._setVisualizerParameterTarget(prevHoveredVisualizerInfo.id, targetParam, 1.0, animConfig.duration, animConfig.easingFunction, "set");
                }
                // Apply effects based on new hover state
                for (const vizId in this.masterState.activeVisualizers) {
                    if (vizId === newHoveredVisualizerId) { // Newly hovered is the target
                        this._setVisualizerParameterTarget(vizId, targetParam, densityHoverPreset.targetEffect.value, animConfig.duration, animConfig.easingFunction, densityHoverPreset.targetEffect.operation || "set");
                    } else { // All others are observers (or revert to normal if no new hover)
                        this._setVisualizerParameterTarget(vizId, observerParam, newHoveredVisualizerId ? densityHoverPreset.observerEffect.value : 1.0, animConfig.duration, animConfig.easingFunction, densityHoverPreset.observerEffect.operation || "set");
                    }
                }
            }
        }
        // --- End Ecosystem Density Effect ---


        // --- Card Specific Hover Effects (DOM, Card Visualizer Opacity, Board Opacity, Content Gravity) ---
        const cardHoverPreset = this.editorConfig?.interactionPresets?.cardHoverEffects;
        if (cardHoverPreset?.enabled) {
            const animConfig = cardHoverPreset.animation;
            const currentHoveredCardVizId = (this.masterState.hoveredVisualizerInfo && this.masterState.hoveredVisualizerInfo.role === 'card') ? this.masterState.hoveredVisualizerInfo.id : null;
            const prevHoveredCardVizId = (prevHoveredVisualizerInfo && prevHoveredVisualizerInfo.role === 'card') ? prevHoveredVisualizerInfo.id : null;

            // Determine cardId from visualizerId (e.g., "blog-card-1-visualizer" -> "blog-card-1")
            const getCardIdFromVizId = (vizId) => vizId ? vizId.replace("-visualizer", "") : null;
            const currentHoveredCardId = getCardIdFromVizId(currentHoveredCardVizId);
            const prevHoveredCardId = getCardIdFromVizId(prevHoveredCardVizId);

            if (currentHoveredCardId !== prevHoveredCardId) {
                 // Revert previously hovered card DOM effects
                if (prevHoveredCardId) {
                    for (const effectName in cardHoverPreset.targetCardDOM) {
                        this._setCardDomEffectTarget(prevHoveredCardId, effectName, this._getDefaultDomEffectValue(effectName), animConfig, this.masterState.cardDomEffects[prevHoveredCardId]);
                    }
                    if (this.masterState.activeVisualizers[prevHoveredCardVizId]) { // Revert target card visualizer opacity
                         this._setVisualizerParameterTarget(prevHoveredCardVizId, 'opacity', this.masterState.activeVisualizers[prevHoveredCardVizId].defaultOpacity || 0.6, animConfig.duration, animConfig.easingFunction);
                    }
                }

                // Apply effects to newly hovered card and observers
                for (const vizId in this.masterState.activeVisualizers) {
                    const cardId = getCardIdFromVizId(vizId); // Assumes vizId format is consistent for cards
                    if (!cardId || this.masterState.activeVisualizers[vizId].role !== 'card') continue;

                    if (vizId === currentHoveredCardVizId) { // Target card
                        for (const effectName in cardHoverPreset.targetCardDOM) {
                            this._setCardDomEffectTarget(cardId, effectName, cardHoverPreset.targetCardDOM[effectName], animConfig, this.masterState.cardDomEffects[cardId]);
                        }
                        if (cardHoverPreset.targetCardVisualizer) { // Target card's visualizer opacity
                            this._setVisualizerParameterTarget(vizId, 'opacity', cardHoverPreset.targetCardVisualizer.opacity, animConfig.duration, animConfig.easingFunction);
                        }
                    } else { // Observer cards
                        for (const effectName in cardHoverPreset.observerCardsDOM) {
                             this._setCardDomEffectTarget(cardId, effectName, cardHoverPreset.observerCardsDOM[effectName], animConfig, this.masterState.cardDomEffects[cardId]);
                        }
                         // Observer card's visualizer opacity (revert to default or specific observer opacity if defined)
                        this._setVisualizerParameterTarget(vizId, 'opacity', this.masterState.activeVisualizers[vizId].defaultOpacity || 0.6, animConfig.duration, animConfig.easingFunction);
                    }
                }

                // Board Visualizer Opacity & Content Gravity
                if (currentHoveredCardId) {
                    if (cardHoverPreset.boardVisualizerOnCardHover) {
                        this._setVisualizerParameterTarget('board-visualizer-instance', 'opacity', cardHoverPreset.boardVisualizerOnCardHover.opacity, animConfig.duration, animConfig.easingFunction);
                    }
                    if (cardHoverPreset.contentGravityOnHover?.enabled) {
                        this.masterState.contentGravityState.isActive = true;
                        this.masterState.contentGravityState.targetX = this.masterState.hoveredVisualizerInfo.cardCenterX || 0.5;
                        this.masterState.contentGravityState.targetY = this.masterState.hoveredVisualizerInfo.cardCenterY || 0.5;
                        this.masterState.contentGravityState.targetStrength = cardHoverPreset.contentGravityOnHover.strength;
                        this.masterState.contentGravityState.animation = { startTime: performance.now(), duration: animConfig.duration, easing: animConfig.easingFunction, fromStrength: this.masterState.contentGravityState.strength };
                    }
                } else { // No card is hovered (or hover cleared)
                    if (cardHoverPreset.boardVisualizerOnCardHover) { // Revert board opacity
                        this._setVisualizerParameterTarget('board-visualizer-instance', 'opacity', this._getDefaultDomEffectValue('boardOpacity') || 0.3, animConfig.duration, animConfig.easingFunction);
                    }
                    if (this.masterState.contentGravityState.isActive) { // Deactivate content gravity
                        this.masterState.contentGravityState.isActive = false;
                        this.masterState.contentGravityState.targetStrength = 0.0;
                        this.masterState.contentGravityState.animation = { startTime: performance.now(), duration: animConfig.duration, easing: animConfig.easingFunction, fromStrength: this.masterState.contentGravityState.strength };
                    }
                }
            }
        }
        // --- End Card Specific Hover Effects ---


        // --- Click Logic (from previous step, largely unchanged for now but needs observer effects) ---
        if (data.type === 'click') {
            this.masterState.clickedVisualizerInfo = {
                id: data.elementId, role: data.canvasRole, x: data.normalizedX, y: data.normalizedY,
                button: data.button, eventType: 'click', timestamp: data.timestamp
            };

            const clickPreset = this.editorConfig?.interactionPresets?.visualizerClickEcosystem;
            if (clickPreset?.enabled && clickPreset.phases && clickPreset.phases.length > 0) {
                this.masterState.activeClickAnimation = {
                    visualizerId: data.elementId,
                    phaseIndex: 0,
                    phaseStartTime: performance.now(),
                    clickPreset: clickPreset
                };
                this._applyClickAnimationPhase(this.masterState.activeClickAnimation);
                // console.log(`Click animation started for ${data.elementId}, phase 0.`);
            }
        }
        // --- End Click Logic ---

        // Fallback for other types or unhandled logic
        if (!['mousemove', 'touchstart', 'touchmove', 'mousedown', 'click', 'mouseup', 'touchend', 'visualizerMouseLeave'].includes(data.type)) {
             console.warn(`VIB3HomeMaster: Unhandled visualizerInteraction type: ${data.type}`, data);
        }
    }

    _applyClickAnimationPhase(animationState) {
        if (!animationState || !animationState.clickPreset || !animationState.clickPreset.phases) return;

        const phaseConfig = animationState.clickPreset.phases[animationState.phaseIndex];
        if (!phaseConfig) {
            this.masterState.activeClickAnimation = null;
            return;
        }

        console.log(`Applying click animation phase ${animationState.phaseIndex} for ${animationState.visualizerId}`);
        animationState.phaseStartTime = performance.now();

        if (phaseConfig.targetEffect) {
            this._setVisualizerParameterTarget(
                animationState.visualizerId,
                phaseConfig.targetEffect.parameterToChange,
                phaseConfig.targetEffect.value,
                phaseConfig.animation.duration,
                phaseConfig.animation.easingFunction,
                phaseConfig.targetEffect.operation || "set"
            );
        }

        // Apply to observers
        const observerEffect = phaseConfig.observerEffect;
        if (observerEffect) {
            for (const vizId in this.masterState.activeVisualizers) {
                if (vizId !== animationState.visualizerId) {
                    this._setVisualizerParameterTarget(
                        vizId,
                        observerEffect.parameterToChange,
                        observerEffect.value,
                        phaseConfig.animation.duration, // Assuming same animation for observers
                        phaseConfig.animation.easingFunction,
                        observerEffect.operation || "set"
                    );
                }
            }
        }
    }

    // --- Card Focus Mode Logic ---
    _initiateCardFocusMode(cardIdToFocus) {
        if (this.masterState.focusedCardId === cardIdToFocus && this.masterState.focusModeAnimation.targetCard && this.masterState.focusModeAnimation.targetCard.startTime > 0) {
             console.log(`Card ${cardIdToFocus} is already focusing.`);
             return; // Already focusing this card
        }
        if (this.masterState.focusedCardId && this.masterState.focusedCardId !== cardIdToFocus) {
            console.warn(`Another card (${this.masterState.focusedCardId}) is already focused. Exiting that focus first is not yet implemented robustly. New focus will override.`);
            // Ideally, queue this or complete existing exit animation. For now, direct override.
            // this._exitCardFocusMode(true); // true to indicate immediate exit for new focus
        }

        const focusPreset = this.editorConfig?.interactionPresets?.cardFocusMode;
        if (!focusPreset?.enabled) {
            console.warn("CardFocusMode preset is not enabled or found.");
            return;
        }
        console.log(`✨ Initiating Card Focus Mode for: ${cardIdToFocus}`);
        this.masterState.focusedCardId = cardIdToFocus;
        this.masterState.cardFocusData = {}; // Reset previous focus data, or manage per card if needed

        // 1. Target Card Animation Setup
        const tcPreset = focusPreset.targetCardAnimation;
        const currentTargetCardState = this.masterState.focusModeAnimation.targetCard?.current || {};
        const fromStateTarget = {};
        for(const key in tcPreset.targetState) {
            fromStateTarget[key] = currentTargetCardState[key] !== undefined ? currentTargetCardState[key] :
                                (this.masterState.cardDomEffects[cardIdToFocus]?.[key]?.current || this._getDefaultDomEffectValue(key, true));
        }

        this.masterState.focusModeAnimation.targetCard = {
            from: fromStateTarget,
            current: { ...fromStateTarget }, // Start animation from this state
            target: { ...tcPreset.targetState },
            startTime: performance.now(),
            duration: tcPreset.animation.duration,
            easing: tcPreset.animation.easingFunction,
            onComplete: () => {
                this._showEmergingButtons(cardIdToFocus);
            }
        };

        // 2. Observer Cards Animation Setup
        const obsPreset = focusPreset.observerCardsAnimation;
        const currentObserverEffectState = this.masterState.focusModeAnimation.observerCardsEffect?.current || {};
        const fromStateObserver = {};
         for(const key in obsPreset.targetState) {
            fromStateObserver[key] = currentObserverEffectState[key] !== undefined ? currentObserverEffectState[key] : this._getDefaultDomEffectValue(key, false);
        }
        this.masterState.focusModeAnimation.observerCardsEffect = {
            from: fromStateObserver,
            current: { ...fromStateObserver },
            target: { ...obsPreset.targetState },
            startTime: performance.now(),
            duration: obsPreset.animation.duration,
            easing: obsPreset.animation.easingFunction
        };

        // 3. Page Overlay Animation Setup
        const overlayPreset = focusPreset.pageOverlay;
        if (overlayPreset?.enabled) {
            const currentOverlayOpacity = this.masterState.focusModeAnimation.pageOverlay?.currentOpacity || 0;
            this.masterState.focusModeAnimation.pageOverlay = {
                fromOpacity: currentOverlayOpacity,
                currentOpacity: currentOverlayOpacity,
                targetOpacity: this._parseCssColor(overlayPreset.backgroundColor).a,
                backgroundColor: overlayPreset.backgroundColor,
                startTime: performance.now(),
                duration: overlayPreset.animation.duration,
                easing: overlayPreset.animation.easingFunction
            };
        }

        this.masterState.emergingButtonsStates = {}; // Clear/prepare for new buttons
    }

    _exitCardFocusMode(immediate = false) {
        if (!this.masterState.focusedCardId) return;
        const cardIdToExit = this.masterState.focusedCardId; // Store before clearing potentially

        console.log(`🚪 Exiting Card Focus Mode for: ${cardIdToExit}`);

        const focusPreset = this.editorConfig?.interactionPresets?.cardFocusMode;
        if (!focusPreset) return;

        // If content was expanded, collapse it first or simultaneously
        if (this.masterState.expandedCardContent === cardIdToExit) {
            this._animateCardInternalElements(cardIdToExit, 'collapse');
            this._animateFocusModeButton(cardIdToExit, 'focusBtnCollapseDetails', 'hide', immediate); // Pass immediate flag
            this.masterState.expandedCardContent = null;
        }

        this._hideEmergingButtons(cardIdToExit, immediate);

        const tcExitAnimPreset = focusPreset.exitFocus || focusPreset.targetCardAnimation.animation;
        const defaultTargetState = {};
        for (const key in focusPreset.targetCardAnimation.targetState) {
            defaultTargetState[key] = this._getDefaultDomEffectValue(key, true);
        }
        // Ensure current state is captured for 'from'
        const currentTargetCardState = this.masterState.focusModeAnimation.targetCard?.current ||
                                   this._captureCurrentCardState(cardIdToExit, focusPreset.targetCardAnimation.targetState);


        this.masterState.focusModeAnimation.targetCard = {
            from: { ...currentTargetCardState },
            current: { ...currentTargetCardState },
            target: defaultTargetState,
            startTime: performance.now(),
            duration: immediate ? 0 : (tcExitAnimPreset.duration || 300),
            easing: tcExitAnimPreset.easingFunction || 'easeInExpo',
            onComplete: () => {
                if (this.masterState.focusedCardId === cardIdToExit) { // Ensure it's still the same focused card exiting
                    this.masterState.focusedCardId = null;
                    this.masterState.focusModeAnimation.targetCard = null; // Clear animation object
                }
            }
        };
        if (immediate) { // Apply end state directly
             this.masterState.focusModeAnimation.targetCard.current = { ...defaultTargetState };
             this.masterState.focusModeAnimation.targetCard.startTime = 0;
             if (this.masterState.focusedCardId === cardIdToExit) {
                this.masterState.focusedCardId = null;
                this.masterState.focusModeAnimation.targetCard = null;
            }
        }

        const obsExitAnimPreset = focusPreset.exitFocus || focusPreset.observerCardsAnimation.animation;
        const defaultObserverState = {};
        for (const key in focusPreset.observerCardsAnimation.targetState) {
            defaultObserverState[key] = this._getDefaultDomEffectValue(key, false);
        }
        const currentObserverState = this.masterState.focusModeAnimation.observerCardsEffect?.current ||
                                     this._captureCurrentObserverState(focusPreset.observerCardsAnimation.targetState);

        this.masterState.focusModeAnimation.observerCardsEffect = {
            from: { ...currentObserverState },
            current: { ...currentObserverState },
            target: defaultObserverState,
            startTime: performance.now(),
            duration: immediate ? 0 : (obsExitAnimPreset.duration || 300),
            easing: obsExitAnimPreset.easingFunction || 'easeInExpo',
            onComplete: () => {
                if (!this.masterState.focusedCardId) { // Only clear if no new focus has started
                    this.masterState.focusModeAnimation.observerCardsEffect = null;
                }
            }
        };
         if (immediate) {
            this.masterState.focusModeAnimation.observerCardsEffect.current = { ...defaultObserverState };
            this.masterState.focusModeAnimation.observerCardsEffect.startTime = 0;
            if (!this.masterState.focusedCardId) this.masterState.focusModeAnimation.observerCardsEffect = null;
        }

        const overlayPreset = focusPreset.pageOverlay;
        const overlayExitAnimPreset = focusPreset.exitFocus || overlayPreset?.animation;
        if (overlayPreset?.enabled && this.masterState.focusModeAnimation.pageOverlay && overlayExitAnimPreset) {
            this.masterState.focusModeAnimation.pageOverlay = {
                ...this.masterState.focusModeAnimation.pageOverlay,
                fromOpacity: this.masterState.focusModeAnimation.pageOverlay.currentOpacity,
                targetOpacity: 0,
                startTime: performance.now(),
                duration: immediate ? 0 : (overlayExitAnimPreset.duration || 300),
                easing: overlayExitAnimPreset.easingFunction || 'easeInExpo',
                onComplete: () => {
                     if (!this.masterState.focusedCardId) {
                        this.masterState.focusModeAnimation.pageOverlay = null;
                     }
                }
            };
            if (immediate) {
                this.masterState.focusModeAnimation.pageOverlay.currentOpacity = 0;
                this.masterState.focusModeAnimation.pageOverlay.startTime = 0;
                 if (!this.masterState.focusedCardId) this.masterState.focusModeAnimation.pageOverlay = null;
            }
        }
    }

    _captureCurrentCardState(cardId, targetStateKeys) {
        const capturedState = {};
        const currentCardEffects = this.masterState.cardDomEffects[cardId] || {};
        for (const key in targetStateKeys) {
            capturedState[key] = currentCardEffects[key]?.current !== undefined ?
                                 currentCardEffects[key]?.current :
                                 this._getDefaultDomEffectValue(key, true);
        }
        return capturedState;
    }
    _captureCurrentObserverState(targetStateKeys) {
        const capturedState = {};
         for (const key in targetStateKeys) {
            capturedState[key] = this._getDefaultDomEffectValue(key, false); // Observers are simpler, use general defaults
        }
        return capturedState;
    }

    _getDefaultDomEffectValue(effectName, isTargetCardContext) {
        // isTargetCardContext: true if for the main focused card (or its non-focused state), false for a generic observer.
        switch(effectName) {
            case 'width': return 'auto';
            case 'height': return 'auto';
            case 'left': return 'auto';
            case 'top': return 'auto';
            case 'position': return 'relative';
            case 'transform': return 'scale(1)';
            case 'opacity': return 1.0;
            case 'zIndex': return isTargetCardContext ? 10 : 5;
            case 'scale': return 1.0;
            case 'boxShadow': return isTargetCardContext ? '0px 4px 15px rgba(0,0,0,0.2)' : '0px 2px 5px rgba(0,0,0,0.1)';
            case 'borderColor': return 'rgba(255, 255, 255, 0.18)';
            case 'borderHighlightColor': return 'transparent';
            case 'borderHighlightWidth': return '0px';
            case 'blur': return '0px'; // Note: CSS blur is filter: blur(), not a direct property. Bridge needs to handle.
            default: return effectName.includes('Color') ? 'transparent' : (typeof this.masterState.cardDomEffects?.someCardId?.[effectName]?.current === 'number' ? 0 : '');
        }
    }

    _showEmergingButtons(cardId) {
        const focusPreset = this.editorConfig?.interactionPresets?.cardFocusMode;
        if (!focusPreset?.emergingButtons?.enabled) return;

        // this.masterState.emergingButtonsStates = {}; // Don't clear if we are just adding more
        focusPreset.emergingButtons.buttons.forEach(buttonPreset => {
            this.masterState.emergingButtonsStates[buttonPreset.id] = {
                cardId: cardId,
                preset: buttonPreset,
                isVisible: false,
                animation: {
                    opacity: {
                        fromValue: 0, current: 0, target: 1,
                        startTime: performance.now() + (buttonPreset.animation.delay || 0),
                        duration: buttonPreset.animation.duration || 300,
                        easing: buttonPreset.animation.easingFunction || 'easeOutQuad' // Corrected easing access
                    }
                }
            };
        });
        // console.log(`Emerging buttons scheduled for ${cardId}`, this.masterState.emergingButtonsStates);
    }

    _hideEmergingButtons(cardId, immediate = false) {
        for (const buttonId in this.masterState.emergingButtonsStates) {
            const btnState = this.masterState.emergingButtonsStates[buttonId];
            if (btnState.cardId === cardId && btnState.animation.opacity) {
                btnState.animation.opacity.target = 0;
                btnState.animation.opacity.fromValue = btnState.animation.opacity.current; // Animate from current opacity
                btnState.animation.opacity.startTime = performance.now();
                btnState.animation.opacity.duration = immediate ? 0 : (btnState.preset.animation.duration || 300) / 2;

                const onComplete = () => {
                    btnState.isVisible = false;
                    // Optionally remove from emergingButtonsStates once hidden and animation complete
                    // delete this.masterState.emergingButtonsStates[buttonId];
                };

                if (immediate) {
                    btnState.animation.opacity.current = 0;
                    btnState.animation.opacity.startTime = 0;
                    onComplete();
                } else {
                    btnState.animation.opacity.onComplete = onComplete;
                }
            }
        }
    }

    handleFocusModeButtonAction(actionData) {
        console.log("Focus mode button action:", actionData);
        const { action, cardId, buttonId } = actionData;
        switch (action) {
            case 'triggerCloseCardFocusMode': // Matches preset action
                this._exitCardFocusMode();
                break;
            case 'navigateToProjectUrl':
                console.log(`Action '${action}' for card '${cardId}' triggered by button '${buttonId}'. NavigateToProjectUrl implementation pending.`);
                break;
            case 'expandCardContent':
                if (this.masterState.focusedCardId && this.masterState.focusedCardId === cardId) {
                    this.masterState.expandedCardContent = cardId;
                    this._animateCardInternalElements(cardId, 'expand');
                    // Assuming 'focusBtnCollapseDetails' is the ID of the back/collapse button from preset
                    this._animateFocusModeButton(this.masterState.focusedCardId, 'focusBtnCollapseDetails', 'show');
                } else {
                    console.warn("expandCardContent called but no card is focused or cardId mismatch.");
                }
                break;
            case 'collapseCardContent':
                if (this.masterState.expandedCardContent && this.masterState.expandedCardContent === cardId) {
                    this._animateCardInternalElements(cardId, 'collapse');
                    this._animateFocusModeButton(cardId, 'focusBtnCollapseDetails', 'hide');
                    this.masterState.expandedCardContent = null;
                }
                break;
            default:
                console.warn("Unknown focus mode button action:", action);
        }
    }

    _parseCssColor(colorString) {
        if (typeof colorString !== 'string') return { r:0, g:0, b:0, a:0};
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx) return { r:0, g:0, b:0, a:0}; // Should not happen in browser
        ctx.fillStyle = colorString;
        const colorVal = ctx.fillStyle; // Gets the browser's canonical version (e.g. #RRGGBB or rgba())

        if (colorVal.startsWith('#')) { // Hex color
            const hex = colorVal.substring(1);
            const bigint = parseInt(hex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return { r, g, b, a: 1 }; // Hex is always opaque
        } else if (colorVal.startsWith('rgb')) { // rgb or rgba
            const parts = colorVal.match(/[\d.]+/g);
            if (parts && (parts.length === 3 || parts.length === 4)) {
                return {
                    r: parseFloat(parts[0]),
                    g: parseFloat(parts[1]),
                    b: parseFloat(parts[2]),
                    a: parts.length === 4 ? parseFloat(parts[3]) : 1
                };
            }
        }
        return { r:0, g:0, b:0, a: (colorString === 'transparent' ? 0 : 1) };
    }
    // --- End Card Focus Mode Logic ---

    // --- Global Mouse Effects Logic ---
    _updateGlobalMouseEffectTargets() {
        const globalMouseConfig = this.editorConfig?.interactionPresets?.globalMouseEffects;
        if (!globalMouseConfig?.enabled || !this.editorConfig) return;

        const mouseX = this.masterState.globalMouseX; // Normalized 0-1
        const mouseY = this.masterState.globalMouseY; // Normalized 0-1

        globalMouseConfig.effects.forEach(effectPreset => {
            if (!effectPreset.enabled) {
                // If effect is disabled, ensure its targets are set to base/neutral
                this._revertSpecificGlobalMouseEffect(effectPreset.id);
                return;
            }

            if (!this.masterState.globalMouseEffectsState[effectPreset.id]) {
                this.masterState.globalMouseEffectsState[effectPreset.id] = {};
            }
            const effectState = this.masterState.globalMouseEffectsState[effectPreset.id];

            const processParameter = (paramConfig, paramKey) => {
                let inputValue = 0;
                // Determine input value based on axis (0-1 range from mouseX/Y, or -0.5 to 0.5 for centered)
                switch (paramConfig.inputAxis) {
                    case 'x': inputValue = mouseX - 0.5; break; // Centered: -0.5 to 0.5
                    case 'y': inputValue = mouseY - 0.5; break; // Centered: -0.5 to 0.5
                    case 'distanceFromCenterX': inputValue = Math.abs(mouseX - 0.5) * 2; break; // 0 to 1
                    case 'distanceFromCenterY': inputValue = Math.abs(mouseY - 0.5) * 2; break; // 0 to 1
                    case 'distanceFromCenter':
                        inputValue = Math.sqrt(Math.pow(mouseX - 0.5, 2) + Math.pow(mouseY - 0.5, 2)) * 2; // Approx 0 to 1.414, clamp or normalize via maxDistance
                        inputValue = Math.min(inputValue / (globalMouseConfig.maxDistance || 1.0), 1.0); // Normalize
                        break;
                    default: inputValue = 0;
                }

                inputValue *= (paramConfig.inputMultiplier || 1.0) * (globalMouseConfig.baseSensitivity || 1.0);

                let targetValue;
                if (effectPreset.type === 'parallax' && typeof paramConfig.maxOffset === 'string') {
                    const offsetValue = parseFloat(paramConfig.maxOffset);
                    // For parallax, target is the direct offset. Base is implicitly 0.
                    targetValue = inputValue * offsetValue;
                    // Units like 'px' or '%' will be handled by the bridge. Store unit with target or have bridge assume.
                    // Let's assume for now HomeMaster stores numeric value, bridge adds unit from preset.
                } else {
                    // For visualizer params and CSS vars, it's maxChange from a baseValue
                    targetValue = (paramConfig.baseValue || 0) + inputValue * paramConfig.maxChange;
                }

                if (!effectState[paramKey]) {
                    effectState[paramKey] = { current: paramConfig.baseValue || 0, target: paramConfig.baseValue || 0, smoothingFactor: paramConfig.smoothingFactor || 0.1, baseValue: paramConfig.baseValue || 0 };
                }
                effectState[paramKey].target = targetValue;
                effectState[paramKey].smoothingFactor = paramConfig.smoothingFactor || 0.1; // Ensure smoothingFactor is set
                effectState[paramKey].baseValue = paramConfig.baseValue || 0; // Ensure baseValue is set
            };

            if (effectPreset.type === 'parallax' || effectPreset.type === 'cssVariable') {
                // These types have a single 'parameters' object, where keys are 'translateX', 'translateY', or 'value'
                for (const paramName in effectPreset.parameters) { // e.g. paramName is 'translateX' or 'value'
                    processParameter(effectPreset.parameters[paramName], paramName);
                }
            } else if (effectPreset.type === 'visualizerParameter') {
                // This type has an array of 'parameters'
                effectPreset.parameters.forEach(vizParamConfig => {
                    processParameter(vizParamConfig, vizParamConfig.name); // paramKey is vizParamConfig.name
                });
            }
        });
    }

    _revertGlobalMouseEffectTargets() {
        const globalMouseConfig = this.editorConfig?.interactionPresets?.globalMouseEffects;
        if (!globalMouseConfig?.enabled) return;

        globalMouseConfig.effects.forEach(effectPreset => {
            if (effectPreset.enabled) { // Only revert enabled effects
               this._revertSpecificGlobalMouseEffect(effectPreset.id);
            }
        });
    }

    _revertSpecificGlobalMouseEffect(effectId) {
        const effectState = this.masterState.globalMouseEffectsState[effectId];
        if (effectState) {
            for (const paramKey in effectState) {
                effectState[paramKey].target = effectState[paramKey].baseValue;
            }
        }
    }
    // --- End Global Mouse Effects Logic ---

    // --- Card Content Expansion Specific Logic ---
    _animateCardInternalElements(cardId, direction) { // direction is 'expand' or 'collapse'
        const focusPreset = this.editorConfig?.interactionPresets?.cardFocusMode;
        const contentExpansionPreset = focusPreset?.contentExpansion;

        if (!contentExpansionPreset?.enabled || !cardId) {
            console.warn("Content expansion preset not enabled or cardId missing for _animateCardInternalElements.");
            return;
        }

        if (!this.masterState.cardInternalAnimations[cardId]) {
            this.masterState.cardInternalAnimations[cardId] = {};
        }
        const cardAnims = this.masterState.cardInternalAnimations[cardId];
        const animConfig = contentExpansionPreset.animation;

        for (const selector in contentExpansionPreset.cardElements) {
            const elementPreset = contentExpansionPreset.cardElements[selector];
            if (!cardAnims[selector]) cardAnims[selector] = {};

            const currentElementAnimState = cardAnims[selector];

            for (const prop in elementPreset.targetState) {
                // Ensure current value is initialized before trying to access it
                if (!currentElementAnimState[prop]) {
                    currentElementAnimState[prop] = {
                        current: this._getDefaultInternalElementStyleValue(selector, prop, direction === 'expand' ? 'summary' : 'expanded', cardId),
                        target: 0,
                        fromValue: 0
                    };
                }

                const baseValue = this._getDefaultInternalElementStyleValue(selector, prop, 'summary', cardId);
                const expandedValue = elementPreset.targetState[prop];

                currentElementAnimState[prop].fromValue = currentElementAnimState[prop].current;
                currentElementAnimState[prop].target = (direction === 'expand') ? expandedValue : baseValue;
                currentElementAnimState[prop].startTime = performance.now();
                currentElementAnimState[prop].duration = animConfig.duration;
                currentElementAnimState[prop].easing = animConfig.easing;
                // console.log(`Internal anim for ${cardId} ${selector}.${prop}: from ${currentElementAnimState[prop].fromValue} to ${currentElementAnimState[prop].target}`);
            }
        }
    }

    _getDefaultInternalElementStyleValue(selector, property, mode = 'summary', cardId = null) {
        // Try to get a more dynamic 'current' value if collapsing, otherwise use structural defaults.
        // This is still a simplification. The Bridge would have the actual current DOM values.
        if (mode === 'expanded' && cardId && this.masterState.cardInternalAnimations[cardId]?.[selector]?.[property]) {
             // If collapsing (current mode is 'expanded'), the 'fromValue' is the current animated value.
            return this.masterState.cardInternalAnimations[cardId][selector][property].current;
        }

        // Fallback to structural defaults for 'summary' mode or if current not available.
        // These should ideally match the initial CSS of these elements within a card.
        // Example:
        if (selector === '.card-visualizer') {
            if (property === 'opacity') return 1.0;
            if (property === 'height') return '40%'; // As an example, might be different based on card layout
        }
        if (selector === '.card-title') {
            if (property === 'fontSize') return '2rem';
            if (property === 'marginBottom') return '12px';
        }
        if (selector === '.card-subtitle') {
            if (property === 'opacity') return 1.0;
            if (property === 'height') return 'auto';
            if (property === 'marginBottom') return '15px';
        }
        if (selector === '.card-content') { // The main scrollable area
            if (property === 'paddingTop') return '25px';
            if (property === 'paddingBottom') return '25px';
            if (property === 'height') return 'auto'; // Default height before expansion
        }
        if (selector === '.article-meta') {
            if (property === 'opacity') return 1.0;
            if (property === 'height') return 'auto';
            if (property === 'paddingTop') return '15px';
            if (property === 'marginTop') return 'auto';
            if (property === 'borderTop') return '1px solid rgba(0, 255, 255, 0.3)';
        }
        if (property === 'overflow') return 'hidden'; // Default for elements we might make 'auto'

        // Generic fallback for numeric vs string
        const numericDefaults = { opacity: 1.0, scale: 1.0, zIndex: 1, fontSize: 16, marginBottom: 0, paddingTop: 0, paddingBottom: 0 };
        if (numericDefaults.hasOwnProperty(property)) return numericDefaults[property];

        const stringDefaults = { height: 'auto', borderTop: 'none' };
        if (stringDefaults.hasOwnProperty(property)) return stringDefaults[property];

        return 0; // Last resort fallback
    }

    _animateFocusModeButton(cardId, buttonId, direction = 'show', immediate = false) {
        const focusPreset = this.editorConfig?.interactionPresets?.cardFocusMode;
        let buttonPresetDef = null;

        // Check primary emerging buttons
        if (focusPreset?.emergingButtons?.buttons) {
            buttonPresetDef = focusPreset.emergingButtons.buttons.find(b => b.id === buttonId);
        }
        // Check content expansion back button
        if (!buttonPresetDef && focusPreset?.contentExpansion?.backButton?.id === buttonId) {
            buttonPresetDef = focusPreset.contentExpansion.backButton;
        }

        if (!buttonPresetDef) {
            console.warn(`_animateFocusModeButton: Button preset for ID '${buttonId}' not found.`);
            return;
        }

        if (!this.masterState.emergingButtonsStates[buttonId]) {
            this.masterState.emergingButtonsStates[buttonId] = {
                cardId: cardId,
                preset: buttonPresetDef,
                isVisible: false,
                animation: {}
            };
        }

        const btnAnimState = this.masterState.emergingButtonsStates[buttonId];
        btnAnimState.cardId = cardId; // Ensure cardId is correct
        btnAnimState.preset = buttonPresetDef; // Ensure preset is up-to-date

        if (!btnAnimState.animation.opacity) {
            btnAnimState.animation.opacity = { current: (direction === 'show' ? 0:1) , fromValue: (direction === 'show' ? 0:1), target: 0, startTime: 0, duration: 300, easing: 'easeOutQuad' };
        }
        const opAnim = btnAnimState.animation.opacity;

        opAnim.fromValue = opAnim.current;
        opAnim.target = (direction === 'show') ? 1 : 0;
        opAnim.duration = immediate ? 0 : (buttonPresetDef.animation?.duration || 300);
        opAnim.easing = buttonPresetDef.animation?.easingFunction || 'easeOutQuad';
        opAnim.startTime = performance.now() + (direction === 'show' && !immediate ? (buttonPresetDef.animation?.delay || 0) : 0);

        if (immediate) {
            opAnim.current = opAnim.target;
            opAnim.startTime = 0;
        }

        if (direction === 'show' && opAnim.target > 0) { // Only set visible if actually showing
            btnAnimState.isVisible = true;
        } else if (direction === 'hide' && opAnim.target === 0 && immediate) {
             btnAnimState.isVisible = false;
        }
        // For non-immediate hide, isVisible will be set by animation loop when opacity is near 0
    }
     // --- End Card Content Expansion Specific Logic ---
}

export default VIB3HomeMaster;