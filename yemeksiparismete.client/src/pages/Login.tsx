import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Shield } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const [identifier, setIdentifier] = useState(location.state?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const successMessage = location.state?.message;

  const [showForgot, setShowForgot] = useState(false);
  const [resetForm, setResetForm] = useState({ email: '', recoveryCode: '', newPassword: '' });
  const [resetMsg, setResetMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      setError('E-posta/Telefon veya şifre hatalı. Lütfen kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResetMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetForm)
      });
      const data = await res.json();
      if (res.ok) {
        setResetMsg({ type: 'success', text: 'Şifreniz başarıyla yenilendi! Yeni kurtarma kodunuzu profilinizden almayı unutmayın.' });
        setTimeout(() => setShowForgot(false), 3000);
      } else {
        setResetMsg({ type: 'error', text: data.message || 'Hata oluştu. Kodunuzu kontrol edin.' });
      }
    } catch (err) {
      setResetMsg({ type: 'error', text: 'Sunucuya bağlanılamadı.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="auth-card-light"
        >
          {showForgot ? (
            <div className="fade-in">
              <div className="auth-header">
                <div className="auth-icon-wrap" style={{ background: 'rgba(255,126,0,0.1)' }}>
                  <Lock size={32} className="text-primary" />
                </div>
                <h2 className="auth-title">Şifre Yenileme</h2>
                <p className="auth-subtitle">Kurtarma kodunuzu kullanarak şifrenizi sıfırlayın.</p>
              </div>

              {resetMsg.text && (
                <div className={`auth-${resetMsg.type}-box mb-20`} style={{
                  padding: '15px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px', fontWeight: 800,
                  backgroundColor: resetMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: resetMsg.type === 'success' ? '#10b981' : '#ef4444',
                  border: `1px solid ${resetMsg.type === 'success' ? '#10b981' : '#ef4444'}`
                }}>
                  {resetMsg.text}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="input-group-lux">
                  <label>E-POSTA</label>
                  <div className="input-field-lux">
                    <Mail size={18} />
                    <input type="email" required placeholder="ornek@mail.com" value={resetForm.email} onChange={e => setResetForm({...resetForm, email: e.target.value})} />
                  </div>
                </div>
                <div className="input-group-lux">
                  <label>KURTARMA KODU (6 HANELİ)</label>
                  <div className="input-field-lux">
                    <Shield size={18} style={{ color: 'var(--primary)' }} />
                    <input type="text" required maxLength={6} placeholder="ABC123" value={resetForm.recoveryCode} onChange={e => setResetForm({...resetForm, recoveryCode: e.target.value.toUpperCase()})} />
                  </div>
                </div>
                <div className="input-group-lux">
                  <label>YENİ ŞİFRE</label>
                  <div className="input-field-lux">
                    <Lock size={18} />
                    <input type="password" required placeholder="••••••••" value={resetForm.newPassword} onChange={e => setResetForm({...resetForm, newPassword: e.target.value})} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-lux-primary w-full">
                  {loading ? 'GÜNCELLENİYOR...' : 'ŞİFREYİ SIFIRLA'}
                </button>
                <button type="button" onClick={() => setShowForgot(false)} className="btn-lux-outline w-full" style={{ background: 'none', border: 'none', color: '#666', fontWeight: 800, cursor: 'pointer', marginTop: '10px' }}>
                  Giriş Yap'a Dön
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="auth-header">
                <div className="auth-icon-wrap">
                  <LogIn size={32} className="text-primary" />
                </div>
                <h2 className="auth-title">Tekrar Hoş Geldiniz</h2>
                <p className="auth-subtitle">Lezzet kaldığı yerden devam ediyor.</p>
              </div>

              {successMessage && (
                <div className="auth-success-box">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group-lux">
                  <label>E-POSTA VEYA TELEFON</label>
                  <div className="input-field-lux">
                    <Mail size={18} />
                    <input 
                      type="text" 
                      value={identifier} 
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="ornek@mail.com veya 05XX..."
                      required
                    />
                  </div>
                </div>

                <div className="input-group-lux">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>ŞİFRE</label>
                    <button type="button" onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>
                      ŞİFREMİ UNUTTUM
                    </button>
                  </div>
                  <div className="input-field-lux">
                    <Lock size={18} />
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="auth-error-box">
                    {error}
                  </motion.div>
                )}

                <button type="submit" disabled={loading} className="btn-lux-primary w-full">
                  {loading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
                </button>
              </form>
            </>
          )}

          <div className="auth-footer-text">
            Hesabınız yok mu? <Link to="/register">Hemen Kayıt Olun</Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-main);
          background-image: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 100%);
          padding: 80px 20px;
        }
        .auth-card-light {
          max-width: 500px;
          width: 100%;
          margin: 0 auto;
          background: var(--bg-card);
          padding: 70px 50px;
          border-radius: 40px;
          box-shadow: var(--shadow-lux);
          border: 1px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }
        .auth-card-light::before {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
        }

        .auth-header { text-align: center; margin-bottom: 50px; }
        .auth-icon-wrap { 
          width: 90px; height: 90px; 
          background: rgba(255,126,0,0.1); 
          border-radius: 30px; 
          display: flex; align-items: center; justify-content: center; 
          margin: 0 auto 25px; 
          border: 1px solid rgba(255, 126, 0, 0.2);
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
          transform: rotate(5deg);
        }
        .auth-title { font-size: 2.8rem; font-weight: 900; color: #fff; letter-spacing: -2px; margin-bottom: 12px; }
        .auth-subtitle { color: #666; font-weight: 700; font-size: 1.1rem; }

        .auth-form { display: flex; flex-direction: column; gap: 30px; }
        .input-group-lux { display: flex; flex-direction: column; gap: 12px; }
        .input-group-lux label { font-size: 0.75rem; font-weight: 900; color: #555; letter-spacing: 2px; text-transform: uppercase; padding-left: 5px; }
        
        .input-field-lux { 
          display: flex; align-items: center; gap: 18px; 
          background: #0a0a0a; border: 1px solid rgba(255,255,255,0.05); 
          padding: 18px 25px; border-radius: 18px; 
          transition: 0.4s;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }
        .input-field-lux:focus-within { 
          border-color: var(--primary); 
          background: #111;
          box-shadow: 0 0 0 5px rgba(255, 126, 0, 0.05); 
        }
        .input-field-lux input { 
          background: none; border: none; outline: none; 
          width: 100%; font-size: 1.1rem; font-weight: 800; color: #fff; 
        }
        .input-field-lux input::placeholder { color: #333; }
        .input-field-lux svg { color: var(--primary); }

        .auth-footer-text { 
          text-align: center; margin-top: 50px; 
          font-weight: 800; color: #555; 
          font-size: 1rem; 
        }
        .auth-footer-text a { color: var(--primary); text-decoration: none; font-weight: 900; margin-left: 8px; transition: 0.3s; }
        .auth-footer-text a:hover { color: #fff; text-decoration: underline; }

        .auth-error-box {
          background: rgba(239, 68, 68, 0.1); color: #ef4444; 
          padding: 15px 20px; border-radius: 14px; 
          font-size: 0.9rem; font-weight: 800; border: 1px solid rgba(239, 68, 68, 0.2);
          text-align: center;
        }

        .auth-success-box {
          background: rgba(16, 185, 129, 0.1); color: #10b981;
          padding: 18px; border-radius: 15px;
          margin-bottom: 30px; font-weight: 800; font-size: 1rem;
          border: 1px solid rgba(16, 185, 129, 0.2); text-align: center;
        }
        
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Login;
