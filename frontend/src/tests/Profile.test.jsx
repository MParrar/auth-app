import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { NotificationProvider } from '../contexts/NotificationProvider';
import { AuthProvider } from '../contexts/AuthProvider';
import {MyProfile} from '../pages/MyProfile';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../hook/axiosInstance', () => ({
  default: () => ({
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          isAuthenticated: true,
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      })
    ),
    post: vi.fn(() =>
      Promise.resolve({
        data: {
          status: 'success',
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      })
    ),
    put: vi.fn(() => Promise.resolve({ data: {} })),
  }),
  useAxios: vi.fn(() => ({
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(),
    put: vi.fn(),
  })),
}));

const userData = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  company_name: 'Test Corp',
  sub: 'auth0|12345',
};

describe('MyProfile Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider initialUser={userData}>
            <MyProfile />
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    );
  });

  it('renders the component structure correctly', async () => {
      await waitFor(() => {
          const heading = screen.getByTestId('my-profile-heading');
          const emailLabel = screen.getByTestId('my-profile-email-label');
          const passwordLabel = screen.getByTestId('my-profile-password-label');
          const nameLabel = screen.getByTestId('my-profile-name-label');
          expect(heading).toBeInTheDocument();
          expect(heading.textContent).toBe('Profile - ');
          expect(emailLabel.textContent).toBe('Email');
          expect(passwordLabel.textContent).toBe('Password');
          expect(nameLabel.textContent).toBe('Name');          
    });
  });
});

