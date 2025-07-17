"use client";

import React, { forwardRef, useState, useRef } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame, type PointsProps } from "@react-three/fiber";
import * as random from "maath/random";
import * as THREE from "three";

// Define prop types, omitting "ref" because forwardRef handles it separately
type StarBackgroundProps = Omit<PointsProps, "ref">;

const StarBackground = forwardRef<THREE.Points, StarBackgroundProps>((props, ref) => {
  // Internal ref to access Points
  const internalRef = useRef<THREE.Points>(null);

  // Positions of stars inside a sphere
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }));

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
      <Points
        ref={internalRef}
        stride={3}
        positions={sphere}
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
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
