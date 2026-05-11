import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LayoutGrid, Utensils, Package, Users, TrendingUp, Clock } from 'lucide-react';
import * as signalR from '@microsoft/signalr';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const handleReSeed = async () => {
    if (!window.confirm("Veritabanındaki restoranlar ve ürünler silinip yeni çeşitlerle tekrar yüklenecek. Onaylıyor musunuz?")) return;
    
    setSeeding(true);
    try {
      const response = await fetch('/api/seed/run', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("Veritabanı başarıyla güncellendi!");
        fetchDashboardData();
      } else {
        const errData = await response.json();
        alert("Hata: " + (errData.error || "Bilinmeyen hata") + "\nDetay: " + (errData.detail || "Yok"));
      }
    } catch (err) {
      alert("Bağlantı hatası.");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Gerçek zamanlı Sipariş takibi (SignalR)
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/orderhub")
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log("Gerçek zamanlı sipariş sistemine bağlanıldı.");
        return connection.invoke("JoinAdminGroup");
      })
      .catch(err => console.error("SignalR Bağlantı Hatası: ", err));

    connection.on("ReceiveNewOrder", (order) => {
      console.log("Yeni sipariş geldi: ", order);
      
      // Dashboard state'ini sayfa yenilenmeden güncelle
      setStats((prevStats: any) => {
        if (!prevStats) return prevStats;
        
        // Yeni siparişi listenin en üstüne ekle, 10 tanesini tut
        const newRecentOrders = [order, ...(prevStats.recentOrders || [])].slice(0, 10);
        
        return {
          ...prevStats,
          totalOrders: prevStats.totalOrders + 1,
          monthlyEarnings: prevStats.monthlyEarnings + order.totalAmount,
          recentOrders: newRecentOrders
        };
      });
    });

    return () => {
      connection.stop();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const statCards = [
    { label: 'Toplam Sipariş', value: stats?.totalOrders || 0, icon: <Package />, color: '#4facfe' },
    { label: 'Restoranlar', value: stats?.totalRestaurants || 0, icon: <Utensils />, color: '#ff9f43' },
    { label: 'Aktif Menüler', value: stats?.activeMenus || 0, icon: <LayoutGrid />, color: '#ff4d4d' },
    { label: 'Kullanıcılar', value: stats?.totalUsers || 0, icon: <Users />, color: '#667eea' },
    { label: 'Aylık Kazanç', value: `₺${stats?.monthlyEarnings?.toLocaleString() || 0}`, icon: <TrendingUp />, color: '#10b981' },
  ];

  return (
    <div className="dashboard-wrap fade-in">
      <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="dash-title-box">
                <LayoutGrid size={32} className="text-primary" />
                <h1>{user?.role === 'admin' ? 'Yönetici Paneli' : 'Restoran Paneli'}</h1>
              </div>
              <p className="text-muted">Hoş geldiniz, <strong>{user?.name}</strong>. Sistemin genel durumunu ve performansını buradan takip edebilirsiniz.</p>
            </div>
            {user?.role === 'admin' && (
              <button 
                onClick={handleReSeed} 
                disabled={seeding}
                className="btn-lux-outline" 
                style={{ padding: '12px 25px', fontSize: '0.85rem', display: 'flex', gap: '10px' }}
              >
                {seeding ? 'GÜNCELLENİYOR...' : 'VERİLERİ GÜNCELLE'}
                {!seeding && <Package size={16} />}
              </button>
            )}
          </div>

        <div className="stats-grid">
          {statCards.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="stat-card-lux"
            >
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{loading ? '...' : stat.value}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="dash-content-grid">
          <div className="dash-card-lux main-chart">
            <div className="section-header">
              <h3>Sipariş Analizi</h3>
              <div className="time-pill">Son 30 Gün</div>
            </div>
            <div className="chart-placeholder">
              <div className="pulse-circle"></div>
              <p>Grafik verileri gerçek zamanlı olarak işleniyor...</p>
            </div>
            <div className="chart-stats-mini">
              <div className="mini-stat">
                <span>Tamamlanan</span>
                <strong>%94</strong>
              </div>
              <div className="mini-stat">
                <span>İptal Edilen</span>
                <strong className="text-danger">%2</strong>
              </div>
            </div>
          </div>

          <div className="dash-card-lux recent-orders">
            <h3>Son İşlemler</h3>
            <div className="recent-list">
              {loading ? (
                <div className="text-center py-20 text-muted">Yükleniyor...</div>
              ) : stats?.recentOrders?.length === 0 ? (
                <div className="text-center py-20 text-muted">Henüz işlem bulunmuyor.</div>
              ) : (
                stats?.recentOrders?.map((order: any) => (
                  <div key={order.id ?? order.Id} className="recent-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className={`item-dot ${order.status ?? order.Status}`}></div>
                        <div className="item-text">
                          <span className="item-title">Sipariş #{order.id ?? order.Id} - {order.customerName ?? order.CustomerName ?? 'Müşteri'}</span>
                          <span className="item-time">
                            <Clock size={12} /> {new Date(order.orderDate ?? order.OrderDate).toLocaleDateString('tr-TR')} {new Date(order.orderDate ?? order.OrderDate).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                      <div className="item-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
                        <span className="item-amount">₺{order.totalAmount ?? order.TotalAmount}</span>
                        <select 
                          value={order.status ?? order.Status} 
                          onChange={(e) => updateOrderStatus(order.id ?? order.Id, e.target.value)}
                          className={`status-select ${order.status ?? order.Status}`}
                        >
                          <option value="preparing">Hazırlanıyor</option>
                          <option value="on_the_way">Yolda</option>
                          <option value="delivered">Teslim Edildi</option>
                          <option value="cancelled">İptal Edildi</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: '1.5' }}>
                        <strong style={{ color: 'var(--text-main)' }}>Teslimat Adresi:</strong> {order.deliveryAddress ?? order.DeliveryAddress ?? 'Adres bilgisi yok'} <br/>
                        <strong style={{ color: 'var(--text-main)' }}>İletişim:</strong> {order.customerPhone ?? order.CustomerPhone ?? '-'}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Sipariş İçeriği:</div>
                      <ul style={{ paddingLeft: '20px', margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {(order.items ?? order.Items ?? []).map((item: any, idx: number) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{(item.quantity ?? item.Quantity)}x {(item.productName ?? item.ProductName)} <span style={{ opacity: 0.7 }}>(₺{(item.price ?? item.Price)})</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="btn-view-all">TÜMÜNÜ GÖR</button>
          </div>
        </div>

        <div className="section-header-lux mt-40">
          <h3 className="lux-section-title" style={{ fontSize: '1.8rem' }}>Kategori <span className="text-primary">Dağılımı</span></h3>
        </div>
        <div className="stats-grid" style={{ marginTop: '20px' }}>
          {stats?.restaurantsByCategory?.map((cat: any, index: number) => (
            <div key={index} className="stat-card-lux" style={{ padding: '20px' }}>
              <div className="stat-info">
                <span className="stat-label">{cat.category}</span>
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>{cat.count} Restoran</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .dashboard-wrap { background: #050505; min-height: 100vh; padding: 80px 0 120px; color: #fff; }
        .dash-header { margin-bottom: 60px; }
        .dash-title-box { display: flex; align-items: center; gap: 20px; margin-bottom: 15px; }
        .dash-title-box h1 { font-size: 3rem; font-weight: 900; color: #fff; letter-spacing: -2px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; margin-bottom: 60px; }
        .stat-card-lux { 
          background: #111; 
          padding: 35px; 
          border-radius: 28px; 
          border: 1px solid rgba(255,255,255,0.05); 
          display: flex; align-items: center; gap: 25px; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.3); 
          transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1); 
        }
        .stat-card-lux:hover { transform: translateY(-8px); border-color: var(--primary); }
        .stat-icon { width: 65px; height: 65px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; background: #050505 !important; }
        .stat-info { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.85rem; font-weight: 800; color: #555; text-transform: uppercase; letter-spacing: 1.5px; }
        .stat-value { font-size: 2rem; font-weight: 900; color: #fff; margin-top: 5px; }
 
        .dash-content-grid { display: grid; grid-template-columns: 1.8fr 1.2fr; gap: 40px; }
        .dash-card-lux { 
          background: #111; 
          padding: 45px; 
          border-radius: 35px; 
          border: 1px solid rgba(255,255,255,0.05); 
          box-shadow: 0 10px 30px rgba(0,0,0,0.3); 
        }
        .dash-card-lux h3 { font-size: 1.8rem; font-weight: 900; margin-bottom: 35px; color: #fff; letter-spacing: -0.5px; }
        
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; }
        .time-pill { background: rgba(255,255,255,0.05); padding: 8px 18px; border-radius: 50px; font-size: 0.8rem; font-weight: 800; color: var(--primary); border: 1px solid rgba(255,126,0,0.2); }

        .chart-placeholder { 
          height: 380px; background: #080808; border-radius: 28px; 
          display: flex; flex-direction: column; align-items: center; justify-content: center; 
          color: #444; border: 2px dashed rgba(255,255,255,0.03); margin-bottom: 35px; 
        }
        .pulse-circle { width: 22px; height: 22px; background: var(--primary); border-radius: 50%; margin-bottom: 25px; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.5; } 70% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.5; } }

        .chart-stats-mini { display: flex; gap: 50px; }
        .mini-stat { display: flex; flex-direction: column; gap: 8px; }
        .mini-stat span { font-size: 0.8rem; font-weight: 800; color: #555; text-transform: uppercase; letter-spacing: 1px; }
        .mini-stat strong { font-size: 1.6rem; font-weight: 900; color: #10b981; }

        .recent-list { display: flex; flex-direction: column; gap: 20px; margin-bottom: 35px; }
        .recent-item { display: flex; gap: 15px; padding: 25px; background: #0a0a0a; border-radius: 22px; transition: 0.4s; border: 1px solid rgba(255,255,255,0.02); }
        .recent-item:hover { background: #151515; border-color: rgba(255,255,255,0.08); transform: translateX(5px); }
        .item-dot { width: 12px; height: 12px; background: var(--primary); border-radius: 50%; margin-top: 10px; flex-shrink: 0; }
        .item-dot.preparing { background: #f59e0b; }
        .item-dot.on_the_way { background: #3b82f6; }
        .item-dot.delivered { background: #10b981; }
        .item-dot.cancelled { background: #ef4444; }
        
        .item-text { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .item-title { font-weight: 900; font-size: 1.1rem; color: #fff; }
        .item-time { font-size: 0.8rem; color: #555; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .item-amount { font-weight: 900; color: var(--primary); font-size: 1.2rem; }
        
        .status-select { 
          padding: 8px 16px; border-radius: 12px; font-size: 0.85rem; font-weight: 800; 
          border: 1px solid rgba(255,255,255,0.05); outline: none; cursor: pointer; appearance: none;
          background: #111; color: #fff; transition: 0.3s;
        }
        .status-select:focus { border-color: var(--primary); }
        .status-select.preparing { color: #f59e0b; }
        .status-select.on_the_way { color: #3b82f6; }
        .status-select.delivered { color: #10b981; }
        .status-select.cancelled { color: #ef4444; }

        .btn-view-all { width: 100%; padding: 18px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); font-weight: 900; color: #555; cursor: pointer; transition: 0.4s; letter-spacing: 1px; }
        .btn-view-all:hover { border-color: var(--primary); color: var(--primary); background: rgba(255,126,0,0.05); }

        @media (max-width: 1200px) {
          .dash-content-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .dashboard-wrap { padding: 40px 0 80px; }
          .dash-title-box h1 { font-size: 2.2rem; }
          .stats-grid { grid-template-columns: 1fr; gap: 20px; }
          .stat-card-lux { padding: 25px; }
          .dash-card-lux { padding: 30px 20px; border-radius: 25px; }
          .chart-stats-mini { flex-direction: column; gap: 20px; }
          .mini-stat strong { font-size: 1.3rem; }
        }
        @media (max-width: 480px) {
          .dash-title-box h1 { font-size: 1.8rem; }
          .dash-card-lux h3 { font-size: 1.4rem; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
