import React from "react";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useControls } from "leva";

export default function GlassSphere({ position }) {
  // Control parameters for glass material properties
  const materialProps = useControls("Glass Material", {
    thickness: { value: 0.2, min: 0, max: 5, step: 0.1 }, // Control for glass thickness
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 }, // High value for clear glass
    ior: { value: 1.5, min: 1, max: 3, step: 0.1 }, // Index of refraction
    chromaticAberration: { value: 0.005, min: 0, max: 0.1, step: 0.005 },
    clearcoat: { value: 1, min: 0, max: 1, step: 0.1 },
    clearcoatRoughness: { value: 0.0, min: 0, max: 1, step: 0.1 },
    backside: { value: true }, // Ensure backside rendering for inner layer
  });

  // Calculate the inner radius based on the thickness
  const innerRadius = 3 - materialProps.thickness; // Adjust 3 based on the outer sphere radius

  return (
    <group position={position}>
      {/* Outer glass sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[3, 64, 64]} />
        <MeshTransmissionMaterial
          {...materialProps}
          color="white"
          attenuationDistance={10}
          attenuationColor="lightblue"
        />
      </mesh>

      {/* Inner sphere to represent the thickness of the glass */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[innerRadius, 64, 64]} />
        <MeshTransmissionMaterial
          {...materialProps}
          color="white"
          attenuationDistance={10}
          attenuationColor="lightblue"
          transparent
          opacity={0.0} // Make the inner sphere invisible
          backside={false} // Disable backside rendering for the inner layer
        />
      </mesh>
    </group>
  );
}