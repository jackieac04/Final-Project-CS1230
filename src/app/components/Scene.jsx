import React, { useRef, useEffect, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Environment, OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import * as THREE from "three";

// Import your components
import GlassSphere from "./GlassSphere";
import Table from "./Table";
import TerrainTwo from "./TerrainTwo";
import CameraSetup from './CameraSetup';
import GlassBowlStand from "./GlassBowlStand";
import DayNightCycle from "./DayNightCycle";
import SunLight from "./SunLight";
import Lights from "./Lights";
import CustomEnvironment from "./Env";


const Scene = () => {
  const orbitRef = useRef();
  const [lightingState, setLightingState] = useState({
    skyColor: new THREE.Color(0x87CEEB),
    sunPosition: [0, 50, 0],
    spotLightIntensity: 1,
    ambientIntensity: 0.5,
    colorTemp: 6500
  });

  // Load giraffe model and materials
  const mtl = useLoader(MTLLoader, "/models/Giraffe.mtl");
  const obj = useLoader(OBJLoader, "/models/Giraffe.obj", (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
  });

  // Apply giraffe texture
  useEffect(() => {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load("/models/Giraffe_BaseColor.png");
    if (mtl.materials["Giraffe_mat"]) {
      mtl.materials["Giraffe_mat"].map = texture;
      mtl.materials["Giraffe_mat"].needsUpdate = true;
    }
  }, [mtl]);

  return (
    <>
      <Leva />
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Add your custom environment */}
        {/* <CustomEnvironment /> */}
        <Environment preset="sunset" background/>

        {/* Day/Night Cycle Controller */}
        {/* <DayNightCycle onCycleChange={handleCycleChange} /> */}

        {/* Scene Background */}
        {/* <SunLight /> */}
        <Lights position={[0, 6, 10]} />

        {/* Set camera position */}
        <CameraSetup />

        {/* Table */}
        <Table position={[0, 0, 0]} receiveShadow/>

        {/* Glass Bowl Stand */}
        <GlassBowlStand position={[0, 3.5, 0]} castShadow receiveShadow/>

        {/* Glass Sphere positioned on top of the stand */}
        <GlassSphere position={[0, 6.5, 0]} castShadow receiveShadow/>

        {/* Giraffe inside the terrarium */}
        <primitive object={obj} position={[0, 6, 0]} scale={0.1} />

        {/* Ground Terrain */}
        <TerrainTwo receiveShadow/>

        {/* Controls */}
        <OrbitControls ref={orbitRef} />
      </Canvas>
    </>
  );
};

export default Scene;