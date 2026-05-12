import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, Settings, Edit, Trash, Plus } from 'lucide-react';
import * as signalR from '@microsoft/signalr';

const RestaurantPanel = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [restaurant, setRestaurant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    if (token) {
      fetchData();
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/orderhub")
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => connection.invoke("JoinAdminGroup"))
      .catch(err => console.error(err));

    connection.on("ReceiveNewOrder", () => {
      if (activeTab === 'orders') fetchOrders();
    });

    connection.on("OrderStatusUpdated", (data: any) => {
      if (activeTab === 'orders') {
        setOrders(prev => prev.map(o => (o.id === data.id || o.Id === data.id) ? { ...o, status: data.status, Status: data.status } : o));
      }
    });

    return () => { connection.stop(); };
  }, [token, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    await fetchRestaurant();
    if (activeTab === 'orders') await fetchOrders();
    if (activeTab === 'products') await fetchProducts();
    setLoading(false);
  };

  const fetchRestaurant = async () => {
    const res = await fetch('/api/restaurantpanel/my-restaurant', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setRestaurant(await res.json());
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/restaurantpanel/my-orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setOrders(await res.json());
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/restaurantpanel/my-products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setProducts(await res.json());
  };

  const updateOrderStatus = async (id: number, status: string) => {
    await fetch(`/api/restaurantpanel/my-orders/${id}/status?status=${status}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchOrders();
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingProduct.id;
    const url = isNew ? '/api/restaurantpanel/my-products' : `/api/restaurantpanel/my-products/${editingProduct.id}`;
    const method = isNew ? 'POST' : 'PUT';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(editingProduct)
    });
    setEditingProduct(null);
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm("Ürünü silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/restaurantpanel/my-products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchProducts();
  };

  const updateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/restaurantpanel/my-restaurant', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(restaurant)
    });
    alert("Restoran bilgileri güncellendi.");
  };

  return (
    <div className="rest-panel-wrap fade-in">
      <div className="container">
        <div className="panel-header">
          <div>
            <h1>Restoran Yönetim Paneli</h1>
            <p className="text-muted">Hoş geldiniz, <strong>{restaurant?.name || user?.name}</strong>.</p>
          </div>
        </div>

        <div className="panel-layout">
          <div className="panel-sidebar">
            <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><ShoppingBag size={20}/> Siparişler</button>
            <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}><Package size={20}/> Ürün Yönetimi</button>
            <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><Settings size={20}/> Restoran Ayarları</button>
          </div>

          <div className="panel-content">
            {loading ? (
              <div className="text-center py-20 text-muted">Yükleniyor...</div>
            ) : (
              <>
                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div className="dash-card-lux">
                    <h3>Gelen Siparişler</h3>
                    {orders.length === 0 ? <p className="text-muted">Sipariş bulunmuyor.</p> : (
                      <div className="orders-list">
                        {orders.map(o => (
                          <div key={o.id} className="order-item">
                            <div className="order-header">
                              <strong>#{o.id} - {o.customerName} {o.customerPhone && <span style={{ color: 'var(--primary)', marginLeft: '10px' }}>({o.customerPhone})</span>}</strong>
                              <div style={{ textAlign: 'right' }}>
                                <span className="price" style={{ display: 'block' }}>₺{o.totalAmount}</span>
                                {(o.discountAmount > 0 || o.DiscountAmount > 0) && (
                                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>
                                    Kupon: {o.couponCode || o.CouponCode} (-₺{o.discountAmount || o.DiscountAmount})
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="order-details">
                               <p>Adres: {o.deliveryAddress}</p>
                               {(o.note || o.Note) && (
                                 <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '5px' }}>
                                   Not: {o.note || o.Note}
                                 </p>
                               )}
                               <ul>
                                {o.items.map((i:any, idx:number) => (
                                  <li key={idx}>{i.quantity}x {i.productName}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="order-actions">
                              <select 
                                value={o.status} 
                                onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                className={`status-select ${o.status}`}
                              >
                                <option value="preparing">Hazırlanıyor</option>
                                <option value="on_the_way">Yolda</option>
                                <option value="delivered">Teslim Edildi</option>
                                <option value="cancelled">İptal Edildi</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                  <div className="dash-card-lux">
                    <div className="flex-between">
                      <h3>Ürün Yönetimi</h3>
                      <button className="btn-lux-primary" onClick={() => setEditingProduct({ name: '', price: 0, description: '', imageUrl: '', category: '', stock: 100 })}>
                        <Plus size={16}/> Yeni Ürün
                      </button>
                    </div>
                    
                    {editingProduct && (
                      <form className="edit-form" onSubmit={saveProduct}>
                        <input type="text" placeholder="Ürün Adı" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required />
                        <input type="number" placeholder="Fiyat (₺)" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} required />
                        <input type="text" placeholder="Açıklama" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                        <input type="text" placeholder="Resim URL" value={editingProduct.imageUrl} onChange={e => setEditingProduct({...editingProduct, imageUrl: e.target.value})} />
                        <input type="text" placeholder="Kategori" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} />
                        <div className="form-actions">
                          <button type="submit" className="btn-lux-primary">Kaydet</button>
                          <button type="button" className="btn-lux-outline" onClick={() => setEditingProduct(null)}>İptal</button>
                        </div>
                      </form>
                    )}

                    <div className="products-grid">
                      {products.map(p => (
                        <div key={p.id} className="product-card">
                          <img src={p.imageUrl || 'https://via.placeholder.com/150'} alt={p.name} />
                          <div className="p-info">
                            <strong>{p.name}</strong>
                            <span className="price">₺{p.price}</span>
                          </div>
                          <div className="p-actions">
                            <button onClick={() => setEditingProduct(p)}><Edit size={16}/></button>
                            <button onClick={() => deleteProduct(p.id)} className="text-danger"><Trash size={16}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && restaurant && (
                  <div className="dash-card-lux">
                    <h3>Restoran Ayarları</h3>
                    <form className="edit-form" onSubmit={updateRestaurant}>
                      <label>Restoran Adı</label>
                      <input type="text" value={restaurant.name} onChange={e => setRestaurant({...restaurant, name: e.target.value})} required />
                      
                      <label>Adres</label>
                      <input type="text" value={restaurant.address} onChange={e => setRestaurant({...restaurant, address: e.target.value})} required />
                      
                      <label>Açıklama</label>
                      <textarea value={restaurant.description} onChange={e => setRestaurant({...restaurant, description: e.target.value})} />
                      
                      <label>Logo URL</label>
                      <input type="text" value={restaurant.logoUrl} onChange={e => setRestaurant({...restaurant, logoUrl: e.target.value})} />
                      
                      <label>Banner URL</label>
                      <input type="text" value={restaurant.bannerUrl} onChange={e => setRestaurant({...restaurant, bannerUrl: e.target.value})} />
                      
                      <button type="submit" className="btn-lux-primary mt-10">Bilgileri Güncelle</button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .rest-panel-wrap { background: #050505; min-height: 100vh; padding: 80px 0 120px; color: #fff; }
        .panel-header { margin-bottom: 40px; }
        .panel-header h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -1px; }
        
        .panel-layout { display: grid; grid-template-columns: 250px 1fr; gap: 40px; }
        
        .panel-sidebar { display: flex; flex-direction: column; gap: 10px; }
        .panel-sidebar button { 
          display: flex; align-items: center; gap: 15px; padding: 15px 20px; 
          background: #111; border: 1px solid rgba(255,255,255,0.05); border-radius: 15px; 
          color: #fff; font-weight: 700; cursor: pointer; transition: 0.3s; 
        }
        .panel-sidebar button:hover, .panel-sidebar button.active { 
          background: rgba(255,126,0,0.1); border-color: var(--primary); color: var(--primary); 
        }

        .dash-card-lux { background: #111; padding: 40px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.05); }
        .dash-card-lux h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 25px; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }

        .orders-list { display: flex; flex-direction: column; gap: 20px; }
        .order-item { background: #0a0a0a; border-radius: 15px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .order-header { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 15px; }
        .order-header .price { color: var(--primary); font-weight: 900; }
        .order-details { font-size: 0.9rem; color: #aaa; margin-bottom: 15px; }
        .order-details ul { padding-left: 20px; margin-top: 10px; }
        
        .status-select { padding: 8px 15px; border-radius: 10px; background: #000; color: #fff; border: 1px solid #333; }
        
        .edit-form { display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; background: #0a0a0a; padding: 25px; border-radius: 15px; }
        .edit-form input, .edit-form textarea { padding: 12px 15px; border-radius: 10px; background: #000; border: 1px solid #333; color: #fff; }
        .edit-form label { font-size: 0.85rem; font-weight: 700; color: #888; margin-bottom: -5px; }
        .form-actions { display: flex; gap: 15px; margin-top: 10px; }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .product-card { background: #0a0a0a; border-radius: 15px; overflow: hidden; border: 1px solid #222; }
        .product-card img { width: 100%; height: 140px; object-fit: cover; }
        .p-info { padding: 15px; display: flex; flex-direction: column; gap: 5px; }
        .p-info .price { color: var(--primary); font-weight: 800; }
        .p-actions { display: flex; border-top: 1px solid #222; }
        .p-actions button { flex: 1; padding: 10px; background: transparent; border: none; color: #fff; cursor: pointer; transition: 0.2s; }
        .p-actions button:hover { background: #111; }
        .text-danger { color: #ef4444 !important; }

        @media (max-width: 768px) {
          .panel-layout { grid-template-columns: 1fr; }
          .panel-sidebar { flex-direction: row; overflow-x: auto; padding-bottom: 10px; }
          .panel-sidebar button { white-space: nowrap; }
        }
      `}</style>
    </div>
  );
};

export default RestaurantPanel;
