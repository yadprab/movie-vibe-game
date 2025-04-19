// Canvas utility functions for the scratch-card style poster reveal

export interface CanvasConfig {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  revealPercentage: number; // 0 to 100
}

/**
 * Initialize the canvas with the movie poster image
 */
export const initCanvas = (config: CanvasConfig): void => {
  const { canvas, image } = config;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;
  
  // Set canvas dimensions to match the image
  canvas.width = image.width;
  canvas.height = image.height;
  
  // Draw the image
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
  // Apply a mask based on the reveal percentage
  applyRevealMask(config);
};

/**
 * Apply a mask to the canvas to reveal only a portion of the image
 */
export const applyRevealMask = (config: CanvasConfig): void => {
  const { canvas, revealPercentage } = config;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;
  
  // Calculate the number of cells in the grid
  const gridSize = 10; // 10x10 grid
  const cellWidth = canvas.width / gridSize;
  const cellHeight = canvas.height / gridSize;
  
  // Calculate how many cells to reveal based on the percentage
  const totalCells = gridSize * gridSize;
  const cellsToReveal = Math.floor((revealPercentage / 100) * totalCells);
  
  // Create a random order of cells
  const cellIndices = Array.from({ length: totalCells }, (_, i) => i);
  shuffleArray(cellIndices);
  
  // Create a mask to hide the image
  ctx.fillStyle = 'rgba(19, 7, 58, 0.9)'; // Dark Matter color with opacity
  
  // Reveal only the cells based on the percentage
  for (let i = 0; i < cellsToReveal; i++) {
    const index = cellIndices[i];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    
    ctx.clearRect(
      col * cellWidth,
      row * cellHeight,
      cellWidth,
      cellHeight
    );
  }
};

/**
 * Shuffle an array using the Fisher-Yates algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Load an image from a URL and return a Promise that resolves with the image
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};
