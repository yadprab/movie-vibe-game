import { animate, createTimeline } from "animejs";

/**
 * Interface for border animation options
 */
interface BorderAnimationOptions {
  targetSelector: string;
  color?: string;
  duration?: number;
  easing?: string;
}

/**
 * Creates a glowing border animation using Anime.js
 * @param options Animation options
 */
export const createBorderAnimation = (options: BorderAnimationOptions) => {
  const {
    targetSelector,
    color = "hsl(270 82% 73%)",
    duration = 2000,
    easing = "easeInOutSine",
  } = options;

  const target = document.querySelector(targetSelector);
  if (!target) return;

  // Clear any existing border lines
  const existingLines = target.querySelectorAll(".border-line");
  existingLines.forEach((line) => line.remove());

  // Get dimensions
  const rect = target.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  
  // Create a single border line that will travel around the card
  const borderLine = document.createElement("div");
  borderLine.classList.add("border-line");
  target.appendChild(borderLine);
  
  // Set initial styles
  borderLine.style.position = "absolute";
  borderLine.style.background = color;
  borderLine.style.boxShadow = `0 0 8px ${color}, 0 0 12px ${color}`;
  borderLine.style.zIndex = "10";
  borderLine.style.opacity = "0.8";
  borderLine.style.width = "20px"; // Small width for the traveling border
  borderLine.style.height = "2px";
  borderLine.style.top = "0";
  borderLine.style.left = "0";
  borderLine.style.transformOrigin = "left center";
  borderLine.style.pointerEvents = "none"; // Make sure it doesn't interfere with clicks

  // Create timeline for continuous animation
  const timeline = createTimeline({
    loop: true,
    defaults: {
      duration: duration / 4, // Divide total duration by 4 sides
      ease: easing,
    }
  });

  // Add animations to timeline - one continuous flow around the card
  timeline
    // Top edge: left to right
    .add(borderLine, {
      width: [20, width],
      translateX: [0, 0],
      translateY: [0, 0],
      rotate: 0,
    })
    // Right edge: top to bottom
    .add(borderLine, {
      width: [20, height],
      translateX: [width - 2, width - 2],
      translateY: [0, height - 2],
      rotate: 90,
    })
    // Bottom edge: right to left
    .add(borderLine, {
      width: [20, width],
      translateX: [width - 2, 0],
      translateY: [height - 2, height - 2],
      rotate: 180,
    })
    // Left edge: bottom to top
    .add(borderLine, {
      width: [20, height],
      translateX: [0, 0],
      translateY: [height - 2, 0],
      rotate: 270,
    })
    // Reset to starting position with a small delay
    .add(borderLine, {
      width: 20,
      translateX: 0,
      translateY: 0,
      rotate: 0,
      duration: 10 // Very short duration for reset
    });

  return timeline;
};

/**
 * Creates a pulsing glow animation for an element
 * @param targetSelector CSS selector for the target element
 * @param color Glow color (default: purple)
 */
export const createGlowAnimation = (
  targetSelector: string,
  color: string = "rgba(120, 87, 255, 0.6)"
) => {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  animate(target, {
    boxShadow: [`0 0 5px ${color}`, `0 0 15px ${color}`, `0 0 5px ${color}`],
    duration: 2000,
    ease: "inOutSine",
    alternate: true,
    loop: true,
  });
};
