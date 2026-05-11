import { Link } from 'react-router-dom';
import { Phone, Mail, Globe, Share2, Send, ArrowUpRight, Sparkles } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-lux-light">
      <div className="container">
        <div className="footer-top-grid">
          
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo-lux" onClick={scrollToTop}>
              <Sparkles size={24} className="text-primary" />
              <span>YEMEK<span className="text-primary">METE</span></span>
            </Link>
            <p className="footer-brand-text">
              Şehrin en prestijli restoranlarını ve gurme lezzetlerini kapınıza getiriyoruz. 
              Gastronomi dünyasında ayrıcalıklı bir deneyim için doğru adrestesiniz.
            </p>
            <div className="footer-social-row">
              <a href="#" className="social-pill">
                <Globe size={18} />
              </a>
              <a href="#" className="social-pill">
                <Share2 size={18} />
              </a>
              <a href="#" className="social-pill">
                <Send size={18} />
              </a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Hizmetlerimiz</h4>
            <ul className="footer-ul">
              <li><Link to="/support">Müşteri Desteği</Link></li>
              <li><Link to="/checkout">Güvenli Ödeme</Link></li>
              <li><Link to="/restaurant/1">Örnek Restoranlar</Link></li>
              <li><Link to="#">Yardım Merkezi</Link></li>
              <li><Link to="/faq">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Kurumsal</h4>
            <ul className="footer-ul">
              <li><Link to="/about">Hakkımızda</Link></li>
              <li><a href="#">Restoran Kaydı</a></li>
              <li><a href="#">Kariyer</a></li>
              <li><a href="#">Blog</a></li>
              <li><Link to="/contact">İletişim</Link></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4 className="footer-heading">İletişim</h4>
            <div className="footer-contact-cards">
              <a href="tel:4440000" className="contact-card-lux">
                <div className="card-icon-wrap">
                  <Phone size={18} />
                </div>
                <div className="card-info">
                  <span className="card-label">7/24 Destek</span>
                  <span className="card-value">444 0 000</span>
                </div>
                <ArrowUpRight size={14} className="card-arrow" />
              </a>
              <a href="mailto:destek@yemekmete.com" className="contact-card-lux">
                <div className="card-icon-wrap">
                  <Mail size={18} />
                </div>
                <div className="card-info">
                  <span className="card-label">E-posta</span>
                  <span className="card-value">destek@yemekmete.com</span>
                </div>
                <ArrowUpRight size={14} className="card-arrow" />
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom-lux">
          <p>&copy; 2026 YemekMete Luxury Dining. Tüm Hakları Saklıdır.</p>
          <div className="bottom-legal-links">
            <Link to="/privacy">Gizlilik</Link>
            <Link to="/terms">Şartlar</Link>
            <a href="#">Çerezler</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-lux-light { 
          background: #080808; 
          padding: 120px 0 60px; 
          border-top: 1px solid rgba(255,255,255,0.05); 
          margin-top: 150px;
          color: #fff;
          position: relative;
        }
        .footer-lux-light::before {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
          opacity: 0.3;
        }
        
        .footer-top-grid { 
          display: grid; 
          grid-template-columns: 1.5fr 0.8fr 0.8fr 1.2fr; 
          gap: 60px; 
          margin-bottom: 80px; 
        }

        .footer-logo-lux { 
          display: flex; 
          align-items: center; 
          gap: 15px; 
          text-decoration: none; 
          font-size: 2.2rem; 
          font-weight: 900; 
          color: #fff; 
          letter-spacing: -2px; 
          margin-bottom: 30px;
        }
        
        .footer-brand-text { 
          color: #666; 
          line-height: 1.8; 
          font-size: 1.1rem; 
          font-weight: 600; 
          margin-bottom: 35px; 
          max-width: 320px;
        }

        .footer-social-row { display: flex; gap: 15px; }
        .social-pill { 
          width: 50px; height: 50px; 
          background: #111; 
          border-radius: 16px; 
          display: flex; align-items: center; justify-content: center; 
          color: #fff; 
          transition: 0.4s; 
          border: 1px solid rgba(255,255,255,0.05);
        }
        .social-pill:hover { 
          background: var(--primary); 
          color: #000; 
          border-color: var(--primary); 
          transform: translateY(-8px); 
          box-shadow: 0 15px 30px var(--orange-glow);
        }

        .footer-heading { 
          font-size: 1.3rem; 
          font-weight: 900; 
          color: #fff; 
          margin-bottom: 35px; 
          letter-spacing: -0.5px;
          text-transform: uppercase;
          font-size: 0.9rem;
          color: #444;
          letter-spacing: 2px;
        }
        
        .footer-ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 18px; }
        .footer-ul a { 
          text-decoration: none; 
          color: #888; 
          font-weight: 700; 
          font-size: 1rem; 
          transition: 0.3s; 
        }
        .footer-ul a:hover { color: var(--primary); transform: translateX(5px); }

        .footer-contact-cards { display: flex; flex-direction: column; gap: 20px; }
        .contact-card-lux { 
          background: #111; 
          border: 1px solid rgba(255,255,255,0.05); 
          border-radius: 22px; 
          padding: 20px 25px; 
          display: flex; 
          align-items: center; 
          gap: 20px; 
          text-decoration: none; 
          color: #fff; 
          transition: 0.4s; 
          position: relative;
        }
        .contact-card-lux:hover { 
          background: #1a1a1a; 
          border-color: var(--primary); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.4); 
          transform: scale(1.03);
        }
        
        .card-icon-wrap { 
          width: 45px; height: 45px; 
          background: rgba(255,126,0,0.1); 
          border-radius: 14px; 
          display: flex; align-items: center; justify-content: center; 
          color: var(--primary); 
          border: 1px solid rgba(255,126,0,0.2);
        }
        .card-info { display: flex; flex-direction: column; gap: 3px; }
        .card-label { font-size: 0.75rem; font-weight: 900; color: #555; text-transform: uppercase; letter-spacing: 1px; }
        .card-value { font-size: 1rem; font-weight: 900; }
        .card-arrow { position: absolute; top: 20px; right: 20px; opacity: 0; transition: 0.3s; color: var(--primary); }
        .contact-card-lux:hover .card-arrow { opacity: 1; transform: translate(3px, -3px); }

        .footer-bottom-lux { 
          border-top: 1px solid rgba(255,255,255,0.05); 
          padding-top: 50px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          color: #444; 
          font-weight: 800; 
          font-size: 0.95rem;
        }
        .bottom-legal-links { display: flex; gap: 35px; }
        .bottom-legal-links a { text-decoration: none; color: inherit; transition: 0.3s; }
        .bottom-legal-links a:hover { color: var(--primary); }

        @media (max-width: 1100px) {
          .footer-top-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }
        @media (max-width: 768px) {
          .footer-lux-light { padding: 80px 0 40px; }
          .footer-top-grid { grid-template-columns: 1fr; }
          .footer-bottom-lux { flex-direction: column; gap: 30px; text-align: center; }
          .footer-logo-lux { font-size: 1.8rem; }
        }
      `}</style>
    </footer>

  );
};

export default Footer;
