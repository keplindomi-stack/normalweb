"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GlassmorphismCards() {
  const cardsRef = useRef([]);

  const cards = [
    {
      title: "STRATEGY",
      content: "Data-driven creative solutions that transform brands into market leaders.",
      position: { left: "10%", top: "30%" },
      delay: 0,
    },
    {
      title: "DESIGN",
      content: "Pixel-perfect interfaces crafted with obsessive attention to detail.",
      position: { right: "10%", top: "25%" },
      delay: 0.1,
    },
    {
      title: "DEVELOPMENT",
      content: "High-performance code that pushes the boundaries of web technology.",
      position: { left: "15%", top: "60%" },
      delay: 0.2,
    },
    {
      title: "DEPLOYMENT",
      content: "Seamless CI/CD pipelines ensuring zero-downtime global delivery.",
      position: { right: "12%", top: "55%" },
      delay: 0.3,
    },
  ];

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(
        card,
        {
          x: "100vw",
          opacity: 0,
          scale: 0.8,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: cards[index].delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".scroll-container",
            start: "25% top",
            end: "50% top",
            scrub: 1,
          },
        }
      );
    });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          ref={(el) => { cardsRef.current[index] = el; }}
          style={{
            position: "absolute",
            ...card.position,
            width: "280px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "16px",
            padding: "24px",
            color: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            transform: "translateZ(0)",
            opacity: 0,
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "2px",
              marginBottom: "12px",
              color: "#00ffff",
              textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
            }}
          >
            {card.title}
          </h3>
          <p
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: "rgba(255, 255, 255, 0.8)",
              margin: 0,
            }}
          >
            {card.content}
          </p>
        </div>
      ))}
    </div>
  );
}
