# VIB3STYLEPACK PARAMETER MANIFEST
## Complete Codex of Parameters and Settings

**Based on ACTUAL hypercube code analysis from:**
- `/mnt/c/Users/millz/CrossDevice/Pixel 9 Pro XL/storage/hypercube code snips/index.html`
- `/mnt/c/Users/millz/CrossDevice/Pixel 9 Pro XL/storage/hypercube code snips/visualizer.js`
- `/mnt/c/Users/millz/CrossDevice/Pixel 9 Pro XL/storage/hypercube code snips/HypercubeCore.js`

---

## CORE SHADER UNIFORMS (All Editor-Controllable)

### Time & Resolution
```glsl
uniform vec2 u_resolution;     // Canvas resolution [width, height]
uniform float u_time;          // Elapsed time in seconds
uniform vec2 u_mouse;          // Mouse position [0-1, 0-1]
```

### 4D Mathematics & Projection
```glsl
uniform float u_dimension;     // 3.0 to 4.0 (3D cube → 4D hypercube)
uniform float u_morphFactor;   // 0.0 to 1.0 (morph intensity)
uniform float u_rotationSpeed; // 0.0 to 2.0 (4D rotation speed)
```

### Grid & Lattice Control
```glsl
uniform float u_gridDensity;   // 5.0 to 20.0 (lattice density)
uniform float u_universeModifier; // 0.1 to 2.0 (universe scaling)
uniform float u_patternIntensity; // 0.0 to 2.0 (overall brightness)
```

### Visual Effects
```glsl
uniform float u_glitchIntensity;  // 0.0 to 1.0 (RGB glitch amount)
uniform float u_plasmaSpeed;      // 0.0 to 2.0 (plasma animation speed)
uniform float u_plasmaScale;      // 0.5 to 3.0 (plasma frequency)
uniform float u_moireIntensity;   // 0.0 to 1.0 (moiré pattern strength)
uniform float u_moireScale;       // 1.0 to 10.0 (moiré pattern scale)
uniform float u_colorShift;       // 0.0 to 1.0 (hue rotation)
```

### Audio Reactivity
```glsl
uniform float u_audioBass;     // 0.0 to 1.0 (bass frequency level)
uniform float u_audioMid;      // 0.0 to 1.0 (mid frequency level)
uniform float u_audioHigh;     // 0.0 to 1.0 (high frequency level)
uniform float u_currentNoteFreq; // 20.0 to 20000.0 (current note frequency)
```

### Color System
```glsl
uniform vec3 u_primaryColor;    // RGB [0-1, 0-1, 0-1] (magenta default)
uniform vec3 u_secondaryColor;  // RGB [0-1, 0-1, 0-1] (cyan default)
uniform vec3 u_backgroundColor; // RGB [0-1, 0-1, 0-1] (dark blue default)
```

### Rendering Modes
```glsl
uniform bool u_inverted;       // Invert colors (false/true)
uniform bool u_simplified;     // Simplified rendering (false/true)
```

---

## HYPERCUBE FACE GEOMETRY MAPPING

### Fixed Face-to-Geometry Assignments
```javascript
hypercubeFaceGeometries = {
    'face-0': 'hypercube',    // HOME (FRONT) - Magenta lattice
    'face-1': 'tetrahedron',  // TECH (RIGHT) - Cyan precision 
    'face-2': 'wave',         // RESEARCH (BACK) - Pink probability
    'face-3': 'sphere',       // MEDIA (LEFT) - Yellow potential
    'face-4': 'fractal',      // INNOVATION (TOP) - Purple recursion
    'face-5': 'crystal',      // CONTEXT (BOTTOM) - Mint complexity
    'face-6': 'torus',        // INNER FRONT - Green flow
    'face-7': 'klein'         // INNER BACK - Orange topology
}
```

### Geometry-Specific Parameters
Each geometry uses the core uniforms but with different mathematical implementations:

