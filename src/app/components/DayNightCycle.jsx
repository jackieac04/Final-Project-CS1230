import React, { useRef } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function DayNightCycle({ onCycleChange }) {
  const cycleRef = useRef({
    progress: 12, // Default: midday
  });

  const sunRef = useRef();

  const {
    enableDayNightCycle,
    cycleSpeed,
    dayCycleProgress,
  } = useControls("Day/Night Cycle", {
    enableDayNightCycle: { label: "Enable Day/Night Cycle", value: false },
    cycleSpeed: { label: "Cycle Speed", value: 0.1, min: 0.01, max: 1, step: 0.01 },
    dayCycleProgress: { label: "Time of Day", value: 12, min: 0, max: 24, step: 0.1 },
  });

  // Interpolate between two colors
  const interpolateColor = (color1, color2, factor) => {
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    return c1.lerp(c2, factor);
  };

  // Adjusted sky colors for realistic transitions
  const calculateLightingState = (progress) => {
    const normalizedTime = progress / 24;

    // Realistic sky color transitions throughout the day
    const skyColors = [
      { time: 0, color: 0x0b032d }, // Midnight (dark purple)
      { time: 6, color: 0xff8c00 }, // Dawn (orange)
      { time: 12, color: 0x87ceeb }, // Noon (bright blue)
      { time: 18, color: 0xff4500 }, // Sunset (deep orange-red)
      { time: 24, color: 0x0b032d }, // Midnight (loop back)
    ];

    // Find the two colors to interpolate between based on time
    let startColor, endColor, startTime, endTime;
    for (let i = 0; i < skyColors.length; i++) {
      const current = skyColors[i];
      const next = skyColors[(i + 1) % skyColors.length];

      if (normalizedTime >= current.time / 24 && normalizedTime < next.time / 24) {
        startColor = current.color;
        endColor = next.color;
        startTime = current.time;
        endTime = next.time;
        break;
      }
    }

    const factor = (normalizedTime - startTime / 24) / ((endTime - startTime) / 24);
    const skyColor = interpolateColor(startColor, endColor, factor);

    // Light intensity and position based on sun's angle
    const sunAngle = normalizedTime * Math.PI * 2 - Math.PI / 2;
    const spotLightIntensity = Math.max(0, Math.sin(sunAngle));
    const ambientIntensity = Math.max(0.2, spotLightIntensity * 0.7);

    // Sun position calculation
    const sunPosition = [
      Math.cos(sunAngle) * 20,
      Math.sin(sunAngle) * 20,
      0,
    ];

    return {
      skyColor,
      spotLightIntensity,
      ambientIntensity,
      sunPosition,
    };
  };

  // Frame loop for animation
  useFrame((_, delta) => {
    if (enableDayNightCycle) {
      cycleRef.current.progress += cycleSpeed * delta * 5;
      if (cycleRef.current.progress >= 24) {
        cycleRef.current.progress -= 24; // Loop back to start of the day
      }
    }

    const progress = enableDayNightCycle
      ? cycleRef.current.progress
      : dayCycleProgress;

    const lightingState = calculateLightingState(progress);

    if (onCycleChange) {
      onCycleChange(lightingState);
    }

    // Update sun position
    if (sunRef.current) {
      const { sunPosition } = lightingState;
      sunRef.current.position.set(...sunPosition);
    }
  });

  return (
    <>
      {/* Spherical Sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={1} />
      </mesh>

      {/* Placeholder for future lighting adjustments */}
    </>
  );
}