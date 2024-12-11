import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Firefly = ({
  light = true,
  bodyColor = 0x5363B2,
  wingColor = 0xA9B8FC,
  lightColor = 0x00FFA5,
  initialPosition = [0, 0, 0],
  boids = [],
}) => {
  const groupRef = useRef(null);
  const rightWingRef = useRef(null);
  const leftWingRef = useRef(null);
  const velocity = useRef(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5));
  const pointLightRef = useRef(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const scale = 0.05; // Smaller scale

    // Body
    const flyGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.9, 4); // Adjusted dimensions
    const flyMaterial = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 1,
      flatShading: true,
    });
    const body = new THREE.Mesh(flyGeometry, flyMaterial);
    body.rotation.y = 45 * (Math.PI / 180);
    group.add(body);

    // Right Wing
    const wingGeometry = new THREE.BoxGeometry(0.25, 0.6, 0.6); // Adjusted dimensions
    wingGeometry.translate(0, -0.3, 0);

    const rightWing = new THREE.Mesh(
      wingGeometry,
      new THREE.MeshStandardMaterial({
        color: wingColor,
        roughness: 1,
        flatShading: true,
      })
    );
    rightWing.position.set(0.4, 0.1, 0);
    rightWing.rotation.z = Math.PI / 4;
    rightWingRef.current = rightWing;
    group.add(rightWing);

    // Left Wing
    const leftWing = rightWing.clone();
    leftWing.position.x = -0.4;
    leftWing.rotation.z = -Math.PI / 4;
    leftWingRef.current = leftWing;
    group.add(leftWing);

    // Light
    if (light) {
      const pointLight = new THREE.PointLight(lightColor, 0, 10); // Set distance to 10
      pointLight.position.set(0, -0.5, 0);
      pointLightRef.current = pointLight;
      group.add(pointLight);
    }

    // Set initial position and scale
    group.position.set(...initialPosition);
    group.scale.set(scale, scale, scale);

    // Cleanup function
    return () => {
      flyGeometry.dispose();
      flyMaterial.dispose();
      wingGeometry.dispose();
      rightWing.material.dispose();
      leftWing.material.dispose();
      if (pointLightRef.current) pointLightRef.current.dispose(); // Fixed line
    };
  }, [bodyColor, wingColor, lightColor, light, initialPosition]);

  // Boid movement logic
  useEffect(() => {
    const animate = () => {
      if (!groupRef.current || !pointLightRef.current) return; // Check for null references

      const wingsFlapSpeed = 0.1; // Speed of flapping
      const flapAngle = Math.sin(Date.now() * wingsFlapSpeed) * 0.1; // Flapping motion

      // Update wing rotation for flapping
      if (rightWingRef.current) rightWingRef.current.rotation.z += flapAngle;
      if (leftWingRef.current) leftWingRef.current.rotation.z -= flapAngle;

      // Update position based on velocity
      groupRef.current.position.add(velocity.current);

      // Boundary checking to keep fireflies inside a glass sphere (radius = 3 for example)
      const radius = 3; // Match this to your GlassSphere radius
      const position = groupRef.current.position;

      if (position.length() > radius) {
        position.normalize().multiplyScalar(radius); // Keep firefly inside the sphere
      }

      // Check for proximity with other components
      const lightUpDistance = 2; // Proximity distance to light up
      let shouldLightUp = false;

      boids.forEach((boid) => {
        const distance = position.distanceTo(boid.position);
        if (distance < lightUpDistance) {
          shouldLightUp = true; // Light up when near another boid
        }
      });

      // Update light intensity based on proximity
      pointLightRef.current.intensity = shouldLightUp ? 1 : 0; // Light up if in proximity

      // Pulsate the light
      const time = Date.now() * 0.001; // Normalize time for pulsation
      pointLightRef.current.intensity += Math.sin(time * 2) * 0.2; // Pulsate intensity

      // Boid movement logic
      const separation = new THREE.Vector3();
      const alignment = new THREE.Vector3();
      const cohesion = new THREE.Vector3();
      let total = 0;

      boids.forEach((boid) => {
        const distance = position.distanceTo(boid.position);
        if (distance < 2) { // Separation distance
          const diff = new THREE.Vector3().subVectors(position, boid.position);
          diff.normalize();
          diff.divideScalar(distance);
          separation.add(diff);
        }

        if (distance < 5) { // Alignment distance
          alignment.add(boid.velocity);
          total++;
        }

        if (distance < 5) { // Cohesion distance
          cohesion.add(boid.position);
        }
      });

      if (total > 0) {
        alignment.divideScalar(total).normalize().multiplyScalar(0.1);
        cohesion.divideScalar(total).sub(position).normalize().multiplyScalar(0.1);
        cohesion.add(alignment);
      }

      velocity.current.add(separation).add(alignment).add(cohesion);

      // Limit speed
      const speedLimit = 0.02; // Adjusted speed limit
      if (velocity.current.length() > speedLimit) {
        velocity.current.clampLength(0, speedLimit);
      }

      // Request next animation frame
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [boids]);

  return <group ref={groupRef} />;
};

export default Firefly;