import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Support from './pages/Support';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import OrderManagement from './pages/OrderManagement';
import OrderSupport from './pages/OrderSupport';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import BecomeCourier from './pages/BecomeCourier';
import RestaurantPanel from './pages/RestaurantPanel';
import CourierPanel from './pages/CourierPanel';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LocationProvider>
        <AuthProvider>
          <CartProvider>
            <div className="app-container">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/admin-orders" element={<OrderManagement />} />
                  <Route path="/order-support/:id" element={<OrderSupport />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/kurye-ol" element={<BecomeCourier />} />
                  <Route path="/restaurant-panel" element={<RestaurantPanel />} />
                  <Route path="/courier-panel" element={<CourierPanel />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </LocationProvider>
    </Router>
  );
}

export default App;