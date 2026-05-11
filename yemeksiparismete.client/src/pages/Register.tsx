import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Shield, AtSign, Phone } from 'lucide-react';

const EMAIL_DOMAINS = [
  '@gmail.com',
  '@hotmail.com',
  '@outlook.com',
  '@yahoo.com',
  '@icloud.com',
  '@yandex.com'
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    emailUser: '',
    emailDomain: '@gmail.com',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+{}[\]:;<>?/-]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Şifre en az 8 karakter olmalı; en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter (. , _ , ! vb.) içermelidir.');
      return;
    }

    if (formData.phoneNumber.length < 10) {
      setError('Geçerli bir telefon numarası giriniz.');
      return;
    }

    const fullEmail = `${formData.emailUser}${formData.emailDomain}`;
    
    setLoading(true);
    try {
      await register(formData.name, fullEmail, formData.phoneNumber, formData.password, formData.role);
      navigate('/login', { state: { registeredEmail: fullEmail, message: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.' } });
    } catch (err: any) {
      setError(err.message || 'Kayıt sırasında bir hata oluştu.');
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
          <div className="auth-header">
            <div className="auth-icon-wrap">
              <UserPlus size={32} className="text-primary" />
            </div>
            <h2 className="auth-title">Aramıza Katılın</h2>
            <p className="auth-subtitle">Yeni bir lezzet yolculuğuna başlayın.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group-lux">
              <label>KAYIT TÜRÜ</label>
              <div className="input-field-lux">
                <Shield size={18} />
                <select 
                  className="lux-select-raw"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="customer">Müşteri</option>
                  <option value="restaurant_owner">Restoran Sahibi</option>
                </select>
              </div>
            </div>

            <div className="input-row-2">
              <div className="input-group-lux">
                <label>AD SOYAD</label>
                <div className="input-field-lux">
                  <User size={18} />
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Mete Han"
                    required
                  />
                </div>
              </div>
              <div className="input-group-lux">
                <label>TELEFON NUMARASI</label>
                <div className="input-field-lux">
                  <Phone size={18} />
                  <input 
                    type="tel" 
                    value={formData.phoneNumber} 
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="05XX XXX XX XX"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="input-group-lux">
              <label>E-POSTA ADRESİ</label>
              <div className="email-selector-grid">
                <div className="input-field-lux email-user-input">
                  <Mail size={18} />
                  <input 
                    type="text" 
                    value={formData.emailUser} 
                    onChange={(e) => setFormData({...formData, emailUser: e.target.value})}
                    placeholder="kullanici.adi"
                    required
                  />
                </div>
                <div className="input-field-lux email-domain-select">
                  <AtSign size={16} />
                  <select 
                    className="lux-select-raw"
                    value={formData.emailDomain}
                    onChange={(e) => setFormData({...formData, emailDomain: e.target.value})}
                  >
                    {EMAIL_DOMAINS.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="input-row-2">
              <div className="input-group-lux">
                <label>ŞİFRE</label>
                <div className="input-field-lux">
                  <Lock size={18} />
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="input-group-lux">
                <label>ONAYLA</label>
                <div className="input-field-lux">
                  <Lock size={18} />
                  <input 
                    type="password" 
                    value={formData.confirmPassword} 
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="auth-error-box">
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading} className="btn-lux-primary w-full mt-10">
              {loading ? 'HESAP OLUŞTURULUYOR...' : 'HESAP OLUŞTUR'}
            </button>
          </form>

          <div className="auth-footer-text">
            Zaten üye misiniz? <Link to="/login">Giriş Yapın</Link>
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
          max-width: 650px;
          width: 100%;
          margin: 0 auto;
          background: var(--bg-card);
          padding: 60px;
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

        .auth-header { text-align: center; margin-bottom: 40px; }
        .auth-icon-wrap { 
          width: 90px; height: 90px; 
          background: rgba(255,126,0,0.1); 
          border-radius: 30px; 
          display: flex; align-items: center; justify-content: center; 
          margin: 0 auto 25px; 
          border: 1px solid rgba(255, 126, 0, 0.2);
          transform: rotate(-5deg);
        }
        .auth-title { font-size: 2.8rem; font-weight: 900; color: #fff; letter-spacing: -2px; margin-bottom: 12px; }
        .auth-subtitle { color: #666; font-weight: 700; font-size: 1.1rem; }

        .auth-form { display: flex; flex-direction: column; gap: 25px; }
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
        .input-field-lux svg { color: var(--primary); flex-shrink: 0; }

        .email-selector-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 15px; }
        
        .input-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        .auth-footer-text { 
          text-align: center; margin-top: 50px; 
          font-weight: 800; color: #555; 
          font-size: 1rem; 
        }
        .auth-footer-text a { color: var(--primary); text-decoration: none; font-weight: 900; margin-left: 8px; transition: 0.3s; }
        .auth-footer-text a:hover { color: #fff; text-decoration: underline; }

        .lux-select-raw {
          background: none; border: none; outline: none;
          width: 100%; font-size: 1rem; font-weight: 800; color: #fff;
          appearance: none; cursor: pointer;
        }
        .lux-select-raw option { background: #111; color: #fff; }

        .auth-error-box {
          background: rgba(239, 68, 68, 0.1); color: #ef4444; 
          padding: 15px 20px; border-radius: 14px; 
          font-size: 0.9rem; font-weight: 800; border: 1px solid rgba(239, 68, 68, 0.2);
          text-align: center;
        }

        @media (max-width: 768px) {
          .email-selector-grid { grid-template-columns: 1fr; }
          .input-row-2 { grid-template-columns: 1fr; }
          .auth-card-light { padding: 50px 25px; border-radius: 35px; }
          .auth-title { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
};

export default Register;
