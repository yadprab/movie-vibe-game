import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MovieGuesser from './components/MovieGuesser'
import './App.css'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-deep-space-purple p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-cyberpunk-pink">MovieGuesser</h1>
            <p className="text-holographic-silver">
              Guess the movie based on its plot. You have 3 attempts!
            </p>
          </header>
          
          <main>
            <MovieGuesser />
          </main>
          
          <footer className="mt-12 text-center text-sm text-holographic-silver/50">
            <p>Built with React, Vite, and the OMDb API</p>
          </footer>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
