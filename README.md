# 🍕 YemekSiparisMete: Gastronomi ve Teknolojinin Kusursuz Senfonisi

## 📂 Mimari Yapı

```bash
yemeksiparismete/
├── 🌐 .Server/        # Core API: Business Logic & SignalR Hubs
├── 💻 .client/        # Web App: React 19 Design System
├── 📱 _mobile/        # Mobile App: Flutter Real-time Engine
├── 🗄️ sqlserver/YemekSiparisDb_Yedek.sql    # Veritabanı Yedeği (Hızlı Kurulum İçin)
├── 📄 README.md       # Proje Dokümantasyonu
├── 📄 screenshot/README.md  #Projenin Hem Web Hem Mobil Üzerinden Çalıştığına Dair Kanıtlar
└── 🧪 AutoSeeder/     # Mock Data: Akıllı Test Veri Üreticisi

```
YemekSiparisMete, modern yazılım mimarilerinin tüm imkanları kullanılarak geliştirilmiş, uçtan uca bir yemek sipariş ve yönetim ekosistemidir. Bu proje; ölçeklenebilir bir Backend, estetik bir Web arayüzü ve yüksek performanslı bir Mobil uygulama üçlemesinden oluşmaktadır.

🏛️ 1. Mimari Şaheser: Sistem Topolojisi
Sistem, N-Tier (Çok Katmanlı) mimari prensiplerine sadık kalınarak, her bir bileşenin kendi sorumluluğunu (Separation of Concerns) taşıdığı bir yapıda kurgulanmıştır.

graph TD
    A[📱 Flutter Mobile] -->|IPv4: 10.22.107.60:5101| B[⚙️ .NET 8 API]
    C[💻 React 19 Web] -->|HTTP/SignalR| B
    B -->|EF Core 8| D[(🗄️ SQL Server)]
    B -->|Real-time| E[📡 SignalR Hub]

📱 Flutter Mobile
⚙️ .NET 8 API
💻 React 19 Web
🗄️ SQL Server
📡 SignalR Hub
⚙️ 2. Backend Mühendisliği: Verimlilik ve Ölçeklenebilirlik
Sistemin kalbi olan backend tarafında, kurumsal düzeyde (enterprise-grade) teknolojiler kullanılarak sarsılmaz bir iş mantığı katmanı oluşturulmuştur.

Teknoloji	Versiyon	Görev & Stratejik Avantaj
Microsoft .NET Core	8.0	Yüksek işlem kapasiteli, düşük gecikme süreli ana motor.
Entity Framework Core	8.0	Veritabanı yönetiminde nesne-tabanlı (ORM) esneklik.
SQL Server	Enterprise	ACID prensiplerine tam uyumlu, güvenilir veri depolama.
SignalR	Real-Time	Mutfak ve müşteri arasında kesintisiz canlı veri akışı.
ASP.NET Identity	JWT	Role-based (Rol tabanlı) kriptografik güvenlik sistemi.
🗄️ 3. Veritabanı ve Veri Yönetimi (SQL Server)
Projenin veri ambarı, Microsoft SQL Server üzerinde optimize edilmiştir. Veri bütünlüğü (integrity) ve ilişkisel modelleme (relational mapping) en üst seviyededir.

İlişkisel Mimari: Müşteriler, Restoranlar, Ürünler, Siparişler ve Kuryeler arasındaki karmaşık bağlar, verimli Join operasyonları ve indeksleme stratejileriyle yönetilir.
Veri Güvenliği: Tüm hassas veriler, uygulama katmanında normalize edildikten sonra SQL Server'ın güvenli havuzuna aktarılır.
Hızlı Kurulum: Proje içerisinde bulunan YemekSiparisDb_Yedek.sql dosyası ile saniyeler içinde tüm şema ve test verileri ayağa kaldırılabilir.
🌐 4. Ağ Topolojisi ve IPv4 Erişim Dinamikleri
Çapraz platform (Cross-platform) haberleşmesi, sistemin en güçlü yanlarından biridir. Mobil ve Web istemcilerinin merkezi sunucuyla sorunsuz etkileşimi için özel bir ağ yapılandırması uygulanmıştır.

IMPORTANT

