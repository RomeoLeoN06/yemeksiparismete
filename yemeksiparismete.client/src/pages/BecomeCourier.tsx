import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bike, Car, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BecomeCourier = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    vehicleType: 'Motosiklet',
    driverLicenseType: 'A2',
    city: '',
    district: '',
    experienceInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | ''>('');

  useEffect(() => {
    fetch('/api/cities')
      .then(res => res.json())
      .then(data => setCities(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching cities", err));
  }, []);

  useEffect(() => {
    if (selectedCityId) {
      fetch(`/api/cities/${selectedCityId}/districts`)
        .then(res => res.json())
        .then(data => setDistricts(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching districts", err));
    } else {
      setDistricts([]);
    }
  }, [selectedCityId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      setSelectedCityId('');
      setFormData({ ...formData, city: '', district: '' });
      return;
    }
    const [id, name] = val.split('|');
    setSelectedCityId(parseInt(id));
    setFormData({ ...formData, city: name, district: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/courier/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Başvuru sırasında bir hata oluştu.');
      }
    } catch (err) {
      setError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courier-page">
      <div className="container">
        {success ? (
          <div className="flex-center" style={{ minHeight: '60vh' }}>
            <motion.div 
              className="success-box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <CheckCircle size={80} className="success-icon" />
              <h2>Başvurunuz Alındı!</h2>
              <p>YemekSiparişim ekibine katılma talebiniz bize ulaştı. Başvurunuz incelendikten sonra sizinle iletişime geçeceğiz.</p>
              <button onClick={() => navigate('/')} className="btn-home-lux">Ana Sayfaya Dön</button>
            </motion.div>
          </div>
        ) : (
          <div className="courier-grid">
            
            {/* Left Side: Info */}
            <motion.div 
              className="courier-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1>YemekSiparişim <br/><span className="text-primary">Kurye Ekibine</span> Katıl!</h1>
            <p className="subtitle">Kendi çalışma saatlerini belirle, şehrin en prestijli restoranlarının lezzetlerini müşterilere ulaştırarak yüksek kazanç elde et.</p>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="b-icon"><Bike size={24} /></div>
                <div>
                  <h4>Esnek Çalışma Saatleri</h4>
                  <p>Ne zaman istersen, ne kadar istersen çalış.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="b-icon"><Car size={24} /></div>
                <div>
                  <h4>Yüksek Kazanç</h4>
                  <p>Paket başı ücret ve ekstra bahşişlerle gelirinizi katlayın.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            className="courier-form-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="lux-form">
              <h3>Başvuru Formu</h3>
              {error && <div className="error-alert">{error}</div>}
              
              <div className="form-group">
                <label>Ad Soyad</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Örn: Metehan" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Telefon Numarası</label>
                  <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} placeholder="0555..." />
                </div>
                <div className="form-group">
                  <label>E-posta Adresi</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="ornek@mail.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Araç Tipi</label>
                  <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                    <option value="Motosiklet">Motosiklet</option>
                    <option value="Bisiklet">Bisiklet</option>
                    <option value="Otomobil">Otomobil</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ehliyet Tipi</label>
                  <select name="driverLicenseType" value={formData.driverLicenseType} onChange={handleChange}>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B">B</option>
                    <option value="Ehliyetim Yok">Ehliyetim Yok</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Şehir</label>
                  <select required onChange={handleCityChange} defaultValue="">
                    <option value="" disabled>İl Seçiniz</option>
                    {cities.map(c => {
                      const cId = c.id ?? c.Id;
                      const cName = c.name ?? c.Name;
                      return <option key={cId} value={`${cId}|${cName}`}>{cName}</option>;
                    })}
                  </select>
                </div>
                <div className="form-group">
                  <label>İlçe</label>
                  <select name="district" required value={formData.district} onChange={handleChange}>
                    <option value="" disabled>İlçe Seçiniz</option>
                    {districts.map(d => {
                      const dId = d.id ?? d.Id;
                      const dName = d.name ?? d.Name;
                      return <option key={dId} value={dName}>{dName}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Kısaca Deneyimleriniz (Opsiyonel)</label>
                <textarea name="experienceInfo" rows={3} value={formData.experienceInfo} onChange={handleChange} placeholder="Daha önce kuryelik yaptınız mı?"></textarea>
              </div>

              <button type="submit" disabled={loading} className="submit-lux-btn">
                {loading ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'}
                {!loading && <Send size={18} />}
              </button>
            </form>
          </motion.div>

        </div>
        )}
      </div>

      <style>{`
        .courier-page {
          background: #050505;
          min-height: 100vh;
          padding: 80px 0 120px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
        }
        .flex-center { display: flex; align-items: center; justify-content: center; }
        
        .courier-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .courier-info h1 { font-size: 3.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -2px; }
        .courier-info .subtitle { font-size: 1.2rem; color: #888; margin-bottom: 40px; line-height: 1.6; }
        
        .benefits-list { display: flex; flex-direction: column; gap: 30px; }
        .benefit-item { display: flex; gap: 20px; align-items: center; }
        .b-icon {
          width: 60px; height: 60px;
          background: rgba(255,126,0,0.1);
          color: var(--primary);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,126,0,0.2);
        }
        .benefit-item h4 { font-size: 1.3rem; font-weight: 800; margin-bottom: 5px; color: #fff; }
        .benefit-item p { color: #666; font-size: 0.95rem; }

        .courier-form-container {
          background: #111;
          padding: 50px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        
        .lux-form h3 { font-size: 2rem; font-weight: 900; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px; }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; font-size: 0.9rem; font-weight: 800; color: #888; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 15px 20px;
          border-radius: 15px;
          color: #fff;
          font-family: inherit;
          font-size: 1rem;
          transition: 0.3s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(255,126,0,0.1);
          outline: none;
        }

        .submit-lux-btn {
          width: 100%;
          background: var(--primary);
          color: #000;
          border: none;
          padding: 20px;
          border-radius: 20px;
          font-size: 1.1rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          cursor: pointer;
          transition: 0.4s;
          margin-top: 10px;
        }
        .submit-lux-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(255,126,0,0.4);
        }
        .submit-lux-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }

        .success-box {
          background: #111; padding: 60px; border-radius: 40px; text-align: center; border: 1px solid rgba(0,255,100,0.2); max-width: 500px;
        }
        .success-icon { color: #00ff66; margin: 0 auto 20px; }
        .success-box h2 { font-size: 2.5rem; font-weight: 900; margin-bottom: 15px; color: #00ff66; }
        .success-box p { color: #888; line-height: 1.6; margin-bottom: 30px; }
        .btn-home-lux { background: #fff; color: #000; border: none; padding: 15px 30px; border-radius: 50px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .btn-home-lux:hover { transform: scale(1.05); }

        .error-alert { background: rgba(255,0,0,0.1); color: #ff4d4d; padding: 15px; border-radius: 12px; margin-bottom: 20px; font-weight: 600; border: 1px solid rgba(255,0,0,0.2); }

        @media (max-width: 992px) {
          .courier-grid { grid-template-columns: 1fr; gap: 40px; }
          .courier-info h1 { font-size: 2.8rem; }
        }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; gap: 0; }
          .courier-form-container { padding: 30px 20px; border-radius: 25px; }
          .courier-page { padding: 40px 0 80px; }
        }
      `}</style>
    </div>
  );
};

export default BecomeCourier;
