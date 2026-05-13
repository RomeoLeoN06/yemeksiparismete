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
<div align="center">

<!-- BAŞLIK VE BADGE'LER -->
<table style="width: 100%; border-collapse: collapse; border: 3px solid #FF0000;">
  <tr>
    <td align="center" style="padding: 20px;">
      <h1>🍕 YemekSiparisMete</h1>
      <p><b>Gastronomi ve Teknolojinin Kusursuz Senfonisi</b></p>
      <img src="https://img.shields.io/github/contributors/mete/yemeksiparismete?style=for-the-badge" />
      <img src="https://img.shields.io/github/repo-size/mete/yemeksiparismete?style=for-the-badge" />
      <img src="https://img.shields.io/github/languages/top/mete/yemeksiparismete?style=for-the-badge" />
    </td>
  </tr>
</table>

<br>

<!-- PROJE ÖZETİ -->
<table style="width: 100%; border-collapse: collapse; border: 2px solid #333;">
  <tr style="background-color: #f8f9fa;">
    <th align="left" style="padding: 10px; border-bottom: 2px solid #333;">📄 Proje Vizyonu</th>
  </tr>
  <tr>
    <td style="padding: 15px; line-height: 1.6;">
      YemekSiparisMete, modern yazılım mimarilerinin tüm imkanları kullanılarak geliştirilmiş, uçtan uca bir yemek sipariş ve yönetim ekosistemidir. Bu proje; ölçeklenebilir bir <b>Backend</b>, estetik bir <b>Web arayüzü</b> ve yüksek performanslı bir <b>Mobil uygulama</b> üçlemesinden oluşmaktadır. Her bir satır kod, kullanıcı deneyimini zirveye taşımak amacıyla titizlikle işlenmiştir.
    </td>
  </tr>
</table>

<br>

<!-- 2. BACKEND MÜHENDİSLİĞİ BÖLÜMÜ -->
<!-- 2. BACKEND MÜHENDİSLİĞİ BÖLÜMÜ -->
<div align="left" style="background-color: #FDFBF7; padding: 20px; border-radius: 12px; border: 1px solid #EAE8E1; font-family: sans-serif;">
  
  <!-- BAŞLIK -->
  <h2 style="color: #4A4A4A; display: flex; align-items: center; gap: 10px; margin-top: 0;">
    🛡️ 2. Backend Mühendisliği: Verimlilik ve Ölçeklenebilirlik
  </h2>
  
  <!-- AÇIKLAMA METNİ -->
  <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
    Sistemin kalbi olan backend tarafında, kurumsal düzeyde (enterprise-grade) teknolojiler kullanılarak sarsılmaz bir iş mantığı katmanı oluşturulmuştur.
  </p>

  <!-- TABLO -->
  <table style="width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
    <thead>
      <tr style="background-color: #E2E0D6; border-bottom: 2px solid #C5C3B6;">
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Teknoloji</th>
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Versiyon</th>
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Görev & Stratejik Avantaj</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>Microsoft .NET Core</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">8.0</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Yüksek işlem kapasiteli, düşük gecikme süreli ana motor.</td>
      </tr>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>Entity Framework Core</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">8.0</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Veritabanı yönetiminde nesne-tabanlı (ORM) esneklik.</td>
      </tr>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>SQL Server</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">Enterprise</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">ACID prensiplerine tam uyumlu, güvenilir veri depolama.</td>
      </tr>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>SignalR</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">Real-Time</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Mutfak ve müşteri arasında kesintisiz canlı veri akışı.</td>
      </tr>
      <tr>
        <td style="padding: 12px; font-size: 14px;"><b>ASP.NET Identity</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">JWT</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Role-based (Rol tabanlı) kriptografik güvenlik sistemi.</td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<!-- 3. VERİTABANI VE VERİ YÖNETİMİ BÖLÜMÜ -->
