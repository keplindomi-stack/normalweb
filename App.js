"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Experience from "./components/Experience";
import LoadingScreen from "./components/LoadingScreen";
import GlassmorphismCards from "./components/GlassmorphismCards";
import Footer from "./components/Footer";
import "./styles/globals.css";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoaded(true), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {!loaded && <LoadingScreen progress={Math.min(progress, 100)} />}

      <div
        className="scroll-container"
        style={{ height: "400vh", position: "relative" }}
      >
        <div className="canvas-container">
          <Canvas
            camera={{ position: [0, 0, 30], fov: 75, near: 0.1, far: 1000 }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={null}>
              <Experience loaded={loaded} />
            </Suspense>
          </Canvas>
        </div>

        <GlassmorphismCards />

        <div className="scroll-spacer" />
      </div>

      <Footer />
    </div>
  );
}
