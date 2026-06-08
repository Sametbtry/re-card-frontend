# Flashcard PWA - Frontend

Bu proje, bir Flashcard uygulamasının frontend kısmıdır. Modern web standartlarına uygun olarak **React** ve **TypeScript** kullanılarak geliştirilmiş olup, bir **Progressive Web App (PWA)** olarak yapılandırılmıştır.

## 🚀 Özellikler

- **PWA (Progressive Web App)**: Cihazlara yüklenebilir (Installable), çevrimdışı (offline) desteği sunan, mobil uygulama hissiyatı veren web mimarisi.
- **Modern ve Hızlı**: Hızlı derleme ve geliştirme ortamı sunan **Vite** tabanlı altyapı.
- **Dinamik Tasarım**: Utility-first CSS framework'ü **Tailwind CSS** kullanılarak tasarlanmış tamamen duyarlı (responsive) ve şık arayüzler.
- **Durum Yönetimi**: React Context API ile yönetilen esnek ve izole global state yönetimi.
- **Sayfa Yönlendirmeleri**: Güvenli (protected) rotalar ve modern yönlendirmeler için `react-router-dom`.

## 🛠️ Teknolojiler

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Axios** (API İstekleri)
- **Lucide React** (İkonlar)
- **Vite PWA Plugin** (Service Worker ve Manifest yapılandırması)

## 🏛️ Mimari ve Proje Yapısı

Frontend mimarisi; modülerlik, yeniden kullanılabilirlik ve bakım kolaylığı sağlamak üzere bileşen tabanlı (component-based) tasarlanmıştır:

1. **Pages (Sayfalar)**: Yönlendirme (routing) ile doğrudan eşleşen, ekran bazlı ana görünüm dosyalarıdır (Dashboard, Review, Login vb.).
2. **Components (Bileşenler)**: Sayfaların içinde kullanılan tekrar kullanılabilir, izole edilmiş UI parçalarıdır (Navbar, FlashcardItem, Modal vb.).
3. **Context (Durum Yönetimi)**: Auth (kimlik doğrulama) gibi global olarak uygulamanın her yerinden erişilmesi gereken state'leri (durumları) barındırır.
4. **Services (API Entegrasyonu)**: Backend ile haberleşmek için yazılan `Axios` yapılandırması ve API uç noktaları için yazılmış servis fonksiyonları burada soyutlanmıştır.

```bash
frontend/
├── public/           # Statik dosyalar ve manifest.json
├── src/
│   ├── assets/       # Görseller ve ikonlar
│   ├── components/   # Tekrar kullanılabilir UI bileşenleri
│   ├── context/      # React Context API dosyaları (Auth vb.)
│   ├── pages/        # Yönlendirme (Route) sayfaları
│   ├── services/     # Axios API bağlantıları ve endpoint fonksiyonları
│   ├── App.tsx       # Ana yönlendirme ve provider sarmalayıcısı
│   └── main.tsx      # React uygulamasının başlangıç noktası
├── vite.config.ts    # Vite ve PWA eklentisi yapılandırmaları
├── eslint.config.js  # Linter kuralları
└── package.json      # Proje bağımlılıkları ve script'leri
```

### PWA ve Service Worker Detayları
Proje, kullanıcıların mobil veya masaüstü cihazlarına bir native uygulama gibi indirebilmesi için `vite-plugin-pwa` kullanır. Bu yapı sayesinde:
- Cihaz ana ekranına kısayol eklenebilir.
- Temel statik dosyalar (HTML, CSS, JS) cache'lenerek hızlı yükleme sağlanır.
- Kullanıcıya çevrimdışı (offline) veya zayıf ağ koşullarında bile hizmet verebilecek altyapı sunulur.

## ⚙️ Kurulum ve Çalıştırma 

Uygulama zaten deploy edilmiştir, ancak projeyi yerel ortamınızda geliştirip test etmek isterseniz:

1. Depoyu klonlayıp klasöre girin.
2. `npm install` komutu ile bağımlılıkları yükleyin.
3. Gerekli çevre değişkenlerini (örneğin `.env` dosyasında `VITE_API_BASE_URL` gibi) backend adresine işaret edecek şekilde ayarlayın.
4. `npm run dev` ile Vite geliştirme sunucusunu başlatın.
5. PWA özelliklerini ve Service Worker'ı yerelde test etmek için uygulamanın derlemesini alarak `npm run build && npm run preview` komutunu kullanabilirsiniz.
