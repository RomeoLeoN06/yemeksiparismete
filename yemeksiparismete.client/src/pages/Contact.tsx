import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="contact-page-lux">
      <div className="contact-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="contact-title"
          >
            Bize <span className="text-primary">Ulaşın.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="contact-subtitle"
          >
            Her türlü soru, öneri veya iş birliği talebiniz için ekibimiz size yardımcı olmaya hazır.
          </motion.p>
        </div>
      </div>

      <div className="container py-100">
        <div className="contact-grid">
          <div className="contact-info-col">
            <div className="info-card-lux">
              <div className="card-header-lux">
                <MessageSquare className="text-primary" size={28} />
                <h3>İletişim Bilgileri</h3>
              </div>
              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon"><Phone size={20} /></div>
                  <div className="info-text">
                    <span className="info-label">Müşteri Hizmetleri</span>
                    <span className="info-val">444 0 000</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><Mail size={20} /></div>
                  <div className="info-text">
                    <span className="info-label">E-posta</span>
                    <span className="info-val">destek@yemekmete.com</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><MapPin size={20} /></div>
                  <div className="info-text">
                    <span className="info-label">Genel Merkez</span>
                    <span className="info-val">Lezzet Plaza No:42, Beşiktaş / İstanbul</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card-lux mt-30">
              <div className="card-header-lux">
                <Clock className="text-primary" size={28} />
                <h3>Çalışma Saatleri</h3>
              </div>
              <p className="work-hours-text">
                Operasyon ekibimiz size en iyi hizmeti sunmak için <strong>7 gün 24 saat</strong> kesintisiz çalışmaktadır.
              </p>
              <div className="social-links-row">
                <div className="social-btn"><Globe size={20} /></div>
                <div className="social-btn"><MessageSquare size={20} /></div>
                <div className="social-btn"><Mail size={20} /></div>
              </div>
            </div>
          </div>

          <div className="contact-form-col">
            <div className="form-card-lux">
              <h2>Mesaj <span className="text-primary">Gönderin</span></h2>
              {isSent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="success-alert"
                >
                  <Send size={40} />
                  <h3>Mesajınız İletildi!</h3>
                  <p>En kısa sürede tarafınıza dönüş sağlayacağız.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="lux-form">
                  <div className="form-row">
                    <div className="input-group">
                      <label>AD SOYAD</label>
                      <input type="text" required placeholder="İsim Soyisim" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>E-POSTA</label>
                      <input type="email" required placeholder="eposta@adresiniz.com" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>KONU</label>
                    <input type="text" required placeholder="Mesaj konusu" value={formState.subject} onChange={e => setFormState({...formState, subject: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>MESAJINIZ</label>
                    <textarea rows={6} required placeholder="Size nasıl yardımcı olabiliriz?" value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} />
                  </div>
                  <button type="submit" className="btn-lux-primary w-full">MESAJI GÖNDER <Send size={18} /></button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-page-lux { background: var(--bg-main); color: #fff; min-height: 100vh; }
        .contact-hero { padding: 120px 0 60px; text-align: center; background-image: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 100%); }
        .contact-title { font-size: 5rem; font-weight: 900; letter-spacing: -3px; margin-bottom: 20px; }
        .contact-subtitle { font-size: 1.4rem; color: #888; max-width: 600px; margin: 0 auto; }

        .contact-grid { display: grid; grid-template-columns: 450px 1fr; gap: 60px; }
        
        .info-card-lux { background: #111; padding: 45px; border-radius: 35px; border: 1px solid rgba(255,255,255,0.05); box-shadow: var(--shadow-lux); }
        .card-header-lux { display: flex; align-items: center; gap: 20px; margin-bottom: 35px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px; }
        .card-header-lux h3 { font-size: 1.6rem; font-weight: 900; }
        
        .info-list { display: flex; flex-direction: column; gap: 30px; }
        .info-item { display: flex; align-items: center; gap: 20px; }
        .info-icon { width: 50px; height: 50px; background: var(--accent); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--primary); border: 1px solid rgba(255,126,0,0.1); }
        .info-text { display: flex; flex-direction: column; gap: 5px; }
        .info-label { font-size: 0.75rem; font-weight: 900; color: #555; text-transform: uppercase; letter-spacing: 1.5px; }
        .info-val { font-size: 1.1rem; font-weight: 800; color: #eee; }

        .work-hours-text { color: #888; font-size: 1.1rem; line-height: 1.7; margin-bottom: 30px; }
        .social-links-row { display: flex; gap: 15px; }
        .social-btn { width: 50px; height: 50px; background: #080808; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: 0.3s; }
        .social-btn:hover { background: var(--primary); color: #000; transform: translateY(-5px); box-shadow: 0 10px 20px var(--orange-glow); }

        .form-card-lux { background: #111; padding: 60px; border-radius: 40px; border: 1px solid rgba(255,255,255,0.05); box-shadow: var(--shadow-lux); }
        .form-card-lux h2 { font-size: 2.8rem; font-weight: 900; margin-bottom: 45px; letter-spacing: -1.5px; }
        
        .lux-form { display: flex; flex-direction: column; gap: 30px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .input-group { display: flex; flex-direction: column; gap: 12px; }
        .input-group label { font-size: 0.75rem; font-weight: 900; color: #555; letter-spacing: 2px; }
        .input-group input, .input-group textarea { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 18px; color: #fff; font-weight: 700; outline: none; transition: 0.3s; }
        .input-group input:focus, .input-group textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 5px rgba(255,126,0,0.05); }

        .success-alert { text-align: center; padding: 60px 0; color: #10b981; }
        .success-alert h3 { font-size: 2rem; margin-top: 25px; color: #fff; }
        .success-alert p { color: #888; font-size: 1.1rem; margin-top: 10px; }

        @media (max-width: 1024px) {
          .contact-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .contact-title { font-size: 3.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Contact;
