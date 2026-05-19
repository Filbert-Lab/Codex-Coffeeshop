import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductList from "../components/Products";
import Cart from "../components/CartPreview";
import AuthModal from "../components/AuthModal";
import PaymentModal from "../components/PaymentModal";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import * as api from "../api";

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

function Home() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const { toast, showToast } = useToast();

  // Fetch categories once
  useEffect(() => {
    api
      .getCategories()
      .then((data) => setCategories([{ id: null, name: "All", icon: "🍽️" }, ...(data.data || [])]))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    setLoading(true);
    const params = { page: 1, limit: 20 };
    if (searchQuery) params.search = searchQuery;
    if (activeCategory !== "All") {
      const cat = categories.find((c) => c.name === activeCategory);
      if (cat?.id) params.category_id = cat.id;
    }
    api
      .getProducts(params)
      .then((data) => setProducts(data.data || []))
      .catch((err) => {
        console.error(err);
        showToast("Failed to load products", "error");
      })
      .finally(() => setLoading(false));
  }, [searchQuery, activeCategory, categories, showToast]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
    [cart]
  );

  const handleProductAdded = (item) => {
    showToast(`${item.name} added to cart`, "added", 1800);
  };

  const handleCheckout = async (orderData) => {
    try {
      await api.createOrder(orderData);
      setIsPaymentOpen(false);
      setIsMobileCartOpen(false);
      setCart([]);
      showToast("Order placed successfully! Thank you ☕", "success", 3000);
    } catch (err) {
      showToast(err.message || "Checkout failed", "error", 3500);
    }
  };

  return (
    <div
      className="p-3 sm:p-4 md:p-5 font-sans relative flex flex-col"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div className="relative z-10 flex flex-col h-full gap-3 sm:gap-4">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartCount={cartCount}
          openAuth={() => setIsAuthOpen(true)}
          openCart={() => setIsMobileCartOpen(true)}
        />

        <div className="flex gap-3 sm:gap-4 flex-1 min-h-0">
          {/* Desktop sidebar */}
          <div className="w-48 lg:w-52 shrink-0 hidden md:block">
            <Sidebar
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden flex flex-col min-w-0">
            {/* Mobile category pills */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
              {categories.map((cat) => {
                const active = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className="shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5"
                    style={
                      active
                        ? {
                            background: "linear-gradient(135deg, #E8A045, #C8832A)",
                            color: "#1C1410",
                            boxShadow: "0 4px 14px rgba(232,160,69,0.3)",
                          }
                        : { background: "#251C16", color: "#B09880", border: "1px solid #3D2E22" }
                    }
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-hidden">
              <ProductList
                products={products}
                cart={cart}
                setCart={setCart}
                loading={loading}
                onAdded={handleProductAdded}
              />
            </div>
          </div>

          {/* Desktop cart */}
          <div className="w-[280px] xl:w-[300px] shrink-0 hidden lg:block">
            <Cart cart={cart} setCart={setCart} openPayment={() => setIsPaymentOpen(true)} />
          </div>
        </div>
      </div>

      {/* Mobile cart drawer (slides in from right) */}
      {isMobileCartOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 animate-fade-in"
          onClick={() => setIsMobileCartOpen(false)}
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[90vw] max-w-[340px] p-3 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <Cart
              cart={cart}
              setCart={setCart}
              openPayment={() => {
                setIsMobileCartOpen(false);
                setIsPaymentOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile floating cart button */}
      {cart.length > 0 && !isMobileCartOpen && (
        <button
          onClick={() => setIsMobileCartOpen(true)}
          className="lg:hidden fixed bottom-5 right-5 px-4 py-3 rounded-2xl flex items-center gap-3 z-40 animate-slide-up active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg, #E8A045, #C8832A)",
            color: "#1C1410",
            boxShadow: "0 8px 28px rgba(232,160,69,0.45)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" x2="21" y1="6" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="font-bold text-sm">{cartCount}</span>
          <span className="text-xs opacity-70">·</span>
          <span className="font-bold text-sm">{fmt(cartTotal)}</span>
        </button>
      )}

      {isAuthOpen && <AuthModal close={() => setIsAuthOpen(false)} />}
      {isPaymentOpen && (
        <PaymentModal
          cart={cart}
          close={() => setIsPaymentOpen(false)}
          onSuccess={handleCheckout}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}

export default Home;
