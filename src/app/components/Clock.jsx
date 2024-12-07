import React, { useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Clock({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = [1, 1, 1]
}) {
  const pivotGroupHourRef = useRef();
  const pivotGroupMinuteRef = useRef();
  const pivotGroupSecondRef = useRef();
  const modelRef = useRef();
  
  const gltf = useLoader(GLTFLoader, "https://dl.dropboxusercontent.com/scl/fi/z6m4apczolb43ylwk5jk8/alarmclock.glb?rlkey=kd3o6dp0mnpnw6noq5wyyikk3&st=6391wwd9");

  useFrame(() => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    if (pivotGroupHourRef.current) {
      pivotGroupHourRef.current.rotation.x = (hours + minutes / 60) * (-Math.PI / 6); // House Hand
    }
    
    if (pivotGroupMinuteRef.current) {
      pivotGroupMinuteRef.current.rotation.x = (minutes + seconds / 60) * (-Math.PI / 30); // Minute Hand
    }
    
    if (pivotGroupSecondRef.current) {
      pivotGroupSecondRef.current.rotation.x = seconds * (-Math.PI / 30); // Second Hand
    }
  });

  useEffect(() => {
    if (gltf.scene) {
      // Enable shadows for the entire model
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Material adjustments
          if (child.material) {
            // Adjust glass material
            if (child.name.includes('Glass')) {
              child.material.transparent = true;
              child.material.opacity = 0.2;
              child.material.color.set(0xffffff);
              child.material.roughness = 0.2;
              child.material.metalness = 0.1;
            }
            
            // Ensure clock face and pointers are visible
            if (child.name.includes('ClockFace') || child.name.includes('Pointer')) {
              child.material.color.set(0x000000);
            }
          }
        }
      });

      const hourPointer = gltf.scene.getObjectByName("HourPointer");
      const minutePointer = gltf.scene.getObjectByName("MinutePointer");
      const secondPointer = gltf.scene.getObjectByName("SecondPointer");

      if (hourPointer && minutePointer && secondPointer) {
        pivotGroupHourRef.current = new THREE.Group();
        pivotGroupMinuteRef.current = new THREE.Group();
        pivotGroupSecondRef.current = new THREE.Group();

        pivotGroupHourRef.current.position.set(0, 0, 0);
        pivotGroupMinuteRef.current.position.set(0, 0, 0);
        pivotGroupSecondRef.current.position.set(0, 0, 0);
        
        pivotGroupHourRef.current.add(hourPointer);
        pivotGroupMinuteRef.current.add(minutePointer);
        pivotGroupSecondRef.current.add(secondPointer);
        
        gltf.scene.add(
          pivotGroupHourRef.current, 
          pivotGroupMinuteRef.current, 
          pivotGroupSecondRef.current
        );
      }
    }
  }, [gltf]);

  return (
    <group 
      position={position} 
      rotation={rotation}
      scale={scale}
    >
      <primitive 
        ref={modelRef} 
        object={gltf.scene} 
      />
    </group>
  );
}