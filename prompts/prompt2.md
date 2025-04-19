# MovieGuesser UI Enhancement Prompts

## Initial Requirements

Implement UI improvements for the MovieGuesser app by:
- Integrating shadcn/ui components
- Enabling dark mode with a custom color palette
- Applying glassmorphism styles
- Restructuring input fields to allow each letter of the guess to be entered in separate input fields (Wordle-style)
- Removing the submit button for automatic guessing
- Utilizing CSS Grid for layout improvements

## UI Styling Improvements

### Neon Glassmorphism Styling
Transform the UI with a neon glassmorphism style featuring:
- Pure black background (#000)
- Subtle radial gradient background effects
- Transparent glass-like components with blur effects
- Neon glow effects on important UI elements
- Pulsing animations for correct letters

### Letter Input Improvements
- Use flex layout instead of grid for letter inputs to ensure proper spacing
- Add wrapper divs around each input for better styling control
- Create a dark container background for the letter inputs
- Add proper spacing between letters
- Implement automatic submission when all letters are filled

### Card and Header Styling
- Improve spacing around the "Guess the Movie" title
- Create a proper badge for the attempts counter
- Add a year badge to the movie plot card
- Create a darker background for the plot text
- Improve visual hierarchy with better font sizes and weights

### Glassmorphism Effects
- Enhance glass effects with better transparency and blur
- Add subtle neon glow effects to important elements
- Create pulsing animation for correct letters
- Add hover effects to interactive elements

## Color Palette

Custom futuristic purple theme with:
- Background: Pure Black (#000)
- Foreground: Holographic Silver (240 100% 95%)
- Primary: Electric Lavender (270 82% 73%)
- Secondary: Cosmic Glow (264 80% 57%)
- Accent: Cyberpunk Pink (300 97% 68%)
- Muted: Neon Violet (276 77% 51%)

## Component Structure

### MovieGuesser Component
- Main container using CSS Grid layout
- Movie poster on the left
- Game content on the right (plot, input, messages)
- Responsive design that stacks vertically on mobile

### MovieGuessInput Component
- Card with glassmorphism effect
- Header with title and attempts badge
- Letter input grid with flex layout
- Help text with instructions

### LetterInput Component
- Flex container for letter inputs
- Individual letter inputs with wrapper divs
- Automatic focus management
- State indicators for correct/present/absent letters

## Animation Effects

- Pulsing glow effect on correct letters
- Hover effects on glass cards
- Neon text glow on important headings
- Confetti animation on correct guess
- Poster reveal animation

## Responsive Design

- Grid layout on desktop (1fr 2fr)
- Stack layout on mobile
- Adjusted input sizes for mobile
- Maintained spacing and visual hierarchy across devices

## Implementation Notes

- Used shadcn/ui ThemeProvider for dark mode
- Created custom CSS classes for glassmorphism effects
- Used flex layout for better spacing control
- Added wrapper divs for better styling options
- Implemented custom animations for interactive elements
