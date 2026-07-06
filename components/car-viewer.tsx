"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useMemo } from "react";
import type { ForgeProduct } from "@/lib/types";

function CarBody({ color, wheelColor }: { color: string; wheelColor: string }) {
  return (
    <group position={[0, 0.4, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[2.2, 0.5, 4.2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh castShadow position={[0, 0.75, -0.2]}>
        <boxGeometry args={[1.8, 0.45, 2]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0, 0.85, 0.9]}>
        <boxGeometry args={[1.7, 0.08, 1.2]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {[
        [-0.95, 0.2, 1.3],
        [0.95, 0.2, 1.3],
        [-0.95, 0.2, -1.3],
        [0.95, 0.2, -1.3],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.38, 0.38, 0.25, 24]} />
            <meshStandardMaterial color={wheelColor} metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.28, 16]} />
            <meshStandardMaterial color="#222" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.08, 2.15]}>
        <boxGeometry args={[1.9, 0.12, 0.15]} />
        <meshStandardMaterial color="#222" emissive="#ff1744" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Scene({ bodyColor, wheelColor }: { bodyColor: string; wheelColor: string }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <CarBody color={bodyColor} wheelColor={wheelColor} />
      <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={12} blur={2} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={12} maxPolarAngle={Math.PI / 2.1} />
    </>
  );
}

export function CarViewer({ appliedMods }: { appliedMods: ForgeProduct[] }) {
  const { bodyColor, wheelColor } = useMemo(() => {
    let body = "#3b82f6";
    let wheels = "#333333";

    for (const mod of appliedMods) {
      if (!mod.color) continue;
      if (mod.category === "wheels") wheels = mod.color;
      else if (mod.category === "exterior") body = mod.color;
    }

    return { bodyColor: body, wheelColor: wheels };
  }, [appliedMods]);

  return (
    <div className="h-full w-full min-h-[320px]">
      <Canvas shadows camera={{ position: [5, 3, 6], fov: 45 }}>
        <Scene bodyColor={bodyColor} wheelColor={wheelColor} />
      </Canvas>
    </div>
  );
}