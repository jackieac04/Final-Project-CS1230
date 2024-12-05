import React, { useRef } from "react";
import { SpotLightHelper, DirectionalLightHelper } from "three";
import { useHelper } from "@react-three/drei";
import { useControls } from "leva";



export default function Lights() {
  const spotLightRef = useRef();
  const dirLightRef = useRef();

  // Leva controls for lights
  const { 
    spotLightVisible, 
    dirLightVisible, 
    spotLightIntensity, 
    dirLightIntensity,
    shadowIntensity 
  } = useControls({
    // Light Visibility Toggles
    spotLightVisible: {
      label: 'Spot Light',
      value: true
    },
    dirLightVisible: {
      label: 'Directional Light',
      value: true
    },
    // Light Intensity Controls
    spotLightIntensity: {
      label: 'Spot Light Intensity',
      value: 1.5,
      min: 0,
      max: 5,
      step: 0.1
    },
    dirLightIntensity: {
      label: 'Directional Light Intensity',
      value: 1.5,
      min: 0,
      max: 5,
      step: 0.1
    },
    shadowIntensity: {
      label: 'Shadow Bias',
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01
    }
  });

  // Conditionally apply helpers
  useHelper(spotLightVisible && spotLightRef, SpotLightHelper, "red");
  useHelper(dirLightVisible && dirLightRef, DirectionalLightHelper, 2, "cyan");

  return (
    <>
      {/* Ambient Light */}
      <ambientLight 
        intensity={1} 
        color="#e2edff" 
      />

      {/* Spotlight */}
      {spotLightVisible && (
        <spotLight
          ref={spotLightRef}
          position={[5, 10, 5]}
          angle={0.2}
          penumbra={0.5}
          intensity={spotLightIntensity}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-fov={30}
          shadow-bias={shadowIntensity}
        />
      )}

      {/* Directional Light */}
      {dirLightVisible && (
        <directionalLight
          ref={dirLightRef}
          position={[5, 10, 5]}
          intensity={dirLightIntensity}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
        />
      )}
    </>
  );
}