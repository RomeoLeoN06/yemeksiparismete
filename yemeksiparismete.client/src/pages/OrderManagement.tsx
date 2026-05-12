import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, MapPin, CreditCard, RefreshCw, User, Bike, PhoneCall, Mail, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as signalR from '@microsoft/signalr';

const getStatusText = (status: string) => {
  switch (status) {
    case 'preparing': return 'Hazırlanıyor';
    case 'on_the_way': return 'Yolda';
    case 'delivered': return 'Teslim Edildi';
    case 'cancelled':
    case 'canceled': return 'İptal Edildi';
    default: return status;
  }
};

const OrderManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'customers' | 'couriers'
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/direct-orders?t=${new Date().getTime()}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setError('');
      } else {
        setError(`Hata: ${response.status}`);
      }
    } catch (err) {
      setError('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (orderId: number, newStatus: string) => {
    if (!orderId) return;
    try {
      const url = `/api/durum-guncelle/${orderId}/${newStatus}`;
      const response = await fetch(url);

      if (response.ok) {
        setOrders(prev => prev.map(o => (o.id ?? o.Id) === orderId ? { ...o, status: newStatus, Status: newStatus } : o));
      } else {
        console.error(`Status update failed. ID: ${orderId}, URL: ${url}, Status: ${response.status}`);
        alert(`Hata: ${response.status} | Yol: ${url}`);
      }
    } catch (err) {
      console.error(`Network error updating status. ID: ${orderId}, URL: /api/durum-guncelle/${orderId}/${newStatus}`, err);
      alert('Bağlantı hatası: Sipariş durumu güncellenemedi.');
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/direct-customers?t=${new Date().getTime()}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Müşteriler çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCouriers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/courier/applications?t=${new Date().getTime()}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setCouriers(data || []);
      }
    } catch (err) {
      console.error("Kurye başvuruları çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'customers') fetchCustomers();
    else fetchCouriers();
  }, [activeTab, fetchOrders, fetchCustomers, fetchCouriers]);

  const handleRepairData = useCallback(async () => {
    if (!window.confirm("Eksik telefon numaralarını kullanıcı profillerinden çekerek tamamlamak istiyor musunuz?")) return;
    try {
      const response = await fetch('/api/migration/fix-phones');
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        refreshData();
      } else {
        alert(`Hata: ${data.error}`);
      }
    } catch (err) {
      alert("Bağlantı hatası.");
    }
  }, [refreshData]);

  const updateCourierStatus = useCallback(async (appId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/courier/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStatus)
      });
      if (response.ok) {
        setCouriers(prev => prev.map(c => (c.id ?? c.Id) === appId ? { ...c, status: newStatus, Status: newStatus } : c));
      }
    } catch (err) {
      console.error("Kurye durumu güncellenemedi", err);
    }
  }, []);



  useEffect(() => {
    refreshData();
    
    // SignalR Bağlantısı
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/orderhub")
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        connection.on("ReceiveNewOrder", () => {
          if (activeTab === 'orders') fetchOrders();
        });
        connection.on("OrderStatusUpdated", (data: any) => {
          if (activeTab === 'orders') {
            setOrders(prev => prev.map(o => (o.id === data.id || o.Id === data.id) ? { ...o, status: data.status, Status: data.status } : o));
          }
        });
      })
      .catch(err => console.error("SignalR Connection Error: ", err));

    return () => { 
      connection.stop();
    };
  }, [refreshData, activeTab, fetchOrders]);



  return (
    <div className="admin-manage-page">
      <div className="admin-sidebar-nav">
        <div className="admin-nav-header">
          <img src="/logo.png" alt="Logo" className="admin-mini-logo" />
          <span>YÖNETİM</span>
        </div>
        <div className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <Package size={20} /> Canlı Siparişler
        </div>
        <div className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
          <User size={20} /> Müşteriler
        </div>
        <div className={`admin-nav-item ${activeTab === 'couriers' ? 'active' : ''}`} onClick={() => setActiveTab('couriers')}>
          <Bike size={20} /> Kurye Yönetimi
        </div>
      </div>

      <div className="admin-main-content">
        <header className="admin-top-bar">
          <div className="top-left">
            <h2>
              {activeTab === 'orders' ? 'Canlı Sipariş' : activeTab === 'customers' ? 'Müşteri' : 'Kurye'}
              <span className="text-primary">
                {activeTab === 'orders' ? ' Takibi' : activeTab === 'customers' ? ' Yönetimi' : ' Başvuruları'}
              </span>
            </h2>
            <p>
              {activeTab === 'orders' ? 'Veritabanındaki tüm şubelerin sipariş akışı' :
                activeTab === 'customers' ? 'Sistemde kayıtlı olan ve sipariş veren tüm müşteriler' :
                  'Sisteme yapılan yeni kurye başvuruları ve durumları'}
            </p>
          </div>
          <div className="top-right">
            <button onClick={handleRepairData} className="refresh-lux-btn" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', boxShadow: 'none' }}>
              <Shield size={18} />
              Verileri Onar
            </button>
            <button onClick={refreshData} className="refresh-lux-btn">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Güncelle
            </button>
            <div className="admin-profile-pill">
              <div className="pill-avatar">{user?.name?.charAt(0)}</div>
              <span>{user?.name}</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="error-alert-box" style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,77,77,0.2)' }}>
            {error}
          </div>
        )}

        <div className="order-table-container">
          {activeTab === 'orders' ? (
            <>
              <div className="order-table-header">
                <div className="col-id">Sipariş</div>
                <div className="col-customer">Müşteri & Adres</div>
                <div className="col-items">Ürünler</div>
                <div className="col-total">Tutar</div>
                <div className="col-date">Tarih</div>
                <div className="col-status">Durum Yönetimi</div>
              </div>

              <AnimatePresence>
                {orders.map((order) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={order.id ?? order.Id}
                    className={`order-row-lux ${order.status ?? order.Status}`}
                  >
                    <div className="col-id">
                      <span className="order-number">#{order.id ?? order.Id}</span>
                      <div className="payment-tag">
                        <CreditCard size={12} /> {(order.paymentMethod ?? order.PaymentMethod) === 'credit_card' ? 'KART' : 'NAKİT'}
                      </div>
                    </div>

                    <div className="col-customer">
                      <div className="cust-name">{order.customerName}</div>
                      <div className="cust-addr">
                        <MapPin size={12} /> {order.deliveryAddress}
                      </div>
                      {order.customerPhone && (
                        <div className="cust-phone" style={{ marginTop: 4, fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>
                          <PhoneCall size={12} style={{ marginRight: 4 }} /> {order.customerPhone}
                        </div>
                      )}
                      {(order.note || order.Note) && (
                        <div className="order-note-pill" style={{ marginTop: 8, fontSize: '0.75rem', background: 'rgba(255,126,0,0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,126,0,0.2)', width: 'fit-content' }}>
                          NOT: {order.note || order.Note}
                        </div>
                      )}
                    </div>

                    <div className="col-items">
                      <div className="items-summary">
                        {(order.items ?? order.Items ?? []).map((item: any, i: number) => (
                          <span key={i} className="item-badge">
                            {(item.quantity ?? item.Quantity)}x {(item.productName ?? item.ProductName)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="col-total" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span className="price-tag">{order.totalAmount} TL</span>
                      {(order.discountAmount > 0 || order.DiscountAmount > 0) && (
                        <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 900, marginTop: 4, textAlign: 'right' }}>
                          KUPON: {order.couponCode || order.CouponCode}<br />
                          -₺{order.discountAmount || order.DiscountAmount}
                        </div>
                      )}
                    </div>

                    <div className="col-date">
                      <div className="date-box">
                        <Clock size={12} />
                        {new Date(order.orderDate ?? order.OrderDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="col-status">
                      <div className="status-toggle-container">
                        {['preparing', 'on_the_way', 'delivered', 'cancelled'].map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id ?? order.Id, s)}
                            className={`toggle-btn ${(order.status ?? order.Status) === s ? 'active' : ''} ${(s === 'canceled' || s === 'cancelled') ? 'cancel-btn' : ''}`}
                          >
                            {(order.status ?? order.Status) === s && (
                              <motion.div
                                layoutId={`active-bg-${order.id ?? order.Id}`}
                                className="active-bg-glow"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <span className="btn-text">{getStatusText(s)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          ) : activeTab === 'customers' ? (
            <>
              <div className="order-table-header">
                <div className="col-c-id">ID</div>
                <div className="col-c-name">Müşteri Adı</div>
                <div className="col-c-phone">İletişim</div>
                <div className="col-c-addr">Kayıtlı Adres</div>
                <div className="col-c-count">Sipariş Sayısı</div>
                <div className="col-c-total">Toplam Harcama</div>
                <div className="col-c-date">Son Sipariş</div>
              </div>

              <AnimatePresence>
                {customers.map((customer, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={index}
                    className="order-row-lux"
                  >
                    <div className="col-c-id">
                      <span style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '1px' }}>
                        {customer.userId ? `#${customer.userId.substring(0, 6).toUpperCase()}` : 'MİSAFİR'}
                      </span>
                    </div>

                    <div className="col-c-name">
                      <div className="cust-name"><User size={14} style={{ display: 'inline', marginRight: 5 }} /> {customer.customerName}</div>
                    </div>

                    <div className="col-c-phone">
                      <div className="payment-tag" style={{ background: 'rgba(255,255,255,0.1)' }}>{customer.customerPhone}</div>
                    </div>

                    <div className="col-c-addr">
                      <div className="cust-addr">
                        <MapPin size={12} style={{ display: 'inline', marginRight: 5 }} /> {customer.deliveryAddress}
                      </div>
                    </div>

                    <div className="col-c-count">
                      <span className="item-badge" style={{ background: 'var(--primary)', color: '#000', fontWeight: 'bold' }}>{customer.totalOrders} Adet</span>
                    </div>

                    <div className="col-c-total">
                      {customer.totalSpent} TL
                    </div>

                    <div className="col-c-date">
                      <div className="date-box">
                        <Clock size={12} style={{ display: 'inline', marginRight: 5 }} />
                        {new Date(customer.lastOrderDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          ) : activeTab === 'couriers' ? (
            <>
              <div className="order-table-header">
                <div className="col-cour-id">ID</div>
                <div className="col-cour-name">Aday & İletişim</div>
                <div className="col-cour-vehicle">Araç & Ehliyet</div>
                <div className="col-cour-loc">Lokasyon</div>
                <div className="col-cour-date">Başvuru Tarihi</div>
                <div className="col-cour-status">Durum Yönetimi</div>
              </div>

              <AnimatePresence>
                {couriers.map((courier) => {
                  const cId = courier.id ?? courier.Id;
                  const cStatus = (courier.status ?? courier.Status)?.toLowerCase();
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      key={cId}
                      className={`order-row-lux ${cStatus}`}
                    >
                      <div className="col-cour-id">
                        <span className="order-number">#{cId}</span>
                      </div>

                      <div className="col-cour-name">
                        <div className="cust-name">{courier.fullName ?? courier.FullName}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                          <a href={`tel:${courier.phoneNumber ?? courier.PhoneNumber}`} style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#aaa'}>
                            <PhoneCall size={14} style={{ marginRight: 6, color: 'var(--primary)' }} /> {courier.phoneNumber ?? courier.PhoneNumber}
                          </a>
                          <a href={`mailto:${(courier.email ?? courier.Email)?.replace(/^E-posta\s*/i, '')}`} style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#aaa'}>
                            <Mail size={14} style={{ marginRight: 6, color: 'var(--primary)' }} /> {(courier.email ?? courier.Email)?.replace(/^E-posta\s*/i, '')}
                          </a>
                        </div>
                      </div>

                      <div className="col-cour-vehicle">
                        <div className="item-badge" style={{ background: 'rgba(255,126,0,0.1)', color: 'var(--primary)', border: '1px solid rgba(255,126,0,0.3)' }}>
                          <Bike size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                          {courier.vehicleType ?? courier.VehicleType}
                        </div>
                        <div className="item-badge" style={{ marginTop: '5px' }}>Ehliyet: {courier.driverLicenseType ?? courier.DriverLicenseType}</div>
                      </div>

                      <div className="col-cour-loc">
                        <div className="cust-addr">
                          <MapPin size={12} style={{ display: 'inline', marginRight: 5 }} /> {courier.city ?? courier.City}, {courier.district ?? courier.District}
                        </div>
                      </div>

                      <div className="col-cour-date">
                        <div className="date-box">
                          <Clock size={12} style={{ display: 'inline', marginRight: 5 }} />
                          {new Date(courier.applicationDate ?? courier.ApplicationDate).toLocaleDateString('tr-TR')}
                        </div>
                      </div>

                      <div className="col-cour-status">
                        <div className="status-toggle-container">
                          {['Pending', 'Approved', 'Rejected'].map(status => (
                            <button
                              key={status}
                              onClick={() => updateCourierStatus(cId, status)}
                              className={`toggle-btn ${status === 'Rejected' ? 'cancel-btn' : ''} ${cStatus === status.toLowerCase() ? 'active' : ''}`}
                            >
                              {cStatus === status.toLowerCase() && <motion.div layoutId={`bg-cour-${cId}`} className="active-bg-glow" />}
                              {status === 'Pending' ? 'Bekliyor' : status === 'Approved' ? 'Onayla' : 'Reddet'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </>
          ) : null}
        </div>
      </div>

      <style>{`
        .admin-manage-page { display: flex; background: #050505; min-height: 100vh; color: #fff; font-family: 'Outfit', sans-serif; }
        
        .admin-sidebar-nav { width: 280px; background: #0a0a0a; border-right: 1px solid rgba(255,255,255,0.05); padding: 30px; display: flex; flex-direction: column; gap: 10px; }
        .admin-nav-header { display: flex; align-items: center; gap: 15px; margin-bottom: 50px; font-weight: 900; letter-spacing: 2px; color: var(--primary); }
        .admin-mini-logo { height: 40px; filter: drop-shadow(0 0 10px var(--primary)); }
        .admin-nav-item { display: flex; align-items: center; gap: 15px; padding: 15px 20px; border-radius: 12px; font-weight: 700; color: #444; cursor: pointer; transition: 0.3s; }
        .admin-nav-item.active { background: rgba(255,126,0,0.1); color: var(--primary); box-shadow: inset 0 0 20px rgba(255,126,0,0.05); }

        .admin-main-content { flex: 1; padding: 40px; background: radial-gradient(circle at top right, rgba(255,126,0,0.05), transparent); }
        .admin-top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .admin-top-bar h2 { font-size: 2.5rem; font-weight: 900; letter-spacing: -2px; }
        
        .status-toggle-container { display: flex; background: #111; padding: 6px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); gap: 5px; position: relative; }
        .toggle-btn { position: relative; border: none; background: transparent; padding: 10px 20px; border-radius: 12px; cursor: pointer; color: #555; font-weight: 800; font-size: 0.85rem; transition: 0.3s; z-index: 1; }
        .toggle-btn.active { color: #fff; }
        .toggle-btn.cancel-btn.active { color: #ff4d4d; }
        .active-bg-glow { position: absolute; inset: 0; background: var(--primary); border-radius: 10px; z-index: -1; box-shadow: 0 5px 20px rgba(255,126,0,0.4); }
        .toggle-btn.cancel-btn .active-bg-glow { background: rgba(255, 50, 50, 0.1); box-shadow: 0 5px 20px rgba(255, 50, 50, 0.4); border: 1px solid rgba(255,50,50,0.2); }
        
        .order-table-container { background: rgba(15,15,15,0.8); backdrop-filter: blur(20px); border-radius: 30px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .order-table-header { display: flex; padding: 25px 40px; background: rgba(255,255,255,0.02); color: #444; font-weight: 900; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; }
        
        .order-row-lux { display: flex; align-items: center; padding: 30px 40px; border-bottom: 1px solid rgba(255,255,255,0.03); }
        .col-id { width: 120px; }
        .order-number { font-size: 1.4rem; font-weight: 900; color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.1); }
        
        .col-customer { flex: 1.5; }
        .cust-name { font-size: 1.2rem; font-weight: 800; color: var(--primary); margin-bottom: 5px; }
        .cust-addr { font-size: 0.9rem; color: #666; font-weight: 600; }

        .col-items { flex: 2; }
        .item-badge { background: rgba(255,255,255,0.03); padding: 6px 15px; border-radius: 10px; font-size: 0.8rem; font-weight: 800; color: #aaa; border: 1px solid rgba(255,255,255,0.05); margin: 3px; display: inline-block; }

        .col-total { width: 150px; text-align: right; font-size: 1.6rem; font-weight: 900; color: #fff; }
        .col-status { flex: 2; display: flex; justify-content: flex-end; }
        
        .col-c-id { width: 80px; }
        .col-c-name { flex: 1.5; }
        .col-c-phone { flex: 1; }
        .col-c-addr { flex: 2.5; padding-right: 20px; }
        .col-c-count { width: 130px; text-align: center; }
        .col-c-total { width: 150px; text-align: right; font-size: 1.4rem; font-weight: 900; color: #fff; }
        .col-c-date { width: 130px; display: flex; justify-content: flex-end; }
        
        .col-cour-id { width: 80px; }
        .col-cour-name { flex: 2; }
        .col-cour-vehicle { flex: 1.5; }
        .col-cour-loc { flex: 1.5; }
        .col-cour-date { width: 130px; }
        .col-cour-status { flex: 2; display: flex; justify-content: flex-end; }

        .refresh-lux-btn { background: var(--primary); color: #000; border: none; padding: 12px 25px; border-radius: 50px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.4s; box-shadow: 0 10px 30px rgba(255,126,0,0.3); }
        .refresh-lux-btn:hover { transform: scale(1.05); box-shadow: 0 15px 40px rgba(255,126,0,0.5); }
      `}</style>
    </div>
  );
};

export default OrderManagement;
