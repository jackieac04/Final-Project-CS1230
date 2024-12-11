import React, { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as THREE from "three"; // Import THREE

function CustomEnvironment() {
  // Load the HDR environment map
  const [envMap, setEnvMap] = useState(null);
  const loader = new RGBELoader();

  useEffect(() => {
    // Load the HDR image
    loader.load(
      "textures/image.hdr",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping; // Use reflection mapping for environment
        setEnvMap(texture);
      },
      undefined, // Progress callback (optional)
      (error) => {
        console.error("Error loading HDR texture:", error);
      }
    );

    // Cleanup function to dispose of the texture when the component unmounts
    return () => {
      if (envMap) {
        envMap.dispose();
      }
    };
  }, [loader]);

  return (
    <>
      {envMap && (
        // Attach the loaded HDR environment map as the background
        <primitive object={envMap} attach="background" />
      )}
    </>
  );
}

export default CustomEnvironment;