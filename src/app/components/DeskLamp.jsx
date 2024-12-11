import React, { useRef } from 'react';
import { useControls } from 'leva';

export default function DeskLamp({ position = [0, 0, 0] }) {
  const { brightness, lampColor } = useControls('Lamp', {
    brightness: {
      value: 2,
      min: 0,
      max: 30,
      step: 0.1,
      label: 'Light Intensity',
    },
    lampColor: {
      value: '#ffffff',
      label: 'Lamp Color',
    },
  });

  const baseMesh = useRef();
  const lampShade = useRef();

  return (
    <group position={position}>
      {/* Circular Base */}
      <mesh
        ref={baseMesh}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
        <meshPhysicalMaterial
          color="#4a4a4a"
          roughness={0.8}
          metalness={0.6}
          clearcoat={0.2}
          clearcoatRoughness={0.4}
        />
      </mesh>

      {/* Lamp Post */}
      <mesh
        position={[0, 1, 0]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.1, 0.1, 2, 32]} />
        <meshPhysicalMaterial
          color="#3a3a3a"
          roughness={0.5}
          metalness={0.7}
          clearcoat={0.1}
        />
      </mesh>

      {/* Cylindrical Lamp Shade */}
      <mesh
        ref={lampShade}
        position={[0, 2.2, 0]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.8, 0.8, 1.5, 32]} />
        <meshPhysicalMaterial
          color="#d4d4d4"
          roughness={0.2}
          metalness={0.2}
          emissive={lampColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Light Source */}
      <pointLight
        position={[0, 3.2, 0]}
        intensity={brightness}
        color={lampColor}
        distance={8}
        decay={2}
        castShadow
      />
    </group>
  );
}