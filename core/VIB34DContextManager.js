/**
 * VIB34DContextManager.js - Context-Preserving Architecture System
 * 
 * Provides bulletproof context preservation across all hypercube face transitions,
 * parameter relationships maintenance, and intelligent state restoration.
 * 
 * Features:
 * - Memory-efficient parameter caching
 * - Automatic state restoration after page reload
 * - Intelligent preloading of adjacent hypercube faces
 * - Cross-navigation context preservation
 * - Deep state synchronization
 */

class VIB34DContextManager {
    constructor() {
        console.log('🧠 VIB34DContextManager - Bulletproof Context Preservation Initializing...');
        
        // Core state storage
        this.contextCache = new Map();
        this.parameterHistory = new Map();
        this.transitionStates = new Map();
        this.preloadedFaces = new Set();
        
        // Storage keys for persistence
        this.storageKeys = {
            masterState: 'vib34d_master_state',
            sectionStates: 'vib34d_section_states',
            interactionHistory: 'vib34d_interaction_history',
            visualizerStates: 'vib34d_visualizer_states',
            navigationContext: 'vib34d_navigation_context',
            cacheMetadata: 'vib34d_cache_metadata'
        };
        
        // Configuration
        this.config = {
            maxCacheSize: 1000,
            persistenceEnabled: true,
            preloadRadius: 2, // Number of adjacent faces to preload
            compressionEnabled: true,
            debugMode: false,
            autoSaveInterval: 5000, // Auto-save every 5 seconds
            maxHistoryEntries: 100,
            gcThreshold: 0.8 // Garbage collect when cache is 80% full
        };
        
        // Performance monitoring
        this.metrics = {
            cacheHits: 0,
            cacheMisses: 0,
            stateRestorations: 0,
            compressionRatio: 0,
            averageAccessTime: 0,
            preloadSuccessRate: 0
        };
        
        // Active state tracking
        this.currentFace = 0;
        this.previousFace = null;
        this.transitionInProgress = false;
        this.lastInteractionTime = Date.now();
        
        // Initialize systems
        this.initializeStorage();
        this.setupEventListeners();
        this.startMaintenanceLoop();
        
        // Register with global systems
        if (window.vib34d) {
            window.vib34d.contextManager = this;
        } else {
            window.vib34d = { contextManager: this };
        }
    }
    
    /**
     * Initialize storage and restore previous state
     */
    initializeStorage() {
        try {
            // Restore master state
            const savedMasterState = this.loadFromStorage(this.storageKeys.masterState);
            if (savedMasterState) {
                this.restoreMasterState(savedMasterState);
                this.metrics.stateRestorations++;
            }
            
            // Restore section states
            const savedSectionStates = this.loadFromStorage(this.storageKeys.sectionStates);
            if (savedSectionStates) {
                this.restoreSectionStates(savedSectionStates);
            }
            
            // Restore navigation context
            const savedNavContext = this.loadFromStorage(this.storageKeys.navigationContext);
            if (savedNavContext) {
                this.restoreNavigationContext(savedNavContext);
            }
            
            // Load cache metadata for optimization
            const cacheMetadata = this.loadFromStorage(this.storageKeys.cacheMetadata);
            if (cacheMetadata) {
                this.applyCacheMetadata(cacheMetadata);
            }
            
            console.log('✅ Context Manager initialized with restored state');
            
        } catch (error) {
            console.warn('⚠️ Failed to restore previous state:', error);
            this.initializeDefaultState();
        }
    }
    
