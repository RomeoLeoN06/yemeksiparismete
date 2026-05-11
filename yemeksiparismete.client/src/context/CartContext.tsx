import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
interface Product {
  id?: number | string;
  Id?: number | string;
  ProductId?: number | string;
  name?: string;
  Name?: string;
  ProductName?: string;
  price?: number | string;
  Price?: number | string;
  description?: string;
  Description?: string;
  imageUrl?: string;
  ImageUrl?: string;
  image?: string;
  Image?: string;
  restaurantId?: number | string;
  RestaurantId?: number | string;
}

interface CartItem {
  ProductId: number | string;
  ProductName: string;
  Price: number | string;
  Quantity: number;
  ImageUrl?: string;
  RestaurantId?: number | string;
  RestaurantName?: string;
  RestaurantAddress?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  incrementQuantity: (productId: string | number) => void;
  decrementQuantity: (productId: string | number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  coupon: any | null;
  availableCoupons: any[];
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  autoApplyBestCoupon: () => void;
  discountAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<any | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);

  // Fetch Available Coupons
  useEffect(() => {
    console.log("[SQL_SYNC] Kuponlar çekiliyor...");
    fetch('/api/Coupons')
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(data => {
        console.log("[SQL_SYNC] Gelen Kuponlar:", data);
        setAvailableCoupons(data);
      })
      .catch(err => {
        console.error("[SQL_SYNC] Kuponlar yüklenemedi:", err);
      });
  }, []);

  useEffect(() => {
    const storageKey = user ? `cart_${user.id}` : 'cart_guest';
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCart(Array.isArray(parsed) ? parsed : []);
      } catch {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    const storageKey = user ? `cart_${user.id}` : 'cart_guest';
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, user]);

  const addToCart = useCallback((product: any) => {
    const pId = product.ProductId ?? product.id ?? product.Id;
    const pName = product.ProductName ?? product.Name ?? product.name ?? 'Ürün';
    const pPrice = product.Price ?? product.price ?? 0;
    const rId = product.RestaurantId ?? product.restaurantId;

    if (!pId) return;

    setCart(prev => {
      if (prev.length > 0) {
        const currentRestId = prev[0].RestaurantId;
        if (rId && String(currentRestId) !== String(rId)) {
          if (!window.confirm("Sepetinizde başka bir restorandan ürünler var. Temizleyip yenisini eklemek ister misiniz?")) {
            return prev;
          }
          return [{
            ProductId: pId,
            ProductName: pName,
            Price: pPrice,
            Quantity: 1,
            ImageUrl: product.ImageUrl ?? product.imageUrl ?? product.image ?? product.Image,
            RestaurantId: rId,
            RestaurantName: product.RestaurantName ?? product.restaurantName,
            RestaurantAddress: product.RestaurantAddress ?? product.restaurantAddress
          }];
        }
      }

      const existing = prev.find(item => String(item.ProductId) === String(pId));
      if (existing) {
        return prev.map(item => 
          String(item.ProductId) === String(pId) 
            ? { ...item, Quantity: item.Quantity + 1 } 
            : item
        );
      }

      return [...prev, {
        ProductId: pId,
        ProductName: pName,
        Price: pPrice,
        Quantity: 1,
        ImageUrl: product.ImageUrl ?? product.imageUrl ?? product.image ?? product.Image,
        RestaurantId: rId,
        RestaurantName: product.RestaurantName ?? product.restaurantName,
        RestaurantAddress: product.RestaurantAddress ?? product.restaurantAddress
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number | string) => {
    setCart(prev => prev.filter(item => String(item.ProductId) !== String(productId)));
  }, []);

  const updateQuantity = useCallback((productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => String(item.ProductId) === String(productId) ? { ...item, Quantity: quantity } : item));
  }, [removeFromCart]);

  const incrementQuantity = useCallback((productId: string | number) => {
    setCart(prev => prev.map(item => String(item.ProductId) === String(productId) ? { ...item, Quantity: item.Quantity + 1 } : item));
  }, []);

  const decrementQuantity = useCallback((productId: string | number) => {
    setCart(prev => prev.map(item => {
      if (String(item.ProductId) === String(productId)) {
        return { ...item, Quantity: item.Quantity - 1 };
      }
      return item;
    }).filter(item => item.Quantity > 0));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
  }, []);

  const totalItems = cart.reduce((s, i) => s + (i.Quantity || 0), 0);
  const totalPrice = cart.reduce((s, i) => {
    let p = 0;
    if (typeof i.Price === 'number') {
      p = i.Price;
    } else {
      let v = String(i.Price || "0").replace(/\./g, '').replace(',', '.');
      p = parseFloat(v) || 0;
    }
    return s + (p * (i.Quantity || 0));
  }, 0);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch(`/api/coupons/validate/${code}`);
      if (!res.ok) {
        const err = await res.json();
        return { success: false, message: err.message || "Kupon bulunamadı." };
      }
      const data = await res.json();
      
      const minAmount = data.minimumOrderAmount ?? data.MinimumOrderAmount ?? 300;
      if (totalPrice < minAmount) {
        return { success: false, message: `Bu kupon için minimum sepet tutarı ${minAmount} TL olmalıdır.` };
      }

      setCoupon(data);
      return { success: true, message: "Kupon uygulandı!" };
    } catch (err) {
      return { success: false, message: "Kupon doğrulanamadı." };
    }
  };

  const autoApplyBestCoupon = useCallback(() => {
    if (availableCoupons.length === 0) return;
    
    // Sort by discount descending and find the first one that matches min amount
    const best = availableCoupons
      .filter(c => totalPrice >= (c.minimumOrderAmount ?? c.MinimumOrderAmount ?? 0))
      .sort((a, b) => (b.discountAmount ?? b.DiscountAmount) - (a.discountAmount ?? a.DiscountAmount))[0];
    
    if (best) {
      setCoupon(best);
    }
  }, [availableCoupons, totalPrice]);

  const discountAmount = coupon ? (coupon.discountAmount ?? coupon.DiscountAmount ?? 0) : 0;

  console.log(`[SQL_SYNC] ${totalItems} items, Total: ${totalPrice} TL, Discount: ${discountAmount} TL`);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, incrementQuantity, decrementQuantity, clearCart,
      totalItems, totalPrice, coupon, availableCoupons, applyCoupon, autoApplyBestCoupon, discountAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
