import React from 'react';

interface SpoilerProps {
  text: string;
  className?: string;
}

const Spoiler: React.FC<SpoilerProps> = ({ text, className = '' }) => {
  // No need for state anymore as we're not revealing the text

  return (
    <span 
      className={`spoiler ${className}`}
      aria-label="Hidden content"
      data-original-content={text}
    >
      [REDACTED]
    </span>
  );
};

export default Spoiler;
