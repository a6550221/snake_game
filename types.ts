
export type Point = {
  x: number;
  y: number;
};

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export type GameStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER';

export interface ImageGenConfig {
  /**
   * Supported aspect ratios for Gemini image generation models.
   */
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  /**
   * Supported image sizes for Gemini 3 Pro image generation models.
   */
  imageSize: '1K' | '2K' | '4K';
}

declare global {
  /**
   * The AIStudio interface for managing API keys.
   */
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    /**
     * The aistudio property is provided by the environment and must match the AIStudio type.
     * Removed readonly modifier to avoid "identical modifiers" error when clashing with other global declarations.
     */
    aistudio: AIStudio;
  }
}