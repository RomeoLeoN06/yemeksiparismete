import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, MapPin, ChevronDown, Menu, X, Home, Info, PhoneCall, ShieldCheck, Package, Bike } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const navLinks = [
  { name: 'Anasayfa', path: '/', icon: <Home size={20} /> },
  { name: 'Kurye Ol', path: '/kurye-ol', icon: <Bike size={20} /> },
  { name: 'Hakkımızda', path: '/about', icon: <Info size={20} /> },
  { name: 'Destek', path: '/support', icon: <PhoneCall size={20} /> },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, totalItems, totalPrice, clearCart } = useCart();
  const { cities, districts, selectedCity, selectedDistrict, setSelectedCity, setSelectedDistrict } = useLocation();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Sayfaya ilk girişte il/ilçe seçili değilse zorunlu olarak modalı aç
    if (!selectedCity || !selectedDistrict) {
      setShowLocationModal(true);
    }
  }, [selectedCity, selectedDistrict]);

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="ultra-header">
        <div className="container header-grid-lux">
          <div className="header-left-flex">
            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <Link to="/" className="lux-logo">
              <img src="/logo.png" alt="YemekMete Logo" style={{ height: '50px', objectFit: 'contain' }} />
            </Link>
          </div>

          <div className="header-center desktop-only">
            <div className="lux-location-pill" onClick={() => setShowLocationModal(true)}>
              <MapPin size={18} className="text-primary" />
              <div className="loc-text">
                <span className="loc-label">Teslimat Adresi</span>
                <span className="loc-value">
                  {selectedDistrict ? `${selectedCity?.name ?? selectedCity?.Name}, ${selectedDistrict.name ?? selectedDistrict?.Name}` : 'Konum Seçin'}
                </span>
              </div>
              <ChevronDown size={14} className="text-muted" />
            </div>
          </div>

          <div className="header-right">
            <Link to="/kurye-ol" className="desktop-only courier-badge-btn">
              <Bike size={16} /> Kurye Ol
            </Link>
            <div className="lux-actions">
              {user ? (
                <>
                  <div className="lux-user-box desktop-only">
                    <Link to="/profile" className="lux-user-link">
                      <div className="avatar-mini">
                        <User size={18} />
                      </div>
                      <span>{user.FullName || user.name}</span>
                    </Link>
                    {(user.role === 'admin' || user.email === 'admin@yemeksiparis.com') && (
                      <Link to="/admin-orders" className="lux-user-link dashboard-link">
                        <Package size={18} />
                        <span>Yönetici Paneli</span>
                      </Link>
                    )}
                    {user.role === 'restaurant_owner' && (
                      <Link to="/restaurant-panel" className="lux-user-link dashboard-link">
                        <Package size={18} />
                        <span>Restoran Paneli</span>
                      </Link>
                    )}
                    {user.role === 'courier' && (
                      <Link to="/courier-panel" className="lux-user-link dashboard-link">
                        <Bike size={18} />
                        <span>Kurye Paneli</span>
                      </Link>
                    )}
                  </div>

                  <Link to="/checkout" className="lux-cart-pill">
                    <div className="lux-cart-icon">
                      <ShoppingBag size={22} />
                      {totalItems > 0 && <span className="lux-cart-count">{totalItems}</span>}
                    </div>
                    <div className="lux-cart-info desktop-only">
                      <span className="lux-cart-total">{totalPrice} TL</span>
                    </div>
                  </Link>

                  <button onClick={handleLogout} className="lux-logout-premium" title="Çıkış Yap">
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <>
                  <div className="desktop-only">
                    <Link to="/login" className="lux-login-btn">Giriş Yap</Link>
                  </div>
                  <Link to="/checkout" className="lux-cart-pill">
                    <div className="lux-cart-icon">
                      <ShoppingBag size={22} />
                      {totalItems > 0 && <span className="lux-cart-count">{totalItems}</span>}
                    </div>
                    <div className="lux-cart-info desktop-only">
                      <span className="lux-cart-total">{totalPrice.toLocaleString('tr-TR')} TL</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sidebar-overlay"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="sidebar-drawer"
            >
              <div className="sidebar-header">
                <div className="lux-logo" style={{ justifyContent: 'center', width: '100%', padding: '20px 0' }}>
                  <img src="/logo.png" alt="YemekMete Logo" style={{ height: '60px', objectFit: 'contain' }} />
                </div>
                <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="sidebar-content">
                {user && (
                  <div className="sidebar-user-info">
                    <div className="user-avatar-large">
                      <User size={32} />
                    </div>
                    <div className="user-details-box">
                      <span className="user-name-sidebar">{user.FullName || user.name}</span>
                      <span className="user-role-sidebar">
                        {user.role === 'admin' ? 'Yönetici' : 
                         user.role === 'restaurant_owner' ? 'Restoran Sahibi' : 
                         user.role === 'courier' ? 'Kurye' : 'Müşteri'}
                      </span>
                    </div>
                  </div>
                )}

                <nav className="sidebar-nav">
                  {navLinks.map(link => (
                    <Link key={link.name} to={link.path} className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}
                  
                  <div className="sidebar-divider" />
                  
                  {user ? (
                    <>
                      <Link to="/profile" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                        <User size={20} />
                        <span>Hesabım</span>
                      </Link>
                      <Link to="/profile?tab=orders" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                        <Package size={20} />
                        <span>Siparişlerim</span>
                      </Link>
                      {(user.role === 'admin' || user.email === 'admin@yemeksiparis.com') && (
                        <Link to="/admin-orders" className="sidebar-link highlight" onClick={() => setIsSidebarOpen(false)}>
                          <Package size={20} />
                          <span>Sipariş Yönetimi</span>
                        </Link>
                      )}
                      {user.role === 'restaurant_owner' && (
                        <Link to="/restaurant-panel" className="sidebar-link highlight" onClick={() => setIsSidebarOpen(false)}>
                          <Package size={20} />
                          <span>Restoran Paneli</span>
                        </Link>
                      )}
                      {user.role === 'courier' && (
                        <Link to="/courier-panel" className="sidebar-link highlight" onClick={() => setIsSidebarOpen(false)}>
                          <Bike size={20} />
                          <span>Kurye Paneli</span>
                        </Link>
                      )}
                      <button onClick={handleLogout} className="sidebar-link text-primary logout-btn-sidebar">
                        <LogOut size={20} />
                        <span>Çıkış Yap</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="sidebar-link highlight" onClick={() => setIsSidebarOpen(false)}>
                        <User size={20} />
                        <span>Giriş Yap</span>
                      </Link>
                      <Link to="/register" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
                        <ShieldCheck size={20} />
                        <span>Kayıt Ol</span>
                      </Link>
                    </>
                  )}
                </nav>
              </div>

              <div className="sidebar-footer">
                <p>© 2026 YemekMete</p>
                <div className="footer-links-mini">
                  <Link to="/terms" onClick={() => setIsSidebarOpen(false)}>Şartlar</Link>
                  <Link to="/privacy" onClick={() => setIsSidebarOpen(false)}>Gizlilik</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLocationModal && (
          <div className="modal-overlay-lux" onClick={() => setShowLocationModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="lux-modal-card"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="modal-title-lux">Konum <span className="text-primary">Değiştir</span></h2>
              <div className="lux-select-group">
                <label>Şehir</label>
                <select value={selectedCity ? String(selectedCity.id ?? (selectedCity as any).Id ?? (selectedCity as any).cityId ?? (selectedCity as any).CityId ?? '') : ''} onChange={(e) => {
                  const val = e.target.value.toString();
                  setSelectedCity((cities || []).find(c => {
                    const cId = c.id ?? (c as any).Id ?? (c as any).cityId ?? (c as any).CityId;
                    return String(cId) === val;
                  }) || null);
                }}>
                  <option value="">Şehir Seçin</option>
                  {(cities || []).map(city => {
                    const cId = city.id ?? (city as any).Id ?? (city as any).cityId ?? (city as any).CityId;
                    return <option key={cId} value={cId}>{city.name ?? (city as any).Name}</option>;
                  })}
                </select>
              </div>
              <div className="lux-select-group">
                <label>İlçe</label>
                <select disabled={!selectedCity} value={selectedDistrict ? String(selectedDistrict.id ?? (selectedDistrict as any).Id ?? (selectedDistrict as any).districtId ?? (selectedDistrict as any).DistrictId ?? '') : ''} onChange={(e) => {
                  const val = e.target.value.toString();
                  const dist = (districts || []).find(d => {
                    const dId = d.id ?? (d as any).Id ?? (d as any).districtId ?? (d as any).DistrictId;
                    return String(dId) === val;
                  });
                  
                  if (dist && cart && cart.length > 0) {
                    const confirmClear = window.confirm("Adresinizi değiştirdiğinizde sepetinizdeki ürünler silinecektir. Devam etmek istiyor musunuz?");
                    if (!confirmClear) return;
                    clearCart();
                    setSelectedDistrict(dist);
                    navigate('/');
                    return;
                  }
                  
                  setSelectedDistrict(dist || null);
                  if (dist) {
                    setShowLocationModal(false);
                    navigate('/');
                  }
                }}>
                  <option value="">İlçe Seçin</option>
                  {(districts || []).map(dist => {
                    const dId = dist.id ?? (dist as any).Id ?? (dist as any).districtId ?? (dist as any).DistrictId;
                    return <option key={dId} value={dId}>{dist.name ?? (dist as any).Name}</option>;
                  })}
                </select>
              </div>
              <button className="btn-lux-primary w-full mt-20" onClick={() => {
                if (!selectedDistrict) {
                  alert("Lütfen devam etmek için bir ilçe seçin!");
                  return;
                }
                setShowLocationModal(false);
                window.scrollTo(0, 0);
              }}>Seçimi Tamamla</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .ultra-header { 
          position: sticky; top: 0; z-index: 1000; 
          background: rgba(10, 10, 10, 0.85); 
          backdrop-filter: blur(25px); 
          border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
          padding: 15px 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .header-grid-lux { display: flex; align-items: center; justify-content: space-between; }
        .header-left-flex { display: flex; align-items: center; gap: 25px; }
        .header-right { display: flex; align-items: center; gap: 20px; }
        
        .hamburger-btn { 
          background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; 
          color: #fff; display: flex; align-items: center; justify-content: center;
          padding: 10px; border-radius: 12px; transition: 0.3s;
        }
        .hamburger-btn:hover { background: var(--primary); color: #000; box-shadow: 0 0 15px var(--orange-glow); }

        .lux-logo { display: flex; align-items: center; gap: 15px; text-decoration: none; }
        .logo-main { font-size: 2rem; font-weight: 900; letter-spacing: -2px; color: #fff; }
        
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 1999; }
        .sidebar-drawer { 
          position: fixed; top: 0; left: 0; bottom: 0; width: 340px; 
          background: #0f0f0f; z-index: 2000; display: flex; flex-direction: column; 
          box-shadow: 30px 0 60px rgba(0,0,0,0.8);
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .sidebar-header { padding: 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .close-btn { background: #1a1a1a; border: none; cursor: pointer; color: #fff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .close-btn:hover { background: var(--primary); color: #000; transform: rotate(90deg); }

        .sidebar-content { flex: 1; overflow-y: auto; padding: 40px; }
        .sidebar-user-info { display: flex; align-items: center; gap: 15px; margin-bottom: 45px; padding: 25px; background: #1a1a1a; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); }
        .user-avatar-large { width: 65px; height: 65px; background: #000; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: var(--primary); border: 1px solid rgba(255,126,0,0.2); }
        .user-name-sidebar { font-size: 1.2rem; font-weight: 900; color: #fff; }
        .user-role-sidebar { font-size: 0.75rem; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }

        .sidebar-nav { display: flex; flex-direction: column; gap: 10px; }
        .sidebar-link { 
          display: flex; align-items: center; gap: 18px; padding: 16px 24px; 
          text-decoration: none; color: #ccc; font-weight: 800; 
          border-radius: 18px; transition: 0.3s; 
        }
        .sidebar-link:hover { background: rgba(255,255,255,0.05); color: var(--primary); transform: translateX(10px); }
        .sidebar-link.highlight { background: var(--primary); color: #000; margin-top: 15px; box-shadow: 0 10px 20px var(--orange-glow); }
        .sidebar-link.highlight:hover { background: #fff; color: #000; transform: translateY(-3px); }
        .sidebar-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 25px 0; }
        .logout-btn-sidebar { border: none; background: none; width: 100%; cursor: pointer; color: #ff4d4d; }

        .sidebar-footer { padding: 40px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem; font-weight: 700; color: #555; }
        .footer-links-mini { display: flex; gap: 20px; margin-top: 15px; }

        .lux-location-pill { 
          display: flex; align-items: center; gap: 18px; background: #1a1a1a; 
          padding: 12px 28px; border-radius: 50px; cursor: pointer; transition: 0.4s;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }
        .lux-location-pill:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .loc-text { display: flex; flex-direction: column; }
        .loc-label { font-size: 0.65rem; font-weight: 900; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .loc-value { font-size: 1rem; font-weight: 800; color: #fff; white-space: nowrap; max-width: 220px; overflow: hidden; text-overflow: ellipsis; }

        .lux-actions { display: flex; align-items: center; gap: 25px; }
        .lux-user-link { 
          display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1rem; 
          color: #fff; transition: 0.3s; text-decoration: none; 
          background: #1a1a1a; padding: 10px 20px; border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .lux-user-link:hover { color: var(--primary); border-color: var(--primary); transform: translateY(-2px); }
        .dashboard-link { border: 1px solid var(--primary); color: var(--primary); background: rgba(255, 126, 0, 0.05); }
        .avatar-mini { width: 34px; height: 34px; background: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); border: 1px solid rgba(255,126,0,0.3); }
        
        .lux-logout-premium { 
          color: #ff4d4d; 
          background: rgba(255, 77, 77, 0.1); 
          border: 1px solid rgba(255, 77, 77, 0.2); 
          cursor: pointer; 
          width: 45px; 
          height: 45px; 
          border-radius: 14px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          margin-left: 10px;
        }
        .lux-logout-premium:hover { 
          background: #ff4d4d; 
          color: #fff; 
          transform: scale(1.1) rotate(10deg); 
          box-shadow: 0 10px 20px rgba(255, 77, 77, 0.3);
          border-color: #ff4d4d;
        }
        
        .lux-login-btn { 
          background: var(--primary); color: #000; padding: 12px 30px; 
          border-radius: 18px; font-weight: 900; transition: 0.4s; 
          text-decoration: none; font-size: 1rem; letter-spacing: 0.5px;
          box-shadow: 0 10px 20px var(--orange-glow);
        }
        .lux-login-btn:hover { transform: translateY(-4px); box-shadow: 0 15px 30px var(--orange-glow-strong); background: #fff; }

        .lux-cart-pill { 
          display: flex; align-items: center; gap: 15px; 
          background: #1a1a1a; color: #fff; 
          padding: 12px 28px; border-radius: 18px; 
          transition: 0.4s; text-decoration: none; 
          font-weight: 900;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        .lux-cart-pill:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 15px 35px var(--orange-glow); background: var(--primary); }
        .lux-cart-icon { position: relative; display: flex; align-items: center; }
        .lux-cart-count { 
          position: absolute; top: -18px; right: -18px; 
          background: var(--primary); color: #000; 
          width: 26px; height: 26px; border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 12px; font-weight: 900; border: 3px solid #1a1a1a; 
        }
        .lux-cart-total { font-size: 1.1rem; }

        .courier-badge-btn {
          background: rgba(255,126,0,0.1);
          color: var(--primary);
          border: 1px solid rgba(255,126,0,0.3);
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: 0.3s;
          white-space: nowrap;
        }
        .courier-badge-btn:hover {
          background: var(--primary);
          color: #000;
          box-shadow: 0 10px 20px rgba(255,126,0,0.3);
          transform: translateY(-2px);
        }

        .modal-overlay-lux { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(15px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .lux-modal-card { width: 100%; max-width: 480px; background: #111; padding: 50px; border-radius: 40px; box-shadow: 0 40px 100px rgba(0,0,0,1); border: 1px solid rgba(255,255,255,0.05); }
        .modal-title-lux { font-size: 2.5rem; color: #fff; margin-bottom: 40px; text-align: center; font-weight: 900; letter-spacing: -1px; }
        .lux-select-group { margin-bottom: 25px; display: flex; flex-direction: column; gap: 12px; }
        .lux-select-group label { font-size: 0.8rem; font-weight: 900; color: #666; text-transform: uppercase; letter-spacing: 1.5px; }
        .lux-select-group select { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); padding: 18px; border-radius: 18px; color: #fff; font-size: 1.1rem; font-weight: 700; outline: none; transition: 0.3s; cursor: pointer; }
        .lux-select-group select:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(255,126,0,0.1); }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .hamburger-btn { display: flex; }
          .lux-logo img { height: 35px !important; }
          .lux-actions { gap: 10px; }
          .lux-cart-pill { padding: 10px 15px; border-radius: 12px; }
          .lux-cart-total { display: none; }
          .lux-logout-premium { width: 40px; height: 40px; border-radius: 10px; }
        }
        @media (max-width: 480px) {
          .container { padding: 0 15px; }
          .lux-actions { gap: 8px; }
          .lux-cart-pill { padding: 8px 12px; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
