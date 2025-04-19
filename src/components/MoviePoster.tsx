import React, { useEffect, useRef, useState } from 'react';
import { loadImage, initCanvas, CanvasConfig } from '../utils/canvasUtils';
import { animatePosterReveal } from '../utils/animationUtils';

interface MoviePosterProps {
  posterUrl: string;
  revealPercentage: number;
  className?: string;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ 
  posterUrl, 
  revealPercentage,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [posterImage, setPosterImage] = useState<HTMLImageElement | null>(null);
  const [currentPercentage, setCurrentPercentage] = useState(revealPercentage);
  const prevPercentageRef = useRef(revealPercentage);

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
      const config: CanvasConfig = {
        canvas: canvasRef.current,
        image: posterImage,
        revealPercentage: currentPercentage
      };
      
      initCanvas(config);
    }
  }, [posterImage, currentPercentage]);

  // Animate the reveal when the percentage changes
  useEffect(() => {
    if (canvasRef.current && posterImage && revealPercentage !== prevPercentageRef.current) {
      const fromPercentage = prevPercentageRef.current;
      const toPercentage = revealPercentage;
      
      animatePosterReveal(
        canvasRef.current,
        fromPercentage,
        toPercentage,
        1000,
        (percentage) => {
          setCurrentPercentage(percentage);
        }
      );
      
      prevPercentageRef.current = revealPercentage;
    }
  }, [revealPercentage, posterImage]);

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}>
      {!posterImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain"
        style={{ display: posterImage ? 'block' : 'none' }}
      />
    </div>
  );
};

export default MoviePoster;
