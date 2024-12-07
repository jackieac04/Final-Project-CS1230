import { OrbitControls, TransformControls, useHelper } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { DirectionalLightHelper, Vector3 } from "three";

export default function Lights({ position }) {
  const light = useRef();
  const lightGroup = useRef();
  const transform = useRef();
  const orbit = useRef();

  useHelper(light, DirectionalLightHelper, 2);
  const { gl } = useThree();

  // Initial distance from center and light height
  const [distanceFromCenter, setDistanceFromCenter] = useState(10);
  const [lightHeight, setLightHeight] = useState(position[1]);


  useEffect(() => {
    if (transform?.current) {
      const controls = transform.current;
      controls.setMode("translate");
      const callback = (event) => {
        orbit.current.enabled = !event.value;
      };

      controls.addEventListener("dragging-changed", callback);
      return () => {
        controls.removeEventListener("dragging-changed", callback);
      };
    }
  }, [transform]);

  const [autoRotate, setAutoRotate] = useState(true);

  useControls("AutoRotate", {
    AutoRotate: {
      value: true,
      onChange: (v) => {
        if (lightGroup?.current && !v) {
          lightGroup.current.rotation.y = 0;
        }
        setAutoRotate(v);
      },
    },
  });

  // Add controls for distance from center and light height
  const { distance, height } = useControls("Light Controls", {
    distance: { value: distanceFromCenter, min: 0, max: 20, step: 0.1 },
    height: { value: lightHeight, min: 0, max: 20, step: 0.1 },
  });

  useEffect(() => {
    setDistanceFromCenter(distance);
    setLightHeight(height);
  }, [distance, height]);

  useEffect(() => {
    gl.state.lightPos = new Vector3();
  }, [gl]);

  useFrame((state, dt) => {
    if (autoRotate) {
      // Increment angle for rotation
      const angle = state.clock.getElapsedTime() * 0.5;

      // Update the position of the light group based on the angle
      lightGroup.current.position.x = Math.sin(angle) * distanceFromCenter;
      lightGroup.current.position.z = Math.cos(angle) * distanceFromCenter;
      lightGroup.current.position.y = lightHeight; // Use height from controls

      if (light.current) {

        const targetPosition = new Vector3(
            lightGroup.current.position.y += 5,
            lightGroup.current.position.x,
            lightGroup.current.position.z);
        light.current.getWorldPosition(gl.state.lightPos);
      }
    }
  });

  return (
    <>
      <group ref={lightGroup} position={position}>
        <TransformControls
          showX={!autoRotate}
          showY={!autoRotate}
          showZ={!autoRotate}
          enabled={!autoRotate}
          ref={transform}
        >
          <directionalLight
            ref={light}
            intensity={10.0} // Increased intensity for better visibility
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
          />
        </TransformControls>
      </group>

      <ambientLight intensity={0.3} />
      <OrbitControls ref={orbit} />
    </>
  );
}
