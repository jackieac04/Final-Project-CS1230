import React from "react";
import { MeshTransmissionMaterial, Environment } from "@react-three/drei";
import { useControls } from "leva";

export default function GlassSphere({ position }) {
  const materialProps = useControls("Glass Material", {
    thickness: { value: 0.2, min: 0, max: 5, step: 0.1 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.5, min: 1, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.005, min: 0, max: 0.1, step: 0.005 },
    clearcoat: { value: 1, min: 0, max: 1, step: 0.1 },
    clearcoatRoughness: { value: 0.0, min: 0, max: 1, step: 0.1 },
    backside: { value: false },
  });

  return (
    <>
      <group position={position}>
        {/* Outer glass */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[3, 64, 64]} />
          <MeshTransmissionMaterial
            {...materialProps}
            color="white"
            attenuationDistance={10}
            attenuationColor="lightblue"
          />
        </mesh>
        {/* Inner glass */}
        <mesh scale={0.95} castShadow receiveShadow>
          <sphereGeometry args={[2.85, 64, 64]} />
          <MeshTransmissionMaterial
            {...materialProps}
            side={1} // BackSide for inner layer
            color="white"
            attenuationDistance={10}
            attenuationColor="lightblue"
          />
        </mesh>
      </group>
    </>
  );
}