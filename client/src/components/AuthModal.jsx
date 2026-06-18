import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AuthModal({ close, onAuthenticated }) {
  const { login, register, loginWithProvider, providers } = useAuth();
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

  const handleOAuth = (provider) => {
    try {
      // Browser will be redirected away; no further work here.
      loginWithProvider(provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const hasOAuth = providers && providers.length > 0;

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

        {/* OAuth providers */}
        {hasOAuth && (
          <div className="space-y-2.5 mb-4 relative z-10">
            {providers.includes("google") && (
              <OAuthButton
                provider="google"
                onClick={() => handleOAuth("google")}
              />
            )}
            {providers.includes("github") && (
              <OAuthButton
                provider="github"
                onClick={() => handleOAuth("github")}
              />
            )}
            <Divider />
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

function Divider() {
  return (
    <div className="flex items-center gap-3 pt-1.5">
      <div className="flex-1 h-px" style={{ background: "#E8DCC4" }} />
      <span className="text-[10px] uppercase tracking-widest font-semibold text-codex-muted">
        or with email
      </span>
      <div className="flex-1 h-px" style={{ background: "#E8DCC4" }} />
    </div>
  );
}

function OAuthButton({ provider, onClick }) {
  if (provider === "google") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.99]"
        style={{
          background: "#FFFFFF",
          color: "#1F2937",
          border: "1px solid #E8DCC4",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <GoogleIcon />
        Continue with Google
      </button>
    );
  }
  if (provider === "github") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.99]"
        style={{
          background: "#1F2328",
          color: "#FFFFFF",
          border: "1px solid #1F2328",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        <GitHubIcon />
        Continue with GitHub
      </button>
    );
  }
  return null;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.3 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8c1.8-4.4 6-7.5 11.1-7.5 3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.3 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3c-2 1.5-4.6 2.6-7.4 2.6-5.3 0-9.7-3.3-11.3-8L6 32.7C9.4 39.5 16.1 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.4l6.3 5.3C40.3 35.8 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.19 0 .31.21.68.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export default AuthModal;
