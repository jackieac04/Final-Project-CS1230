import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import * as THREE from 'three';

// TrackballControls Wrapper Component
const TrackballControlsComponent = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    controlsRef.current = new TrackballControls(camera, gl.domElement);
    return () => {
      controlsRef.current.dispose(); // Clean up controls on unmount
    };
  }, [camera, gl]);

  useFrame(() => {
    controlsRef.current.update(); // Update controls each frame
  });

  return null; // This component doesn't render anything to the scene
};

const AquariumMesh = () => {
  return (
    <group>
      {/* Aquarium Geometry */}
      <mesh>
        <boxGeometry args={[2, 1, 1]} />
        <meshBasicMaterial color={0x000000} opacity={0.1} transparent />
      </mesh>

      {/* Water Surface */}
      <mesh rotation-x={-Math.PI / 2} position-y={0}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color={0x1E90FF} transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

const Aquarium = () => {
  return (
    <Canvas 
      shadows 
      style={{ height: '100vh', width: '100vw' }} 
      camera={{ position: [0, 2, 5], fov: 75 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0); // Set clear color to transparent
      }}
    >
      {/* Trackball controls */}
      <TrackballControlsComponent />

      {/* Add Aquarium Mesh */}
      <AquariumMesh />
    </Canvas>
  );
};

export default Aquarium;