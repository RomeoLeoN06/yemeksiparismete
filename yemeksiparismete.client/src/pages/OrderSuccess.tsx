import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Package, Bike, Home, Download, ReceiptText } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderSuccess = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const orderId = location.state?.orderId || Math.floor(Math.random() * 1000) + 100;
  
  const [step, setStep] = useState(1);

  useEffect(() => {
    clearCart();
    const timer1 = setTimeout(() => setStep(2), 5000);
    const timer2 = setTimeout(() => setStep(3), 15000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="order-success-page fade-in">
      <div className="container success-container">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="success-card-light"
        >
          <div className="confetti-effect"></div>
          
          <div className="success-icon-wrap-lux">
            <Check size={48} strokeWidth={3} />
          </div>
          
          <h1 className="success-main-title">Siparişin Alındı!</h1>
          <p className="success-sub-text">
            Mükemmel bir seçim. Restoranımız hazırlıklara başladı. <br />
            Tahmini teslimat süresi: <strong>25 - 35 dakika</strong>
          </p>
          
          <div className="order-id-pill">
            <ReceiptText size={18} />
            SİPARİŞ NO: #YM-{orderId}
          </div>

          <div className="live-tracking-box">
            <div className="tracking-header">
              <h3>SİPARİŞ DURUMU</h3>
              <div className="pulse-dot"></div>
            </div>

            <div className="tracking-timeline-lux">
              <div className={`track-step ${step >= 1 ? 'active' : ''}`}>
                <div className="track-icon"><Package size={22} /></div>
                <span className="track-label">Hazırlanıyor</span>
              </div>
              <div className="track-line">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: step >= 2 ? '100%' : '0%' }}
                  className="track-progress"
                />
              </div>
              <div className={`track-step ${step >= 2 ? 'active' : ''}`}>
                <div className="track-icon"><Bike size={22} /></div>
                <span className="track-label">Yolda</span>
              </div>
              <div className="track-line">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: step >= 3 ? '100%' : '0%' }}
                  className="track-progress"
                />
              </div>
              <div className={`track-step ${step >= 3 ? 'active' : ''}`}>
                <div className="track-icon"><Home size={22} /></div>
                <span className="track-label">Teslim Edildi</span>
              </div>
            </div>
            
            <div className="tracking-status-message">
              {step === 1 && "Restoran siparişinizi hazırlıyor..."}
              {step === 2 && "Kuryemiz yola çıktı, geliyor!"}
              {step === 3 && "Afiyet olsun! Siparişiniz teslim edildi."}
            </div>
          </div>

          <div className="success-actions-row">
            <Link to="/" className="btn-lux-primary">
              <Home size={18} /> ANA SAYFAYA DÖN
            </Link>
            <button className="btn-lux-outline" onClick={() => window.print()}>
              <Download size={18} /> FİŞİ İNDİR
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .order-success-page { 
          min-height: 100vh; 
          display: flex; align-items: center; justify-content: center; 
          background: var(--bg-main); padding: 80px 20px; 
          background-image: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #0a0a0a 100%);
        }
        .success-container { max-width: 750px; width: 100%; }
        
        .success-card-light { 
          background: var(--bg-card); border-radius: 40px; 
          padding: 80px 60px; text-align: center; 
          box-shadow: var(--shadow-lux); 
          border: 1px solid rgba(255,255,255,0.05); 
          position: relative; overflow: hidden;
        }
        .success-card-light::before {
          content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,126,0,0.05) 0%, transparent 70%);
          z-index: 0; pointer-events: none;
        }

        .success-icon-wrap-lux { 
          width: 120px; height: 120px; 
          background: rgba(255,126,0,0.1); color: var(--primary); 
          border-radius: 40px; display: flex; 
          align-items: center; justify-content: center; 
          margin: 0 auto 40px; 
          box-shadow: 0 20px 40px var(--orange-glow); 
          border: 1px solid rgba(255,126,0,0.2);
          transform: rotate(10deg);
          position: relative; z-index: 1;
        }
        
        .success-main-title { font-size: 4rem; font-weight: 900; color: #fff; letter-spacing: -3px; margin-bottom: 25px; position: relative; z-index: 1; }
        .success-sub-text { font-size: 1.3rem; color: #888; line-height: 1.7; font-weight: 500; margin-bottom: 50px; position: relative; z-index: 1; }

        .order-id-pill { 
          display: inline-flex; align-items: center; gap: 12px; 
          background: #111; padding: 15px 35px; 
          border-radius: 50px; font-weight: 900; 
          color: var(--primary); font-size: 1rem; 
          margin-bottom: 70px; letter-spacing: 2px; 
          border: 1px solid rgba(255,126,0,0.2);
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
          position: relative; z-index: 1;
        }

        .live-tracking-box { 
          background: #0a0a0a; border-radius: 35px; 
          padding: 50px; margin-bottom: 60px; 
          border: 1px solid rgba(255,255,255,0.05); 
          box-shadow: inset 0 10px 30px rgba(0,0,0,0.5);
          position: relative; z-index: 1;
        }
        .tracking-header { 
          display: flex; justify-content: center; 
          align-items: center; gap: 15px; margin-bottom: 50px; 
        }
        .tracking-header h3 { font-size: 1.1rem; font-weight: 900; color: #fff; letter-spacing: 3px; text-transform: uppercase; }
        .pulse-dot { width: 10px; height: 10px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 20px var(--orange-glow); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 126, 0, 0.7); } 70% { box-shadow: 0 0 0 20px rgba(255, 126, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 126, 0, 0); } }

        .tracking-timeline-lux { display: flex; align-items: center; justify-content: space-between; position: relative; margin-bottom: 40px; }
        .track-step { display: flex; flex-direction: column; align-items: center; gap: 20px; color: #444; transition: 0.5s; z-index: 2; }
        .track-step.active { color: #fff; }
        
        .track-icon { 
          width: 75px; height: 75px; 
          background: #111; border-radius: 24px; 
          display: flex; align-items: center; justify-content: center; 
          border: 2px solid rgba(255,255,255,0.05); transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1); 
        }
        .track-step.active .track-icon { border-color: var(--primary); background: var(--primary); color: #000; box-shadow: 0 15px 30px var(--orange-glow); transform: translateY(-5px); }
        .track-label { font-size: 0.9rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }

        .track-line { flex: 1; height: 6px; background: #1a1a1a; margin: 0 -15px 45px; border-radius: 10px; position: relative; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); }
        .track-progress { height: 100%; background: linear-gradient(to right, var(--primary), #fff); width: 0; box-shadow: 0 0 20px var(--orange-glow); }

        .tracking-status-message { font-weight: 900; font-size: 1.3rem; color: #fff; letter-spacing: -0.5px; }

        .success-actions-row { display: flex; gap: 25px; justify-content: center; position: relative; z-index: 1; }

        @media (max-width: 768px) {
          .success-card-light { padding: 60px 30px; border-radius: 30px; }
          .success-main-title { font-size: 2.8rem; }
          .tracking-timeline-lux { flex-direction: column; gap: 50px; }
          .track-line { display: none; }
          .success-actions-row { flex-direction: column; }
          .live-tracking-box { padding: 40px 20px; }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
