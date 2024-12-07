import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { OrbitControls } from '@react-three/drei';

const LampModel = ({ ambientIntensity }) => {
  const baseMesh = useRef();
  const armMesh = useRef();
  const headMesh = useRef();

  // Rotate the lamp head slightly for dynamism
  useFrame(({ clock }) => {
    if (headMesh.current) {
      headMesh.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <group>
      {/* Base */}
      <mesh 
        ref={baseMesh} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
        <meshStandardMaterial color="#3c3c3c" />
      </mesh>

      {/* Vertical Arm */}
      <mesh 
        ref={armMesh} 
        position={[0, 0.3, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Lamp Head */}
      <mesh 
        ref={headMesh} 
        position={[0, 1.3, 0]} 
        rotation={[0, 0, 0]}
      >
        <coneGeometry args={[0.4, 0.5, 32]} />
        <meshStandardMaterial color="#5c5c5c" />

        {/* Light Source */}
        <pointLight 
          position={[0, -0.3, 0]} 
          intensity={ambientIntensity} 
          color="#ffffd0" 
          distance={3} 
          decay={2}
        />
      </mesh>
    </group>
  );
};

const DeskLamp = () => {
  // Leva controls for ambient light and lamp properties
  const { ambientIntensity } = useControls({
    ambientIntensity: {
      value: 1,
      min: 0,
      max: 5,
      step: 0.1,
      label: 'Lamp Brightness'
    }
  });

  return (
    <div className="w-full h-[500px] border rounded-lg overflow-hidden">
      <Canvas 
        camera={{ 
          position: [0, 1.5, 3], 
          fov: 45 
        }}
        shadows
      >
        {/* Ambient light */}
        <ambientLight intensity={0.2} />
        
        {/* Directional light for shadows */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.5} 
          castShadow 
        />

        {/* Lamp Model with dynamic ambient intensity */}
        <LampModel ambientIntensity={ambientIntensity} />

        {/* Orbit Controls for interaction */}
        <OrbitControls />

        {/* Ground Plane */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.1, 0]} 
          receiveShadow
        >
          <planeGeometry args={[5, 5]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default DeskLamp;