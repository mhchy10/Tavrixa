
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Core() {
  const core = useRef<THREE.Mesh>(null)
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (core.current) {
      core.current.rotation.y += delta * 0.18
      core.current.rotation.x += delta * 0.08
    }

    if (ring1.current) ring1.current.rotation.z += delta * 0.16
    if (ring2.current) ring2.current.rotation.z -= delta * 0.1

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        state.pointer.x * 0.12,
        0.035,
      )
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -state.pointer.y * 0.08,
        0.035,
      )
    }
  })

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.22}>
        {/* Outer energy halo */}
        <mesh>
          <sphereGeometry args={[1.12, 48, 48]} />
          <meshBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.045}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Crystalline planetary core */}
        <mesh ref={core}>
          <icosahedronGeometry args={[0.9, 3]} />
          <meshStandardMaterial
            color="#6d28d9"
            emissive="#7c3aed"
            emissiveIntensity={1.4}
            metalness={0.8}
            roughness={0.22}
            wireframe
          />
        </mesh>

        {/* Inner luminous core */}
        <mesh scale={0.68}>
          <icosahedronGeometry args={[0.9, 2]} />
          <meshStandardMaterial
            color="#312e81"
            emissive="#4f46e5"
            emissiveIntensity={1.8}
            metalness={0.65}
            roughness={0.3}
            wireframe
          />
        </mesh>

        {/* Cyan orbital ring */}
        <mesh ref={ring1} rotation={[1.05, 0.35, 0]}>
          <torusGeometry args={[1.28, 0.012, 12, 180]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>

        {/* Violet orbital ring */}
        <mesh ref={ring2} rotation={[0.6, -0.45, 0.5]}>
          <torusGeometry args={[1.48, 0.006, 8, 180]} />
          <meshBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Fine outer orbit */}
        <mesh rotation={[1.4, 0.2, 0.2]}>
          <torusGeometry args={[1.65, 0.003, 6, 180]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.4}
          />
        </mesh>

        <pointLight color="#8b5cf6" intensity={12} distance={4} />
        <pointLight
          position={[1.5, 0.5, 1]}
          color="#22d3ee"
          intensity={5}
          distance={4}
        />
      </Float>
    </group>
  )
}

export default function MarketCore() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#060a14] sm:h-64">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(76,29,149,0.12)_0%,transparent_48%,#060a14_90%)]" />

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#060a14']} />
        <fog attach="fog" args={['#060a14', 5, 11]} />

        <ambientLight intensity={0.35} />
        <pointLight
          position={[3, 2, 4]}
          color="#22d3ee"
          intensity={8}
        />

        <Stars
          radius={35}
          depth={20}
          count={700}
          factor={2}
          fade
          speed={0.35}
        />

        <Sparkles
          count={45}
          scale={4.5}
          size={1.5}
          speed={0.25}
          color="#a78bfa"
          opacity={0.65}
        />

        <Core />
      </Canvas>

      {/* HUD labels */}
      <div className="pointer-events-none absolute left-4 top-4 z-20">
        <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-cyan-300/70">
          SYSTEM · 01
        </p>
        <p className="mt-1 text-[10px] text-slate-500">
          Market Core
        </p>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-1.5">
        <span className="size-1.5 animate-pulse rounded-full bg-cyan-300" />
        <span className="text-[9px] uppercase tracking-[0.16em] text-cyan-300/70">
          Core active
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 text-center">
        <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-cyan-300/80">
          TAVRIXA · MARKET INTELLIGENCE
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Explore beyond the surface
        </p>
      </div>
    </div>
  )
}
