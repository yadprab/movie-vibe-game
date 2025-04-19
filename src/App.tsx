import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import MovieGuesser from './components/MovieGuesser'
import { ThemeProvider } from './components/ui/theme-provider'
import { animate, stagger } from 'animejs'

// Create a client
const queryClient = new QueryClient()

function AppHeader() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    if (titleRef.current) {
      // Create a wrapper for each letter to animate them individually
      const title = "CineMystery";
      titleRef.current.innerHTML = title
        .split("")
        .map(char => `<span class="title-letter">${char}</span>`)
        .join("");
      
      // Animate each letter
      animate(titleRef.current.querySelectorAll(".title-letter"), {
        translateY: [-30, 0],
        opacity: [0, 1],
        delay: stagger(80),
        duration: 1500,
        easing: "easeOutElastic(1, .5)",
      });
    }
    
    if (subtitleRef.current) {
      // Animate the subtitle
      animate(subtitleRef.current, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: 500,
        easing: "easeOutQuad",
      });
    }
  }, []);
  
  return (
    <header className="mb-8 text-center">
      <h1 
        ref={titleRef} 
        className="mb-2 text-5xl font-extrabold tracking-wider text-accent"
      >
        CineMystery
      </h1>
      <div className="flex flex-col items-center">
        <p 
          ref={subtitleRef}
          className="text-xl font-semibold text-primary mb-1"
        >
          The Plot Thickens
        </p>
        <p className="text-foreground/80 description italic mt-2">
          "Plot Twist: You're the Detective Now! 3 Clues, 3 Chances, Can You Crack the Case?"
        </p>
      </div>
    </header>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="movie-guesser-theme">
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            <AppHeader />
            
            <main>
              <MovieGuesser />
            </main>
            
            <footer className="mt-12 text-center text-sm text-foreground/50">
              <p>Built with React, Vite, and the OMDb API</p>
            </footer>
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
