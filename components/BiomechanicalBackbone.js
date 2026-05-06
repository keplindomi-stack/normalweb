"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BiomechanicalBackbone({ scrollProgress, rotationProgress }) {
  const groupRef = useRef();

  const spineSegments = useMemo(() => {
    const segments = [];
    const segmentCount = 24;

    for (let i = 0; i < segmentCount; i++) {
      const t = i / (segmentCount - 1);
      const y = (t - 0.5) * 12;
      const radius = 1.2 + Math.sin(t * Math.PI) * 0.8;
      const twist = t * Math.PI * 4;

      segments.push({
        position: [Math.sin(twist) * 0.5, y, Math.cos(twist) * 0.5],
        rotation: [twist, t * Math.PI * 2, 0],
        scale: [radius, 0.4, radius],
        id: i,
      });
    }

    return segments;
  }, []);

  const nerveFibers = useMemo(() => {
    const fibers = [];
    const fiberCount = 48;

    for (let i = 0; i < fiberCount; i++) {
      const t = i / fiberCount;
      const angle = t * Math.PI * 2;
      const points = [];

      for (let j = 0; j <= 20; j++) {
        const jt = j / 20;
        const y = (jt - 0.5) * 12;
        const r = 2.5 + Math.sin(jt * Math.PI * 3 + angle) * 0.5;
        const x = Math.cos(angle + jt * Math.PI * 2) * r;
        const z = Math.sin(angle + jt * Math.PI * 2) * r;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      fibers.push(curve);
    }

    return fibers;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const easedRotation = THREE.MathUtils.smoothstep(rotationProgress, 0, 1);
    groupRef.current.rotation.y = easedRotation * Math.PI * 2;

    const time = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.3;
  });

  return (
    <group ref={groupRef} visible={rotationProgress > 0}>
      {spineSegments.map((segment) => (
        <group
          key={segment.id}
          position={segment.position}
          rotation={segment.rotation}
        >
          <mesh>
            <cylinderGeometry args={[segment.scale[0], segment.scale[0] * 0.8, segment.scale[1], 16]} />
            <meshPhysicalMaterial
              color="#1a1a2e"
              metalness={0.95}
              roughness={0.2}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              emissive="#0a0a1a"
              emissiveIntensity={0.2}
            />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[segment.scale[0] * 0.6, 0.08, 8, 16]} />
            <meshPhysicalMaterial
              color="#00ffff"
              metalness={0.8}
              roughness={0.2}
              emissive="#00ffff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}

      {nerveFibers.map((curve, index) => (
        <mesh key={`fiber-${index}`}>
          <tubeGeometry args={[curve, 64, 0.03, 8, false]} />
          <meshPhysicalMaterial
            color={index % 2 === 0 ? "#00ffff" : "#ff00a0"}
            metalness={0.9}
            roughness={0.15}
            emissive={index % 2 === 0 ? "#00ffff" : "#ff00a0"}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      <pointLight position={[8, 0, 8]} color="#00ffff" intensity={15} distance={25} />
      <pointLight position={[-8, 0, -8]} color="#ff00a0" intensity={15} distance={25} />
      <pointLight position={[0, 6, 0]} color="#00ffff" intensity={5} distance={20} />
      <pointLight position={[0, -6, 0]} color="#ff00a0" intensity={5} distance={20} />
    </group>
  );
}
