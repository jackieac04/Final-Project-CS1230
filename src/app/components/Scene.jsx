import React, { useRef, useEffect, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Environment, OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import GlassSphere from "./GlassSphere";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Table from "./Table";
import Lights from "./Lights";
import Terrain from "./Terrain";
import GlassSphereWater from "./GlassSphereWater";
import Aquarium from "./Aquarium";
import GlassBowlStand from "./GlassBowlStand";
import TerrainTwo from "./TerrainTwo";
import CameraSetup from './CameraSetup';
import GlassJar from "./GlassJar"; 

const Scene = () => {
  const orbitRef = useRef();

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
      
      <Leva /> {/* UI for adjusting controls */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Environment preset="studio" background />

        {/* Set camera position */}
        <CameraSetup />

        {/* Scene Lights */}
        <Lights />

        {/* Table */}
        <Table position={[0, 0, 0]} receiveShadow/>

         {/* Glass Bowl Stand */}
        <GlassBowlStand position={[0, 3.5, 0]} castShadow receiveShadow/>

        {/* Glass Sphere positioned on top of the stand */}
        <GlassSphere position={[0, 6.5, 0]} castShadow receiveShadow/>

        {/* <GlassJar position={[0, 6.5, 0]} /> */}

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