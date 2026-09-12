import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LoadingBlock } from "../components/ui/Feedback.jsx";

/**
 * Gate for /checkout and /account.
 *
 * The `loading` check matters: without it the app decides "logged out" for one
 * frame before the session resolves, bouncing a signed-in user to the sign-in
 * screen on every refresh.
 *
 * The attempted path is passed through as ?redirect= so sign-in returns the
 * user where they were going rather than dumping them on the home page.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ paddingBlock: "var(--sp-12)" }}>
        <LoadingBlock label="Checking your session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?mode=signin&redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}
