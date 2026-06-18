import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Landing route for the OAuth redirect (/auth/callback?token=... or ?error=...).
 * AuthContext already reads the token/error from the URL on mount, stores the
 * session, and clears the query string. This page just shows a brief status
 * and sends the user back home once bootstrap finishes.
 */
function AuthCallback() {
  const { loading, oauthError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    // Small delay so the error (if any) is readable; otherwise go straight home.
    const delay = oauthError ? 2500 : 0;
    const t = setTimeout(() => navigate("/", { replace: true }), delay);
    return () => clearTimeout(t);
  }, [loading, oauthError, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 text-codex-muted">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-codex-accent border-t-transparent" />
      {oauthError ? (
        <p className="text-red-500 text-sm px-6 text-center max-w-sm">
          {oauthError}
        </p>
      ) : (
        <p className="text-sm">Signing you in...</p>
      )}
    </div>
  );
}

export default AuthCallback;
