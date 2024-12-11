import React, { useRef } from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";

export default function GlassSphereWater({ position }) {
  // Refs for controlling water movement
  const waterRef = useRef();

  // Control parameters for water
  const waterMaterialProps = useControls("Water Material", {
    waterColor: { value: "#4488ff" }, // Slightly deeper blue
    waterTransparency: { value: 0.6, min: 0, max: 1, step: 0.1 },
  });

  // Glass material parameters
  const materialProps = useControls("Glass Material", {
    thickness: { value: 0.1, min: 0, max: 0.5, step: 0.01 },
    roughness: { value: 0.1, min: 0, max: 1, step: 0.1 },
    transmission: { value: 0.9, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.5, min: 1, max: 3, step: 0.1 },
  });

  // Animate water movement
  useFrame((state) => {
    if (waterRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Create subtle wave/tilt effect
      const tiltAngle = Math.sin(time * 0.5) * Math.PI / 24; // Smaller angle
      waterRef.current.rotation.x = tiltAngle;
      
      // Optional: Add slight vertical wave to simulate liquid movement
      waterRef.current.position.y = Math.sin(time) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Outer glass sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <MeshTransmissionMaterial
          {...materialProps}
          color="white"
          attenuationColor="lightblue"
        />
      </mesh>

      {/* Water inside the sphere */}
      <group ref={waterRef}>
        <mesh 
          position={[0, -1.5, 0]} // Position at bottom quarter
          scale={[1.7, 0.5, 1.7]} // Scale to quarter volume
        >
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial
            color={waterMaterialProps.waterColor}
            transparent
            opacity={waterMaterialProps.waterTransparency}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}