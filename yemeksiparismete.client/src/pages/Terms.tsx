import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const Terms = () => {
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
              <FileText size={40} />
            </div>
            <h1>Kullanım <span className="text-primary">Şartları</span></h1>
            <p className="last-update">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
          
          <div className="policy-body">
            <section>
              <h2>1. Kabul Edilen Şartlar</h2>
              <p>YemekSiparişim'i kullanarak bu hizmet şartlarını tam olarak kabul etmiş sayılırsınız. Hizmetlerimizi kullanmadan önce lütfen bu koşulları dikkatlice okuyunuz.</p>
            </section>
            <section>
              <h2>2. Kullanıcı Hesabı ve Güvenlik</h2>
              <p>Platform üzerinden sipariş verebilmek için bir hesap oluşturmanız gerekebilir. Hesabınızın güvenliğinden tamamen siz sorumlusunuz. Şifrenizi veya kurtarma kodlarınızı üçüncü şahıslarla paylaşmamalısınız.</p>
            </section>
            <section>
              <h2>3. Sipariş ve İptal Süreci</h2>
              <p>Verilen siparişler restoran tarafından "Hazırlanıyor" aşamasına geçmeden önce tarafınızca iptal edilebilir. Sipariş "Hazırlanıyor" veya "Yolda" statüsüne geçtikten sonra iptal işlemi yapılamaz.</p>
            </section>
            <section>
              <h2>4. Hizmet Değişiklikleri</h2>
              <p>YemekSiparişim yönetimi, dilediği zaman hizmeti geçici veya kalıcı olarak durdurma, şubelerin çalışma saatlerini, menüleri ve fiyatları haber vermeksizin değiştirme hakkını saklı tutar.</p>
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

export default Terms;
