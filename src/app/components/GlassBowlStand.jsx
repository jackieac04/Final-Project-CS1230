import React, { useRef } from "react";
import { MeshStandardMaterial } from "three";

export default function GlassBowlStand({ position }) {
  const materialRef = useRef();

  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[1.5, 1.5, 0.5, 64]} />
      <meshStandardMaterial 
        ref={materialRef}
        color="lightgray" 
        metalness={0.5}
        roughness={0.5}
      />
      
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 64]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
    </mesh>
  );
}