<div align="left" style="background-color: #FDFBF7; padding: 20px; border-radius: 12px; border: 1px solid #EAE8E1; font-family: sans-serif;">
  
  <!-- BAŞLIK -->
  <h2 style="color: #4A4A4A; display: flex; align-items: center; gap: 10px; margin-top: 0;">
    🗄️ 3. Veritabanı ve Veri Yönetimi (SQL Server)
  </h2>
  
  <!-- AÇIKLAMA METNİ -->
  <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
    Projenin veri ambarı, <b>Microsoft SQL Server</b> üzerinde optimize edilmiştir. Veri bütünlüğü (integrity) ve ilişkisel modelleme (relational mapping) en üst seviyededir.
  </p>

  <!-- TABLO -->
  <table style="width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
    <thead>
      <tr style="background-color: #E2E0D6; border-bottom: 2px solid #C5C3B6;">
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px; width: 30%;">Mimari Özellik</th>
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Teknik Detay & Operasyon</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>İlişkisel Mimari</b></td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Müşteriler, Restoranlar, Ürünler, Siparişler ve Kuryeler arasındaki karmaşık bağlar, verimli <code>Join</code> operasyonları ve indeksleme stratejileriyle yönetilir.</td>
      </tr>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>Veri Güvenliği</b></td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Tüm hassas veriler, uygulama katmanında normalize edildikten sonra SQL Server'ın güvenli havuzuna aktarılır.</td>
      </tr>
      <tr>
        <td style="padding: 12px; font-size: 14px;"><b>Hızlı Kurulum</b></td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Proje içerisinde bulunan <code>YemekSiparisDb_Yedek.sql</code> dosyası ile saniyeler içinde tüm şema ve test verileri ayağa kaldırılabilir.</td>
      </tr>
    </tbody>
  </table>
</div>
<br><!-- 4. AĞ TOPOLOJİSİ VE IPV4 ERİŞİM BÖLÜMÜ -->
<div align="left" style="background-color: #FDFBF7; padding: 20px; border-radius: 12px; border: 1px solid #EAE8E1; font-family: sans-serif;">
  
  <!-- BAŞLIK -->
  <h2 style="color: #4A4A4A; display: flex; align-items: center; gap: 10px; margin-top: 0;">
    🌐 4. Ağ Topolojisi ve IPv4 Erişim Dinamikleri
  </h2>
  
  <!-- AÇIKLAMA METNİ -->
  <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
    Çapraz platform (Cross-platform) haberleşmesi, sistemin en güçlü yanlarından biridir. Mobil ve Web istemcilerinin merkezi sunucuyla sorunsuz etkileşimi için özel bir ağ yapılandırması uygulanmıştır.
  </p>

  <!-- TABLO -->
  <table style="width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
    <thead>
      <tr style="background-color: #E2E0D6; border-bottom: 2px solid #C5C3B6;">
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px; width: 35%;">Konfigürasyon Parametresi</th>
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Tanımlanan Değer / Protokol</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>Sunucu IPv4 Adresi</b></td>
        <td style="padding: 12px; font-size: 14px; color: #D32F2F; font-family: monospace;"><b>10.22.107.60</b></td>
      </tr>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>Dinleme Portu</b></td>
        <td style="padding: 12px; font-size: 14px; color: #333;">5101 (HTTP & TCP)</td>
      </tr>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>Haberleşme Protokolü</b></td>
        <td style="padding: 12px; font-size: 14px; color: #333;">HTTP/REST & WebSockets (SignalR)</td>
      </tr>
      <tr>
        <td style="padding: 12px; font-size: 14px;"><b>Erişim Kapsamı</b></td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Physical Device Testing (Yerel Ağ Köprüsü)</td>
      </tr>
    </tbody>
  </table>

  <!-- ALT NOT -->
  <p style="color: #888; font-size: 13px; margin-top: 15px; font-style: italic;">
    * Bu yapılandırma, <b>localhost</b> sınırlarını aşarak gerçek dünya ağ senaryolarında projenin kesintisiz çalışmasını garanti altına alır.
  </p>
