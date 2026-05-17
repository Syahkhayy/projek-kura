"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { APP_VERSION, FOOTER_TEXT } from "@/lib/constants";
import "./home.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Parallax Hero Background (moves slightly as user scrolls)
      gsap.to(".parallax-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".home-hero-fullscreen",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Mascot floats up slightly faster than background
      gsap.to(".home-hero-sprite-wrapper", {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: ".home-hero-fullscreen",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. Fade & Reveal Elements on Scroll
      const sections = gsap.utils.toArray<HTMLElement>(".reveal-on-scroll");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Image Expansion Effect for Story Card Background
      gsap.to(".story-card-bg", {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: ".home-story-hook",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="home-main" ref={containerRef}>
      {/* 1. Hero Section (100vh) */}
      <section className="home-hero-fullscreen">
        <div className="home-hero-bg parallax-bg" style={{ backgroundImage: "url('/homepage.png')" }}></div>

        <div className="home-hero-content-split">
          <div className="home-hero-left">
            <h1 className="home-hero-title pixel-font">PROJEK KURA</h1>
            <p className="home-hero-subtitle pixel-font">
              Help Kura training for his heroic race
            </p>
            <div className="home-actions mt-4">
              <Link href="/login" className="pixel-btn pixel-btn-primary start-btn hover-expand">
                Start Training With Kura
              </Link>
            </div>
          </div>
          <div className="home-hero-right">
            <div className="home-hero-sprite-container">
              <div className="kura-dialogue pixel-font">
                Your real-life runs help me grow stronger and run farther
              </div>
              <div className="home-hero-sprite-unwrapped">
                <img src="/kura-trying.png" alt="Kura Mascot" className="home-hero-sprite-large" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator pixel-font">
          <span className="scroll-text">Scroll to Explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Centred Content Wrapper for lower sections */}
      <div className="home-content-lower relative z-10">
        {/* 2. How It Works Section */}
        <section className="home-section reveal-on-scroll">
          <h2 className="home-section-title pixel-font">How Kura Works</h2>
          <div className="how-flow-grid">
            <div className="how-step-card modern-glass-card hover-lift interactive-card">
              <div className="how-step-num pixel-font">1</div>
              <div className="how-step-text pixel-font">You Run</div>
              <p className="how-step-desc">Log your <strong>real-world run</strong> in the app</p>
            </div>
            <div className="how-arrow-desktop pixel-font">→</div>
            <div className="how-step-card modern-glass-card hover-lift interactive-card">
              <div className="how-step-num pixel-font">2</div>
              <div className="how-step-text pixel-font">Kura Improves</div>
              <p className="how-step-desc">Your consistency builds <strong>Kura's endurance</strong></p>
            </div>
            <div className="how-arrow-desktop pixel-font">→</div>
            <div className="how-step-card modern-glass-card hover-lift interactive-card">
              <div className="how-step-num pixel-font">3</div>
              <div className="how-step-text pixel-font">The Journey Continues</div>
              <p className="how-step-desc">Unlock new lores and <strong>watch Kura evolve</strong> </p>
            </div>
          </div>
        </section>

        {/* 3. Philosophy Section */}
        <section className="home-section reveal-on-scroll">
          <h2 className="home-section-title pixel-font">Our Philosophy</h2>
          <div className="philosophy-grid">
            <div className="philosophy-item modern-glass-card hover-lift interactive-card">
              <h3 className="philosophy-item-title pixel-font">No Streak Pressure</h3>
              <p className="philosophy-item-desc">Kura use a <strong>natural decay system</strong>. Missing a <strong>day</strong> won't reset Kura <strong>progress to zero</strong></p>
            </div>
            <div className="philosophy-item modern-glass-card hover-lift interactive-card">
              <h3 className="philosophy-item-title pixel-font">No Need To Run Fast</h3>
              <p className="philosophy-item-desc">We celebrate <strong>showing up.</strong> Your pace doesn't matter, only your <strong>consistency</strong></p>
            </div>
            <div className="philosophy-item modern-glass-card hover-lift interactive-card">
              <h3 className="philosophy-item-title pixel-font">Small Runs Matter</h3>
              <p className="philosophy-item-desc">Even a <strong>1km jog</strong> helps Kura stay strong. <strong>Every bit of effort counts</strong></p>
            </div>
          </div>
        </section>

        {/* 4. Story Hook Section */}
        <section className="home-section home-final-wrapper reveal-on-scroll">
          <div className="story-wrapper relative overflow-hidden">
            <h2 className="home-section-title story-title pixel-font">The Legendary Race</h2>
            <div className="story-content">
              <p className="story-text pixel-font">Somewhere beyond the hills,</p>
              <p className="story-text pixel-font"><strong>AR. Nab</strong> is still waiting.</p>
              <p className="story-text story-text-highlight pixel-font glow-text">Nobody knows how far he can run</p>
            </div>
          </div>
        </section>

        {/* 5. Final CTA Section */}
        <section className="home-section home-final-wrapper reveal-on-scroll">
          <h2 className="home-final-title pixel-font">Ready to Begin Your Journey?</h2>
          <p className="home-final-subtitle pixel-font">Join Kura on his training journey today!</p>
          <div className="footer-actions mt-4">
            <Link href="/login" className="pixel-btn pixel-btn-accent start-btn pulse-glow hover-expand">
              Start Training With Kura
            </Link>
          </div>
        </section>
      </div>

      <footer className="home-footer z-10 relative">
        {APP_VERSION} | {FOOTER_TEXT}
      </footer>
      <SpeedInsights />
    </main>
  );
}
