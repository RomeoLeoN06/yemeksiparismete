import { Link } from 'react-router-dom';
import { Star, Clock, Truck, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Restaurant {
  id?: number | string;
  Id?: number | string;
  name?: string;
  Name?: string;
  category?: string;
  Category?: string;
  description?: string;
  Description?: string;
  bannerUrl?: string;
  logoUrl?: string;
  logo?: string;
  rating?: number | string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className="lux-restaurant-card"
    >
      <Link to={`/restaurant/${restaurant.id ?? restaurant.Id}`} className="card-inner-lux">
        <div className="card-visual-area">
          <img src={restaurant.bannerUrl || restaurant.logoUrl || restaurant.logo} alt={restaurant.name || restaurant.Name} className="banner-img" />
          <div className="banner-overlay"></div>
          
          <div className="logo-overlay-wrap">
             <img src={restaurant.logoUrl || restaurant.logo} alt={restaurant.name || restaurant.Name} className="logo-overlay-img" />
          </div>

          <div className="card-top-badges">
            <div className="premium-badge-lux">
              <Zap size={10} fill="currentColor" />
              <span>PREMIUM</span>
            </div>
            <div className="rating-badge-lux">
              <Star size={12} fill="currentColor" />
              <span>{Number(restaurant.rating).toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="card-content-area">
          <div className="content-top-row">
            <h3 className="restaurant-name-lux">{restaurant.name || restaurant.Name}</h3>
            <div className="category-pill-mini">{restaurant.category || restaurant.Category || 'Mutfak'}</div>
          </div>
          
          <p className="restaurant-desc-lux">{restaurant.description || restaurant.Description}</p>
          
          <div className="content-bottom-row">
            <div className="feature-item-lux">
              <Clock size={14} className="text-primary" />
              <span>25-35 dk</span>
            </div>
            <div className="feature-item-lux">
              <Truck size={14} className="text-primary" />
              <span>Ücretsiz</span>
            </div>
            <div className="go-btn-lux">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </Link>

      <style>{`
        .lux-restaurant-card { 
          background: var(--bg-card); 
          border-radius: 32px; 
          overflow: hidden; 
          border: 1px solid var(--border-light); 
          box-shadow: var(--shadow-lux); 
          transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
        }
        .lux-restaurant-card:hover { 
          transform: translateY(-12px);
          border-color: var(--primary); 
          box-shadow: var(--shadow-hover); 
        }
        .card-inner-lux { text-decoration: none; color: inherit; display: block; }

        .card-visual-area { position: relative; height: 220px; overflow: hidden; }
        .banner-img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
        .lux-restaurant-card:hover .banner-img { transform: scale(1.15) rotate(1deg); }
        .banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%); }

        .logo-overlay-wrap { 
          position: absolute; bottom: 15px; left: 20px; 
          width: 70px; height: 70px; 
          background: #111; border-radius: 20px; 
          padding: 4px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); 
          z-index: 10; border: 1px solid rgba(255,255,255,0.1);
        }
        .logo-overlay-img { width: 100%; height: 100%; object-fit: cover; border-radius: 16px; }

        .card-top-badges { position: absolute; top: 15px; left: 15px; right: 15px; display: flex; justify-content: space-between; z-index: 5; }
        .premium-badge-lux { background: var(--primary); color: #000; padding: 6px 14px; border-radius: 50px; font-size: 0.7rem; font-weight: 900; display: flex; align-items: center; gap: 6px; letter-spacing: 1px; box-shadow: 0 10px 20px var(--orange-glow); }
        .rating-badge-lux { background: #000; color: #fff; padding: 6px 14px; border-radius: 50px; font-size: 0.85rem; font-weight: 900; display: flex; align-items: center; gap: 6px; border: 1px solid rgba(255,255,255,0.1); }
        .rating-badge-lux svg { color: var(--primary); }

        .card-content-area { padding: 30px 24px 24px; }
        .content-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .restaurant-name-lux { font-size: 1.6rem; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
        .category-pill-mini { background: var(--accent); padding: 5px 14px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; color: var(--primary); text-transform: uppercase; border: 1px solid rgba(255, 126, 0, 0.1); }

        .restaurant-desc-lux { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 25px; height: 3em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-weight: 500; }

        .content-bottom-row { display: flex; align-items: center; gap: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
        .feature-item-lux { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 800; color: #fff; }
        .feature-item-lux .text-primary { color: var(--primary); }
        .go-btn-lux { margin-left: auto; width: 42px; height: 42px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: 0.4s; }
        .lux-restaurant-card:hover .go-btn-lux { background: var(--primary); color: #000; transform: rotate(-45deg); box-shadow: 0 0 20px var(--orange-glow); }
      `}</style>
    </motion.div>
  );
};

export default RestaurantCard;
