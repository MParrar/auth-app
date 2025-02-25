import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthContext from '../contexts/AuthProvider';
import { LandingPage } from '../pages/LandingPage';

describe('LandingPage', () => {
  it('renders the landing page correctly', () => {
    render(
      <AuthContext.Provider value={{ showAuth0Login: vi.fn() }}>
        <LandingPage />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Base Auth')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('calls showAuth0Login when the button is clicked', () => {
    const showAuth0Login = vi.fn();

    render(
      <AuthContext.Provider value={{ showAuth0Login }}>
        <LandingPage />
      </AuthContext.Provider>
    );

    const button = screen.getByRole('button', { name: 'Get Started' });
    fireEvent.click(button);

    expect(showAuth0Login).toHaveBeenCalled();
  });
  
});