IPv4 Bağlantı Yapılandırması: Fiziksel cihazlar ve mobil emülatörlerin sunucuya erişebilmesi için Backend API, statik IPv4 adresi üzerinden yayın yapmaktadır.

Sunucu IPv4 Adresi: 10.22.107.60
Dinleme Portu: 5101
Protokol: HTTP/REST & WebSockets (SignalR)
Bu yapılandırma, localhost sınırlarını aşarak gerçek dünya ağ senaryolarında (Physical Device Testing) projenin kesintisiz çalışmasını garanti altına alır.

🎨 5. Web Frontend: Estetik ve Fonksiyonelliğin Senfonisi
Web arayüzü, React 19 ve modern CSS teknikleriyle tasarlanmış, kullanıcı deneyimini (UX) odağına alan bir görsel şölen sunar.

Bileşen	Teknolojik Derinlik	Stratejik Avantaj
React 19	Latest Release	Modern rendering ve üstün component hiyerarşisi.
Vite Engine	Ultra Fast	Saniyeler içinde yüklenen sayfalar ve optimize bundle.
TypeScript	Type-Safe	Çalışma zamanı hatalarını sıfıra indiren güçlü kod yapısı.
Framer Motion	3D & Glass	3D hover efektleri ve premium cam efekti (Glassmorphism).
📲 6. Mobil Teknoloji: Avucunuzdaki Hız ve Zarafet
Flutter ile inşa edilen mobil uygulama, native performansını şık bir tasarım diliyle birleştirir.

Özellik	Detay	Kullanıcı Deneyimi (UX)
Flutter / Dart	Reaktif Mimari	Takılmayan, 60 FPS akıcılığında ekran geçişleri.
Provider	State Management	Verilerin cihaz hafızasında anlık ve tutarlı yönetimi.
Material 3	Tasarım Dili	Modern, temiz ve göz yormayan profesyonel arayüz.
API Sync	Optimized HTTP	Düşük internet hızına sahip ortamlarda bile kararlı veri alışverişi.
🔐 7. Siber Güvenlik: Kırılmaz Bir Dijital Kale
Kullanıcı verileri, en modern siber güvenlik standartları ile korunmaktadır:

Parola Güvenliği: PBKDF2 hashing algoritması ile binlerce kez tekrarlanmış tuzlama (salting) işlemi.
Yetkilendirme: JWT (JSON Web Token) ile stateless ve güvenli oturum yönetimi.
Veri Validasyonu: Fluent Validation ile backend tarafında enjekte edilen katı veri doğrulama kuralları.
🌟 Sonuç
YemekSiparisMete, sadece bir ödev veya hobi projesi değil; SQL Server'ın derinliklerinden React 19'un en güncel özelliklerine, IPv4 tabanlı hibrit ağ mimarisinden Flutter'ın performansına kadar her noktası titizlikle işlenmiş profesyonel bir yazılım ekosistemidir.

