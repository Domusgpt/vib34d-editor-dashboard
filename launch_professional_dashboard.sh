#!/bin/bash

# VIB34D Professional Dashboard Launch Script
# Complete system deployment with all optimizations

echo "🚀 VIB34D Professional Dashboard - Complete System Launcher"
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PORT=8080
FALLBACK_PORT=3000
PROJECT_DIR="/mnt/c/Users/millz/vib34d-editor-dashboard-2025-06-26"
DASHBOARD_FILE="VIB34D_PROFESSIONAL_DASHBOARD_COMPLETE.html"

echo -e "${CYAN}📍 Project Directory: ${PROJECT_DIR}${NC}"
echo -e "${CYAN}🎯 Dashboard File: ${DASHBOARD_FILE}${NC}"
echo ""

# Function to check if port is available
check_port() {
    local port=$1
    if netstat -tuln | grep -q ":${port} "; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to find available port
find_available_port() {
    local start_port=$1
    local current_port=$start_port
    
    while [ $current_port -lt $((start_port + 100)) ]; do
        if check_port $current_port; then
            echo $current_port
            return 0
        fi
        ((current_port++))
    done
    
    echo $FALLBACK_PORT
}

# Pre-flight checks
echo -e "${YELLOW}🔍 Running pre-flight checks...${NC}"

# Check if we're in the right directory
if [ ! -f "$DASHBOARD_FILE" ]; then
    echo -e "${RED}❌ Dashboard file not found: $DASHBOARD_FILE${NC}"
    echo -e "${YELLOW}🔍 Searching for dashboard file...${NC}"
    
    if [ -f "VIB34D_EDITOR_DASHBOARD.html" ]; then
        DASHBOARD_FILE="VIB34D_EDITOR_DASHBOARD.html"
        echo -e "${GREEN}✅ Found alternative dashboard: $DASHBOARD_FILE${NC}"
    else
        echo -e "${RED}❌ No dashboard file found. Please run from the correct directory.${NC}"
        exit 1
    fi
fi

# Check for core dependencies
echo -e "${YELLOW}🔍 Checking core system files...${NC}"

REQUIRED_FILES=(
    "VIB34D_WORKING_CORE_ARCHITECTURE.js"
    "VIB34D_WEBGL_PERFORMANCE_SYSTEM.js"
    "core/VIB34DContextManager.js"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Found: $file${NC}"
    else
        echo -e "${YELLOW}⚠️  Missing: $file${NC}"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some files are missing, but continuing with available components...${NC}"
fi

# Find available port
echo -e "${YELLOW}🔍 Finding available port...${NC}"
AVAILABLE_PORT=$(find_available_port $PORT)

if [ $AVAILABLE_PORT -eq $PORT ]; then
    echo -e "${GREEN}✅ Port $PORT is available${NC}"
else
    echo -e "${YELLOW}⚠️  Port $PORT is in use, using port $AVAILABLE_PORT instead${NC}"
fi

# Check for Python (preferred for HTTP server)
echo -e "${YELLOW}🔍 Checking for web server capabilities...${NC}"

if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✅ Python 3 found - using Python HTTP server${NC}"
    SERVER_CMD="python3 -m http.server $AVAILABLE_PORT"
    SERVER_TYPE="Python 3"
elif command -v python &> /dev/null; then
    echo -e "${GREEN}✅ Python found - using Python HTTP server${NC}"
    SERVER_CMD="python -m SimpleHTTPServer $AVAILABLE_PORT"
    SERVER_TYPE="Python 2"
elif command -v node &> /dev/null && command -v npx &> /dev/null; then
    echo -e "${GREEN}✅ Node.js found - using live-server${NC}"
    SERVER_CMD="npx live-server --port=$AVAILABLE_PORT --no-browser"
    SERVER_TYPE="Node.js live-server"
else
    echo -e "${RED}❌ No suitable web server found${NC}"
    echo -e "${YELLOW}Please install Python or Node.js to run the dashboard${NC}"
    exit 1
fi

echo ""
echo -e "${PURPLE}🎯 Launch Configuration:${NC}"
echo -e "   Server Type: ${SERVER_TYPE}"
echo -e "   Port: ${AVAILABLE_PORT}"
echo -e "   Dashboard: ${DASHBOARD_FILE}"
echo -e "   URL: http://localhost:${AVAILABLE_PORT}/${DASHBOARD_FILE}"
echo ""

# Create launch info file
cat > launch_info.json << EOF
{
    "launchTime": "$(date -Iseconds)",
    "serverType": "$SERVER_TYPE",
    "port": $AVAILABLE_PORT,
    "dashboardFile": "$DASHBOARD_FILE",
    "url": "http://localhost:$AVAILABLE_PORT/$DASHBOARD_FILE",
    "coreFiles": [
        "VIB34D_WORKING_CORE_ARCHITECTURE.js",
        "VIB34D_WEBGL_PERFORMANCE_SYSTEM.js",
        "core/VIB34DContextManager.js"
    ],
    "features": {
        "contextPreservation": true,
        "webglOptimization": true,
        "performanceMonitoring": true,
        "fallbackSystem": true
    }
}
EOF

echo -e "${GREEN}💾 Launch configuration saved to launch_info.json${NC}"

# Ask user if they want to continue
echo -e "${CYAN}🚀 Ready to launch VIB34D Professional Dashboard${NC}"
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo -e "${PURPLE}🎬 Starting VIB34D Professional Dashboard...${NC}"
echo -e "${CYAN}========================================${NC}"

# Start the server
echo -e "${GREEN}🌐 Starting $SERVER_TYPE server on port $AVAILABLE_PORT...${NC}"
echo -e "${YELLOW}📂 Serving from: $(pwd)${NC}"
echo ""
echo -e "${PURPLE}🎯 Dashboard URL: ${NC}${BLUE}http://localhost:$AVAILABLE_PORT/$DASHBOARD_FILE${NC}"
echo ""
echo -e "${CYAN}🎨 Features Available:${NC}"
echo -e "   ✅ WebGL Performance Optimization"
echo -e "   ✅ Context Preservation System"
echo -e "   ✅ 33+ Simultaneous Hypercube Visualizations"
echo -e "   ✅ Intelligent Resource Management"
echo -e "   ✅ Real-time Performance Monitoring"
echo -e "   ✅ Drag & Drop Interface"
echo -e "   ✅ Live Parameter Adjustment"
echo -e "   ✅ Code Export & Deployment"
echo ""
echo -e "${YELLOW}📝 Usage Instructions:${NC}"
echo -e "   1. Drag components from left panel to workspace"
echo -e "   2. Select elements to adjust properties"
echo -e "   3. Use geometry selector to change visualizations"
echo -e "   4. Monitor performance in real-time"
echo -e "   5. Export code or deploy live when ready"
echo ""
echo -e "${RED}🛑 To stop the server: Press Ctrl+C${NC}"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down VIB34D Professional Dashboard...${NC}"
    echo -e "${GREEN}✅ Server stopped${NC}"
    echo -e "${CYAN}👋 Thank you for using VIB34D Professional Dashboard!${NC}"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Open browser if possible (for Windows/WSL)
if command -v cmd.exe &> /dev/null; then
    echo -e "${CYAN}🌐 Opening browser...${NC}"
    cmd.exe /c start "http://localhost:$AVAILABLE_PORT/$DASHBOARD_FILE" 2>/dev/null &
elif command -v wslview &> /dev/null; then
    echo -e "${CYAN}🌐 Opening browser...${NC}"
    wslview "http://localhost:$AVAILABLE_PORT/$DASHBOARD_FILE" &
elif command -v xdg-open &> /dev/null; then
    echo -e "${CYAN}🌐 Opening browser...${NC}"
    xdg-open "http://localhost:$AVAILABLE_PORT/$DASHBOARD_FILE" &
fi

# Start the server
eval $SERVER_CMD

# This line should not be reached unless server exits unexpectedly
echo -e "${RED}❌ Server exited unexpectedly${NC}"
exit 1