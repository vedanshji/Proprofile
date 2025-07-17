"use client";

import React, { forwardRef, useState, useRef } from "react";
import { PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as random from "maath/random";
import { Points } from "three"; // ✅ Correct import for typing

// Define prop types for the component
type StarBackgroundProps = JSX.IntrinsicElements["points"];

const StarBackground = forwardRef<Points, StarBackgroundProps>((props, ref) => {
  // Ref to the Points mesh
  const internalRef = useRef<Points>(null);

  // Generate star positions inside a sphere
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  // Animate rotation
  useFrame((_state, delta) => {
    if (internalRef.current) {
      internalRef.current.rotation.x -= delta / 10;
      internalRef.current.rotation.y -= delta / 15;
    }
  });

  // Forward the ref
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
          color="#ffffff"
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
