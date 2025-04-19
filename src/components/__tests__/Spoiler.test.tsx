import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spoiler from '../Spoiler';

describe('Spoiler Component', () => {
  it('renders with [REDACTED] text instead of the actual content', () => {
    const testText = 'Secret Movie Title';
    render(<Spoiler text={testText} />);
    
    // Should show [REDACTED] instead of the actual text
    expect(screen.getByText('[REDACTED]')).toBeInTheDocument();
    
    // The actual text should not be visible in the DOM
    expect(screen.queryByText(testText)).not.toBeInTheDocument();
  });

  it('stores the original content in a data attribute', () => {
    const testText = 'Secret Movie Title';
    const { container } = render(<Spoiler text={testText} />);
    
    // Find the span element
    const spanElement = container.querySelector('span');
    
    // Check that the data attribute contains the original text
    expect(spanElement).toHaveAttribute('data-original-content', testText);
  });

  it('applies custom className when provided', () => {
    const testText = 'Secret Movie Title';
    const customClass = 'custom-spoiler';
    
    const { container } = render(<Spoiler text={testText} className={customClass} />);
    
    // Find the span element
    const spanElement = container.querySelector('span');
    
    // Check that it has both the spoiler class and the custom class
    expect(spanElement).toHaveClass('spoiler');
    expect(spanElement).toHaveClass(customClass);
  });

  it('has the correct accessibility attributes', () => {
    const testText = 'Secret Movie Title';
    render(<Spoiler text={testText} />);
    
    // Check for aria-label
    const element = screen.getByText('[REDACTED]');
    expect(element).toHaveAttribute('aria-label', 'Hidden content');
  });
});
