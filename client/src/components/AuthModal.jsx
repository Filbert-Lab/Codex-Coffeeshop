import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AuthModal({ close }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
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
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={close} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex justify-center items-center animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-dark w-[400px] p-8 rounded-3xl text-codex-light shadow-2xl relative animate-slide-up overflow-hidden"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-codex-accent via-codex-accent-dark to-codex-accent" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-codex-accent/10 rounded-full blur-3xl pointer-events-none" />

        <button onClick={close} className="absolute top-5 right-5 text-codex-muted/40 hover:text-white transition-all duration-300 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06]">
          ✕
        </button>

        <div className="text-center mb-7 relative z-10">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center shadow-lg shadow-codex-accent/20 mb-3">
            <span className="text-2xl">☕</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-codex-accent">
            {isLogin ? "Welcome Back" : "Join Codex"}
          </h2>
          <p className="text-codex-muted/60 text-sm mt-1">
            {isLogin ? "Sign in to continue your coffee journey" : "Create your account to get started"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <span className="text-base">⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          {!isLogin && (
            <input type="text" placeholder="Full Name" value={form.name} onChange={set("name")} required
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.06] text-codex-light placeholder-codex-muted/40 outline-none focus:border-codex-accent/50 focus:bg-white/[0.08] transition-all duration-300" />
          )}
          <input type="email" placeholder="Email Address" value={form.email} onChange={set("email")} required
            className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.06] text-codex-light placeholder-codex-muted/40 outline-none focus:border-codex-accent/50 focus:bg-white/[0.08] transition-all duration-300" />
          <input type="password" placeholder="Password" value={form.password} onChange={set("password")} required
            className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.06] text-codex-light placeholder-codex-muted/40 outline-none focus:border-codex-accent/50 focus:bg-white/[0.08] transition-all duration-300" />
          {!isLogin && (
            <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={set("confirmPassword")} required
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.06] text-codex-light placeholder-codex-muted/40 outline-none focus:border-codex-accent/50 focus:bg-white/[0.08] transition-all duration-300" />
          )}
          <button disabled={loading} type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-codex-accent to-codex-accent-dark text-white font-bold rounded-xl hover:shadow-accent-glow transition-all duration-300 disabled:opacity-50 mt-1 active:scale-[0.97] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
            <span className="relative">{loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}</span>
          </button>
        </form>

        <p className="text-center text-sm text-codex-muted/50 mt-6 relative z-10">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-codex-accent hover:text-codex-accent/80 font-semibold transition-colors duration-200">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;