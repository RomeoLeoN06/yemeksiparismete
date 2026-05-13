import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, ArrowRight, MapPin, Plus, ChevronLeft, Minus, Sparkles } from 'lucide-react';

const Checkout = () => {
  const { cart, totalPrice, clearCart, incrementQuantity, decrementQuantity } = useCart();
  const { user, token } = useAuth();
  const { selectedCity, selectedDistrict, setSelectedCity, setSelectedDistrict, cities, districts } = useLocation();
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  const searchParams = new URLSearchParams(routeLocation.search);
  const groupSessionIdFromUrl = searchParams.get('sessionId');
  const { groupSessionId: groupSessionIdFromState } = (routeLocation.state as any) || {};
  const groupSessionId = groupSessionIdFromUrl || groupSessionIdFromState;

  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(!!groupSessionId);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
  const [orderNote, setOrderNote] = useState('');
  const [isEcoFriendly, setIsEcoFriendly] = useState(false);

  const participantId = (cart?.length ?? 0 > 0) 
    ? (cart?.find((item: any) => (item as any).addedByUserId && (item as any).addedByUserId !== user?.id) as any)?.addedByUserId 
    : null;

  const [groupItems, setGroupItems] = useState<any[]>([]);
  const [isGroupOrder, setIsGroupOrder] = useState(false);

  useEffect(() => {
    if (groupSessionId && token) {
      setIsGroupOrder(true);
      setLoadingItems(true);
      fetch(`/api/orders/group-session/${groupSessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        const items = data.items || data.$values || [];
        setGroupItems(items);
        setLoadingItems(false);
      })
      .catch(err => {
        console.error("Error fetching group items for checkout:", err);
        setLoadingItems(false);
      });
    } else {
      setLoadingItems(false);
    }
  }, [groupSessionId, token]);

  useEffect(() => {
    if (participantId) {
      fetch(`/api/user/member-address/${participantId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
        .then(data => {
          if (data.address) {
            // Basit bir ayrıştırma ile alanları doldurmaya çalışalım veya not kısmına ekleyelim
            setOrderNote(`Ismarlanan Kişi: ${data.fullName || ''}\nTeslimat Adresi: ${data.address}`);
            // Formdaki ana adres alanını da dolduralım (Mahalle kısmına tam adresi yazıyoruz)
            setAddress(prev => ({ ...prev, neighborhood: data.address }));
          }
        })
      .catch(err => console.error('Error fetching member address:', err));
    }
  }, [participantId, token]);

  const { coupon, applyCoupon, discountAmount, availableCoupons } = useCart();

  const effectiveItems = isGroupOrder ? groupItems : cart;
  
  const currentTotalPrice = isGroupOrder 
    ? effectiveItems.reduce((acc, i) => acc + (i.price || i.Price || 0) * (i.quantity || i.Quantity || 0), 0)
    : totalPrice;

  const finalAmount = Math.max(0, currentTotalPrice - discountAmount);
  const isBelowMinimum = finalAmount < 300;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 50);
  }, []);

  useEffect(() => {
    if (!token && !loading) {
      const timer = setTimeout(() => {
        if (!token) navigate('/login?redirect=checkout');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [token, navigate, loading]);

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  
  const [useSavedAddress, setUseSavedAddress] = useState<number | null>(null);
  const [useSavedCard, setUseSavedCard] = useState<number | null>(null);

  const [address, setAddress] = useState({
    neighborhood: '', street: '', buildingNo: '', floor: '', apartmentNo: '', directions: ''
  });

  const [cardInfo, setCardInfo] = useState({
    number: '', expiry: '', cvv: '', name: user?.name || ''
  });

  useEffect(() => {
    if (token) {
      fetch('/api/user/addresses', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          setSavedAddresses(data);
          if (data.length > 0) setUseSavedAddress(data[0].id || data[0].Id);
        });

      fetch('/api/user/payment-methods', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          setSavedCards(data);
          if (data.length > 0) setUseSavedCard(data[0].id || data[0].Id);
        });
    }
  }, [token]);

  const validateAddress = useCallback(() => {
    if (useSavedAddress) return null; // Using saved address is valid
    const { neighborhood, street, buildingNo, floor, apartmentNo } = address;
    if (!neighborhood || neighborhood.length < 3) return "Geçerli bir mahalle girin.";
    if (!street || street.length < 3) return "Geçerli bir sokak girin.";
    if (!buildingNo) return "Bina No zorunludur.";
    if (!floor) return "Kat zorunludur.";
    if (!apartmentNo) return "Daire No zorunludur.";
    if (!selectedCity || !selectedDistrict) return "Şehir/İlçe seçimi zorunludur.";
    return null;
  }, [useSavedAddress, address, selectedCity, selectedDistrict]);

  const handleOrder = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const addressError = validateAddress();
    if (addressError) { setError(addressError); return; }
    if (!agreeToTerms) { setError('Lütfen mesafeli satış sözleşmesini onaylayın.'); return; }
    if (paymentMethod === 'card' && !useSavedCard && (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv)) {
      setError('Lütfen kart bilgilerinizi eksiksiz girin veya kayıtlı bir kart seçin.'); return;
    }
    
    setLoading(true);
    
    let finalDeliveryAddress = '';
    if (useSavedAddress) {
      const addr = savedAddresses.find(a => (a.id || a.Id) === useSavedAddress);
      if (addr) {
        const n = addr.neighborhood || addr.Neighborhood || '';
        const s = addr.street || addr.Street || '';
        const b = addr.buildingNo || addr.BuildingNo || '';
        const f = addr.floor || addr.Floor || '';
        const aNo = addr.apartmentNo || addr.ApartmentNo || '';
        const dN = addr.districtName || addr.DistrictName || '';
        const cN = addr.cityName || addr.CityName || '';
        finalDeliveryAddress = `${n} Mah. ${s} Sk. No:${b} Kat:${f} Daire:${aNo}, ${dN} / ${cN}`;
      }
    } else {
      finalDeliveryAddress = `${address.neighborhood} Mah. ${address.street} Sk. No:${address.buildingNo} Kat:${address.floor} Daire:${address.apartmentNo}, ${selectedDistrict?.name || (selectedDistrict as any)?.Name} / ${selectedCity?.name || (selectedCity as any)?.Name}`;
    }

    const orderData = {
      totalAmount: finalAmount,
      couponCode: coupon?.code ?? coupon?.Code ?? null,
      discountAmount: discountAmount,
      paymentMethod: paymentMethod === 'card' ? 'credit_card' : 'cash_at_door',
      customerName: user?.FullName || user?.name || 'Müşteri',
      customerPhone: user?.phoneNumber || '-',
      deliveryAddress: finalDeliveryAddress,
      note: orderNote,
      isEcoFriendly: isEcoFriendly,
      groupOrderSessionId: groupSessionId || null,
      targetUserId: participantId || null,
      payerUserId: user?.id || null,
      restaurantId: (effectiveItems && effectiveItems.length > 0) ? ((effectiveItems[0] as any).RestaurantId || (effectiveItems[0] as any).restaurantId || (effectiveItems[0] as any).RestaurantID) : null,
      items: (effectiveItems || []).map(item => {
        const itemPriceRaw = String(item.price || item.Price || "0").replace(/\./g, '').replace(',', '.');
        const itemPrice = parseFloat(itemPriceRaw) || 0;
        const itemQty = item.quantity || item.Quantity || 0;
        const pId = parseInt(String(item.productId || item.ProductId));
        return {
          productId: isNaN(pId) ? 0 : pId,
          productName: item.productName || item.ProductName || "Ürün",
          quantity: itemQty,
          price: itemPrice,
          addedByUserName: item.addedByUserName || item.AddedByUserName || null
        };
      })
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        setIsSuccess(true);
        clearCart();
        setTimeout(() => {
          navigate('/order-success', { state: { orderId: result.id || result.Id } });
        }, 3000);
      } else {
        const errText = await response.text();
        try {
          const errObj = JSON.parse(errText);
          setError(`Sipariş oluşturulurken hata: ${errObj.inner || errObj.error || errObj.title || errText}`);
        } catch {
          setError(`Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin. (${errText})`);
        }
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  }, [validateAddress, agreeToTerms, paymentMethod, useSavedCard, cardInfo, useSavedAddress, savedAddresses, address, selectedDistrict, selectedCity, totalPrice, user, cart, token, clearCart, navigate]);

  if (loadingItems) {
    return (
      <div className="container py-100 text-center">
        <div className="lux-loader"></div>
        <p className="mt-20">Sipariş detayları yükleniyor...</p>
      </div>
    );
  }

  if ((!cart || cart.length === 0) && (!groupItems || groupItems.length === 0)) {
    return (
      <div className="container py-100 text-center">
        <div className="empty-state-card">
          <Truck size={80} className="text-muted" />
          <h2>Sepetiniz Boş</h2>
          <p>Lezzet dolu menülerimizi keşfetmek için ana sayfaya dönebilirsiniz.</p>
          <button onClick={() => navigate('/')} className="btn-lux-primary mt-20">ALIŞVERİŞE BAŞLA</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper fade-in">
      <div className="container">
        <header className="checkout-header">
          <button onClick={() => navigate(-1)} className="btn-checkout-back">
            <ChevronLeft size={20} />
            <span>Sepete Dön</span>
          </button>
          <h1 className="checkout-title-main">Güvenli <span className="text-primary">Ödeme</span></h1>
          <p className="checkout-subtitle">Siparişinizi tamamlamak için bilgileri kontrol edin.</p>
        </header>

        <div className="checkout-flex-layout">
          <div className="checkout-form-column">
            {/* 1. Address Section */}
            <div className="checkout-card-lux">
              <div className="card-header-flex">
                <div className="header-left">
                  <div className="step-num">1</div>
                  <h2>Teslimat Adresi</h2>
                </div>
                {!useSavedAddress && (
                  <div className="location-pill-mini">
                    {selectedCity?.name || (selectedCity as any)?.Name} / {selectedDistrict?.name || (selectedDistrict as any)?.Name}
                  </div>
                )}
              </div>
              
              {savedAddresses.length > 0 && (
                <div className="saved-options-grid mb-20">
                  {savedAddresses.map(addr => (
                    <div 
                      key={addr.id || addr.Id} 
                      className={`saved-option-pill ${useSavedAddress === (addr.id || addr.Id) ? 'active' : ''}`}
                      onClick={() => setUseSavedAddress(addr.id || addr.Id)}
                    >
                      <MapPin size={18} />
                      <div className="opt-text">
                        <strong>{addr.title ?? addr.Title}</strong>
                        <span>{addr.neighborhood ?? addr.Neighborhood} Mah. {addr.street ?? addr.Street} Sk.</span>
                      </div>
                    </div>
                  ))}
                  <div 
                    className={`saved-option-pill ${!useSavedAddress ? 'active' : ''}`}
                    onClick={() => setUseSavedAddress(null)}
                  >
                    <Plus size={18} />
                    <div className="opt-text">
                      <strong>Yeni Adres</strong>
                      <span>Farklı bir adrese gönder</span>
                    </div>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {!useSavedAddress && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="form-grid-lux overflow-hidden">
                    <div className="input-group-lux">
                      <label>Mahalle</label>
                      <input type="text" placeholder="Mahalle adı" value={address.neighborhood} onChange={e => setAddress({...address, neighborhood: e.target.value})} />
                    </div>
                    <div className="input-group-lux">
                      <label>Sokak / Cadde</label>
                      <input type="text" placeholder="Sokak veya cadde adı" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                    </div>
                    <div className="input-row-3">
                      <div className="input-group-lux">
                        <label>Bina No</label>
                        <input type="text" placeholder="No" value={address.buildingNo} onChange={e => setAddress({...address, buildingNo: e.target.value})} />
                      </div>
                      <div className="input-group-lux">
                        <label>Kat</label>
                        <input type="text" placeholder="Kat" value={address.floor} onChange={e => setAddress({...address, floor: e.target.value})} />
                      </div>
                      <div className="input-group-lux">
                        <label>Daire No</label>
                        <input type="text" placeholder="Daire" value={address.apartmentNo} onChange={e => setAddress({...address, apartmentNo: e.target.value})} />
                      </div>
                    </div>
                    <div className="input-row-2">
                      <div className="input-group-lux">
                        <label>İl</label>
                        <select 
                          value={selectedCity?.id || (selectedCity as any)?.Id || ''} 
                          onChange={(e) => {
                            const city = cities.find(c => (c.id || c.Id) === parseInt(e.target.value));
                            if (city) setSelectedCity(city);
                          }}
                          className="lux-select"
                        >
                          <option value="">İl Seçin</option>
                          {cities.map(c => (
                            <option key={c.id || c.Id} value={c.id || c.Id}>{c.name || c.Name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group-lux">
                        <label>İlçe</label>
                        <select 
                          value={selectedDistrict?.id || (selectedDistrict as any)?.Id || ''} 
                          onChange={(e) => {
                            const dist = districts.find(d => (d.id || d.Id) === parseInt(e.target.value));
                            if (dist) setSelectedDistrict(dist);
                          }}
                          className="lux-select"
                        >
                          <option value="">İlçe Seçin</option>
                          {districts.map(d => (
                            <option key={d.id || d.Id} value={d.id || d.Id}>{d.name || d.Name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="input-group-lux">
                      <label>Adres Tarifi (İsteğe Bağlı)</label>
                      <textarea placeholder="Kapı zili, blok adı vb." value={address.directions} onChange={e => setAddress({...address, directions: e.target.value})} rows={2} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="input-group-lux mt-25" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '25px' }}>
                <label>Sipariş Notu</label>
                <textarea 
                  placeholder="Restoran için bir not bırakın (Örn: Zil çalmasın, kapıya asın vb.)" 
                  value={orderNote} 
                  onChange={e => setOrderNote(e.target.value)} 
                  rows={3} 
                />
              </div>

              {/* Eco-Track Toggle */}
              <div 
                className={`eco-track-card mt-25 ${isEcoFriendly ? 'active' : ''}`}
                onClick={() => setIsEcoFriendly(!isEcoFriendly)}
              >
                <div className="eco-icon-box">
                  <Sparkles size={24} />
                </div>
                <div className="eco-text">
                  <div className="eco-title">Doğa Dostu Seçim 🌿</div>
                  <p className="eco-desc">Plastik çatal, bıçak ve kaşık istemiyorum. (<strong>+10 Yeşil Puan</strong>)</p>
                </div>
                <div className={`eco-toggle ${isEcoFriendly ? 'active' : ''}`}>
                  <div className="toggle-dot" />
                </div>
              </div>
            </div>

            {/* 2. Payment Section */}
            <div className="checkout-card-lux mt-30">
              <div className="card-header-flex">
                <div className="header-left">
                  <div className="step-num">2</div>
                  <h2>Ödeme Yöntemi</h2>
                </div>
              </div>

              <div className="payment-options-grid">
                <div className={`payment-pill ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                  <CreditCard size={20} />
                  <span>Kredi / Banka Kartı</span>
                </div>
                <div className={`payment-pill ${paymentMethod === 'cash' ? 'active' : ''}`} onClick={() => setPaymentMethod('cash')}>
                  <Truck size={20} />
                  <span>Kapıda Ödeme</span>
                </div>
              </div>

              <AnimatePresence>
                {paymentMethod === 'card' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="card-form-wrap">
                    
                    {savedCards.length > 0 && (
                      <div className="saved-options-grid mb-20">
                        {savedCards.map(card => (
                          <div 
                            key={card.id || card.Id} 
                            className={`saved-option-pill ${useSavedCard === (card.id || card.Id) ? 'active' : ''}`}
                            onClick={() => setUseSavedCard(card.id || card.Id)}
                          >
                            <CreditCard size={18} />
                            <div className="opt-text">
                              <strong>{card.maskedCardNumber ?? card.MaskedCardNumber}</strong>
                              <span>{card.cardHolderName ?? card.CardHolderName}</span>
                            </div>
                          </div>
                        ))}
                        <div 
                          className={`saved-option-pill ${!useSavedCard ? 'active' : ''}`}
                          onClick={() => setUseSavedCard(null)}
                        >
                          <Plus size={18} />
                          <div className="opt-text">
                            <strong>Yeni Kart</strong>
                            <span>Farklı bir kart kullan</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {!useSavedCard && (
                      <div className="form-grid-lux mt-10">
                        <div className="input-group-lux">
                          <label>Kart Üzerindeki İsim</label>
                          <input type="text" placeholder="AD SOYAD" value={cardInfo.name} onChange={e => setCardInfo({...cardInfo, name: e.target.value})} />
                        </div>
                        <div className="input-group-lux">
                          <label>Kart Numarası</label>
                          <input type="text" maxLength={16} placeholder="**** **** **** ****" value={cardInfo.number} onChange={e => setCardInfo({...cardInfo, number: e.target.value})} />
                        </div>
                        <div className="input-row-2">
                          <div className="input-group-lux">
                            <label>S.K.T</label>
                            <input type="text" placeholder="AA/YY" value={cardInfo.expiry} onChange={e => setCardInfo({...cardInfo, expiry: e.target.value})} />
                          </div>
                          <div className="input-group-lux">
                            <label>CVV</label>
                            <input type="text" placeholder="***" maxLength={3} value={cardInfo.cvv} onChange={e => setCardInfo({...cardInfo, cvv: e.target.value})} />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <aside className="checkout-summary-column">
            <div className="summary-card-lux">
              <div className="card-header-lux">
                <ShieldCheck size={24} className="text-primary" />
                <h3>Sipariş Özeti</h3>
              </div>
              
              <div className="summary-items-list">
                {effectiveItems.map(item => (
                  <div key={item.ProductId || item.productId} className="summary-item-row">
                    <div className="item-main">
                      <div className="summary-item-thumb">
                        <img src={item.ImageUrl || item.imageUrl || 'https://via.placeholder.com/60'} alt={item.ProductName || item.productName} />
                      </div>
                      <div className="summary-item-details">
                        <span className="item-name">{item.ProductName || item.productName}</span>
                      {!isGroupOrder && (
                        <div className="summary-qty-ctrl">
                          <button onClick={() => decrementQuantity(item.ProductId)} className="qty-btn-mini"><Minus size={12} /></button>
                          <span className="item-qty">{item.Quantity}</span>
                          <button onClick={() => incrementQuantity(item.ProductId)} className="qty-btn-mini"><Plus size={12} /></button>
                        </div>
                      )}
                      {isGroupOrder && (
                        <div className="group-item-meta" style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>
                           {item.Quantity || item.quantity} Adet - {item.AddedByUserName || item.addedByUserName}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="item-total">
                    {(() => {
                      let p = 0;
                      const priceVal = item.Price || item.price || 0;
                      if (typeof priceVal === 'number') p = priceVal;
                      else p = parseFloat(String(priceVal || "0").replace(/\./g, '').replace(',', '.')) || 0;
                      return (p * (item.Quantity || item.quantity)).toLocaleString('tr-TR');
                    })()} TL
                  </span>
                </div>
              ))}
              </div>

                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Ara Toplam</span>
                    <span>{currentTotalPrice.toLocaleString('tr-TR')} TL</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="price-row text-primary">
                      <span>Kupon İndirimi ({coupon?.code ?? coupon?.Code})</span>
                      <span>-{discountAmount.toLocaleString('tr-TR')} TL</span>
                    </div>
                  )}
                  <div className="price-row">
                    <span>Getirme Ücreti</span>
                    <span className="text-free">Ücretsiz</span>
                  </div>
                  <div className="grand-price-row">
                    <span>Toplam</span>
                    <span>{finalAmount.toLocaleString('tr-TR')} TL</span>
                  </div>
                </div>

                <div className="coupon-section mt-30">
                  <div className="input-group-lux">
                    <label>Kupon Kodu Uygula</label>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <input 
                        type="text" 
                        placeholder="Örn: METE300" 
                        value={couponCode} 
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        style={{ flex: 1 }}
                      />
                      <button 
                        onClick={async () => {
                          const res = await applyCoupon(couponCode);
                          setCouponMessage({ type: res.success ? 'success' : 'error', text: res.message });
                        }}
                        className="btn-lux-outline"
                        style={{ padding: '0 20px' }}
                      >
                        Uygula
                      </button>
                    </div>
                    {couponMessage.text && (
                      <div className={`coupon-msg ${couponMessage.type}`} style={{ fontSize: '0.85rem', marginTop: '8px', fontWeight: 700 }}>
                        {couponMessage.text}
                      </div>
                    )}
                  </div>

                  {/* Akıllı Kupon Kartları */}
                  <div className="available-coupons-grid mt-25">
                    <h4 className="coupon-grid-title">Size Özel Kuponlar</h4>
                    {availableCoupons.map(c => {
                      const minAmount = (c.minimumOrderAmount ?? c.MinimumOrderAmount);
                      const isEligible = totalPrice >= minAmount;
                      const isActive = coupon?.code === c.code || coupon?.Code === c.Code;
                      const missingAmount = minAmount - totalPrice;

                      return (
                        <div 
                          key={c.id || c.Id} 
                          className={`coupon-robust-card ${!isEligible ? 'locked' : ''} ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            if (isEligible) {
                              applyCoupon(c.code ?? c.Code);
                              setCouponMessage({ type: 'success', text: 'Kupon uygulandı!' });
                            }
                          }}
                        >
                          <div className="robust-card-main">
                            <div className="robust-icon-box">
                              {isEligible ? <ShieldCheck size={20} /> : <Plus size={20} style={{ transform: 'rotate(45deg)' }} />}
                            </div>
                            <div className="robust-info">
                              <span className="robust-code">{c.code ?? c.Code}</span>
                              <span className="robust-discount">{c.discountAmount ?? c.DiscountAmount} TL İNDİRİM</span>
                            </div>
                          </div>
                          
                          <div className="robust-status">
                            {isEligible ? (
                              isActive ? <span className="status-badge active">UYGULANDI</span> : <span className="status-badge use">KULLAN</span>
                            ) : (
                              <span className="status-badge missing">+{missingAmount} TL DAHA</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {isBelowMinimum && (
                  <div className="min-amount-warning mt-20">
                    <ShieldCheck size={20} />
                    <span>Minimum sipariş tutarı 300 TL olmalıdır. (Eksik: {(300 - finalAmount).toLocaleString('tr-TR')} TL)</span>
                  </div>
                )}

              <div className="terms-row-lux" onClick={() => setAgreeToTerms(!agreeToTerms)}>
                <div className={`checkbox-lux ${agreeToTerms ? 'active' : ''}`}>
                  {agreeToTerms && <ArrowRight size={14} />}
                </div>
                <span>Mesafeli satış sözleşmesini okudum ve onaylıyorum.</span>
              </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="checkout-error-box">
                    {error}
                  </motion.div>
                )}

                <button 
                  disabled={loading || isSuccess || isBelowMinimum} 
                  onClick={handleOrder} 
                  className={`btn-lux-primary w-full mt-30 ${isBelowMinimum ? 'disabled-btn' : ''}`}
                >
                  {loading ? 'SİPARİŞ İŞLENİYOR...' : isSuccess ? 'SİPARİŞ ALINDI!' : isBelowMinimum ? 'MİN. 300 TL OLMALI' : 'SİPARİŞİ TAMAMLA'}
                  {!loading && !isSuccess && !isBelowMinimum && <ArrowRight size={20} />}
                </button>
              </div>
            </aside>
          </div>
        </div>

        <AnimatePresence>
          {isSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="success-full-overlay">
              <motion.div initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }} className="success-message-card">
                <div className="success-icon-anim"><ShieldCheck size={80} /></div>
                <h2>Siparişiniz Hazırlanıyor!</h2>
                <p>Harika seçim! Siparişiniz restoranımıza ulaştı. Şimdi arkanıza yaslanın ve lezzetin tadını çıkarmaya hazır olun.</p>
                <div className="redirect-hint">Sipariş detaylarına yönlendiriliyorsunuz...</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      <style>{`
        .checkout-wrapper { background: var(--bg-main); min-height: 100vh; padding: 60px 0 120px; position: relative; }
        .checkout-header { text-align: center; margin-bottom: 70px; position: relative; }
        .checkout-title-main { font-size: 4rem; font-weight: 900; letter-spacing: -3px; color: #fff; line-height: 1.1; }
        .checkout-subtitle { font-size: 1.2rem; color: var(--text-muted); font-weight: 500; margin-top: 15px; }

        .btn-checkout-back {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          display: flex; align-items: center; gap: 10px; background: #1a1a1a;
          color: #fff; padding: 12px 25px; border-radius: 50px; font-weight: 800;
          text-decoration: none; border: 1px solid rgba(255,255,255,0.05);
          transition: 0.3s;
        }
        .btn-checkout-back:hover { background: var(--primary); color: #000; box-shadow: 0 0 15px var(--orange-glow); }

        .checkout-flex-layout { display: grid; grid-template-columns: 1fr 450px; gap: 60px; }
        .checkout-card-lux { background: var(--bg-card); border-radius: 35px; padding: 45px; border: 1px solid rgba(255,255,255,0.05); box-shadow: var(--shadow-lux); position: relative; }
        
        .card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-left: 4px solid var(--primary); padding-left: 20px; }
        .header-left { display: flex; align-items: center; gap: 20px; }
        .step-num { width: 36px; height: 36px; background: var(--primary); color: #000; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1rem; transform: rotate(-5deg); }
        .header-left h2 { font-size: 1.8rem; font-weight: 900; color: #fff; letter-spacing: -1px; }
        .location-pill-mini { background: var(--accent); padding: 8px 18px; border-radius: 50px; font-size: 0.85rem; font-weight: 800; color: var(--primary); border: 1px solid rgba(255,126,0,0.1); }

        .saved-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .saved-option-pill { background: #1a1a1a; border: 2px solid transparent; padding: 20px; border-radius: 20px; display: flex; align-items: center; gap: 18px; cursor: pointer; transition: 0.4s; border: 1px solid rgba(255,255,255,0.05); }
        .saved-option-pill:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-5px); }
        .saved-option-pill.active { background: #222; border-color: var(--primary); color: var(--primary); box-shadow: 0 15px 30px rgba(255,126,0,0.1); }
        .opt-text { display: flex; flex-direction: column; gap: 5px; }
        .opt-text strong { font-weight: 900; font-size: 1.05rem; color: #fff; }
        .opt-text span { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }
        .saved-option-pill.active .opt-text strong { color: var(--primary); }

        .form-grid-lux { display: flex; flex-direction: column; gap: 25px; }
        .input-group-lux { display: flex; flex-direction: column; gap: 10px; }
        .input-group-lux label { font-size: 0.8rem; font-weight: 900; color: #666; text-transform: uppercase; letter-spacing: 1.5px; padding-left: 5px; }
        .input-group-lux input, .input-group-lux textarea { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); padding: 18px; border-radius: 18px; outline: none; transition: 0.3s; font-weight: 700; color: #fff; }
        .input-group-lux input:focus, .input-group-lux textarea:focus, .lux-select:focus { border-color: var(--primary); background: #222; box-shadow: 0 0 0 5px rgba(255, 126, 0, 0.05); }
        .lux-select { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); padding: 18px; border-radius: 18px; outline: none; transition: 0.3s; font-weight: 700; color: #fff; appearance: none; cursor: pointer; }
        .lux-select option { background: #1a1a1a; color: #fff; }

        .input-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .input-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        .payment-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 35px; }
        .payment-pill { background: #1a1a1a; border: 2px solid transparent; padding: 25px; border-radius: 24px; display: flex; align-items: center; gap: 15px; cursor: pointer; transition: 0.4s; font-weight: 800; color: #888; border: 1px solid rgba(255,255,255,0.05); }
        .payment-pill.active { background: #222; border-color: var(--primary); color: var(--primary); box-shadow: 0 15px 30px rgba(255,126,0,0.1); }
        .card-form-wrap { padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 15px; }

        .summary-card-lux { position: sticky; top: 120px; background: #000; color: #fff; border-radius: 40px; padding: 45px; box-shadow: 0 40px 100px rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.05); border-top: 5px solid var(--primary); }
        .card-header-lux { display: flex; align-items: center; gap: 20px; margin-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 25px; }
        .card-header-lux h3 { font-size: 2rem; font-weight: 900; letter-spacing: -1px; }
        
        .summary-items-list { max-height: 300px; overflow-y: auto; margin-bottom: 35px; padding-right: 15px; }
        .summary-items-list::-webkit-scrollbar { width: 4px; }
        .summary-items-list::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .summary-item-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; font-weight: 800; font-size: 1rem; }
        .summary-item-thumb { width: 60px; height: 60px; border-radius: 15px; overflow: hidden; background: #1a1a1a; margin-right: 20px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.05); }
        .summary-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .item-main { display: flex; align-items: center; }
        .item-qty { color: var(--primary); margin-right: 12px; font-weight: 900; font-size: 1.1rem; }
        .item-total { font-weight: 900; color: var(--primary); }

        .price-breakdown { border-top: 2px dashed rgba(255,255,255,0.05); padding-top: 35px; }
        .price-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: 700; color: #888; font-size: 1.05rem; }
        .text-free { color: #10b981; font-weight: 900; }
        .grand-price-row { display: flex; justify-content: space-between; align-items: center; font-size: 2.5rem; font-weight: 900; margin-top: 25px; color: #fff; letter-spacing: -1px; }

        .summary-item-details { display: flex; flex-direction: column; gap: 5px; }
        .summary-qty-ctrl { display: flex; align-items: center; gap: 12px; background: #1a1a1a; padding: 4px 10px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.05); }
        .qty-btn-mini { background: none; border: none; color: var(--primary); cursor: pointer; display: flex; align-items: center; transition: 0.2s; }
        .qty-btn-mini:hover { color: #fff; transform: scale(1.2); }
        .item-qty { font-size: 0.9rem; font-weight: 900; color: #fff; }

        .empty-state-card { background: var(--bg-card); border-radius: 40px; padding: 100px 50px; border: 1px solid rgba(255,255,255,0.05); box-shadow: var(--shadow-lux); }
        .empty-state-card h2 { font-size: 2.5rem; font-weight: 900; color: #fff; margin-top: 30px; }
        .empty-state-card p { color: #888; font-size: 1.2rem; margin-top: 15px; margin-bottom: 40px; }

        .checkout-error-box { margin-top: 25px; background: rgba(255, 77, 77, 0.1); color: #ff4d4d; padding: 18px 25px; border-radius: 20px; font-size: 1rem; font-weight: 800; border: 1px solid rgba(255,77,77,0.2); text-align: center; }
        
        .min-amount-warning { 
          display: flex; align-items: center; gap: 12px; 
          background: rgba(255, 77, 77, 0.1); color: #ff4d4d; 
          padding: 15px; border-radius: 15px; font-size: 0.9rem; font-weight: 800;
          border: 1px solid rgba(255, 77, 77, 0.2);
        }
        .disabled-btn { opacity: 0.5; cursor: not-allowed !important; filter: grayscale(1); }
        .coupon-msg.success { color: #10b981; }
        .coupon-msg.error { color: #ff4d4d; }

        .coupon-grid-title { font-size: 0.9rem; font-weight: 900; color: #666; letter-spacing: 1px; margin-bottom: 15px; text-transform: uppercase; }
        .available-coupons-grid { display: flex; flex-direction: column; gap: 12px; }

        .coupon-robust-card { 
          background: #0a0a0a; border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 20px;
          display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.4s;
          position: relative; overflow: hidden;
        }
        .coupon-robust-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #333; transition: 0.3s; }
        
        .coupon-robust-card:hover:not(.locked) { transform: translateX(5px); border-color: rgba(255,126,0,0.3); }
        .coupon-robust-card.active { background: rgba(255, 126, 0, 0.05); border-color: var(--primary); }
        .coupon-robust-card.active::before { background: var(--primary); }
        .coupon-robust-card.locked { opacity: 0.5; cursor: not-allowed; border-style: dashed; }

        .robust-card-main { display: flex; align-items: center; gap: 15px; }
        .robust-icon-box { width: 40px; height: 40px; background: #1a1a1a; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #555; }
        .active .robust-icon-box { background: var(--primary); color: #000; }
        .locked .robust-icon-box { background: #111; color: #333; }

        .robust-info { display: flex; flex-direction: column; gap: 2px; }
        .robust-code { font-weight: 900; font-size: 1.1rem; color: #fff; letter-spacing: 1px; }
        .robust-discount { font-size: 0.8rem; font-weight: 800; color: var(--primary); }
        .locked .robust-discount { color: #555; }

        .status-badge { padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.5px; }
        .status-badge.active { background: var(--primary); color: #000; }
        .status-badge.use { background: #1a1a1a; color: #fff; border: 1px solid rgba(255,255,255,0.1); }
        .status-badge.missing { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; }

        .success-full-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(20px); z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .success-message-card { max-width: 550px; width: 100%; background: #111; border-radius: 45px; padding: 80px 50px; text-align: center; box-shadow: 0 50px 100px rgba(0,0,0,1); border: 1px solid rgba(255,255,255,0.05); }
        .success-icon-anim { width: 130px; height: 130px; background: rgba(255, 126, 0, 0.1); color: var(--primary); border-radius: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 40px; transform: rotate(10deg); box-shadow: 0 20px 40px var(--orange-glow); border: 1px solid rgba(255,126,0,0.2); }
        .success-message-card h2 { font-size: 2.8rem; font-weight: 900; color: #fff; margin-bottom: 25px; letter-spacing: -1px; }
        .success-message-card p { color: #aaa; font-size: 1.2rem; line-height: 1.7; margin-bottom: 50px; }
        .redirect-hint { font-size: 1rem; font-weight: 900; color: var(--primary); letter-spacing: 2px; text-transform: uppercase; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .terms-row-lux { display: flex; align-items: center; gap: 18px; margin-top: 35px; cursor: pointer; font-size: 0.95rem; color: #666; font-weight: 700; transition: 0.3s; }
        .terms-row-lux:hover { color: #fff; }
        .checkbox-lux { width: 26px; height: 26px; border: 2px solid #333; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: 0.3s; background: #111; }
        .checkbox-lux.active { background: var(--primary); border-color: var(--primary); }
        
        @media (max-width: 1024px) {
          .checkout-flex-layout { grid-template-columns: 1fr; gap: 40px; }
          .checkout-summary-column { order: -1; }
          .summary-card-lux { position: relative; top: 0; border-radius: 40px; }
          .saved-options-grid { grid-template-columns: 1fr; }
          .btn-checkout-back { position: relative; left: auto; transform: none; margin-bottom: 30px; justify-content: center; width: fit-content; margin: 0 auto 40px; }
        }

        @media (max-width: 768px) {
          .checkout-wrapper { padding: 40px 0 80px; }
          .checkout-title-main { font-size: 2.8rem; letter-spacing: -1.5px; }
          .checkout-card-lux { padding: 30px 20px; border-radius: 25px; }
          .summary-card-lux { padding: 35px 20px; border-radius: 30px; }
          .input-row-3, .input-row-2 { grid-template-columns: 1fr; gap: 15px; }
          .payment-options-grid { grid-template-columns: 1fr; gap: 15px; }
          .card-header-flex { flex-direction: column; align-items: flex-start; gap: 15px; padding-left: 15px; }
          .grand-price-row { font-size: 2rem; }
          .success-message-card { padding: 60px 25px; }
          .success-message-card h2 { font-size: 2rem; }
        }

        @media (max-width: 480px) {
          .checkout-title-main { font-size: 2.2rem; }
          .checkout-subtitle { font-size: 1rem; }
          .header-left h2 { font-size: 1.4rem; }
          .grand-price-row { font-size: 1.8rem; }
          .btn-checkout-back { width: 100%; }
        }

        .eco-track-card {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.1);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          transition: 0.3s;
        }
        .eco-track-card:hover { background: rgba(16, 185, 129, 0.1); border-color: #10b981; }
        .eco-track-card.active { border-color: #10b981; background: rgba(16, 185, 129, 0.15); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.1); }
        .eco-icon-box { width: 45px; height: 45px; background: #10b981; color: #000; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .eco-text { flex: 1; }
        .eco-title { font-weight: 900; color: #fff; font-size: 1.1rem; }
        .eco-desc { font-size: 0.85rem; color: #888; margin-top: 2px; }
        .eco-track-card.active .eco-title { color: #10b981; }
        
        .eco-toggle { width: 44px; height: 24px; background: #333; border-radius: 50px; position: relative; transition: 0.3s; }
        .eco-toggle.active { background: #10b981; }
        .toggle-dot { width: 18px; height: 18px; background: #fff; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: 0.3s; }
        .eco-toggle.active .toggle-dot { left: 23px; }
      `}</style>
    </div>
  );
};

export default Checkout;