</div>
<br>
<!-- 5. WEB FRONTEND BÖLÜMÜ -->
<div align="left" style="background-color: #FDFBF7; padding: 20px; border-radius: 12px; border: 1px solid #EAE8E1; font-family: sans-serif;">
  
  <!-- BAŞLIK -->
  <h2 style="color: #4A4A4A; display: flex; align-items: center; gap: 10px; margin-top: 0;">
    🎨 5. Web Frontend: Estetik ve Fonksiyonelliğin Senfonisi
  </h2>
  
  <!-- AÇIKLAMA METNİ -->
  <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
    Web arayüzü, <b>React 19</b> ve modern CSS teknikleriyle tasarlanmış, kullanıcı deneyimini (UX) odağına alan bir görsel şölen sunar.
  </p>

  <!-- TABLO -->
  <table style="width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
    <thead>
      <tr style="background-color: #E2E0D6; border-bottom: 2px solid #C5C3B6;">
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Bileşen</th>
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Teknolojik Derinlik</th>
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Stratejik Avantaj</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>React 19</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">Latest Release</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Modern rendering ve üstün component hiyerarşisi.</td>
      </tr>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>Vite Engine</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">Ultra Fast</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Saniyeler içinde yüklenen sayfalar ve optimize bundle.</td>
      </tr>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>TypeScript</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">Type-Safe</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Çalışma zamanı hatalarını sıfıra indiren güçlü kod yapısı.</td>
      </tr>
      <tr>
        <td style="padding: 12px; font-size: 14px;"><b>Framer Motion</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">3D & Glass</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">3D hover efektleri ve premium cam efekti (Glassmorphism).</td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<!-- 6. MOBİL TEKNOLOJİ BÖLÜMÜ -->
<div align="left" style="background-color: #FDFBF7; padding: 20px; border-radius: 12px; border: 1px solid #EAE8E1; font-family: sans-serif;">
  
  <!-- BAŞLIK -->
  <h2 style="color: #4A4A4A; display: flex; align-items: center; gap: 10px; margin-top: 0;">
    📲 6. Mobil Teknoloji: Avucunuzdaki Hız ve Zarafet
  </h2>
  
  <!-- AÇIKLAMA METNİ -->
  <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
    Flutter ile inşa edilen mobil uygulama, native performansını şık bir tasarım diliyle birleştirir.
  </p>

  <!-- TABLO -->
  <table style="width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
    <thead>
      <tr style="background-color: #E2E0D6; border-bottom: 2px solid #C5C3B6;">
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Özellik</th>
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Detay</th>
        <th align="left" style="padding: 12px; color: #4A4A4A; font-size: 14px;">Kullanıcı Deneyimi (UX)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>Flutter / Dart</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">Reaktif Mimari</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Takılmayan, 60 FPS akıcılığında ekran geçişleri.</td>
      </tr>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>Provider</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">State Management</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Verilerin cihaz hafızasında anlık ve tutarlı yönetimi.</td>
      </tr>
      <tr style="border-bottom: 1px solid #EAE8E1;">
        <td style="padding: 12px; font-size: 14px;"><b>Material 3</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">Tasarım Dili</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Modern, temiz ve göz yormayan profesyonel arayüz.</td>
      </tr>
      <tr>
        <td style="padding: 12px; font-size: 14px;"><b>API Sync</b></td>
        <td style="padding: 12px; font-size: 14px; color: #666;">Optimized HTTP</td>
        <td style="padding: 12px; font-size: 14px; color: #333;">Düşük internet hızına sahip ortamlarda bile kararlı veri alışverişi.</td>
      </tr>
    </tbody>
  </table>
