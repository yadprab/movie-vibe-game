import { act, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as animationUtils from "../../utils/animationUtils";
import * as canvasUtils from "../../utils/canvasUtils";
import MoviePoster from "../MoviePoster";

// Mock the canvas and animation utilities
vi.mock("../../utils/canvasUtils", () => {
  // Create a loadImage implementation that we can control for testing
  const loadImageMock = vi.fn();
  
  return {
    loadImage: loadImageMock,
    initCanvas: vi.fn(),
    applyRevealMask: vi.fn(),
  };
});

vi.mock("../../utils/animationUtils", () => ({
  createPosterEntranceAnimation: vi.fn(),
  animatePosterReveal: vi
    .fn()
    .mockImplementation(
      (canvas, fromPercent, toPercent, durationMs, callback) => {
        // Immediately call the callback with the target percentage to simulate animation completion
        callback(toPercent);
      }
    ),
}));

describe("MoviePoster Component", () => {
  const testPosterUrl = "https://example.com/poster.jpg";

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset the loadImage mock to a pending promise by default
    vi.mocked(canvasUtils.loadImage).mockImplementation(() => {
      return new Promise((resolve) => {
        // This promise won't resolve until we explicitly call it in the test
        setTimeout(() => resolve(new Image()), 100);
      });
    });
  });

  it("renders a loading spinner when image is not loaded", async () => {
    // Don't resolve the image loading yet
    vi.mocked(canvasUtils.loadImage).mockImplementation(() => {
      return new Promise((resolve) => {
        // This promise won't resolve during this test
        setTimeout(() => resolve(new Image()), 10000);
      });
    });
    
    render(<MoviePoster posterUrl={testPosterUrl} revealPercentage={30} />);
    
    // Should show a loading spinner
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("calculates reveal percentage based on discovered letters", async () => {
    const movieTitle = "TESTMOVIE";
    const discoveredLetters = ["t", "e"];

    // Make loadImage resolve immediately for this test
    vi.mocked(canvasUtils.loadImage).mockResolvedValue(new Image());

    // Render the component
    await act(async () => {
      render(
        <MoviePoster
          posterUrl={testPosterUrl}
          revealPercentage={10}
          movieTitle={movieTitle}
          discoveredLetters={discoveredLetters}
        />
      );
    });

    // Wait for the image to "load" (handled by our mock)
    await vi.waitFor(() => {
      expect(canvasUtils.initCanvas).toHaveBeenCalled();
    });

    // Check that initCanvas was called with a config that includes the correct percentage
    // In this case, with 2 out of 8 unique letters (T,E,S,M,O,V,I), we expect around 25-30%
    const lastCall = vi.mocked(canvasUtils.initCanvas).mock.calls[0][0];

    // The percentage should be higher than the base revealPercentage (10%)
    expect(lastCall.revealPercentage).toBeGreaterThan(10);

    // The config should include the discovered letters
    expect(lastCall.discoveredLetters).toEqual(discoveredLetters);
  });

  it("shows full poster when revealPercentage is 100", async () => {
    // Make loadImage resolve immediately for this test
    vi.mocked(canvasUtils.loadImage).mockResolvedValue(new Image());
    
    // Render with 100% reveal
    let container: HTMLElement;

    await act(async () => {
      const result = render(
        <MoviePoster posterUrl={testPosterUrl} revealPercentage={100} />
      );
      container = result.container;
    });

    // Wait for the component to process
    await vi.waitFor(() => {
      // Should show the full image instead of canvas
      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", testPosterUrl);
    });
  });

  it("applies entrance animation when poster is first loaded", async () => {
    // Make loadImage resolve immediately for this test
    vi.mocked(canvasUtils.loadImage).mockResolvedValue(new Image());
    
    await act(async () => {
      render(<MoviePoster posterUrl={testPosterUrl} revealPercentage={30} />);
    });

    // Wait for the image to "load"
    await vi.waitFor(() => {
      expect(animationUtils.createPosterEntranceAnimation).toHaveBeenCalled();
    });
  });

  it("updates when discovered letters change", async () => {
    const movieTitle = "TESTMOVIE";
    const initialLetters = ["t"];

    // Make loadImage resolve immediately for this test
    vi.mocked(canvasUtils.loadImage).mockResolvedValue(new Image());
    
    let rerender: (ui: React.ReactElement) => void;

    await act(async () => {
      const result = render(
        <MoviePoster
          posterUrl={testPosterUrl}
          revealPercentage={10}
          movieTitle={movieTitle}
          discoveredLetters={initialLetters}
        />
      );
      rerender = result.rerender;
    });

    // Wait for initial render
    await vi.waitFor(() => {
      expect(canvasUtils.initCanvas).toHaveBeenCalled();
    });

    // Clear mocks to track new calls
    vi.clearAllMocks();

    // Update with more discovered letters
    const updatedLetters = ["t", "e", "s"];

    await act(async () => {
      rerender(
        <MoviePoster
          posterUrl={testPosterUrl}
          revealPercentage={10}
          movieTitle={movieTitle}
          discoveredLetters={updatedLetters}
        />
      );
    });

    // Wait for the update
    await vi.waitFor(() => {
      expect(canvasUtils.initCanvas).toHaveBeenCalled();
    });

    // Check that animatePosterReveal was called for the transition
    expect(animationUtils.animatePosterReveal).toHaveBeenCalled();

    // Check that the last initCanvas call includes the updated letters
    const lastCall = vi.mocked(canvasUtils.initCanvas).mock.calls[0][0];
    expect(lastCall.discoveredLetters).toEqual(updatedLetters);
  });
});