#### Hypercube (Default)
- Uses `calculateHypercube(p)` function
- Edge-based lattice with vertex highlighting
- 4D rotation matrices: `rotateXW`, `rotateYW`, `rotateZW`
- Audio modulation on vertex size and edge width

#### Tetrahedron
- Uses `calculateHypertetrahedron(p)` function  
- Plane-based geometry using dot products
- More geometric/line-based for technical sections
- Enhanced edge definition with `planeWidth` control

#### Sphere
- Uses `calculateHypersphere(p)` function
- Spherical shells with latitude/longitude lines
- Shell thickness modulated by audio bass
- Latitude/longitude line density controlled by `u_gridDensity`

#### Plasma
- Uses `calculatePlasma(p)` function
- Multi-sinusoidal wave patterns
- Frequency modulation by audio mid-range
- Contour line visualization of plasma field

---

## 4D ROTATION MATRICES (Core Mathematics)

### Available Rotation Planes
```glsl
mat4 rotateXY(float theta);  // Standard 3D rotation
mat4 rotateXZ(float theta);  // Standard 3D rotation  
mat4 rotateYZ(float theta);  // Standard 3D rotation
mat4 rotateXW(float theta);  // 4D rotation (X-W plane)
mat4 rotateYW(float theta);  // 4D rotation (Y-W plane)
mat4 rotateZW(float theta);  // 4D rotation (Z-W plane)
```

### Projection Functions
```glsl
vec3 project4Dto3D(vec4 p) {
    float w_factor = 2.0 / (2.0 + p.w);
    return vec3(p.x * w_factor, p.y * w_factor, p.z * w_factor);
}
```

---

## JAVASCRIPT STATE MANAGEMENT

### Core State Object (HypercubeCore.js)
```javascript
DEFAULT_STATE = {
    // Core GL / Timing
    time: 0.0,
    resolution: [0, 0],
    mouse: [0.5, 0.5],
    
    // Visual Parameters
    geometryType: 'hypercube',
    projectionMethod: 'perspective',
    dimensions: 4.0,
    morphFactor: 0.5,
    rotationSpeed: 0.3,
    universeModifier: 1.0,
    patternIntensity: 1.0,
    gridDensity: 8.0,
    
    // Effects Parameters
    glitchIntensity: 0.0,
    plasmaSpeed: 0.5,
    plasmaScale: 1.0,
    moireIntensity: 0.0,
    moireScale: 5.0,
    currentNoteFrequency: 440.0,
    
    // Audio Levels
    audioLevels: { bass: 0, mid: 0, high: 0 },
    
    // Color Scheme
    colorScheme: {
        primary: [1.0, 0.2, 0.8],     // Magenta
        secondary: [0.2, 1.0, 1.0],   // Cyan
        background: [0.05, 0.0, 0.2, 1.0] // Dark blue
    }
}
```

### Parameter Update Methods
```javascript
// Update any parameter
hypercubeCore.updateParameters({
    geometryType: 'tetrahedron',
    rotationSpeed: 0.8,
    glitchIntensity: 0.3,
    audioLevels: { bass: 0.7, mid: 0.4, high: 0.2 }
});

// Audio-specific updates
hypercubeCore.setAudioLevels(bass, mid, high, energy);

// Quality/performance settings
hypercubeCore.setQuality('high'); // 'low', 'medium', 'high'
hypercubeCore.setFPS(60);
```

---

## QUALITY SETTINGS & PERFORMANCE

### Quality Levels
```javascript
QUALITY_SETTINGS = {
    low: {
        renderScale: 0.5,
        maxParticles: 5000,
        shadowQuality: 0,
        postProcessing: false
    },
    medium: {
        renderScale: 0.75,
        maxParticles: 20000,
        shadowQuality: 1,
        postProcessing: true
    },
    high: {
        renderScale: 1.0,
        maxParticles: 50000,
        shadowQuality: 2,
        postProcessing: true
    }
}
```

### Particle System Parameters
```javascript
particleState = {
    particlesEnabled: true,
    particleCount: 10000,
    particleSize: 1.0,
    particleSpeed: 0.5
}
```

