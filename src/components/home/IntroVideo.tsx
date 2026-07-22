"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function IntroVideo() {
  const [phase, setPhase] = useState<"hidden" | "video" | "glass" | "evaporating">("hidden");
  const [isMobile, setIsMobile] = useState(false);
  const [wipePercent, setWipePercent] = useState(0);
  const [clothAngle, setClothAngle] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isWipingRef = useRef(false);

  useEffect(() => {
    // Check if intro has already been seen in localStorage
    const hasSeen = localStorage.getItem("intro_seen");
    if (!hasSeen) {
      setPhase("video");
      // Safety fallback timeout
      const timer = setTimeout(() => {
        setPhase((current) => (current === "video" ? "glass" : current));
      }, 5500);
      return () => clearTimeout(timer);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleVideoEnded = () => {
    setPhase("glass");
  };

  // Initialize Canvas and Real Pixel Area Calculator
  useEffect(() => {
    if (phase !== "glass" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Render Initial Frosted Glass Surface
    const renderGlass = () => {
      ctx.fillStyle = "rgba(232, 240, 250, 0.78)";
      ctx.fillRect(0, 0, width, height);

      // Micro condensation specs
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 500; i++) {
        const rx = Math.random() * width;
        const ry = Math.random() * height;
        ctx.beginPath();
        ctx.arc(rx, ry, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Water Droplets
      for (let i = 0; i < 180; i++) {
        const dx = Math.random() * width;
        const dy = Math.random() * height;
        const dr = Math.random() * 5 + 2;
        ctx.fillStyle = "rgba(210, 230, 250, 0.65)";
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    renderGlass();

    // Brush Radius: Desktop 90px, Mobile 120px
    const brushRadius = isMobile ? 120 : 90;

    // Soft Feathered Radial Gradient Eraser
    const eraseCircleAt = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      const grad = ctx.createRadialGradient(x, y, 0, x, y, brushRadius);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.6, "rgba(0,0,0,0.85)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    // Interpolate points between fast swipes to prevent gaps
    const eraseLine = (x1: number, y1: number, x2: number, y2: number) => {
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(1, Math.floor(dist / 15));
      for (let i = 0; i <= steps; i++) {
        const tx = x1 + (x2 - x1) * (i / steps);
        const ty = y1 + (y2 - y1) * (i / steps);
        eraseCircleAt(tx, ty);
      }
    };

    // Calculate REAL Cleaned Surface Area from Alpha Buffer Sampling
    const calculateRealCleanedArea = () => {
      // Sample a 50x50 grid across the canvas to calculate real non-overlapping transparent pixels
      const gridCols = 40;
      const gridRows = 30;
      const colStep = Math.floor(width / gridCols);
      const rowStep = Math.floor(height / gridRows);
      
      let transparentSamples = 0;
      const totalSamples = gridCols * gridRows;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const sampleX = Math.floor(c * colStep + colStep / 2);
          const sampleY = Math.floor(r * rowStep + rowStep / 2);
          const pixel = ctx.getImageData(sampleX, sampleY, 1, 1).data;
          // If alpha channel is < 50, it is wiped clean
          if (pixel[3] < 50) {
            transparentSamples++;
          }
        }
      }

      const percent = Math.min(Math.round((transparentSamples / totalSamples) * 100), 100);
      setWipePercent(percent);

      if (percent >= 80) {
        triggerEvaporation();
      }
    };

    const handlePointerMove = (x: number, y: number) => {
      if (!isWipingRef.current) return;

      if (lastPointRef.current) {
        const dx = x - lastPointRef.current.x;
        const dy = y - lastPointRef.current.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          setClothAngle(angle);
        }
        eraseLine(lastPointRef.current.x, lastPointRef.current.y, x, y);
      } else {
        eraseCircleAt(x, y);
      }

      lastPointRef.current = { x, y };
      calculateRealCleanedArea();
    };

    const onMouseDown = (e: MouseEvent) => {
      isWipingRef.current = true;
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      eraseCircleAt(e.clientX, e.clientY);
      calculateRealCleanedArea();
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      isWipingRef.current = false;
      lastPointRef.current = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      isWipingRef.current = true;
      if (e.touches[0]) {
        const t = e.touches[0];
        lastPointRef.current = { x: t.clientX, y: t.clientY };
        eraseCircleAt(t.clientX, t.clientY);
        calculateRealCleanedArea();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      isWipingRef.current = false;
      lastPointRef.current = null;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [phase, isMobile]);

  // 80% Evaporation Transition
  const triggerEvaporation = () => {
    setPhase("evaporating");
    localStorage.setItem("intro_seen", "true");

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let alpha = 1;
    const animateEvaporation = () => {
      if (!ctx || !canvas) return;
      alpha -= 0.04;

      if (alpha <= 0) {
        setPhase("hidden");
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        return;
      }

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animFrameRef.current = requestAnimationFrame(animateEvaporation);
    };

    animFrameRef.current = requestAnimationFrame(animateEvaporation);
  };

  if (phase === "hidden") return null;

  const clothCursorSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><g transform="rotate(${clothAngle} 21 21)"><rect x="6" y="8" width="30" height="26" rx="6" fill="%230284C7" fill-opacity="0.88" stroke="%23FFFFFF" stroke-width="2.5" stroke-dasharray="3 3"/><circle cx="21" cy="21" r="7" fill="%2338BDF8"/></g></svg>`;

  return (
    <AnimatePresence>
      {(phase === "video" || phase === "glass" || phase === "evaporating") && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: phase === "evaporating" ? 0 : 1,
            scale: phase === "evaporating" ? 1.04 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-transparent overflow-hidden select-none"
          style={{
            cursor: phase === "glass" ? `url('${clothCursorSvg}') 21 21, crosshair` : "default",
          }}
        >
          {/* Phase 1: Video Playback */}
          {phase === "video" && (
            <video
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              onError={handleVideoEnded}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/intro.mp4" type="video/mp4" />
            </video>
          )}

          {/* Phase 2: Ultra-Realistic Frosted Glass Surface */}
          {(phase === "glass" || phase === "evaporating") && (
            <div className="relative w-full h-full">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 touch-none" />

              {/* Real Cleaned Surface Area Progress Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/85 backdrop-blur-2xl border border-white/70 text-foreground px-8 py-4.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-3"
                >
                  <span className="text-2xl">🧽</span>
                  <span className="font-black text-lg md:text-xl tracking-tight text-foreground">
                    Saytni ochish uchun oynani arting
                  </span>
                </motion.div>

                {/* Smooth 0% -> 15% -> 30% -> 45% -> 60% -> 75% -> 80% Progress Indicator */}
                <div className="mt-3 inline-flex items-center gap-2 bg-white/50 backdrop-blur-md px-5 py-2 rounded-full text-xs font-extrabold text-slate-800 shadow-sm">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span>{wipePercent}% haqiqiy yuzasi artildi (80% da avtomatik ochiladi)</span>
                </div>
              </div>

              {/* Skip Button */}
              <button
                onClick={triggerEvaporation}
                className="absolute bottom-8 right-8 z-30 bg-white/80 backdrop-blur-xl border border-white/50 text-foreground px-6 py-3 rounded-full text-xs font-bold hover:bg-white transition-all shadow-xl"
              >
                O'tkazib yuborish ➔
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
