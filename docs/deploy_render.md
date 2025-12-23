# Render Deployment Kılavuzu (Backend) - GÜNCELLENMİŞ

Daha önceki **Root Directory** ayarımız, kodun içindeki import yapısıyla uyuşmadığı için hataya sebep oldu.
Kodlarımız `backend.app...` şeklinde çağrıldığı için, Render'ın projenin en tepesinden çalışması gerekiyor.

Lütfen ayarlarınızı şu şekilde güncelleyin:

## 1. Ayarları Düzeltme
Render panelinde **Settings** sekmesine gelin ve şu değişiklikleri yapın:

| Ayar | Değer | Açıklama |
| :--- | :--- | :--- |
| **Root Directory** | `.` (veya boş bırakın) | **ÖNEMLİ:** Burayı temizleyin (silin) veya boş bırakın. Artık `backend` klasörüne girmeyeceğiz. |
| **Build Command** | `pip install -r backend/requirements.txt` | `requirements.txt` dosyasının yolunu elle belirtiyoruz. |
| **Start Command** | `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT` | Uygulama yolunu `backend.app.main` olarak tam veriyoruz. |

## 2. Environment Variables
Bunlar aynı kalabilir:
- `PYTHON_VERSION`: `3.11.0`
- `ALLOWED_ORIGINS`: `*`
- `DEV_API_KEY`: ...

## 3. Tekrar Deploy
Ayarları kaydettikten sonra (Save Changes), Render otomatik olarak yeniden deploy etmeye başlayacaktır. 
Başlamazsa sağ üstten **Manual Deploy > Deploy latest commit** diyebilirsiniz.

Bu değişiklikle `ModuleNotFoundError: No module named 'backend'` hatası çözülecektir.
