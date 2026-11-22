import requests
import time

API_URL = "http://127.0.0.1:8000/predict"

print("🚀 Starting simulated attack on Live Monitor... Press Ctrl+C to stop.")

while True:
    # Simulate a massive Zero-Day DoS attack
    payload = {
        "features": {
            "duration": 0, 
            "protocol_type": "udp", 
            "service": "private", 
            "flag": "REJ",
            "src_bytes": 9999999, 
            "dst_bytes": 0, 
            "count": 1000, 
            "srv_count": 1000,
            "serror_rate": 1.0, 
            "same_srv_rate": 0.0
        },
        "mode": "unknown" # Forces the backend to treat it as an unknown attack
    }

    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            print("💥 Malicious packet sent to backend!")
    except Exception as e:
        print(f"Error: {e}")

    time.sleep(3) # Sends one attack every 3 seconds