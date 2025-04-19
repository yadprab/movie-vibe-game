import React, { useEffect, useRef, useState, useCallback } from 'react';
import { loadImage, initCanvas, CanvasConfig } from '../utils/canvasUtils';
import { animatePosterReveal, createPosterEntranceAnimation } from '../utils/animationUtils';

interface MoviePosterProps {
  posterUrl: string;
  revealPercentage: number;
  discoveredLetters?: string[]; 
  movieTitle?: string; 
  className?: string;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ 
  posterUrl, 
  revealPercentage,
  discoveredLetters = [],
  movieTitle = '',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [posterImage, setPosterImage] = useState<HTMLImageElement | null>(null);
  const prevPercentageRef = useRef(revealPercentage);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [fullReveal, setFullReveal] = useState(revealPercentage === 100);
  const prevPosterUrlRef = useRef(posterUrl);
  const prevDiscoveredLettersRef = useRef<string[]>(discoveredLetters);

  // Calculate reveal percentage based on discovered letters
  const calculateRevealPercentage = useCallback((): number => {
    if (revealPercentage >= 100) return 100;
    
    if (!movieTitle || movieTitle.length === 0) return revealPercentage;
    
    // Get unique letters in the movie title (case insensitive)
    const uniqueLettersInTitle = Array.from(new Set(
      movieTitle.toLowerCase().replace(/[^a-z]/g, '').split('')
    ));
    
    if (uniqueLettersInTitle.length === 0) return revealPercentage;
    
    // Calculate percentage based on discovered letters
    const discoveredCount = discoveredLetters.filter(letter => 
      uniqueLettersInTitle.includes(letter.toLowerCase())
    ).length;
    
    // Calculate percentage with a minimum based on attempts
    const letterBasedPercentage = Math.min(
      100,
      Math.floor((discoveredCount / uniqueLettersInTitle.length) * 100)
    );
    
    // Use the higher of the two percentages
    return Math.max(letterBasedPercentage, revealPercentage);
  }, [revealPercentage, movieTitle, discoveredLetters]);

  // Reset states when poster URL changes (new game)
  useEffect(() => {
    if (posterUrl !== prevPosterUrlRef.current) {
      setFullReveal(false);
      setHasAnimated(false);
      prevPercentageRef.current = revealPercentage;
      prevPosterUrlRef.current = posterUrl;
      prevDiscoveredLettersRef.current = [];
    }
  }, [posterUrl, revealPercentage]);

  // Load the poster image when the URL changes
  useEffect(() => {
    const loadPosterImage = async () => {
      try {
        if (posterUrl) {
          const img = await loadImage(posterUrl);
          setPosterImage(img);
        }
      } catch (error) {
        console.error('Failed to load poster image:', error);
      }
    };

    loadPosterImage();
  }, [posterUrl]);

  // Initialize the canvas when the image is loaded
  useEffect(() => {
    if (canvasRef.current && posterImage) {
      const effectivePercentage = calculateRevealPercentage();
      
      const config: CanvasConfig = {
        canvas: canvasRef.current,
        image: posterImage,
        revealPercentage: effectivePercentage,
        discoveredLetters: discoveredLetters
      };
      
      initCanvas(config);
      
      // Apply entrance animation when poster is first loaded
      if (!hasAnimated && containerRef.current) {
        createPosterEntranceAnimation(containerRef.current);
        setHasAnimated(true);
      }
      
      // Check if we should show full poster
      if (effectivePercentage >= 100 && !fullReveal) {
        setFullReveal(true);
      }
    }
  }, [posterImage, discoveredLetters, hasAnimated, fullReveal, revealPercentage, calculateRevealPercentage, movieTitle]);

  // Animate the reveal when the percentage changes or discovered letters change
  useEffect(() => {
    if (canvasRef.current && posterImage) {
      const effectivePercentage = calculateRevealPercentage();
      const hasDiscoveredLettersChanged = 
        discoveredLetters.length !== prevDiscoveredLettersRef.current.length;
      
      if (effectivePercentage !== prevPercentageRef.current || hasDiscoveredLettersChanged) {
        const fromPercentage = prevPercentageRef.current;
        const toPercentage = effectivePercentage;
        
        // Check if we're going to full reveal
        if (toPercentage >= 100) {
          setFullReveal(true);
        }
        
        animatePosterReveal(
          canvasRef.current,
          fromPercentage,
          toPercentage,
          1000,
          (percentage) => {
            const config: CanvasConfig = {
              canvas: canvasRef.current!,
              image: posterImage,
              revealPercentage: percentage,
              discoveredLetters: discoveredLetters
            };
            
            initCanvas(config);
          }
        );
        
        prevPercentageRef.current = effectivePercentage;
        prevDiscoveredLettersRef.current = [...discoveredLetters];
      }
    }
  }, [revealPercentage, posterImage, discoveredLetters, calculateRevealPercentage, movieTitle]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}
      style={{
        border: '3px solid rgba(192, 192, 192, 0.8)',
        boxShadow: '0 0 15px rgba(192, 192, 192, 0.5), 0 0 30px rgba(192, 192, 192, 0.3)',
      }}
    >
      {!posterImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <div 
            className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"
            data-testid="loading-spinner"
          ></div>
        </div>
      )}
      
      {/* Show the full poster image directly when fullReveal is true */}
      {fullReveal && posterImage ? (
        <img 
          src={posterUrl} 
          alt="Movie Poster" 
          className="w-full h-full object-contain"
        />
      ) : (
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain"
          style={{ display: posterImage ? 'block' : 'none' }}
        />
      )}
    </div>
  );
};

export default MoviePoster;
