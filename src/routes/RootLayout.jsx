import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import SearchOverlay from "../components/layout/SearchOverlay.jsx";
import Toaster from "../components/layout/Toaster.jsx";
import ErrorBoundary from "../components/common/ErrorBoundary.jsx";
import SalePopup from "../components/common/SalePopup.jsx";

/**
 * Chrome that wraps every route.
 *
 * Previously the header and footer were imported inside Home only, so three of
 * the four pages rendered with no navigation at all. Nesting every route under
 * this layout fixes that in one place and keeps the search overlay and toasts
 * mounted across navigations. The bag is its own page at /cart, like /wishlist.
 */

/* Routes that own the full viewport. The footer is omitted so nothing sits
   below the fold to scroll into — the auth screen is a single locked frame
   with its filmstrip pinned in place. */
const FULL_SCREEN_ROUTES = ["/auth"];

export default function RootLayout() {
  const { pathname } = useLocation();
  const isFullScreen = FULL_SCREEN_ROUTES.includes(pathname);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {!isFullScreen && <Footer />}

      <SearchOverlay />
      <Toaster />
      <SalePopup />
    </>
  );
}
