"use client";
import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const mouse = { x: -9999, y: -9999 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Color palette: teal, purple, blue
    const COLORS = [
      { r: 0,   g: 220, b: 190 },
      { r: 124, g: 92,  b: 252 },
      { r: 0,   g: 180, b: 255 },
    ];

    const NODE_COUNT = 120;
    const nodes = Array.from({ length: NODE_COUNT }, () => {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1,
        // pulse
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        cr: c.r, cg: c.g, cb: c.b,
      };
    });

    // Shooting stars
    type Star = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
    const stars: Star[] = [];
    const spawnStar = () => {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        vx: 2 + Math.random() * 3,
        vy: 0.5 + Math.random() * 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    };
    let starTimer = 0;

    const draw = () => {
      // Soft trail
      ctx.fillStyle = "rgba(6, 11, 18, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn shooting stars periodically
      starTimer++;
      if (starTimer > 120) {
        spawnStar();
        starTimer = 0;
      }

      // Draw shooting stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const progress = s.life / s.maxLife;
        const alpha = progress < 0.2
          ? progress / 0.2
          : 1 - (progress - 0.2) / 0.8;
        const tailLen = 80;
        const grad = ctx.createLinearGradient(
          s.x - s.vx * tailLen, s.y - s.vy * tailLen,
          s.x, s.y
        );
        grad.addColorStop(0, `rgba(0,220,190,0)`);
        grad.addColorStop(1, `rgba(0,220,190,${alpha * 0.8})`);
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * tailLen, s.y - s.vy * tailLen);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (s.life >= s.maxLife) stars.splice(i, 1);
      }

      // Update nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        // Mouse repel
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          const force = (120 - d) / 120;
          n.x += (dx / d) * force * 2;
          n.y += (dy / d) * force * 2;
        }
      }

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.4;
            // blend the two node colors
            const r = Math.round((nodes[i].cr + nodes[j].cr) / 2);
            const g = Math.round((nodes[i].cg + nodes[j].cg) / 2);
            const b = Math.round((nodes[i].cb + nodes[j].cb) / 2);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Nodes with glow
      for (const n of nodes) {
        const pulse = 0.6 + Math.sin(n.pulse) * 0.4;
        const radius = n.r * (1 + Math.sin(n.pulse) * 0.3);

        // Outer glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 6);
        glow.addColorStop(0, `rgba(${n.cr},${n.cg},${n.cb},${pulse * 0.3})`);
        glow.addColorStop(1, `rgba(${n.cr},${n.cg},${n.cb},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.cr},${n.cg},${n.cb},${pulse})`;
        ctx.fill();
      }

      // Mouse spotlight
      const spotlight = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 200
      );
      spotlight.addColorStop(0, "rgba(0,220,190,0.04)");
      spotlight.addColorStop(1, "rgba(0,220,190,0)");
      ctx.fillStyle = spotlight;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(draw);
    };

    // Clear once before starting
    ctx.fillStyle = "#060b12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 -z-10 w-full h-full"
    />
  );
}