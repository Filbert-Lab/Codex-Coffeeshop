import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductList from "../components/Products";
import Cart from "../components/CartPreview";
import AuthModal from "../components/AuthModal";
import PaymentModal from "../components/PaymentModal";
import * as api from "../api";

function Home() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Categories
  useEffect(() => {
    api.getCategories()
      .then((data) => setCategories([{ id: null, name: "All", icon: "🍽️" }, ...data.data]))
      .catch(console.error);
  }, []);

  // Fetch Products
  useEffect(() => {
    setLoading(true);
    const params = { page: 1, limit: 20 };
    if (searchQuery) params.search = searchQuery;
    if (activeCategory !== "All") {
      const cat = categories.find((c) => c.name === activeCategory);
      if (cat?.id) params.category_id = cat.id;
    }
    api.getProducts(params)
      .then((data) => setProducts(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchQuery, activeCategory, categories]);

  const handleCheckout = async (orderData) => {
    try {
      await api.createOrder(orderData);
      setIsPaymentOpen(false);
      setCart([]);
      showToast("✓ Order placed successfully! Thank you ☕");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-5 font-sans relative flex flex-col" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Content with z-index above background */}
      <div className="relative z-10 flex flex-col h-full gap-4">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
          openAuth={() => setIsAuthOpen(true)}
        />

        <div className="flex gap-4 flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-52 shrink-0 hidden md:block">
            <Sidebar categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </div>

          {/* Main Product Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Category pills for mobile */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full transition-all duration-200 ${
                    activeCategory === cat.name
                      ? "bg-gradient-to-r from-codex-accent to-codex-accent-dark text-white shadow-md"
                      : "bg-white/70 text-codex-muted hover:bg-white border border-gray-100"
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Products grid */}
            <div className="flex-1 overflow-hidden">
              <ProductList products={products} cart={cart} setCart={setCart} loading={loading} />
            </div>
          </div>

          {/* Cart */}
          <div className="w-[280px] shrink-0 hidden lg:block">
            <Cart cart={cart} setCart={setCart} openPayment={() => setIsPaymentOpen(true)} />
          </div>
        </div>
      </div>

      {/* Mobile cart floating button */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsPaymentOpen(true)}
          className="lg:hidden fixed bottom-5 right-5 bg-gradient-to-r from-codex-accent to-codex-accent-dark text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-codex-accent/30 flex items-center gap-3 z-50 animate-slide-up"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="font-bold text-sm">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
          <span className="text-xs opacity-80">•</span>
          <span className="font-bold text-sm">
            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
              cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0)
            )}
          </span>
        </button>
      )}

      {isAuthOpen && <AuthModal close={() => setIsAuthOpen(false)} />}
      {isPaymentOpen && <PaymentModal cart={cart} close={() => setIsPaymentOpen(false)} onSuccess={handleCheckout} />}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -trangray-x-1/2 py-3.5 px-6 rounded-2xl shadow-2xl font-semibold z-[2000] animate-slide-up flex items-center gap-3 backdrop-blur-md ${
          toast.type === "error"
            ? "bg-red-600/90 text-white border border-red-500/30"
            : "bg-codex-dark/90 text-white border border-white/[0.06]"
        }`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
            toast.type === "error" ? "bg-red-500/30" : "bg-codex-accent/20"
          }`}>
            {toast.type === "error" ? "⚠" : "☕"}
          </div>
          <span className="text-sm">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

export default Home;
