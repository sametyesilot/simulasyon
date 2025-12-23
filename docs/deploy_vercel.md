# Vercel Deployment Kılavuzu (Frontend)

Backend (Render) hazır olduğuna göre, şimdi Frontend'i (Next.js) Vercel üzerinde yayınlayacağız.

## 1. Vercel Hesabı ve Proje
1. [vercel.com](https://vercel.com) adresine gidin ve GitHub ile giriş yapın.
2. Dashboard'da **"Add New..."** butonuna tıklayıp **"Project"** seçin.
3. `simulasyon` reposunu listede bulun ve **"Import"** butonuna basın.

## 2. Ayarlar (Configure Project)
Vercel çoğu ayarı otomatik tanır ama birkaç değişiklik yapmamız gerekiyor.

| Ayar | Değer |
| :--- | :--- |
| **Project Name** | `evcs-platform-samet` (İstediğinizi yazın) |
| **Framework Preset** | `Next.js` (Otomatik seçili olmalı) |
| **Root Directory** | `Edit` butonuna basın ve `frontend` klasörünü seçin. **(ÇOK ÖNEMLİ)** |

*Eğer Root Directory'yi `frontend` seçmezseniz build hatası alırsınız.*

## 3. Environment Variables
**"Environment Variables"** bölümünü genişletin ve şu değişkeni ekleyin:

**Name:** `NEXT_PUBLIC_API_BASE_URL`
**Value:** `https://evcs-backend-samet.onrender.com` (Render'dan aldığınız Backend linki. Sonunda `/` olmasın!)

## 4. Deploy
1. **"Deploy"** butonuna basın.
2. Vercel build işlemini başlatacak. Yaklaşık 1-2 dakika sürer.
3. Ekran konfetilerle dolduğunda işlem tamamdır! **"Continue to Dashboard"** diyerek sitenize gidebilirsiniz.

## 5. Son Kontrol (Bağlantı Ayarı)
Frontend yayına girdiğinde size bir link verecek (örn: `https://evcs-platform-samet.vercel.app`).
Bu linki kopyalayın ve **Render** paneline geri dönün:

1. Render'da Backend projenize girin.
2. **Environment** sekmesine gelin.
3. `ALLOWED_ORIGINS` değerini `*` yerine Vercel linkinizle değiştirin (örn: `https://evcs-platform-samet.vercel.app`).
4. **Save Changes** deyin.

Bu işlem güvenliği artırır ve sadece sizin sitenizin backend'e erişmesini sağlar.

**Tebrikler! Platformunuz tamamen yayında.**
