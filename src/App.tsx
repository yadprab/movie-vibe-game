import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MovieGuesser from './components/MovieGuesser'
import { ThemeProvider } from './components/ui/theme-provider'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="movie-guesser-theme">
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            <header className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold text-accent neon-text">MovieGuesser</h1>
              <p className="text-foreground/80">
                Guess the movie based on its plot. You have 3 attempts!
              </p>
            </header>
            
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
