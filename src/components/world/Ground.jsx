import React from 'react';
import { usePlane } from '@react-three/cannon';
import { useStore } from '../../store/useStore';

export const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));
  const addCube = useStore((state) => state.addCube);

  return (
    <mesh
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        const [x, y, z] = Object.values(e.point).map((val) => Math.round(val));
        addCube(x, y, z);
      }}
    >
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" color="#689F38" />
    </mesh>
  );
};
