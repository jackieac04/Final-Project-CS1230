import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";

export default function Table({ position }) {
  const woodTexture = useLoader(TextureLoader, "/textures/wood_texture.jpg"); // Load your wood texture

  return (
    <group position={position}>
      {/* Tabletop */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 0.5, 6]} /> {/* width, thickness, depth */}
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>

      {/* Four legs */}
      {/* Front left leg */}
      <mesh position={[-4.5, 0, 2.5]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 4, 0.5]} /> {/* thickness, height, thickness */}
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>
      
      {/* Front right leg */}
      <mesh position={[4.5, 0, 2.5]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 4, 0.5]} />
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>
      
      {/* Back left leg */}
      <mesh position={[-4.5, 0, -2.5]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 4, 0.5]} />
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>
      
      {/* Back right leg */}
      <mesh position={[4.5, 0, -2.5]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 4, 0.5]} />
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>
    </group>
  );
}