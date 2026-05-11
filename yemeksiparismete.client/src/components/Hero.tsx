import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onSearch?: (value: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) onSearch(val);
  };

  return (
    <div className="ultra-hero">
      <div className="hero-bg-overlay"></div>
      
      <div className="container hero-inner-lux">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-main-lux"
        >
          <div className="hero-status-badge">
            <Sparkles size={16} className="text-primary" />
            <span>Premium Mutfak Deneyimi</span>
          </div>
          
          <h1 className="hero-title-lux">
            Şehrin En Seçkin <br />
            <span className="text-primary">Lezzetleri Kapında.</span>
          </h1>
          
          <p className="hero-subtitle-lux">
            Dünyaca ünlü markalar ve gurme restoranlar, premium teslimat kalitesiyle Mete'de sizi bekliyor.
          </p>

          <div className="hero-search-lux">
            <div className="search-box-lux">
              <Search className="search-icon-lux" size={24} />
              <input 
                type="text" 
                placeholder="Restoran veya ürün arayın..." 
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button 
              className="btn-lux-primary" 
              onClick={() => {
                const el = document.querySelector('.lux-section-title');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              KEŞFET
            </button>
          </div>

          <div className="hero-stats-lux">
            <div className="stat-item-lux">
              <Zap size={20} className="text-primary" />
              <span>Süper Hızlı Teslimat</span>
            </div>
            <div className="stat-item-lux">
              <ShieldCheck size={20} className="text-primary" />
              <span>Güvenli Ödeme</span>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .ultra-hero { 
          background-image: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600'); 
          background-size: cover; 
          background-position: center; 
          padding: 100px 0; 
          position: relative; 
          min-height: 600px; 
          display: flex; 
          align-items: center; 
        }
        .hero-bg-overlay { 
          position: absolute; 
          inset: 0; 
          background: radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.95) 100%); 
        }
        
        .hero-inner-lux { position: relative; z-index: 10; }
        .hero-main-lux { max-width: 1000px; margin: 0 auto; text-align: center; }
        
        .hero-status-badge { 
          display: inline-flex; 
          align-items: center; 
          gap: 12px; 
          background: #111; 
          border: 1px solid rgba(255, 126, 0, 0.2); 
          padding: 14px 32px; 
          border-radius: 50px; 
          color: #fff; 
          font-weight: 900; 
          font-size: 0.85rem; 
          text-transform: uppercase; 
          letter-spacing: 2.5px; 
          margin-bottom: 45px; 
          box-shadow: 0 15px 30px rgba(0,0,0,0.5); 
        }
        
        .hero-title-lux { 
          font-size: 6.5rem; 
          font-weight: 900; 
          line-height: 1.05; 
          margin-bottom: 35px; 
          letter-spacing: -4px; 
          color: #fff;
          text-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .hero-subtitle-lux { 
          font-size: 1.6rem; 
          color: #9ca3af; 
          max-width: 750px; 
          margin: 0 auto 65px; 
          line-height: 1.6; 
          font-weight: 500;
        }

        .hero-search-lux { 
          display: flex; 
          background: #1a1a1a; 
          padding: 12px; 
          border-radius: 24px; 
          width: 100%; 
          max-width: 900px; 
          margin: 0 auto; 
          box-shadow: 0 40px 80px rgba(0,0,0,0.6); 
          border: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }
        .hero-search-lux::after {
          content: ''; position: absolute; inset: -2px; border-radius: 26px;
          background: linear-gradient(135deg, var(--primary), transparent, var(--primary));
          z-index: -1; opacity: 0.2;
        }
        .search-box-lux { flex: 1; display: flex; align-items: center; padding: 0 35px; gap: 25px; }
        .search-icon-lux { color: var(--primary); filter: drop-shadow(0 0 8px var(--orange-glow)); }
        .search-box-lux input { 
          background: transparent; 
          border: none; 
          outline: none; 
          width: 100%; 
          font-size: 1.4rem; 
          font-weight: 700; 
          color: #fff; 
        }
        .search-box-lux input::placeholder { color: #555; }

        .hero-stats-lux { display: flex; justify-content: center; gap: 70px; margin-top: 70px; }
        .stat-item-lux { display: flex; align-items: center; gap: 15px; color: #fff; font-weight: 900; font-size: 1rem; letter-spacing: 1px; text-transform: uppercase; }
        .stat-item-lux .text-primary { color: var(--primary); filter: drop-shadow(0 0 5px var(--orange-glow)); }

        @media (max-width: 1024px) {
          .hero-title-lux { font-size: 4.5rem; }
        }
        @media (max-width: 768px) {
          .ultra-hero { padding: 120px 0; min-height: auto; }
          .hero-title-lux { font-size: 3.5rem; letter-spacing: -2px; }
          .hero-subtitle-lux { font-size: 1.2rem; }
          .hero-search-lux { flex-direction: column; padding: 25px; border-radius: 30px; }
          .search-box-lux { padding: 0 0 25px 0; }
          .hero-stats-lux { flex-direction: column; gap: 30px; align-items: center; }
        }
      `}</style>
    </div>
  );
};

export default Hero;
