#!/bin/bash

# VIB34D Professional Dashboard - Deployment Package Builder
# Creates a complete, self-contained deployment package

echo "📦 VIB34D Professional Dashboard - Deployment Package Builder"
echo "============================================================="

# Configuration
PACKAGE_NAME="vib34d-professional-dashboard"
VERSION="1.0.0"
BUILD_DIR="build"
DIST_DIR="dist"
PACKAGE_DIR="${PACKAGE_NAME}-${VERSION}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🎯 Building deployment package: ${PACKAGE_NAME} v${VERSION}${NC}"
echo ""

# Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -rf "$BUILD_DIR" "$DIST_DIR" "${PACKAGE_NAME}"*.tar.gz "${PACKAGE_NAME}"*.zip
mkdir -p "$BUILD_DIR" "$DIST_DIR"

# Core files to include
CORE_FILES=(
    "VIB34D_PROFESSIONAL_DASHBOARD_COMPLETE.html"
    "VIB34D_WORKING_CORE_ARCHITECTURE.js"
    "VIB34D_WEBGL_PERFORMANCE_SYSTEM.js"
    "VIB34D_WEBGL_FALLBACK.js"
    "VIB34D_MOIRE_RGB_SYSTEM.js"
    "VIB34D_INTEGRATED_SYSTEM_BRIDGE.js"
    "VIB34D_COMPLETE_SYSTEM_TEST.js"
    "launch_professional_dashboard.sh"
)

# Core directory
CORE_DIRS=(
    "core"
    "presets"
)

# Optional files (include if they exist)
OPTIONAL_FILES=(
    "VIB34D_EDITOR_DASHBOARD.html"
    "README.md"
    "CLAUDE.md"
)

echo -e "${YELLOW}📋 Checking required files...${NC}"

# Check core files
MISSING_CORE=()
for file in "${CORE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Found: $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        MISSING_CORE+=("$file")
    fi
done

