# Yetkisiz Erişim / RFID Cloning - Test Görevi

**Sorumlu:** Atahan_BSG
**Kategori:** Identity

## 1. Amaç
Bu döküman, "Yetkisiz Erişim / RFID Cloning" anomalisinin platform üzerinde nasıl simüle edileceğini ve tespit edileceğini açıklar.

## 2. Kurulum Gerekmeden Test (UI Kullanımı)
1. Platform anasayfasına gidin (Deploy linki veya Localhost).
2. Listeden **Atahan_BSG** filtresini seçin.
3. **Yetkisiz Erişim / RFID Cloning** kartını bulun.
4. "Start Simulation" butonuna tıklayın.
5. Açılan ekranda logları ve metrikleri izleyin.

## 3. Beklenen Çıktılar
- **Loglar:** Duplicate Tag Usage, Invalid Signatures, Concurrent Sessions içeren uyarılar görülmeli.
- **Metrikler:** Normal değerlerin dışına çıkan veriler (grafikte ani artış/düşüş).

## 4. Geliştirici Modu (Developer Mode) Testi
1. `/developer` sayfasına gidin.
2. Aşağıdaki JSON planını kopyalayıp editöre yapıştırın:
```json
{
  "scenarioId": "atahan-auth-bypass",
  "durationSeconds": 60,
  "intensity": 8,
  "params": {
    "manual_override": true
  }
}
```
3. "Validate Plan" butonuna basın.
4. Geçerli ise (VALID), testi başlatmak için bu JSON'ı `/runs` servisine (Postman veya Curl ile) gönderebilirsiniz.

## 5. Raporlama
Test tamamlandığında sağ üstteki "Refresh" butonu ile son durumu kontrol edin.
Ekran görüntüsü alarak bu dökümanın altına ekleyin.

---
*Otomatik oluşturuldu - EVCS Anomaly Platform*
