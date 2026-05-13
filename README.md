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
# 💎 YemekSiparisMete: Teknolojik Mükemmeliyet ve Mimari Vizyon Raporu

Bu döküman, **YemekSiparisMete** projesinin sadece bir yazılım değil, Veterans aynı zamanda mühendislik ve estetiğin harmanlandığı dijital bir sanat eseri olduğunu kanıtlayan en kapsamlı teknik analiz ve vizyon belgesidir. Sistemimizin her bir satır kodu, kullanıcı deneyimini zirveye taşımak ve sürdürülebilir bir teknolojik altyapı oluşturmak amacıyla titizlikle işlenmiştir.

## 🏛️ 1. Mimari Şaheser: N-Tier Katmanlı Yapı ve Entegrasyon

Sistemimiz, birbirinden bağımsız çalışan ancak mükemmel bir uyum içerisinde haberleşen üç ana devasa katman üzerine inşa edilmiştir. Bu mimari tercih, projenin on binlerce kullanıcıya aynı anda hizmet verebilecek esnekliğe sahip olmasını sağlar.

*   **🛡️ Core Backend (Merkezi Güç Merkezi):** ASP.NET Core 8.0 teknolojisiyle donatılmış, projenin beynini oluşturan bu katman; tüm veri akışını, güvenlik protokollerini ve iş mantığını yöneten devasa bir orkestra şefidir.
*   **✨ Web Client (İnteraktif Portal):** React 19 ve TypeScript'in gücünü arkasına alan web arayüzü, kullanıcılara sadece bir sipariş platformu değil, aynı zamanda akıcı animasyonlarla bezenmiş dijital bir deneyim alanı sunar.
*   **📱 Mobile Application (Mobil Ekosistem):** Flutter ve Dart'ın sunduğu yerel (native) performans avantajlarıyla, hem iOS hem de Android dünyasında ödün vermeyen, hızlı ve sezgisel bir kullanım vaat eder.

## ⚙️ 2. Backend Mühendisliği: Verimlilik ve Ölçeklenebilirlik

Sistemin kalbi olan backend tarafında, modern yazılım dünyasının en prestijli kütüphane ve araçları bir araya getirilmiştir.

### ⚙️ Bileşen Teknolojik Derinlik & Stratejik Avantajları:

| Bileşen | Teknolojik Derinlik | Stratejik Avantaj |
| :--- | :--- | :--- |
| **Microsoft .NET 8.0** | Dünyanın en hızlı ve güvenilir backend frameworklerinden biridir. | Düşük gecikme süresi (Low Latency) ve yüksek işlem kapasitesi. |
| **Entity Framework Core 8** | Nesne-tabanlı (Object-Oriented) veri erişim mimarisidir. | Veritabanı sorgularında maksimum hız ve kod okunabilirliği sağlar. |
| **SQL Server Enterprise** | Kritik verilerin milisaniyeler içinde işlendiği ana depolama merkezidir. | Veri tutarlılığı (ACID prensipleri) ve devasa veri setlerini yönetme kabiliyeti. |
| **SignalR Real-Time Hub** | Sunucu ve istemci arasında kurulan çift yönlü canlı veri tünelidir. | Siparişlerin mutfaktan yola çıkışına kadar her anın anlık izlenebilmesi. |
| **ASP.NET Core Identity** | Microsoft'un en gelişmiş kimlik doğrulama ve yetkilendirme kütüphanesidir. | Role-based (Rol tabanlı) erişim kontrolü ile kusursuz hiyerarşi. |

## 🎨 3. Web Frontend: Estetik ve Fonksiyonelliğin Dansı

Web tarafında kullanılan **React 19**, projenin sadece bugününe değil, geleceğine de yatırım yapıldığının en büyük kanıtıdır. **Vite** derleyicisi sayesinde arayüz, ışık hızında yüklenerek kullanıcıyı asla bekletmez.

*   **🚀 Performans Odaklı TypeScript:** Tip-güvenli kod yapısı sayesinde, çalışma zamanı hataları minimize edilmiş ve sürdürülebilir bir geliştirme ortamı oluşturulmuştur.
*   **🌈 Görsel Şölen (Glassmorphism & 3D):** **Framer Motion** kütüphanesi kullanılarak tasarlanan kart yapıları, 3D hover efektleri ve cam efekti (glassmorphism) ile modern dünyanın en şık arayüz standartlarını yakalamıştır.
*   **📑 Detaylandırılmış Sayfa Mimarisi:**
    *   **Dashboard:** Yöneticiler için verilerin görselleştirildiği bir kontrol kulesi.
    *   **Checkout:** Adım adım ilerleyen, kullanıcıyı yormayan ve hata payını sıfıra indiren akıllı ödeme süreci.
    *   **Restaurant Management:** Restoran sahiplerinin menülerini, stoklarını ve siparişlerini gerçek zamanlı yönetebildiği profesyonel panel.

