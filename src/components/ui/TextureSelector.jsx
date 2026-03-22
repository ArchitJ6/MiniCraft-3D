import React, { useEffect, useState } from 'react';
import { textureColors } from '../../constants/textureColors';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useStore } from '../../store/useStore';

export const TextureSelector = () => {
  const [visible, setVisible] = useState(false);
  const activeTexture = useStore((state) => state.texture);
  const setTexture = useStore((state) => state.setTexture);
  const { dirt, grass, glass, wood, log } = useKeyboard();

  useEffect(() => {
    const textures = { dirt, grass, glass, wood, log };
    const pressedTexture = Object.entries(textures).find(([, v]) => v);
    if (pressedTexture) setTexture(pressedTexture[0]);
  }, [setTexture, dirt, grass, glass, wood, log]);

  useEffect(() => {
    const showTimeout = setTimeout(() => setVisible(true), 0);
    const hideTimeout = setTimeout(() => setVisible(false), 3000);
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [activeTexture]);

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
            <span style={{ color: 'white', fontSize: '12px', textTransform: 'capitalize' }}>{k}</span>
          </div>
        ))}
      </div>
    )
  );
};
