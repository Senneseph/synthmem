import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock MUI icons to avoid directory import issues in tests
vi.mock('@mui/icons-material/Build', () => ({
  default: () => <div data-testid="build-icon">Build Icon</div>
}));
vi.mock('@mui/icons-material/Save', () => ({
  default: () => <div data-testid="save-icon">Save Icon</div>
}));
vi.mock('@mui/icons-material/Search', () => ({
  default: () => <div data-testid="search-icon">Search Icon</div>
}));
vi.mock('@mui/icons-material/Home', () => ({
  default: () => <div data-testid="home-icon">Home Icon</div>
}));

describe('App', () => {
  it('renders the app with navigation', () => {
    render(<App />);
    // Check that the app renders with the SynthMem title
    expect(screen.getByText('Synth')).toBeInTheDocument();
    expect(screen.getByText('Mem')).toBeInTheDocument();
  });

  it('renders the Dashboard page by default', () => {
    render(<App />);
    // The Dashboard should be rendered by default with its title
    expect(screen.getByText('Welcome to SynthMem')).toBeInTheDocument();
  });
});
