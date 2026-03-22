import React from 'react';
import { Sky, Sphere } from '@react-three/drei';
import { useStore } from '../../store/useStore';

export const CelestialBodies = () => {
  const isDay = useStore((state) => state.isDay);

  const sunPos = [100, 200, 100];
  const moonPos = [-100, 200, -100];

  const ambientIntensity = isDay ? 0.7 : 0.4;
  const directColor = isDay ? '#fffadb' : '#80a0ff';
  const directIntensity = isDay ? 1.0 : 0.3;

  return (
    <>
      <Sky
        sunPosition={isDay ? sunPos : [0, -10, 0]}
        turbidity={isDay ? 8 : 20}
        rayleigh={isDay ? 1 : 0.1}
      />

      <ambientLight intensity={ambientIntensity} />

      <directionalLight
        position={isDay ? sunPos : moonPos}
        intensity={directIntensity}
        color={directColor}
        castShadow
      />

      {isDay && (
        <Sphere args={[10, 32, 32]} position={sunPos}>
          <meshStandardMaterial
            color="#fff0b3"
            emissive="#ffdf80"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </Sphere>
      )}

      {!isDay && (
        <Sphere args={[8, 32, 32]} position={moonPos}>
          <meshStandardMaterial
            color="#e0e0e0"
            emissive="#ffffff"
            emissiveIntensity={1}
            toneMapped={false}
          />
        </Sphere>
      )}
    </>
  );
};
