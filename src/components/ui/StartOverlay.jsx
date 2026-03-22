import React from 'react';

export const StartOverlay = ({ onStart }) => {
  return (
    <div
      id="instructions"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        textAlign: 'center',
        backdropFilter: 'blur(2px)',
      }}
      onClick={onStart}
    >
      <img
        src="/logo.png"
        alt="MiniCraft 3D Logo"
        style={{ width: '148px', height: '148px', marginBottom: '10px', objectFit: 'contain' }}
      />
      <h1 style={{ fontSize: '48px' }}>MiniCraft 3D</h1>
      <p style={{ fontSize: '18px' }}>Click to Play</p>
      <p style={{ fontSize: '14px', marginTop: '20px', color: '#ccc' }}>
        WASD: Move | Space: Jump | Click: Place Block | ALT+Click: Remove | 1-5: Texture | 6-8: Shape
      </p>
      <p style={{ fontSize: '18px', marginTop: '30px', color: '#ffdf80' }}>
        <b>Press ESC at any time to unlock your mouse and use the Menu!</b>
      </p>
    </div>
  );
};
