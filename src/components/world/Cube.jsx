import React, { useMemo, useState } from 'react';
import { useBox } from '@react-three/cannon';
import { textureColors } from '../../constants/textureColors';
import { useStore } from '../../store/useStore';

const getDominantAxisNormal = (normal) => {
  const ax = Math.abs(normal.x);
  const ay = Math.abs(normal.y);
  const az = Math.abs(normal.z);

  if (ax >= ay && ax >= az) return [Math.sign(normal.x) || 0, 0, 0];
  if (ay >= ax && ay >= az) return [0, Math.sign(normal.y) || 0, 0];
  return [0, 0, Math.sign(normal.z) || 0];
};

export const Cube = ({ position, texture, shape = 'cube' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref] = useBox(() => ({ type: 'Static', position }));

  const addCube = useStore((state) => state.addCube);
  const removeCube = useStore((state) => state.removeCube);

  const geometry = useMemo(() => {
    if (shape === 'sphere') return <sphereGeometry args={[0.5, 20, 20]} />;
    if (shape === 'pyramid') return <coneGeometry args={[0.5, 1, 4]} />;
    return <boxGeometry />;
  }, [shape]);

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
        const { x, y, z } = ref.current.position;

        if (e.altKey) {
          removeCube(x, y, z);
          return;
        }

        if (!e.face?.normal || !e.object) return;

        const worldNormal = e.face.normal.clone().transformDirection(e.object.matrixWorld);
        const [nx, ny, nz] = getDominantAxisNormal(worldNormal);
        const newPos = [x, y, z];
        newPos[0] += nx;
        newPos[1] += ny;
        newPos[2] += nz;
        addCube(...newPos);
      }}
    >
      {geometry}
      <meshStandardMaterial
        color={isHovered ? 'grey' : textureColors[texture]}
        transparent={texture === 'glass'}
        opacity={texture === 'glass' ? 0.6 : 1}
        attach="material"
      />
    </mesh>
  );
};
