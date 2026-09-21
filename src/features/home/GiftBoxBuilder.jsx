import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Gift, X, ShoppingBag, Pencil, CheckCircle2, Package, Plus, Sparkles, RefreshCw } from "lucide-react";
import { useAsync } from "../../hooks/useAsync.js";
import productService from "../../services/productService.js";
import { useCart } from "../../context/CartContext.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { formatINR, toMinor } from "../../lib/money.js";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import LazyImage from "../../components/common/LazyImage.jsx";
import s from "./GiftBoxBuilder.module.css";

const PACKAGING_MINOR = 2000; // ₹20 in paise
const PRESET_BUDGETS = [299, 499, 799, 999, 1499, 1999];

export default function GiftBoxBuilder() {
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetMinor, setBudgetMinor] = useState(0);
  const [picked, setPicked] = useState([]);
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);
  const receiptRef = useRef(null);

  const { addItem, pending } = useCart();
  const { toast } = useUI();

  const { data: allProductsEnvelope, loading } = useAsync(
    (opts) => productService.getProducts({ inStock: true, pageSize: 200, sort: "price-asc" }, opts),
    [],
  );
  const allProducts = allProductsEnvelope?.items ?? [];

  const pickedTotal = useMemo(
    () => picked.reduce((sum, p) => sum + p.effectivePriceMinor, 0),
    [picked],
  );

  // Budget for items: Remaining budget strictly reflects user product budget
  const remaining = budgetMinor > 0 ? budgetMinor - pickedTotal : 0;
  // Packaging fee ₹20 is added to grand total like GST
  const grandTotal = pickedTotal + (picked.length > 0 ? PACKAGING_MINOR : 0);
  const isReady = picked.length > 0 && remaining >= 0;
  const usedPct = budgetMinor > 0
    ? Math.min(100, Math.round((pickedTotal / budgetMinor) * 100))
    : 0;

  // Products that fit in the remaining budget and have not been picked yet
  const available = useMemo(() => {
    if (budgetMinor <= 0) return [];
    const pickedIds = new Set(picked.map((p) => p.id));
    return allProducts.filter(
      (p) => !pickedIds.has(p.id) && p.effectivePriceMinor <= remaining,
    );
  }, [allProducts, picked, remaining, budgetMinor]);

  function handleBudgetSet(amount) {
    const minor = toMinor(amount);
    if (minor <= 0) return;
    setBudgetMinor(minor);
    if (pickedTotal > minor) {
      toast("Budget adjusted. Some items exceed your new budget.", { type: "info" });
    }
  }

  function handlePreset(amount) {
    setBudgetInput(String(amount));
    handleBudgetSet(amount);
  }

  function handleCustomBudget(e) {
    e.preventDefault();
    const amount = parseFloat(budgetInput);
    if (!amount || amount < 50) {
      toast("Please enter a budget of at least ₹50", { type: "info" });
      return;
    }
    handleBudgetSet(amount);
  }

  function addProduct(product) {
    setPicked((prev) => [...prev, product]);
    setTimeout(() => {
      receiptRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }

  function removeProduct(productId) {
    setPicked((prev) => prev.filter((p) => p.id !== productId));
  }

  function clearBox() {
    setPicked([]);
    setNote("");
  }

  async function handleAddBundle() {
    if (!isReady || adding) return;
    setAdding(true);
    try {
      for (const product of picked) {
        await addItem({
          productId: product.id,
          variantId: product.variants?.[0]?.id,
          qty: 1,
        });
      }
      toast("Gift box added to your bag! Prepaid only.", { type: "success", duration: 5000 });
      setPicked([]);
      setNote("");
    } catch (err) {
      toast(err?.message ?? "Could not add gift box to bag", { type: "error" });
    } finally {
      setAdding(false);
    }
  }

  return (
    <section className={s.section} aria-label="Make Your Gift Box">
      <div className="container">
        <SectionHeading
          eyebrow="Build something special"
          title="Make Your Gift Box"
          subtitle="Set your budget, pick your favourites — we'll wrap it up beautifully."
        />

        {/* ── Horizontal "What's your budget?" Bar ── */}
        <div className={s.horizontalBudgetBar}>
          <div className={s.budgetHeaderLeft}>
            <div className={s.budgetHeaderTitleRow}>
              <span className={s.budgetIconMini}><Gift size={20} /></span>
              <h2 className={s.budgetHeading}>What&apos;s your budget?</h2>
            </div>
            <p className={s.packagingBadge}>+ ₹20 gift packaging added at checkout</p>
          </div>

          <div className={s.budgetControls}>
            <div className={s.presets}>
              {PRESET_BUDGETS.map((amt) => {
                const minor = toMinor(amt);
                const isActive = budgetMinor === minor;
                return (
                  <button
                    key={amt}
                    type="button"
                    className={`${s.presetBtn} ${isActive ? s.presetActive : ""}`}
                    onClick={() => handlePreset(amt)}
                    aria-pressed={isActive}
                  >
                    {formatINR(minor)}
                  </button>
                );
              })}
            </div>

            <form className={s.customInlineForm} onSubmit={handleCustomBudget}>
              <div className={s.inputWrap}>
                <span className={s.rupeeSign}>₹</span>
                <input
                  type="number"
                  min={50}
                  step={1}
                  placeholder="Custom"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className={s.budgetInput}
                  aria-label="Custom budget amount in rupees"
                />
              </div>
              <button type="submit" className={s.setBudgetBtn}>
                Set
              </button>
            </form>
          </div>
        </div>

        {/* ── Interface shown directly below "What's your budget?" ── */}
        {budgetMinor > 0 ? (
          <div className={s.builder}>
            {/* ── Left: Product picker ── */}
            <div className={s.picker}>
              {/* Budget Progress Bar */}
              <div className={s.budgetBar}>
                <div className={s.budgetBarTop}>
                  <span className={s.budgetLabel}>
                    Budget: <strong>{formatINR(budgetMinor)}</strong>
                  </span>
                  <span className={s.spentLabel}>
                    Spent: <strong>{formatINR(pickedTotal)}</strong>
                  </span>
                  <span className={remaining < 0 ? s.overBudgetText : s.remainingText}>
                    {remaining >= 0 ? (
                      <>Left: <strong>{formatINR(remaining)}</strong></>
                    ) : (
                      <>Over budget by <strong>{formatINR(Math.abs(remaining))}</strong></>
                    )}
                  </span>
                  {picked.length > 0 && (
                    <button type="button" className={s.clearBtn} onClick={clearBox}>
                      <RefreshCw size={12} /> Reset box
                    </button>
                  )}
                </div>
                <div className={s.progressTrack}>
                  <div
                    className={s.progressFill}
                    style={{ width: `${usedPct}%` }}
                    data-over={remaining < 0}
                  />
                </div>
              </div>

              <p className={s.pickerHint}>
                {available.length > 0
                  ? `${available.length} item${available.length !== 1 ? "s" : ""} within your remaining budget`
                  : remaining <= 0
                    ? `🎉 Budget reached (${formatINR(pickedTotal)} used)`
                    : picked.length > 0
                      ? `No items fit within remaining ${formatINR(remaining)} — you can complete your box or swap items`
                      : `No items fit this budget — try selecting a higher budget tier above`}
              </p>

              {loading ? (
                <div className={s.productGrid}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className={s.productSkeleton} />
                  ))}
                </div>
              ) : available.length === 0 ? (
                <div className={s.emptyState}>
                  <Gift size={32} />
                  {remaining <= 0 ? (
                    <>
                      <h4 className={s.emptyTitle}>Budget Reached!</h4>
                      <p className={s.emptyText}>
                        You&apos;ve used your {formatINR(budgetMinor)} budget. Review your gift box on the right to complete your order, or remove an item to swap.
                      </p>
                    </>
                  ) : picked.length > 0 ? (
                    <>
                      <h4 className={s.emptyTitle}>No More Items Fit Under {formatINR(remaining)}</h4>
                      <p className={s.emptyText}>
                        You still have {formatINR(remaining)} left in your budget, but our catalog has no single item below this amount. You can proceed with your gift box on the right, or pick a higher budget tier above!
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className={s.emptyTitle}>No items fit this budget</h4>
                      <p className={s.emptyText}>
                        Please choose a higher budget tier above to see available products.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className={s.productGrid}>
                  {available.map((product) => (
                    <div key={product.id} className={s.miniCard}>
                      {/* Image — links to PDP */}
                      <Link to={`/product/${product.slug}`} className={s.miniCardImg} tabIndex={-1}>
                        <LazyImage
                          src={product.image}
                          alt={product.title}
                          ratio="4 / 5"
                          className={s.img}
                        />
                      </Link>

                      {/* Info */}
                      <div className={s.miniCardBody}>
                        <Link to={`/product/${product.slug}`} className={s.miniCardName}>
                          {product.title}
                        </Link>
                        <div className={s.miniCardFooter}>
                          <span className={s.miniCardPrice}>{formatINR(product.effectivePriceMinor)}</span>
                          <button
                            type="button"
                            className={s.addBtn}
                            onClick={() => addProduct(product)}
                            aria-label={`Add ${product.title} to gift box`}
                          >
                            <Plus size={15} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Receipt ── */}
            <div className={s.receiptWrap} ref={receiptRef}>
              <div className={s.receipt}>
                <div className={s.receiptHeader}>
                  <div className={s.receiptLogoWrap}>🎁</div>
                  <div className={s.receiptBrand}>CraftiNiya</div>
                  <div className={s.receiptSubtitle}>GIFT BOX</div>
                  <div className={s.receiptDate}>
                    {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>

                <div className={s.receiptDash} />

                <div className={s.receiptItems}>
                  {picked.length === 0 ? (
                    <p className={s.receiptEmpty}>← Add items from the left</p>
                  ) : (
                    picked.map((p, idx) => (
                      <div key={`${p.id}-${idx}`} className={s.receiptLine}>
                        <span className={s.receiptNum}>{idx + 1}.</span>
                        <span className={s.receiptName}>{p.title}</span>
                        <span className={s.receiptPrice}>{formatINR(p.effectivePriceMinor)}</span>
                        <button
                          type="button"
                          className={s.receiptRemove}
                          onClick={() => removeProduct(p.id)}
                          aria-label={`Remove ${p.title}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className={s.receiptDash} />

                <div className={`${s.receiptLine} ${s.packagingRow}`}>
                  <span className={s.receiptNum}><Package size={11} /></span>
                  <span className={s.receiptName}>Gift Packaging</span>
                  <span className={s.receiptPrice}>{formatINR(PACKAGING_MINOR)}</span>
                </div>

                <div className={s.receiptDash} />

                <div className={s.receiptTotal}>
                  <span>GRAND TOTAL</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>

                {isReady && (
                  <div className={s.readyBanner}>
                    <CheckCircle2 size={15} />
                    Gift Box is Ready!
                  </div>
                )}

                <div className={s.receiptDash} />

                <div className={s.noteSection}>
                  <label className={s.noteLabel} htmlFor="gift-note">
                    <Pencil size={12} /> Handwritten note (optional)
                  </label>
                  <textarea
                    id="gift-note"
                    className={s.noteInput}
                    placeholder={"Dear [name],\nWishing you all the joy..."}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    maxLength={200}
                  />
                  <span className={note.length >= 180 ? s.noteCountWarn : s.noteCount}>{note.length}/200</span>
                </div>

                <div className={s.receiptDash} />

                <button
                  type="button"
                  className={s.addBundleBtn}
                  onClick={handleAddBundle}
                  disabled={!isReady || adding || pending}
                >
                  <ShoppingBag size={17} />
                  {adding ? "Adding to bag…" : "Add Gift Box to Bag"}
                </button>

                <p className={s.prepaidNote}>🔒 Prepaid only — no Cash on Delivery</p>

                <div className={s.tearline}>{"- - - - - - - - - - - - - - - - - -"}</div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Starter prompt when no budget is selected yet ── */
          <div className={s.starterSection}>
            <div className={s.starterCard}>
              <div className={s.starterIconWrap}><Sparkles size={32} /></div>
              <h3 className={s.starterHeading}>Curate Your Custom Gift Box</h3>
              <p className={s.starterSub}>
                Select any budget tier above or enter a custom amount to discover handcrafted treasures tailored to your budget.
              </p>
              <div className={s.starterPills}>
                <button type="button" className={s.starterPillBtn} onClick={() => handlePreset(499)}>
                  🎁 Start with ₹499 Tier
                </button>
                <button type="button" className={s.starterPillBtn} onClick={() => handlePreset(799)}>
                  ✨ Start with ₹799 Tier
                </button>
                <button type="button" className={s.starterPillBtn} onClick={() => handlePreset(999)}>
                  🌟 Start with ₹999 Tier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
