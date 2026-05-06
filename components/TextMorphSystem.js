"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export default function TextMorphSystem({ scrollProgress, transitionProgress }) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const [fontLoaded, setFontLoaded] = useState(false);
  const textPositionsRef = useRef(null);

  const PARTICLE_COUNT = 50000;

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        const textGeo = new TextGeometry("CREATIVE\nDIGITAL\nEXPERIENCES", {
          font: font,
          size: 2,
          height: 0.5,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        textGeo.computeBoundingBox();
        const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
        textGeo.translate(centerOffset, 0, 0);

        const positions = textGeo.attributes.position.array;
        const textPosArray = new Float32Array(PARTICLE_COUNT * 3);
        const textCount = positions.length / 3;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          if (i < textCount) {
            textPosArray[i3] = positions[i3];
            textPosArray[i3 + 1] = positions[i3 + 1];
            textPosArray[i3 + 2] = positions[i3 + 2];
          } else {
            textPosArray[i3] = (Math.random() - 0.5) * 30;
            textPosArray[i3 + 1] = (Math.random() - 0.5) * 10;
            textPosArray[i3 + 2] = (Math.random() - 0.5) * 5;
          }
        }

        textPositionsRef.current = textPosArray;
        setFontLoaded(true);
      }
    );
  }, []);

  const { positions, randoms, textPositions } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const rand = new Float32Array(PARTICLE_COUNT);
    const txtPos = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const t = i / PARTICLE_COUNT;
      const angle = t * Math.PI * 20;
      const radius = 2 + t * 15;
      const height = (t - 0.5) * 20 + Math.sin(angle * 3) * 2;

      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = Math.sin(angle) * radius;
      pos[i3 + 2] = height;

      txtPos[i3] = pos[i3];
      txtPos[i3 + 1] = pos[i3 + 1];
      txtPos[i3 + 2] = pos[i3 + 2];

      rand[i] = Math.random();
    }

    return { positions: pos, randoms: rand, textPositions: txtPos };
  }, []);

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    const morphFactor = Math.min(1, Math.max(0, (transitionProgress - 0.3) / 0.4));
    const easedMorph = morphFactor * morphFactor * (3 - 2 * morphFactor);

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uMorphProgress.value = easedMorph;
  });

  useEffect(() => {
    if (!pointsRef.current || !textPositionsRef.current) return;

    const geometry = pointsRef.current.geometry;
    geometry.setAttribute(
      "aTextPos",
      new THREE.BufferAttribute(textPositionsRef.current, 3)
    );
  }, [fontLoaded]);

  if (!fontLoaded) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={PARTICLE_COUNT}
          array={randoms}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aTextPos"
          count={PARTICLE_COUNT}
          array={textPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          uniform float uMorphProgress;
          attribute float aRandom;
          attribute vec3 aTextPos;
          varying float vRandom;
          varying float vMorphProgress;

          void main() {
            vRandom = aRandom;
            vMorphProgress = uMorphProgress;

            vec3 morphedPosition = mix(position, aTextPos, uMorphProgress);

            float noise = sin(uTime * 2.0 + aRandom * 10.0) * 0.1 * (1.0 - uMorphProgress);
            morphedPosition += vec3(noise);

            vec4 mvPosition = modelViewMatrix * vec4(morphedPosition, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            float size = (2.0 + uMorphProgress * 3.0) * (1.0 / -mvPosition.z);
            gl_PointSize = size * 12.0;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying float vRandom;
          varying float vMorphProgress;

          void main() {
            vec2 coord = gl_PointCoord - vec2(0.5);
            float dist = length(coord);
            if (dist > 0.5) discard;

            float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

            vec3 color = mix(vec3(0.0, 0.83, 1.0), vec3(1.0, 0.0, 0.63), vMorphProgress);
            color = mix(color, vec3(0.44, 0.0, 1.0), vRandom * 0.3);

            float intensity = 0.6 + vMorphProgress * 0.6;
            color *= intensity;

            gl_FragColor = vec4(color, alpha * (0.6 + vMorphProgress * 0.4));
          }
        `}
        uniforms={{
          uTime: { value: 0 },
          uMorphProgress: { value: 0 },
          uColor1: { value: new THREE.Color("#00d4ff") },
          uColor2: { value: new THREE.Color("#ff00a0") },
        }}
      />
    </points>
  );
}
