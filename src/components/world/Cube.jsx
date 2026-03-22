import React, { useState } from 'react';
import { useBox } from '@react-three/cannon';
import { textureColors } from '../../constants/textureColors';
import { useStore } from '../../store/useStore';

export const Cube = ({ position, texture }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref] = useBox(() => ({ type: 'Static', position }));

  const addCube = useStore((state) => state.addCube);
  const removeCube = useStore((state) => state.removeCube);

  return (
    <mesh
      ref={ref}
      onPointerMove={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex / 2);
        const { x, y, z } = ref.current.position;

        if (e.altKey) {
          removeCube(x, y, z);
          return;
        }

        const newPos = [x, y, z];
        if (clickedFace === 0) newPos[0] += 1;
        if (clickedFace === 1) newPos[0] -= 1;
        if (clickedFace === 2) newPos[1] += 1;
        if (clickedFace === 3) newPos[1] -= 1;
        if (clickedFace === 4) newPos[2] += 1;
        if (clickedFace === 5) newPos[2] -= 1;
        addCube(...newPos);
      }}
    >
      <boxGeometry attach="geometry" />
      <meshStandardMaterial
        color={isHovered ? 'grey' : textureColors[texture]}
        transparent={texture === 'glass'}
        opacity={texture === 'glass' ? 0.6 : 1}
        attach="material"
      />
    </mesh>
  );
};
