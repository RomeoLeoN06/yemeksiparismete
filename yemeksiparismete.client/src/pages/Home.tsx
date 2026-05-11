import { useEffect, useState, useCallback } from 'react';
import Hero from '../components/Hero';
import RestaurantCard from '../components/RestaurantCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { SearchX, Zap, Utensils, Pizza, Coffee, Beef, Cookie, MapPin, MapPinned, ChevronRight } from 'lucide-react';

const Home = () => {
  const [districtRestaurants, setDistrictRestaurants] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { cities, districts, selectedCity, selectedDistrict, setSelectedCity, setSelectedDistrict, loading: locationLoading } = useLocation();
  const { cart, clearCart } = useCart();
  const [showLocationGate, setShowLocationGate] = useState(false);

  const fetchDistrictRestaurants = useCallback(() => {
    const rawId = selectedDistrict?.id ?? selectedDistrict?.Id ?? (selectedDistrict as any).districtId ?? (selectedDistrict as any).DistrictId;
    const dId = parseInt(String(rawId));
    
    if (isNaN(dId) || dId <= 0) {
      console.warn("[SQL_DEBUG] Geçersiz İlçe ID:", rawId);
      setDistrictRestaurants([]);
      setFilteredRestaurants([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`[SQL_DEBUG] SQL Sorgusu Başlıyor... Hedef İlçe ID: ${dId}`);
    
    // En mantıklı ve güvenilir çekim yöntemi: Query Parameter kullanarak ana endpoint'e git.
    fetch(`/api/restaurants?districtId=${dId}`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP Hatası: ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then(data => {
        // .NET Core bazen verileri ReferenceHandler.Preserve yüzünden $values içine sarar.
        let parsedData = [];
        if (Array.isArray(data)) {
          parsedData = data;
        } else if (data && data.$values && Array.isArray(data.$values)) {
          parsedData = data.$values;
        } else if (data && data.restaurants && Array.isArray(data.restaurants)) {
          parsedData = data.restaurants;
        }
        
        console.log(`[SQL_DEBUG] Veritabanından (ID: ${dId}) Toplam ${parsedData.length} Restoran Başarıyla Çekildi.`);
        if (parsedData.length === 0) {
          console.warn(`[SQL_DEBUG] DİKKAT: İlçe ID ${dId} için veri tabanından 0 kayıt döndü.`);
        }
        
        setDistrictRestaurants(parsedData);
        setFilteredRestaurants(parsedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('[SQL_DEBUG] Kritik Veri Çekme Hatası:', err);
        alert(`Veri çekme hatası oluştu: ${err.message}. Lütfen backend'in çalıştığından ve veri tabanında veri olduğundan emin olun.`);
        setDistrictRestaurants([]);
        setFilteredRestaurants([]);
        setLoading(false);
      });
  }, [selectedDistrict]);

  useEffect(() => {
    if (locationLoading) {
      setLoading(true);
      return;
    }
    
    if (!selectedDistrict) {
      console.log("[SQL_DEBUG] İlçe seçili değil, kapı açılıyor...");
      setShowLocationGate(true);
      setLoading(false);
    } else {
      console.log("[SQL_DEBUG] İlçe seçili, restoranlar yükleniyor...");
      setShowLocationGate(false);
      fetchDistrictRestaurants();
    }
  }, [selectedDistrict, locationLoading, fetchDistrictRestaurants]);

  useEffect(() => {
    if (!showLocationGate) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 50);
    }
  }, [showLocationGate]);

  useEffect(() => {
    let result = districtRestaurants;
    if (activeCategory !== 'all') {
      const catFilter = activeCategory.toLowerCase();
      result = result.filter(res => {
        const cat = String(res.category ?? res.Category ?? "").toLowerCase();
        const desc = String(res.description ?? res.Description ?? "").toLowerCase();
        const name = String(res.name ?? res.Name ?? "").toLowerCase();
        return cat === catFilter || desc.includes(catFilter) || name.includes(catFilter);
      });
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(res => {
        const name = String(res.name ?? res.Name ?? "").toLowerCase();
        const desc = String(res.description ?? res.Description ?? "").toLowerCase();
        const cat = String(res.category ?? res.Category ?? "").toLowerCase();
        return name.includes(term) || desc.includes(term) || cat.includes(term);
      });
    }
    setFilteredRestaurants(result);
  }, [searchTerm, activeCategory, districtRestaurants]);

  return (
    <div className="home-premium-wrap">
      <AnimatePresence>
        {showLocationGate && (
          <motion.div 
            key="location-gate"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="location-gate-overlay"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }}
              className="location-gate-card"
            >
              <div className="gate-icon-wrap">
                <MapPinned size={48} className="text-primary" />
              </div>
              <h2>Nereye <span className="text-primary">Gönderelim?</span></h2>
              <p>Size en yakın restoranları ve en taze lezzetleri gösterebilmemiz için lütfen konumunuzu seçin.</p>
              
              <div className="gate-select-group">
                <div className="lux-select-wrapper">
                  <label>Şehir Seçin</label>
                  <select 
                    value={selectedCity ? String(selectedCity.id ?? selectedCity.Id ?? (selectedCity as any).cityId ?? (selectedCity as any).CityId ?? '') : ''} 
                    onChange={(e) => {
                      const val = e.target.value.toString();
                      setSelectedCity((cities || []).find(c => {
                        const cId = c.id ?? c.Id;
                        return String(cId) === val;
                      }) || null);
                    }}
                  >
                    <option value="">Şehir seçiniz...</option>
                    {(cities || []).map(city => {
                      const cId = city.id ?? city.Id;
                      return <option key={cId} value={cId}>{city.name ?? city.Name}</option>;
                    })}
                  </select>
                </div>

                <div className={`lux-select-wrapper ${!selectedCity ? 'disabled' : ''}`}>
                  <label>İlçe Seçin</label>
                  <select 
                    disabled={!selectedCity}
                    value={selectedDistrict ? String(selectedDistrict.id ?? selectedDistrict.Id ?? (selectedDistrict as any).districtId ?? (selectedDistrict as any).DistrictId ?? '') : ''} 
                    onChange={(e) => {
                      const val = e.target.value.toString();
                      const dist = (districts || []).find(d => {
                        const dId = d.id ?? d.Id;
                        return String(dId) === val;
                      }) || null;
                      
                      if (dist && cart && cart.length > 0) {
                        const confirmClear = window.confirm("Adresinizi değiştirdiğinizde sepetinizdeki ürünler silinecektir. Devam etmek istiyor musunuz?");
                        if (!confirmClear) return;
                        clearCart();
                        setSelectedDistrict(dist);
                        return;
                      }
                      setSelectedDistrict(dist);
                      setShowLocationGate(false);
                    }}
                  >
                    <option value="">İlçe seçiniz...</option>
                    {(districts || []).map(dist => {
                      const dId = dist.id ?? dist.Id;
                      return <option key={dId} value={dId}>{dist.name ?? dist.Name}</option>;
                    })}
                  </select>
                </div>
              </div>

              <button 
                className="btn-lux-primary w-full mt-30" 
                disabled={!selectedDistrict}
                onClick={() => {
                  setShowLocationGate(false);
                  window.scrollTo(0, 0);
                }}
              >
                KEŞFETMEYE BAŞLA <ChevronRight size={18} />
              </button>
              
              <div className="gate-footer">
                <MapPin size={14} /> Şimdilik sadece seçili illerde hizmet vermekteyiz.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showLocationGate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Hero onSearch={(val) => setSearchTerm(val)} />
          
          <div className="container py-80">
            {selectedDistrict && (
              <div className="current-location-banner" onClick={() => setShowLocationGate(true)} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '20px 30px', 
                backgroundColor: 'var(--bg-card)', 
                color: 'white', 
                borderRadius: '24px', 
                marginBottom: '50px', 
                cursor: 'pointer', 
                border: '1px solid var(--border-light)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="banner-glow" style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at center, rgba(255, 126, 0, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '45px', height: '45px', background: 'var(--accent)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Teslimat Bölgesi</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{selectedDistrict?.name ?? selectedDistrict?.Name}, {selectedCity?.name ?? selectedCity?.Name}</div>
                  </div>
                </div>
                <button className="btn-lux-primary" style={{ padding: '10px 20px', fontSize: '0.8rem' }}>Değiştir</button>
              </div>
            )}

            <div className="section-header-lux">
              <h2 className="lux-section-title">Neye <span className="text-primary">Odaklanalım?</span></h2>
              <p className="lux-section-subtitle">En sevdiğiniz kategoriyi seçerek keşfe başlayın.</p>
            </div>

            <div className="category-flex-wrap">
              {(() => {
                const safeRes = Array.isArray(districtRestaurants) ? districtRestaurants : [];
                const allCats = Array.from(new Set(safeRes.map(r => (r.category || r.Category)).filter(Boolean)));
                
                return (
                  <>
                    <button 
                      className={`cat-pill-item ${activeCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveCategory('all')}
                    >
                      <div className="cat-icon-box">
                        <Utensils size={28} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span className="cat-label">TÜMÜ</span>
                        <span className="cat-count-badge" style={{ 
                          fontSize: '0.75rem', 
                          background: activeCategory === 'all' ? 'rgba(255,255,255,0.2)' : 'rgba(255,126,0,0.1)',
                          color: activeCategory === 'all' ? 'white' : 'var(--primary)',
                          padding: '4px 10px',
                          borderRadius: '50px',
                          fontWeight: '900',
                          marginTop: '5px',
                          whiteSpace: 'nowrap',
                          border: activeCategory === 'all' ? 'none' : '1px solid rgba(255,126,0,0.2)'
                        }}>
                          {districtRestaurants?.length || 0} Restoran
                        </span>
                      </div>
                    </button>

                    {allCats.map(catName => {
                      const iconMap: any = {
                        'Burger': <Zap size={28} />,
                        'Pizza': <Pizza size={28} />,
                        'Kebap': <Beef size={28} />,
                        'Kahve': <Coffee size={28} />,
                        'Tatlı': <Cookie size={28} />,
                      };
                      
                      const catId = String(catName).toLowerCase();
                      const isActive = activeCategory.toLowerCase() === catId;
                      const count = safeRes.filter(r => {
                        const rCat = r.category || r.Category;
                        return rCat && String(rCat).trim().toLowerCase() === catId;
                      }).length;

                      return (
                        <button 
                          key={catId} 
                          className={`cat-pill-item ${isActive ? 'active' : ''}`}
                          onClick={() => setActiveCategory(catId)}
                        >
                          <div className="cat-icon-box">
                            {iconMap[String(catName)] || <Utensils size={28} />}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span className="cat-label">{catName}</span>
                            <span className="cat-count-badge" style={{ 
                              fontSize: '0.75rem', 
                              background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,126,0,0.1)',
                              color: isActive ? 'white' : 'var(--primary)',
                              padding: '4px 10px',
                              borderRadius: '50px',
                              fontWeight: '900',
                              marginTop: '5px',
                              whiteSpace: 'nowrap',
                              border: isActive ? 'none' : '1px solid rgba(255,126,0,0.2)'
                            }}>
                              {count} Restoran
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </>
                );
              })()}
            </div>

            <section className="restaurants-section">


              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" className="text-center py-100">
                    <div className="lux-loader-light"></div>
                    <p style={{ marginTop: '20px', color: '#666', fontWeight: 800 }}>Restoranlar Yükleniyor...</p>
                  </motion.div>
                ) : filteredRestaurants.length === 0 ? (
                  <motion.div key="empty" className="lux-empty-state">
                    <SearchX size={80} className="text-primary" style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <h3>Restoran Bulunamadı</h3>
                    <p>Seçtiğiniz bölge (ID: {selectedDistrict?.id ?? selectedDistrict?.Id ?? 'BELİRSİZ'}) için SQL verisi gelmedi.</p>
                    
                    <div className="diagnostic-box-lux">
                      <strong>Sistem Teşhis Raporu:</strong>
                      <ul>
                        <li>İlçe ID: {selectedDistrict?.id ?? selectedDistrict?.Id ?? 'Yok'}</li>
                        <li>Şehir ID: {selectedCity?.id ?? selectedCity?.Id ?? 'Yok'}</li>
                        <li>Bağlantı: /api</li>
                      </ul>
                      <p>Eğer her şey doğruysa ama veri gelmiyorsa, veritabanında bu ilçe için restoran tanımlanmamış olabilir.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                      <button onClick={() => setShowLocationGate(true)} className="btn-lux-primary">Konumu Değiştir</button>
                      <button 
                        onClick={() => { localStorage.clear(); window.location.reload(); }} 
                        className="btn-lux-outline"
                        style={{ borderColor: '#ff4d4d', color: '#ff4d4d' }}
                      >
                        SİSTEMİ SIFIRLA (ZORLA DÜZELT)
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="grid" layout className="restaurant-grid-lux">
                    {filteredRestaurants.map((res) => (
                      <RestaurantCard key={res.id || res.Id} restaurant={res} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </motion.div>
      )}

      <style>{`
        .home-premium-wrap { background: var(--bg-main); min-height: 100vh; position: relative; }
        .py-80 { padding-top: 40px; padding-bottom: 60px; }
        
        .lux-section-title { font-size: 3.5rem; font-weight: 900; color: #fff; letter-spacing: -2px; line-height: 1.1; }
        .lux-section-subtitle { color: var(--text-muted); font-size: 1.2rem; margin-top: 15px; font-weight: 500; }

        .category-flex-wrap { 
          display: flex; gap: 20px; flex-wrap: nowrap; justify-content: flex-start;
          padding: 20px 5px 60px; 
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        @media (min-width: 1100px) {
          .category-flex-wrap { justify-content: center; }
        }
        .category-flex-wrap::-webkit-scrollbar { height: 6px; }
        .category-flex-wrap::-webkit-scrollbar-track { background: transparent; }
        .category-flex-wrap::-webkit-scrollbar-thumb { background: rgba(255,126,0,0.3); border-radius: 10px; }
        .category-flex-wrap::-webkit-scrollbar-thumb:hover { background: rgba(255,126,0,0.5); }
        
        .cat-pill-item { 
          display: flex; align-items: center; gap: 15px; 
          background: var(--bg-card); padding: 15px 30px; border-radius: 50px; 
          border: 1px solid var(--border-light); cursor: pointer; 
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); flex-shrink: 0; 
          box-shadow: var(--shadow-lux); color: #fff;
          position: relative; overflow: hidden;
        }
        .cat-pill-item:hover { 
          transform: translateY(-8px) scale(1.02); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.5); 
          border-color: var(--primary); 
        }
        .cat-pill-item.active { 
          background: var(--primary); 
          border-color: var(--primary); 
          color: #000; 
          box-shadow: 0 15px 30px var(--orange-glow); 
          transform: translateY(-5px);
        }
        
        .cat-icon-box { 
          width: 48px; height: 48px; background: rgba(255,255,255,0.05); border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; 
          color: var(--primary); transition: 0.4s;
        }
        .cat-pill-item.active .cat-icon-box { background: rgba(0,0,0,0.1); color: #000; }
        .cat-label { font-weight: 900; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }

        .res-header-flex { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; border-left: 5px solid var(--primary); padding-left: 25px; }
        .res-title-main { font-size: 2.8rem; font-weight: 900; color: #fff; letter-spacing: -1.5px; }
        .res-meta-badge { 
          background: var(--accent); color: var(--primary); padding: 8px 20px; border-radius: 50px; 
          font-size: 0.85rem; font-weight: 900; margin-top: 12px; display: inline-block; 
          border: 1px solid rgba(255, 126, 0, 0.2);
        }

        .restaurant-grid-lux { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 45px; }
        
        .lux-loader-light { 
          width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.05); border-top-color: var(--primary); 
          border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; 
          filter: drop-shadow(0 0 15px var(--orange-glow));
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .lux-empty-state { 
          text-align: center; padding: 120px 40px; background: var(--bg-card); 
          border-radius: var(--radius-lg); border: 1px solid var(--border-light); 
          box-shadow: var(--shadow-lux);
        }

        /* Location Gate Styles */
        .location-gate-overlay {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(20px); z-index: 5000;
          display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .location-gate-card {
          max-width: 550px; width: 100%; background: #111;
          border-radius: 40px; padding: 70px 50px; text-align: center;
          box-shadow: 0 50px 100px rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.05);
          position: relative; overflow: hidden;
        }
        .location-gate-card::before {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
        }
        .gate-icon-wrap {
          width: 110px; height: 110px; background: var(--accent);
          border-radius: 35px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 35px; border: 1px solid rgba(255, 126, 0, 0.1);
          transform: rotate(5deg); box-shadow: 0 15px 30px rgba(0,0,0,0.3);
        }
        .location-gate-card h2 { font-size: 2.8rem; font-weight: 900; color: #fff; margin-bottom: 20px; letter-spacing: -1px; }
        .location-gate-card p { color: var(--text-muted); font-size: 1.1rem; font-weight: 500; line-height: 1.6; margin-bottom: 45px; }
        
        .gate-select-group { display: flex; flex-direction: column; gap: 25px; text-align: left; }
        .lux-select-wrapper { display: flex; flex-direction: column; gap: 10px; }
        .lux-select-wrapper label { font-size: 0.8rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; padding-left: 5px; }
        .lux-select-wrapper select { 
          background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); 
          padding: 18px 22px; border-radius: 20px; font-size: 1.1rem; 
          font-weight: 700; color: #fff; outline: none; transition: 0.3s;
          cursor: pointer; appearance: none;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }
        .lux-select-wrapper select:focus { border-color: var(--primary); background: #222; box-shadow: 0 0 0 4px rgba(255, 126, 0, 0.1); }
        .lux-select-wrapper.disabled { opacity: 0.3; pointer-events: none; }

        .gate-footer { margin-top: 40px; font-size: 0.9rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 10px; }
        
        .diagnostic-box-lux {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 25px;
          border-radius: 25px;
          margin-top: 35px;
          text-align: left;
          max-width: 450px;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .diagnostic-box-lux strong { color: var(--primary); display: block; margin-bottom: 12px; font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase; }
        .diagnostic-box-lux ul { list-style: none; padding: 0; margin: 0; }
        .diagnostic-box-lux li { font-size: 0.85rem; color: #888; margin-bottom: 8px; font-family: monospace; display: flex; justify-content: space-between; }
        .diagnostic-box-lux li span { color: #ccc; }

        @media (max-width: 1024px) {
          .lux-section-title { font-size: 2.8rem; }
        }

        @media (max-width: 768px) {
          .restaurant-grid-lux { grid-template-columns: 1fr; gap: 20px; }
          .lux-section-title { font-size: 2.2rem; }
          .location-gate-card { padding: 40px 20px; border-radius: 30px; }
          .res-title-main { font-size: 1.6rem; }
          .category-flex-wrap { 
            justify-content: flex-start; 
            flex-wrap: nowrap; 
            overflow-x: auto; 
            padding: 20px 10px 40px; 
            gap: 15px;
            -webkit-overflow-scrolling: touch;
          }
          .category-flex-wrap::-webkit-scrollbar { display: none; }
          .cat-pill-item { padding: 12px 20px; }
          .cat-label { font-size: 0.9rem; }
        }

        @media (max-width: 480px) {
          .lux-section-title { font-size: 1.8rem; }
          .current-location-banner { padding: 15px; }
          .banner-info-row { flex-direction: column; align-items: flex-start; }
          .gate-select-group { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Home;
