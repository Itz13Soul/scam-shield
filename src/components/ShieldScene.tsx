"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function shieldShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 1.25);
  s.bezierCurveTo(0.55, 1.1, 0.95, 1.05, 1.0, 1.0);
  s.bezierCurveTo(1.0, 0.1, 0.8, -0.65, 0, -1.3);
  s.bezierCurveTo(-0.8, -0.65, -1.0, 0.1, -1.0, 1.0);
  s.bezierCurveTo(-0.95, 1.05, -0.55, 1.1, 0, 1.25);
  return s;
}

function Scene({ still }: { still: boolean }) {
  const root = useRef<THREE.Group>(null);
  const shield = useRef<THREE.Group>(null);
  const waves = useRef<THREE.Group>(null);
  const bad = useRef<THREE.Group>(null);

  const geo = useMemo(() => new THREE.ExtrudeGeometry(shieldShape(), { depth: 0.22, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3, curveSegments: 32 }), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 25), [geo]);

  const threats = useMemo(() => {
    const out: { a: number; r: number; y: number; s: number }[] = [];
    for (let i = 0; i < 14; i++) out.push({ a: (i / 14) * Math.PI * 2, r: 2.3 + (i % 3) * 0.35, y: Math.sin(i * 2.1) * 0.9, s: 0.5 + (i % 4) * 0.12 });
    return out;
  }, []);

  useFrame(({ pointer, clock }, dt) => {
    const g = root.current;
    if (g) {
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.15 - pointer.y * 0.3, 0.05);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.5, 0.05);
    }
    if (still) return;
    const t = clock.elapsedTime;
    if (shield.current) shield.current.rotation.y = Math.sin(t * 0.6) * 0.5;
    if (waves.current) {
      waves.current.children.forEach((c, i) => {
        const p = (t * 0.45 + i / 3) % 1;
        c.scale.setScalar(1 + p * 1.8);
        ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.4;
      });
    }
    if (bad.current) {
      bad.current.children.forEach((c, i) => {
        const th = threats[i];
        const a = th.a + t * 0.25 * (i % 2 ? 1 : -1);
        const pulse = (Math.sin(t * 1.4 + i) + 1) / 2;
        const r = th.r - pulse * 0.45;
        c.position.set(Math.cos(a) * r, th.y, Math.sin(a) * r);
        c.rotation.x += dt * 1.2;
        c.rotation.y += dt * 0.9;
      });
    }
  });

  return (
    <group ref={root} rotation={[0.15, 0, 0]}>
      <group ref={shield}>
        <mesh geometry={geo} position={[0, 0, -0.11]}>
          <meshBasicMaterial color="#0b3d3a" />
        </mesh>
        <lineSegments geometry={edges} position={[0, 0, -0.11]}>
          <lineBasicMaterial color="#2dd4bf" />
        </lineSegments>
        <mesh position={[0, 0.05, 0.2]}>
          <torusGeometry args={[0.38, 0.06, 12, 40, Math.PI * 1.6]} />
          <meshBasicMaterial color="#5eead4" />
        </mesh>
        <mesh position={[0, -0.12, 0.2]}>
          <boxGeometry args={[0.7, 0.5, 0.08]} />
          <meshBasicMaterial color="#5eead4" />
        </mesh>
        <mesh position={[0, -0.12, 0.26]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color="#042f2e" />
        </mesh>
      </group>
      <group ref={waves}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <torusGeometry args={[1.5, 0.01, 6, 120]} />
            <meshBasicMaterial color="#2dd4bf" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
      <group ref={bad}>
        {threats.map((t, i) => (
          <mesh key={i} scale={t.s}>
            <octahedronGeometry args={[0.18, 0]} />
            <meshBasicMaterial color={i % 3 === 0 ? "#f87171" : "#fb923c"} wireframe />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function ShieldScene() {
  const still = useSyncExternalStore(subscribe, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  return (
    <Canvas camera={{ position: [0, 0, 6.4], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <Scene still={still} />
    </Canvas>
  );
}
