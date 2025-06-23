#!/usr/bin/env node

/**
 * TEST THE FIXED BLOG SYSTEM
 * Apply the fixes and test if hypercube faces work properly
 */

const puppeteer = require('puppeteer');

async function testFixedBlog() {
    console.log('🔧 TESTING FIXED HYPERCUBE BLOG SYSTEM');
    console.log('='.repeat(50));
    
    let browser = null;
    let page = null;
    
    try {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        page = await browser.newPage();
        
        // Capture key messages
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('🔧') || text.includes('✅') || text.includes('❌') || text.includes('Switching')) {
                console.log(`[BROWSER]: ${text}`);
            }
        });
        
        // Load blog
        console.log('📄 Loading VIB3CODE blog...');
        await page.goto('http://localhost:8000/vib3code-morphing-blog.html', { 
            waitUntil: 'networkidle0', 
            timeout: 30000 
        });
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Inject the fix
        console.log('🔧 Injecting hypercube face fixes...');
        const fixScript = require('fs').readFileSync('fix-hypercube-faces.js', 'utf8');
        await page.evaluate(fixScript);
        
        // Apply the fix
        await page.evaluate(() => {
            window.fixHypercubeFaces();
        });
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take screenshot after fix
        await page.screenshot({ path: 'fixed-blog-after-fix.png' });
        console.log('📸 Screenshot after fix: fixed-blog-after-fix.png');
        
        // Test face switching
        console.log('\n🔄 Testing face transitions...');
        
        for (let i = 0; i < 6; i++) {
            console.log(`Testing face ${i}...`);
            
            await page.keyboard.press('ArrowRight');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check current state
            const faceState = await page.evaluate(() => {
                const activeFace = document.querySelector('.hypercube-face.active');
                const totalFaces = document.querySelectorAll('.hypercube-face').length;
                const canvasesWithContent = Array.from(document.querySelectorAll('canvas')).filter(canvas => {
                    const gl = canvas.getContext('webgl');
                    if (gl) {
                        const pixels = new Uint8Array(4);
                        gl.readPixels(canvas.width/2, canvas.height/2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                        return pixels.some(p => p > 0);
                    }
                    return false;
                }).length;
                
                return {
                    activeFaceId: activeFace ? activeFace.id : 'none',
                    totalFaces: totalFaces,
                    renderingCanvases: canvasesWithContent,
                    hypercubeFacesExists: !!window.hypercubeFaces,
                    faceCount: window.hypercubeFaces ? Object.keys(window.hypercubeFaces).length : 0
                };
            });
            
            console.log(`  Active: ${faceState.activeFaceId}`);
            console.log(`  Rendering canvases: ${faceState.renderingCanvases}/${faceState.totalFaces}`);
            
            await page.screenshot({ path: `fixed-blog-face-${i}.png` });
        }
        
        // Final analysis
        console.log('\n📊 Final Analysis...');
        
        const finalCheck = await page.evaluate(() => {
            const analysis = {
                totalFaces: document.querySelectorAll('.hypercube-face').length,
                facesWithCanvas: 0,
                activeCanvases: 0,
                hypercubeFaceSystem: !!window.hypercubeFaces
            };
            
            document.querySelectorAll('.hypercube-face').forEach(face => {
                if (face.querySelector('canvas')) {
                    analysis.facesWithCanvas++;
                }
            });
            
            document.querySelectorAll('canvas').forEach(canvas => {
                const gl = canvas.getContext('webgl');
                if (gl) {
                    const pixels = new Uint8Array(4);
                    gl.readPixels(canvas.width/2, canvas.height/2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                    if (pixels.some(p => p > 0)) {
                        analysis.activeCanvases++;
                    }
                }
            });
            
            return analysis;
        });
        
        console.log('\n🎯 RESULTS:');
        console.log(`📊 Total faces: ${finalCheck.totalFaces}`);
        console.log(`🎨 Faces with canvas: ${finalCheck.facesWithCanvas}`);
        console.log(`✨ Active rendering: ${finalCheck.activeCanvases}`);
        console.log(`🔧 Fix applied: ${finalCheck.hypercubeFaceSystem}`);
        
        if (finalCheck.facesWithCanvas === finalCheck.totalFaces && finalCheck.activeCanvases > 0) {
            console.log('🎉 SUCCESS: Hypercube faces are now working!');
        } else {
            console.log('❌ STILL BROKEN: Need more fixes');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        // Keep browser open for manual inspection
        console.log('\n🔍 Browser kept open for manual inspection...');
        console.log('Press Ctrl+C to close');
        
        process.on('SIGINT', async () => {
            if (browser) await browser.close();
            process.exit(0);
        });
        
        // Wait indefinitely
        await new Promise(() => {});
    }
}

testFixedBlog().catch(console.error);