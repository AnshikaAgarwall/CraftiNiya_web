import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import popupDesktopImage from "../../assets/PRIYACREATIONS_POPUP.jpg";
import popupMobileImage from "../../assets/PRIYACREATIONS_MOBILE.jpg";
import s from "./PriyaCollabPopup.module.css";

export default function PriyaCollabPopup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Do not show if already on Priya's creator page
    if (location.pathname.includes("/creator/priya-crafts")) return;

    // Do not show if previously dismissed in this session
    const isDismissed = sessionStorage.getItem("craftiniya:priya_popup_dismissed");
    if (isDismissed) return;

    // Smooth delay before showing popup
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem("craftiniya:priya_popup_dismissed")) {
        setIsOpen(true);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleClose = (e) => {
    e?.stopPropagation();
    sessionStorage.setItem("craftiniya:priya_popup_dismissed", "true");
    setIsOpen(false);
  };

  const handleNavigate = () => {
    sessionStorage.setItem("craftiniya:priya_popup_dismissed", "true");
    setIsOpen(false);
    navigate("/creator/priya-crafts");
  };

  if (!isOpen) return null;

  return (
    <div
      className={s.overlay}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Priya Creations Collaboration Announcement"
    >
      <div className={s.modalWrapper} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className={s.closeBtn}
          onClick={handleClose}
          aria-label="Close Announcement"
        >
          <X size={20} strokeWidth={2} />
        </button>

        {/* Clickable Graphic Card */}
        <div
          className={s.card}
          onClick={handleNavigate}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNavigate();
            }
          }}
        >
          <picture className={s.cardPicture}>
            <source media="(max-width: 640px)" srcSet={popupMobileImage} />
            <img
              src={popupDesktopImage}
              alt="Priya Creations is now on CraftiNiya - Handcrafted botanical resin jewelry & keepsakes"
              className={s.cardImage}
            />
          </picture>
        </div>
      </div>
    </div>
  );
}
