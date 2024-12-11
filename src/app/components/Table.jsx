import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";

export default function Table({ position }) {
  const woodTexture = useLoader(TextureLoader, "/textures/wood_texture.jpg"); // Load your wood texture

  // Tabletop dimensions
  const tabletopWidth = 15;
  const tabletopThickness = 0.5;
  const tabletopDepth = 10;

  // Leg dimensions
  const legWidth = 0.5;
  const legHeight = 4;

  return (
    <group position={position}>
      {/* Tabletop */}
      <mesh position={[0, legHeight, 0]} castShadow receiveShadow>
        <boxGeometry args={[tabletopWidth, tabletopThickness, tabletopDepth]} /> {/* width, thickness, depth */}
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>

      {/* Four legs */}
      {/* Front left leg */}
      <mesh position={[
        -(tabletopWidth / 2) + legWidth / 2, 
        legHeight / 2,  // Align the leg from the bottom of the tabletop
        (tabletopDepth / 2) - legWidth / 2]} 
        castShadow 
        receiveShadow>
        <boxGeometry args={[legWidth, legHeight, legWidth]} /> {/* thickness, height, thickness */}
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>
      
      {/* Front right leg */}
      <mesh position={[
        (tabletopWidth / 2) - legWidth / 2, 
        legHeight / 2,  // Align the leg from the bottom of the tabletop
        (tabletopDepth / 2) - legWidth / 2]} 
        castShadow 
        receiveShadow>
        <boxGeometry args={[legWidth, legHeight, legWidth]} />
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>
      
      {/* Back left leg */}
      <mesh position={[
        -(tabletopWidth / 2) + legWidth / 2, 
        legHeight / 2,  // Align the leg from the bottom of the tabletop
        -(tabletopDepth / 2) + legWidth / 2]} 
        castShadow 
        receiveShadow>
        <boxGeometry args={[legWidth, legHeight, legWidth]} />
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>
      
      {/* Back right leg */}
      <mesh position={[ 
        (tabletopWidth / 2) - legWidth / 2, 
        legHeight / 2,  // Align the leg from the bottom of the tabletop
        -(tabletopDepth / 2) + legWidth / 2]} 
        castShadow 
        receiveShadow>
        <boxGeometry args={[legWidth, legHeight, legWidth]} />
        <meshStandardMaterial 
          map={woodTexture} 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>
    </group>
  );
}