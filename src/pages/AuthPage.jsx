import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import Button from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Field.jsx";
import FilmstripShowcase from "../features/auth/FilmstripShowcase.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { BRAND } from "../config/site.js";
import { cn } from "../lib/cn.js";
import s from "./AuthPage.module.css";

/**
 * Sign in and sign up on one route.
 *
 * Mode lives in ?mode= rather than in two separate pages, because the brief
 * calls for toggling without a reload and because the typed email must survive
 * the switch — two routes would unmount the form and throw it away.
 */
export default function AuthPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated, loading, pending } = useAuth();
  const { toast } = useUI();

  const mode = params.get("mode") === "signup" ? "signup" : "signin";
  const redirect = params.get("redirect") || "/account";
  const isSignUp = mode === "signup";

  // Shared across the toggle by design — switching modes keeps what was typed.
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  if (!loading && isAuthenticated) {
    return <Navigate to={redirect} replace />;
  }

  const setMode = (next) => {
    setErrors({});
    setFormError(null);
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        p.set("mode", next);
        return p;
      },
      { replace: true },
    );
  };

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    try {
      if (isSignUp) await signUp(form);
      else await signIn({ email: form.email, password: form.password });

      toast(isSignUp ? `Welcome to ${BRAND.name}` : "Welcome back", { type: "success" });
      navigate(redirect, { replace: true });
    } catch (err) {
      if (err?.details) setErrors(err.details);
      else setFormError(err?.message ?? "Something went wrong. Please try again.");
    }
  };
  // Mobile 3-line rotating composition subcategories
  const tickerSubcategories = [
    "Wall Decor",
    "Scented Candles",
    "Crochet Bouquets",
    "Nameplates",
    "Pooja Thalis",
    "Tote Bags",
    "Decorative Clocks",
    "Resin Frames",
    "Festive Torans",
    "Wax Melts",
    "Gift Hampers",
    "Plushies",
    "Bubble Candles",
    "Keychains",
  ];
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerSubcategories.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [tickerSubcategories.length]);

  return (
    <>
      <SEO title={isSignUp ? "Create an account" : "Sign in"} noIndex />

      <div className={s.page}>
        {/* Brand name on top middle so user can get back home by clicking it */}
        <header className={s.brandBar}>
          <Link to="/" className={s.brandLogo} aria-label={`${BRAND.name} Home`}>
            <span className={s.brandName}>{BRAND.name}</span>
            <span className={s.brandTagline}>{BRAND.tagline}</span>
          </Link>
        </header>

        {/* Mobile-only 3-Line Centered Rotating Typography Composition */}
        <div className={s.mobileCompositionBanner} aria-label="CraftiNiya Category Spotlight">
          <div className={s.compositionContainer}>
            {/* Line 1: Top, Centered, Fixed Static Text */}

            {/* Line 2: Middle, Dynamic Rotating Text with Left (outgoing), Center (active), Right (incoming) slots */}
            <div className={s.compLine2Track}>
              <div
                key={tickerIndex}
                className={s.compSlotsWrapper}
                aria-live="polite"
              >
                {/* Left Slot: Outgoing Keyword (faded, off-focus) */}
                <span className={s.compSlotLeft} aria-hidden="true">
                  {tickerSubcategories[(tickerIndex - 1 + tickerSubcategories.length) % tickerSubcategories.length]}
                </span>

                {/* Center Slot: Active Keyword (main focus, 100% opacity) */}
                <span className={s.compSlotCenter}>
                  {tickerSubcategories[tickerIndex]}
                </span>

                {/* Right Slot: Incoming Keyword (faded, off-focus) */}
                <span className={s.compSlotRight} aria-hidden="true">
                  {tickerSubcategories[(tickerIndex + 1) % tickerSubcategories.length]}
                </span>
              </div>
            </div>

            {/* Line 3: Bottom, Centered, Fixed Static Text */}
          </div>
        </div>

        <div className={s.panel}>
          <div className={s.formWrap}>
            <div className={s.toggle} role="tablist" aria-label="Account">
              <button
                type="button"
                role="tab"
                aria-selected={!isSignUp}
                className={cn(s.toggleButton, !isSignUp && s.toggleActive)}
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isSignUp}
                className={cn(s.toggleButton, isSignUp && s.toggleActive)}
                onClick={() => setMode("signup")}
              >
                Create account
              </button>
            </div>

            {/* Announced so the mode change is not silent for screen readers. */}
            <p className="sr-only" aria-live="polite">
              {isSignUp ? "Create account form" : "Sign in form"}
            </p>

            <form className={s.form} onSubmit={submit} noValidate>
              {isSignUp && (
                <Input
                  label="Your name"
                  value={form.name}
                  onChange={setField("name")}
                  error={errors.name}
                  autoComplete="name"
                  startIcon={<User />}
                  required
                />
              )}

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={setField("email")}
                error={errors.email}
                autoComplete="email"
                startIcon={<Mail />}
                required
              />

              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={setField("password")}
                error={errors.password}
                hint={isSignUp ? "At least 8 characters." : undefined}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                startIcon={<Lock />}
                required
              />

              {formError && (
                <p className={s.formError} role="alert">
                  {formError}
                </p>
              )}

              <Button type="submit" size="lg" fullWidth loading={pending}>
                {isSignUp ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className={s.switch}>
              {isSignUp ? "Already have an account?" : "New to Craftiniya?"}{" "}
              <button
                type="button"
                onClick={() => setMode(isSignUp ? "signin" : "signup")}
              >
                {isSignUp ? "Sign in instead" : "Create one"}
              </button>
            </p>

            <p className={s.legal}>
              By continuing you agree to our terms and privacy policy. We only
              email about your orders.
            </p>
          </div>

          <FilmstripShowcase />
        </div>
      </div>
    </>
  );
}
