// Canvas utility functions for the scratch-card style poster reveal

export interface CanvasConfig {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  revealPercentage: number; // 0 to 100
  discoveredLetters?: string[]; // Add discovered letters property
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
  const { canvas, revealPercentage, discoveredLetters = [] } = config;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;
  
  // If reveal percentage is 100%, show the full image without any mask
  if (revealPercentage >= 100) {
    // Just ensure the canvas is clear of any overlays
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  
  // Calculate the number of cells in the grid
  const gridSize = 15; // 15x15 grid for more granular reveal
  const cellWidth = canvas.width / gridSize;
  const cellHeight = canvas.height / gridSize;
  
  // Calculate how many cells to reveal based on the percentage
  const totalCells = gridSize * gridSize;
  const cellsToReveal = Math.floor((revealPercentage / 100) * totalCells);
  
  // Create a random order of cells, but make it deterministic based on discovered letters
  // This ensures the same cells are revealed for the same letters
  const cellIndices = Array.from({ length: totalCells }, (_, i) => i);
  
  // If we have discovered letters, use them to influence which cells are revealed
  if (discoveredLetters && discoveredLetters.length > 0) {
    // Create a seed based on the discovered letters
    const letterSeed = discoveredLetters.join('').toLowerCase();
    
    // Use the seed to sort the cells in a deterministic way
    cellIndices.sort((a, b) => {
      // Create a hash for each cell based on its index and the letter seed
      const hashA = simpleHash(`${a}-${letterSeed}`);
      const hashB = simpleHash(`${b}-${letterSeed}`);
      return hashA - hashB;
    });
  } else {
    // If no discovered letters, use standard shuffle
    shuffleArray(cellIndices);
  }
  
  // First, cover the entire image with a dark overlay
  ctx.fillStyle = 'rgba(10, 5, 30, 0.95)'; // Darker background for better contrast
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Define colors for the grid cells - using cyberpunk purple theme
  const colors = [
    'rgba(128, 0, 255, 0.7)',  // Purple
    'rgba(180, 0, 255, 0.7)',  // Bright purple
    'rgba(255, 0, 255, 0.7)',  // Magenta
    'rgba(200, 0, 180, 0.7)',  // Pink-purple
  ];
  
  // Reveal cells based on the percentage
  for (let i = 0; i < totalCells; i++) {
    const index = cellIndices[i];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const x = col * cellWidth;
    const y = row * cellHeight;
    
    if (i < cellsToReveal) {
      // Clear the cell to reveal the image
      ctx.clearRect(x, y, cellWidth, cellHeight);
      
      // Add a subtle border to the revealed cell
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellWidth, cellHeight);
    } else {
      // For unrevealed cells, use colored squares with a glowing effect
      const colorIndex = Math.floor(simpleHash(`${index}-color`) % colors.length);
      ctx.fillStyle = colors[colorIndex];
      
      // Draw filled square with slight padding
      const padding = 1;
      ctx.fillRect(x + padding, y + padding, cellWidth - (padding * 2), cellHeight - (padding * 2));
      
      // Add a subtle glow effect
      ctx.shadowColor = colors[colorIndex];
      ctx.shadowBlur = 5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + padding, y + padding, cellWidth - (padding * 2), cellHeight - (padding * 2));
      ctx.shadowBlur = 0;
    }
  }
};

/**
 * Simple hash function to create deterministic but random-looking values
 */
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
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