## 📲 4. Mobil Teknoloji: Avucunuzdaki Hız ve Zarafet

Flutter ile hayat bulan mobil uygulamamız, kullanıcı dostu tasarımı ve teknik kapasitesiyle rakiplerinden ayrışır.

*   **💎 UI/UX Mükemmeliyeti:** Google Fonts ile zenginleştirilmiş tipografi, her pikseli özenle hesaplanmış butonlar ve akıcı sayfa geçişleri.
*   **🧠 Provider State Management:** Uygulamanın hafızasını yöneten bu mimari, verilerin ekranlar arasında takılmadan ve en verimli şekilde akmasını sağlar.
*   **🔗 API Entegrasyonu:** Backend ile kurulan optimize edilmiş HTTP kanalları sayesinde, veri transferi minimum paket boyutlarıyla ve maksimum hızla gerçekleşir.

## 🔐 5. Siber Güvenlik: Kırılmaz Bir Dijital Kale

Kullanıcılarımızın güvenliği bizim için bir seçenek değil, mutlak bir zorunluluktur. Bu doğrultuda sistemimiz en üst düzey koruma mekanizmalarıyla donatılmıştır.

*   **🛡️ PBKDF2 Hashing Algoritması:** Parolalar, brute-force saldırılarına karşı dünyanın en dirençli algoritmalarından biriyle binlerce kez tekrarlanarak şifrelenir.
*   **🎫 JWT & Stateless Auth:** Her kullanıcı oturumu, kriptografik olarak imzalanmış benzersiz tokenlar ile yönetilir. Bu sayede sunucu tarafında gereksiz yük oluşmaz ve güvenlikten ödün verilmez.
*   **🧩 Veri Bütünlüğü ve Validasyon:** Gelen her veri, backend tarafında en katı kurallardan geçirilerek (Fluent Validation mantığıyla) sisteme kabul edilir. Telefon numarası ve adres gibi kritik bilgiler, yanlış formatlara karşı otomatik olarak normalize edilir.

## 📈 6. Projenin Teknik Bilançosu ve Gelecek Vizyonu

*   **Geniş Kapsam:** 20'den fazla işlevsel sayfa, 15+ karmaşık veritabanı tablosu ve onlarca mikro servis benzeri endpoint.
*   **Temiz Kod (Clean Code):** SOLID prensiplerine tam uyum sağlayan klasör yapısı sayesinde, sisteme yeni özellikler eklemek bir lego parçası birleştirmek kadar kolaydır.
*   **Gelecek Hazırlığı:** Mimari yapımız, ilerleyen aşamalarda **Microservices** veya **Docker** konteynerize sistemlere geçiş için tam uyumlu tasarlanmıştır.

## 🌟 Sonuç

