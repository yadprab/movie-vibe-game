import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import LetterInput, { LetterInputRef } from "./LetterInput";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { animate, stagger } from "animejs";

interface MovieGuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
  attemptsLeft: number;
  movieTitle?: string;
}

const MovieGuessInput = forwardRef<LetterInputRef, MovieGuessInputProps>(
  ({ onGuess, disabled = false, attemptsLeft, movieTitle = "" }, ref) => {
    const letterInputRef = useRef<LetterInputRef>(null);
    const titleRef = useRef<HTMLSpanElement>(null);

    // Animate the title when component mounts
    useEffect(() => {
      if (titleRef.current) {
        // Create a wrapper for each letter to animate them individually
        const title = "CINEMYSTERY";
        titleRef.current.innerHTML = title
          .split("")
          .map(char => `<span class="title-letter">${char}</span>`)
          .join("");
        
        // Animate each letter
        animate(titleRef.current.querySelectorAll(".title-letter"), {
          translateY: [-20, 0],
          opacity: [0, 1],
          delay: stagger(50),
          duration: 1500,
          easing: "easeOutElastic(1, .6)",
        });
      }
    }, []);

    // Forward the ref to the parent component
    useImperativeHandle(ref, () => ({
      clear: () => {
        if (letterInputRef.current) {
          letterInputRef.current.clear();
        }
      },
      setLetterStates: (states) => {
        if (letterInputRef.current) {
          letterInputRef.current.setLetterStates(states);
        }
      },
    }));

    const handleGuessComplete = (guess: string) => {
      if (disabled || !guess.trim()) return;

      onGuess(guess.trim());
    };

    // Calculate the average movie title length or use a default
    const guessLength = movieTitle
      ? movieTitle.replace(/[^a-zA-Z]/g, "").length
      : 10;

    return (
      <div className="border-animation-container">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary">
                <span 
                  ref={titleRef} 
                  className="tracking-wider font-bold"
                  style={{ display: "inline-block" }}
                >
                  CINEMYSTERY
                </span>
              </CardTitle>
              <div className="badge primary">
                <span className="text-sm font-semibold">
                  Clues left:{" "}
                  <span className="font-bold text-lg ml-1">{attemptsLeft}</span>
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="mb-4">
              <LetterInput
                ref={letterInputRef}
                length={guessLength}
                onComplete={handleGuessComplete}
                disabled={disabled}
              />
            </div>

            <div className="mt-4 text-sm p-4 rounded-lg bg-secondary/30">
              {disabled ? (
                <p className="description">
                  Game over, detective! Ready for a new cinematic mystery?
                </p>
              ) : (
                <p className="description">
                  Decode the title one letter at a time. The plot thickens with
                  each guess!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

MovieGuessInput.displayName = "MovieGuessInput";

export default MovieGuessInput;
