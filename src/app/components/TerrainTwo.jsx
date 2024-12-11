import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function TerrainTwo() {
  // Create a more advanced noise function
  const noiseShader = useMemo(() => {
    return {
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        
        // Simplex noise function
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec2 mod289(vec2 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec3 permute(vec3 x) {
          return mod289(((x*34.0)+1.0)*x);
        }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                              0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                             -0.577350269189626,  // -1.0 + 2.0 * C.x
                              0.024390243902439); // 1.0 / 41.0
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                  + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vUv = uv;
          vec3 transformed = position;
          
          // Create more complex terrain undulations
          float noiseScale = 0.1;
          float elevationScale = 1.0;
          
          // Multiple octaves of noise for more natural terrain
          float noise = snoise(vUv * noiseScale);
          noise += 0.5 * snoise(vUv * noiseScale * 2.0);
          noise += 0.25 * snoise(vUv * noiseScale * 4.0);
          
          // Apply noise to elevation
          transformed.y += noise * elevationScale;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          // Create a more organic color variation
          vec3 grassColor = vec3(0.2, 0.6, 0.2);
          vec3 dirtColor = vec3(0.35, 0.25, 0.2);
          
          // Use UV for color variation
          float colorNoise = sin(vUv.x * 10.0) * cos(vUv.y * 10.0);
          vec3 finalColor = mix(grassColor, dirtColor, colorNoise * 0.5 + 0.5);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    };
  }, []);

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -2, 0]} 
      receiveShadow
    >
      <planeGeometry args={[100, 100, 100, 100]} />
      <shaderMaterial 
        {...noiseShader}
        side={THREE.DoubleSide}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}