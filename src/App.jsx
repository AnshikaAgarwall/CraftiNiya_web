import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

/**
 * Provider order matters: Auth sits outermost because signing in triggers the
 * guest cart and wishlist merge, so those providers must already exist.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <UIProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </UIProvider>
    </ErrorBoundary>
  );
}
