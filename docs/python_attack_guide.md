# Python Saldırı Rehberi (Adım Adım)

Bu belge, hiçbir yazılım bilgisi olmayan birinin bile "EVCS Anomaly Platform" üzerinde saldırı testi yapabilmesi için hazırlanmıştır.

## Nedir Bu?
Bu platform, Elektrikli Araç Şarj İstasyonlarına (EVCS) yapılabilecek siber saldırıları simüle eder. Siz **Saldırgan** rolündesiniz. Kendi bilgisayarınızdan göndereceğiniz basit komutlarla sistemi test edeceksiniz.

---

## 1. Hazırlık (Sadece 1 Kez Yapılır)

### A. Python'u Kurun
Bilgisayarınızda Python yüklü olmalıdır. 
- Terminali (veya Cmd) açın ve `python --version` yazın. `Python 3.x.x` görüyorsanız sorun yok.
- Yoksa [python.org](https://www.python.org/downloads/) adresinden indirip kurun ("Add to PATH" seçeneğini işaretlemeyi unutmayın!).

### B. Gerekli Kütüphaneyi İndirin
Terminali açın ve şu komutu yapıştırıp Enter'a basın:
```bash
pip install requests
```

### C. SDK Dosyasını İndirin
1. Projenin GitHub sayfasına gidin (veya ekip arkadaşınızdan isteyin).
2. `sdk/evcs_attack.py` dosyasını indirin.
3. Masaüstünde `saldiri_testi` diye bir klasör açıp bu dosyayı içine koyun.

---

## 2. Saldırı Dosyasını Oluşturma

Masaüstündeki `saldiri_testi` klasörünün içinde `baslat.py` adında yeni bir metin dosyası oluşturun (uzantısının .py olduğundan emin olun).
İçine şu kodları yapıştırın:

```python
# baslat.py
from evcs_attack import EvcsAttackClient

# ----------------AYARLAR----------------
# 1. Frontend'in size verdigi Backend Adresini buraya yapistirin:
URL = "https://evcs-backend-samet.onrender.com" 

# 2. Size verilen gizli API Anahtarini buraya yazin:
SIFRE = "gizli-sifreniz-123" 

# 3. Denemek istediginiz saldiri senaryosunun ID'sini yazin
# (Liste icin proje yoneticisine danisin veya documentation'a bakin)
SENARYO = "ahmet-ddos"  
# ---------------------------------------

client = EvcsAttackClient(api_url=URL, api_key=SIFRE)

print("Baglanti kontrol ediliyor...")
if client.check_connection():
    print("BASARILI: Sisteme baglanildi.")
    
    print(f"Saldırı başlatılıyor: {SENARYO}")
    run_id = client.start_attack(
        scenario_id=SENARYO, 
        duration=60,       # Kac saniye sursun?
        intensity=8,       # Siddeti ne olsun (1-10)?
        params={"botnet_size": 5000} # Ozel parametreler
    )
    
    if run_id:
        print(f"SALDIRI AKTIF! ID: {run_id}")
        print("Sonuclar Frontend uzerinden izlenebilir.")
        client.monitor_live(run_id)
    else:
        print("HATA: Saldiri baslatilamadi.")
else:
    print("HATA: Sunucuya baglanilamadi. URL veya Interneti kontrol et.")
```

---

## 3. Saldırıyı Başlatma

1. Terminali açın.
2. `saldiri_testi` klasörüne gidin:
   ```bash
   cd Desktop/saldiri_testi
   ```
3. Scripti çalıştırın:
   ```bash
   python baslat.py
   ```

## 4. Sonuçları İzleme (Frontend)

Komutu çalıştırdığınızda terminalde `SALDIRI AKTIF!` yazısını göreceksiniz.
Şimdi Web Arayüzüne (Frontend) gidin:

1. Tarayıcıdan siteye girin (örn: `https://evcs-platform-samet.vercel.app`).
2. Ana sayfada **"Active Runs"** (Aktif Koşular) bölümüne bakın.
3. Sizin başlattığınız saldırıyı orada göreceksiniz.
4. Üzerine tıklayarak canlı grafikleri ve logları izleyebilirsiniz.

---

## Sık Sorulan Sorular

**Soru:** `ModuleNotFoundError: No module named 'requests'` hatası alıyorum.
**Cevap:** `pip install requests` komutunu çalıştırmamışsınız.

**Soru:** `Connection Failed: 404` hatası alıyorum.
**Cevap:** URL'in sonuna `/` koymuş olabilirsiniz veya URL yanlıştır. Sadece ana linki (https://...com) yapıştırın.

**Soru:** `Unauthorized` hatası alıyorum.
**Cevap:** `SIFRE` kısmına yazdığınız API Key yanlıştır.
