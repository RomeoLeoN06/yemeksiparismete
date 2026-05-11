import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Clock, MapPin, CreditCard, 
  MessageSquare, AlertCircle, CheckCircle2, ChevronLeft, 
  Trash2, Info, ShieldAlert
} from 'lucide-react';

const OrderSupport = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrder(await res.json());
      } else {
        let errorMsg = 'Sipariş bilgileri yüklenemedi.';
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
          errorMsg = await res.text() || errorMsg;
        }
        setMessage({ type: 'error', text: `Hata (${res.status}): ${errorMsg}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Bağlantı hatası.' });
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (token) fetchOrder();
  }, [token, fetchOrder]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${id}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchOrder();
        setShowConfirm(false);
      } else {
        setMessage({ type: 'error', text: data.message || 'İptal işlemi başarısız.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Bağlantı hatası.' });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="support-page-lux">
      <div className="container text-center py-100">
        <div className="loader-lux"></div>
        <p className="mt-20">Sipariş detayları yükleniyor...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="support-page-lux">
      <div className="container text-center py-100">
        <AlertCircle size={60} className="text-danger mb-20" />
        <h2>{message.text ? 'Hata Oluştu' : 'Sipariş Bulunamadı'}</h2>
        <p>{message.text || 'Aradığınız sipariş mevcut değil veya erişim yetkiniz yok.'}</p>
        <Link to="/profile?tab=orders" className="btn-lux-primary mt-30">Siparişlerime Dön</Link>
      </div>
    </div>
  );

  const isCancellable = order.status === 'preparing';

  return (
    <div className="support-page-lux">
      <div className="container">
        
        {/* Header Navigation */}
        <div className="support-header-nav mb-40">
          <button onClick={() => navigate(-1)} className="btn-back-lux">
            <ChevronLeft size={20} /> Geri Dön
          </button>
          <div className="header-title-wrap">
            <h1>Sipariş <span className="text-primary">Desteği</span></h1>
            <p>Sipariş # {order.id} için iptal ve destek işlemleri</p>
          </div>
        </div>

        <div className="support-grid-layout">
          
          {/* Order Details Card */}
          <div className="order-summary-column">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="support-card-lux"
            >
              <div className="card-top-header">
                <div className="restaurant-badge">
                  <div className="res-icon"><Package size={18} /></div>
                  <h3>{order.restaurantName ?? order.RestaurantName ?? 'Restoran'}</h3>
                </div>
                <div className={`status-pill-lux ${order.status ?? order.Status}`}>
                  {(order.status ?? order.Status) === 'preparing' ? 'Hazırlanıyor' : 
                   (order.status ?? order.Status) === 'on_the_way' ? 'Yolda' : 
                   (order.status ?? order.Status) === 'cancelled' ? 'İptal Edildi' : 'Teslim Edildi'}
                </div>
              </div>

              <div className="order-items-box-lux">
                {(order.items ?? order.Items ?? []).map((item: any) => (
                  <div key={item.id ?? item.Id ?? item.ProductId} className="support-item-row">
                    <span className="qty-badge">{(item.quantity ?? item.Quantity)}x</span>
                    <span className="item-name">{(item.productName ?? item.ProductName)}</span>
                    <span className="item-price">{(item.price ?? item.Price ?? 0) * (item.quantity ?? item.Quantity ?? 0)} TL</span>
                  </div>
                ))}
                <div className="support-total-row">
                  <span>Toplam Ödeme</span>
                  <strong>{order.totalAmount ?? order.TotalAmount} TL</strong>
                </div>
              </div>

              <div className="order-info-footer-grid">
                <div className="info-block">
                  <label><Clock size={14} /> Sipariş Zamanı</label>
                  <span>{new Date(order.orderDate ?? order.OrderDate).toLocaleString('tr-TR')}</span>
                </div>
                <div className="info-block">
                  <label><CreditCard size={14} /> Ödeme Yöntemi</label>
                  <span>{(order.paymentMethod ?? order.PaymentMethod) === 'credit_card' ? 'Kredi Kartı' : 'Kapıda Ödeme'}</span>
                </div>
                <div className="info-block full-width">
                  <label><MapPin size={14} /> Teslimat Adresi</label>
                  <span>{order.deliveryAddress ?? order.DeliveryAddress}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Support Actions Column */}
          <div className="support-actions-column">
            
            {/* Status Based Message */}
            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`support-alert ${message.type}`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cancellation Section */}
            <div className="support-card-lux action-card">
              <div className="card-icon-box danger"><Trash2 size={24} /></div>
              <h2>Sipariş İptali</h2>
              
              {order.status === 'cancelled' ? (
                <div className="status-info-box cancelled">
                  <CheckCircle2 size={32} />
                  <p>Bu sipariş başarıyla iptal edildi.</p>
                </div>
              ) : isCancellable ? (
                <div className="cancel-eligible-box">
                  <p>Siparişiniz henüz restoran tarafından yola çıkarılmadığı için iptal edilebilir.</p>
                  
                  {!showConfirm ? (
                    <button 
                      onClick={() => setShowConfirm(true)} 
                      className="btn-cancel-action"
                    >
                      Siparişi İptal Et
                    </button>
                  ) : (
                    <div className="confirm-cancellation fade-in">
                      <p><strong>Emin misiniz?</strong> Bu işlem geri alınamaz.</p>
                      <div className="confirm-buttons">
                        <button onClick={() => setShowConfirm(false)} className="btn-no" disabled={cancelling}>Hayır, Kalsın</button>
                        <button onClick={handleCancel} className="btn-yes" disabled={cancelling}>
                          {cancelling ? 'İşleniyor...' : 'Evet, İptal Et'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="status-info-box warning">
                  <Info size={32} />
                  <p>Siparişiniz {order.status === 'on_the_way' ? 'yolda' : 'teslim edilmiş'} olduğu için sistem üzerinden iptal edilemiyor.</p>
                  <Link to="/contact" className="btn-support-link">Müşteri Hizmetleri</Link>
                </div>
              )}
            </div>

            {/* AI Assistant / Live Support Mini Box */}
            <div className="support-card-lux action-card secondary">
              <div className="card-icon-box primary"><MessageSquare size={24} /></div>
              <h2>Canlı Destek</h2>
              <p>Diğer sorunlarınız için asistanımızla hemen görüşün.</p>
              <button className="btn-live-chat">Sohbeti Başlat</button>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        .support-page-lux { background: #050505; min-height: 100vh; padding: 120px 0; color: #fff; }
        .support-header-nav { display: flex; align-items: center; gap: 40px; }
        .btn-back-lux { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 20px; border-radius: 15px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 800; transition: 0.3s; }
        .btn-back-lux:hover { background: rgba(255,255,255,0.1); border-color: var(--primary); }
        .header-title-wrap h1 { font-size: 2.8rem; font-weight: 900; letter-spacing: -1.5px; margin-bottom: 5px; }
        .header-title-wrap p { color: #666; font-weight: 700; }

        .support-grid-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; margin-top: 40px; }
        .support-card-lux { background: #111; border: 1px solid rgba(255,255,255,0.05); border-radius: 35px; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .card-top-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .restaurant-badge { display: flex; align-items: center; gap: 15px; }
        .res-icon { width: 45px; height: 45px; background: rgba(255,126,0,0.1); color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .restaurant-badge h3 { font-size: 1.4rem; font-weight: 900; margin: 0; }
        
        .status-pill-lux { padding: 8px 20px; border-radius: 50px; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
        .status-pill-lux.preparing { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }
        .status-pill-lux.on_the_way { background: rgba(59,130,246,0.1); color: #3b82f6; border: 1px solid rgba(59,130,246,0.2); }
        .status-pill-lux.cancelled { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
        .status-pill-lux.delivered { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }

        .order-items-box-lux { background: #0a0a0a; border-radius: 25px; padding: 30px; margin-bottom: 35px; border: 1px solid rgba(255,255,255,0.02); }
        .support-item-row { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.03); }
        .qty-badge { background: #222; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 900; color: var(--primary); }
        .item-name { flex: 1; font-weight: 700; color: #ccc; }
        .item-price { font-weight: 900; color: #fff; }
        .support-total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 25px; font-size: 1.3rem; }
        .support-total-row strong { color: var(--primary); font-weight: 900; }

        .order-info-footer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .info-block { display: flex; flex-direction: column; gap: 8px; }
        .info-block.full-width { grid-column: span 2; }
        .info-block label { font-size: 0.75rem; font-weight: 800; color: #555; text-transform: uppercase; letter-spacing: 1.5px; display: flex; align-items: center; gap: 8px; }
        .info-block span { font-weight: 700; color: #999; line-height: 1.4; }

        .support-alert { display: flex; align-items: center; gap: 15px; padding: 20px 30px; border-radius: 20px; margin-bottom: 30px; font-weight: 800; }
        .support-alert.success { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
        .support-alert.error { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }

        .action-card { text-align: center; margin-bottom: 30px; }
        .action-card.secondary { background: rgba(255,126,0,0.02); border-color: rgba(255,126,0,0.1); }
        .card-icon-box { width: 70px; height: 70px; border-radius: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; }
        .card-icon-box.danger { background: rgba(239,68,68,0.1); color: #ef4444; }
        .card-icon-box.primary { background: rgba(255,126,0,0.1); color: var(--primary); }
        .action-card h2 { font-size: 1.6rem; font-weight: 900; margin-bottom: 15px; }
        .action-card p { color: #666; font-weight: 700; margin-bottom: 30px; line-height: 1.5; }

        .btn-cancel-action { width: 100%; padding: 18px; border-radius: 18px; background: #ef4444; color: #fff; border: none; font-weight: 900; font-size: 1.1rem; cursor: pointer; transition: 0.4s; box-shadow: 0 10px 25px rgba(239,68,68,0.3); }
        .btn-cancel-action:hover { transform: scale(1.02); background: #dc2626; }
        
        .confirm-cancellation { background: #000; padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .confirm-buttons { display: flex; gap: 15px; margin-top: 20px; }
        .btn-no { flex: 1; padding: 12px; border-radius: 12px; background: #222; border: none; color: #fff; font-weight: 800; cursor: pointer; }
        .btn-yes { flex: 1; padding: 12px; border-radius: 12px; background: #ef4444; border: none; color: #fff; font-weight: 800; cursor: pointer; }

        .status-info-box { padding: 30px; border-radius: 25px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        .status-info-box.cancelled { background: rgba(239,68,68,0.05); color: #ef4444; }
        .status-info-box.warning { background: rgba(255,158,11,0.05); color: #f59e0b; }
        .btn-support-link { margin-top: 15px; color: var(--primary); text-decoration: none; font-weight: 900; border-bottom: 2px solid var(--primary); }

        .btn-live-chat { width: 100%; padding: 18px; border-radius: 18px; background: var(--primary); color: #000; border: none; font-weight: 900; font-size: 1.1rem; cursor: pointer; }
        
        .loader-lux { width: 40px; height: 40px; border: 3px solid rgba(255,126,0,0.1); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 992px) {
          .support-grid-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default OrderSupport;
