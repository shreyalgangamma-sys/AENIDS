import time
import requests
import threading
import warnings
from scapy.all import sniff, IP, TCP, UDP

warnings.filterwarnings("ignore", category=UserWarning)

API_URL = "http://127.0.0.1:8000/predict"
flows = {} 

def process_packet(packet):
    if IP in packet:
        src_ip = packet[IP].src
        dst_ip = packet[IP].dst
        proto = packet[IP].proto
        proto_str = "tcp" if proto == 6 else "udp" if proto == 17 else "icmp"
        
        dport = packet[TCP].dport if TCP in packet else (packet[UDP].dport if UDP in packet else 0)
        service = "http" if dport in [80, 443] else "ftp" if dport == 21 else "domain" if dport == 53 else "private"
        
        length = len(packet)
        flow_key = (src_ip, dst_ip, proto_str)
        
        if flow_key not in flows:
            flows[flow_key] = {
                "duration": 0, "protocol_type": proto_str, "service": service, "flag": "SF",
                "src_bytes": 0, "dst_bytes": 0, "count": 0, "srv_count": 1,
                "serror_rate": 0.0, "same_srv_rate": 1.0
            }
            
        flows[flow_key]["count"] += 1
        flows[flow_key]["src_bytes"] += length
        print(f"[CAPTURED] {proto_str.upper()} {src_ip} -> {dst_ip} ({length} bytes)")

def send_flows():
    while True:
        time.sleep(3) # Group packets every 3 seconds
        for key, flow_data in list(flows.items()):
            try:
                # Use mode="auto" so the backend uses the REAL ML logic, not the demo buttons
                payload = {"features": flow_data, "mode": "auto"}
                response = requests.post(API_URL, json=payload)
                if response.status_code == 200:
                    result = response.json()
                    if result['status'] != 'NORMAL': # Only log attacks to console
                        print(f"\n[!] LIVE THREAT: {result['status']} - {result['classification']}\n")
            except Exception:
                pass
        flows.clear()

threading.Thread(target=send_flows, daemon=True).start()

print("🚀 Starting Live Network Capture...")
print("Browse a website to generate traffic. Press Ctrl+C to stop.")
# Sniffing starts here
sniff(prn=process_packet, store=False)