import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Camera, Heart, MessageCircle, Pause, Play } from "lucide-react";
import { cn } from "../../lib/cn.js";
import Button from "../../components/ui/Button.jsx";
import { Skeleton } from "../../components/ui/Feedback.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useInView } from "../../hooks/useInView.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import reelService from "../../services/reelService.js";
import { formatCount } from "../../lib/format.js";
import { BRAND } from "../../config/site.js";
import s from "./ReelsShowcase.module.css";

/**
 * Studio reels — a phone-shaped frame that cycles through clips, beside brand
 * copy.
 *
 * Only the reel currently on screen plays (useInView): six autoplaying videos
 * at once makes a phone hot and the page janky. The rail also stops advancing
 * when scrolled away, and swaps to a static grid under reduced motion.
 *
 * Note on the engagement figures: these come from our own dataset, not the
 * Instagram Graph API. They are presented as studio stats rather than live
 * Instagram counts, which would go stale and read as invented.
 */

const ADVANCE_MS = 5200;

export default function ReelsShowcase() {
  const reducedMotion = useReducedMotion();
  const { data: reels, loading } = useAsync((opts) => reelService.getReels({ limit: 6 }, opts), []);
  const [containerRef, inView] = useInView({ threshold: 0.35 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef(null);

  const items = reels ?? [];
  const active = items[index];

  useEffect(() => {
    if (!items.length || reducedMotion || paused || !inView) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), ADVANCE_MS);
    return () => clearInterval(id);
  }, [items.length, reducedMotion, paused, inView]);

  // Pause the element itself when it scrolls out of view, not just the timer.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !paused && !reducedMotion) video.play?.().catch(() => {});
    else video.pause?.();
  }, [inView, paused, reducedMotion, index]);

  const step = (delta) => {
    if (!items.length) return;
    setIndex((i) => (i + delta + items.length) % items.length);
  };

  return (
    <section className={s.section} ref={containerRef} aria-labelledby="reels-heading">
      <div className={`container ${s.inner}`}>
        {/* ---- Left: the reel frame ---- */}
        <div className={s.stage}>
          <div className={s.phone}>
            {loading || !active ? (
              <Skeleton className={s.frameSkeleton} />
            ) : (
              <>
                <div className={s.frame}>
                  {items.map((reel, i) => (
                    <div
                      key={reel.id}
                      className={cn(s.reel, i === index && s.reelActive)}
                      aria-hidden={i !== index}
                    >
                      {reel.videoUrl ? (
                        <video
                          ref={i === index ? videoRef : null}
                          className={s.reelMedia}
                          src={i === index ? reel.videoUrl : undefined}
                          poster={reel.posterUrl}
                          muted
                          loop
                          playsInline
                          preload={i === index ? "auto" : "none"}
                        />
                      ) : (
                        <img
                          className={cn(s.reelMedia, i === index && !reducedMotion && s.reelPan)}
                          src={reel.posterUrl}
                          alt={reel.title}
                          loading={i === 0 ? "eager" : "lazy"}
                        />
                      )}
                    </div>
                  ))}

                  <div className={s.reelScrim} aria-hidden="true" />

                  <div className={s.reelMeta}>
                    <p className={s.reelHandle}>@craftiniya</p>
                    <p className={s.reelTitle}>{active.title}</p>
                  </div>

                  <div className={s.engagement} aria-hidden="true">
                    <span className={s.engagementItem}>
                      <Heart />
                      {formatCount(active.likes)}
                    </span>
                    <span className={s.engagementItem}>
                      <MessageCircle />
                      {formatCount(Math.round(active.likes / 14))}
                    </span>
                  </div>

                  <div className={s.progress} aria-hidden="true">
                    {items.map((reel, i) => (
                      <span key={reel.id} className={s.progressTrack}>
                        <span
                          className={cn(
                            s.progressFill,
                            i < index && s.progressDone,
                            i === index && !reducedMotion && s.progressRunning,
                          )}
                          style={
                            i === index
                              ? {
                                  animationDuration: `${ADVANCE_MS}ms`,
                                  animationPlayState:
                                    paused || !inView ? "paused" : "running",
                                }
                              : undefined
                          }
                        />
                      </span>
                    ))}
                  </div>
                </div>

                {!reducedMotion && (
                  <div className={s.controls}>
                    <button type="button" onClick={() => step(-1)} aria-label="Previous reel">
                      <ChevronUp />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaused((p) => !p)}
                      aria-label={paused ? "Play reels" : "Pause reels"}
                    >
                      {paused ? <Play /> : <Pause />}
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label="Next reel">
                      <ChevronDown />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ---- Right: brand copy ---- */}
        <div className={s.copy}>
          <p className={s.eyebrow}>
            <Camera aria-hidden="true" />
            From the studio
          </p>

          <h2 id="reels-heading" className={s.heading}>
            Watch it being made.
          </h2>

          <p className={s.body}>
            Resin poured in thin layers and left to cure for three days. Wax
            weighed to the gram. Flowers pressed the week they were picked.
            Nothing here is pulled off a shelf, and none of it is rushed.
          </p>

          <p className={s.body}>
            We film most of it — partly because people ask how it is done, and
            partly because it is the honest answer to why a handmade tray costs
            what it does.
          </p>

          <ul className={s.stats}>
            <li>
              <strong>{items.length ? formatCount(items.reduce((n, r) => n + r.views, 0)) : "—"}</strong>
              <span>Views this season</span>
            </li>
            <li>
              <strong>3 days</strong>
              <span>Average cure time</span>
            </li>
            <li>
              <strong>1 maker</strong>
              <span>Per finished piece</span>
            </li>
          </ul>

          <div className={s.actions}>
            <Button
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer noopener"
              variant="secondary"
              endIcon={<ExternalLink size={15} />}
            >
              Follow on Instagram
            </Button>
            <Button to="/shop" variant="ghost">
              Shop what you see
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
