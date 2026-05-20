import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AuthModal({ close, onAuthenticated }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLogin && form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    try {
      let authenticatedUser;
      if (isLogin) {
        authenticatedUser = await login(form.email, form.password);
      } else {
        authenticatedUser = await register(
          form.name,
          form.email,
          form.password,
        );
      }
      onAuthenticated?.(authenticatedUser, isLogin ? "login" : "register");
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 backdrop-blur-sm z-[1000] flex justify-center items-center animate-fade-in"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[400px] p-8 rounded-2xl text-codex-text shadow-2xl relative animate-slide-up overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8DCC4",
          boxShadow: "0 24px 64px rgba(42,27,14,0.5)",
        }}
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-codex-accent/70 to-transparent" />
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(156,107,63,0.06)" }}
        />

        <button
          onClick={close}
          className="absolute top-5 right-5 text-codex-muted hover:text-codex-text transition-all duration-300 w-8 h-8 flex items-center justify-center rounded-lg"
          style={{ background: "#F4ECDF" }}
        >
          ✕
        </button>

        <div className="text-center mb-7 relative z-10">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center shadow-lg shadow-codex-accent/20 mb-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-codex-bg"
            >
              <path
                d="M17 8h1a4 4 0 0 1 0 8h-1"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M6 2v3M10 2v3M14 2v3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-codex-accent">
            {isLogin ? "Welcome Back" : "Join Codex"}
          </h2>
          <p className="text-codex-muted text-sm mt-1">
            {isLogin
              ? "Sign in to continue your coffee journey"
              : "Create your account to get started"}
          </p>
        </div>

        {error && (
          <div
            className="text-red-400 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <span className="text-base">⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={set("name")}
              required
              className="input-field"
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={set("email")}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={set("password")}
            required
            className="input-field"
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              required
              className="input-field"
            />
          )}
          <button
            disabled={loading}
            type="submit"
            className="btn-primary w-full py-3.5 text-base disabled:opacity-50 mt-1"
          >
            <span className="relative">
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </span>
          </button>
        </form>

        <p className="text-center text-sm text-codex-muted mt-6 relative z-10">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-codex-accent hover:text-codex-accent-light font-semibold transition-colors duration-200"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
