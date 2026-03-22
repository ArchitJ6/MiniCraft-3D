import React, { useEffect, useState } from 'react';
import { textureColors } from '../../constants/textureColors';
import { shapeOptions } from '../../constants/shapes';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useStore } from '../../store/useStore';

export const TextureSelector = () => {
  const [visible, setVisible] = useState(false);
  const activeTexture = useStore((state) => state.texture);
  const activeShape = useStore((state) => state.shape);
  const setTexture = useStore((state) => state.setTexture);
  const setShape = useStore((state) => state.setShape);
  const { dirt, grass, glass, wood, log, shapeCube, shapeSphere, shapePyramid } = useKeyboard();

  useEffect(() => {
    const textures = { dirt, grass, glass, wood, log };
    const pressedTexture = Object.entries(textures).find(([, v]) => v);
    if (pressedTexture) setTexture(pressedTexture[0]);
  }, [setTexture, dirt, grass, glass, wood, log]);

  useEffect(() => {
    const shapes = {
      cube: shapeCube,
      sphere: shapeSphere,
      pyramid: shapePyramid,
    };
    const pressedShape = Object.entries(shapes).find(([, v]) => v);
    if (pressedShape) setShape(pressedShape[0]);
  }, [setShape, shapeCube, shapeSphere, shapePyramid]);

  useEffect(() => {
    const showTimeout = setTimeout(() => setVisible(true), 0);
    const hideTimeout = setTimeout(() => setVisible(false), 3000);
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [activeTexture, activeShape]);

  return (
    visible && (
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '15px',
          zIndex: 99,
          background: 'rgba(0,0,0,0.7)',
          padding: '15px',
          borderRadius: '8px',
          border: '2px solid #555',
        }}
      >
        <div style={{ display: 'flex', gap: '15px' }}>
          {Object.keys(textureColors).map((k) => (
            <div
              key={k}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: textureColors[k],
                  border: k === activeTexture ? '4px solid #fff' : '2px solid #999',
                  borderRadius: '4px',
                  boxShadow: k === activeTexture ? '0 0 10px #fff' : 'none',
                }}
              />
              <span style={{ color: 'white', fontSize: '12px', textTransform: 'capitalize' }}>
                {k}
              </span>
            </div>
          ))}
        </div>

        <div style={{ width: 1, background: 'rgba(255,255,255,0.25)', margin: '0 4px' }} />

        <div style={{ display: 'flex', gap: '15px' }}>
          {Object.entries(shapeOptions).map(([shapeKey, shapeMeta]) => (
            <div
              key={shapeKey}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: '#1f1f1f',
                  color: '#f0f0f0',
                  border: shapeKey === activeShape ? '4px solid #fff' : '2px solid #999',
                  borderRadius: '4px',
                  boxShadow: shapeKey === activeShape ? '0 0 10px #fff' : 'none',
                  fontSize: '26px',
                  lineHeight: 1,
                }}
              >
                {shapeMeta.icon}
              </div>
              <span style={{ color: 'white', fontSize: '12px' }}>
                {shapeMeta.label}
              </span>
              <span style={{ color: '#bbb', fontSize: '10px' }}>{shapeMeta.key}</span>
            </div>
          ))}
        </div>
      </div>
    )
  );
};
