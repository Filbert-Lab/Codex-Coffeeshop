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
    <div onClick={close} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex justify-center items-center animate-fade-in">
      <div onClick={(e) => e.stopPropagation()} className="bg-codex-dark w-[380px] p-8 rounded-2xl text-codex-light shadow-2xl relative animate-slide-up">
        <button onClick={close} className="absolute top-4 right-4 text-codex-muted hover:text-white transition text-xl">✕</button>

        <div className="text-center mb-6">
          <span className="text-3xl">☕</span>
          <h2 className="font-display text-2xl font-bold mt-1 text-codex-accent">
            {isLogin ? "Welcome Back" : "Join Codex"}
          </h2>
          <p className="text-codex-muted text-sm mt-1">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm px-4 py-2.5 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input type="text" placeholder="Full Name" value={form.name} onChange={set("name")} required
              className="w-full px-4 py-3 rounded-xl bg-codex-surface border border-codex-surface text-codex-light placeholder-codex-muted outline-none focus:border-codex-accent transition" />
          )}
          <input type="email" placeholder="Email Address" value={form.email} onChange={set("email")} required
            className="w-full px-4 py-3 rounded-xl bg-codex-surface border border-codex-surface text-codex-light placeholder-codex-muted outline-none focus:border-codex-accent transition" />
          <input type="password" placeholder="Password" value={form.password} onChange={set("password")} required
            className="w-full px-4 py-3 rounded-xl bg-codex-surface border border-codex-surface text-codex-light placeholder-codex-muted outline-none focus:border-codex-accent transition" />
          {!isLogin && (
            <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={set("confirmPassword")} required
              className="w-full px-4 py-3 rounded-xl bg-codex-surface border border-codex-surface text-codex-light placeholder-codex-muted outline-none focus:border-codex-accent transition" />
          )}
          <button disabled={loading} type="submit"
            className="w-full py-3 bg-codex-accent text-white font-bold rounded-xl hover:brightness-110 transition disabled:opacity-50 mt-2">
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-codex-muted mt-5">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-codex-accent hover:underline font-semibold">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;