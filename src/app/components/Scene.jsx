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
import Clock from "./Clock";
import AlarmClock from "./AlarmClock";
import DeskLamp from "./DeskLamp";
import Firefly from "./Fireflies";


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

    // Generate fireflies positions within the sphere
    const generateFireflies = (count) => {
      const fireflies = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * 6 - 3; // Range -3 to 3
        const y = Math.random() * 6 - 3; // Range -3 to 3
        const z = Math.random() * 6 - 3; // Range -3 to 3
        fireflies.push({ initialPosition: [x, y, z] });
      }
      return fireflies;
    };
  
    const fireflies = generateFireflies(20); // Generate 20 fireflies

  return (
    <>
      <Leva collapsed />
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
        <Table position={[0, -2, 0]} receiveShadow/>

        {/* Glass Bowl Stand */}
        <GlassBowlStand position={[0, 3.5, 0]} castShadow receiveShadow/>
        
        {/* Clock */}
        <Clock 
        position={[5, 3.45, 0]} 
        rotation={[0, -Math.PI / 2, Math.PI / 10]}  // Rotate 45 degrees around Y-axis 
        castShadow={true}  // Ensure shadows are cast
        />

        {/* Desk Lamp */}
        <DeskLamp position={[-5, 2.5, 2]} /> 

        {/* Glass Sphere positioned on top of the stand */}
        <GlassSphere position={[0, 6.5, 0]} />
        
        {/* Giraffe inside the terrarium */}
        <primitive object={obj} position={[0, 4, 0]} scale={0.1} />

        {/* Fireflies */}
        {/* {fireflies.map((firefly, index) => (
          <Firefly 
            key={index} 
            initialPosition={firefly.initialPosition} 
            boids={fireflies.map(f => ({ position: f.initialPosition }))} // Pass the other fireflies for boid behavior
          />
        ))} */}

        {/* Ground Terrain */}
        {/* <TerrainTwo receiveShadow/> */}

        {/* Controls */}
        <OrbitControls ref={orbitRef} />
      </Canvas>
    </>
  );
};

export default Scene;