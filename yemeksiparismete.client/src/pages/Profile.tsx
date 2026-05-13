import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation as useRouteLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';
import * as signalR from '@microsoft/signalr';
import {
  User, Package, MapPin, Shield,
  ChevronRight, CreditCard, LogOut, Camera, Edit3, Save, Clock, Trash2, Plus, Sparkles
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profil Bilgileri', icon: <User size={20} /> },
  { id: 'orders', label: 'Siparişlerim', icon: <Package size={20} /> },
  { id: 'addresses', label: 'Adreslerim', icon: <MapPin size={20} /> },
  { id: 'security', label: 'Güvenlik', icon: <Shield size={20} /> },
  { id: 'payments', label: 'Ödeme Yöntemleri', icon: <CreditCard size={20} /> },
];

const Profile = () => {
  const { user, token, logout, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { cities, selectedCity, selectedDistrict } = useLocation();

  // Profil resmini sunucudan çek
  useEffect(() => {
    if (token) {
      fetch('/api/user/profile-image', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.imageBase64) setProfileImage(data.imageBase64);
        })
        .catch(err => console.error("Profil resmi çekilemedi", err));
    }
  }, [token]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      // Format kontrolü (Sadece JPG / PNG)
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        alert("Lütfen sadece JPG veya PNG formatında bir resim seçin.");
        return;
      }
      // Boyut kontrolü (Maksimum 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Seçtiğiniz fotoğraf 2MB'dan büyük olamaz.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setProfileImage(base64String); // Arayüzü anında güncelle

        // Veritabanına kaydet (Backend API)
        try {
          await fetch('/api/user/profile-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ imageBase64: base64String })
          });
        } catch (error) {
          console.error("Fotoğraf kaydedilemedi:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const routeLocation = useRouteLocation();

  // Güncel kullanıcı verisini çek (Kurtarma kodu için)
  useEffect(() => {
    if (!token) return;
    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Backend'den direkt {id, recoveryCode...} gelebilir veya {user: {...}}
        const userData = data.user || data;
        if (userData) updateUser(userData);
      })
      .catch(err => console.error("Kullanıcı verisi yenilenemedi:", err));
  }, [token, activeTab]); // Tab değiştikçe yenile

  useEffect(() => {
    const params = new URLSearchParams(routeLocation.search);
    const tab = params.get('tab');
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [routeLocation]);

  // Data states
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Form states
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: 'Ev', cityId: (selectedCity?.id ?? selectedCity?.Id ?? 0), districtId: (selectedDistrict?.id ?? selectedDistrict?.Id ?? 0),
    neighborhood: '', street: '', buildingNo: '', floor: '', apartmentNo: '', directions: ''
  });
  const [formDistricts, setFormDistricts] = useState<any[]>([]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({ cardHolderName: user?.FullName || user?.name || '', cardNumber: '', expiryDate: '' });

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders/my-orders', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setOrders(await res.json());
    } finally { setLoadingOrders(false); }
  }, [token]);

  const fetchAddresses = useCallback(async () => {
    const res = await fetch('/api/user/addresses', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setAddresses(await res.json());
  }, [token]);

  const fetchPaymentMethods = useCallback(async () => {
    const res = await fetch('/api/user/payment-methods', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setPaymentMethods(await res.json());
  }, [token]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'addresses') fetchAddresses();
    if (activeTab === 'payments') fetchPaymentMethods();
  }, [activeTab, user, fetchOrders, fetchAddresses, fetchPaymentMethods]);

  useEffect(() => {
    if (addressForm.cityId) {
      fetch(`/api/cities/${addressForm.cityId}/districts`)
        .then(res => res.json())
        .then(data => setFormDistricts(data));
    } else {
      setFormDistricts([]);
    }
  }, [addressForm.cityId]);

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/orderhub", {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        connection.on("UpdateStatus", (orderId, newStatus) => {
          setOrders(prev => prev.map(o => (o.id ?? o.Id) === orderId ? { ...o, status: newStatus, Status: newStatus } : o));
        });
      })
      .catch(err => console.error("SignalR Connection Error: ", err));

    return () => {
      connection.stop();
    };
  }, [token]);

  const handlePasswordChange = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });
    if (passwords.new !== passwords.confirm) {
      setPassMsg({ type: 'error', text: 'Yeni şifreler uyuşmuyor.' });
      return;
    }
    const res = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new })
    });
    if (res.ok) {
      setPassMsg({ type: 'success', text: 'Şifreniz başarıyla değiştirildi.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } else {
      setPassMsg({ type: 'error', text: 'Şifre değiştirme başarısız. Mevcut şifrenizi kontrol edin.' });
    }
  }, [passwords, token]);

  const handleAddAddress = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/user/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(addressForm)
    });
    if (res.ok) {
      fetchAddresses();
      setShowAddAddress(false);
      setAddressForm(prev => ({ ...prev, neighborhood: '', street: '', buildingNo: '', floor: '', apartmentNo: '', directions: '' }));
    }
  }, [addressForm, token, fetchAddresses]);

  const handleDeleteAddress = useCallback(async (id: number) => {
    await fetch(`/api/user/addresses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchAddresses();
  }, [token, fetchAddresses]);

  const handleAddCard = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/user/payment-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ cardHolderName: cardForm.cardHolderName, maskedCardNumber: cardForm.cardNumber, expiryDate: cardForm.expiryDate })
    });
    if (res.ok) {
      fetchPaymentMethods();
      setShowAddCard(false);
      setCardForm(prev => ({ ...prev, cardNumber: '', expiryDate: '' }));
    }
  }, [cardForm, token, fetchPaymentMethods]);

  const handleDeleteCard = useCallback(async (id: number) => {
    await fetch(`/api/user/payment-methods/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchPaymentMethods();
  }, [token, fetchPaymentMethods]);

  const handleProfileUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const nameInput = (e.target as any).elements[0].value;
    const phoneInput = (e.target as any).elements[1].value;

    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ fullName: nameInput, phoneNumber: phoneInput })
      });
      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        setIsEditing(false);
        alert("Profil başarıyla güncellendi.");
      } else {
        alert("Profil güncellenemedi.");
      }
    } catch (error) {
      console.error("Profil güncelleme hatası:", error);
    }
  }, [token, updateUser]);

  const handleRateOrder = useCallback(async (orderId: number, score: number, comment: string = "") => {
    const res = await fetch('/api/rating/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ orderId, score, comment })
    });
    if (res.ok) {
      const data = await res.json();
      alert(data.message || 'Puanınız kaydedildi!');
      fetchOrders();
    } else {
      const errorData = await res.json();
      alert(errorData.message || 'Puan kaydedilirken bir hata oluştu.');
    }
  }, [token, fetchOrders]);

  if (!user) return <div className="container py-100 text-center">Lütfen giriş yapın.</div>;

  return (
    <div className="profile-page-lux">
      <div className="container">
        <div className="profile-layout-grid">

          {/* Sidebar Nav */}
          <aside className="profile-sidebar">
            <div className="sidebar-user-header">
              <div className="profile-avatar-wrap">
                <div className="avatar-large-lux">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <button className="avatar-edit-btn" title="Fotoğraf Değiştir" onClick={() => fileInputRef.current?.click()}>
                  <Camera size={16} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>
              <div className="user-text-lux">
                <h3 className="user-name-main">{(user as any).FullName || user.name}</h3>
                <span className="user-role-badge">{user.role === 'admin' ? 'Yönetici' : user.role === 'restaurant_owner' ? 'Restoran Sahibi' : 'Üye'}</span>
                <div className="green-points-pill mt-15">
                   <Sparkles size={16} />
                   <span>{(user as any).greenPoints ?? (user as any).GreenPoints ?? 0} Yeşil Puan</span>
                </div>
              </div>
            </div>

            <nav className="profile-nav-lux">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`profile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="nav-icon-box">{tab.icon}</div>
                  <span>{tab.label}</span>
                  <ChevronRight size={16} className="nav-arrow" />
                </button>
              ))}
              <div className="nav-divider" />
              <button onClick={logout} className="profile-nav-item logout-btn-lux">
                <div className="nav-icon-box"><LogOut size={20} /></div>
                <span>Çıkış Yap</span>
              </button>
            </nav>
          </aside>

          {/* Content Area */}
          <main className="profile-content-lux">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="profile-card-main"
              >
                {activeTab === 'profile' && (
                  <div className="tab-section">
                    <div className="section-header-flex">
                      <h2 className="section-title-lux">Hesap Bilgileri</h2>
                      <button className={`btn-edit-lux ${isEditing ? 'saving' : ''}`} onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? <><Save size={18} /> Kaydet</> : <><Edit3 size={18} /> Düzenle</>}
                      </button>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="profile-form-grid">
                      <div className="lux-info-group">
                        <label>AD SOYAD</label>
                        <div className={`lux-info-box ${!isEditing ? 'readonly' : ''}`}>
                          <input type="text" name="fullName" defaultValue={(user as any).FullName || user.name} readOnly={!isEditing} />
                        </div>
                      </div>
                      <div className="lux-info-group">
                        <label>E-POSTA ADRESİ (Değiştirilemez)</label>
                        <div className="lux-info-box readonly">
                          <input type="email" value={user.email} readOnly />
                        </div>
                      </div>
                      <div className="lux-info-group">
                        <label>TELEFON NUMARASI</label>
                        <div className={`lux-info-box ${!isEditing ? 'readonly' : ''}`}>
                          <input type="tel" name="phoneNumber" defaultValue={user.phoneNumber || ''} placeholder="05XX XXX XX XX" readOnly={!isEditing} />
                        </div>
                      </div>
                      {isEditing && (
                        <div className="mt-10">
                          <button type="submit" className="btn-lux-primary">DEĞİŞİKLİKLERİ KAYDET</button>
                        </div>
                      )}
                    </form>

                    {/* Eco-Track Dashboard */}
                    <div className="green-dashboard-lux mt-50">
                      <div className="green-dash-header">
                        <Sparkles size={32} className="text-primary" />
                        <div className="dash-text">
                          <h3>Sürdürülebilirlik Karneniz</h3>
                          <p>Daha temiz bir dünya için yaptığınız katkılar.</p>
                        </div>
                      </div>
                      
                      <div className="green-stats-grid mt-30">
                        <div className="green-stat-card">
                          <span className="stat-label">Toplam Yeşil Puan</span>
                          <span className="stat-value">{(user as any).greenPoints ?? (user as any).GreenPoints ?? 0}</span>
                        </div>
                        <div className="green-stat-card">
                          <span className="stat-label">Tasarruf Edilen Karbon</span>
                          <span className="stat-value text-green">
                            {orders.reduce((acc, curr) => acc + (curr.carbonSaved || curr.CarbonSaved || 0), 0)}g
                          </span>
                        </div>
                        <div className="green-stat-card">
                          <span className="stat-label">Doğa Dostu Siparişler</span>
                          <span className="stat-value">
                            {orders.filter(o => o.isEcoFriendly || o.IsEcoFriendly).length}
                          </span>
                        </div>
                      </div>

                      <div className="green-progress-wrap mt-40">
                         <div className="progress-labels">
                            <span>Sıradaki Seviye: <strong>Eko-Kahraman</strong></span>
                            <span>{((user as any).greenPoints ?? (user as any).GreenPoints ?? 0) % 100} / 100</span>
                         </div>
                         <div className="progress-bar-lux">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${((user as any).greenPoints ?? (user as any).GreenPoints ?? 0) % 100}%` }} 
                              className="progress-fill" 
                            />
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="tab-section">
                    <h2 className="section-title-lux">Sipariş Geçmişi</h2>
                    {loadingOrders ? (
                      <div className="text-center py-60">Yükleniyor...</div>
                    ) : orders.length === 0 ? (
                      <div className="empty-section-lux">
                        <Package size={60} />
                        <h3>Henüz Siparişiniz Yok</h3>
                        <p>Harika lezzetleri keşfetmek için ana sayfaya göz atabilirsiniz.</p>
                      </div>
                    ) : (
                      <div className="orders-list-lux">
                        {orders.map((order: any) => (
                          <div key={order.id ?? order.Id} className={`order-item-card-lux ${(order.status ?? order.Status) === 'cancelled' || (order.status ?? order.Status) === 'canceled' ? 'canceled-order' : ''}`}>
                            <div className="order-card-header">
                              <div className="order-meta">
                                <span className="order-id">Sipariş #{order.id ?? order.Id}</span>
                                <span className="restaurant-name-lux">{order.restaurantName ?? 'Restoran'}</span>
                                <span className="order-date"><Clock size={14} /> {new Date(order.orderDate ?? order.OrderDate).toLocaleDateString('tr-TR')}</span>
                              </div>
                              <div className={`order-status-badge ${order.status ?? order.Status}`}>
                                {((order.status ?? order.Status) === 'preparing') ? 'Hazırlanıyor' :
                                  ((order.status ?? order.Status) === 'on_the_way') ? 'Yolda' :
                                    ((order.status ?? order.Status) === 'cancelled' || (order.status ?? order.Status) === 'canceled') ? 'İptal Edildi' : 'Teslim Edildi'}
                              </div>
                            </div>
                            <div className="order-items-summary">
                              {(order.items ?? order.Items ?? []).map((item: any) => (
                                <div key={item.id ?? item.Id} className="mini-item-row">
                                  <span>{(item.quantity ?? item.Quantity)}x {(item.productName ?? item.ProductName)}</span>
                                  <span>{(item.price ?? item.Price ?? 0) * (item.quantity ?? item.Quantity ?? 0)} TL</span>
                                </div>
                              ))}
                              {(order.note || order.Note) && (
                                <div className="order-note-display" style={{ 
                                  marginTop: '15px', 
                                  padding: '12px 18px', 
                                  background: 'rgba(255,126,0,0.05)', 
                                  border: '1px solid rgba(255,126,0,0.1)', 
                                  borderRadius: '12px',
                                  fontSize: '0.9rem',
                                  color: 'var(--primary)',
                                  fontWeight: 600
                                }}>
                                  <span style={{ fontWeight: 900, opacity: 0.7, marginRight: '8px' }}>NOT:</span>
                                  {order.note || order.Note}
                                </div>
                              )}
                            </div>
                            <div className="order-card-footer">
                              <div className="flex-column" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <div className="payment-tag">
                                  <CreditCard size={14} /> {(order.paymentMethod ?? order.PaymentMethod) === 'credit_card' ? 'Kredi Kartı' : 'Kapıda Ödeme'}
                                </div>
                                {(order.discountAmount > 0 || order.DiscountAmount > 0) && (
                                  <div className="coupon-tag-lux" style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 900 }}>
                                    🎁 Kupon: {order.couponCode || order.CouponCode} (-{order.discountAmount || order.DiscountAmount} TL)
                                  </div>
                                )}
                              </div>
                              <div className="total-tag">Toplam: <strong>{order.totalAmount ?? order.TotalAmount} TL</strong></div>
                            </div>

                            {((order.status ?? order.Status) === 'preparing') && (
                              <div className="order-actions-row-lux">
                                <Link to={`/order-support/${order.id ?? order.Id}`} className="btn-support-link-lux cancellation">
                                  <Trash2 size={16} /> Siparişimi İptal Etmek İstiyorum
                                </Link>
                              </div>
                            )}

                            {((order.status ?? order.Status) === 'delivered' || (order.status ?? order.Status) === 'Teslim Edildi') && (
                              <div className="rating-section-lux fade-in">
                                <h4>{order.ratingScore ? 'Verdiğiniz Puan' : 'Siparişi Puanla'}</h4>
                                <div className="star-rating-box">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      className={`star-btn ${order.ratingScore ? 'rated' : ''}`}
                                      onClick={() => !order.ratingScore && handleRateOrder(order.id ?? order.Id, star)}
                                      disabled={!!order.ratingScore}
                                    >
                                      <Sparkles size={24} className={star <= (order.ratingScore || 0) ? "active-star" : "inactive-star"} />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="tab-section">
                    <div className="section-header-flex">
                      <h2 className="section-title-lux">Kayıtlı Adreslerim</h2>
                      {!showAddAddress && (
                        <button className="btn-lux-primary" onClick={() => setShowAddAddress(true)}>
                          <Plus size={18} /> Yeni Adres
                        </button>
                      )}
                    </div>

                    {showAddAddress ? (
                      <form onSubmit={handleAddAddress} className="add-form-lux fade-in">
                        <div className="form-grid-lux">
                          <div className="lux-info-group">
                            <label>Adres Başlığı</label>
                            <div className="lux-info-box"><input type="text" required value={addressForm.title} onChange={e => setAddressForm({ ...addressForm, title: e.target.value })} placeholder="Örn: Ev, İş" /></div>
                          </div>
                          <div className="input-row-2">
                            <div className="lux-info-group">
                              <label>İl</label>
                              <select className="lux-select" value={addressForm.cityId} onChange={e => setAddressForm({ ...addressForm, cityId: parseInt(e.target.value) })}>
                                <option value={0}>Seçiniz</option>
                                {cities.map(c => <option key={c.id || (c as any).Id} value={c.id || (c as any).Id}>{c.name || (c as any).Name}</option>)}
                              </select>
                            </div>
                            <div className="lux-info-group">
                              <label>İlçe</label>
                              <select className="lux-select" value={addressForm.districtId} onChange={e => setAddressForm({ ...addressForm, districtId: parseInt(e.target.value) })}>
                                <option value={0}>Seçiniz</option>
                                {formDistricts.map(d => <option key={d.id || (d as any).Id} value={d.id || (d as any).Id}>{d.name || (d as any).Name}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="input-row-2">
                            <div className="lux-info-group">
                              <label>Mahalle</label>
                              <div className="lux-info-box"><input type="text" required value={addressForm.neighborhood} onChange={e => setAddressForm({ ...addressForm, neighborhood: e.target.value })} /></div>
                            </div>
                            <div className="lux-info-group">
                              <label>Sokak / Cadde</label>
                              <div className="lux-info-box"><input type="text" required value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} /></div>
                            </div>
                          </div>
                          <div className="input-row-3">
                            <div className="lux-info-group">
                              <label>Bina No</label>
                              <div className="lux-info-box"><input type="text" required value={addressForm.buildingNo} onChange={e => setAddressForm({ ...addressForm, buildingNo: e.target.value })} /></div>
                            </div>
                            <div className="lux-info-group">
                              <label>Kat</label>
                              <div className="lux-info-box"><input type="text" required value={addressForm.floor} onChange={e => setAddressForm({ ...addressForm, floor: e.target.value })} /></div>
                            </div>
                            <div className="lux-info-group">
                              <label>Daire</label>
                              <div className="lux-info-box"><input type="text" required value={addressForm.apartmentNo} onChange={e => setAddressForm({ ...addressForm, apartmentNo: e.target.value })} /></div>
                            </div>
                          </div>
                          <div className="lux-info-group">
                            <label>Tarif (Opsiyonel)</label>
                            <div className="lux-info-box"><input type="text" value={addressForm.directions} onChange={e => setAddressForm({ ...addressForm, directions: e.target.value })} /></div>
                          </div>
                          <div className="form-actions mt-10">
                            <button type="button" className="btn-lux-outline" onClick={() => setShowAddAddress(false)}>İptal</button>
                            <button type="submit" className="btn-lux-primary">Kaydet</button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="address-grid-lux">
                        {addresses.map(addr => (
                          <div key={addr.id ?? addr.Id} className="saved-card-item">
                            <div className="saved-card-header">
                              <div className="saved-card-title"><MapPin size={18} className="text-primary" /> {addr.title ?? addr.Title}</div>
                              <button onClick={() => handleDeleteAddress(addr.id ?? addr.Id)} className="btn-icon-danger"><Trash2 size={16} /></button>
                            </div>
                            <div className="saved-card-body">
                              {addr.neighborhood ?? addr.Neighborhood} Mah. {addr.street ?? addr.Street} Sok. No:{addr.buildingNo ?? addr.BuildingNo} Kat:{addr.floor ?? addr.Floor} Daire:{addr.apartmentNo ?? addr.ApartmentNo}<br />
                              {addr.districtName ?? addr.DistrictName ?? (addr.district ? (addr.district.name ?? addr.district.Name) : '')} / {addr.cityName ?? addr.CityName ?? (addr.city ? (addr.city.name ?? addr.city.Name) : '')}
                            </div>
                          </div>
                        ))}
                        {addresses.length === 0 && <div className="text-muted">Kayıtlı adresiniz bulunmuyor.</div>}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="tab-section">
                    <div className="section-header-flex">
                      <h2 className="section-title-lux">Ödeme Yöntemleri</h2>
                      {!showAddCard && (
                        <button className="btn-lux-primary" onClick={() => setShowAddCard(true)}>
                          <Plus size={18} /> Yeni Kart Ekle
                        </button>
                      )}
                    </div>

                    {showAddCard ? (
                      <form onSubmit={handleAddCard} className="add-form-lux fade-in">
                        <div className="form-grid-lux">
                          <div className="lux-info-group">
                            <label>Kart Üzerindeki İsim</label>
                            <div className="lux-info-box"><input type="text" required value={cardForm.cardHolderName} onChange={e => setCardForm({ ...cardForm, cardHolderName: e.target.value })} /></div>
                          </div>
                          <div className="input-row-2">
                            <div className="lux-info-group">
                              <label>Kart Numarası</label>
                              <div className="lux-info-box"><input type="text" required maxLength={16} placeholder="16 Haneli Numara" value={cardForm.cardNumber} onChange={e => setCardForm({ ...cardForm, cardNumber: e.target.value })} /></div>
                            </div>
                            <div className="lux-info-group">
                              <label>S.K.T (AA/YY)</label>
                              <div className="lux-info-box"><input type="text" required placeholder="12/26" value={cardForm.expiryDate} onChange={e => setCardForm({ ...cardForm, expiryDate: e.target.value })} /></div>
                            </div>
                          </div>
                          <div className="form-actions mt-10">
                            <button type="button" className="btn-lux-outline" onClick={() => setShowAddCard(false)}>İptal</button>
                            <button type="submit" className="btn-lux-primary">Kartı Kaydet</button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="address-grid-lux">
                        {paymentMethods.map(card => (
                          <div key={card.id ?? card.Id} className="saved-card-item">
                            <div className="saved-card-header">
                              <div className="saved-card-title"><CreditCard size={18} className="text-primary" /> {card.cardHolderName ?? card.CardHolderName}</div>
                              <button onClick={() => handleDeleteCard(card.id ?? card.Id)} className="btn-icon-danger"><Trash2 size={16} /></button>
                            </div>
                            <div className="saved-card-body card-number-display">
                              {card.maskedCardNumber ?? card.MaskedCardNumber}
                            </div>
                          </div>
                        ))}
                        {paymentMethods.length === 0 && <div className="text-muted">Kayıtlı kartınız bulunmuyor.</div>}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="tab-section">
                    <h2 className="section-title-lux">Güvenlik Ayarları</h2>

                    {/* Recovery Code Section */}
                    <div className="security-form-container mt-30 mb-40" style={{ border: '2px dashed var(--primary)', background: 'rgba(255,126,0,0.02)', padding: '35px', borderRadius: '35px' }}>
                      <div className="flex items-center gap-15 mb-20" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <div className="nav-icon-box" style={{ background: 'var(--primary)', color: '#000' }}>
                          <Shield size={24} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0 }}>Hesap Kurtarma Kodu</h3>
                          <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0 0' }}>Şifrenizi unutursanız bu kodu kullanarak sıfırlayabilirsiniz.</p>
                        </div>
                      </div>

                      <div className="recovery-code-display" style={{
                        background: '#000',
                        padding: '25px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        border: '1px solid rgba(255,126,0,0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{ fontSize: '0.7rem', color: '#444', fontWeight: 900, letterSpacing: '2px', marginBottom: '10px' }}>ÖZEL KURTARMA KODUNUZ</div>
                        <div style={{
                          fontSize: '2.5rem',
                          fontWeight: 900,
                          color: 'var(--primary)',
                          letterSpacing: '8px',
                          fontFamily: 'monospace'
                        }}>
                          {user?.recoveryCode || (user as any).RecoveryCode || '------'}
                        </div>
                        <button
                          onClick={() => {
                            const code = user?.recoveryCode || (user as any).RecoveryCode || '';
                            navigator.clipboard.writeText(code);
                            alert('Kod kopyalandı!');
                          }}
                          className="btn-lux-outline"
                          style={{ marginTop: '15px', padding: '8px 20px', fontSize: '0.8rem', background: 'none', border: '1px solid #333', color: '#fff', borderRadius: '10px', cursor: 'pointer' }}
                        >
                          Kodu Kopyala
                        </button>
                      </div>
                      <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, marginTop: '15px', textAlign: 'center' }}>
                        ⚠️ Bu kodu kimseyle paylaşmayın ve güvenli bir yerde saklayın.
                      </p>
                    </div>

                    <div className="security-form-container mt-30">
                      <h3 className="mb-20">Şifre Değiştir</h3>
                      {passMsg.text && (
                        <div className={`msg-box ${passMsg.type}`}>
                          {passMsg.text}
                        </div>
                      )}
                      <form onSubmit={handlePasswordChange} className="form-grid-lux">
                        <div className="lux-info-group">
                          <label>MEVCUT ŞİFRE</label>
                          <div className="lux-info-box">
                            <input type="password" required value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
                          </div>
                        </div>
                        <div className="lux-info-group">
                          <label>YENİ ŞİFRE</label>
                          <div className="lux-info-box">
                            <input type="password" required value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} />
                          </div>
                        </div>
                        <div className="lux-info-group">
                          <label>YENİ ŞİFRE (TEKRAR)</label>
                          <div className="lux-info-box">
                            <input type="password" required value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
                          </div>
                        </div>
                        <div className="mt-10">
                          <button type="submit" className="btn-lux-primary w-full">ŞİFREYİ GÜNCELLE</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <style>{`
        .profile-page-lux { background: var(--bg-main); min-height: 100vh; padding: 60px 0 120px; }
        .profile-layout-grid { display: grid; grid-template-columns: 350px 1fr; gap: 40px; }
        .profile-sidebar { position: sticky; top: 120px; height: fit-content; }
        .sidebar-user-header { background: var(--bg-card); border-radius: 35px; padding: 45px 30px; text-align: center; margin-bottom: 25px; box-shadow: var(--shadow-lux); }
        .avatar-large-lux { width: 110px; height: 110px; background: #111; border-radius: 35px; display: flex; align-items: center; justify-content: center; color: var(--primary); border: 2px solid rgba(255,126,0,0.1); margin: 0 auto 25px; }
        .user-name-main { font-size: 1.6rem; font-weight: 900; color: #fff; letter-spacing: -1px; }
        .user-role-badge { display: inline-block; padding: 6px 16px; background: rgba(255,126,0,0.1); border-radius: 50px; font-size: 0.75rem; font-weight: 900; color: var(--primary); text-transform: uppercase; margin-top: 10px; border: 1px solid rgba(255,126,0,0.1); }
        .profile-nav-lux { background: var(--bg-card); border-radius: 35px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); box-shadow: var(--shadow-lux); }
        .profile-nav-item { width: 100%; display: flex; align-items: center; gap: 15px; padding: 16px 25px; border-radius: 20px; border: none; background: none; cursor: pointer; transition: 0.4s; color: #888; font-weight: 800; font-size: 1rem; text-align: left; margin-bottom: 5px; }
        .profile-nav-item.active { background: var(--primary); color: #000; box-shadow: 0 15px 30px var(--orange-glow); transform: translateX(10px); }
        .profile-card-main { background: var(--bg-card); border-radius: 40px; padding: 50px; border: 1px solid rgba(255,255,255,0.05); box-shadow: var(--shadow-lux); min-height: 650px; }
        .section-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; border-left: 4px solid var(--primary); padding-left: 25px; }
        .section-title-lux { font-size: 2.2rem; font-weight: 900; color: #fff; letter-spacing: -1.5px; }
        .btn-lux-primary { background: var(--primary); color: #000; border: none; padding: 12px 25px; border-radius: 15px; font-weight: 900; cursor: pointer; }
        .lux-info-box { background: #111; border: 1px solid rgba(255,255,255,0.05); padding: 18px 25px; border-radius: 18px; }
        
        /* Avatar & Edit Buttons CSS */
        .profile-avatar-wrap { position: relative; display: inline-block; }
        .avatar-edit-btn { position: absolute; bottom: -5px; right: -5px; background: var(--primary); color: #000; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; box-shadow: 0 5px 15px rgba(255,126,0,0.4); z-index: 2; }
        .avatar-edit-btn:hover { transform: scale(1.15) rotate(15deg); box-shadow: 0 8px 25px var(--orange-glow); }
        
        .btn-edit-lux { display: flex; align-items: center; gap: 8px; background: rgba(255,126,0,0.1); color: var(--primary); border: 1px solid rgba(255,126,0,0.2); padding: 10px 20px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .btn-edit-lux:hover { background: var(--primary); color: #000; box-shadow: 0 10px 20px var(--orange-glow); transform: translateY(-2px); }
        .btn-edit-lux.saving { background: #10b981; color: #000; border-color: #10b981; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.4); }
        .lux-info-box input { background: none; border: none; outline: none; width: 100%; font-size: 1.05rem; font-weight: 800; color: #fff; }
        .order-status-badge { padding: 6px 15px; border-radius: 8px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 10px; }
        .order-status-badge.preparing { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
        .order-status-badge.on_the_way { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
        .order-status-badge.delivered, .order-status-badge.Teslim { background: rgba(0, 255, 136, 0.1); color: #00ff88; border: 1px solid rgba(0, 255, 136, 0.2); }
        .order-status-badge.canceled, .order-status-badge.cancelled { background: rgba(255, 50, 50, 0.1); color: #ff4d4d; border: 1px solid rgba(255, 50, 50, 0.2); }

        .canceled-order { opacity: 0.6; filter: grayscale(0.5); pointer-events: none; }
        .canceled-order .order-items-summary { text-decoration: line-through; color: #666; }
        .canceled-order .total-tag { text-decoration: line-through; color: #666; }
        
        .lux-select { background: #111; border: 1px solid rgba(255,255,255,0.05); padding: 18px 25px; border-radius: 18px; color: #fff; width: 100%; outline: none; appearance: none; }
        .order-item-card-lux { background: #111; border: 1px solid rgba(255,255,255,0.05); border-radius: 30px; padding: 35px; margin-bottom: 25px; }
        .star-rating-box { display: flex; gap: 8px; margin-top: 15px; }
        .star-btn { background: none; border: none; cursor: pointer; transition: 0.3s; padding: 5px; }
        .star-btn:hover:not(.rated) { transform: scale(1.2) rotate(15deg); }
        .active-star { color: #ffc107; fill: #ffc107; filter: drop-shadow(0 0 5px rgba(255, 193, 7, 0.5)); }
        .inactive-star { color: #444; fill: transparent; transition: 0.3s; }
        .star-btn:hover:not(.rated) .inactive-star { color: #888; }
        .msg-box.success { color: #10b981; } .msg-box.error { color: #ef4444; }
        .nav-icon-box { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
        .nav-arrow { margin-left: auto; opacity: 0.3; }
        .nav-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 20px 25px; }
        .input-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .input-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 25px; }
        .saved-card-item { border: 1px solid rgba(255,255,255,0.05); border-radius: 25px; padding: 30px; background: #111; margin-bottom: 25px; }
        .btn-icon-danger { color: #ef4444; background: none; border: none; cursor: pointer; }
        .order-actions-row-lux { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.03); }
        .btn-support-link-lux { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px; background: rgba(255,126,0,0.05); color: var(--primary); border-radius: 18px; font-weight: 900; text-decoration: none; border: 1px solid rgba(255,126,0,0.1); transition: 0.3s; }
        .btn-support-link-lux:hover { background: var(--primary); color: #000; box-shadow: 0 10px 20px var(--orange-glow); transform: translateY(-2px); }

        .green-points-pill { display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 15px; border-radius: 50px; font-weight: 900; font-size: 0.85rem; border: 1px solid rgba(16, 185, 129, 0.2); }
        .green-dashboard-lux { background: #000; border-radius: 35px; padding: 40px; border: 1px solid rgba(16, 185, 129, 0.1); }
        .green-dash-header { display: flex; align-items: center; gap: 20px; }
        .green-dash-header h3 { font-size: 1.8rem; font-weight: 900; color: #fff; margin: 0; }
        .green-dash-header p { color: #888; margin-top: 5px; }
        .green-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .green-stat-card { background: #111; padding: 25px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.05); text-align: center; }
        .stat-label { display: block; font-size: 0.75rem; color: #666; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; }
        .stat-value { font-size: 2rem; font-weight: 900; color: #fff; }
        .stat-value.text-green { color: #10b981; }
        
        .progress-bar-lux { height: 12px; background: #111; border-radius: 50px; overflow: hidden; margin-top: 15px; border: 1px solid rgba(255,255,255,0.05); }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); box-shadow: 0 0 15px rgba(16, 185, 129, 0.5); }
        .progress-labels { display: flex; justify-content: space-between; font-weight: 800; font-size: 0.9rem; color: #ccc; }
      `}</style>
    </div>
  );
};

export default Profile;
