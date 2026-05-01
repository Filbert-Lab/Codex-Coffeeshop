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
    <div className="min-h-screen p-5 font-sans relative flex flex-col" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Background is handled by CSS body::before */}

      {/* Content with z-index above background */}
      <div className="relative z-10 flex flex-col h-full">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
          openAuth={() => setIsAuthOpen(true)}
        />

        <div className="flex gap-4 mt-4 flex-1 min-h-0">
          <div className="w-52 shrink-0">
            <Sidebar categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </div>
          <div className="flex-1 overflow-hidden">
            <ProductList products={products} cart={cart} setCart={setCart} loading={loading} />
          </div>
          <div className="w-[280px] shrink-0">
            <Cart cart={cart} setCart={setCart} openPayment={() => setIsPaymentOpen(true)} />
          </div>
        </div>
      </div>

      {isAuthOpen && <AuthModal close={() => setIsAuthOpen(false)} />}
      {isPaymentOpen && <PaymentModal cart={cart} close={() => setIsPaymentOpen(false)} onSuccess={handleCheckout} />}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 py-4 px-6 rounded-2xl shadow-2xl font-semibold z-[2000] animate-slide-up flex items-center gap-3 backdrop-blur-md ${
          toast.type === "error"
            ? "bg-red-600/90 text-white border border-red-500/30"
            : "bg-codex-dark/90 text-white border border-white/[0.06]"
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
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
