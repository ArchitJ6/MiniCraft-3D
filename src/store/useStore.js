import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  decodeWorldFile,
  encodeWorldFile,
  getStoredWorld,
  withFreshCubeKeys,
  WORLD_STORAGE_KEY,
} from '../utils/worldSerialization';

const setLocalStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('Failed to save world');
  }
};

const persistWorld = (world) => {
  setLocalStorage(WORLD_STORAGE_KEY, world);
  // Keep legacy key for backward compatibility.
  setLocalStorage('cubes', world.cubes);
};

const isSamePosition = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

const cubeExistsAt = (cubes, pos) => cubes.some((cube) => isSamePosition(cube.pos, pos));

const isPlayerInsideCube = (playerPos, cubePos) => {
  const [px, py, pz] = playerPos;
  const [cx, cy, cz] = cubePos;
  return Math.abs(px - cx) < 0.95 && Math.abs(py - cy) < 0.95 && Math.abs(pz - cz) < 0.95;
};

const findSafePlacement = (targetPos, playerPos, cubes) => {
  const [x, y, z] = targetPos;
  const candidates = [
    [x, y, z],
    [x, y + 1, z],
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y, z + 1],
    [x, y, z - 1],
    [x, y + 2, z],
  ];

  return candidates.find((candidate) => {
    if (candidate[1] < 0) return false;
    if (cubeExistsAt(cubes, candidate)) return false;
    return !isPlayerInsideCube(playerPos, candidate);
  });
};

const initialWorld = getStoredWorld();

export const useStore = create((set, get) => ({
  texture: 'grass',
  cubes: initialWorld.cubes,
  isDay: initialWorld.isDay,
  playerPos: [0, 2, 0],

  toggleDayNight: () =>
    set((state) => {
      const next = { cubes: state.cubes, isDay: !state.isDay };
      persistWorld(next);
      return { isDay: next.isDay };
    }),
  setPlayerPos: (playerPos) => set(() => ({ playerPos })),

  addCube: (x, y, z) => {
    const target = [x, y, z];

    set((state) => {
      const safePos = findSafePlacement(target, state.playerPos, state.cubes);
      if (!safePos) return state;

      const nextCubes = [...state.cubes, { key: nanoid(), pos: safePos, texture: state.texture }];
      persistWorld({ cubes: nextCubes, isDay: state.isDay });

      return {
        cubes: nextCubes,
      };
    });
  },

  removeCube: (x, y, z) => {
    set((state) => ({
      cubes: state.cubes.filter((cube) => {
        const [X, Y, Z] = cube.pos;
        return X !== x || Y !== y || Z !== z;
      }),
    }));

    const state = get();
    persistWorld({ cubes: state.cubes, isDay: state.isDay });
  },

  setTexture: (texture) => set(() => ({ texture })),

  exportWorldFile: () => {
    try {
      const world = { cubes: get().cubes, isDay: get().isDay };
      const bytes = encodeWorldFile(world);
      const blob = new Blob([bytes], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      link.href = url;
      link.download = `minicraft-3d-world-${timestamp}.mmcw`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);

      return true;
    } catch (error) {
      console.warn('Failed to export world file', error);
      return false;
    }
  },

  importWorldFile: async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const world = withFreshCubeKeys(decodeWorldFile(new Uint8Array(arrayBuffer)));
    set(() => ({ cubes: world.cubes, isDay: world.isDay }));
    persistWorld(world);
    return world.cubes.length;
  },

  resetWorld: () => {
    set(() => ({ cubes: [] }));
    window.localStorage.removeItem('cubes');
    window.localStorage.removeItem(WORLD_STORAGE_KEY);
  },
}));
