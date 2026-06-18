import { createContext, useContext, useState, useEffect, useRef } from "react";
import * as api from "../api";

const AuthContext = createContext(null);

const TOKEN_KEY = "codex_token";
const USER_KEY = "codex_user";

/** Pulls ?token=... or ?error=... out of the current URL (set by OAuth callback). */
function extractAuthFromQuery() {
  if (typeof window === "undefined") return { token: null, error: null };
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const error = params.get("error");
  if (token || error) {
    // Strip the query so a refresh doesn't re-trigger the flow.
    params.delete("token");
    params.delete("error");
    const cleanQuery = params.toString();
    const newUrl =
      window.location.pathname +
      (cleanQuery ? "?" + cleanQuery : "") +
      window.location.hash;
    window.history.replaceState({}, document.title, newUrl);
  }
  return { token, error };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [oauthError, setOauthError] = useState(null);
  // Transient signal so the UI can flash a "welcome back" toast right after
  // an OAuth redirect login (where handleAuthenticated never fires).
  const [oauthWelcome, setOauthWelcome] = useState(null);
  // Transient signal so the UI can flash a "logged out" toast — survives the
  // redirect from the admin panel back to the storefront.
  const [logoutFlash, setLogoutFlash] = useState(null);
  const bootstrapRun = useRef(false);

  // Initial bootstrap: pick up OAuth callback token, then restore session
  useEffect(() => {
    if (bootstrapRun.current) return;
    bootstrapRun.current = true;

    (async () => {
      const { token: oauthToken, error } = extractAuthFromQuery();
      if (error) setOauthError(decodeURIComponent(error));

      // 1) If OAuth handed us a fresh token, store it and fetch the user.
      if (oauthToken) {
        localStorage.setItem(TOKEN_KEY, oauthToken);
        try {
          const res = await api.fetchCurrentUser();
          if (res?.data?.user) {
            localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
            setUser(res.data.user);
            setOauthWelcome(res.data.user);
          }
        } catch {
          // Token didn't validate — clean up so we don't loop.
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        } finally {
          setLoading(false);
        }
        return;
      }

      // 2) Otherwise restore from localStorage (if any)
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      }
      setLoading(false);
    })();
  }, []);

  // Fetch enabled OAuth providers (best-effort; ignore failures)
  useEffect(() => {
    const ac = new AbortController();
    api
      .getAuthProviders(ac.signal)
      .then((res) => setProviders(res?.data?.providers || []))
      .catch(() => {});
    return () => ac.abort();
  }, []);

  const persistSession = (token, nextUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (email, password) => {
    const res = await api.login(email, password);
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  /** Kick off an OAuth flow. The browser will be redirected away. */
  const loginWithProvider = (provider) => {
    if (!providers.includes(provider)) {
      throw new Error(`${provider} sign-in is not enabled on this server`);
    }
    window.location.href = api.oauthStartUrl(provider);
  };

  const logout = () => {
    const previousUser = user;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    // Flag so the storefront can flash a "logged out" toast (survives the
    // admin -> storefront redirect).
    setLogoutFlash(previousUser || { name: "" });
    // Stateless server — fire-and-forget, ignore errors
    api.logoutApi().catch(() => {});
    return previousUser;
  };

  const clearOauthError = () => setOauthError(null);
  const clearOauthWelcome = () => setOauthWelcome(null);
  const clearLogoutFlash = () => setLogoutFlash(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithProvider,
        logout,
        providers,
        oauthError,
        clearOauthError,
        oauthWelcome,
        clearOauthWelcome,
        logoutFlash,
        clearLogoutFlash,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
