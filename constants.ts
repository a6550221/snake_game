
import { ImageGenConfig } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 60;

// Update aspect ratios to match supported values: '1:1', '3:4', '4:3', '9:16', '16:9'
export const ASPECT_RATIOS: ImageGenConfig['aspectRatio'][] = [
  '1:1', '3:4', '4:3', '9:16', '16:9'
];

export const IMAGE_SIZES: ImageGenConfig['imageSize'][] = [
  '1K', '2K', '4K'
];
