"use client";

import { useEffect, useRef, useState } from "react";
import { pickRandomLoginTip } from "@/lib/loginTips";

const TIP_INTERVAL_MS = 15000;
const FADE_DURATION_MS = 300;

export default function LoginTip() {
  const [tip, setTip] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const tipRef = useRef(tip);

  tipRef.current = tip;

  useEffect(() => {
    setTip(pickRandomLoginTip());

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const intervalId = window.setInterval(() => {
      if (prefersReducedMotion) {
        setTip(pickRandomLoginTip(tipRef.current ?? undefined));
        return;
      }

      setVisible(false);
      window.setTimeout(() => {
        setTip(pickRandomLoginTip(tipRef.current ?? undefined));
        setVisible(true);
      }, FADE_DURATION_MS);
    }, TIP_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="login-tip" aria-live="polite">
      <span className="login-tip-label"></span>
      <span className={`login-tip-text ${visible && tip ? "is-visible" : ""}`}>
        {tip ?? ""}
      </span>
    </div>
  );
}
