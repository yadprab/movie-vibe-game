import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers as any); // Using 'any' here is necessary due to type incompatibilities between libraries

// Clean up after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock canvas methods since jsdom doesn't support them
class MockCanvas {
  getContext(contextId: string) {
    if (contextId === "2d") {
      // Create a partial mock of CanvasRenderingContext2D with just the methods we need
      return {
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        fillStyle: "",
        strokeRect: vi.fn(),
        strokeStyle: "",
        lineWidth: 0,
        shadowBlur: 0,
        shadowColor: "",
        drawImage: vi.fn(),
        canvas: this,
        getContextAttributes: vi.fn(() => ({})),
        globalAlpha: 1,
        globalCompositeOperation: "source-over",
        // Add any other methods/properties your tests might need
      } as unknown as CanvasRenderingContext2D;
    }
    return null;
  }
}

// Type-safe mock for HTMLCanvasElement.prototype.getContext
// We need to cast to unknown first, then to the specific function type to override the native method
global.HTMLCanvasElement.prototype.getContext = function (
  contextId: string
  // We're not using options parameter but need to include it for compatibility
) {
  if (contextId === "2d") {
    return new MockCanvas().getContext("2d");
  }
  // For other context types, return null or implement as needed
  return null;
} as unknown as HTMLCanvasElement["getContext"]; // Cast to the correct function type

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

// Mock performance.now
global.performance.now = vi.fn(() => Date.now());

// Create a proper HTMLImageElement mock
class MockImage {
  onload: () => void = () => {};
  onerror: () => void = () => {};
  src: string = "";
  width: number = 300;
  height: number = 450;

  constructor() {
    setTimeout(() => {
      this.onload();
    }, 100);
  }
}

// Override the global Image constructor
global.Image = MockImage as unknown as typeof global.Image;
