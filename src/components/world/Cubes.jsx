import React from 'react';
import { useStore } from '../../store/useStore';
import { Cube } from './Cube';

export const Cubes = () => {
  const cubes = useStore((state) => state.cubes);
  return cubes.map(({ key, pos, texture, shape }) => (
    <Cube key={key} position={pos} texture={texture} shape={shape} />
  ));
};
