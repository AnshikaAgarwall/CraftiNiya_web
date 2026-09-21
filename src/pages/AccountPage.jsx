import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Check,
  ChevronRight,
  Edit2,
  FileText,
  Headphones,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  RotateCcw,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import Button from "../components/ui/Button.jsx";
import { Input, Select } from "../components/ui/Field.jsx";
import { Modal } from "../components/ui/Overlay.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import orderService from "../services/orderService.js";
import { formatDate } from "../lib/format.js";
import s from "./AccountPage.module.css";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Chandigarh",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
];

const GENDER_OPTIONS = ["Female", "Male", "Other"];

function calculateAge(dobString) {
  if (!dobString) return "";
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return "";
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  const years = Math.abs(ageDate.getUTCFullYear() - 1970);
  return years > 0 && years < 120 ? String(years) : "";
}

export default function AccountPage() {
  const { user, signOut, updateProfile, changePassword, pending } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { toast } = useUI();
  const fileInputRef = useRef(null);

  // Profile fields state
  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "+91 98765 43210");
  const [alternatePhone, setAlternatePhone] = useState(user?.alternatePhone ?? "");
  const [dob, setDob] = useState(user?.dob ?? "");
  const [age, setAge] = useState(user?.age ?? "");
  const [gender, setGender] = useState(user?.gender ?? "Female");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.alternatePhone) setAlternatePhone(user.alternatePhone);
      if (user.dob) setDob(user.dob);
      if (user.age) setAge(user.age);
      if (user.gender) setGender(user.gender);
      if (user.avatarUrl) setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  // Saved addresses state
  const {
    data: addresses,
    refetch: refetchAddresses,
  } = useAsync((opts) => orderService.getAddresses(opts), []);

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    title: "",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
    country: "India",
    isDefault: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);

  // Password modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Orders data
  const { data: orders } = useAsync(
    (opts) => orderService.getOrders({ pageSize: 3 }, opts),
    [],
  );

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("Image must be smaller than 5MB", { type: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
        try {
          await updateProfile({ avatarUrl: dataUrl });
          toast("Avatar updated successfully", { type: "success" });
        } catch (err) {
          toast(err?.message ?? "Could not save photo", { type: "error" });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // When DOB changes, auto calculate age if age field is not manually locked
  const handleDobChange = (e) => {
    const nextDob = e.target.value;
    setDob(nextDob);
    const calculated = calculateAge(nextDob);
    if (calculated) setAge(calculated);
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast("Name cannot be empty", { type: "error" });
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        alternatePhone: alternatePhone.trim(),
        dob,
        age,
        gender,
        avatarUrl,
      });
      toast("Account details saved successfully", { type: "success" });
    } catch (err) {
      toast(err?.message ?? "Could not save account details", { type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  // Address modal helpers
  const openNewAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      title: `Address ${(addresses?.length ?? 0) + 1}`,
      fullName: name || (user?.name ?? ""),
      phone: phone || "+91 98765 43210",
      line1: "",
      line2: "",
      city: "",
      state: "Rajasthan",
      pincode: "",
      country: "India",
      isDefault: (addresses?.length ?? 0) === 0,
    });
    setAddressModalOpen(true);
  };

  const openEditAddressModal = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      title: addr.title ?? "",
      fullName: addr.fullName ?? "",
      phone: addr.phone ?? "",
      line1: addr.line1 ?? "",
      line2: addr.line2 ?? "",
      city: addr.city ?? "",
      state: addr.state ?? "Rajasthan",
      pincode: addr.pincode ?? "",
      country: addr.country ?? "India",
      isDefault: Boolean(addr.isDefault),
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName.trim()) {
      toast("Full name is required", { type: "error" });
      return;
    }
    if (!addressForm.line1.trim()) {
      toast("Address line 1 is required", { type: "error" });
      return;
    }
    if (!addressForm.city.trim()) {
      toast("City is required", { type: "error" });
      return;
    }
    if (!addressForm.state.trim()) {
      toast("State is required", { type: "error" });
      return;
    }
    if (!addressForm.pincode.trim()) {
      toast("Pincode is required", { type: "error" });
      return;
    }

    setSavingAddress(true);
    try {
      await orderService.saveAddress({
        ...(editingAddressId ? { id: editingAddressId } : {}),
        title: addressForm.title || `Address ${(addresses?.length ?? 0) + 1}`,
        fullName: addressForm.fullName.trim(),
        phone: addressForm.phone.trim(),
        line1: addressForm.line1.trim(),
        line2: addressForm.line2.trim(),
        city: addressForm.city.trim(),
        state: addressForm.state,
        pincode: addressForm.pincode.trim(),
        country: addressForm.country || "India",
        isDefault: addressForm.isDefault,
      });
      await refetchAddresses();
      setAddressModalOpen(false);
      toast(editingAddressId ? "Address updated" : "New address added", {
        type: "success",
      });
    } catch (err) {
      toast(err?.message ?? "Could not save address", { type: "error" });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await orderService.deleteAddress(id);
      await refetchAddresses();
      toast("Address removed", { type: "success" });
    } catch (err) {
      toast(err?.message ?? "Could not delete address", { type: "error" });
    }
  };

  // Change password handler
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword) {
      toast("Please enter a new password", { type: "error" });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast("New password must be at least 8 characters", { type: "error" });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast("New passwords do not match", { type: "error" });
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast("Password changed successfully", { type: "success" });
    } catch (err) {
      toast(err?.message ?? "Could not change password", { type: "error" });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <SEO title="Your Account — CraftiNiya" noIndex />

      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Account" }]}
        eyebrow="Member Portal"
        title="Your Account"
        description="Manage your profile details, delivery addresses, orders and preferences."
      />

      <div className={`container ${s.wrap}`}>
        {/* Top Profile Banner Card */}
        <section className={s.profileBanner}>
          <div className={s.avatarContainer}>
            <div className={s.avatarRing}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name || "Profile"}
                  className={s.avatarImage}
                />
              ) : (
                <div className={s.avatarFallback}>
                  {name ? name.slice(0, 2).toUpperCase() : <User size={36} />}
                </div>
              )}
              <button
                type="button"
                className={s.avatarUploadBtn}
                onClick={() => fileInputRef.current?.click()}
                title="Upload profile picture"
                aria-label="Upload profile picture"
              >
                <Camera size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={s.hiddenFileInput}
              onChange={handleAvatarChange}
            />
          </div>

          <div className={s.profileMeta}>
            <h1 className={s.profileName}>{name || "Anshika Agarwal"}</h1>
            <p className={s.profileEmail}>{email || "anshika@gmail.com"}</p>
            <div className={s.profileBadges}>
              <span className={s.profileBadge}>CraftiNiya Member</span>
              <span className={s.profileSubBadge}>{phone || "+91 98765 43210"}</span>
            </div>
          </div>
        </section>

        {/* Main 2-Column Responsive Grid */}
        <div className={s.mainGrid}>
          {/* Left Column: Edit Details + Addresses + Security */}
          <div className={s.leftCol}>
            {/* 1. Edit Account Details */}
            <section className={s.card}>
              <div className={s.cardHeader}>
                <div>
                  <h2 className={s.cardTitle}>Edit Account Details</h2>
                  <p className={s.cardSubtitle}>
                    Personal information and contact preferences
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className={s.form}>
                <div className={s.formGrid2}>
                  <Input
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Anshika Agarwal"
                    required
                  />

                  <Input
                    label="Email"
                    value={email || user?.email || "anshika@gmail.com"}
                    readOnly
                    hint="Associated with your login credentials"
                  />
                </div>

                <div className={s.formGrid2}>
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                  />

                  <Input
                    label="Alternate Phone Number"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    placeholder="+91 98765 43211"
                    autoComplete="tel"
                  />
                </div>

                <div className={s.formGrid3}>
                  <Input
                    label="Date of Birth (DOB)"
                    type="date"
                    value={dob}
                    onChange={handleDobChange}
                  />

                  <Input
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="24"
                  />

                  <div className={s.genderField}>
                    <label className={s.fieldLabel}>Gender</label>
                    <div className={s.genderPills}>
                      {GENDER_OPTIONS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          className={`${s.genderPill} ${gender === g ? s.genderPillActive : ""}`}
                          onClick={() => setGender(g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={s.formActions}>
                  <Button type="submit" loading={savingProfile} variant="primary">
                    Save Changes
                  </Button>
                </div>
              </form>
            </section>

            {/* 2. Saved Addresses */}
            <section className={s.card}>
              <div className={s.cardHeader}>
                <div>
                  <h2 className={s.cardTitle}>Saved Addresses</h2>
                  <p className={s.cardSubtitle}>
                    Default shipping destinations for fast checkout
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  startIcon={<Plus size={15} />}
                  onClick={openNewAddressModal}
                >
                  Add New Address
                </Button>
              </div>

              <div className={s.addressList}>
                {addresses?.length ? (
                  addresses.map((addr, idx) => (
                    <div key={addr.id} className={s.addressCard}>
                      <div className={s.addressHead}>
                        <div className={s.addressTitleRow}>
                          <span className={s.addressIndexBadge}>
                            {addr.title || `Address ${idx + 1}`}
                          </span>
                          {addr.isDefault && (
                            <span className={s.defaultBadge}>Default</span>
                          )}
                        </div>
                        <div className={s.addressActions}>
                          <button
                            type="button"
                            className={s.actionIconBtn}
                            onClick={() => openEditAddressModal(addr)}
                            title="Edit Address"
                            aria-label="Edit Address"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            className={`${s.actionIconBtn} ${s.deleteIconBtn}`}
                            onClick={() => handleDeleteAddress(addr.id)}
                            title="Delete Address"
                            aria-label="Delete Address"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <p className={s.addressBody}>
                        <strong className={s.recipientName}>
                          {addr.fullName || name}
                        </strong>
                        {addr.phone && (
                          <span className={s.recipientPhone}> · {addr.phone}</span>
                        )}
                        <br />
                        {addr.line1}
                        {addr.line2 && `, ${addr.line2}`}, {addr.city},{" "}
                        {addr.state}, {addr.pincode}, {addr.country || "India"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className={s.emptyAddress}>
                    <MapPin size={24} className={s.emptyIcon} />
                    <p>No addresses saved yet.</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={openNewAddressModal}
                    >
                      + Add your first address
                    </Button>
                  </div>
                )}
              </div>
            </section>

            {/* 3. Security Details */}
            <section className={s.card}>
              <div className={s.securityRow}>
                <div>
                  <h2 className={s.cardTitle}>Security Details</h2>
                  <p className={s.cardSubtitle}>
                    Password management and account protection
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  startIcon={<Lock size={15} />}
                  onClick={() => setPasswordModalOpen(true)}
                >
                  Change Password
                </Button>
              </div>
            </section>
          </div>

          {/* Right Column: Recent Orders + Wishlist & Bag below it + Support + Logout */}
          <div className={s.rightCol}>
            {/* 1. Recent Orders */}
            <section className={s.card}>
              <div className={s.cardHeader}>
                <div>
                  <h2 className={s.cardTitle}>Recent Orders</h2>
                  <p className={s.cardSubtitle}>Your latest purchases</p>
                </div>
                <Link to="/account/orders" className={s.cardLink}>
                  View all
                </Link>
              </div>

              {orders?.items?.length ? (
                <ul className={s.ordersList}>
                  {orders.items.map((order) => (
                    <li key={order.id}>
                      <Link to={`/order/${order.id}`} className={s.orderItem}>
                        <div className={s.orderInfo}>
                          <span className={s.orderNumber}>{order.orderNumber}</span>
                          <span className={s.orderMeta}>
                            {formatDate(order.placedAt)} · {order.lines.length} item
                            {order.lines.length === 1 ? "" : "s"}
                          </span>
                        </div>
                        <span className={s.orderStatusBadge}>
                          {order.status}
                        </span>
                        <ChevronRight size={16} className={s.chevronIcon} />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={s.emptyOrders}>
                  <Package size={28} className={s.emptyIcon} />
                  <p>No orders placed yet.</p>
                  <Button to="/shop" variant="ghost" size="sm">
                    Explore Handcrafted Shop
                  </Button>
                </div>
              )}
            </section>

            {/* 2. Wishlist, Orders & Saved Bag (Positioned directly below Recent Orders!) */}
            <section className={s.card}>
              <div className={s.cardHeader}>
                <div>
                  <h2 className={s.cardTitle}>Wishlist, Orders & Bag</h2>
                  <p className={s.cardSubtitle}>Direct shortcuts to your saved items</p>
                </div>
              </div>

              <div className={s.shortcutList}>
                <Link to="/wishlist" className={s.shortcutItem}>
                  <div className={s.shortcutIconWrap}>
                    <Heart size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>My Wishlist</span>
                    <span className={s.shortcutDesc}>
                      {wishlistCount} {wishlistCount === 1 ? "item" : "items"} saved
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </Link>

                <Link to="/cart" className={s.shortcutItem}>
                  <div className={s.shortcutIconWrap}>
                    <ShoppingBag size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>Shopping Cart</span>
                    <span className={s.shortcutDesc}>
                      {itemCount} {itemCount === 1 ? "item" : "items"} in saved bag
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </Link>

                <Link to="/account/orders" className={s.shortcutItem}>
                  <div className={s.shortcutIconWrap}>
                    <Package size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>My Orders</span>
                    <span className={s.shortcutDesc}>
                      {orders?.total ?? 0} {orders?.total === 1 ? "order" : "orders"} tracked
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </Link>
              </div>
            </section>

            {/* 3. Support & Policies */}
            <section className={s.card}>
              <div className={s.cardHeader}>
                <div>
                  <h2 className={s.cardTitle}>Support & Policies</h2>
                  <p className={s.cardSubtitle}>Help center and boutique guidelines</p>
                </div>
              </div>

              <div className={s.shortcutList}>
                {/* 1. Track Order */}
                <Link to="/track-order" className={s.shortcutItem}>
                  <div className={s.shortcutIconWrap}>
                    <MapPin size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>Track Your Order</span>
                    <span className={s.shortcutDesc}>
                      Live courier tracking & delivery status
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </Link>

                {/* 2. Help & FAQs */}
                <Link to="/faq" className={s.shortcutItem}>
                  <div className={s.shortcutIconWrap}>
                    <HelpCircle size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>Help & FAQs</span>
                    <span className={s.shortcutDesc}>
                      Answers on handmade art, candles, orders & resin care
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </Link>

                {/* 3. Shipping & Delivery Policy */}
                <Link to="/shipping-policy" className={s.shortcutItem}>
                  <div className={s.shortcutIconWrap}>
                    <Truck size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>Shipping & Delivery Policy</span>
                    <span className={s.shortcutDesc}>
                      Pan-India delivery, metro timelines & free shipping info
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </Link>

                {/* 4. Returns & Refunds Policy */}
                <Link to="/return-refund-policy" className={s.shortcutItem}>
                  <div className={s.shortcutIconWrap}>
                    <RotateCcw size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>Returns & Refunds</span>
                    <span className={s.shortcutDesc}>
                      7-day easy returns & replacement guarantee
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </Link>

                {/* 5. Contact Studio Support */}
                <Link to="/contact" className={s.shortcutItem}>
                  <div className={s.shortcutIconWrap}>
                    <MessageCircle size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>Contact Us & Studio Help</span>
                    <span className={s.shortcutDesc}>
                      WhatsApp, email support & custom order inquiries
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </Link>

                {/* 6. Terms & Conditions */}
                <Link to="/terms-and-conditions" className={s.shortcutItem}>
                  <div className={s.shortcutIconWrap}>
                    <FileText size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>Terms & Conditions</span>
                    <span className={s.shortcutDesc}>
                      Store policies, artisan sales terms & legal guidelines
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </Link>

                {/* 7. Privacy Policy */}
                <Link to="/privacy-policy" className={s.shortcutItem}>
                  <div className={s.shortcutIconWrap}>
                    <ShieldCheck size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>Privacy Policy</span>
                    <span className={s.shortcutDesc}>
                      256-bit encryption, data protection & checkout security
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </Link>

                {/* 8. Phone Helpline */}
                <a
                  href="tel:+919876543210"
                  className={s.shortcutItem}
                >
                  <div className={s.shortcutIconWrap}>
                    <Headphones size={18} />
                  </div>
                  <div className={s.shortcutDetails}>
                    <span className={s.shortcutTitle}>Direct Phone Helpline</span>
                    <span className={s.shortcutDesc}>
                      +91 98765 43210 (Mon–Sat: 10 AM – 7 PM IST)
                    </span>
                  </div>
                  <ChevronRight size={16} className={s.shortcutChevron} />
                </a>
              </div>
            </section>

            {/* 4. Sign Out */}
            <div className={s.signOutBlock}>
              <Button
                type="button"
                variant="danger"
                className={s.signOutBtn}
                startIcon={<LogOut size={16} />}
                onClick={signOut}
                loading={pending}
              >
                Log Out Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Add / Edit Modal */}
      <Modal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title={editingAddressId ? "Edit Address" : "Add New Address"}
        size="md"
      >
        <form onSubmit={handleSaveAddress} className={s.modalForm}>
          <div className={s.formGrid2}>
            <Input
              label="Address Label"
              value={addressForm.title}
              onChange={(e) =>
                setAddressForm({ ...addressForm, title: e.target.value })
              }
              placeholder="e.g. Home, Office, Studio"
            />
            <Input
              label="Full Name"
              value={addressForm.fullName}
              onChange={(e) =>
                setAddressForm({ ...addressForm, fullName: e.target.value })
              }
              placeholder="Recipient name"
              required
            />
          </div>

          <Input
            label="Phone Number"
            value={addressForm.phone}
            onChange={(e) =>
              setAddressForm({ ...addressForm, phone: e.target.value })
            }
            placeholder="+91 98765 43210"
            required
          />

          <Input
            label="Address Line 1"
            value={addressForm.line1}
            onChange={(e) =>
              setAddressForm({ ...addressForm, line1: e.target.value })
            }
            placeholder="House / Flat No., Building Name, Apartment"
            required
          />

          <Input
            label="Address Line 2"
            value={addressForm.line2}
            onChange={(e) =>
              setAddressForm({ ...addressForm, line2: e.target.value })
            }
            placeholder="Street Name, Area, Landmark"
          />

          <div className={s.formGrid3}>
            <Input
              label="City"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.target.value })
              }
              placeholder="e.g. Jaipur"
              required
            />

            <Select
              label="State"
              value={addressForm.state}
              onChange={(e) =>
                setAddressForm({ ...addressForm, state: e.target.value })
              }
              options={INDIAN_STATES.map((st) => ({ value: st, label: st }))}
              required
            />

            <Input
              label="Pincode"
              value={addressForm.pincode}
              onChange={(e) =>
                setAddressForm({ ...addressForm, pincode: e.target.value })
              }
              placeholder="302001"
              required
            />
          </div>

          <Input
            label="Country"
            value={addressForm.country}
            onChange={(e) =>
              setAddressForm({ ...addressForm, country: e.target.value })
            }
            placeholder="India"
            readOnly
          />

          <div className={s.checkboxRow}>
            <label className={s.checkboxLabel}>
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, isDefault: e.target.checked })
                }
                className={s.checkboxInput}
              />
              <span>Set as default delivery address</span>
            </label>
          </div>

          <div className={s.modalActions}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={savingAddress}>
              Save Address
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Change Password"
        size="sm"
      >
        <form onSubmit={handleSavePassword} className={s.modalForm}>
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            placeholder="Enter current password"
          />

          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            placeholder="At least 8 characters"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
            placeholder="Re-enter new password"
            required
          />

          <div className={s.modalActions}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={savingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
