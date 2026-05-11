import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="policy-page">
      <div className="container">
        <motion.div 
          className="policy-content-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="policy-header">
            <div className="icon-wrap">
              <Shield size={40} />
            </div>
            <h1>Gizlilik <span className="text-primary">Politikası</span></h1>
            <p className="last-update">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
          
          <div className="policy-body">
            <section>
              <h2>1. Veri Toplama ve Kullanımı</h2>
              <p>YemekSiparişim, size daha iyi ve kesintisiz bir deneyim sunmak için sipariş geçmişiniz, konumunuz, iletişim bilgileriniz ve tercihlerinizi güvenli bir şekilde toplar ve şifreleyerek saklar.</p>
            </section>
            <section>
              <h2>2. Bilgilerinizin Korunması</h2>
              <p>Tüm hassas verileriniz endüstri standartlarında modern şifreleme yöntemleriyle (HTTPS/TLS) korunmaktadır. Şifreleriniz veritabanımızda hiçbir zaman düz metin olarak tutulmaz, güçlü hash algoritmalarıyla korunur.</p>
            </section>
            <section>
              <h2>3. Çerezler (Cookies)</h2>
              <p>Platformumuz, cihazınıza daha iyi adapte olmak, oturumunuzu açık tutmak ve sipariş tercihlerinizi hatırlamak için çerezleri (cookies) kullanır. Bu çerezler tarayıcınız üzerinden dilediğiniz zaman temizlenebilir veya engellenebilir.</p>
            </section>
            <section>
              <h2>4. Üçüncü Taraflarla Paylaşım</h2>
              <p>Kişisel verileriniz hiçbir kurum, kuruluş veya üçüncü şahıs ile reklam ve pazarlama amacıyla kesinlikle paylaşılmaz. Yalnızca; teslimat adresiniz ve telefon numaranız, siparişi size güvenle ulaştıracak olan kurye ve ilgili restoran ile operasyonel olarak paylaşılır.</p>
            </section>
          </div>
        </motion.div>
      </div>

      <style>{`
        .policy-page {
          background: var(--bg-main);
          min-height: 100vh;
          padding: 80px 0 120px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
        }
        .policy-content-box {
          max-width: 800px;
          margin: 0 auto;
          background: #111;
          border-radius: 40px;
          padding: 60px;
          border: 1px solid rgba(255,126,0,0.1);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .policy-header {
          text-align: center;
          margin-bottom: 50px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 30px;
        }
        .icon-wrap {
          width: 80px;
          height: 80px;
          background: rgba(255,126,0,0.1);
          color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 1px solid rgba(255,126,0,0.2);
        }
        .policy-header h1 {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: -1.5px;
          margin-bottom: 10px;
        }
        .last-update {
          color: #888;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .policy-body section {
          margin-bottom: 40px;
        }
        .policy-body h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 15px;
        }
        .policy-body p {
          color: #ccc;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        @media (max-width: 768px) {
          .policy-content-box {
            padding: 30px 20px;
            border-radius: 25px;
          }
          .policy-header h1 {
            font-size: 2.2rem;
          }
          .policy-page {
            padding: 40px 0 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default Privacy;
