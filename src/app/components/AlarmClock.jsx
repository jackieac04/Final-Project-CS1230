import React, { useRef, useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Clock({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  isAlarmRinging = false // Prop to control alarm state
}) {
  const pivotGroupHourRef = useRef();
  const pivotGroupMinuteRef = useRef();
  const pivotGroupSecondRef = useRef();
  const alarmHandRef = useRef();
  const leftBellRef = useRef();
  const rightBellRef = useRef();
  const modelRef = useRef();
  
  const [bellAnimationProgress, setBellAnimationProgress] = useState(0);

  const gltf = useLoader(GLTFLoader, "https://dl.dropboxusercontent.com/scl/fi/z6m4apczolb43ylwk5jk8/alarmclock.glb?rlkey=kd3o6dp0mnpnw6noq5wyyikk3&st=6391wwd9");

  useFrame((state, delta) => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Standard clock hand rotations
    if (pivotGroupHourRef.current) {
      pivotGroupHourRef.current.rotation.x = (hours + minutes / 60) * (-Math.PI / 6);
    }
    
    if (pivotGroupMinuteRef.current) {
      pivotGroupMinuteRef.current.rotation.x = (minutes + seconds / 60) * (-Math.PI / 30);
    }
    
    if (pivotGroupSecondRef.current) {
      pivotGroupSecondRef.current.rotation.x = seconds * (-Math.PI / 30);
    }

    // Alarm hand and bells animation
    if (alarmHandRef.current && leftBellRef.current && rightBellRef.current) {
      // Simulate alarm ringing mechanism
      if (isAlarmRinging) {
        // Increment bell animation progress
        setBellAnimationProgress((prev) => {
          const newProgress = prev + delta * 10; // Adjust speed as needed
          
          // Oscillate bells
          const oscillationAngle = Math.sin(newProgress) * Math.PI / 4;
          
          leftBellRef.current.rotation.z = oscillationAngle;
          rightBellRef.current.rotation.z = -oscillationAngle;

          return newProgress;
        });
      } else {
        // Reset bell positions when not ringing
        leftBellRef.current.rotation.z = 0;
        rightBellRef.current.rotation.z = 0;
      }
    }
  });

  useEffect(() => {
    if (gltf.scene) {
      // Material and shadow setup (kept from previous implementation)
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            if (child.name.includes('Glass')) {
              child.material.transparent = true;
              child.material.opacity = 0.2;
              child.material.color.set(0xffffff);
              child.material.roughness = 0.2;
              child.material.metalness = 0.1;
            }
            
            if (child.name.includes('ClockFace') || child.name.includes('Pointer')) {
              child.material.color.set(0x000000);
            }
          }
        }
      });

      // Find specific parts of the clock
      const hourPointer = gltf.scene.getObjectByName("HourPointer");
      const minutePointer = gltf.scene.getObjectByName("MinutePointer");
      const secondPointer = gltf.scene.getObjectByName("SecondPointer");
      const alarmHand = gltf.scene.getObjectByName("AlarmHand");
      const leftBell = gltf.scene.getObjectByName("LeftBell");
      const rightBell = gltf.scene.getObjectByName("RightBell");

      if (hourPointer && minutePointer && secondPointer && 
          alarmHand && leftBell && rightBell) {
        
        // Store references to alarm components
        alarmHandRef.current = alarmHand;
        leftBellRef.current = leftBell;
        rightBellRef.current = rightBell;

        // Existing pivot group setup for main clock hands
        pivotGroupHourRef.current = new THREE.Group();
        pivotGroupMinuteRef.current = new THREE.Group();
        pivotGroupSecondRef.current = new THREE.Group();
        
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