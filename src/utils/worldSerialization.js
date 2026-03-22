import { nanoid } from 'nanoid';
import { textureColors } from '../constants/textureColors';
import { validShapes } from '../constants/shapes';

export const WORLD_STORAGE_KEY = 'mini_minecraft_world_v1';
export const WORLD_FILE_MAGIC = [77, 77, 67, 87, 49]; // MMCW1
export const WORLD_FILE_KEY = new TextEncoder().encode('mini-minecraft-world-save-v1');

export const normalizeCubes = (cubes) => {
  if (!Array.isArray(cubes)) return [];

  return cubes
    .filter((cube) => Array.isArray(cube?.pos) && cube.pos.length === 3)
    .map((cube) => {
      const [x, y, z] = cube.pos.map((value) => Number(value));
      const safeTexture = textureColors[cube.texture] ? cube.texture : 'grass';
      const safeShape = validShapes.includes(cube.shape) ? cube.shape : 'cube';

      return {
        key: typeof cube.key === 'string' ? cube.key : nanoid(),
        pos: [x, y, z],
        texture: safeTexture,
        shape: safeShape,
      };
    })
    .filter((cube) => cube.pos.every((value) => Number.isFinite(value)));
};

export const normalizeWorld = (world) => ({
  cubes: normalizeCubes(world?.cubes),
  isDay: typeof world?.isDay === 'boolean' ? world.isDay : true,
});

export const withFreshCubeKeys = (world) => ({
  cubes: normalizeCubes(world?.cubes).map((cube) => ({ ...cube, key: nanoid() })),
  isDay: typeof world?.isDay === 'boolean' ? world.isDay : true,
});

const xorBytes = (input, key) => {
  const output = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    output[i] = input[i] ^ key[i % key.length];
  }
  return output;
};

export const encodeWorldFile = (world) => {
  const payload = new TextEncoder().encode(JSON.stringify(normalizeWorld(world)));
  const encrypted = xorBytes(payload, WORLD_FILE_KEY);
  const bytes = new Uint8Array(WORLD_FILE_MAGIC.length + encrypted.length);

  bytes.set(WORLD_FILE_MAGIC, 0);
  bytes.set(encrypted, WORLD_FILE_MAGIC.length);

  return bytes;
};

export const decodeWorldFile = (bytes) => {
  const headerLength = WORLD_FILE_MAGIC.length;
  const hasValidHeader =
    bytes.length > headerLength &&
    WORLD_FILE_MAGIC.every((value, index) => bytes[index] === value);

  if (hasValidHeader) {
    const encrypted = bytes.slice(headerLength);
    const decrypted = xorBytes(encrypted, WORLD_FILE_KEY);
    const decodedText = new TextDecoder().decode(decrypted);
    const parsed = JSON.parse(decodedText);
    return normalizeWorld(parsed);
  }

  // Fallback: also allow importing JSON world files for compatibility.
  const decodedText = new TextDecoder().decode(bytes);
  const parsed = JSON.parse(decodedText);
  if (Array.isArray(parsed)) {
    return normalizeWorld({ cubes: parsed, isDay: true });
  }

  return normalizeWorld(parsed);
};

export const getStoredWorld = () => {
  try {
    const worldData = window.localStorage.getItem(WORLD_STORAGE_KEY);
    if (worldData) {
      return normalizeWorld(JSON.parse(worldData));
    }
  } catch (error) {
    console.warn('Failed to read saved world', error);
  }

  // Backward compatibility with old saves that only stored cubes.
  let legacyCubes = [];
  try {
    const legacyData = window.localStorage.getItem('cubes');
    legacyCubes = legacyData ? JSON.parse(legacyData) : [];
  } catch {
    legacyCubes = [];
  }

  return {
    cubes: legacyCubes,
    isDay: true,
  };
};

export const getStoredWorldStrict = () => {
  try {
    const worldData = window.localStorage.getItem(WORLD_STORAGE_KEY);
    if (worldData) {
      return normalizeWorld(JSON.parse(worldData));
    }
  } catch {
    throw new Error('Local save is corrupted.');
  }

  try {
    const legacyData = window.localStorage.getItem('cubes');
    if (legacyData) {
      return {
        cubes: normalizeCubes(JSON.parse(legacyData)),
        isDay: true,
      };
    }
  } catch {
    throw new Error('Local save is corrupted.');
  }

  throw new Error('No local save found.');
};
