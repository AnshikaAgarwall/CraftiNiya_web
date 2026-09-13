import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Share2,
  ShoppingBag,
  BadgeCheck,
  Check,
  ArrowRight,
} from "lucide-react";
import { cn } from "../../lib/cn.js";
import { Skeleton } from "../../components/ui/Feedback.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useInView } from "../../hooks/useInView.js";

function InstagramIcon({ size = 16, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import reelService from "../../services/reelService.js";
import { formatCount } from "../../lib/format.js";
import { formatINR, toMinor } from "../../lib/money.js";
import s from "./ReelsShowcase.module.css";

const ADVANCE_MS = 6500;
const INSTAGRAM_PROFILE_URL =
  "https://www.instagram.com/manmish_creations?igsi=am9xYjJkejJjOHho";

export default function ReelsShowcase() {
  const reducedMotion = useReducedMotion();
  const { data: reels, loading } = useAsync((opts) => reelService.getReels({ limit: 6 }, opts), []);
  const [containerRef, inView] = useInView({ threshold: 0.3 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [likedReels, setLikedReels] = useState({});
  const [copied, setCopied] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef(null);

  const items = reels ?? [];
  const active = items[index];

  const step = useCallback(
    (delta) => {
      if (!items.length) return;
      setIndex((i) => (i + delta + items.length) % items.length);
      setVideoProgress(0);
    },
    [items.length],
  );

  // Keyboard navigation when user is on the section
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!inView) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (
        e.key === " " &&
        document.activeElement?.tagName !== "BUTTON" &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inView, step]);

  // Auto-advance
  useEffect(() => {
    if (!items.length || reducedMotion || paused || !inView) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
      setVideoProgress(0);
    }, ADVANCE_MS);
    return () => clearInterval(timer);
  }, [items.length, reducedMotion, paused, inView, index]);

  // Handle HTML5 video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;

    if (inView && !paused && !reducedMotion) {
      video.play?.().catch(() => {});
    } else {
      video.pause?.();
    }
  }, [inView, paused, reducedMotion, index, muted]);

  // Track video progress
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    setVideoProgress(pct);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (paused) {
      setPaused(false);
      video?.play?.().catch(() => {});
    } else {
      setPaused(true);
      video?.pause?.();
    }
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  };

  const toggleLike = (reelId) => {
    setLikedReels((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  };

  const handleShare = async () => {
    const shareUrl = active?.instagramUrl || INSTAGRAM_PROFILE_URL;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
        return;
      } catch {
        // fallback
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const isLiked = active ? Boolean(likedReels[active.id]) : false;
  const currentLikes = active ? active.likes + (isLiked ? 1 : 0) : 0;

  return (
    <section className={s.section} ref={containerRef} aria-labelledby="reels-heading">
      <div className={`container ${s.container}`}>
        {/* Section Header */}
        <div className={s.sectionHeader}>
          <h2 id="reels-heading" className={s.sectionTitle}>
            Watch It Being Made
          </h2>
          <p className={s.sectionSubtitle}>
            Direct from our studio feed. Handcrafted resin art, botanical candles, and custom keepsakes.
          </p>
        </div>

        {/* Laptop/Desktop Style Unified Reel Player Frame */}
        {loading || !active ? (
          <div className={s.playerFrameSkeleton}>
            <Skeleton className={s.videoSkeleton} />
            <Skeleton className={s.infoSkeleton} />
          </div>
        ) : (
          <div className={s.playerFrame}>
            {/* ================= LEFT PANE: VIDEO PLAYER ================= */}
            <div
              className={s.videoPane}
              onClick={togglePlay}
              role="region"
              aria-label="Instagram Reel video player"
            >
              {/* Media element */}
              <div className={s.mediaWrapper}>
                {active.videoUrl ? (
                  <video
                    ref={videoRef}
                    key={active.id}
                    className={s.videoElement}
                    src={active.videoUrl}
                    poster={active.posterUrl}
                    muted={muted}
                    loop
                    playsInline
                    autoPlay
                    onTimeUpdate={handleTimeUpdate}
                    preload="auto"
                  />
                ) : (
                  <img
                    className={cn(s.videoElement, !reducedMotion && s.kenBurns)}
                    src={active.posterUrl}
                    alt={active.title}
                  />
                )}

                {/* Subtle Cinematic Vignette Scrim */}
                <div className={s.videoScrim} aria-hidden="true" />

                {/* Top Story Progress Bars */}
                <div className={s.progressContainer} aria-hidden="true">
                  {items.map((item, i) => (
                    <div
                      key={item.id}
                      className={s.progressBarTrack}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIndex(i);
                      }}
                    >
                      <div
                        className={cn(
                          s.progressBarFill,
                          i < index && s.progressDone,
                          i === index && s.progressActive,
                        )}
                        style={
                          i === index
                            ? { width: active.videoUrl ? `${videoProgress}%` : undefined }
                            : undefined
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Top Floating Controls on Video */}
                <div className={s.videoTopControls}>
                  <a
                    href={active.instagramUrl || INSTAGRAM_PROFILE_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={s.reelLiveChip}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InstagramIcon size={12} />
                    <span>Instagram Reel</span>
                  </a>
                  <div className={s.topButtonsGroup}>
                    <button
                      type="button"
                      className={s.iconButton}
                      onClick={toggleSound}
                      title={muted ? "Unmute audio" : "Mute audio"}
                      aria-label={muted ? "Unmute audio" : "Mute audio"}
                    >
                      {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                    </button>
                    <button
                      type="button"
                      className={s.iconButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      title={paused ? "Play video" : "Pause video"}
                      aria-label={paused ? "Play video" : "Pause video"}
                    >
                      {paused ? <Play size={17} /> : <Pause size={17} />}
                    </button>
                  </div>
                </div>

                {/* Paused Center Overlay Indicator */}
                {paused && (
                  <div className={s.pausedCenterOverlay} aria-hidden="true">
                    <div className={s.pausePulseCircle}>
                      <Play size={28} className={s.playIconGlance} />
                    </div>
                  </div>
                )}

                {/* Bottom Left Floating Handle on Video (No Audio) */}
                <div className={s.videoBottomLeft}>
                  <a
                    href={active.author?.profileUrl || INSTAGRAM_PROFILE_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={s.videoHandle}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{active.author?.handle || "@manmish_creations"}</span>
                    <BadgeCheck size={14} className={s.verifiedIcon} />
                  </a>
                </div>

                {/* Floating Social Interaction Stack on Video */}
                <div className={s.videoSocialStack} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={cn(s.socialBtn, isLiked && s.socialBtnLiked)}
                    onClick={() => toggleLike(active.id)}
                    aria-label={isLiked ? "Unlike reel" : "Like reel"}
                  >
                    <Heart size={20} className={cn(s.heartIcon, isLiked && s.heartFilled)} />
                    <span className={s.socialCount}>{formatCount(currentLikes)}</span>
                  </button>

                  <div className={s.socialItemStatic}>
                    <MessageCircle size={20} />
                    <span className={s.socialCount}>
                      {formatCount(active.commentsCount || 120)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={s.socialBtn}
                    onClick={handleShare}
                    title="Copy Instagram link"
                    aria-label="Copy Instagram link"
                  >
                    {copied ? <Check size={18} className={s.checkIcon} /> : <Share2 size={18} />}
                    <span className={s.socialCount}>{copied ? "Copied" : "Share"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ================= RIGHT PANE: INSTAGRAM DESCRIPTION & PRODUCT ================= */}
            <div className={s.infoPane}>
              {/* Creator Header Bar */}
              <div className={s.creatorBar}>
                <a
                  href={active.author?.profileUrl || active.instagramUrl || INSTAGRAM_PROFILE_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={s.creatorProfile}
                  title="Visit @manmish_creations on Instagram"
                >
                  <img
                    src={active.author?.avatarUrl || active.posterUrl}
                    alt={active.author?.name || "Manmish Creations"}
                    className={s.creatorAvatar}
                  />
                  <div>
                    <div className={s.creatorNameRow}>
                      <span className={s.creatorName}>
                        {active.author?.name || "Manmish Creations"}
                      </span>
                      <BadgeCheck size={14} className={s.verifiedCheck} />
                    </div>
                    <span className={s.creatorSubline}>
                      {active.author?.handle || "@manmish_creations"}
                    </span>
                  </div>
                </a>

                <div className={s.reelCounterPill}>
                  <span className={s.counterCurrent}>0{index + 1}</span>
                  <span className={s.counterSlash}>/</span>
                  <span className={s.counterTotal}>0{items.length}</span>
                </div>
              </div>

              {/* Instagram Reel Content & Description (Direct from Instagram) */}
              <div className={s.contentDetails}>
                <h3 className={s.reelTitle}>{active.title}</h3>

                <div className={s.captionWrapper}>
                  <p className={s.reelDescription}>
                    {active.caption || active.description}
                  </p>
                </div>

                {/* Tags from Instagram Post */}
                {active.tags && active.tags.length > 0 && (
                  <div className={s.tagsRow}>
                    {active.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className={s.tagChip}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin-Selected Product Attached to This Reel (Direct Clickable Navigation) */}
              {active.product && (
                <Link
                  to={active.visitUrl || (active.product.slug ? `/product/${active.product.slug}` : "/shop")}
                  className={s.featuredProductCard}
                  title={`View product: ${active.product.title}`}
                >
                  <img
                    src={active.product.image || active.posterUrl}
                    alt={active.product.title}
                    className={s.productThumb}
                  />
                  <div className={s.productDetails}>
                    <div className={s.productBadge}>
                      <ShoppingBag size={11} />
                      <span>Featured Creation</span>
                    </div>
                    <h4 className={s.productTitle}>{active.product.title}</h4>
                    <div className={s.productPriceRow}>
                      <span className={s.productPrice}>
                        {formatINR(toMinor(active.product.salePrice || active.product.price))}
                      </span>
                      {active.product.salePrice &&
                        active.product.price > active.product.salePrice && (
                          <span className={s.productComparePrice}>
                            {formatINR(toMinor(active.product.price))}
                          </span>
                        )}
                      <span className={s.stockTag}>In Stock</span>
                    </div>
                  </div>
                  <div className={s.productNavCta}>
                    <ArrowRight size={15} />
                  </div>
                </Link>
              )}

              {/* Bottom Switcher / Carousel Controls (Max 6 Admin-Selected Reels) */}
              <div className={s.switcherBar}>
                {/* Thumbnails fast switcher */}
                <div className={s.thumbnailRail}>
                  {items.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      className={cn(s.thumbButton, i === index && s.thumbButtonActive)}
                      onClick={() => {
                        setIndex(i);
                        setVideoProgress(0);
                      }}
                      title={`Reel ${i + 1}: ${item.title}`}
                      aria-label={`View Reel ${i + 1}`}
                    >
                      <img src={item.posterUrl} alt="" className={s.thumbImg} />
                      {i === index && <span className={s.thumbGlow} />}
                    </button>
                  ))}
                </div>

                {/* Prev / Next Arrows */}
                <div className={s.navButtons}>
                  <button
                    type="button"
                    className={s.navArrow}
                    onClick={() => step(-1)}
                    title="Previous Reel"
                    aria-label="Previous Reel"
                  >
                    <ChevronUp className={s.arrowDesktop} size={20} />
                    <ChevronLeft className={s.arrowMobile} size={20} />
                  </button>
                  <button
                    type="button"
                    className={s.navArrow}
                    onClick={() => step(1)}
                    title="Next Reel"
                    aria-label="Next Reel"
                  >
                    <ChevronDown className={s.arrowDesktop} size={20} />
                    <ChevronRight className={s.arrowMobile} size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
