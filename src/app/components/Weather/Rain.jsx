import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import PropTypes from "prop-types";
import Clouds from "./Clouds";

const num_rain = 150;

export default function Rain({ position = [0, 0, 0], radius, intensity, windSpeed }) { // Default position to [0, 0, 0]
  const rainref = useRef();

  const speedIntensity = Math.max(2.0, intensity * 5.0); // Minimum of 2.0

  const num_rain = Math.max(1, Math.floor(150 * intensity)); 
  const [rainArray] = useState(new Float32Array(num_rain * 3));

  const texture = new THREE.TextureLoader().load("/textures/raindrop.png");

  // Function to initialize rain particles
  const initializeRain = (rainArray) => {
    for (let i = 0; i < num_rain; i++) {
      // Generate random angle and distance within the circular radius
      const angle = Math.random() * 2 * Math.PI; // Random angle (0 to 2π)
      const distance = Math.sqrt(Math.random()) * (radius - 0.5); // Random distance within radius
      
      // Convert polar coordinates to Cartesian coordinates
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      // Set x, y, and z
      rainArray[i * 3] = x; // x-coordinate
      rainArray[i * 3 + 1] = Math.random() * 4 + 7; // y-coordinate (height, falling down)
      rainArray[i * 3 + 2] = z; // z-coordinate
    }
  };

  // Function to update the rain's position
  const updateRain = (rainArray) => {
    for (let i = 0; i < num_rain; i++) {
      rainArray[i * 3 + 1] -= 0.01 * speedIntensity; // Make the raindrops fall
      if (rainArray[i * 3 + 1] < 10) {
        // Reset raindrops off-screen
        rainArray[i * 3 + 1] = Math.random() * 3 + 10;
      }
    }
  };

  // Initialize the rain on component mount
  useEffect(() => {
    // Initialize rain positions only once
    initializeRain(rainArray);

    if (rainref.current) {
      rainref.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(rainArray, 3)
      );
    }
  }, [rainArray]);

  // Update the rain's positions to animate falling
  useFrame(() => {
    if (rainref.current) {
      updateRain(rainArray);

      // Only update the position attribute if it exists
      if (rainref.current.geometry.attributes) {
        rainref.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      <points ref={rainref} position={[position[0], position[1] - 11, position[2]]} renderOrder={1}>
        <pointsMaterial size={0.07} map={texture} transparent={true} />
      </points>
      <Clouds position={[position[0], position[1] - 11, position[2]]} radius={radius - 1} weatherType={"rain"}/>
    </group>
  );
}

// PropTypes validation
Rain.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  radius: PropTypes.number.isRequired,
};