import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Volume2,
  VolumeX,
  ShoppingBag,
  ArrowRight,
  X,
  Play,
  Pause,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../lib/cn.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useInView } from "../../hooks/useInView.js";
import reelService from "../../services/reelService.js";
import { formatINR, toMinor } from "../../lib/money.js";
import s from "./ReelsShowcase.module.css";

const INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/manmish_creations?igsi=am9xYjJkejJjOHho";

export default function ReelsShowcase() {
  const { data: reels, loading } = useAsync((opts) => reelService.getReels({ limit: 8 }, opts), []);
  const [containerRef, inView] = useInView({ threshold: 0.1 });

  // Selected reel modal (opens when clicked)
  const [activeModalReel, setActiveModalReel] = useState(null);
  const [modalMuted, setModalMuted] = useState(false); // Unmuted by default on explicit modal click
  const [modalPlaying, setModalPlaying] = useState(true);
  const [likedReels, setLikedReels] = useState({});

  const modalVideoRef = useRef(null);

  const items = reels ?? [];

  // Toggle like
  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveModalReel(null);
      }
    };
    if (activeModalReel) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeModalReel]);

  return (
    <section className={s.section} ref={containerRef} aria-labelledby="reels-heading">
      {/* Section Header */}
      <div className="container">
        <div className={s.sectionHeader}>
          <div className={s.headerBadge}>
            <span>Studio In Motion</span>
          </div>
          <h2 id="reels-heading" className={s.sectionTitle}>
            Watch It Being Made
          </h2>
          <p className={s.sectionSubtitle}>
            Continuous studio process reels. Hover over any reel to discover attached creations.
          </p>
        </div>
      </div>

      {/* Full-width Seamless Moving Marquee Track (Moving right to left) */}
      <div className={s.marqueeContainer}>
        {/* Subtle Vignette Shadows on left/right screen edges */}
        <div className={s.fadeLeft} aria-hidden="true" />
        <div className={s.fadeRight} aria-hidden="true" />

        <div className={s.marqueeTrack}>
          {/* Double array ensures seamless continuous loop across all widescreen resolutions */}
          {[...items, ...items].map((reel, idx) => {
            const isLiked = Boolean(likedReels[reel.id]);

            return (
              <div
                key={`${reel.id}-${idx}`}
                className={s.reelCard}
                onClick={() => {
                  setActiveModalReel(reel);
                  setModalMuted(false); // Unmute option available on click
                  setModalPlaying(true);
                }}
              >
                {/* Background Video (Silent Auto-loop in marquee stream) */}
                <div className={s.videoWrapper}>
                  {inView && reel.videoUrl ? (
                    <video
                      src={reel.videoUrl}
                      poster={reel.image || reel.posterUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={s.streamVideo}
                    />
                  ) : (
                    <img
                      src={reel.image || reel.posterUrl}
                      alt={reel.title}
                      className={s.streamVideo}
                    />
                  )}
                  <div className={s.videoOverlay} />

                  {/* Top Creator Tag */}
                  <div className={s.cardTopBar}>
                    <span className={s.creatorTag}>@manmish_creations</span>
                    <button
                      type="button"
                      className={cn(s.likeBtn, isLiked && s.likeBtnActive)}
                      onClick={(e) => toggleLike(e, reel.id)}
                      aria-label="Like reel"
                    >
                      <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Play click indicator on card */}
                  <div className={s.playIndicator}>
                    <Play size={18} />
                  </div>
                </div>

                {/* Hover Pop-Up: Attached Product Card (Slides up from bottom smoothly on hover) */}
                {reel.product && (
                  <div className={s.attachedProductPopup} onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={reel.visitUrl || (reel.product.slug ? `/product/${reel.product.slug}` : "/shop")}
                      className={s.attachedProductLink}
                    >
                      <img
                        src={reel.product.image || reel.image}
                        alt={reel.product.title}
                        className={s.productThumb}
                      />
                      <div className={s.productInfo}>
                        <div className={s.productBadge}>
                          <ShoppingBag size={10} />
                          <span>Featured Piece</span>
                        </div>
                        <h4 className={s.productTitle}>{reel.product.title}</h4>
                        <div className={s.productPriceRow}>
                          <span className={s.productPrice}>
                            {formatINR(toMinor(reel.product.salePrice || reel.product.price))}
                          </span>
                          {reel.product.salePrice && reel.product.price > reel.product.salePrice && (
                            <span className={s.comparePrice}>
                              {formatINR(toMinor(reel.product.price))}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={s.viewCtaIcon} title="View Product">
                        <ArrowRight size={13} />
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= REEL MODAL (Triggered on Click with Unmute & Full Sound) ================= */}
      {activeModalReel && (
        <div className={s.modalBackdrop} onClick={() => setActiveModalReel(null)}>
          <div className={s.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={s.modalCloseBtn}
              onClick={() => setActiveModalReel(null)}
              aria-label="Close reel modal"
            >
              <X size={20} />
            </button>

            {/* Modal Video Player with Sound Controls */}
            <div className={s.modalVideoPane}>
              <video
                ref={modalVideoRef}
                src={activeModalReel.videoUrl}
                poster={activeModalReel.image || activeModalReel.posterUrl}
                autoPlay
                loop
                muted={modalMuted}
                playsInline
                className={s.modalVideo}
                onClick={() => {
                  const v = modalVideoRef.current;
                  if (!v) return;
                  if (v.paused) {
                    v.play();
                    setModalPlaying(true);
                  } else {
                    v.pause();
                    setModalPlaying(false);
                  }
                }}
              />

              {/* Center Play/Pause Indicator if paused */}
              {!modalPlaying && (
                <div className={s.modalPausedScrim}>
                  <Play size={44} />
                </div>
              )}

              {/* Sound Toggle (Unmute / Mute on click) */}
              <div className={s.modalControls}>
                <button
                  type="button"
                  className={s.audioBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    const v = modalVideoRef.current;
                    const next = !modalMuted;
                    setModalMuted(next);
                    if (v) v.muted = next;
                  }}
                  aria-label={modalMuted ? "Unmute video" : "Mute video"}
                >
                  {modalMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span>{modalMuted ? "Unmute" : "Sound On"}</span>
                </button>
              </div>
            </div>

            {/* Modal Right Details & Attached Product */}
            <div className={s.modalInfoPane}>
              <div className={s.modalAuthorRow}>
                <a
                  href={INSTAGRAM_PROFILE_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={s.authorLink}
                  title="Visit @manmish_creations on Instagram"
                >
                  <div className={s.authorAvatar}>
                    <img
                      src={activeModalReel.image || activeModalReel.posterUrl}
                      alt="Manmish Creations"
                    />
                  </div>
                  <div className={s.authorDetails}>
                    <span className={s.authorName}>Manmish Creations</span>
                    <span className={s.authorHandle}>@manmish_creations</span>
                  </div>
                </a>
              </div>

              <div className={s.modalCopy}>
                <h3 className={s.modalTitle}>{activeModalReel.title}</h3>
                <p className={s.modalDescription}>
                  {activeModalReel.caption || activeModalReel.description}
                </p>
              </div>

              {activeModalReel.product && (
                <div className={s.modalProductBox}>
                  <p className={s.productBoxEyebrow}>Shop This Creation</p>
                  <Link
                    to={
                      activeModalReel.visitUrl ||
                      (activeModalReel.product.slug
                        ? `/product/${activeModalReel.product.slug}`
                        : "/shop")
                    }
                    className={s.modalProductCard}
                    onClick={() => setActiveModalReel(null)}
                  >
                    <img
                      src={activeModalReel.product.image || activeModalReel.image}
                      alt={activeModalReel.product.title}
                      className={s.modalProductThumb}
                    />
                    <div className={s.modalProductText}>
                      <h4 className={s.modalProductTitle}>{activeModalReel.product.title}</h4>
                      <p className={s.modalProductPrice}>
                        {formatINR(
                          toMinor(
                            activeModalReel.product.salePrice || activeModalReel.product.price,
                          ),
                        )}
                      </p>
                    </div>
                    <span className={s.shopNowBtn}>
                      View Piece <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
