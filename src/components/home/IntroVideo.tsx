"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroVideo() {
  // Start with 'video' phase by default for 0ms instant DOM rendering
  const [phase, setPhase] = useState<"hidden" | "video" | "glass" | "dissolving">("video");
  const [isMobile, setIsMobile] = useState(false);
  const [wipePercent, setWipePercent] = useState(0);
  const [clothAngle, setClothAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isWipingRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Check if intro has already been completed in localStorage
    const hasSeen = localStorage.getItem("intro_seen");
    if (hasSeen) {
      setPhase("hidden");
      return;
    }

    // Force instant play on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Web Audio API Synthesizers
  const playWipeSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const bufferSize = ctx.sampleRate * 0.03;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 800;
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch (e) {}
  };

  const playChimeSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  const handleVideoEnded = () => {
    setPhase("glass");
  };

  // Render Light Realistic House Window Glass Texture
  useEffect(() => {
    if (phase !== "glass" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const drawRealisticDirtyGlass = () => {
      ctx.fillStyle = "rgba(220, 232, 245, 0.42)";
      ctx.fillRect(0, 0, width, height);

      const edgeGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.3,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
      edgeGrad.addColorStop(1, "rgba(100, 110, 125, 0.3)");
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, width, height);

      const dustCount = isMobile ? 300 : 1100;
      ctx.fillStyle = "rgba(160, 150, 135, 0.38)";
      for (let i = 0; i < dustCount; i++) {
        const dx = Math.random() * width;
        const dy = Math.random() * height;
        const dr = Math.random() * 2.5 + 0.5;
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.fill();
      }

      const smudgeCount = isMobile ? 15 : 40;
      for (let i = 0; i < smudgeCount; i++) {
        const fx = Math.random() * width;
        const fy = Math.random() * height;
        const fr = Math.random() * 40 + 15;

        const fingerprintGrad = ctx.createRadialGradient(fx, fy, 4, fx, fy, fr);
        fingerprintGrad.addColorStop(0, "rgba(180, 170, 155, 0.28)");
        fingerprintGrad.addColorStop(0.6, "rgba(140, 130, 115, 0.14)");
        fingerprintGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = fingerprintGrad;
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawRealisticDirtyGlass();

    const brushRadius = isMobile ? 110 : 95;

    const eraseCircleAt = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      const grad = ctx.createRadialGradient(x, y, 0, x, y, brushRadius);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.7, "rgba(0,0,0,0.85)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();

      playWipeSound();
    };

    const eraseLine = (x1: number, y1: number, x2: number, y2: number) => {
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(1, Math.floor(dist / 14));
      for (let i = 0; i <= steps; i++) {
        const tx = x1 + (x2 - x1) * (i / steps);
        const ty = y1 + (y2 - y1) * (i / steps);
        eraseCircleAt(tx, ty);
      }
    };

    const calculateRealCleanedArea = () => {
      const gridCols = isMobile ? 18 : 40;
      const gridRows = isMobile ? 22 : 30;
      const colStep = Math.floor(width / gridCols);
      const rowStep = Math.floor(height / gridRows);
      
      let transparentSamples = 0;
      const totalSamples = gridCols * gridRows;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const sampleX = Math.floor(c * colStep + colStep / 2);
          const sampleY = Math.floor(r * rowStep + rowStep / 2);
          const pixel = ctx.getImageData(sampleX, sampleY, 1, 1).data;
          if (pixel[3] < 45) {
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
      setIsDragging(true);
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      eraseCircleAt(e.clientX, e.clientY);
      calculateRealCleanedArea();
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      isWipingRef.current = false;
      setIsDragging(false);
      lastPointRef.current = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      isWipingRef.current = true;
      setIsDragging(true);
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
      setIsDragging(false);
      lastPointRef.current = null;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
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

  const triggerEvaporation = () => {
    setPhase("dissolving");
    localStorage.setItem("intro_seen", "true");
    playChimeSound();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let alpha = 1;
    const animateEvaporation = () => {
      if (!ctx || !canvas) return;
      alpha -= 0.05;

      if (alpha <= 0) {
        setPhase("hidden");
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        return;
      }

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animFrameRef.current = requestAnimationFrame(animateEvaporation);
    };

    animFrameRef.current = requestAnimationFrame(animateEvaporation);
  };

  if (phase === "hidden") return null;

  const clothCursorSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g transform="rotate(${clothAngle} 24 24) scale(${isDragging ? 1.15 : 1})"><rect x="8" y="10" width="32" height="28" rx="7" fill="%230284C7" fill-opacity="0.9" stroke="%23FFFFFF" stroke-width="2.5" stroke-dasharray="3 3"/><circle cx="24" cy="24" r="8" fill="%2338BDF8"/></g></svg>`;

  const brightness = 50 + (wipePercent * 0.5);
  const contrast = 75 + (wipePercent * 0.25);
  const saturation = 60 + (wipePercent * 0.4);
  const blur = Math.max(0, 8 - (wipePercent * 0.1));

  return (
    <AnimatePresence>
      {(phase === "video" || phase === "glass" || phase === "dissolving") && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: phase === "dissolving" ? 0 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] bg-black overflow-hidden select-none"
          style={{
            cursor: phase === "glass" ? `url('${clothCursorSvg}') 24 24, crosshair` : "default",
            backdropFilter: phase === "glass" ? `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)` : "none",
          }}
        >
          {/* Preload Video Link */}
          <link rel="preload" href="/intro.mp4" as="video" type="video/mp4" />

          {/* Phase 1: Video Playback */}
          {phase === "video" && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              // @ts-ignore
              webkit-playsinline="true"
              onEnded={handleVideoEnded}
              onError={handleVideoEnded}
              className="absolute inset-0 w-full h-full object-cover z-10"
            >
              <source src="/intro.mp4" type="video/mp4" />
            </video>
          )}

          {/* Phase 2: Ultra Realistic Dirty Glass Surface & Responsive Top/Center Glass Card */}
          {(phase === "glass" || phase === "dissolving") && (
            <div className="relative w-full h-full">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 touch-none" />

              {/* Apple / Dyson / Tesla Quality Glass Card */}
              <div className="absolute top-12 md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 z-20 pointer-events-none text-center px-4 w-full max-w-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-black/75 backdrop-blur-3xl border border-white/20 text-white px-6 py-4 md:px-8 md:py-6 rounded-[28px] shadow-[0_30px_70px_rgba(0,0,0,0.4)] w-full space-y-3 md:space-y-4"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl md:text-2xl">🧽</span>
                    <h3 className="font-black text-lg md:text-xl tracking-tight text-white">Oynani arting</h3>
                  </div>

                  <p className="text-[11px] md:text-xs text-gray-300 font-medium leading-relaxed">
                    Saytni ochish uchun oynaning 80% qismini tozalang.
                  </p>

                  {/* Animated Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-bold text-gray-300">
                      <span>Tozalik darajasi</span>
                      <span className="text-primary font-black">{wipePercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-primary rounded-full shadow-[0_0_12px_rgba(2,132,199,0.8)]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${Math.min(wipePercent, 80)}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
