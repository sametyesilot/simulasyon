# 🔒 EVCS Anomaly Platform - Siber Güvenlik Eğitim Platformu

<div align="center">

![Platform Banner](https://img.shields.io/badge/EVCS-Anomaly%20Platform-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0-green?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9+-blue?style=for-the-badge&logo=python)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)

**Elektrikli Araç Şarj İstasyonları (EVCS) için Siber Güvenlik Eğitim ve Test Platformu**

[🚀 Demo](https:// 📚 Dok](https://github.com/yourusername/evcs-anomaly-platform) | [🐛 Issues](https://github.com/yourusername/evcs-anomaly-platform/issues)

</div>

---

## ⚠️ ÖNEMLİ UYARI

Bu platform **SADECE EĞİTİM AMAÇLIDIR**. Sistemde bulunan tüm güvenlik zayıflıkları **kasıtlı olarak** eklenmiştir. 

🚫 **Bu platformda öğrendiğiniz teknikleri ASLA gerçek sistemlerde kullanmayın!**

---

## 📖 İçindekiler

- [Platform Hakkında](#platform-hakkında)
- [Özellikler](#özellikler)
- [Sistemdeki Zayıflıklar](#sistemdeki-zayıflıklar)
- [Kurulum](#kurulum)
- [Kullanım Kılavuzu](#kullanım-kılavuzu)
- [Saldırı Senaryoları](#saldırı-senaryoları)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Katkıda Bulunma](#katkıda-bulunma)

---

## 🎯 Platform Hakkında

EVCS Anomaly Platform, elektrikli araç şarj altyapılarında karşılaşılabilecek siber güvenlik tehditlerini **güvenli bir ortamda** öğrenmek ve test etmek için geliştirilmiş bir eğitim platformudur.

### Kim Kullanmalı?

- 🎓 **Siber güvenlik öğrencileri**
- 👨‍💻 **Yazılım geliştiricileri** (güvenli kod yazma)
- 🔐 **Penetrasyon testerleri**
- 🏢 **Kurumsal güvenlik ekipleri**
- 📚 **Eğitmenler ve akademisyenler**

### Neden Bu Platform?

✅ Gerçekçi EVCS simülasyonu  
✅ 12+ farklı saldırı senaryosu  
✅ Canlı log ve metrik izleme  
✅ Python SDK ile kolay entegrasyon  
✅ Detaylı dokümantasyon  
✅ Güvenli öğrenme ortamı  

---

## ✨ Özellikler

### Frontend (Web Arayüzü)
- 🎨 Modern, responsive tasarım
- 📊 Gerçek zamanlı metrik grafikleri
- 📝 Canlı log akışı
- 🔍 Senaryo filtreleme
- 💡 İnteraktif yardım sistemi
- 🌓 Dark mode desteği

### Backend (API)
- ⚡ FastAPI ile yüksek performans
- 🔄 Asenkron simülasyon motoru
- 📡 WebSocket desteği (yakında)
- 🗄️ In-memory data store
- 📋 Swagger/OpenAPI dokümantasyonu

### SDK
- 🐍 Python tabanlı saldırı SDK'sı
- 📦 Kolay kurulum (`pip install`)
- 🛠️ Hazır saldırı fonksiyonları
- 📖 Detaylı kod örnekleri

---

## 🔓 Sistemdeki Zayıflıklar

Bu platform **kasıtlı olarak** aşağıdaki güvenlik zayıflıklarını içerir:

| # | Zayıflık Türü | Senaryo | Şiddet |
|---|---------------|---------|--------|
| 1 | No Rate Limiting | DDoS | 🔴 YÜKSEK |
| 2 | SQL Injection | Auth Bypass | 🔴 KRİTİK |
| 3 | Parameter Tampering | Energy Theft | 🔴 YÜKSEK |
| 4 | No Signature Verification | MITM | 🔴 YÜKSEK |
| 5 | Path Traversal | Firmware Download | 🔴 KRİTİK |
| 6 | Command Injection | Voltage Control | 🔴 KRİTİK |
| 7 | Timestamp Manipulation | Blockchain | 🟡 ORTA |
| 8 | Unsigned Firmware Updates | Supply Chain | 🔴 KRİTİK |
| 9 | IDOR | Fake Fault Reporting | 🔴 YÜKSEK |
| 10 | Business Logic Flaw | Billing | 🔴 YÜKSEK |
| 11 | No Request Timeout | Slowloris | 🔴 YÜKSEK |
| 12 | Multiple | Genel | 🟡 DEĞİŞKEN |

Her zayıflık için detaylı saldırı senaryoları ve çözüm önerileri [`/docs/ATTACK_GUIDE_DETAILED.md`](./docs/ATTACK_GUIDE_DETAILED.md) dosyasındadır.

---

## 🚀 Kurulum

### Ön Gereksinimler

- Python 3.9+
- Node.js 18+
- npm veya yarn

### Backend Kurulumu

```bash
# Repository'yi klonlayın
git clone https://github.com/yourusername/evcs-anomaly-platform.git
cd evcs-anomaly-platform

# Backend dizinine gidin
cd backend

# Virtual environment oluşturun
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# .env dosyasını oluşturun
cp .env.example .env

# Backend'i başlatın
uvicorn app.main:app --reload --port 8000
```

Backend şu adreste çalışacak: http://localhost:8000

### Frontend Kurulumu

```bash
# Frontend dizinine gidin
cd ../frontend

# Bağımlılıkları yükleyin
npm install

# .env.local dosyasını oluşturun
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local

# Frontend'i başlatın
npm run dev
```

Frontend şu adreste çalışacak: http://localhost:3000

### SDK Kurulumu

```bash
# SDK'yı indirin
cd ../sdk

# Kendi projenizde kullanmak için:
pip install -e .
```

---

## 📚 Kullanım Kılavuzu

### Web Arayüzü Kullanımı

1. **Platform'a Erişim:**
   - Tarayıcıda https://simulasyon.vercel.app/ adresine gidin
   - veya localhost:3000 (local kurulum)

2. **Senaryo Seçimi:**
   - Ana sayfada anomali kartlarını görüntüleyin
   - İstediğiniz senaryoyu seçin
   - "Start Simulation" butonuna tıklayın

3. **Sonuçları İzleme:**
   - Açılan sayfada real-time logları izleyin
   - Metrik grafiklerini inceleyin
   - Anomali tespit sonuçlarını gözlemleyin

### SDK ile Saldırı Testi

#### Basit Örnek

```python
from evcs_attack import EvcsAttackClient

# Client oluştur
client = EvcsAttackClient(
    api_url="https://evcs-backend-samet.onrender.com",
    api_key="YOUR_API_KEY"
)

# Bağlantıyı kontrol et
if client.check_connection():
    # DDoS saldırısı başlat
    run_id = client.start_attack(
        scenario_id="ahmet-ddos",
        duration=60,        # 60 saniye
        intensity=8,        # 1-10 arası
        params={
            "botnet_size": 1000
        }
    )
    
    # Canlı izle
    client.monitor_live(run_id)
```

#### Gelişmiş Örnek (SQL Injection)

```python
import requests

BACKEND_URL = "https://evcs-backend-samet.onrender.com"

# SQL Injection payloadları
payloads = [
    {"username": "admin' OR '1'='1", "password": "anything"},
    {"username": "admin'--", "password": ""},
]

for payload in payloads:
    response = requests.get(
        f"{BACKEND_URL}/vulnerable/auth-check",
        params=payload
    )
    
    if response.json().get("authenticated"):
        print(f"✅ BAŞARILI! Payload: {payload}")
        break
```

Daha fazla örnek için: [`/docs/ATTACK_GUIDE_DETAILED.md`](./docs/ATTACK_GUIDE_DETAILED.md)

---

## 💣 Saldırı Senaryoları

### 1️⃣ DDoS (Ahmet)
**Zayıflık:** Rate limiting yok  
**Saldırı:** Binlerce istek göndererek servisi çökertme  
**Dosya:** `gorevler/Ahmet_Bsg_ahmet-ddos.md`

### 2️⃣ SQL Injection (Atahan)
**Zayıflık:** Parametreli sorgu kullanılmıyor  
**Saldırı:** `admin' OR '1'='1` ile authentication bypass  
**Dosya:** `gorevler/Atahan_BSG_atahan-auth-bypass.md`

### 3️⃣ Energy Theft (Samet)
**Zayıflık:** Client-side price control  
**Saldırı:** Enerji ve fiyat değerlerini manipüle etme  
**Dosya:** `gorevler/Samet_BSG_samet-energy-theft.md`

### 4️⃣ MITM (Yusuf)
**Zayıflık:** Signature verification yok  
**Saldırı:** OCPP mesajlarını intercept ve modify etme  
**Dosya:** `gorevler/Yusuf_Bsg_yusuf-mitm-ocpp.md`

### 5️⃣ Path Traversal (Gökdeniz)
**Zayıflık:** Dosya yolu doğrulaması yok  
**Saldırı:** `../../etc/passwd` ile sistem dosyalarını okuma  
**Dosya:** `gorevler/Gokdeniz_Bsg_gokdeniz-firmware.md`

### 6️⃣ Command Injection (Yunus)
**Zayıflık:** Input filtreleme yok  
**Saldırı:** Sistem komutları çalıştırma  
**Dosya:** `gorevler/Yunus_BSG_yunus-offgrid-voltage.md`

### 7️⃣ Blockchain Attack (Beyza)
**Zayıflık:** Timestamp validation yok  
**Saldırı:** Geçmiş tarihli işlem gönderme  
**Dosya:** `gorevler/Beyza-bsg_beyza-blockchain-delay.md`

### 8️⃣ Supply Chain (Miraç)
**Zayıflık:** Firmware signature doğrulanmıyor  
**Saldırı:** Zararlı firmware yükleme  
**Dosya:** `gorevler/Mirac_BSG_mirac-supply-chain.md`

### 9️⃣ IDOR (Ömer)
**Zayıflık:** Authorization check yok  
**Saldırı:** Başkasının cihazını manipüle etme  
**Dosya:** `gorevler/ömer_omer-fake-fault.md`

### 🔟 Billing Fraud (Merve)
**Zayıflık:** Business logic hatası  
**Saldırı:** Ücretsiz tarife kullanma  
**Dosya:** `gorevler/Merve_-_bsg_merve-billing.md`

### 1️⃣1️⃣ Slowloris (Feyza)
**Zayıflık:** Request timeout yok  
**Saldırı:** Connection pool'u doldurma  
**Dosya:** `gorevler/Feyza_BSG_feyza-ddos-net.md`

---

## 📡 API Dokümantasyonu

### Temel Endpoints

#### Senaryoları Listele
```http
GET /scenarios
```

**Response:**
```json
[
  {
    "id": "ahmet-ddos",
    "personName": "Ahmet_Bsg",
    "anomalyTitle": "Merkezi Sisteme DDoS",
    "category": "Network/DoS",
    "description": "...",
    "indicator": "High RPS, Increased Latency",
    "parameters": ["rps_multiplier", "botnet_size"]
  }
]
```

#### Simülasyon Başlat
```http
POST /runs
Content-Type: application/json

{
  "scenarioId": "ahmet-ddos",
  "durationSeconds": 60,
  "intensity": 8,
  "params": {
    "rps_multiplier": 10
  }
}
```

**Response:**
```json
{
  "runId": "uuid-here",
  "status": "started"
}
```

#### Log'ları Getir
```http
GET /runs/{runId}/logs
```

#### Metrikleri Getir
```http
GET /runs/{runId}/metrics
```

### Vulnerable Endpoints (Eğitim Amaçlı)

Tüm vulnerable endpoint'ler `/vulnerable/*` altındadır:

- `POST /vulnerable/ddos-target` - DDoS testi
- `GET /vulnerable/auth-check` - SQL Injection
- `POST /vulnerable/meter-reading` - Parameter tampering
- `POST /vulnerable/ocpp-message` - MITM
- `GET /vulnerable/firmware-download` - Path traversal
- `POST /vulnerable/set-voltage` - Command injection
- `POST /vulnerable/blockchain-transaction` - Timestamp manipulation
- `POST /vulnerable/firmware-update` - Unsigned updates
- `POST /vulnerable/report-fault` - IDOR
- `POST /vulnerable/calculate-bill` - Business logic
- `GET /vulnerable/slow-endpoint` - Slowloris

Detaylı API dokümantasyonu: http://localhost:8000/docs (Swagger UI)

---

## 🛡️ Güvenlik En İyi Uygulamalar

Bu platformda **yapmadığımız** ama **gerçek sistemlerde MUTLAKA yapılması gereken** güvenlik önlemleri:

### 1. Kimlik Doğrulama ve Yetkilendirme
```python
# ✅ DOĞRU
@router.post("/endpoint")
def secure_endpoint(user: User = Depends(get_current_user)):
    if not user.has_permission("admin"):
        raise HTTPException(status_code=403)
```

### 2. Input Validation
```python
# ✅ DOĞRU
from pydantic import BaseModel, Field

class SecureInput(BaseModel):
    value: str = Field(..., min_length=1, max_length=100, regex="^[a-zA-Z0-9]+$")
```

### 3. SQL Injection Koruması
```python
# ✅ DOĞRU - Parametreli sorgular
query = text("SELECT * FROM users WHERE id=:id")
result = db.execute(query, {"id": user_id})
```

### 4. Rate Limiting
```python
# ✅ DOĞRU
from slowapi import Limiter

@router.post("/endpoint")
@limiter.limit("10/minute")
def limited_endpoint():
    pass
```

### 5. HTTPS ve Certificate Pinning
```python
# ✅ DOĞRU
app.add_middleware(
    HTTPSRedirectMiddleware
)
```

---

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak isterseniz:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

---

## 👥 Takım

**BSG Team - 2024**

- Ahmet - DDoS Scenarios
- Atahan - Authentication Security
- Samet - Energy & Billing Systems
- Yusuf - Network Protocols
- Gökdeniz - Firmware Security
- Yunus - Hardware Control
- Beyza - Blockchain Integration
- Miraç - Supply Chain Security
- Ömer - Status & Fault Reporting
- Merve - Business Logic
- Feyza - Network Layer Attacks
- Muhammet - General Scenarios

---

## 📞 İletişim

Sorularınız için:
- 📧 Email: samet@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/evcs-anomaly-platform/issues)

---

## ⚖️ Yasal Uyarı

Bu platform eğitim amaçlıdır. Öğrendiğiniz teknikleri:

✅ Kendi test ortamlarınızda kullanabilirsiniz  
✅ Etik hacking eğitimlerinde kullanabilirsiniz  
✅ Güvenlik araştırmalarında referans olarak kullanabilirsiniz  

❌ İzinsiz sistemlerde KULLANAMAZSINIZ  
❌ Yasal olmayan amaçlarla KULLANAMAZSINIZ  

**Hukuki sorumluluk kullanıcıya aittir.**

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

Made with ❤️ by BSG Team

</div>
