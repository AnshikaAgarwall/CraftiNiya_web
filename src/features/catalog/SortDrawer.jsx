import { X } from "lucide-react";
import { Radio } from "../../components/ui/Field.jsx";
import { SORT_OPTIONS } from "../../config/site.js";
import s from "./SortDrawer.module.css";

export default function SortDrawer({ isOpen, onClose, value, onChange }) {
  if (!isOpen) return null;

  return (
    <>
      <div className={s.drawer} role="dialog" aria-label="Sort options">
        <div className={s.handleBar} aria-hidden="true" />

        <div className={s.head}>
          <h3 className={s.title}>Sort By</h3>
          <button
            type="button"
            className={s.closeBtn}
            onClick={onClose}
            aria-label="Close sort"
          >
            <X size={18} />
          </button>
        </div>

        <div className={s.body}>
          <div className={s.stack}>
            {SORT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={s.optionRow}
                onClick={() => {
                  onChange({ sort: option.value });
                  onClose();
                }}
              >
                <Radio
                  name="sort-mobile"
                  label={option.label}
                  checked={value.sort === option.value}
                  onChange={() => {
                    onChange({ sort: option.value });
                    onClose();
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        className={s.scrim}
        onClick={onClose}
        aria-label="Close sort"
        tabIndex={-1}
      />
    </>
  );
}
