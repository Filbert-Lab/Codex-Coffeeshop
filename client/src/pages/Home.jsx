import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductList from "../components/Products";
import Cart from "../components/CartPreview";
import AuthModal from "../components/AuthModal";
import PaymentModal from "../components/PaymentModal";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";

const ALL_CATEGORY = { id: null, name: "All", icon: "🍽️" };

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

function Home({ initialData = null }) {
  const hasInitialData = Boolean(initialData);
  const skipInitialCategoriesFetch = useRef(hasInitialData);
  const skipInitialProductsFetch = useRef(hasInitialData);

  const [cart, setCart] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(null); // null = "All"
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  // Set to true when the user opens the auth modal *because* they tried to
  // check out — we re-open the payment modal automatically once they're in.
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [products, setProducts] = useState(() => initialData?.products ?? []);
  const [categories, setCategories] = useState(() => [
    ALL_CATEGORY,
    ...(initialData?.categories ?? []),
  ]);
  const [loading, setLoading] = useState(!hasInitialData);

  const { toast, showToast } = useToast();
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { user, oauthError, clearOauthError } = useAuth();

  // Load cart after mount so SSR stays deterministic.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("codex_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCart(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setCart([]);
    } finally {
      setCartReady(true);
    }
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    localStorage.setItem("codex_cart", JSON.stringify(cart));
  }, [cart, cartReady]);

  // Fetch categories once on mount
  useEffect(() => {
    if (skipInitialCategoriesFetch.current) {
      skipInitialCategoriesFetch.current = false;
      return;
    }

    const ac = new AbortController();
    api
      .getCategories(ac.signal)
      .then((data) => setCategories([ALL_CATEGORY, ...(data.data || [])]))
      .catch((err) => {
        if (err.name !== "AbortError")
          console.error("Failed to load categories:", err);
      });
    return () => ac.abort();
  }, []);

  // Fetch products when filters change (NOT when categories array changes)
  useEffect(() => {
    if (skipInitialProductsFetch.current) {
      skipInitialProductsFetch.current = false;
      return;
    }

    const ac = new AbortController();
    setLoading(true);

    const params = { page: 1, limit: 24 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCategoryId) params.category_id = activeCategoryId;

    api
      .getProducts(params, ac.signal)
      .then((data) => setProducts(data.data || []))
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
        showToast("Failed to load products", "error");
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [debouncedSearch, activeCategoryId, showToast]);

  const cartCount = useMemo(
    () => cart.reduce((s, i) => s + i.quantity, 0),
    [cart],
  );
  const cartTotal = useMemo(
    () => cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
    [cart],
  );

  const visibleProducts = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !term ||
        [product.name, product.description, product.category?.name]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term));
      const matchesCategory =
        !activeCategoryId ||
        Number(product.category_id) === Number(activeCategoryId);
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearch, activeCategoryId]);

  const handleProductAdded = useCallback(
    (item) => showToast(`${item.name} added to cart`, "added", 1800),
    [showToast],
  );

  const handleAuthenticated = useCallback(
    (authenticatedUser, mode) => {
      const name = authenticatedUser?.name?.trim();
      const greeting = mode === "login" ? "Welcome back" : "Welcome to Codex";
      showToast(`${greeting}${name ? `, ${name}` : ""}!`, "success", 3000);
      // If they were trying to check out before signing in, open it now.
      if (pendingCheckout) {
        setPendingCheckout(false);
        setIsPaymentOpen(true);
      }
    },
    [showToast, pendingCheckout],
  );

  // Open the auth modal first if not signed in, otherwise the payment modal.
  const requestCheckout = useCallback(() => {
    if (!user) {
      setPendingCheckout(true);
      setIsAuthOpen(true);
      showToast("Please sign in to place an order", "info", 2500);
      return;
    }
    setIsPaymentOpen(true);
  }, [user, showToast]);

  // Surface OAuth errors that come back via ?error=... in the callback URL.
  useEffect(() => {
    if (!oauthError) return;
    showToast(oauthError, "error", 3500);
    clearOauthError();
  }, [oauthError, showToast, clearOauthError]);

  const handleCheckout = useCallback(
    async (orderData) => {
      try {
        await api.createOrder(orderData);
        setIsPaymentOpen(false);
        setIsMobileCartOpen(false);
        setCart([]);
        showToast("Order placed successfully! Thank you ☕", "success", 3000);
      } catch (err) {
        showToast(err.message || "Checkout failed", "error", 3500);
      }
    },
    [showToast],
  );

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
              activeCategoryId={activeCategoryId}
              setActiveCategoryId={setActiveCategoryId}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden flex flex-col min-w-0">
            {/* Mobile category pills */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
              {categories.map((cat) => {
                const active = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id ?? "all"}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                      active ? "nav-pill-active" : ""
                    }`}
                    style={
                      active
                        ? undefined
                        : {
                            background: "#FFFBF3",
                            color: "#5C4530",
                            border: "1px solid #E8DCC4",
                          }
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
                products={visibleProducts}
                cart={cart}
                setCart={setCart}
                loading={loading}
                onAdded={handleProductAdded}
              />
            </div>
          </div>

          {/* Desktop cart */}
          <div className="w-[280px] xl:w-[300px] shrink-0 hidden lg:block">
            <Cart cart={cart} setCart={setCart} openPayment={requestCheckout} />
          </div>
        </div>
      </div>

      {/* Mobile cart drawer */}
      {isMobileCartOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 animate-fade-in"
          onClick={() => setIsMobileCartOpen(false)}
          style={{
            background: "rgba(42,27,14,0.5)",
            backdropFilter: "blur(4px)",
          }}
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
                requestCheckout();
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
            background:
              "linear-gradient(135deg, #B88B5A 0%, #9C6B3F 50%, #5A3920 100%)",
            color: "#FAF6EF",
            boxShadow:
              "0 8px 28px rgba(156,107,63,0.45), 0 1px 0 rgba(255,255,255,0.2) inset",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" x2="21" y1="6" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="font-bold text-sm">{cartCount}</span>
          <span className="text-xs opacity-70">·</span>
          <span className="font-bold text-sm tabular">{fmt(cartTotal)}</span>
        </button>
      )}

      {isAuthOpen && (
        <AuthModal
          close={() => setIsAuthOpen(false)}
          onAuthenticated={handleAuthenticated}
        />
      )}
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