<div align="center">
  <table style="width: 100%; table-layout: fixed; border-collapse: collapse !important; border: 4px solid #FF0000 !important;">
    <thead>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <th colspan="4" align="center" style="border: 4px solid #FF0000 !important; padding: 20px 0;">
          <h3>⚙️ Web Kullanıcı Paneli </h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- Satır 1 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/web_konum.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📍 Bölge Filtreleme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/anasayfaweb.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🏠 Ana Dashboard</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/restoran2.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍴 Restoran Katalog</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/webaramakısmı.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔍 Akıllı Arama</b></sub>
        </td>
      </tr>
      <!-- Satır 2 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/webpizza.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍕 Pizza Dünyası</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kebaplar.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍢 Kebap Kültürü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/webtatlılar.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍰 Tatlı Serüveni</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kahveler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>☕ Kahve & İçecek</b></sub>
        </td>
      </tr>
      <!-- Satır 3 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/ornekrestaurantgorunus.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🏪 Örnek Restaurant</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/ornekurunler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍔 Örnek Ürünler</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/orneksepet.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛒 Örnek Sepet</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/footerweb.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📄 Bilgi & Footer</b></sub>
        </td>
      </tr>
      <!-- Satır 4 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/yanmenü.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📱 Yan Menü Navigasyon</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kuryelik.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🚲 Kurye Başvuru Sistemi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/hakkında.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>ℹ️ Hakkında</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/hakkında3.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>ℹ️ Hakkında Devam</b></sub>
        </td>
      </tr>
      <!-- Satır 5 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/giris.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔐 Kullanıcı Girişi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kayıt.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Yeni Kayıt Ekranı</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/destek.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🎧 Canlı Destek Sistemi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/yardım.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❓ Yardım Merkezi</b></sub>
        </td>
      </tr>
      <!-- Satır 6 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/profil.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👤 Kullanıcı Profili</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/siparis.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📦 Sipariş Geçmişi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/adresim.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📍 Teslimat Adreslerim</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/odeme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>💳 Ödeme Yöntemleri</b></sub>
        </td>
      </tr>
      <!-- Satır 7 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kayıtsiparis.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Sipariş Onayları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kuponlar.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🎫 İndirim Kuponları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/guvenlik.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔒 İşlem Güvenliği</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kuponlar2.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🎁 Kampanyalar</b></sub>
        </td>
      </tr>
      <!-- Satır 8 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/konumdegis.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔄 Konum Güncelleme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/yoldayım.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛵 Sipariş Yolda</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/teslimveyıldızı.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>⭐ Değerlendirme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/iptal.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❌ Sipariş İptal</b></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<div align="center">
  <table style="width: 100%; table-layout: fixed; border-collapse: collapse !important; border: 4px solid #FF0000 !important;">
    <thead>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <th colspan="4" align="center" style="border: 4px solid #FF0000 !important; padding: 20px 0;">
          <h3>⚙️ Web Yönetim Paneli </h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- Satır 1 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/yoneticianasayfa.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📊 Yönetici Özeti</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/sipariskontrol.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📑 Sipariş Denetimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/musteriler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👥 Müşteri Portföyü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kuryeyönetim.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛵 Kurye Operasyonu</b></sub>
        </td>
      </tr>
      <!-- Satır 2 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/yoneticiprofil.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👤 Yetki & Hesap Ayarları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/guvenlikadmin.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛡️ Admin Güvenlik Duvarı</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/yonetimkontrol.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🎮 Genel Kontrol Merkezi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kuryekontrol.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📡 Kurye Kabul ve Red</b></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<div align="center">
  <table style="width: 100%; table-layout: fixed; border-collapse: collapse !important; border: 4px solid #FF0000 !important;">
    <thead>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <th colspan="4" align="center" style="border: 4px solid #FF0000 !important; padding: 20px 0;">
          <h3>⚙️Web Restoran Yönetim Paneli</h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- Satır 1 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/restorangiriş.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔐 Restoran Girişi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/restoranpanel.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📊 Mağaza Paneli</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/restoransiparis.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Sipariş Yönetimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/restoranurun.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍔 Ürün Portföyü</b></sub>
        </td>
      </tr>
      <!-- Satır 2 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/restoranayarlar.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>⚙️ Restoran Ayarları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/urunbilgidegisim.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔄 Ürün Bilgi Güncelleme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/yeniurun.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>➕ Yeni Ürün Ekleme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/whopperguncellemeornegi.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍔 Dinamik Menü Yönetimi</b></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<div align="center">
  <table style="width: 100%; table-layout: fixed; border-collapse: collapse !important; border: 4px solid #FF0000 !important;">
    <thead>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <th colspan="4" align="center" style="border: 4px solid #FF0000 !important; padding: 20px 0;">
          <h3>⚙️ Mobil Kullanıcı Paneli</h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- Satır 1 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilgiris.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Güvenli Erişim</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilkayit.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👤 Kayıt Sistemi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilsifreyenile.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔐 Akıllı Sepet</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilkonum.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👤 Kişisel Profil</b></sub>
        </td>
      </tr>
      <!-- Satır 2 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilpizza.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍕 Pizza Kategorisi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilkebap.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍢 Kebap Dünyası</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobiltatli.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍰 Tatlı Menüsü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilburger.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍔 Burger Seçenekleri</b></sub>
        </td>
      </tr>
      <!-- Satır 3 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobildasboard.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🏠 Mobil Dashboard</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilkahve.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>☕ Kahveler</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilprofil.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👤 Kullanıcı Profili</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilsiparis.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📦 Sipariş Geçmişi</b></sub>
        </td>
      </tr>
      <!-- Satır 4 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobiladres.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📍 Adres Yönetimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilödeme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>💳 Ödeme Seçenekleri</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilgüvenlik.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔒 Güvenlik Ayarları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/ornekrestaurant.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>Store Detayı</b></sub>
        </td>
      </tr>
      <!-- Satır 5 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilsepetvekupon.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛒 Sepet & Fırsatlar</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kuponuygula.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🎫 Kupon Uygulama</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/ödeme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>💳 Ödeme Onayı</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/yenisiparisdeneme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔄 Sipariş Süreci</b></sub>
        </td>
      </tr>
      <!-- Satır 6 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/yolda2.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛵 Kurye Yolda</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/uygulama.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📱 Uygulama Görünümü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/ödemeson.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>✅ İşlem Başarılı</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/yenisiparisdeneme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔄 Sipariş Akışı</b></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<div align="center">
  <table style="width: 100%; table-layout: fixed; border-collapse: collapse !important; border: 4px solid #FF0000 !important;">
    <thead>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <th colspan="4" align="center" style="border: 4px solid #FF0000 !important; padding: 20px 0;">
          <h3>⚙️ Mobil Admin Yönetim Paneli</h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kuryeyönetimmobil.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛵 Kurye Yönetimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilsiparisler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Sipariş Listesi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobiliptaldeneme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❌ İptal Prosedürü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilmüsteriler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👥 Müşteri Rehberi</b></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<div align="center">
  <table style="width: 100%; table-layout: fixed; border-collapse: collapse !important; border: 4px solid #FF0000 !important;">
    <thead>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <th colspan="4" align="center" style="border: 4px solid #FF0000 !important; padding: 20px 0;">
          <h3>⚙️ Mobil Admin Yönetim Paneli</h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kuryeyönetimmobil.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛵 Kurye Yönetimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilsiparisler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Sipariş Listesi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobiliptaldeneme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❌ İptal Prosedürü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilmüsteriler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👥 Müşteri Rehberi</b></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<div align="center">
  <table style="width: 100%; table-layout: fixed; border-collapse: collapse !important; border: 4px solid #FF0000 !important;">
    <thead>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <th colspan="4" align="center" style="border: 4px solid #FF0000 !important; padding: 20px 0;">
          <h3>⚙️ Mobil Restaurant Yönetim Paneli</h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/restaurantmobilsiparisler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📋 Mobil Siparişler</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilsiparisteslimdeneme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>✅ Teslimat Kontrol</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilüründüzenle.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>✏️ Ürün Düzenleme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilrestauranturunler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍔 Ürün Yönetimi</b></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<div align="center">
  <table style="width: 100%; table-layout: fixed; border-collapse: collapse !important; border: 4px solid #FF0000 !important;">
    <thead>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <th colspan="4" align="center" style="border: 4px solid #FF0000 !important; padding: 20px 0;">
          <h3>🛵 Web Kurye Yönetim Paneli</h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- Birinci Satır -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/kuryegirismail.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔐 Kurye Girişi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/webkuryerol.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👥 Rol Seçimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/webkuryedashboard.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📊 Kurye Paneli</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/webkuryecalismamodu.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🚥 Çalışma Modu</b></sub>
        </td>
      </tr>
      <!-- İkinci Satır -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/webibankontrol.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>💳 IBAN Kontrol</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/webkuryeaktifgörev.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📍 Aktif Görev</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/webiptalkayit.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❌ İptal Kayıtları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/webteslimkayit.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>✅ Teslimat Kayıtları</b></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<div align="center">
  <table style="width: 100%; table-layout: fixed; border-collapse: collapse !important; border: 4px solid #FF0000 !important;">
    <thead>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <th colspan="4" align="center" style="border: 4px solid #FF0000 !important; padding: 20px 0;">
          <h3>📱 Mobil Kurye Yönetim Paneli</h3>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilkuryedashboard.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📊 Kurye Ana Ekran</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilkuryeteslimat.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📦 Teslimat Geçmişi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilkuryeiptal.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❌ İptal Edilenler</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="screenshots/mobilkuryeaktifsiparisveiban.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>💳 Aktif Sipariş & IBAN</b></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>


