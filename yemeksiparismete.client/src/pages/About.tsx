import { motion } from 'framer-motion';
import { Target, Users, Award, ShieldCheck, Sparkles, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="about-page-lux">
      <div className="about-hero">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-badge"
          >
            <Sparkles size={16} className="text-primary" />
            <span>YemekMete Hikayesi</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="about-title"
          >
            Gastronomi Dünyasında <br />
            <span className="text-primary">Yeni Bir Standart.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="about-subtitle"
          >
            2026 yılında başlayan yolculuğumuzda, lezzet tutkunlarını şehrin en seçkin restoranlarıyla buluşturuyoruz. 
            Biz sadece yemek taşımıyoruz; bir yaşam tarzı ve gurme deneyimi sunuyoruz.
          </motion.p>
        </div>
      </div>

      <div className="container py-100">
        <div className="about-grid">
          <motion.div 
            whileHover={{ y: -10 }}
            className="about-card-lux"
          >
            <div className="card-icon"><Target size={32} /></div>
            <h3>Vizyonumuz</h3>
            <p>Türkiye'nin en prestijli yemek sipariş platformu olarak, gastronomi standartlarını teknoloji ile harmanlayıp zirveye taşımak.</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10 }}
            className="about-card-lux"
          >
            <div className="card-icon"><Users size={32} /></div>
            <h3>Değerlerimiz</h3>
            <p>Müşteri memnuniyeti, restoran kalitesi ve kurye güvenliği bizim için pazarlık konusu olmayan temel taşlarımızdır.</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -10 }}
            className="about-card-lux"
          >
            <div className="card-icon"><Award size={32} /></div>
            <h3>Kalite Politikamız</h3>
            <p>Sadece en iyi restoranlarla çalışıyor, her siparişte 5 yıldızlı bir deneyim sunmayı taahhüt ediyoruz.</p>
          </motion.div>
        </div>

        <div className="stats-banner-lux mt-100">
          <div className="stat-box">
            <span className="stat-num">500+</span>
            <span className="stat-label">Gurme Restoran</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">100K+</span>
            <span className="stat-label">Mutlu Müşteri</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">25Dk</span>
            <span className="stat-label">Ort. Teslimat</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">4.9</span>
            <span className="stat-label">Kullanıcı Puanı</span>
          </div>
        </div>

        <div className="about-content-section mt-100">
          <div className="content-image">
            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800" alt="Restaurant Interior" />
            <div className="image-overlay-card">
              <Globe size={40} className="text-primary" />
              <h4>Global Standartlar</h4>
              <p>Hizmet kalitemizi dünya çapındaki en iyi uygulamalarla şekillendiriyoruz.</p>
            </div>
          </div>
          <div className="content-text">
            <div className="text-badge">NEDEN BİZ?</div>
            <h2>Şehrin En İyi <span className="text-primary">Mutfaklarıyla</span> Çalışıyoruz.</h2>
            <p>YemekMete olarak, her restoranı özenle seçiyoruz. Hijyen, lezzet ve servis kalitesi kriterlerimizi karşılayan mekanlarla iş birliği yaparak, size en iyisini sunuyoruz.</p>
            <ul className="about-list">
              <li><ShieldCheck size={20} className="text-primary" /> Seçkin Restoran Portföyü</li>
              <li><ShieldCheck size={20} className="text-primary" /> VIP Kurye Hizmeti</li>
              <li><ShieldCheck size={20} className="text-primary" /> 7/24 Öncelikli Destek</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .about-page-lux { background: var(--bg-main); color: #fff; min-height: 100vh; }
        
        .about-hero { 
          padding: 150px 0 100px; 
          background-image: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 100%);
          text-align: center;
        }
        .hero-badge { 
          display: inline-flex; align-items: center; gap: 10px; 
          background: #111; padding: 12px 25px; border-radius: 50px; 
          font-weight: 900; font-size: 0.8rem; text-transform: uppercase; 
          letter-spacing: 2px; color: #fff; border: 1px solid rgba(255,126,0,0.2);
          margin-bottom: 30px;
        }
        .about-title { font-size: 5rem; font-weight: 900; letter-spacing: -3px; line-height: 1.1; margin-bottom: 30px; }
        .about-subtitle { font-size: 1.4rem; color: #888; max-width: 800px; margin: 0 auto; line-height: 1.7; }

        .about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: -50px; }
        .about-card-lux { 
          background: #111; padding: 50px; border-radius: 35px; 
          border: 1px solid rgba(255,255,255,0.05); box-shadow: var(--shadow-lux); 
          text-align: center;
        }
        .card-icon { width: 80px; height: 80px; background: var(--accent); border-radius: 25px; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; color: var(--primary); }
        .about-card-lux h3 { font-size: 1.8rem; font-weight: 900; margin-bottom: 20px; }
        .about-card-lux p { color: #888; line-height: 1.8; font-weight: 500; }

        .stats-banner-lux { 
          background: #111; padding: 60px; border-radius: 40px; 
          display: flex; justify-content: space-around; 
          border: 1px solid rgba(255,255,255,0.05);
        }
        .stat-box { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .stat-num { font-size: 3.5rem; font-weight: 900; color: var(--primary); letter-spacing: -2px; }
        .stat-label { font-size: 0.9rem; font-weight: 800; color: #666; text-transform: uppercase; letter-spacing: 2px; }

        .about-content-section { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .content-image { position: relative; border-radius: 40px; overflow: hidden; }
        .content-image img { width: 100%; border-radius: 40px; transition: 0.5s; }
        .content-image:hover img { transform: scale(1.05); }
        .image-overlay-card { 
          position: absolute; bottom: 40px; right: 40px; 
          background: rgba(10,10,10,0.9); backdrop-filter: blur(20px); 
          padding: 40px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1);
          max-width: 250px;
        }
        .image-overlay-card h4 { font-size: 1.2rem; margin: 15px 0 10px; }
        .image-overlay-card p { font-size: 0.9rem; color: #888; line-height: 1.6; }

        .text-badge { color: var(--primary); font-weight: 900; font-size: 0.8rem; letter-spacing: 3px; margin-bottom: 20px; }
        .content-text h2 { font-size: 3.5rem; font-weight: 900; line-height: 1.2; margin-bottom: 30px; letter-spacing: -1.5px; }
        .content-text p { font-size: 1.1rem; color: #888; line-height: 1.8; margin-bottom: 40px; }
        .about-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 20px; }
        .about-list li { display: flex; align-items: center; gap: 15px; font-weight: 800; font-size: 1.1rem; color: #eee; }

        @media (max-width: 1024px) {
          .about-grid { grid-template-columns: 1fr; }
          .about-content-section { grid-template-columns: 1fr; }
          .about-title { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
};

export default About;
