import os
import subprocess
import threading
import time
import requests
import re
from dotenv import load_dotenv
from flask_cors import CORS
from jeevika import app

load_dotenv()

PORT = 8030
GIST_ID = os.getenv("GIST_ID", "")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
PUBLIC_URL = None

def update_gist_with_url(url):
    """Update GitHub Gist with public API URL"""
    if not GIST_ID or not GITHUB_TOKEN:
        return

    try:
        gist_url = f"https://api.github.com/gists/{GIST_ID}"
        
        config_content = {
            "apiUrl": url,
            "lastUpdated": time.strftime('%Y-%m-%dT%H:%M:%SZ'),
            "status": "online"
        }
        
        payload = {
            "files": {
                "jeevika-api-config.json": {
                    "content": str(config_content).replace("'", '"')
                }
            }
        }
        
        response = requests.patch(
            gist_url,
            json=payload,
            headers={"Authorization": f"token {GITHUB_TOKEN}"},
            timeout=5
        )
        
        if response.status_code == 200:
            print(f"✅ Gist updated with new URL")
        
    except Exception:
        pass

def start_localhost_run_tunnel():
    """Start localhost.run SSH tunnel and extract unique public URL"""
    global PUBLIC_URL
    
    try:
        print("🌐 Initializing localhost.run tunnel...")
        
        # Use tunnel.localhost.run for unique .lhr.life URLs
        process = subprocess.Popen(
            [
                'ssh',
                '-o', 'StrictHostKeyChecking=no',
                '-R', f'80:localhost:{PORT}',
                'tunnel.localhost.run'  # KEY: Use tunnel.localhost.run not localhost.run
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Read output to find unique tunnel URL
        for line in iter(process.stdout.readline, ''):
            if line:
                # Look for pattern like: "https://abc123xyz.lhr.life"
                match = re.search(r'https://([a-z0-9\-]+)\.lhr\.life', line)
                
                if match:
                    PUBLIC_URL = match.group(0)
                    
                    print("\n" + "=" * 70)
                    print("✅ PUBLIC API TUNNEL READY!")
                    print("=" * 70)
                    print(f"\n🔗 Public URL: {PUBLIC_URL}")
                    print(f"\n📝 Update your frontend api.js:")
                    print(f'   const backend = "{PUBLIC_URL}";')
                    print(f"\n💡 Or set in Gist config for auto-update")
                    print("=" * 70 + "\n")
                    
                    # Update Gist if configured
                    update_gist_with_url(PUBLIC_URL)
                    return
    
    except Exception as e:
        print(f"❌ Tunnel error: {e}")

if __name__ == '__main__':
    CORS(app)
    
    print("=" * 70)
    print("🚀 JEEVIKA API SERVER")
    print("=" * 70)
    print(f"📍 Local:  http://localhost:{PORT}")
    print("🌐 Public: Initializing tunnel...")
    print("=" * 70 + "\n")
    
    # Start tunnel in background
    tunnel_thread = threading.Thread(target=start_localhost_run_tunnel, daemon=True)
    tunnel_thread.start()
    
    # Give tunnel time to establish
    time.sleep(4)
    
    # Start Flask server
    print(f"📡 Flask server starting on port {PORT}...\n")
    app.run(host='0.0.0.0', port=PORT, debug=False)
