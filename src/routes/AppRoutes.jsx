import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./RootLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import { LoadingBlock } from "../components/ui/Feedback.jsx";

/* Home loads eagerly — it is the first paint and should not wait on a chunk.
   Everything else is split, so a visitor who only browses never downloads
   checkout, account or auth code. */
import Home from "../pages/Home.jsx";

const Shop = lazy(() => import("../pages/Shop.jsx"));
const About = lazy(() => import("../pages/About.jsx"));
const Sale = lazy(() => import("../pages/Sale.jsx"));
const CategoriesPage = lazy(() => import("../pages/CategoriesPage.jsx"));
const CategoryPage = lazy(() => import("../pages/CategoryPage.jsx"));
const SubcategoryPage = lazy(() => import("../pages/SubcategoryPage.jsx"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage.jsx"));
const CreatorPage = lazy(() => import("../pages/CreatorPage.jsx"));
const CreatorsPage = lazy(() => import("../pages/CreatorsPage.jsx"));
const CollaborationPage = lazy(() => import("../pages/CollaborationPage.jsx"));
const CollaborationsPage = lazy(
  () => import("../pages/CollaborationsPage.jsx"),
);
const PartnerPicksPage = lazy(() => import("../pages/PartnerPicksPage.jsx"));
const PartnerRedirectPage = lazy(
  () => import("../pages/PartnerRedirectPage.jsx"),
);
const BudgetGiftingPage = lazy(() => import("../pages/BudgetGiftingPage.jsx"));
const SearchPage = lazy(() => import("../pages/SearchPage.jsx"));
const GiftBoxPage = lazy(() => import("../pages/GiftBoxPage.jsx"));
const WishlistPage = lazy(() => import("../pages/WishlistPage.jsx"));
const CartPage = lazy(() => import("../pages/CartPage.jsx"));
const AuthPage = lazy(() => import("../pages/AuthPage.jsx"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage.jsx"));
const OrderConfirmationPage = lazy(
  () => import("../pages/OrderConfirmationPage.jsx"),
);
const AccountPage = lazy(() => import("../pages/AccountPage.jsx"));
const OrderHistoryPage = lazy(() => import("../pages/OrderHistoryPage.jsx"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage.jsx"));

/* Customer Support & Policy Pages */
const FAQPage = lazy(() => import("../pages/FAQPage.jsx"));
const ShippingPolicyPage = lazy(
  () => import("../pages/ShippingPolicyPage.jsx"),
);
const ReturnRefundPolicyPage = lazy(
  () => import("../pages/ReturnRefundPolicyPage.jsx"),
);
const TermsPage = lazy(() => import("../pages/TermsPage.jsx"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicyPage.jsx"));
const ContactPage = lazy(() => import("../pages/ContactPage.jsx"));
const TrackOrderPage = lazy(() => import("../pages/TrackOrderPage.jsx"));

function RouteFallback() {
  return (
    <div className="container" style={{ paddingBlock: "var(--sp-12)" }}>
      <LoadingBlock />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />

            <Route path="shop" element={<Shop />} />
            <Route path="about" element={<About />} />
            <Route path="sale" element={<Sale />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="budget-gifting" element={<BudgetGiftingPage />} />
            <Route path="gift-box" element={<GiftBoxPage />} />
            <Route path="partner-picks" element={<PartnerPicksPage />} />
            <Route path="partner/:slug" element={<PartnerRedirectPage />} />

            <Route path="categories" element={<CategoriesPage />} />
            <Route path="category/:categoryId" element={<CategoryPage />} />
            <Route
              path="category/:categoryId/subcategory/:subcategoryId"
              element={<SubcategoryPage />}
            />

            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="collaborations" element={<CollaborationsPage />} />
            <Route
              path="collaboration/:collabSlug"
              element={<CollaborationPage />}
            />
            <Route path="creators" element={<CreatorsPage />} />
            <Route path="creator/:slug" element={<CreatorPage />} />

            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="auth" element={<AuthPage />} />

            {/* Customer Support & Policies */}
            <Route path="faq" element={<FAQPage />} />
            <Route path="shipping" element={<ShippingPolicyPage />} />
            <Route path="shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="returns" element={<ReturnRefundPolicyPage />} />
            <Route
              path="return-refund-policy"
              element={<ReturnRefundPolicyPage />}
            />
            <Route path="terms" element={<TermsPage />} />
            <Route path="terms-and-conditions" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="contact-us" element={<ContactPage />} />
            <Route path="track-order" element={<TrackOrderPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="checkout" element={<CheckoutPage />} />
              <Route
                path="order/:orderId"
                element={<OrderConfirmationPage />}
              />
              <Route path="account" element={<AccountPage />} />
              <Route path="account/orders" element={<OrderHistoryPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
