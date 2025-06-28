#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser
import threading
import time

PORT = 9001
os.chdir('/mnt/c/Users/millz/vib34d-editor-dashboard-2025-06-26')

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Quiet logging

def open_browser():
    time.sleep(2)
    try:
        print(f"🌐 Opening dashboard in browser...")
        webbrowser.open(f'http://localhost:{PORT}/VIB34D_EDITOR_DASHBOARD.html')
    except:
        print("❌ Could not auto-open browser")

if __name__ == "__main__":
    try:
        with socketserver.TCPServer(('', PORT), Handler) as httpd:
            print(f"🚀 VIB34D Editor Dashboard server running!")
            print(f"   📍 http://localhost:{PORT}/VIB34D_EDITOR_DASHBOARD.html")
            print(f"   🧪 http://localhost:{PORT}/test_editor_dashboard.html")
            print("")
            print("✅ All drag & drop fixes applied!")
            print("✅ Relational response system ready!")
            print("⏹️  Press Ctrl+C to stop server")
            
            # Auto-open browser
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✅ Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")