import confetti from 'canvas-confetti';

/**
 * Animate the poster reveal with a smooth transition
 */
export const animatePosterReveal = (
  _canvasElement: HTMLCanvasElement, // Unused but kept for API consistency
  fromPercentage: number,
  toPercentage: number,
  duration = 1000,
  onUpdate: (percentage: number) => void
) => {
  const startTime = performance.now();
  const animate = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const currentValue = Math.round(fromPercentage + progress * (toPercentage - fromPercentage));
    
    onUpdate(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

/**
 * Animate the input field shake effect for incorrect guesses
 */
export const animateShake = (element: HTMLElement) => {
  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(5px)' },
    { transform: 'translateX(0)' }
  ];
  
  element.animate(keyframes, {
    duration: 700,
    easing: 'ease-in-out'
  });
};

/**
 * Animate the success celebration with a pulse effect
 */
export const animateSuccess = (element: HTMLElement) => {
  const keyframes = [
    { transform: 'scale(1)' },
    { transform: 'scale(1.1)' },
    { transform: 'scale(1)' }
  ];
  
  element.animate(keyframes, {
    duration: 800,
    easing: 'ease-in-out'
  });
};

/**
 * Create a confetti explosion for successful guesses
 */
export const triggerConfetti = (): void => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Use cyberpunk colors from our theme
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#C376FF', '#8449FF', '#9921E8', '#FF5EFC'],
    });
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#C376FF', '#8449FF', '#9921E8', '#FF5EFC'],
    });
  }, 250);
};