---

## INTERACTION-DRIVEN PARAMETER MAPPING

### Scroll Reactivity
- **Slow scroll** → Increased `u_gridDensity`, higher `u_patternIntensity`
- **Fast scroll** → Increased `u_glitchIntensity`, higher `u_rotationSpeed`
- **Scroll velocity** → Direct mapping to `u_dimension` (3.0 → 4.0)

### Click/Hold Interactions  
- **Click** → Momentary `u_morphFactor` spike
- **Hold** → Progressive `u_dimension` shift toward 4D
- **Hold duration** → Maps to `u_dimension` parameter

### Mouse/Touch Movement
- **Mouse position** → `u_mouse` uniform for lattice center
- **Movement velocity** → Influences `u_rotationSpeed`

### Audio Mapping
- **Bass** → `u_audioBass` → vertex size, shell thickness
- **Mid** → `u_audioMid` → rotation speed modulation  
- **High** → `u_audioHigh` → glitch intensity, line width

---

## EDITOR DASHBOARD CONTROLS

### Master Control Structure
```javascript
VIB3HomeMaster → UnifiedReactivityBridge → ReactiveHyperAVCore
```

### Configurable Parameters (All sliders/inputs)
1. **Geometry Selection** - Dropdown: hypercube, tetrahedron, sphere, plasma
2. **Dimension Slider** - Range: 3.0 to 4.0
3. **Morph Factor** - Range: 0.0 to 1.0  
4. **Rotation Speed** - Range: 0.0 to 2.0
5. **Grid Density** - Range: 5.0 to 20.0
6. **Glitch Intensity** - Range: 0.0 to 1.0
7. **Pattern Intensity** - Range: 0.0 to 2.0
8. **Color Pickers** - Primary, Secondary, Background
9. **Audio Reactivity** - Bass/Mid/High sensitivity sliders
10. **Quality Settings** - Low/Medium/High dropdown

### Preset System
```json
{
    "presetName": "hypercube_meditation",
    "parameters": {
        "geometryType": "hypercube",
        "dimensions": 3.8,
        "morphFactor": 0.7,
        "rotationSpeed": 0.2,
        "gridDensity": 12.0,
        "glitchIntensity": 0.1,
        "patternIntensity": 0.8,
        "colorScheme": {
            "primary": [1.0, 0.0, 1.0],
            "secondary": [0.0, 1.0, 1.0],
            "background": [0.02, 0.0, 0.1, 1.0]
        }
    }
}
```

---

## DEPENDENCY RELATIONSHIPS

### Core Dependencies
- **WebGL Context** → Required for all rendering
- **Shader Programs** → Dynamically compiled based on geometry type
- **Vertex Buffers** → Full-screen quad for fragment shader rendering
- **Uniform Locations** → Cached and updated when shaders change

### Parameter Dependencies
- **geometryType** → Triggers shader recompilation
- **projectionMethod** → Triggers shader recompilation  
- **Audio levels** → Directly modify visual parameters in real-time
- **Mouse/interaction** → Modifies `u_mouse` and related rotation

### Performance Dependencies
- **Quality setting** → Affects render scale, particle count, post-processing
- **Canvas size** → Updates `u_resolution`, triggers viewport changes
- **FPS limit** → Controls animation loop timing

---

## IMPLEMENTATION NOTES

### Shader Management
- Dynamic GLSL generation based on geometry type
- Preprocessor directives for conditional compilation
- Uniform location caching for performance
- Dirty flag system for efficient uniform updates

### State Synchronization
- VIB3HomeMaster as single source of truth
- UnifiedReactivityBridge for JS↔CSS↔GLSL sync
- Real-time parameter validation and clamping
- Smooth transitions between parameter changes

### Error Handling
- WebGL context loss detection and recovery
- Shader compilation error reporting
- Parameter validation with fallbacks
- Performance monitoring and automatic quality adjustment

---

**This manifest represents the ACTUAL parameter system based on the real hypercube code implementation, not assumptions or made-up mappings.**