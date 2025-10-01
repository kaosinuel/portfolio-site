import { useEffect, useMemo, useState } from "react";

/*
  SleepOverlay
  > shows a looping "sleep" gif with a "click to wake" label.
  > TL;DR: tiny state machine that controls two gifs + a fade. 
*/

export default function SleepOverlay({
  onDone,
  sleepGifSrc, // looped sleep gif
  wakeGifSrc, //  wake gif (play once)
  wakeDurationMs, // gif length
  fadeMs = 800, // overlay fade duration (ms)
  fadeWakeButtonOnClick = false,
  size = 500, // px size for the gif box
}: {
  onDone: () => void;
  sleepGifSrc: string;
  wakeGifSrc: string;
  wakeDurationMs: number;
  fadeMs?: number;
  fadeWakeButtonOnClick?: boolean;
  size?: number;
}) {
  // state
  const [visible, setVisible] = useState(false); // overlay opacity
  const [phase, setPhase] = useState<"sleep" | "waking" | "fadingOut">("sleep");
  const [wakeKey, setWakeKey] = useState(() => Date.now());
  const [labelGone, setLabelGone] = useState(false); // smooth fade

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 0);
    return () => clearTimeout(t);
  }, []);

  // click "wake"
  const startWake = () => {
    if (phase !== "sleep") return; // ignore extra clicks

    if (fadeWakeButtonOnClick) setLabelGone(true);

    setPhase("waking");
    setWakeKey(Date.now());

    const t = setTimeout(() => {
      setPhase("fadingOut");
      const t2 = setTimeout(onDone, fadeMs);
      // cleanup the inner timer
      return () => clearTimeout(t2);
    }, Math.max(0, wakeDurationMs));

    // cleanup outer timer if component unmounts mid wake
    return () => clearTimeout(t);
  };

  const overlayClass = useMemo(
    () =>
      [
        "fixed inset-0 z-[9998] bg-black grid place-items-center text-white",
        "transition-opacity",
        visible && phase !== "fadingOut" ? "opacity-100" : "opacity-0",
      ].join(" "),
    [visible, phase]
  );

  return (
    <div
      className={overlayClass}
      style={{ transitionDuration: `${Math.max(200, fadeMs)}ms` }}
      role="dialog"
      aria-label="Sleep"
    >
      <button
        type="button"
        onClick={phase === "sleep" ? startWake : undefined}
        className="flex flex-col items-center gap-4 focus:outline-none"
        aria-label={phase === "sleep" ? "Click to wake up" : "Waking"}
      >
        {/* ANIMATION AREA */}
        {phase === "sleep" && (
          <img
            src={sleepGifSrc}
            alt="Sleeping animation"
            draggable={false}
            style={{ width: size, height: size }}
            className="object-contain"
          />
        )}

        {phase === "waking" && (
          <img
            key={wakeKey} // what restarts the gif (don't remove this pls)
            src={wakeGifSrc}
            alt="Waking up animation"
            draggable={false}
            style={{ width: size, height: size }}
            className="object-contain"
          />
        )}

        {/* LABEL */}
        <div
          className={
            "text-sm text-white/80 transition-opacity duration-300 " +
            (phase === "sleep"
              ? labelGone
                ? "opacity-0"
                : "opacity-100"
              : "opacity-0")
          }
        >
          Click to wake up
        </div>
      </button>
    </div>
  );
}
