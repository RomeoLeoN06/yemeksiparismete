import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headset, MessageSquare, ShieldCheck, HelpCircle, PhoneCall, ChevronRight, Send, X, Bot, User as UserIcon, Sparkles, Clock, Package, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'Genel Destek',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.FullName || user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState(0);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const faqs = [
    { q: "Siparişim ne zaman gelir?", a: "Siparişiniz restoran tarafından onaylandıktan sonra ortalama 20-40 dakika içerisinde kapınızda olur." },
    { q: "Ödeme yöntemleri nelerdir?", a: "Kredi kartı, banka kartı ve kapıda nakit ödeme seçeneklerimiz mevcuttur." },
    { q: "İptal ve iade koşulları nelerdir?", a: "Restoran siparişinizi hazırlamaya başlamadan önce canlı destek üzerinden iptal talebinde bulunabilirsiniz." },
    { q: "Kurye nasıl olunur?", a: "Kurye başvuruları için ana sayfamızdaki 'Kurye Ol' bölümünden form doldurabilirsiniz." }
  ];

  const quickActions = [
    { id: 'track', label: 'Sipariş Takibi', icon: <Package size={16} /> },
    { id: 'cancel', label: 'İptal İşlemleri', icon: <X size={16} /> },
    { id: 'payment', label: 'Ödeme Sorunları', icon: <CreditCard size={16} /> },
    { id: 'complaint', label: 'Şikayet Oluştur', icon: <MessageSquare size={16} /> }
  ];

  useEffect(() => {
    if (user && token) {
      fetchHistory();
    }
  }, [user, token]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chatMessages, isTyping]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/support/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setHistory(await res.json());
    } catch (e) { console.error(e); }
  };

  const loadSession = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/support/sessions/${id}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setChatMessages(await res.json());
        setSessionId(id);
        setChatOpen(true);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user?.id })
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({ ...formData, message: '' });
      }
    } catch (err) {
      console.error('Support error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e?: React.FormEvent, manualMsg?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const msgToSubmit = manualMsg || chatInput.trim();
    if (!msgToSubmit) return;

    setChatInput('');
    setIsTyping(true);

    // Optimistically add user message to UI
    const userMsg = { sender: 'User', content: msgToSubmit, timestamp: new Date().toISOString() };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ sessionId, message: msgToSubmit })
      });

      if (res.ok) {
        const data = await res.json();
        setSessionId(data.sessionId);
        
        const aiMsg = {
            sender: 'AI',
            content: data.response,
            options: data.options,
            timestamp: new Date().toISOString()
        };
        
        setChatMessages(prev => [...prev, aiMsg]);
        if (user) fetchHistory();
      } else {
        console.error('Chat error:', await res.text());
        setIsTyping(false);
      }
    } catch (e) { console.error(e); }
    finally { 
        setIsTyping(false); 
    }
  };

  const handleQuickAction = (actionLabel: string) => {
    // DIRECT NAVIGATION ACTIONS
    if (actionLabel === "Siparişlerim" || actionLabel === "Eski Siparişlerim" || actionLabel === "Sipariş Takibi") {
        navigate('/profile?tab=orders');
        return;
    }
    if (actionLabel === "İptal İşlemleri") {
        navigate('/profile?tab=orders'); // Siparişlerin içinden iptal yapılıyor
        return;
    }
    if (actionLabel === "Ödeme Sorunları" || actionLabel === "Ödeme Yöntemlerini Düzenle") {
        navigate('/profile?tab=payments');
        return;
    }
    if (actionLabel === "Yemek Sipariş Et" || actionLabel === "Ana Sayfa") {
        navigate('/');
        return;
    }
    handleChatSubmit(undefined, actionLabel);
  };

  return (
    <div className="support-page fade-in">
      <div className="support-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="support-title"
          >
            Nasıl <span className="text-gold">Yardımcı</span> Olabiliriz?
          </motion.h1>
          <p className="support-subtitle">YemekMete Destek Ekibi ve Yapay Zeka Asistanınız yanınızda.</p>
        </div>
      </div>

      <div className="container support-grid">
        <div className="support-main">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card support-form-card">
            <div className="form-header">
              <Headset size={24} className="text-gold" />
              <h2>Destek Talebi Oluştur</h2>
            </div>
            
            {success ? (
              <div className="success-message">
                <ShieldCheck size={48} className="text-gold" />
                <h3>Mesajınız İletildi!</h3>
                <p>En kısa sürede size geri dönüş yapacağız.</p>
                <button onClick={() => setSuccess(false)} className="btn-gold mt-20">Yeni Mesaj</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="support-form">
                <div className="input-row">
                  <div className="field-group">
                    <label>Ad Soyad</label>
                    <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div className="field-group">
                    <label>E-posta</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div className="field-group">
                  <label>Konu</label>
                  <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                    <option>Genel Destek</option>
                    <option>Sipariş Sorunu</option>
                    <option>Ödeme İşlemleri</option>
                    <option>Öneri / Şikayet</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Mesajınız</label>
                  <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Sorunuzu detaylıca açıklayın..."></textarea>
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
                  {loading ? 'Gönderiliyor...' : 'Talebi Gönder'}
                  {!loading && <Send size={18} />}
                </button>
              </form>
            )}
          </motion.div>

          <div className="faq-section-lux mt-60">
            <div className="faq-header">
              <HelpCircle size={24} className="text-gold" />
              <h2>Sıkça Sorulan Sorular</h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item-lux glass-card">
                  <div className="faq-q">
                    <span>{faq.q}</span>
                    <ChevronRight size={18} className="text-gold" />
                  </div>
                  <div className="faq-a">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="support-sidebar">
          <div className="glass-card contact-card-lux">
            <div className="card-icon-box-lux"><PhoneCall size={28} /></div>
            <h3>Hızlı İletişim</h3>
            <p>Acil durumlar için bizi hemen arayın.</p>
            <a href="tel:4440000" className="call-btn-lux">
              <span>444 0 000</span>
            </a>
          </div>

          <div className="glass-card contact-card-lux mt-20" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="ai-bg-glow"></div>
            <div className="card-icon-box-lux" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', color: '#3b82f6' }}>
              <Bot size={28} />
            </div>
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Mete AI Asistan <Sparkles size={16} className="text-gold" />
            </h3>
            <p>Google altyapılı yapay zekamız sorularınızı yanıtlamaya hazır.</p>
            <button onClick={() => { 
                setSessionId(0); 
                setChatMessages([{sender: 'AI', content: `Merhaba ${user?.FullName || 'Müşterimiz'}! Ben Mete AI. Bugün sana nasıl yardımcı olabilirim?`, options: quickActions.map(a => a.label)}]); 
                setChatOpen(true); 
            }} className="chat-btn-lux" style={{ background: '#3b82f6', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)', border: 'none', cursor: 'pointer' }}>
              Yeni Sohbet Başlat
            </button>
          </div>

          {history.length > 0 && (
            <div className="glass-card contact-card-lux mt-20 history-card">
              <div className="history-header">
                <Clock size={20} className="text-gold" />
                <h3>Geçmiş Sohbetler</h3>
              </div>
              <div className="history-list">
                {history.slice(0, 5).map((s) => (
                  <button key={s.id} onClick={() => loadSession(s.id)} className="history-item">
                    <span>Sohbet #{s.id}</span>
                    <small>{new Date(s.createdAt).toLocaleDateString('tr-TR')}</small>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="chat-overlay" onClick={() => setChatOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} className="chat-modal-lux glass-card">
              <div className="chat-header">
                <div className="chat-title-group">
                  <div className="ai-avatar">
                    <Bot size={24} />
                    <div className="status-dot"></div>
                  </div>
                  <div>
                    <h4>Mete AI Asistan</h4>
                    <span>Google AI ile güçlendirildi</span>
                  </div>
                </div>
                <button className="chat-close" onClick={() => setChatOpen(false)}><X size={20} /></button>
              </div>

              <div className="chat-body">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="msg-group">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`chat-bubble-wrap ${msg.sender.toLowerCase() === 'ai' ? 'ai' : 'user'}`}>
                      {msg.sender.toLowerCase() === 'ai' && <div className="chat-icon-mini ai"><Bot size={14}/></div>}
                      <div className="chat-bubble">
                        <div dangerouslySetInnerHTML={{ 
                          __html: (msg.content || msg.text || "")
                            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                            .replace(/\[(.*?)\]\((.*?)\)/g, (_, text, url) => {
                                return `<button onclick="window.location.href='${url}'" class="chat-link-btn">${text}</button>`;
                            })
                            .replace(/\n/g, '<br/>')
                        }} />
                      </div>
                      {msg.sender.toLowerCase() === 'user' && <div className="chat-icon-mini user"><UserIcon size={14}/></div>}
                    </motion.div>
                    
                    {msg.options && msg.options.length > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="quick-actions-grid">
                        {msg.options.map((opt: string, i: number) => (
                          <button key={i} onClick={() => handleQuickAction(opt)} className="action-card-lux">
                            <Sparkles size={14} />
                            <span>{opt}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-bubble-wrap ai typing">
                    <div className="chat-icon-mini ai"><Bot size={14}/></div>
                    <div className="chat-bubble typing-dots"><span></span><span></span><span></span></div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleChatSubmit} className="chat-footer">
                <input 
                  type="text" 
                  placeholder="Sorunuzu buraya yazın..." 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  disabled={isTyping}
                />
                <button type="submit" disabled={!chatInput.trim() || isTyping}>
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .support-page { background: var(--bg-main); padding-bottom: 120px; color: #fff; min-height: 100vh; }
        .support-hero { padding: 120px 0; text-align: center; background: linear-gradient(135deg, #0a0a0a 0%, #050505 100%); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .support-title { font-size: 4rem; font-weight: 900; letter-spacing: -2px; margin-bottom: 15px; }
        .support-subtitle { font-size: 1.2rem; color: #666; }
        .support-grid { display: grid; grid-template-columns: 1fr 380px; gap: 40px; margin-top: -50px; }
        .glass-card { background: #111; border: 1px solid rgba(255,255,255,0.05); border-radius: 30px; padding: 40px; }
        .form-header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
        .support-form { display: flex; flex-direction: column; gap: 20px; }
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .field-group { display: flex; flex-direction: column; gap: 8px; }
        .field-group label { font-size: 0.8rem; font-weight: 800; color: #555; text-transform: uppercase; }
        .field-group input, .field-group select, .field-group textarea { background: #050505; border: 1px solid #222; padding: 15px; border-radius: 15px; color: #fff; outline: none; }
        .field-group input:focus { border-color: var(--primary); }
        .btn-gold { background: var(--primary); color: #000; padding: 15px 30px; border-radius: 15px; font-weight: 900; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; }
        .btn-gold:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,126,0,0.2); }
        .contact-card-lux { text-align: center; margin-bottom: 20px; }
        .card-icon-box-lux { width: 60px; height: 60px; background: rgba(255,126,0,0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: var(--primary); }
        .call-btn-lux, .chat-btn-lux { width: 100%; padding: 15px; border-radius: 15px; font-weight: 800; text-decoration: none; display: block; margin-top: 20px; }
        .call-btn-lux { background: #222; color: #fff; }
        .chat-btn-lux { background: var(--primary); color: #000; border: none; cursor: pointer; }
        
        .history-card { text-align: left !important; }
        .history-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .history-list { display: flex; flex-direction: column; gap: 10px; }
        .history-item { background: #050505; border: 1px solid #222; padding: 12px; border-radius: 12px; color: #fff; display: flex; justify-content: space-between; cursor: pointer; border: none; width: 100%; text-align: left; }
        .history-item:hover { border-color: var(--primary); background: #1a1a1a; }

        .chat-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000; }
        .chat-modal-lux { position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; background: #111; z-index: 1001; display: flex; flex-direction: column; }
        .chat-header { padding: 20px; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center; }
        .chat-title-group { display: flex; align-items: center; gap: 12px; }
        .ai-avatar { position: relative; width: 40px; height: 40px; background: #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .status-dot { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #00ff00; border-radius: 50%; border: 2px solid #111; }
        .chat-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
        .chat-bubble-wrap { display: flex; gap: 10px; max-width: 80%; }
        .chat-bubble-wrap.ai { align-self: flex-start; }
        .chat-bubble-wrap.user { align-self: flex-end; flex-direction: row-reverse; }
        .chat-bubble { padding: 12px 18px; border-radius: 18px; font-size: 0.9rem; line-height: 1.4; }
        .ai .chat-bubble { background: #222; color: #fff; border-bottom-left-radius: 4px; }
        .user .chat-bubble { background: var(--primary); color: #000; border-bottom-right-radius: 4px; }
        .chat-link-btn { 
          display: inline-block; background: var(--primary); color: #000; 
          padding: 8px 12px; border-radius: 8px; font-weight: 800; 
          border: none; cursor: pointer; margin-top: 5px; font-size: 0.8rem;
          text-decoration: none;
        }
        .chat-footer { padding: 15px; border-top: 1px solid #222; display: flex; gap: 10px; }
        .chat-footer input { flex: 1; background: #050505; border: 1px solid #222; padding: 12px; border-radius: 12px; color: #fff; outline: none; }
        .chat-footer button { width: 45px; height: 45px; background: var(--primary); border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        
        .quick-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; padding-left: 40px; }
        .action-card-lux { 
          background: #1a1a1a; border: 1px solid rgba(255,255,255,0.05); 
          padding: 12px; border-radius: 12px; color: #fff; 
          display: flex; align-items: center; gap: 8px; font-size: 0.8rem; 
          font-weight: 700; cursor: pointer; transition: 0.3s;
        }
        .action-card-lux:hover { background: #222; border-color: var(--primary); transform: translateY(-2px); }
        .action-card-lux svg { color: var(--primary); }

        .typing-dots span { display: inline-block; width: 4px; height: 4px; background: #666; border-radius: 50%; margin: 0 2px; animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Support;
