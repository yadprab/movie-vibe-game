import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LetterInput, { LetterInputRef } from "../LetterInput";

describe("LetterInput Component", () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it("renders the correct number of input boxes", () => {
    const { container } = render(
      <LetterInput length={5} onComplete={mockOnComplete} />
    );

    const inputElements = container.querySelectorAll("input");
    expect(inputElements.length).toBe(5);
  });

  it("handles letter input correctly", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LetterInput length={5} onComplete={mockOnComplete} />
    );

    const inputElements = container.querySelectorAll("input");

    // Type a letter in the first input
    await act(async () => {
      await user.type(inputElements[0], "A");
    });

    // Check that the value was updated
    expect(inputElements[0]).toHaveValue("A");

    // Focus should move to the next input
    expect(document.activeElement).toBe(inputElements[1]);
  });

  it("calls onComplete when all letters are filled", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LetterInput length={3} onComplete={mockOnComplete} />
    );

    const inputElements = container.querySelectorAll("input");

    // Fill all inputs
    await act(async () => {
      await user.type(inputElements[0], "A");
      await user.type(inputElements[1], "B");
      await user.type(inputElements[2], "C");
    });

    // Check that onComplete was called with the correct value
    expect(mockOnComplete).toHaveBeenCalledWith("ABC");
  });

  it("handles backspace key correctly", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LetterInput length={3} onComplete={mockOnComplete} />
    );

    const inputElements = container.querySelectorAll("input");

    // Fill the first two inputs
    await act(async () => {
      await user.type(inputElements[0], "A");
      await user.type(inputElements[1], "B");
    });

    // Press backspace in the second input
    await act(async () => {
      // Focus the second input first
      inputElements[1].focus();
      // Then simulate backspace
      await user.keyboard("{Backspace}");
    });

    // Manually check the value since the test is failing
    expect(inputElements[1].value).toBe("");

    // Press backspace again to move to the previous input
    await act(async () => {
      await user.keyboard("{Backspace}");
    });

    // Check that focus moved back to the first input
    expect(document.activeElement).toBe(inputElements[0]);
  });

  it("prefills correct letters in their positions", async () => {
    const { container, rerender } = render(
      <LetterInput length={9} onComplete={mockOnComplete} />
    );

    // Create a ref to access the component methods
    const ref = React.createRef<LetterInputRef>();

    // Re-render with the ref
    rerender(<LetterInput ref={ref} length={9} onComplete={mockOnComplete} />);

    // Call the prefillCorrectLetters method
    await act(async () => {
      const movieTitle = "TESTMOVIE";
      const correctLetters = ["t", "e"];
      if (ref.current) {
        ref.current.prefillCorrectLetters(movieTitle, correctLetters);
      }
    });

    // Get the inputs after the state has been updated
    const inputElements = container.querySelectorAll("input");

    // Manually check values
    expect(inputElements[0].value).toBe("T");
    expect(inputElements[1].value).toBe("E");

    // Check that the prefilled inputs are disabled
    expect(inputElements[0]).toBeDisabled();
    expect(inputElements[1]).toBeDisabled();

    // Check that other inputs are empty and not disabled
    expect(inputElements[2].value).toBe("");
    expect(inputElements[2]).not.toBeDisabled();
  });

  it("normalizes movie titles by removing spaces and special characters", async () => {
    const { container, rerender } = render(
      <LetterInput length={12} onComplete={mockOnComplete} />
    );

    // Create a ref to access the component methods
    const ref = React.createRef<LetterInputRef>();

    // Re-render with the ref
    rerender(<LetterInput ref={ref} length={12} onComplete={mockOnComplete} />);

    // Call the prefillCorrectLetters method with a title containing spaces
    await act(async () => {
      const movieTitle = "THE LORD OF";
      const correctLetters = ["t", "h", "e"];
      if (ref.current) {
        ref.current.prefillCorrectLetters(movieTitle, correctLetters);
      }
    });

    // Get the inputs after the state has been updated
    const inputElements = container.querySelectorAll("input");

    // Manually check values
    expect(inputElements[0].value).toBe("T");
    expect(inputElements[1].value).toBe("H");
    expect(inputElements[2].value).toBe("E");

    // The spaces should be removed, so "LORD" starts at index 3
    expect(inputElements[3].value).toBe("");
    expect(inputElements[4].value).toBe("");
    expect(inputElements[5].value).toBe("");
    expect(inputElements[6].value).toBe("");
  });
});
