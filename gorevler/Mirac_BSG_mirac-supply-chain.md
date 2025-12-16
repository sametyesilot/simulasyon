# Firmware Supply Chain Attack - Detaylı Saldırı ve Test Rehberi
================================================================================

**Sorumlu:** Mirac_BSG
**Kategori:** Firmware/SupplyChain
**Senaryo ID:** `mirac-supply-chain`

Bu doküman, teknik bilgisi olmayan birinin bile **sıfırdan başlayarak** "Firmware Supply Chain Attack" saldırısını kendi bilgisayarından nasıl gerçekleştireceğini adım adım anlatır.

---

## BÖLÜM 1: Ön Hazırlık (Sadece 1 Kere Yapılır)

Eğer daha önce başka bir saldırı testi yaptıysanız bu bölümü atlayıp **Bölüm 2**'ye geçebilirsiniz.

### 1.1 Python Kurulumu
Bilgisayarınızda Python yüklü mü?
- Terminali açın (`Cmd` veya `PowerShell`).
- `python --version` yazın.
- Eğer hata alırsanız [python.org](https://www.python.org/downloads/) adresinden indirin. Kurarken "Add Python directly to PATH" kutucuğunu İŞARETLEYİN.

### 1.2 Gerekli Kütüphane
Terminalde şu komutu çalıştırın:
```bash
pip install requests
```

### 1.3 SDK Dosyasını İndirin
1. Şu adrese gidin: [GitHub SDK Klasörü](https://github.com/sametyesilot/simulasyon/tree/main/sdk)
2. `evcs_attack.py` dosyasına tıklayın ve indirin (Raw butonuna sağ tıklayıp "Farklı Kaydet" diyebilirsiniz).
3. Masaüstünde `BSG_Test` adında bir klasör açın ve bu dosyayı içine atın.

---

## BÖLÜM 2: Saldırı Dosyasını Oluşturma

Şimdi sizin sorumlu olduğunuz saldırı senaryosu için özel bir kod yazacağız. URL'ler otomatik olarak ayarlandı, sadece size verilen şifreyi girmeniz yeterli.

1. `BSG_Test` klasörünün içinde `test_Mirac_BSG.py` adında yeni bir metin dosyası oluşturun (dosya uzantısının **.py** olduğuna emin olun, .txt kalmasın).
2. Dosyayı Notepad veya benzeri bir editörle açın.
3. Aşağıdaki kodları **KOPYALA - YAPIŞTIR** yapın:

```python
# Dosya Adi: test_Mirac_BSG.py
from evcs_attack import EvcsAttackClient

# ================= SADECE BURAYI DUZENLEYIN =================
# Proje Yöneticisinden (Samet) alacaginiz sifre:
API_KEY = "BURAYA_SIZE_VERILEN_SIFREYI_YAZIN"
# ============================================================

# Backend Adresi (Otomatik Tanimlandi)
URL = "https://evcs-backend-samet.onrender.com"

# Sizin Senaryo Bilgileriniz (Otomatik Tanimlandi):
SENARYO_ID = "mirac-supply-chain"

client = EvcsAttackClient(api_url=URL, api_key=API_KEY)

print(f"--- {SENARYO_ID} SALDIRISI HAZIRLANIYOR ---")
print(f"Hedef: {URL}")

if client.check_connection():
    print(">> Sunucuya erisim BASARILI.")
    
    # Saldiri Parametreleri
    parametreler = {
        "severity": "high",        # Saldiri siddeti
        "target_evse": "EVSE-001"  # Hedef sarj cihazi
    }

    print(f">> Saldiri baslatiliyor...")
    run_id = client.start_attack(
        scenario_id=SENARYO_ID, 
        duration=60,      # 60 Saniye sursun
        intensity=9,      # Siddet (1-10)
        params=parametreler
    )
    
    if run_id:
        print(f"\n[!!!] SALDIRI BASLADI! ID: {run_id}")
        print("Lutfen Web Arayuzunden (Frontend) canli sonuclari izleyin.")
        print("Web Sitesi: https://simulasyon.vercel.app/")
        
        # Terminalden de izlemek isterseniz:
        client.monitor_live(run_id)
    else:
        print("xx Saldiri baslatilamadi. API Key hatali olabilir.")
else:
    print("xx Sunucuya baglanilamadi. Internetinizi kontrol edin.")
```

---

## BÖLÜM 3: Saldırıyı Çalıştırma

1. Terminali açın.
2. Dosyaların olduğu klasöre gidin:
   ```bash
   cd Desktop/BSG_Test
   ```
3. Scripti çalıştırın:
   ```bash
   python test_Mirac_BSG.py
   ```

---

## BÖLÜM 4: Sonuçları İzleme

Komutu çalıştırdıktan sonra "SALDIRI BASLADI" yazısını gördüyseniz:

1. Şu siteye gidin: **[ANOMALİ TESPİT PLATFORMU](https://simulasyon.vercel.app/)**
2. Ana sayfada **Active Runs** (veya Aktif Saldırılar) kısmına bakın.
3. Kendi isminizi veya senaryonuzu orada CANLI olarak göreceksiniz.
4. Detaylara tıklayıp grafiklerin nasıl değiştiğini izleyin.

**Beklenen Etki:**
- Loglarda: `Unauthorized Outbound Traffic, Hidden Admin Accounts` benzeri uyarılar çıkmalı.
- Grafiklerde: Anormal veri artışları görülmeli.

---
*Bu doküman Mirac_BSG için özel olarak oluşturulmuştur.*
