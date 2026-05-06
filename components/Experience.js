"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import QuantumVortex from "./QuantumVortex";
import TextMorphSystem from "./TextMorphSystem";
import BiomechanicalBackbone from "./BiomechanicalBackbone";
import ReactorCore from "./ReactorCore";

gsap.registerPlugin(ScrollTrigger);

export default function Experience({ loaded }) {
  const groupRef = useRef();
  const { camera } = useThree();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0, 0));
  const bloomRef = useRef();
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 30));

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos(
        new THREE.Vector2(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        )
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      },
    });

    tl.to(cameraTarget.current, {
      z: 5,
      duration: 0.25,
      ease: "power2.inOut",
    }, 0);

    tl.to(cameraTarget.current, {
      z: 15,
      duration: 0.25,
      ease: "power2.inOut",
    }, 0.5);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loaded]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mousePos.x * 2,
      0.05
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mousePos.y * 2,
      0.05
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      cameraTarget.current.z,
      0.05
    );
    camera.lookAt(0, 0, 0);

    if (bloomRef.current && scrollProgress > 0.75) {
      const finaleIntensity = 1.5 + (scrollProgress - 0.75) / 0.25 * 3.5;
      bloomRef.current.intensity = THREE.MathUtils.lerp(
        bloomRef.current.intensity,
        finaleIntensity,
        0.1
      );
    }
  });

  const showVortex = scrollProgress < 0.55;
  const showText = scrollProgress >= 0.2 && scrollProgress < 0.6;
  const showBackbone = scrollProgress >= 0.45 && scrollProgress < 0.85;
  const showReactor = scrollProgress >= 0.7;

  return (
    <>
      <group ref={groupRef}>
        {showVortex && (
          <QuantumVortex
            scrollProgress={scrollProgress}
            mousePos={mousePos}
            visible={scrollProgress < 0.5}
          />
        )}

        {showText && (
          <TextMorphSystem
            scrollProgress={scrollProgress}
            transitionProgress={Math.max(0, (scrollProgress - 0.25) / 0.25)}
          />
        )}

        {showBackbone && (
          <BiomechanicalBackbone
            scrollProgress={scrollProgress}
            rotationProgress={Math.max(0, (scrollProgress - 0.5) / 0.25)}
          />
        )}

        {showReactor && (
          <ReactorCore
            scrollProgress={scrollProgress}
            finaleProgress={Math.max(0, (scrollProgress - 0.75) / 0.25)}
          />
        )}
      </group>

      <EffectComposer>
        <Bloom
          ref={bloomRef}
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Noise
          premultiply
          blendFunction={BlendFunction.ADD}
          opacity={0.15}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.002]}
        />
      </EffectComposer>

      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00ffff" />
    </>
  );
}
