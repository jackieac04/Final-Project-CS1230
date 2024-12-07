import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

export default function SunLight() {
  const lightRef = useRef();
  const [angle, setAngle] = useState(0);

  const { 
    cycleEnabled, 
    cycleSpeed, 
    manualAngle 
  } = useControls({
    cycleEnabled: { label: "Day Night Cycle", value: true },
    cycleSpeed: { label: "Cycle Speed", value: 0.01, min: 0.001, max: 0.1, step: 0.001 },
    manualAngle: { 
      label: "Manual Angle Control", 
      value: 0, 
      min: 0, 
      max: Math.PI * 2, 
      step: 0.01 
    },
  });

  // Synchronize the slider with the angle only when the cycle is disabled
  useFrame(() => {
    if (cycleEnabled) {
      setAngle((prev) => (prev + cycleSpeed) % (Math.PI * 2));
    } else {
      setAngle(manualAngle); // Set angle from slider
    }
  });

  // Calculate the position of the sun
  const x = Math.sin(angle) * 30;
  const y = Math.cos(angle) * 30;
  const z = 0;

  return (
    <directionalLight
      ref={lightRef}
      position={[x, y, z]}
      intensity={1.5}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-near={0.5}
      shadow-camera-far={50}
    />
  );
}