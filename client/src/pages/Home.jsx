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
    <div className="bg-codex-light min-h-screen p-6 font-sans relative flex flex-col" style={{ height: "100vh", overflow: "hidden" }}>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        openAuth={() => setIsAuthOpen(true)}
      />

      <div className="flex gap-5 mt-5 flex-1 min-h-0">
        <div className="w-52 shrink-0">
          <Sidebar categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        </div>
        <div className="flex-1 overflow-hidden">
          <ProductList products={products} cart={cart} setCart={setCart} loading={loading} />
        </div>
        <div className="w-72 shrink-0">
          <Cart cart={cart} setCart={setCart} openPayment={() => setIsPaymentOpen(true)} />
        </div>
      </div>

      {isAuthOpen && <AuthModal close={() => setIsAuthOpen(false)} />}
      {isPaymentOpen && <PaymentModal cart={cart} close={() => setIsPaymentOpen(false)} onSuccess={handleCheckout} />}

      {toast && (
        <div className={`fixed bottom-8 right-8 py-4 px-6 rounded-2xl shadow-2xl font-semibold z-[2000] animate-slide-up flex items-center gap-3 ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-codex-dark text-white"
        }`}>
          <span className="text-xl">{toast.type === "error" ? "⚠️" : "☕"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default Home;