**YemekSiparisMete**, teknolojik sınırların zorlandığı, kullanıcı mutluluğunun her şeyin önünde tutulduğu ve modern yazılım mimarisinin tüm nimetlerinden faydalanan devasa bir ekosistemdir. Bu sistem, hem bir ticari platform hem de teknik bir başarı hikayesidir.


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
          <img src="webpizza.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍕 Pizza Dünyası</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="kebaplar.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍢 Kebap Kültürü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="webtatlılar.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍰 Tatlı Serüveni</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="kahveler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>☕ Kahve & İçecek</b></sub>
        </td>
      </tr>
      <!-- Satır 3 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="ornekrestaurantgorunus.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🏪 Örnek Restaurant</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="ornekurunler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍔 Örnek Ürünler</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="orneksepet.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛒 Örnek Sepet</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="footerweb.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📄 Bilgi & Footer</b></sub>
        </td>
      </tr>
      <!-- Satır 4 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="yanmenü.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📱 Yan Menü Navigasyon</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="kuryelik.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🚲 Kurye Başvuru Sistemi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="hakkında.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>ℹ️ Hakkında</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="hakkında3.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>ℹ️ Hakkında Devam</b></sub>
        </td>
      </tr>
      <!-- Satır 5 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="giris.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔐 Kullanıcı Girişi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="kayıt.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Yeni Kayıt Ekranı</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="destek.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🎧 Canlı Destek Sistemi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="yardım.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❓ Yardım Merkezi</b></sub>
        </td>
      </tr>
      <!-- Satır 6 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="profil.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👤 Kullanıcı Profili</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="siparis.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📦 Sipariş Geçmişi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="adresim.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📍 Teslimat Adreslerim</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="odeme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>💳 Ödeme Yöntemleri</b></sub>
        </td>
      </tr>
      <!-- Satır 7 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="kayıtsiparis.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Sipariş Onayları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="kuponlar.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🎫 İndirim Kuponları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="guvenlik.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔒 İşlem Güvenliği</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="kuponlar2.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🎁 Kampanyalar</b></sub>
        </td>
      </tr>
      <!-- Satır 8 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="konumdegis.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔄 Konum Güncelleme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="yoldayım.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛵 Sipariş Yolda</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="teslimveyıldızı.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>⭐ Değerlendirme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="iptal.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
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
          <img src="yoneticianasayfa.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📊 Yönetici Özeti</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="sipariskontrol.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📑 Sipariş Denetimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="musteriler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👥 Müşteri Portföyü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="kuryeyönetim.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛵 Kurye Operasyonu</b></sub>
        </td>
      </tr>
      <!-- Satır 2 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="yoneticiprofil.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👤 Yetki & Hesap Ayarları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="guvenlikadmin.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛡️ Admin Güvenlik Duvarı</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="yonetimkontrol.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🎮 Genel Kontrol Merkezi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="kuryekontrol.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
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
          <img src="restorangiriş.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔐 Restoran Girişi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="restoranpanel.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📊 Mağaza Paneli</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="restoransiparis.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Sipariş Yönetimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="restoranurun.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍔 Ürün Portföyü</b></sub>
        </td>
      </tr>
      <!-- Satır 2 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="restoranayarlar.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>⚙️ Restoran Ayarları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="urunbilgidegisim.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔄 Ürün Bilgi Güncelleme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="yeniurun.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>➕ Yeni Ürün Ekleme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="whopperguncellemeornegi.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
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
          <img src="mobilgiris.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Güvenli Erişim</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilkayit.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👤 Kayıt Sistemi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilsifreyenile.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔐 Akıllı Sepet</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilkonum.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👤 Kişisel Profil</b></sub>
        </td>
      </tr>
      <!-- Satır 2 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilpizza.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍕 Pizza Kategorisi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilkebap.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍢 Kebap Dünyası</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobiltatli.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍰 Tatlı Menüsü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilburger.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🍔 Burger Seçenekleri</b></sub>
        </td>
      </tr>
      <!-- Satır 3 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobildasboard.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🏠 Mobil Dashboard</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilkahve.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>☕ Kahveler</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilprofil.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👤 Kullanıcı Profili</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilsiparis.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📦 Sipariş Geçmişi</b></sub>
        </td>
      </tr>
      <!-- Satır 4 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobiladres.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📍 Adres Yönetimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilödeme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>💳 Ödeme Seçenekleri</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilgüvenlik.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔒 Güvenlik Ayarları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="ornekrestaurant.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>Store Detayı</b></sub>
        </td>
      </tr>
      <!-- Satır 5 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilsepetvekupon.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛒 Sepet & Fırsatlar</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="kuponuygula.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🎫 Kupon Uygulama</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="ödeme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>💳 Ödeme Onayı</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="yenisiparisdeneme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔄 Sipariş Süreci</b></sub>
        </td>
      </tr>
      <!-- Satır 6 -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="yolda2.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛵 Kurye Yolda</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="uygulama.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📱 Uygulama Görünümü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="ödemeson.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>✅ İşlem Başarılı</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="yenisiparisdeneme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
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
          <img src="kuryeyönetimmobil.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛵 Kurye Yönetimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilsiparisler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Sipariş Listesi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobiliptaldeneme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❌ İptal Prosedürü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilmüsteriler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
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
          <img src="kuryeyönetimmobil.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🛵 Kurye Yönetimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilsiparisler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📝 Sipariş Listesi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobiliptaldeneme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❌ İptal Prosedürü</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilmüsteriler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
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
          <img src="restaurantmobilsiparisler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📋 Mobil Siparişler</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilsiparisteslimdeneme.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>✅ Teslimat Kontrol</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilüründüzenle.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>✏️ Ürün Düzenleme</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilrestauranturunler.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
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
          <img src="kuryegirismail.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🔐 Kurye Girişi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="webkuryerol.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>👥 Rol Seçimi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="webkuryedashboard.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📊 Kurye Paneli</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="webkuryecalismamodu.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>🚥 Çalışma Modu</b></sub>
        </td>
      </tr>
      <!-- İkinci Satır -->
      <tr style="border: 4px solid #FF0000 !important; background-color: transparent !important;">
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="webibankontrol.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>💳 IBAN Kontrol</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="webkuryeaktifgörev.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📍 Aktif Görev</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="webiptalkayit.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❌ İptal Kayıtları</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="webteslimkayit.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
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
          <img src="mobilkuryedashboard.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📊 Kurye Ana Ekran</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilkuryeteslimat.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>📦 Teslimat Geçmişi</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilkuryeiptal.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>❌ İptal Edilenler</b></sub>
        </td>
        <td align="center" style="border: 4px solid #FF0000 !important; padding: 10px; vertical-align: top;">
          <img src="mobilkuryeaktifsiparisveiban.jpeg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 2px solid #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
          <br><sub><b>💳 Aktif Sipariş & IBAN</b></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>


