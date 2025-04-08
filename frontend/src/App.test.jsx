import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the SynthMem title', () => {
    render(<App />);
    expect(screen.getByText('Synth')).toBeInTheDocument();
    expect(screen.getByText('Mem')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<App />);
    expect(screen.getByText('Synthesizer Memory Manager')).toBeInTheDocument();
  });

  it('increments counter when button is clicked', () => {
    render(<App />);
    
    // Initial state
    expect(screen.getByText('You clicked the button 0 times')).toBeInTheDocument();
    
    // Click the button
    fireEvent.click(screen.getByText('Click me'));
    
    // Check if counter incremented
    expect(screen.getByText('You clicked the button 1 times')).toBeInTheDocument();
  });
});
