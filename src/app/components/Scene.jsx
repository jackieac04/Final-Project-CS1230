import React, { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import GlassSphere from "./GlassSphere";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Table from "./Table";
import Lights from "./Lights";
import Terrain from "./Terrain";
import GlassSphereWater from "./GlassSphereWater";
import Aquarium from "./Aquarium";

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
        {/* Scene Lights */}
        <Lights />

        {/* Table */}
        <Table />

        {/* Terrarium (Glass Sphere) */}
        {/* <GlassSphere position={[0, 1.5, 0]} /> */}
        <GlassSphereWater position={[0, 1.5, 0]} />

        {/* Aquarium positioned next to the Glass Sphere */}
        {/* <Aquarium position={[2, 0.5, 0]} /> */}

        {/* Giraffe inside the terrarium */}
        <primitive object={obj} position={[0, 1.5, 0]} scale={0.1} />

        {/* Ground Terrain */}
        <Terrain />

        {/* Controls */}
        <OrbitControls ref={orbitRef} />
      </Canvas>
    </>
  );
};

export default Scene;