</div>
<br>
<!-- AĞ VE GÜVENLİK -->
<table style="width: 100%; border-collapse: collapse; border: 2px solid #FF0000;">
  <tr style="background-color: #fff5f5;">
    <th align="left" style="padding: 10px; border-bottom: 2px solid #FF0000;">🌐 Ağ ve Siber Güvenlik Yapılandırması</th>
  </tr>
  <tr>
    <td style="padding: 15px;">
      <b>📡 IPv4 Erişim Protokolü:</b> Mobil cihazların sunucuya erişimi için sistem <code>10.22.107.60:5101</code> statik adresi üzerinden yayın yapmaktadır.<br><br>
      <b>🔒 Güvenlik Katmanları:</b>
      <ul>
        <li><b>PBKDF2:</b> Kriptografik şifreleme ve tuzlama (Salting).</li>
        <li><b>JWT:</b> Güvenli ve stateless oturum yönetimi.</li>
        <li><b>Validation:</b> Veri girişlerinde tam denetim (Fluent Validation).</li>
      </ul>
    </td>
  </tr>
</table>

<br>

<!-- GÖRSEL GALERİ - WEB KULLANICI -->
<table style="width: 100%; border-collapse: collapse; border: 4px solid #FF0000;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th colspan="4" align="center" style="padding: 20px;"><h3>🖼️ Web Kullanıcı Deneyimi</h3></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" style="padding: 10px;"><img src="screenshot/web_konum.jpeg" width="100%"><br><sub><b>📍 Bölge Filtreleme</b></sub></td>
      <td align="center" style="padding: 10px;"><img src="screenshot/anasayfaweb.jpeg" width="100%"><br><sub><b>🏠 Ana Dashboard</b></sub></td>
      <td align="center" style="padding: 10px;"><img src="screenshot/restoran2.jpeg" width="100%"><br><sub><b>🍴 Restoran Katalog</b></sub></td>
      <td align="center" style="padding: 10px;"><img src="screenshot/webaramakısmı.jpeg" width="100%"><br><sub><b>🔍 Akıllı Arama</b></sub></td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px;"><img src="screenshot/webpizza.jpeg" width="100%"><br><sub><b>🍕 Pizza Dünyası</b></sub></td>
      <td align="center" style="padding: 10px;"><img src="screenshot/kebaplar.jpeg" width="100%"><br><sub><b>🍢 Kebap Kültürü</b></sub></td>
      <td align="center" style="padding: 10px;"><img src="screenshot/webtatlılar.jpeg" width="100%"><br><sub><b>🍰 Tatlı Serüveni</b></sub></td>
      <td align="center" style="padding: 10px;"><img src="screenshot/kahveler.jpeg" width="100%"><br><sub><b>☕ Kahve & İçecek</b></sub></td>
    </tr>
  </tbody>
</table>

<br>

<!-- GÖRSEL GALERİ - MOBİL -->
<table style="width: 100%; border-collapse: collapse; border: 4px solid #FF0000;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th colspan="4" align="center" style="padding: 20px;"><h3>📱 Mobil Uygulama Ekosistemi</h3></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" style="padding: 10px;"><img src="screenshot/mobilgiris.jpeg" width="100%"><br><sub><b>🔐 Güvenli Giriş</b></sub></td>
      <td align="center" style="padding: 10px;"><img src="screenshot/mobildasboard.jpeg" width="100%"><br><sub><b>🏠 Dashboard</b></sub></td>
      <td align="center" style="padding: 10px;"><img src="screenshot/mobilpizza.jpeg" width="100%"><br><sub><b>🍕 Kategoriler</b></sub></td>
      <td align="center" style="padding: 10px;"><img src="screenshot/mobilsepetvekupon.jpeg" width="100%"><br><sub><b>🛒 Akıllı Sepet</b></sub></td>
    </tr>
  </tbody>
</table>

<br>

<!-- SONUÇ TABLE -->
<table style="width: 100%; border-collapse: collapse; border: 2px solid #333;">
  <tr>
    <td align="center" style="padding: 20px; background-color: #333; color: white;">
      <b>🌟 YemekSiparisMete: Teknolojik Sınırların Ötesinde Bir Başarı Hikayesi</b><br>
      <small>Bu proje, modern yazılım dünyasının tüm nimetlerinden faydalanan devasa bir ekosistemdir.</small>
    </td>
  </tr>
</table>

</div>


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


