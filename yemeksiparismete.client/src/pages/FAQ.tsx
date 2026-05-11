import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, HelpCircle, ShoppingBag, Truck, CreditCard, Shield } from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Sipariş İşlemleri',
      icon: <ShoppingBag size={20} />,
      questions: [
        { q: "Nasıl sipariş verebilirim?", a: "Ana sayfadan konumunuzu seçtikten sonra dilediğiniz restoranı seçip ürünleri sepetinize ekleyerek 'Ödeme Adımına Geç' butonu ile siparişinizi tamamlayabilirsiniz." },
        { q: "Siparişimi iptal edebilir miyim?", a: "Siparişiniz restoran tarafından hazırlanmaya başlanmadan önce destek hattımız üzerinden iptal talebi oluşturabilirsiniz." },
        { q: "Aynı anda farklı restoranlardan sipariş verebilir miyim?", a: "Hayır, teslimat operasyonunun aksamaması adına her sipariş tek bir restoran üzerinden verilmelidir. Farklı bir restorandan sipariş vermek için mevcut sepetinizi temizlemeniz gerekmektedir." }
      ]
    },
    {
      category: 'Teslimat',
      icon: <Truck size={20} />,
      questions: [
        { q: "Teslimat ücreti ne kadar?", a: "Teslimat ücretleri restoranın uzaklığına ve seçtiğiniz bölgeye göre değişiklik gösterebilir. Birçok premium restoranımızda teslimat ücretsizdir." },
        { q: "Siparişim ne kadar sürede gelir?", a: "Ortalama teslimat süremiz 25-45 dakika arasındadır. Restoranın yoğunluğu ve trafik durumuna göre bu süre değişiklik gösterebilir." }
      ]
    },
    {
      category: 'Ödeme',
      icon: <CreditCard size={20} />,
      questions: [
        { q: "Hangi ödeme yöntemlerini kullanabilirim?", a: "Kredi kartı, banka kartı ve kapıda ödeme (nakit veya POS cihazı) seçeneklerimiz mevcuttur. Tüm kartlı ödemeleriniz 256-bit SSL güvencesi altındadır." },
        { q: "Ödeme yaparken hata alıyorum, ne yapmalıyım?", a: "Kartınızın internet alışverişine açık olduğunu ve bakiyenizin yeterli olduğunu kontrol edin. Sorun devam ederse bankanızla veya destek ekibimizle iletişime geçebilirsiniz." }
      ]
    },
    {
      category: 'Güvenlik',
      icon: <Shield size={20} />,
      questions: [
        { q: "Kişisel verilerim güvende mi?", a: "Kişisel verileriniz KVKK standartlarına uygun olarak en yüksek güvenlik önlemleriyle saklanmaktadır. Bilgileriniz asla üçüncü taraflarla paylaşılmaz." }
      ]
    }
  ];

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="faq-page-lux">
      <div className="faq-hero">
        <div className="container text-center">
          <HelpCircle size={60} className="text-primary mb-30" />
          <h1 className="faq-title">Size Nasıl <span className="text-primary">Yardımcı Olabiliriz?</span></h1>
          <div className="faq-search-wrap">
            <Search size={24} className="search-icon" />
            <input 
              type="text" 
              placeholder="Soru veya konu arayın..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container py-100">
        <div className="faq-layout">
          <div className="faq-sidebar">
            <div className="support-card-mini">
              <h3>Hala sorunuz mu var?</h3>
              <p>Aradığınız cevabı bulamadıysanız destek ekibimizle iletişime geçin.</p>
              <button className="btn-lux-primary w-full mt-20">DESTEK TALEBİ AÇ</button>
            </div>
          </div>

          <div className="faq-content">
            {filteredFaqs.map((cat, catIdx) => (
              <div key={catIdx} className="faq-category-section">
                <div className="category-header">
                  {cat.icon}
                  <h2>{cat.category}</h2>
                </div>
                <div className="faq-list">
                  {cat.questions.map((item, qIdx) => {
                    const globalIdx = catIdx * 100 + qIdx;
                    const isOpen = openIndex === globalIdx;
                    return (
                      <div key={qIdx} className={`faq-item-lux ${isOpen ? 'open' : ''}`}>
                        <button className="faq-question" onClick={() => setOpenIndex(isOpen ? null : globalIdx)}>
                          <span>{item.q}</span>
                          <div className="toggle-icon">
                            {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                          </div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="faq-answer-wrap"
                            >
                              <div className="faq-answer">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .faq-page-lux { background: var(--bg-main); color: #fff; min-height: 100vh; }
        .faq-hero { padding: 120px 0 80px; background-image: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 100%); }
        .faq-title { font-size: 4rem; font-weight: 900; letter-spacing: -2px; margin-bottom: 45px; }
        
        .faq-search-wrap { 
          max-width: 800px; margin: 0 auto; background: #111; 
          padding: 10px 30px; border-radius: 25px; display: flex; 
          align-items: center; gap: 20px; border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        .search-icon { color: var(--primary); }
        .faq-search-wrap input { background: transparent; border: none; outline: none; width: 100%; padding: 20px 0; color: #fff; font-size: 1.2rem; font-weight: 700; }
        .faq-search-wrap input::placeholder { color: #555; }

        .faq-layout { display: grid; grid-template-columns: 350px 1fr; gap: 80px; }
        
        .support-card-mini { background: #111; padding: 40px; border-radius: 35px; border: 1px solid rgba(255,126,0,0.2); position: sticky; top: 120px; }
        .support-card-mini h3 { font-size: 1.6rem; font-weight: 900; margin-bottom: 15px; }
        .support-card-mini p { color: #888; line-height: 1.6; font-size: 1rem; }

        .faq-category-section { margin-bottom: 70px; }
        .category-header { display: flex; align-items: center; gap: 15px; color: var(--primary); margin-bottom: 30px; }
        .category-header h2 { font-size: 1.8rem; font-weight: 900; color: #fff; letter-spacing: -1px; }

        .faq-list { display: flex; flex-direction: column; gap: 20px; }
        .faq-item-lux { background: #111; border-radius: 24px; border: 1px solid rgba(255,255,255,0.03); overflow: hidden; transition: 0.3s; }
        .faq-item-lux:hover { border-color: rgba(255,255,255,0.1); }
        .faq-item-lux.open { border-color: var(--primary); box-shadow: 0 20px 40px rgba(255,126,0,0.05); }

        .faq-question { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 30px 40px; background: none; border: none; cursor: pointer; text-align: left; }
        .faq-question span { font-size: 1.15rem; font-weight: 800; color: #eee; transition: 0.3s; }
        .faq-item-lux.open .faq-question span { color: var(--primary); }
        .toggle-icon { width: 40px; height: 40px; background: #080808; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); border: 1px solid rgba(255,126,0,0.1); transition: 0.3s; }
        .faq-item-lux.open .toggle-icon { background: var(--primary); color: #000; transform: rotate(180deg); }

        .faq-answer-wrap { overflow: hidden; }
        .faq-answer { padding: 0 40px 40px; color: #888; font-size: 1.1rem; line-height: 1.8; font-weight: 500; }

        @media (max-width: 1024px) {
          .faq-layout { grid-template-columns: 1fr; }
          .faq-sidebar { order: 1; }
          .faq-title { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
};

export default FAQ;
