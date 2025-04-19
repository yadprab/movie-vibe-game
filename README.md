# MovieGuesser

A movie guessing game similar to Wordle that uses the OMDB API. Players have 3 attempts to guess a movie based on its plot, with each correct attempt gradually revealing the movie poster like a scratch card, culminating in a full poster reveal and confetti animation upon success.

![MovieGuesser Screenshot](screenshot.png)

## Features

- Plot-based movie guessing mechanic
- Progressive poster reveal system using Canvas API
- Wordle-like input interface
- Success celebration with confetti animation
- Smooth animations using Web Animations API
- Beautiful futuristic purple theme

## Tech Stack

- **Framework**: Vite + React + TypeScript
- **API Management**: React Query for data fetching
- **HTTP Client**: ky for API requests
- **UI Components**: Custom UI components with shadcn/ui style
- **API**: OMDb API (https://www.omdbapi.com/)
- **Animations**: Web Animations API for smooth transitions and effects
- **Canvas API**: For scratch-card style poster reveal mechanics

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-guesser.git
   cd movie-guesser
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Get an API key from [OMDb API](https://www.omdbapi.com/apikey.aspx)

4. Update the API key in `src/api/client.ts`:
   ```typescript
   const API_KEY = 'YOUR_OMDB_API_KEY';
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. Read the movie plot displayed at the top of the screen
2. Enter your guess in the input field
3. If your guess is correct, you win! The poster will be fully revealed and confetti will celebrate your victory
4. If your guess is incorrect, you'll lose one attempt and more of the poster will be revealed
5. You have 3 attempts in total to guess the movie

## Project Structure

```
src/
├── components/      # UI components
├── api/             # ky API setup and functions
├── queries/         # React Query hooks
├── types/           # TypeScript type definitions
├── styles/          # Global styles and theming
└── utils/           # Canvas and animation utilities
```

## Color Palette (Futuristic Purple Theme)

- Deep Space Purple (`#2D1B69`): Primary background
- Dark Matter (`#13073A`): Secondary background
- Electric Lavender (`#C376FF`): Primary UI elements
- Cosmic Glow (`#8449FF`): Secondary UI elements
- Neon Violet (`#9921E8`): Interactive elements
- Cyberpunk Pink (`#FF5EFC`): Accent/highlight elements
- Holographic Silver (`#E9EAFF`): Text and borders
- Quantum Blue (`#3B1DFF`): Focus states

## License

MIT
