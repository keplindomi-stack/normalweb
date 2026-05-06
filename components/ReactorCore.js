"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ReactorCore({ scrollProgress, finaleProgress }) {
  const groupRef = useRef();
  const sphereRef = useRef();
  const ringsRef = useRef([]);

  const rings = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      radius: 3 + i * 1.5,
      tube: 0.15 + i * 0.05,
      speed: 0.3 + i * 0.2,
      direction: i % 2 === 0 ? 1 : -1,
      color: i % 2 === 0 ? "#00ffff" : "#ff00a0",
    }));
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x = time * rings[i].speed * rings[i].direction * 0.5;
        ring.rotation.y = time * rings[i].speed * 0.3;
        ring.rotation.z = time * rings[i].speed * rings[i].direction * 0.2;
      }
    });

    if (sphereRef.current) {
      sphereRef.current.rotation.y = time * 0.2;
      sphereRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }

    const scale = 1 + finaleProgress * 2;
    groupRef.current.scale.setScalar(scale);

    if (sphereRef.current && sphereRef.current.material) {
      const intensity = 1 + finaleProgress * 8;
      sphereRef.current.material.uniforms.uIntensity.value = intensity;
    }
  });

  return (
    <group ref={groupRef} visible={finaleProgress > 0}>
      {rings.map((ring, index) => (
        <mesh
          key={index}
          ref={(el) => { ringsRef.current[index] = el; }}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <torusGeometry args={[ring.radius, ring.tube, 16, 100]} />
          <meshPhysicalMaterial
            color={ring.color}
            metalness={0.9}
            roughness={0.1}
            emissive={ring.color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      <mesh ref={sphereRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          transparent
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uColor: { value: new THREE.Color("#ffffff") },
            uIntensity: { value: 1 },
          }}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;

            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform vec3 uColor;
            uniform float uIntensity;

            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;

            void main() {
              vec3 viewDirection = normalize(cameraPosition - vPosition);
              float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);

              float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
              float hologram = sin(vPosition.y * 10.0 + uTime * 3.0) * 0.5 + 0.5;

              vec3 color = uColor * fresnel * uIntensity;
              color += vec3(0.0, 0.8, 1.0) * hologram * 0.3 * uIntensity;
              color += vec3(1.0, 0.0, 0.6) * pulse * 0.2 * uIntensity;

              float alpha = fresnel * 0.8 + 0.1;

              gl_FragColor = vec4(color, alpha);
            }
          `}
        />
      </mesh>

      <pointLight position={[0, 0, 0]} color="#ffffff" intensity={5} distance={30} />
      <pointLight position={[5, 5, 5]} color="#00ffff" intensity={3} distance={20} />
      <pointLight position={[-5, -5, -5]} color="#ff00a0" intensity={3} distance={20} />
    </group>
  );
}
