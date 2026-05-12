import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Package, CheckCircle, XCircle, CreditCard, 
  Power, MapPin, Phone, TrendingUp, AlertCircle 
} from 'lucide-react';

interface Order {
  id: number;
  customerName: string;
  deliveryAddress: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  customerPhone: string;
}

interface Stats {
  totalOrders: number;
  deliveredCount: number;
  cancelledCount: number;
  totalEarnings: number;
  todayEarnings: number;
  iban: string;
  isActive: boolean;
}

const CourierPanel = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [iban, setIban] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/courier/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setIban(data.iban || '');
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  }, [token]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/courier/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally {
      // Loading state removed
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchOrders();
    }
  }, [token, fetchStats, fetchOrders]);

  const updateProfile = async (newActiveStatus: boolean) => {
    // IBAN Doğrulaması
    const cleanIban = iban.replace(/\s/g, ''); // Boşlukları temizle
    const ibanRegex = /^TR\d{24}$/;

    if (!ibanRegex.test(cleanIban)) {
      setMessage({ text: 'Geçersiz IBAN! TR ile başlayan ve 24 rakamdan oluşan (Toplam 26 hane) bir IBAN giriniz.', type: 'error' });
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch('/api/courier/update-profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ iban: cleanIban, isActive: newActiveStatus })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profil güncellendi.' });
        fetchStats();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Güncelleme hatası.' });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`/api/courier/update-order-status/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(status)
      });
      if (res.ok) {
        fetchOrders();
        fetchStats();
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  if (!user || user.role !== 'courier') {
    return (
      <div className="courier-unauthorized">
        <div className="container text-center py-100">
          <AlertCircle size={60} className="text-primary mb-20" />
          <h2>Erişim Reddedildi</h2>
          <p>Bu sayfayı görüntülemek için kurye hesabı olmanız gerekmektedir.</p>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  return (
    <div className="courier-panel-lux">
      <div className="container">
        
        {/* Header Section */}
        <header className="courier-header">
          <div className="header-left">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="panel-title"
            >
              Kurye Paneli <span className="hello-text">Hoş geldin, {user.FullName || user.name}!</span>
            </motion.h1>
          </div>
          <div className="header-right">
            <div className={`status-toggle ${stats?.isActive ? 'active' : 'inactive'}`} onClick={() => updateProfile(!stats?.isActive)}>
              <Power size={18} />
              <span>{stats?.isActive ? 'Çalışıyor' : 'Molada'}</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid-lux">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card gold-glow">
            <div className="stat-icon-wrap"><Wallet size={28} /></div>
            <div className="stat-info">
              <span className="stat-label">Toplam Kazanç</span>
              <h2 className="stat-value">{(stats?.totalEarnings || 0).toLocaleString('tr-TR')} TL</h2>
              <div className="stat-trend-chip">
                <TrendingUp size={14} /> 
                <span>+{(stats?.todayEarnings || 0).toLocaleString('tr-TR')} bugün</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card blue-glow">
            <div className="stat-icon-wrap"><Package size={28} /></div>
            <div className="stat-info">
              <span className="stat-label">Teslim Edilen</span>
              <h2 className="stat-value">{stats?.deliveredCount || 0}</h2>
              <span className="stat-sub-text">/ {stats?.totalOrders || 0} Sipariş</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card glass-card">
            <div className="stat-icon-wrap"><CreditCard size={28} /></div>
            <div className="iban-section">
              <span className="stat-label">IBAN Ayarları</span>
              <div className="iban-input-group">
                <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="TR00..." className="iban-input-lux" />
                <button onClick={() => updateProfile(stats?.isActive || false)} className="iban-btn-lux">
                  {isUpdating ? '...' : 'Güncelle'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`panel-message ${message.type}`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="panel-content-layout">
          {/* Active Orders Section */}
          <section className="active-orders-section">
            <div className="section-header">
              <h3 className="section-title">Aktif Görevler</h3>
              <span className="badge-count">{activeOrders.length}</span>
            </div>

            <div className="orders-list">
              <AnimatePresence mode="popLayout">
                {activeOrders.map(order => (
                  <motion.div 
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="order-card-lux active-task"
                  >
                    <div className="order-main-info">
                      <div className="order-id-tag">#{order.id}</div>
                      <div className="customer-info">
                        <h4>{order.customerName}</h4>
                        <div className="info-row"><MapPin size={14} /> {order.deliveryAddress}</div>
                        <div className="info-row"><Phone size={14} /> {order.customerPhone}</div>
                      </div>
                    </div>
                    <div className="order-footer">
                      <div className="order-amounts">
                        <div className="total-amount-label">Sipariş Tutarı: {order.totalAmount} TL</div>
                        <div className="courier-profit-tag">Kazancınız: {(order.totalAmount * 0.1).toFixed(2)} TL</div>
                      </div>
                      <div className="action-buttons">
                        <button 
                          className="btn-status delivered"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                        >
                          <CheckCircle size={18} /> Teslim Ettim
                        </button>
                        <button 
                          className="btn-status cancelled"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        >
                          <XCircle size={18} /> İptal
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {activeOrders.length === 0 && (
                <div className="empty-state">
                  <Package size={40} />
                  <p>Şu an aktif görev bulunmuyor. Hazır olduğunda buradan göreceksin.</p>
                </div>
              )}
            </div>
          </section>

          {/* Past Orders Section */}
          <aside className="past-orders-aside">
            <div className="section-header">
              <h3 className="section-title">Geçmiş Siparişler</h3>
            </div>
            <div className="past-list">
              {pastOrders.length === 0 ? (
                <div className="empty-state-mini">Geçmiş sipariş bulunmuyor.</div>
              ) : (
                pastOrders.slice(0, 20).map(order => {
                  const isCancelled = order.status === 'cancelled' || order.status === 'canceled';
                  return (
                    <div key={order.id} className={`past-order-item ${isCancelled ? 'cancelled-row' : ''}`}>
                      <div className="past-meta">
                        <span className="past-id">#{order.id}</span>
                        <span className="past-date">{new Date(order.orderDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="past-details">
                        <div className="past-amounts">
                          <span className="past-total">{order.totalAmount} TL</span>
                          {!isCancelled && <span className="past-profit">+{ (order.totalAmount * 0.1).toFixed(2) } TL</span>}
                          {isCancelled && <span className="past-profit-cancelled">0.00 TL</span>}
                        </div>
                        <span className={`past-status ${order.status}`}>
                          {isCancelled ? 'İptal Edildi' : 'Teslim Edildi'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </div>

      </div>

      <style>{`
        .courier-panel-lux { background: #000; min-height: 100vh; padding: 40px 0; color: #fff; background-image: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000 70%); }
        .container { max-width: 1300px; margin: 0 auto; padding: 0 20px; }
        .courier-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; }
        .panel-title { font-size: 3rem; font-weight: 900; letter-spacing: -3px; }
        .hello-text { display: block; font-size: 1.1rem; color: #666; letter-spacing: 0; font-weight: 600; margin-top: 5px; }
        
        .status-toggle { display: flex; align-items: center; gap: 12px; padding: 12px 25px; border-radius: 50px; cursor: pointer; transition: 0.4s; font-weight: 800; border: 1px solid rgba(255,255,255,0.05); background: #111; }
        .status-toggle.active { background: #10b981; color: #000; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3); border-color: transparent; }
        .status-toggle:hover { transform: translateY(-3px); }

        .stats-grid-lux { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 50px; }
        .stat-card { background: #111; border: 1px solid rgba(255,255,255,0.05); border-radius: 35px; padding: 35px; position: relative; overflow: hidden; transition: 0.4s; }
        .stat-card:hover { transform: translateY(-10px); border-color: rgba(255,255,255,0.1); box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .stat-icon-wrap { width: 60px; height: 60px; background: rgba(255,255,255,0.03); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: var(--primary); margin-bottom: 25px; }
        .stat-label { font-size: 0.85rem; color: #666; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .stat-value { font-size: 2.2rem; font-weight: 900; margin: 8px 0; letter-spacing: -1px; }
        .stat-trend-chip { font-size: 0.85rem; color: #10b981; font-weight: 800; background: rgba(16, 185, 129, 0.15); padding: 8px 16px; border-radius: 12px; width: fit-content; display: flex; align-items: center; gap: 8px; margin-top: 10px; }
        .stat-trend-chip span { white-space: nowrap; }
        .stat-sub-text { font-size: 0.9rem; color: #444; font-weight: 700; }

        .iban-input-group { display: flex; gap: 10px; margin-top: 15px; }
        .iban-input-lux { background: #000; border: 1px solid #222; border-radius: 15px; padding: 12px 15px; color: #fff; width: 100%; font-size: 0.9rem; font-weight: 700; transition: 0.3s; }
        .iban-input-lux:focus { border-color: var(--primary); }
        .iban-btn-lux { background: var(--primary); color: #000; border: none; padding: 0 20px; border-radius: 15px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .iban-btn-lux:hover { transform: scale(1.05); box-shadow: 0 0 20px var(--orange-glow); }

        .panel-content-layout { display: grid; grid-template-columns: 1fr 400px; gap: 40px; }
        .section-header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
        .section-title { font-size: 2rem; font-weight: 900; letter-spacing: -1px; }
        .badge-count { background: var(--primary); color: #000; padding: 5px 15px; border-radius: 15px; font-weight: 900; font-size: 0.9rem; }

        .order-card-lux { background: #111; border: 1px solid rgba(255,255,255,0.05); border-radius: 40px; padding: 35px; margin-bottom: 25px; border-left: 10px solid var(--primary); transition: 0.4s; }
        .order-card-lux:hover { border-color: #fff; transform: scale(1.02); }
        .order-main-info { display: flex; gap: 30px; margin-bottom: 30px; }
        .order-id-tag { background: #000; padding: 10px 18px; border-radius: 18px; font-weight: 900; height: fit-content; font-size: 1.1rem; color: var(--primary); }
        .customer-info h4 { font-size: 1.6rem; font-weight: 900; margin-bottom: 15px; }
        .info-row { display: flex; align-items: center; gap: 12px; font-size: 1rem; color: #777; margin-bottom: 10px; font-weight: 600; }
        
        .order-footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); }
        .order-amounts { display: flex; flex-direction: column; gap: 5px; }
        .total-amount-label { font-size: 0.85rem; color: #666; font-weight: 700; }
        .courier-profit-tag { font-size: 1.6rem; font-weight: 900; color: #10b981; text-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
        
        .action-buttons { display: flex; gap: 15px; }
        .btn-status { display: flex; align-items: center; gap: 10px; border: none; padding: 15px 30px; border-radius: 20px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .btn-status.delivered { background: #10b981; color: #000; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); }
        .btn-status.cancelled { background: rgba(255,77,77,0.05); color: #ff4d4d; border: 1px solid rgba(255,77,77,0.1); }
        .btn-status:hover { transform: translateY(-5px); filter: brightness(1.2); }

        .past-list { background: #0a0a0a; border-radius: 40px; padding: 30px; border: 1px solid rgba(255,255,255,0.02); }
        .past-order-item { background: #111; border: 1px solid rgba(255,255,255,0.04); border-radius: 25px; padding: 25px; margin-bottom: 15px; transition: 0.3s; }
        .past-order-item:hover { background: #1a1a1a; transform: translateX(10px); }
        .past-meta { display: flex; justify-content: space-between; font-size: 0.85rem; color: #444; margin-bottom: 12px; font-weight: 900; text-transform: uppercase; }
        .past-details { display: flex; justify-content: space-between; align-items: center; }
        .past-amounts { display: flex; flex-direction: column; }
        .past-total { font-weight: 700; color: #666; font-size: 0.9rem; }
        .past-profit { font-weight: 900; color: #10b981; font-size: 1.1rem; }
        .past-status { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; padding: 5px 12px; border-radius: 10px; }
        .past-status.delivered { color: #10b981; background: rgba(16, 185, 129, 0.1); }
        .past-status.cancelled { color: #ff4d4d; background: rgba(255, 77, 77, 0.1); }

        .past-order-item.cancelled-row { border-left: 4px solid #ff4d4d; opacity: 0.8; }
        .past-profit-cancelled { color: #ff4d4d; font-weight: 800; font-size: 1.1rem; text-decoration: line-through; }
        .empty-state-mini { text-align: center; color: #444; padding: 40px; font-weight: 700; }
        
        .empty-state { text-align: center; padding: 100px 40px; background: #0a0a0a; border-radius: 40px; border: 2px dashed #1a1a1a; color: #444; font-weight: 700; }
        .empty-state svg { margin-bottom: 25px; opacity: 0.2; }
        .panel-message { padding: 20px 30px; border-radius: 25px; margin-bottom: 35px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .panel-message.success { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .panel-message.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

        @media (max-width: 1200px) {
          .panel-content-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .stats-grid-lux { grid-template-columns: 1fr; }
          .panel-title { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default CourierPanel;
