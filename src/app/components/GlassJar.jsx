import React from "react";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useControls } from "leva";

export default function HollowGlassJar({ position }) {
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
    <group position={position}>
      {/* Hollow glass jar body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 3, 64]} /> {/* Cylinder for the body */}
        <MeshTransmissionMaterial
          {...materialProps}
          color="white"
          attenuationDistance={10}
          attenuationColor="lightblue"
        />
      </mesh>
      
      {/* Spherical ends */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshTransmissionMaterial
          {...materialProps}
          color="white"
          attenuationDistance={10}
          attenuationColor="lightblue"
        />
      </mesh>
      <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshTransmissionMaterial
          {...materialProps}
          color="white"
          attenuationDistance={10}
          attenuationColor="lightblue"
        />
      </mesh>
    </group>
  );
}