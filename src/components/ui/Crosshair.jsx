import React from 'react';

export const Crosshair = () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      zIndex: 10,
      pointerEvents: 'none',
      fontSize: '32px',
      fontWeight: 'bold',
    }}
  >
    +
  </div>
);
