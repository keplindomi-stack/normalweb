"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders/ParticleShader";

export default function QuantumVortex({ scrollProgress, mousePos, visible }) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const mouseWorldPos = useRef(new THREE.Vector3(0, 0, 0));
  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  const PARTICLE_COUNT = 50000;

  const { positions, randoms, originalPositions, speeds } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const rand = new Float32Array(PARTICLE_COUNT);
    const origPos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const t = i / PARTICLE_COUNT;
      const angle = t * Math.PI * 20;
      const radius = 2 + t * 15;
      const height = (t - 0.5) * 20 + Math.sin(angle * 3) * 2;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = height;

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      origPos[i3] = x;
      origPos[i3 + 1] = y;
      origPos[i3 + 2] = z;

      rand[i] = Math.random();
      spd[i] = 0.5 + Math.random() * 2;
    }

    return { positions: pos, randoms: rand, originalPositions: origPos, speeds: spd };
  }, []);

  useEffect(() => {
    raycaster.setFromCamera(mousePos, camera);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, target);
    if (target) {
      mouseWorldPos.current.copy(target);
    }
  }, [mousePos, raycaster, plane, camera]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    const time = state.clock.elapsedTime;
    const uniforms = materialRef.current.uniforms;

    uniforms.uTime.value = time;
    uniforms.uScrollProgress.value = scrollProgress;
    uniforms.uMouse.value = mouseWorldPos.current;
    uniforms.uMouseStrength.value = 8.0;

    if (pointsRef.current) {
      pointsRef.current.rotation.z = time * 0.05;
    }
  });

  return (
    <points ref={pointsRef} visible={visible}>
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
          attach="attributes-aOriginalPos"
          count={PARTICLE_COUNT}
          array={originalPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={PARTICLE_COUNT}
          array={speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uScrollProgress: { value: 0 },
          uMouse: { value: new THREE.Vector3(0, 0, 0) },
          uMouseStrength: { value: 8.0 },
          uColor1: { value: new THREE.Color("#00d4ff") },
          uColor2: { value: new THREE.Color("#ff00a0") },
          uColor3: { value: new THREE.Color("#7000ff") },
        }}
      />
    </points>
  );
}