    /**
     * Set up event listeners for automatic state preservation
     */
    setupEventListeners() {
        // Auto-save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveCurrentState();
        });
        
        // Auto-save on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveCurrentState();
            }
        });
        
        // Track interactions for context building
        window.addEventListener('vib34d:faceTransition', (event) => {
            this.handleFaceTransition(event.detail);
        });
        
        window.addEventListener('vib34d:parameterChange', (event) => {
            this.handleParameterChange(event.detail);
        });
        
        window.addEventListener('vib34d:interactionEvent', (event) => {
            this.handleInteractionEvent(event.detail);
        });
    }
    
    /**
     * Cache parameters for a specific face/section with compression
     */
    cacheParameters(faceIndex, sectionKey, role, parameters) {
        const cacheKey = `${faceIndex}_${sectionKey}_${role}`;
        const timestamp = Date.now();
        
        // Compress parameters if enabled
        const compressedParams = this.config.compressionEnabled 
            ? this.compressParameters(parameters)
            : parameters;
        
        const cacheEntry = {
            parameters: compressedParams,
            timestamp,
            accessCount: 0,
            lastAccessed: timestamp,
            compressed: this.config.compressionEnabled,
            metadata: {
                faceIndex,
                sectionKey,
                role,
                size: JSON.stringify(parameters).length
            }
        };
        
        this.contextCache.set(cacheKey, cacheEntry);
        
        // Trigger garbage collection if needed
        if (this.contextCache.size > this.config.maxCacheSize * this.config.gcThreshold) {
            this.garbageCollectCache();
        }
        
        if (this.config.debugMode) {\n            console.log(`📦 Cached parameters for ${cacheKey}:`, cacheEntry);\n        }
    }
    
    /**
     * Retrieve cached parameters with automatic decompression
     */
    getCachedParameters(faceIndex, sectionKey, role) {
        const cacheKey = `${faceIndex}_${sectionKey}_${role}`;
        const entry = this.contextCache.get(cacheKey);
        
        if (entry) {
            // Update access statistics
            entry.accessCount++;
            entry.lastAccessed = Date.now();
            this.metrics.cacheHits++;
            
            // Decompress if needed
            const parameters = entry.compressed 
                ? this.decompressParameters(entry.parameters)
                : entry.parameters;
            
            if (this.config.debugMode) {
                console.log(`🎯 Cache hit for ${cacheKey}:`, parameters);
            }
            
            return parameters;
        }
        
        this.metrics.cacheMisses++;
        if (this.config.debugMode) {
            console.log(`❌ Cache miss for ${cacheKey}`);
        }
        
        return null;
    }
    
    /**
     * Preload parameters for adjacent hypercube faces
     */
    async preloadAdjacentFaces(currentFace) {
        const adjacentFaces = this.getAdjacentFaces(currentFace, this.config.preloadRadius);
        const preloadPromises = [];
        
        for (const faceIndex of adjacentFaces) {
            if (!this.preloadedFaces.has(faceIndex)) {
                preloadPromises.push(this.preloadFace(faceIndex));
            }
        }
        
        try {
            const results = await Promise.allSettled(preloadPromises);
            const successCount = results.filter(r => r.status === 'fulfilled').length;
            
            this.metrics.preloadSuccessRate = successCount / preloadPromises.length;
            
            if (this.config.debugMode) {\n                console.log(`🔄 Preloaded ${successCount}/${preloadPromises.length} adjacent faces`);\n            }
            
        } catch (error) {
            console.warn('⚠️ Error during face preloading:', error);
        }
    }
    
    /**
     * Handle face transitions with context preservation
     */
    handleFaceTransition(transitionData) {\n        const { fromFace, toFace, transitionType, preserveContext } = transitionData;\n        \n        this.transitionInProgress = true;\n        this.previousFace = fromFace;\n        this.currentFace = toFace;\n        \n        // Save transition state\n        const transitionKey = `${fromFace}_to_${toFace}`;\n        this.transitionStates.set(transitionKey, {\n            timestamp: Date.now(),\n            type: transitionType,\n            preserveContext,\n            parametersSnapshot: this.captureCurrentParameters()\n        });\n        \n        // Preload adjacent faces\n        this.preloadAdjacentFaces(toFace);\n        \n        // Mark face as visited\n        this.preloadedFaces.add(toFace);\n        \n        if (this.config.debugMode) {\n            console.log(`🔄 Face transition: ${fromFace} → ${toFace}`, transitionData);\n        }\n        \n        setTimeout(() => {\n            this.transitionInProgress = false;\n        }, 100);\n    }\n    \n    /**\n     * Handle parameter changes with history tracking\n     */\n    handleParameterChange(changeData) {\n        const { parameterId, oldValue, newValue, source, timestamp } = changeData;\n        \n        // Add to history\n        const historyKey = `${this.currentFace}_${parameterId}`;\n        if (!this.parameterHistory.has(historyKey)) {\n            this.parameterHistory.set(historyKey, []);\n        }\n        \n        const history = this.parameterHistory.get(historyKey);\n        history.push({\n            oldValue,\n            newValue,\n            source,\n            timestamp: timestamp || Date.now(),\n            faceIndex: this.currentFace\n        });\n        \n        // Limit history size\n        if (history.length > this.config.maxHistoryEntries) {\n            history.shift();\n        }\n        \n        this.lastInteractionTime = Date.now();\n        \n        if (this.config.debugMode) {\n            console.log(`📊 Parameter changed: ${parameterId}`, changeData);\n        }\n    }\n    \n    /**\n     * Save current state to persistent storage\n     */\n    saveCurrentState() {\n        try {\n            // Capture current master state\n            const masterState = this.captureCurrentMasterState();\n            this.saveToStorage(this.storageKeys.masterState, masterState);\n            \n            // Capture section states\n            const sectionStates = this.captureCurrentSectionStates();\n            this.saveToStorage(this.storageKeys.sectionStates, sectionStates);\n            \n            // Capture navigation context\n            const navContext = this.captureNavigationContext();\n            this.saveToStorage(this.storageKeys.navigationContext, navContext);\n            \n            // Save cache metadata\n            const cacheMetadata = this.generateCacheMetadata();\n            this.saveToStorage(this.storageKeys.cacheMetadata, cacheMetadata);\n            \n            if (this.config.debugMode) {\n                console.log('💾 Current state saved to persistent storage');\n            }\n            \n        } catch (error) {\n            console.warn('⚠️ Failed to save current state:', error);\n        }\n    }\n    \n    /**\n     * Restore master state from saved data\n     */\n    restoreMasterState(savedState) {\n        if (window.vib3HomeMaster && savedState) {\n            Object.assign(window.vib3HomeMaster.masterState, savedState);\n            console.log('🔄 Master state restored from storage');\n        }\n    }\n    \n    /**\n     * Get adjacent faces for preloading\n     */\n    getAdjacentFaces(currentFace, radius) {\n        const adjacent = new Set();\n        \n        // For hypercube, each face is adjacent to several others\n        // This is a simplified adjacency model - can be enhanced\n        for (let i = 0; i < 8; i++) {\n            if (i !== currentFace) {\n                const distance = this.calculateFaceDistance(currentFace, i);\n                if (distance <= radius) {\n                    adjacent.add(i);\n                }\n            }\n        }\n        \n        return Array.from(adjacent);\n    }\n    \n    /**\n     * Calculate distance between faces (simplified)\n     */\n    calculateFaceDistance(face1, face2) {\n        // Simplified Hamming distance for hypercube faces\n        const xor = face1 ^ face2;\n        return xor.toString(2).split('1').length - 1;\n    }\n    \n    /**\n     * Compress parameters for efficient storage\n     */\n    compressParameters(parameters) {\n        // Simple compression - remove redundant data, round numbers\n        const compressed = {};\n        \n        for (const [key, value] of Object.entries(parameters)) {\n            if (typeof value === 'number') {\n                compressed[key] = Math.round(value * 1000) / 1000; // 3 decimal places\n            } else if (Array.isArray(value)) {\n                compressed[key] = value.map(v => \n                    typeof v === 'number' ? Math.round(v * 1000) / 1000 : v\n                );\n            } else {\n                compressed[key] = value;\n            }\n        }\n        \n        return compressed;\n    }\n    \n    /**\n     * Decompress parameters\n     */\n    decompressParameters(compressed) {\n        // For now, compressed format is the same as regular\n        // This can be enhanced with actual compression algorithms\n        return compressed;\n    }\n    \n    /**\n     * Garbage collect old cache entries\n     */\n    garbageCollectCache() {\n        const entries = Array.from(this.contextCache.entries());\n        \n        // Sort by access count and last accessed time\n        entries.sort((a, b) => {\n            const scoreA = a[1].accessCount * (Date.now() - a[1].lastAccessed);\n            const scoreB = b[1].accessCount * (Date.now() - b[1].lastAccessed);\n            return scoreA - scoreB;\n        });\n        \n        // Remove oldest 20% of entries\n        const removeCount = Math.floor(entries.length * 0.2);\n        for (let i = 0; i < removeCount; i++) {\n            this.contextCache.delete(entries[i][0]);\n        }\n        \n        if (this.config.debugMode) {\n            console.log(`🗑️ Garbage collected ${removeCount} cache entries`);\n        }\n    }\n    \n    /**\n     * Capture current parameters across all systems\n     */\n    captureCurrentParameters() {\n        const snapshot = {};\n        \n        if (window.vib3HomeMaster) {\n            snapshot.masterState = { ...window.vib3HomeMaster.masterState };\n        }\n        \n        if (window.vib34dCore) {\n            snapshot.coreState = window.vib34dCore.getStateSnapshot();\n        }\n        \n        snapshot.timestamp = Date.now();\n        snapshot.currentFace = this.currentFace;\n        \n        return snapshot;\n    }\n    \n    /**\n     * Utility methods for storage\n     */\n    saveToStorage(key, data) {\n        if (this.config.persistenceEnabled) {\n            try {\n                localStorage.setItem(key, JSON.stringify(data));\n            } catch (error) {\n                console.warn(`Failed to save to localStorage: ${key}`, error);\n            }\n        }\n    }\n    \n    loadFromStorage(key) {\n        if (this.config.persistenceEnabled) {\n            try {\n                const data = localStorage.getItem(key);\n                return data ? JSON.parse(data) : null;\n            } catch (error) {\n                console.warn(`Failed to load from localStorage: ${key}`, error);\n                return null;\n            }\n        }\n        return null;\n    }\n    \n    /**\n     * Start maintenance loop for auto-save and optimization\n     */\n    startMaintenanceLoop() {\n        setInterval(() => {\n            this.performMaintenance();\n        }, this.config.autoSaveInterval);\n    }\n    \n    /**\n     * Perform periodic maintenance\n     */\n    performMaintenance() {\n        // Auto-save if there have been recent interactions\n        if (Date.now() - this.lastInteractionTime < this.config.autoSaveInterval * 2) {\n            this.saveCurrentState();\n        }\n        \n        // Update metrics\n        this.updateMetrics();\n        \n        // Cleanup old history entries\n        this.cleanupHistory();\n    }\n    \n    /**\n     * Update performance metrics\n     */\n    updateMetrics() {\n        const totalAccess = this.metrics.cacheHits + this.metrics.cacheMisses;\n        this.metrics.hitRate = totalAccess > 0 ? this.metrics.cacheHits / totalAccess : 0;\n        this.metrics.cacheSize = this.contextCache.size;\n        this.metrics.historySize = this.parameterHistory.size;\n    }\n    \n    /**\n     * Get current performance metrics\n     */\n    getMetrics() {\n        this.updateMetrics();\n        return { ...this.metrics };\n    }\n    \n    /**\n     * Enable/disable debug mode\n     */\n    setDebugMode(enabled) {\n        this.config.debugMode = enabled;\n        console.log(`🐛 Debug mode ${enabled ? 'enabled' : 'disabled'}`);\n    }\n    \n    /**\n     * Clear all cached data\n     */\n    clearCache() {\n        this.contextCache.clear();\n        this.parameterHistory.clear();\n        this.transitionStates.clear();\n        this.preloadedFaces.clear();\n        \n        // Clear persistent storage\n        Object.values(this.storageKeys).forEach(key => {\n            localStorage.removeItem(key);\n        });\n        \n        console.log('🧹 All cache and persistent data cleared');\n    }\n    \n    /**\n     * Helper methods for state capture (to be implemented based on actual system)\n     */\n    captureCurrentMasterState() {\n        return window.vib3HomeMaster ? { ...window.vib3HomeMaster.masterState } : {};\n    }\n    \n    captureCurrentSectionStates() {\n        // Capture section-specific states\n        return {\n            currentFace: this.currentFace,\n            preloadedFaces: Array.from(this.preloadedFaces),\n            timestamp: Date.now()\n        };\n    }\n    \n    captureNavigationContext() {\n        return {\n            currentFace: this.currentFace,\n            previousFace: this.previousFace,\n            transitionInProgress: this.transitionInProgress,\n            lastInteractionTime: this.lastInteractionTime\n        };\n    }\n    \n    restoreSectionStates(savedStates) {\n        if (savedStates.currentFace !== undefined) {\n            this.currentFace = savedStates.currentFace;\n        }\n        if (savedStates.preloadedFaces) {\n            this.preloadedFaces = new Set(savedStates.preloadedFaces);\n        }\n    }\n    \n    restoreNavigationContext(navContext) {\n        this.currentFace = navContext.currentFace || 0;\n        this.previousFace = navContext.previousFace;\n        this.lastInteractionTime = navContext.lastInteractionTime || Date.now();\n    }\n    \n    applyCacheMetadata(metadata) {\n        // Apply cache optimization settings based on metadata\n        if (metadata.optimalCacheSize) {\n            this.config.maxCacheSize = metadata.optimalCacheSize;\n        }\n    }\n    \n    generateCacheMetadata() {\n        return {\n            cacheSize: this.contextCache.size,\n            hitRate: this.metrics.hitRate,\n            optimalCacheSize: Math.max(this.config.maxCacheSize, this.contextCache.size),\n            timestamp: Date.now()\n        };\n    }\n    \n    initializeDefaultState() {\n        this.currentFace = 0;\n        this.previousFace = null;\n        this.transitionInProgress = false;\n        this.lastInteractionTime = Date.now();\n        console.log('🔄 Initialized with default state');\n    }\n    \n    cleanupHistory() {\n        // Remove old history entries to prevent memory bloat\n        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours\n        \n        for (const [key, history] of this.parameterHistory.entries()) {\n            const filteredHistory = history.filter(entry => entry.timestamp > cutoffTime);\n            if (filteredHistory.length !== history.length) {\n                this.parameterHistory.set(key, filteredHistory);\n            }\n        }\n    }\n    \n    async preloadFace(faceIndex) {\n        // Preload face-specific resources\n        try {\n            // This would load geometry, shaders, textures, etc. for the face\n            // For now, just mark as preloaded\n            this.preloadedFaces.add(faceIndex);\n            \n            if (this.config.debugMode) {\n                console.log(`✅ Preloaded face ${faceIndex}`);\n            }\n            \n            return true;\n        } catch (error) {\n            console.warn(`❌ Failed to preload face ${faceIndex}:`, error);\n            return false;\n        }\n    }\n    \n    handleInteractionEvent(eventData) {\n        this.lastInteractionTime = Date.now();\n        \n        // Store interaction for context building\n        const interactionKey = `${this.currentFace}_${eventData.type}_${Date.now()}`;\n        // Could store in a separate interaction history if needed\n        \n        if (this.config.debugMode) {\n            console.log(`👆 Interaction event:`, eventData);\n        }\n    }\n}\n\n// Export for use in other modules\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = VIB34DContextManager;\n}\n\n// Auto-initialize if in browser environment\nif (typeof window !== 'undefined') {\n    window.VIB34DContextManager = VIB34DContextManager;\n}