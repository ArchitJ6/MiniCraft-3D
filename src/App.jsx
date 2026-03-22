import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Toaster } from 'react-hot-toast';
import { CelestialBodies } from './components/world/CelestialBodies';
import { FPV } from './components/world/FPV';
import { Player } from './components/world/Player';
import { Cubes } from './components/world/Cubes';
import { Ground } from './components/world/Ground';
import { Crosshair } from './components/ui/Crosshair';
import { StartOverlay } from './components/ui/StartOverlay';
import { TextureSelector } from './components/ui/TextureSelector';
import { Menu } from './components/ui/Menu';

// ==========================================
// 7. MAIN APP
// ==========================================
export default function App() {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(document.pointerLockElement !== null);
    };
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => document.removeEventListener('pointerlockchange', handleLockChange);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {!isLocked && <StartOverlay onStart={() => document.body.requestPointerLock()} />}

      <Canvas shadows camera={{ fov: 75, position: [0, 2, 5] }}>
        <CelestialBodies />
        <FPV />
        <Physics gravity={[0, -20, 0]}>
          <Player />
          <Cubes />
          <Ground />
        </Physics>
      </Canvas>

      {isLocked && <Crosshair />}

      <TextureSelector />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2800,
          style: {
            background: '#1f1f1f',
            color: '#f5f5f5',
            border: '1px solid #444',
          },
          success: {
            style: { border: '1px solid #2f7d32' },
          },
          error: {
            style: { border: '1px solid #b23b3b' },
          },
        }}
      />

      {!isLocked && <Menu />}
    </div>
  );
}