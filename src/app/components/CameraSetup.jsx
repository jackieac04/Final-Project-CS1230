import React, { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';

const CameraSetup = () => {
  const { camera } = useThree();
  const [keyState, setKeyState] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    e: false
  });

  useEffect(() => {
    // Initial camera setup
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 1, 0);

    // Keyboard event handlers
    const handleKeyDown = (e) => {
      setKeyState(prev => ({
        ...prev,
        [e.key.toLowerCase()]: true
      }));
    };

    const handleKeyUp = (e) => {
      setKeyState(prev => ({
        ...prev,
        [e.key.toLowerCase()]: false
      }));
    };

    // Movement speed and rotation speed
    const moveSpeed = 0.1;
    const rotateSpeed = 0.02;

    // Animation loop for camera movement
    const animateCamera = () => {
      // Forward/Backward movement (W/S)
      if (keyState.w) camera.position.z -= moveSpeed;
      if (keyState.s) camera.position.z += moveSpeed;

      // Sideways movement (A/D)
      if (keyState.a) camera.position.x -= moveSpeed;
      if (keyState.d) camera.position.x += moveSpeed;

      // Up/Down movement (Q/E)
      if (keyState.q) camera.position.y += moveSpeed;
      if (keyState.e) camera.position.y -= moveSpeed;

      // Always look at the center or a specific point
      camera.lookAt(0, 1, 0);

      // Request next animation frame
      requestAnimationFrame(animateCamera);
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Start camera animation
    animateCamera();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [camera]);

  return null;
};

export default CameraSetup;