if [ ${#MISSING_CORE[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing core files. Cannot continue build.${NC}"
    echo -e "${YELLOW}Missing files:${NC}"
    for file in "${MISSING_CORE[@]}"; do
        echo -e "   - $file"
    done
    exit 1
fi

echo -e "${GREEN}✅ All core files found${NC}"

# Create package structure
echo -e "${YELLOW}📁 Creating package structure...${NC}"

PACKAGE_PATH="$BUILD_DIR/$PACKAGE_DIR"
mkdir -p "$PACKAGE_PATH"
mkdir -p "$PACKAGE_PATH/assets"
mkdir -p "$PACKAGE_PATH/docs"
mkdir -p "$PACKAGE_PATH/scripts"
mkdir -p "$PACKAGE_PATH/tests"

# Copy core files
echo -e "${YELLOW}📥 Copying core files...${NC}"

for file in "${CORE_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$PACKAGE_PATH/"
        echo -e "   ✅ Copied: $file"
    fi
done

# Copy core directories
for dir in "${CORE_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        cp -r "$dir" "$PACKAGE_PATH/"
        echo -e "   ✅ Copied directory: $dir"
    else
        echo -e "   ⚠️  Directory not found: $dir"
    fi
done

# Copy optional files
echo -e "${YELLOW}📥 Copying optional files...${NC}"
for file in "${OPTIONAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$PACKAGE_PATH/"
        echo -e "   ✅ Copied optional: $file"
    else
        echo -e "   ⚠️  Optional file not found: $file"
    fi
done

# Create package.json
echo -e "${YELLOW}📝 Creating package.json...${NC}"
cat > "$PACKAGE_PATH/package.json" << EOF
{
  "name": "$PACKAGE_NAME",
  "version": "$VERSION",
  "description": "VIB34D Professional Dashboard - Complete 4D Hypercube Visualization System",
  "main": "VIB34D_PROFESSIONAL_DASHBOARD_COMPLETE.html",
  "scripts": {
    "start": "./launch_professional_dashboard.sh",
    "test": "node VIB34D_COMPLETE_SYSTEM_TEST.js",
    "serve": "python3 -m http.server 8080"
  },
  "keywords": [
    "vib34d",
    "hypercube",
    "4d-visualization",
    "webgl",
    "performance-optimization",
    "context-preservation",
    "professional-dashboard"
  ],
  "author": "Paul Phillips <phillips.paul.email@gmail.com>",
  "license": "PRIVATE",
  "engines": {
    "node": ">=14.0.0",
    "python": ">=3.6.0"
  },
  "features": {
    "webglOptimization": true,
    "contextPreservation": true,
    "performanceMonitoring": true,
    "fallbackRendering": true,
    "professionalInterface": true,
    "maxSimultaneousVisualizers": 33
  },
  "requirements": {
    "webgl": "WebGL 1.0 or higher",
    "memory": "Minimum 2GB RAM recommended",
    "browser": "Modern browser with ES6 support"
  },
  "build": {
    "timestamp": "$(date -Iseconds)",
    "builder": "VIB34D Deployment Package Builder v1.0"
  }
}
EOF

# Create README for package
echo -e "${YELLOW}📝 Creating package README...${NC}"
cat > "$PACKAGE_PATH/README.md" << 'EOF'
# VIB34D Professional Dashboard

## Complete 4D Hypercube Visualization System

This package contains the complete VIB34D Professional Dashboard system with all performance optimizations and context preservation features.

### 🚀 Quick Start

1. **Extract the package**
   ```bash
   tar -xzf vib34d-professional-dashboard-1.0.0.tar.gz
   cd vib34d-professional-dashboard-1.0.0
   ```

2. **Launch the dashboard**
   ```bash
   ./launch_professional_dashboard.sh
   ```

3. **Open your browser**
   Navigate to: http://localhost:8080/VIB34D_PROFESSIONAL_DASHBOARD_COMPLETE.html

### ✨ Features

- **🔮 33+ Simultaneous Hypercube Visualizations** - Handle complex multi-dimensional data
- **⚡ WebGL Performance Optimization** - Context pooling and resource management
- **🧠 Context Preservation** - Maintain state across hypercube face transitions
- **🎨 Professional Interface** - Drag & drop component builder
- **📊 Real-time Performance Monitoring** - Track FPS, memory, and system health
- **🛡️ Fallback Rendering** - Canvas 2D fallback when WebGL unavailable
- **💾 Export & Deployment** - Generate production-ready applications

### 📋 System Requirements

- **Browser**: Modern browser with WebGL support
- **Memory**: Minimum 2GB RAM (4GB+ recommended)
- **Network**: Local server (Python or Node.js)

### 🔧 Installation Options

#### Option 1: Python Server (Recommended)
```bash
python3 -m http.server 8080
```

#### Option 2: Node.js Server
```bash
npx live-server --port=8080
```

#### Option 3: Use Launch Script
```bash
chmod +x launch_professional_dashboard.sh
./launch_professional_dashboard.sh
```

### 🧪 Testing

Run the complete system test suite:
```bash
# Open the dashboard and the test will run automatically
# Or run programmatically:
node VIB34D_COMPLETE_SYSTEM_TEST.js
```

### 🎯 Usage

1. **Drag Components** - Drag elements from the left panel to the workspace
2. **Configure Properties** - Select elements to adjust visualization parameters
3. **Monitor Performance** - Watch real-time metrics in the right panel
4. **Export Applications** - Generate standalone HTML applications
5. **Deploy Live** - Create live deployment packages

### 🗂️ File Structure

```
vib34d-professional-dashboard-1.0.0/
├── VIB34D_PROFESSIONAL_DASHBOARD_COMPLETE.html    # Main dashboard
├── VIB34D_WORKING_CORE_ARCHITECTURE.js            # Core 4D geometry system
├── VIB34D_WEBGL_PERFORMANCE_SYSTEM.js             # Performance optimization
├── VIB34D_WEBGL_FALLBACK.js                       # Canvas 2D fallback
├── VIB34D_COMPLETE_SYSTEM_TEST.js                 # Test suite
├── launch_professional_dashboard.sh               # Launch script
├── core/                                          # Core modules
│   ├── VIB34DContextManager.js                   # Context preservation
│   └── ...                                       # Additional core files
├── presets/                                       # Configuration presets
└── README.md                                      # This file
```

### 🔍 Troubleshooting

#### Dashboard won't load
- Ensure you're running a local server (not file:// protocol)
- Check browser console for errors
- Verify all files are present

#### WebGL errors
- Update graphics drivers
- Try a different browser
- System will automatically fallback to Canvas 2D

#### Performance issues
- Reduce number of simultaneous visualizations
- Lower quality settings in performance panel
- Check available system memory

### 📞 Support

For issues, questions, or feature requests:
- Check the browser console for error messages
- Review the test suite results
- Verify system requirements are met

### 🏗️ Architecture

The VIB34D Professional Dashboard is built with:

- **Modular Architecture** - Pluggable components and systems
- **Performance-First Design** - Optimized for 33+ concurrent visualizations
- **Graceful Degradation** - Fallbacks for different system capabilities
- **Context Preservation** - Maintain state across complex interactions
- **Production Ready** - Enterprise-grade reliability and features

### 📜 License

Private/Proprietary - All rights reserved.

---

**VIB34D Professional Dashboard v1.0.0**
*The ultimate 4D visualization system*
EOF

# Create installation script
echo -e "${YELLOW}📝 Creating installation script...${NC}"
cat > "$PACKAGE_PATH/install.sh" << 'EOF'
#!/bin/bash

echo "🚀 VIB34D Professional Dashboard - Installation"
echo "==============================================="

# Check for Python
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    echo "✅ Python found"
    PYTHON_CMD="python"
else
    echo "❌ Python not found. Please install Python to run the dashboard."
    exit 1
fi

# Check for Node.js (optional)
if command -v node &> /dev/null; then
    echo "✅ Node.js found (optional enhancement available)"
fi

# Make launch script executable
chmod +x launch_professional_dashboard.sh

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 To start the dashboard:"
echo "   ./launch_professional_dashboard.sh"
echo ""
echo "🌐 Or manually start server:"
echo "   $PYTHON_CMD -m http.server 8080"
echo "   Then open: http://localhost:8080/VIB34D_PROFESSIONAL_DASHBOARD_COMPLETE.html"
EOF

chmod +x "$PACKAGE_PATH/install.sh"

# Create deployment guide
echo -e "${YELLOW}📝 Creating deployment guide...${NC}"
cat > "$PACKAGE_PATH/DEPLOYMENT.md" << 'EOF'
# VIB34D Professional Dashboard - Deployment Guide

## Production Deployment Options

### 1. Static File Server

Deploy to any static file server (Apache, Nginx, etc.):

```bash
# Copy files to web server directory
cp -r * /var/www/html/vib34d/

# Configure web server to serve files
# Ensure proper MIME types for .js files
```

### 2. CDN Deployment

For global distribution:

1. Upload all files to CDN
2. Update any relative paths if needed
3. Ensure CORS headers are properly configured

### 3. Docker Deployment

Create a simple Docker container:

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

### 4. Cloud Platform Deployment

#### Netlify
- Drag and drop the entire folder to Netlify
- Or connect to Git repository

#### Vercel
- Use `vercel` CLI to deploy
- Or connect to Git repository

#### AWS S3 + CloudFront
- Upload to S3 bucket
- Configure CloudFront distribution
- Enable static website hosting

### Performance Considerations

- **Gzip Compression**: Enable for .js and .html files
- **Caching**: Set appropriate cache headers for assets
- **CDN**: Use CDN for global distribution
- **HTTP/2**: Enable HTTP/2 for better performance

### Security Considerations

- **HTTPS**: Always use HTTPS in production
- **CSP**: Consider Content Security Policy headers
- **CORS**: Configure CORS if needed for external integrations

### Monitoring

- Monitor WebGL performance across different devices
- Track memory usage in production
- Monitor for JavaScript errors
- Test fallback systems regularly
EOF

# Create changelog
echo -e "${YELLOW}📝 Creating changelog...${NC}"
cat > "$PACKAGE_PATH/CHANGELOG.md" << EOF
# Changelog

## v1.0.0 - $(date +%Y-%m-%d)

### 🎉 Initial Release

#### ✨ Features
- Complete VIB34D Professional Dashboard system
- Support for 33+ simultaneous hypercube visualizations
- WebGL performance optimization with context pooling
- Context preservation across hypercube face transitions
- Real-time performance monitoring
- Professional drag-and-drop interface
- Code export and live deployment
- Comprehensive fallback systems
- Complete test suite

#### 🏗️ Architecture
- Modular component system
- Performance-first design
- Graceful degradation
- Production-ready reliability

#### 🧪 Testing
- Complete system test suite
- Integration tests
- Stress testing
- Performance validation

#### 📦 Package Contents
- Main dashboard application
- Core 4D geometry system
- Performance optimization system
- Context management system
- WebGL fallback system
- Launch scripts and utilities
- Comprehensive documentation

---

**Built by Paul Phillips (domusgpt)**  
*VIB34D Professional Dashboard v1.0.0*
EOF

# Create build info
echo -e "${YELLOW}📝 Creating build info...${NC}"
cat > "$PACKAGE_PATH/BUILD_INFO.txt" << EOF
VIB34D Professional Dashboard - Build Information
================================================

Build Date: $(date)
Build Version: $VERSION
Build Environment: $(uname -a)
Builder: VIB34D Deployment Package Builder

Core Files Included:
$(for file in "${CORE_FILES[@]}"; do echo "  - $file"; done)

Core Directories Included:
$(for dir in "${CORE_DIRS[@]}"; do echo "  - $dir/"; done)

Package Structure:
  - Main application files
  - Core system modules
  - Configuration presets
  - Documentation
  - Test suite
  - Launch utilities

Features:
  ✅ WebGL Performance Optimization
  ✅ Context Preservation System
  ✅ 33+ Simultaneous Visualizations
  ✅ Professional Dashboard Interface
  ✅ Real-time Performance Monitoring
  ✅ Fallback Rendering Systems
  ✅ Export and Deployment Tools
  ✅ Comprehensive Test Suite

Requirements:
  - Modern browser with WebGL support
  - Local server (Python/Node.js)
  - Minimum 2GB RAM (4GB+ recommended)

Build Completed: $(date)
EOF

# Create archive packages
echo -e "${YELLOW}📦 Creating archive packages...${NC}"

cd "$BUILD_DIR"

# Create tar.gz
echo -e "   📦 Creating tar.gz archive..."
tar -czf "../$DIST_DIR/${PACKAGE_NAME}-${VERSION}.tar.gz" "$PACKAGE_DIR"

# Create zip
echo -e "   📦 Creating zip archive..."
zip -r "../$DIST_DIR/${PACKAGE_NAME}-${VERSION}.zip" "$PACKAGE_DIR" > /dev/null

cd ..

# Generate checksums
echo -e "${YELLOW}🔐 Generating checksums...${NC}"
cd "$DIST_DIR"

if command -v sha256sum &> /dev/null; then
    sha256sum "${PACKAGE_NAME}-${VERSION}".* > "${PACKAGE_NAME}-${VERSION}.sha256"
    echo -e "   ✅ SHA256 checksums created"
elif command -v shasum &> /dev/null; then
    shasum -a 256 "${PACKAGE_NAME}-${VERSION}".* > "${PACKAGE_NAME}-${VERSION}.sha256"
    echo -e "   ✅ SHA256 checksums created"
else
    echo -e "   ⚠️  SHA256 utility not found, skipping checksums"
fi

cd ..

# Build summary
echo ""
echo -e "${GREEN}✅ BUILD COMPLETE${NC}"
echo -e "${CYAN}==================${NC}"
echo ""
echo -e "${PURPLE}📦 Package: ${NC}${PACKAGE_NAME} v${VERSION}"
echo -e "${PURPLE}📁 Location: ${NC}${DIST_DIR}/"
echo ""
echo -e "${YELLOW}📋 Files created:${NC}"
ls -la "$DIST_DIR"
echo ""

# Calculate sizes
TAR_SIZE=$(du -h "$DIST_DIR/${PACKAGE_NAME}-${VERSION}.tar.gz" | cut -f1)
ZIP_SIZE=$(du -h "$DIST_DIR/${PACKAGE_NAME}-${VERSION}.zip" | cut -f1)

echo -e "${CYAN}📊 Package sizes:${NC}"
echo -e "   📦 TAR.GZ: ${TAR_SIZE}"
echo -e "   📦 ZIP: ${ZIP_SIZE}"
echo ""

echo -e "${GREEN}🚀 Deployment Instructions:${NC}"
echo -e "   1. Extract: tar -xzf ${PACKAGE_NAME}-${VERSION}.tar.gz"
echo -e "   2. Install: cd ${PACKAGE_DIR} && ./install.sh"
echo -e "   3. Launch: ./launch_professional_dashboard.sh"
echo ""

echo -e "${PURPLE}🎯 Ready for deployment!${NC}"
echo -e "${CYAN}The VIB34D Professional Dashboard is now packaged and ready to deploy.${NC}"