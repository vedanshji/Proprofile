"use client";

import React, { forwardRef, useState, useRef } from "react";
import { PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber"; // ✅ Removed Points from import
import * as random from "maath/random";
import * as THREE from "three";

// Define prop types, omitting "ref" because forwardRef handles it separately
type StarBackgroundProps = JSX.IntrinsicElements["points"];

const StarBackground = forwardRef<THREE.Points, StarBackgroundProps>((props, ref) => {
  // Internal ref to access Points
  const internalRef = useRef<THREE.Points>(null);

  // Positions of stars inside a sphere
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  // Rotate stars every frame
  useFrame((_state, delta) => {
    if (internalRef.current) {
      internalRef.current.rotation.x -= delta / 10;
      internalRef.current.rotation.y -= delta / 15;
    }
  });

  // Forward the ref to the Points component
  React.useImperativeHandle(ref, () => internalRef.current!);

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points
        ref={internalRef}
        args={[undefined, undefined]}
        {...props}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sphere.length / 3}
            array={sphere}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
});

export const StarsCanvas = () => (
  <div className="w-full h-auto fixed inset-0 -z-10">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <React.Suspense fallback={null}>
        <StarBackground />
      </React.Suspense>
    </Canvas>
  </div>
);

export default StarBackground;
