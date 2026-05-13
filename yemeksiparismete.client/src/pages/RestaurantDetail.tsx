import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, Star, Clock, MapPin, ShoppingCart, Plus, Minus, Info, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import * as signalR from '@microsoft/signalr';
import { useAuth } from '../context/AuthContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { addToCart, cart, incrementQuantity, decrementQuantity, totalPrice, totalItems } = useCart();
  
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  // Social Cart States
  const [groupCode, setGroupCode] = useState<string | null>(null);
  const [groupItems, setGroupItems] = useState<any[]>([]);
  const [hubConnection, setHubConnection] = useState<signalR.HubConnection | null>(null);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [hubState, setHubState] = useState<string>('Disconnected');
  const [groupCreatorId, setGroupCreatorId] = useState<string | null>(null);
  const [groupSessionId, setGroupSessionId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    
    Promise.all([
      fetch(`/api/restaurants/${id}`).then(res => {
        if (!res.ok) throw new Error('Restaurant not found');
        return res.json();
      }),
      fetch(`/api/products/restaurant/${id}`).then(res => {
        if (!res.ok) return []; // Products might be empty
        return res.json();
      })
    ])
    .then(([restaurantData, productsData]) => {
      setRestaurant(restaurantData);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error loading restaurant details:", err);
      setRestaurant(null);
      setLoading(false);
    });
  }, [id]);

  const [showAddedToast, setShowAddedToast] = useState<{name: string, qty: number, key: number} | null>(null);

  const handleAddToCart = useCallback((product: any) => {
    addToCart({ 
      ...product, 
      RestaurantId: id,
      RestaurantName: restaurant?.name ?? restaurant?.Name,
      RestaurantAddress: restaurant?.address ?? restaurant?.Address 
    });
    const pName = product.name || product.Name || 'Ürün';
    
    setShowAddedToast(prev => ({
      name: pName,
      qty: (prev?.name === pName) ? prev.qty + 1 : 1,
      key: Date.now()
    }));
    
    // Clear toast after 2.5s of INACTIVITY
    setTimeout(() => {
      setShowAddedToast(current => {
        if (current && Date.now() - current.key >= 2400) {
          return null;
        }
        return current;
      });
    }, 2500);
  }, [addToCart, restaurant, id]);

  // --- SignalR Group Order Logic ---
  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/grouporderhub", {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.on("GroupCreated", (code, sessionId, creatorId) => {
      console.log("GroupCreated:", { code, sessionId, creatorId });
      setGroupCode(code);
      setGroupSessionId(sessionId);
      setGroupCreatorId(creatorId);
      setIsJoiningGroup(false);
    });

    connection.on("SyncCart", (items, creatorId, sessionId) => {
      console.log("SyncCart:", { itemsCount: items?.length, creatorId, sessionId });
      setGroupItems(items);
      setGroupCreatorId(creatorId);
      setGroupSessionId(sessionId);
    });

    connection.on("CartUpdated", (items) => {
      setGroupItems(items);
    });

    connection.on("GroupDisbanded", (msg) => {
      alert(msg);
      setGroupCode(null);
      setGroupItems([]);
      setGroupSessionId(null);
      setGroupCreatorId(null);
    });

    connection.on("GroupOrderCompleted", (orderId) => {
      alert("Grup siparişi tamamlandı! Sipariş No: " + orderId);
      setGroupCode(null);
      setGroupItems([]);
      setGroupSessionId(null);
      setGroupCreatorId(null);
    });

    connection.on("Error", (msg) => {
      console.error("SignalR Group Error:", msg);
      alert("Hata: " + msg);
      setIsJoiningGroup(false);
    });

    connection.start()
      .then(() => {
        console.log("SignalR: Connected to GroupOrderHub");
        setHubConnection(connection);
        setHubState('Connected');
      })
      .catch(err => {
        console.error("SignalR: Connection failed: ", err);
        setHubState('Failed');
      });

    return () => {
      connection.stop();
    };
  }, [token]);

  const handleCreateGroup = async () => {
    if (hubConnection && user && hubConnection.state === signalR.HubConnectionState.Connected) {
      setIsJoiningGroup(true);
      console.log("SignalR: Creating group for restaurant", id);
      try {
        await hubConnection.invoke("CreateGroup", parseInt(id || "0"), user.id);
      } catch (err) {
        console.error("SignalR: CreateGroup failed", err);
        setIsJoiningGroup(false);
      }
    } else {
      alert("Sunucu bağlantısı bekleniyor veya kullanıcı girişi yapılmamış.");
    }
  };

  const handleJoinGroup = async () => {
    if (hubConnection && joinCodeInput && hubConnection.state === signalR.HubConnectionState.Connected) {
      setIsJoiningGroup(true);
      console.log("SignalR: Joining group", joinCodeInput);
      try {
        await hubConnection.invoke("JoinGroup", joinCodeInput);
        setGroupCode(joinCodeInput);
      } catch (err) {
        console.error("SignalR: JoinGroup failed", err);
        setIsJoiningGroup(false);
      }
    }
  };

  const addToGroup = async (product: any) => {
    if (hubConnection && groupCode && user) {
      const pName = product.name || product.Name;
      const pPrice = product.price || product.Price;
      await hubConnection.invoke("AddToGroupCart", groupCode, product.id || product.Id, pName, pPrice, user.id, user.FullName || user.name);
    }
  };

  const removeFromGroup = async (productId: number) => {
    if (hubConnection && groupCode && user) {
      await hubConnection.invoke("RemoveFromGroupCart", groupCode, productId, user.id);
    }
  };

  const handleLeaveGroup = async () => {
    if (hubConnection && groupCode && user) {
      try {
        await hubConnection.invoke("LeaveGroup", groupCode, user.id);
      } catch (err) {
        console.error("SignalR: LeaveGroup failed", err);
      }
    }
    setGroupCode(null);
    setGroupItems([]);
    setGroupSessionId(null);
    setGroupCreatorId(null);
  };

  if (loading) return (
    <div className="loader-container">
      <div className="lux-loader-light"></div>
    </div>
  );
  
  if (!restaurant) return <div className="container py-100 text-center">Restoran bulunamadı.</div>;

  return (
    <div className="restaurant-detail-wrap fade-in">
      <AnimatePresence>
        {showAddedToast && (
          <motion.div 
            key={showAddedToast.key}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="added-toast-lux"
          >
            <div className="toast-icon-circle">
              <ShoppingCart size={18} />
            </div>
            <div className="toast-text-col">
              <strong>{showAddedToast.name}</strong>
              <span>Sepete eklendi {showAddedToast.qty > 1 && <span className="toast-qty-badge">x{showAddedToast.qty}</span>}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header Banner */}
      <div className="detail-hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(${restaurant.bannerUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600'})` }}>
        <div className="container banner-flex">
          <Link to="/" className="btn-back-lux">
            <ChevronLeft size={20} />
            <span>Geri Dön</span>
          </Link>
          
          <div className="banner-info-box">
            <div className="badge-row">
              <div className="rating-pill">
                <Star size={16} fill="white" />
                <span>{Number(restaurant.rating).toFixed(1)}</span>
              </div>
              <div className="promo-pill">Açılışa Özel %20 İndirim</div>
            </div>
            <h1 className="restaurant-name-huge">{restaurant.name ?? restaurant.Name}</h1>
            <div className="meta-info-row">
              <div className="meta-tag"><Clock size={16} /> 25-35 dk</div>
              <div className="meta-tag"><MapPin size={16} /> {restaurant.address ?? restaurant.Address}</div>
              <div className="meta-tag"><Info size={16} /> Min. 150 TL</div>
            </div>
            
            {/* Social Cart Integration */}
            <div className="social-cart-trigger-box mt-30">
              <div className="hub-status-bar mb-10">
                <span className={`status-dot ${hubState.toLowerCase()}`}></span>
                <span className="status-text">
                  {hubState === 'Connected' ? 'Sunucuya Bağlı' : hubState === 'Failed' ? 'Bağlantı Hatası' : 'Bağlanıyor...'}
                </span>
              </div>
              {!groupCode ? (
                <div className="trigger-flex">
                  <button onClick={handleCreateGroup} className="btn-social-start" disabled={isJoiningGroup}>
                    <Plus size={20} />
                    {isJoiningGroup ? 'Başlatılıyor...' : 'Grup Siparişi Başlat'}
                  </button>
                  <div className="join-divider">veya</div>
                  <div className="join-input-wrap">
                    <input 
                      type="text" 
                      placeholder="Grup Kodu" 
                      maxLength={6} 
                      value={joinCodeInput} 
                      onChange={e => setJoinCodeInput(e.target.value)} 
                    />
                    <button onClick={handleJoinGroup} className="btn-join-group">Katıl</button>
                  </div>
                </div>
              ) : (
                <div className="active-group-pill">
                  <div className="group-info">
                    <span className="live-dot"></span>
                    <span className="group-label">CANLI GRUP SİPARİŞİ:</span>
                    <strong className="group-code-text">{groupCode}</strong>
                  </div>
                  <button onClick={handleLeaveGroup} className="btn-leave-group">Ayrıl</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-content-grid">
        <div className="menu-section">
          <div className="menu-sticky-header">
            <h2 className="menu-title-lux">Popüler <span className="text-primary">Ürünler</span></h2>
            <div className="menu-filter-row">
              <button className="filter-pill active">Tümü</button>
              <button className="filter-pill">Menüler</button>
              <button className="filter-pill">Yan Ürünler</button>
            </div>
          </div>

          <div className="product-grid-column">
            {products.map((product) => (
              <motion.div 
                key={product.id || product.Id}
                whileHover={{ y: -5 }}
                className="lux-product-card"
              >
                <div className="product-thumb">
                  <img src={product.imageUrl ?? product.image ?? product.ImageUrl ?? product.Image} alt={product.name ?? product.Name} />
                  <button onClick={() => handleAddToCart(product)} className="btn-add-quick">
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className="product-details">
                  <div className="product-header">
                    <h3 className="product-name">{product.name ?? product.Name}</h3>
                    <span className="product-price">{product.price ?? product.Price} TL</span>
                  </div>
                  <p className="product-description">{product.description ?? product.Description}</p>
                  
                  {(() => {
                    const cartItem = cart.find(item => String(item.ProductId) === String(product.id || product.Id));
                    const groupItem = groupCode ? groupItems.find(item => String(item.productId || item.ProductId) === String(product.id || product.Id) && (item.addedByUserId || item.AddedByUserId) === user?.id) : null;
                    
                    if (groupCode) {
                      return (
                         <div className="group-actions mt-10">
                            {groupItem ? (
                              <div className="qty-controls-lux">
                                <button onClick={() => removeFromGroup(product.id || product.Id)} className="btn-qty-minus"><Minus size={18} /></button>
                                <span className="qty-value">{groupItem.quantity || groupItem.Quantity}</span>
                                <button onClick={() => addToGroup(product)} className="btn-qty-plus"><Plus size={18} /></button>
                              </div>
                            ) : (
                              <button onClick={() => addToGroup(product)} className="btn-lux-primary w-full">
                                GRUP SEPETİNE EKLE
                              </button>
                            )}
                         </div>
                      );
                    }

                    if (cartItem) {
                      return (
                        <div className="qty-controls-lux mt-10">
                          <button onClick={() => decrementQuantity(cartItem.ProductId)} className="btn-qty-minus">
                            <Minus size={18} />
                          </button>
                          <span className="qty-value">{cartItem.Quantity}</span>
                          <button onClick={() => incrementQuantity(cartItem.ProductId)} className="btn-qty-plus">
                            <Plus size={18} />
                          </button>
                        </div>
                      );
                    }
                    return (
                      <button onClick={() => handleAddToCart(product)} className="btn-lux-primary w-full mt-10">
                        SEPETE EKLE
                      </button>
                    );
                  })()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <aside className="cart-sidebar">
          <div className="sticky-cart-card">
            <div className="cart-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <div className="cart-title-flex">
                  <ShoppingCart size={24} className="text-primary" />
                  <h3>Sepetim</h3>
                </div>
                <span className="item-count-badge">{totalItems} Ürün</span>
              </div>
              
              {cart.length > 0 && cart[0].RestaurantName && (
                <div style={{ width: '100%', padding: '12px', background: 'rgba(255,126,0,0.08)', borderRadius: '12px', border: '1px solid rgba(255,126,0,0.2)' }}>
                  <div style={{ fontWeight: '900', color: '#fff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} className="text-primary" />
                    {cart[0].RestaurantName}
                  </div>
                  <div style={{ color: '#999', fontSize: '0.8rem', marginTop: '6px', marginLeft: '24px', lineHeight: '1.4' }}>
                    {cart[0].RestaurantAddress}
                  </div>
                </div>
              )}
            </div>
            
            <div className="cart-items-scroll">
              <AnimatePresence mode="popLayout">
                {groupCode ? (
                  groupItems.length === 0 ? (
                    <div className="empty-cart-state">
                      <div className="empty-icon">🤝</div>
                      <p>Grup sepeti henüz boş. İlk ürünü sen ekle!</p>
                    </div>
                  ) : (
                    groupItems.map((item) => (
                      <motion.div 
                        key={`${item.productId}-${item.addedByUserId}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="cart-item-row group-item"
                      >
                        <div className="cart-item-info">
                          <span className="item-name">{item.productName || item.ProductName}</span>
                          <div className="added-by-tag">
                            <User size={12} /> {item.addedByUserName || item.AddedByUserName} {item.addedByUserId === user?.id && "(Sen)"}
                          </div>
                          <span className="item-price">{(item.price || item.Price) * (item.quantity || item.Quantity)} TL</span>
                        </div>
                        <div className="cart-qty-pill">
                          <button onClick={() => (item.addedByUserId === user?.id) && removeFromGroup(item.productId || item.ProductId)} style={{ opacity: item.addedByUserId === user?.id ? 1 : 0.3 }}><Minus size={12} /></button>
                          <span>{item.quantity || item.Quantity}</span>
                          <button onClick={() => (item.addedByUserId === user?.id) && addToGroup({ id: item.productId || item.ProductId, name: item.productName || item.ProductName, price: item.price || item.Price })} style={{ opacity: item.addedByUserId === user?.id ? 1 : 0.3 }}><Plus size={12} /></button>
                        </div>
                      </motion.div>
                    ))
                  )
                ) : (
                  cart.length === 0 ? (
                    <div className="empty-cart-state">
                      <div className="empty-icon">🛍️</div>
                      <p>Sepetiniz henüz boş.</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <motion.div 
                        key={item.ProductId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="cart-item-row"
                      >
                        <div className="cart-item-img">
                          <img src={item.ImageUrl} alt={item.ProductName} />
                        </div>
                        <div className="cart-item-info">
                          <span className="item-name">{item.ProductName}</span>
                          <span className="item-price">
                            {(() => {
                              let p = 0;
                              if (typeof item.Price === 'number') p = item.Price;
                              else p = parseFloat(String(item.Price || "0").replace(/\./g, '').replace(',', '.')) || 0;
                              return (p * item.Quantity).toLocaleString('tr-TR');
                            })()} TL
                          </span>
                        </div>
                        <div className="cart-qty-pill">
                          <button onClick={() => decrementQuantity(item.ProductId)}><Minus size={12} /></button>
                          <span>{item.Quantity}</span>
                          <button onClick={() => incrementQuantity(item.ProductId)}><Plus size={12} /></button>
                        </div>
                      </motion.div>
                    ))
                  )
                )}
              </AnimatePresence>
            </div>

            {((!groupCode && cart.length > 0) || (groupCode && groupItems.length > 0)) && (
              <div className="cart-footer-summary">
                <div className="summary-row">
                  <span>Ara Toplam</span>
                  <span>
                    {groupCode 
                      ? groupItems.reduce((acc, curr) => acc + (curr.price || curr.Price) * (curr.quantity || curr.Quantity), 0).toLocaleString('tr-TR')
                      : totalPrice
                    } TL
                  </span>
                </div>
                <div className="summary-row total-grand">
                  <span>Toplam</span>
                  <span>
                    {groupCode 
                      ? groupItems.reduce((acc, curr) => acc + (curr.price || curr.Price) * (curr.quantity || curr.Quantity), 0).toLocaleString('tr-TR')
                      : totalPrice
                    } TL
                  </span>
                </div>
                 <Link 
                   to={(!groupCode || groupSessionId) ? `/checkout${groupSessionId ? `?sessionId=${groupSessionId}` : ''}` : "#"}
                   className="btn-lux-primary w-full mt-20"
                 >
                   ÖDEME ADIMINA GEÇ
                 </Link>
                 {groupCode && <p className="text-center mt-10 text-muted" style={{ fontSize: '0.8rem' }}>Grup siparişinde herhangi bir üye ödemeyi tamamlayabilir.</p>}
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        .restaurant-detail-wrap { background: var(--bg-main); min-height: 100vh; position: relative; }
        .loader-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; }
        
        .detail-hero-banner { 
          height: 550px; 
          background-size: cover; 
          background-position: center; 
          display: flex; 
          align-items: flex-end; 
          padding-bottom: 100px; 
          position: relative; 
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .detail-hero-banner::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 100%);
        }
        .btn-back-lux { 
          position: absolute; top: 40px; left: 40px; 
          display: flex; align-items: center; gap: 10px; 
          background: rgba(0,0,0,0.6); 
          backdrop-filter: blur(15px); 
          padding: 12px 25px; 
          border-radius: 50px; 
          color: #fff; 
          font-weight: 900; 
          text-decoration: none; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          z-index: 20;
          border: 1px solid rgba(255,255,255,0.1);
          transition: 0.3s;
        }
        .btn-back-lux:hover { background: var(--primary); color: #000; transform: translateX(-5px); }

        .banner-info-box { width: 100%; color: white; position: relative; z-index: 10; }
        .restaurant-name-huge { font-size: 5.5rem; font-weight: 900; letter-spacing: -4px; margin: 20px 0; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .badge-row { display: flex; gap: 15px; align-items: center; }
        .rating-pill { background: var(--primary); color: #000; padding: 10px 20px; border-radius: 50px; display: flex; align-items: center; gap: 10px; font-weight: 900; box-shadow: 0 10px 20px var(--orange-glow); }
        .promo-pill { background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); padding: 10px 20px; border-radius: 50px; font-weight: 800; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.1); }
        .meta-info-row { display: flex; gap: 40px; font-weight: 800; font-size: 1.1rem; color: #ccc; }
        .meta-tag { display: flex; align-items: center; gap: 10px; }
        .meta-tag svg { color: var(--primary); }

        .detail-content-grid { 
          display: grid; 
          grid-template-columns: 1fr 420px; 
          gap: 60px; 
          padding-top: 80px; 
          padding-bottom: 120px;
        }

        .menu-sticky-header { 
          position: sticky; top: 100px; 
          background: var(--bg-main); 
          z-index: 10; 
          padding: 20px 0 40px;
        }
        .menu-title-lux { font-size: 3rem; font-weight: 900; letter-spacing: -2px; color: #fff; margin-bottom: 25px; }
        .menu-filter-row { display: flex; gap: 15px; }
        .filter-pill { 
          background: var(--bg-card); border: 1px solid rgba(255,255,255,0.05); 
          padding: 12px 28px; border-radius: 50px; 
          font-weight: 900; font-size: 0.9rem; color: #fff;
          cursor: pointer; transition: 0.4s;
          box-shadow: var(--shadow-lux);
        }
        .filter-pill.active { background: var(--primary); color: #000; border-color: var(--primary); box-shadow: 0 10px 20px var(--orange-glow); }

        .product-grid-column { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 35px; }
        .lux-product-card { 
          background: var(--bg-card); border-radius: 30px; 
          overflow: hidden; border: 1px solid rgba(255,255,255,0.05); 
          box-shadow: var(--shadow-lux); transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .lux-product-card:hover { transform: translateY(-10px); border-color: var(--primary); box-shadow: var(--shadow-hover); }
        .product-thumb { height: 220px; position: relative; overflow: hidden; }
        .product-thumb img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s; }
        .lux-product-card:hover .product-thumb img { transform: scale(1.1); }
        .btn-add-quick { 
          position: absolute; bottom: 20px; right: 20px; 
          background: var(--primary); color: #000; 
          width: 50px; height: 50px; border-radius: 18px; 
          display: flex; align-items: center; justify-content: center; 
          border: none; cursor: pointer; box-shadow: 0 10px 20px var(--orange-glow); 
          transition: 0.3s;
        }
        .btn-add-quick:hover { transform: scale(1.1) rotate(90deg); background: #fff; }

        .product-details { padding: 25px; }
        .product-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .product-name { font-size: 1.4rem; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
        .product-price { font-weight: 900; color: var(--primary); font-size: 1.3rem; text-shadow: 0 0 10px var(--orange-glow); }
        .product-description { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; height: 3.2em; overflow: hidden; margin-bottom: 25px; }

        .sticky-cart-card { 
          position: sticky; top: 120px; 
          background: #111; border-radius: 35px; 
          padding: 35px; border: 1px solid rgba(255,255,255,0.05); 
          box-shadow: 0 30px 60px rgba(0,0,0,0.5); 
          border-top: 4px solid var(--primary);
        }
        .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 25px; }
        .cart-title-flex { display: flex; align-items: center; gap: 15px; }
        .cart-title-flex h3 { font-size: 1.8rem; font-weight: 900; color: #fff; }
        .item-count-badge { background: var(--accent); color: var(--primary); padding: 8px 18px; border-radius: 50px; font-size: 0.8rem; font-weight: 900; border: 1px solid rgba(255,126,0,0.2); }

        .cart-items-scroll { max-height: 450px; overflow-y: auto; padding-right: 15px; }
        .cart-items-scroll::-webkit-scrollbar { width: 4px; }
        .cart-items-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }

        .cart-item-row { display: flex; gap: 20px; align-items: center; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
        .cart-item-img { width: 60px; height: 60px; border-radius: 15px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.05); }
        .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .cart-item-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .cart-item-info .item-name { font-weight: 800; font-size: 1rem; color: #fff; }
        .cart-item-info .item-price { font-weight: 900; font-size: 0.95rem; color: var(--primary); }

        .cart-qty-pill { 
          display: flex; align-items: center; gap: 15px; 
          background: #1a1a1a; padding: 8px 14px; border-radius: 50px; 
          font-weight: 900; font-size: 0.9rem; color: #fff;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .cart-qty-pill button { background: none; border: none; cursor: pointer; color: var(--primary); display: flex; align-items: center; transition: 0.2s; }
        .cart-qty-pill button:hover { transform: scale(1.3); color: #fff; }

        .cart-footer-summary { margin-top: 35px; padding-top: 35px; border-top: 1px solid rgba(255,255,255,0.05); }
        .summary-row { display: flex; justify-content: space-between; color: #888; font-weight: 700; margin-bottom: 12px; }
        .total-grand { color: #fff; font-weight: 900; font-size: 2.2rem; margin-top: 20px; letter-spacing: -1px; }

        .added-toast-lux { 
          position: fixed; top: 50%; left: 50%; 
          transform: translate(-50%, -50%) !important;
          background: var(--primary); color: #000; 
          padding: 15px 35px; border-radius: 50px; 
          display: flex; align-items: center; gap: 15px; 
          box-shadow: 0 20px 40px var(--orange-glow); 
          z-index: 9999; font-weight: 900; font-size: 1rem;
          border-top: 2px solid rgba(255,255,255,0.3);
        }

        @media (max-width: 1024px) {
          .detail-hero-banner { height: 400px; padding-bottom: 60px; }
          .restaurant-name-huge { font-size: 3rem; letter-spacing: -2px; }
          .detail-content-grid { grid-template-columns: 1fr; gap: 40px; padding-bottom: 250px; }
          .cart-sidebar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; padding: 0; }
          .sticky-cart-card { border-radius: 40px 40px 0 0; padding: 25px; box-shadow: 0 -20px 60px rgba(0,0,0,0.8); max-height: 70vh; display: flex; flex-direction: column; border-top: 6px solid var(--primary); }
          .cart-items-scroll { max-height: 250px; }
          .btn-back-lux { top: 20px; left: 20px; padding: 10px 20px; font-size: 0.9rem; }
        }

        @media (max-width: 768px) {
          .detail-hero-banner { height: 350px; }
          .product-grid-column { grid-template-columns: 1fr; gap: 20px; }
          .meta-info-row { flex-wrap: wrap; gap: 15px; }
          .restaurant-name-huge { font-size: 2.2rem; }
          .menu-title-lux { font-size: 2rem; }
          .menu-filter-row { overflow-x: auto; padding-bottom: 10px; justify-content: flex-start; }
          .filter-pill { white-space: nowrap; }
          .sticky-cart-card { padding: 20px; }
          .total-grand { font-size: 1.8rem; }
        }

        @media (max-width: 480px) {
          .detail-hero-banner { height: 300px; }
          .restaurant-name-huge { font-size: 1.8rem; letter-spacing: -1px; }
          .meta-tag { font-size: 0.8rem; }
          .lux-product-card { flex-direction: column; }
          .product-thumb { width: 100%; height: 200px; }
        }

        .social-cart-trigger-box { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.1); }
        .trigger-flex { display: flex; align-items: center; gap: 20px; }
        .btn-social-start { background: var(--primary); color: #000; border: none; padding: 12px 25px; border-radius: 15px; font-weight: 900; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s; }
        .btn-social-start:hover { transform: translateY(-3px); box-shadow: 0 10px 20px var(--orange-glow); }
        .join-divider { font-weight: 900; color: #555; font-size: 0.8rem; text-transform: uppercase; }
        .join-input-wrap { display: flex; background: #000; border-radius: 15px; padding: 5px; border: 1px solid #333; }
        .join-input-wrap input { background: none; border: none; color: #fff; padding: 5px 15px; width: 100px; font-weight: 900; outline: none; }
        .btn-join-group { background: #333; color: #fff; border: none; padding: 8px 15px; border-radius: 10px; font-weight: 800; cursor: pointer; }
        .btn-join-group:hover { background: #444; }

        .active-group-pill { display: flex; justify-content: space-between; align-items: center; background: #000; padding: 15px 25px; border-radius: 20px; border: 2px solid var(--primary); box-shadow: 0 0 20px rgba(255,126,0,0.15); }
        .group-info { display: flex; align-items: center; gap: 15px; }
        .live-dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: blink 1.5s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .group-label { font-weight: 900; font-size: 0.8rem; color: #888; }
        .group-code-text { font-size: 1.4rem; color: var(--primary); letter-spacing: 2px; }
        .btn-leave-group { background: rgba(255,255,255,0.05); color: #888; border: 1px solid #333; padding: 5px 15px; border-radius: 10px; font-weight: 800; cursor: pointer; }
        .btn-leave-group:hover { background: #ff4d4d; color: #fff; border-color: #ff4d4d; }

        .added-by-tag { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: #10b981; font-weight: 800; margin-top: 2px; }
        .cart-item-row.group-item { padding: 15px 0; border-style: dashed; }

        .hub-status-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 15px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #555; }
        .status-dot.connected { background: #10b981; box-shadow: 0 0 10px #10b981; }
        .status-dot.failed { background: #ff4d4d; }
        .status-text { font-size: 0.7rem; font-weight: 900; color: #666; text-transform: uppercase; letter-spacing: 1px; }
      `}</style>
    </div>
  );
};

export default RestaurantDetail;
