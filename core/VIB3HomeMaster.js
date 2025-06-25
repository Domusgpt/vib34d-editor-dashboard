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
            hoveredVisualizerInfo: null, // { id, role, x, y }
            clickedVisualizerInfo: null  // { id, role, x, y, button }, potentially timed/cleared
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
        
        return baseParams;
    }
    
    /**
     * Get section name from key for editor config lookup
     */
    getSectionName(sectionKey) {
        const sectionNames = ['home', 'tech', 'media', 'audio', 'quantum'];
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
        
        // Apply role-specific modifiers
        const finalParams = {
            geometry: sectionParams.geometry,
            gridDensity: sectionParams.density * roleConfig.gridScale,
            rotationSpeed: sectionParams.speed * roleConfig.rotationScale,
            morphFactor: sectionParams.complexity * roleConfig.morphScale,
            dimension: sectionParams.dimension + roleConfig.dimensionBoost,
            intensity: sectionParams.intensity,
            
            // Color modifications based on role
            baseColor: this.applyColorModification(sectionParams.baseColor, roleConfig.color),
            
            // Interactive responsiveness
            mouseIntensity: sectionParams.mouseIntensity * roleConfig.interactionSensitivity,
            clickPulse: sectionParams.clickPulse * roleConfig.interactionSensitivity,
            scrollChaos: sectionParams.scrollChaos * roleConfig.interactionSensitivity,
            
            // System coherence
            coherence: sectionParams.coherence
        };
        
        return finalParams;
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
            case 'mouse':
                this.masterState.mouseIntensity = Math.min(1.0, data.intensity);
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
     * Transition to a new section with smooth interpolation
     */
    transitionToSection(newSection) {
        if (newSection === this.masterState.activeSection) return;
        
        console.log(`🌀 VIB3HomeMaster transitioning: ${this.sectionModifiers[this.masterState.activeSection].name} → ${this.sectionModifiers[newSection].name}`);
        
        this.masterState.activeSection = newSection;
        this.masterState.transitionProgress = 0.0;
        
        // Trigger coherence enhancement during transitions
        this.masterState.coherence = 1.5; // Temporarily boost system unity
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
            // Consolidating navigation-related interactions.
            // These will rely on interactionPresets for their specific effects on masterState.
            case 'dragStart': // New: Fired when bezel drag begins
                if (interactionConfig?.dragStart?.enabled) {
                    applyEffect(interactionConfig.dragStart, intensity); // Intensity might be 1.0 for start
                    if (interactionConfig.dragStart.secondaryEffect) {
                        applyEffect(interactionConfig.dragStart.secondaryEffect, intensity);
                    }
                }
                break;

            case 'cubeTension': // From DualNavigationSystem - represents ongoing tension
                                // Presets should map this to masterState.currentDragTension
                if (interactionConfig?.cubeTension?.enabled) {
                    applyEffect(interactionConfig.cubeTension, intensity); // intensity is the tension level
                     if (interactionConfig.cubeTension.secondaryEffect) {
                        applyEffect(interactionConfig.cubeTension.secondaryEffect, intensity);
                    }
                } else { // Fallback if not explicitly defined in presets
                    this.masterState.currentDragTension = intensity;
                    if (intensity === 0) this.masterState.isPortalling = 0.0; // Reset portalling if tension is zero
                }
                break;

            case 'dragComplete': // New: Fired when bezel drag completes successfully (fold occurs)
                                 // Presets could map this to masterState.isPortalling = 1.0 for a duration
                if (interactionConfig?.dragComplete?.enabled) {
                    applyEffect(interactionConfig.dragComplete, intensity); // Intensity might be 1.0
                    if (interactionConfig.dragComplete.secondaryEffect) {
                        applyEffect(interactionConfig.dragComplete.secondaryEffect, intensity);
                    }
                }
                break;

            case 'cubeSnapBack': // New: Fired if a drag doesn't result in a fold
                                 // Presets should ensure currentDragTension and isPortalling are reset
                if (interactionConfig?.cubeSnapBack?.enabled) {
                    applyEffect(interactionConfig.cubeSnapBack, intensity); // Intensity might be 0 or specific value
                    if (interactionConfig.cubeSnapBack.secondaryEffect) {
                        applyEffect(interactionConfig.cubeSnapBack.secondaryEffect, intensity);
                    }
                } else { // Fallback
                    this.masterState.currentDragTension = 0.0;
                    this.masterState.isPortalling = 0.0;
                }
                break;

            // The 'portalTransitionEffect' type might be redundant if 'dragComplete' handles the start of the portal effect
            // and 'cubeTension' at 0 handles its end. Or, it could be a specific effect triggered by 'dragComplete'.
            // For now, let's assume 'dragComplete' preset handles setting masterState.isPortalling.
            // case 'portalTransitionEffect':
            //      if (interactionConfig?.portalTransitionEffect?.enabled) {
            //         applyEffect(interactionConfig.portalTransitionEffect, intensity);
            //          if (interactionConfig.portalTransitionEffect.secondaryEffect) {
            //             applyEffect(interactionConfig.portalTransitionEffect.secondaryEffect, intensity);
            //         }
            //     }
            //     break;

            // Legacy/Other general interactions
            case 'cubeRotation':
                // This was an old way of handling it. Modern approach is via dragStart, cubeTension, dragComplete.
                // This can be deprecated or mapped to the new system if still used.
                // For now, keeping its original logic if a preset for 'cubeNavigation' exists.
                if (interactionConfig?.cubeNavigation?.enabled) {
                    const config = interactionConfig.cubeNavigation;
                    console.log("Processing legacy cubeRotation interaction.");
                    const tensionStrength = config.tensionBuildup?.default || 0.02;
                    this.updateInteraction('mouse', { intensity: intensity * tensionStrength });
                }
                break;

            case 'hover': // Existing general hover
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

    handleVisualizerInteraction(data) {
        // data: { type, elementId, canvasRole, normalizedX, normalizedY, clientX, clientY, button, timestamp }
        // console.log('VIB3HomeMaster: handleVisualizerInteraction', data);

        switch (data.type) {
            case 'mousemove':
            case 'touchstart': // Treat touchstart like hover for setting hovered info
            case 'touchmove':
                this.masterState.hoveredVisualizerInfo = {
                    id: data.elementId,
                    role: data.canvasRole,
                    x: data.normalizedX,
                    y: data.normalizedY,
                    clientX: data.clientX, // Store raw screen coords too if needed
                    clientY: data.clientY
                };
                // Note: A 'mouseleave' or 'touchend' equivalent from the visualizer would be needed
                // to reliably set hoveredVisualizerInfo to null. This could be inferred if no
                // mousemove/touchmove events are received for a certain period from any visualizer,
                // or if a global mousemove is outside all known visualizer bounds.
                // For now, it just stores the last hovered.
                break;

            // It might be useful to distinguish mousedown from click for some effects.
            case 'mousedown':
                // Could set a temporary "pressed" state or trigger immediate press effects
                this.masterState.clickedVisualizerInfo = { // Overwrite or update for press-hold-release cycle
                    id: data.elementId,
                    role: data.canvasRole,
                    x: data.normalizedX,
                    y: data.normalizedY,
                    button: data.button,
                    eventType: 'mousedown',
                    timestamp: data.timestamp
                };
                // Example: Trigger a short-lived effect, maybe via registerInteraction
                // this.registerInteraction('visualizerPressEffect', 1.0, 100);
                break;

            case 'click': // A full click event
                this.masterState.clickedVisualizerInfo = {
                    id: data.elementId,
                    role: data.canvasRole,
                    x: data.normalizedX,
                    y: data.normalizedY,
                    button: data.button,
                    eventType: 'click',
                    timestamp: data.timestamp
                };
                // Example: Trigger a different effect for a completed click
                // this.registerInteraction('visualizerClickEffect', 1.0, 300);

                // Consider clearing clickedVisualizerInfo after a short delay or on next interaction
                // if it's meant to be a momentary event signal.
                // For now, it just stores the last click.
                break;

            case 'mouseup':
            case 'touchend':
                // If tracking a press-hold-release cycle, 'mouseup' or 'touchend' would complete it.
                // Could clear a "pressed" state if one was set on mousedown.
                // If this.masterState.clickedVisualizerInfo was set on mousedown and matches this elementId,
                // we could augment it or clear it.
                if (this.masterState.clickedVisualizerInfo && this.masterState.clickedVisualizerInfo.id === data.elementId && this.masterState.clickedVisualizerInfo.eventType === 'mousedown') {
                    // It's a mouseup following a mousedown on the same visualizer
                    // console.log(`Visualizer ${data.elementId} released.`);
                    // Potentially clear or update clickedVisualizerInfo if it's for press state
                }
                // For touchend, it might also clear hoveredVisualizerInfo if no other touches active
                // This part needs more sophisticated logic if precise mouseleave/touchend on visualizer is required
                // For now, hoveredVisualizerInfo stays until another visualizer is hovered.
                break;

            default:
                console.warn(`VIB3HomeMaster: Unhandled visualizerInteraction type: ${data.type}`, data);
        }
    }
}

export default VIB3HomeMaster;