# 🌐 Genel Senaryolar ve Testler | MUHAMMET

**Senaryo ID:** `muhammet-general`  
**Sorumlu:** Muhammet  
**Kategori:** General  
**Zayıflık:** Multiple Config Errors  
**Şiddet:** 🟡 DEĞİŞKEN

---

## 🎯 HEDEF: Sistem Keşfi ve Genel Testler

Tüm platformun genel sağlık durumunu bozma ve yapılandırma hatalarını bulma.

---

## ⚔️ SALDIRI: Servis Keşfi

### Kod: `recon_scan.py`

```python
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"
ENDPOINTS = [
    "/vulnerable/auth-check",
    "/vulnerable/firmware-download",
    "/vulnerable/ddos-target",
    "/admin",
    "/config",
    "/metrics"
]

print("🔍 SİSTEM TARAMASI\n")

for ep in ENDPOINTS:
    try:
        r = requests.get(f"{BACKEND}{ep}", timeout=2)
        print(f"✅ {ep} -> {r.status_code}")
        if r.status_code == 200:
            print(f"   AÇIK! Potansiyel hedef.")
    except:
        print(f"❌ {ep} -> Kapalı")
```

---

**Hazırlayan:** Muhammet  
**Durum:** ✅ SCANNING COMPLETE...
