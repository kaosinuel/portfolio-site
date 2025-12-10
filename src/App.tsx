import { useEffect, useState } from "react";
import SleepOverlay from "./components/SleepOverlay";

export default function App() {
  const [overlayDone, setOverlayDone] = useState(false);

  // if user prefers reduced motion, skip the whole animation (be nice!)
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) setOverlayDone(true);
  }, []);

  // ---------------------------------------
  // ASSETS (/public/wip)
  // ---------------------------------------
  const smileySrc = import.meta.env.BASE_URL + "wip/smiley.png";
  const sleepGifSrc = import.meta.env.BASE_URL + "wip/sleep.gif";
  const wakeGifSrc = import.meta.env.BASE_URL + "wip/wake.gif"; // lil guy :) keep him

  // how long the wake gif is in ms
  const wakeDurationMs = 2400;

  return (
    <main className="relative min-h-dvh bg-black text-white">
      {/* the intro overlay with sleep to wake. don't remove this or the page is boring lol */}
      {!overlayDone && (
        <SleepOverlay
          onDone={() => setOverlayDone(true)}
          sleepGifSrc={sleepGifSrc}
          wakeGifSrc={wakeGifSrc}
          wakeDurationMs={wakeDurationMs}
          fadeMs={700} // how fast overlay fades
          fadeWakeButtonOnClick
          size={420} // gif box size
        />
      )}

      {/* WIP screen (glassmorphism) */}
      {overlayDone && (
        <div className="grid min-h-dvh place-items-center p-6">
          <section
            className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5
                       backdrop-blur-xl ring-1 ring-white/5
                       shadow-[0_10px_60px_-10px_rgba(0,0,0,.6)]"
          >
            <div className="flex flex-col items-center gap-6 px-8 py-10 text-center sm:px-12 sm:py-14">
              {/* tiny header */}
              <header className="flex w-full items-center justify-between gap-4">
                <div className="text-sm uppercase tracking-[0.2em] text-white/60">
                  KAOSI NUEL
                </div>
                <div className="text-xs text-white/40">v0.1 • WIP</div>
              </header>

              {/* main message */}
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Sorry! This website is{" "}
                <span className="underline decoration-dashed underline-offset-4">
                  under construction
                </span>
                !
              </h1>

              {/* smiley photo*/}
              <img
                src={smileySrc}
                alt="Smiley face"
                width={192}
                height={192}
                className="h-32 w-32 object-contain drop-shadow sm:h-40 sm:w-40"
                draggable={false}
              />

              <p className="text-base text-white/80 sm:text-lg">
                Please, come back next time! :D
              </p>

              {/* CONTACT LINKS */}

              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm">
                {/* LINKEDIN */}
                <a
                  href="https://www.linkedin.com/in/kaosi-nuel"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open LinkedIn in a new tab"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 transition hover:bg-white/15 active:translate-y-[1px]"
                >
                  LinkedIn
                </a>

                {/* GITHUB */}
                <a
                  href="https://github.com/kaosinuel"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open GitHub in a new tab"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 transition hover:bg-white/15 active:translate-y-[1px]"
                >
                  GitHub
                </a>

                {/* ITCH.IO*/}
                <a
                  href="https://kaozine.itch.io"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open itch.io in a new tab"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 transition hover:bg-white/15 active:translate-y-[1px]"
                >
                  itch.io
                </a>

                {/* EMAIL */}
                <a
                  href="mailto:kaosinuel@gmail.com"
                  className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 transition hover:bg-white/15 active:translate-y-[1px]"
                >
                  Contact me!
                </a>

                {/* RESUME */}
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/KaosiNuel-Resume.pdf');
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'KaosiNuel-Resume.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Failed to download resume:', error);
                    }
                  }}
                  className="rounded-xl border border-white/10 px-4 py-2 transition hover:bg-white/10 active:translate-y-[1px]"
                >
                  View my resume!
                </button>
              </div>

              {/* tiny timestamp */}
              <footer className="mt-4 text-xs text-white/50">
                Last updated{" "}
                {new Date().toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </footer>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
