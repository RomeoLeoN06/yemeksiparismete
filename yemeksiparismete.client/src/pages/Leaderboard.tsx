import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Sparkles, ArrowLeft, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardUser {
  fullName: string;
  greenPoints: number;
  profileImageBase64?: string;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching leaderboard from /api/user/leaderboard...');
    fetch('/api/user/leaderboard')
      .then(res => {
        console.log('Leaderboard response status:', res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Leaderboard data received:', data);
        setUsers(Array.isArray(data) ? data : (data.$values || []));
        setLoading(false);
      })
      .catch(err => {
        console.error('Leaderboard error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="leaderboard-page">
      <div className="container py-80">
        <button onClick={() => navigate('/')} className="back-btn-lux">
          <ArrowLeft size={20} /> Geri Dön
        </button>

        <div className="leaderboard-header text-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="trophy-icon-wrap"
          >
            <Trophy size={60} />
          </motion.div>
          <h1 className="lux-title">Doğa <span className="text-primary">Kahramanları</span></h1>
          <p className="lux-subtitle">En çok Yeşil Puan kazanan ilk 10 kahramanımız. Her ay sürpriz ödüller!</p>
          
          <div className="prize-badge">
            <Sparkles size={16} /> Bu Ayın Ödülü: 500 TL Hediye Çeki + Altın Rozet
          </div>
        </div>

        {loading ? (
          <div className="text-center py-100">
            <div className="lux-loader"></div>
          </div>
        ) : (
          <div className="leaderboard-content">
            {/* Top 3 Podium */}
            <div className="podium-section">
              {users.slice(0, 3).map((user, index) => (
                <motion.div 
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`podium-card rank-${index + 1}`}
                >
                  <div className="rank-badge">
                    {index === 0 ? <Trophy size={24} /> : <Medal size={24} />}
                  </div>
                  <div className="user-avatar-lg">
                    {user.profileImageBase64 ? (
                      <img src={user.profileImageBase64} alt="" />
                    ) : (
                      <div className="avatar-placeholder">{user.fullName[0]}</div>
                    )}
                  </div>
                  <h3>{user.fullName}</h3>
                  <div className="points-pill">
                    <Leaf size={14} /> {user.greenPoints} Puan
                  </div>
                </motion.div>
              ))}
            </div>

            {/* List Table */}
            <div className="leaderboard-list">
              {users.slice(3).map((user, index) => (
                <motion.div 
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (index + 3) * 0.1 }}
                  className="list-item-lux"
                >
                  <div className="rank-num">#{index + 4}</div>
                  <div className="user-avatar-sm">
                    {user.profileImageBase64 ? (
                      <img src={user.profileImageBase64} alt="" />
                    ) : (
                      <div className="avatar-placeholder-sm">{user.fullName[0]}</div>
                    )}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.fullName}</span>
                  </div>
                  <div className="user-points">
                    <strong>{user.greenPoints}</strong> <span>Puan</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .leaderboard-page { background: var(--bg-main); min-height: 100vh; color: white; }
        .back-btn-lux { display: flex; align-items: center; gap: 8px; background: none; border: none; color: var(--text-muted); cursor: pointer; font-weight: 700; margin-bottom: 30px; }
        .back-btn-lux:hover { color: var(--primary); }
        
        .trophy-icon-wrap { width: 120px; height: 120px; background: rgba(255, 215, 0, 0.1); border-radius: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; color: #FFD700; box-shadow: 0 20px 40px rgba(255, 215, 0, 0.15); border: 1px solid rgba(255, 215, 0, 0.3); }
        .prize-badge { display: inline-flex; align-items: center; gap: 10px; background: rgba(0, 255, 127, 0.1); color: #00ff7f; padding: 10px 20px; border-radius: 50px; font-weight: 800; font-size: 0.9rem; border: 1px solid rgba(0, 255, 127, 0.2); margin-top: 20px; }
        
        .podium-section { display: flex; justify-content: center; align-items: flex-end; gap: 30px; margin-top: 80px; margin-bottom: 60px; }
        .podium-card { background: var(--bg-card); padding: 40px 30px; border-radius: 30px; text-align: center; border: 1px solid var(--border-light); position: relative; width: 220px; box-shadow: var(--shadow-lux); }
        .rank-1 { order: 2; transform: scale(1.1); border-color: var(--primary); z-index: 2; background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%); }
        .rank-2 { order: 1; }
        .rank-3 { order: 3; }
        
        .rank-badge { position: absolute; top: -15px; left: 50%; transform: translateX(-50%); width: 40px; height: 40px; background: var(--primary); color: black; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(255,126,0,0.4); }
        .user-avatar-lg { width: 100px; height: 100px; border-radius: 30px; overflow: hidden; margin: 0 auto 20px; border: 3px solid var(--primary); }
        .avatar-placeholder { width: 100%; height: 100%; background: #333; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; }
        .points-pill { display: inline-flex; align-items: center; gap: 6px; background: var(--accent); color: var(--primary); padding: 6px 15px; border-radius: 50px; font-weight: 900; font-size: 0.85rem; }
        
        .leaderboard-list { max-width: 800px; margin: 0 auto; background: var(--bg-card); border-radius: 30px; border: 1px solid var(--border-light); padding: 10px; }
        .list-item-lux { display: flex; align-items: center; gap: 20px; padding: 15px 30px; border-radius: 20px; transition: 0.3s; }
        .list-item-lux:hover { background: rgba(255,255,255,0.03); }
        .rank-num { font-size: 1.2rem; font-weight: 900; color: var(--text-muted); width: 40px; }
        .user-avatar-sm { width: 50px; height: 50px; border-radius: 15px; overflow: hidden; }
        .avatar-placeholder-sm { width: 100%; height: 100%; background: #333; display: flex; align-items: center; justify-content: center; font-weight: 900; }
        .user-info { flex: 1; }
        .user-name { font-weight: 700; font-size: 1.1rem; }
        .user-points { text-align: right; }
        .user-points strong { color: var(--primary); font-size: 1.2rem; }
        .user-points span { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; margin-left: 5px; }

        @media (max-width: 768px) {
          .podium-section { flex-direction: column; align-items: center; gap: 40px; }
          .rank-1 { order: 1; }
          .rank-2 { order: 2; }
          .rank-3 { order: 3; }
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
