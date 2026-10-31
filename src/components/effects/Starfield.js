"use client";

// Night sky behind the whole site: twinkling stars plus a shooting star every few seconds.
// Drawn on one <canvas> fixed to the screen, so it stays light even on phones.
// Visitors whose device asks for reduced motion get still stars and no shooting stars.

import { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let stars = [];
    let meteors = [];
    let nextMeteorAt = 1200;
    let frameId = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fewer stars on small screens
      const count = Math.round((width * height) / (width < 768 ? 9000 : 6000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() < 0.85 ? 0.4 + Math.random() * 0.8 : 1.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      }));
    }

    function spawnMeteor() {
      const speed = 9 + Math.random() * 5;
      meteors.push({
        x: width * (0.3 + Math.random() * 0.8),
        y: -30 + Math.random() * height * 0.4,
        vx: -speed,
        vy: speed * (0.5 + Math.random() * 0.25),
        length: 150 + Math.random() * 130,
        life: 0,
        maxLife: 60 + Math.random() * 30,
      });
    }

    function drawStars(time) {
      ctx.fillStyle = "#dce7ff";
      for (const star of stars) {
        const twinkle = reduced ? 0.7 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * 0.001 * star.speed + star.phase));
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawMeteors() {
      meteors = meteors.filter((m) => m.life < m.maxLife);
      for (const m of meteors) {
        m.x += m.vx;
        m.y += m.vy;
        m.life += 1;

        // Fade in quickly, fade out at the end
        const fade = Math.min(1, m.life / 8, (m.maxLife - m.life) / 20);
        const norm = Math.hypot(m.vx, m.vy);
        const tailX = m.x - (m.vx / norm) * m.length;
        const tailY = m.y - (m.vy / norm) * m.length;

        const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.95 * fade})`);
        gradient.addColorStop(0.3, `rgba(160, 196, 255, ${0.45 * fade})`);
        gradient.addColorStop(1, "rgba(127, 168, 245, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Glowing head
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.shadowColor = "#9ec1ff";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function frame(time) {
      ctx.clearRect(0, 0, width, height);
      drawStars(time);
      if (time > nextMeteorAt) {
        spawnMeteor();
        nextMeteorAt = time + 2500 + Math.random() * 3500;
      }
      drawMeteors();
      frameId = requestAnimationFrame(frame);
    }

    function start() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(frame);
    }

    resize();

    if (reduced) {
      drawStars(0);
    } else {
      start();
    }

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduced) drawStars(0);
      }, 150);
    };

    // Pause the animation while the tab is hidden to save battery
    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) cancelAnimationFrame(frameId);
      else start();
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
