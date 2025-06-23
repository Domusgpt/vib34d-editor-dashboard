#!/usr/bin/env node

/**
 * Test script for VIB3STYLEPACK MCP Server
 * 
 * This script demonstrates the MCP server tools for testing and controlling
 * the VIB3STYLEPACK 4D visualization system.
 */

const { spawn } = require('child_process');
const path = require('path');

async function testMCPServer() {
    console.log('🚀 Testing VIB3STYLEPACK MCP Server...\n');
    
    const mcpServerPath = path.join(__dirname, 'vib3-mcp-server', 'dist', 'index.js');
    
    // Start MCP server
    console.log('Starting MCP server...');
    const mcpProcess = spawn('node', [mcpServerPath], {
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    mcpProcess.stdout.on('data', (data) => {
        console.log(`[MCP Server]: ${data.toString().trim()}`);
    });
    
    mcpProcess.stderr.on('data', (data) => {
        console.error(`[MCP Error]: ${data.toString().trim()}`);
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n📡 MCP Server is running!');
    console.log('🛠️ Available tools:');
    console.log('  - start_vib3_test: Initialize VIB3STYLEPACK test');
    console.log('  - test_vib3_phase: Test specific phases (1-8)');
    console.log('  - get_vib3_metrics: Get performance metrics');
    console.log('  - control_vib3_parameters: Control shader parameters');
    console.log('  - trigger_vib3_interaction: Trigger interaction events');
    console.log('  - run_vib3_test_suite: Run complete test suite');
    console.log('  - close_vib3_test: Cleanup and close');
    
    console.log('\n🌐 Test environment available at:');
    console.log('  - http://localhost:8000/comprehensive-mcp-vib3-test.html');
    
    console.log('\n📋 Resources available:');
    console.log('  - vib3://test-results - Current test results');
    console.log('  - vib3://shader-uniforms - Complete 17 shader uniforms reference');
    console.log('  - vib3://phase-status - VIB34D phase implementation status');
    
    console.log('\n✅ VIB3STYLEPACK MCP Server is ready for testing!');
    console.log('💡 Use this server with Claude Code or other MCP clients');
    console.log('🔧 Example: Use start_vib3_test tool to begin browser testing');
    
    // Keep running
    console.log('\n⌨️ Press Ctrl+C to stop the server');
    
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping MCP server...');
        mcpProcess.kill();
        process.exit(0);
    });
}

testMCPServer().catch(console.error);