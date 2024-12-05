import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls, FirstPersonControls } from '@react-three/drei';
import * as THREE from 'three';

export default function PlayerControls() {
  const { camera, gl } = useThree();
  const ref = useRef();
  
  // Movement speed
  const SPEED = 5;

  // Get keyboard input state
  const [, get] = useKeyboardControls();

  // Use frame to handle movement
  useFrame((state, delta) => {
    const { forward, backward, left, right } = get();

    // Create a movement vector
    const moveVector = new THREE.Vector3();

    // Calculate movement based on camera's current orientation
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    // Flatten the direction to only move on the horizontal plane
    cameraDirection.y = 0;
    cameraDirection.normalize();

    // Calculate side movement
    const sideways = new THREE.Vector3()
      .crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0))
      .normalize();

    // Apply movement
    if (forward) {
      moveVector.add(cameraDirection.multiplyScalar(SPEED * delta));
    }
    if (backward) {
      moveVector.sub(cameraDirection.multiplyScalar(SPEED * delta));
    }
    if (left) {
      moveVector.sub(sideways.multiplyScalar(SPEED * delta));
    }
    if (right) {
      moveVector.add(sideways.multiplyScalar(SPEED * delta));
    }

    // Update camera position
    camera.position.add(moveVector);
  });

  return null;
}