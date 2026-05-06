"use client";

import { useRef, useEffect } from "react";

export default function Footer() {
  const textRef = useRef();

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const glitchInterval = setInterval(() => {
      el.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
      el.style.textShadow = `
        ${Math.random() * 4 - 2}px 0 #00ffff,
        ${Math.random() * 4 - 2}px 0 #ff00a0
      `;
      el.style.opacity = "0.8";

      setTimeout(() => {
        el.style.transform = "translate(0, 0)";
        el.style.textShadow = "0 0 10px rgba(0, 255, 255, 0.5)";
        el.style.opacity = "1";
      }, 150);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "20px",
        zIndex: 99,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <p
        ref={textRef}
        style={{
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#00ffff",
          textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
          letterSpacing: "1px",
          transition: "all 0.1s ease",
          animation: "float 3s ease-in-out infinite",
        }}
      >
        Credit : Kelv | Telegram: t.me/h4xorrr
      </p>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
