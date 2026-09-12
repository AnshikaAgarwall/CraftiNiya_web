import { useEffect, useMemo, useState } from "react";

/**
 * Countdown to a UTC deadline, driven by a server-clock offset.
 *
 * Client system clocks are wrong more often than you would expect — a machine
 * running ten minutes fast shows a sale ending ten minutes early, or shows a
 * live sale as already expired. Passing `serverNowIso` (fetched once) lets the
 * timer run on server time while still ticking locally.
 *
 * The tick lives here so only the banner re-renders each second, not the page.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function breakdown(ms) {
  const clamped = Math.max(ms, 0);
  return {
    days: Math.floor(clamped / DAY),
    hours: Math.floor((clamped % DAY) / HOUR),
    minutes: Math.floor((clamped % HOUR) / MINUTE),
    seconds: Math.floor((clamped % MINUTE) / SECOND),
  };
}

export function useCountdown(endsAtIso, serverNowIso = null) {
  const target = useMemo(() => {
    const t = endsAtIso ? Date.parse(endsAtIso) : NaN;
    return Number.isFinite(t) ? t : null;
  }, [endsAtIso]);

  /* Skew between the server clock and this device's, measured once when the
     server time arrives. This is synchronisation with an external clock, which
     is what effects are for; the rule below is aimed at deriving state from
     props, which this is not. */
  const [skew, setSkew] = useState(0);
  useEffect(() => {
    if (!serverNowIso) return;
    const server = Date.parse(serverNowIso);
    if (!Number.isFinite(server)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- external clock sync, see above
    setSkew(server - Date.now());
  }, [serverNowIso]);

  // Only the interval writes this, so there is no synchronous set in an effect.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (target == null) return undefined;

    const id = setInterval(() => {
      const stamp = Date.now();
      setNow(stamp);
      // Stop ticking once expired — an interval left running on a dead
      // countdown re-renders every second for the rest of the session.
      if (target - (stamp + skew) <= 0) clearInterval(id);
    }, SECOND);

    return () => clearInterval(id);
  }, [target, skew]);

  const remaining = target == null ? null : target - (now + skew);
  const parts = breakdown(remaining ?? 0);

  return {
    ...parts,
    totalMs: Math.max(remaining ?? 0, 0),
    isExpired: target == null || remaining <= 0,
    isValid: target != null,
  };
}

export default useCountdown;
