import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../../../public/Login/Login';
import { doLogin } from '../../../services/AuthService';

// Mock do serviço de login
jest.mock('../../../services/AuthService');

describe('Login Component', () => {
  beforeEach(() => {
    doLogin.mockClear();
  });

  it('renders the login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText(/Your Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it('displays an error message when login fails', async () => {
    doLogin.mockRejectedValueOnce(new Error('Invalid user and/or password!'));

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Your Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Your Password/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => {
      expect(screen.getByText('Invalid user and/or password!')).toBeInTheDocument();
    });
  });

  it('redirects to dashboard on successful login', async () => {
    const mockNavigate = jest.fn();
    doLogin.mockResolvedValueOnce({ token: 'fakeToken' });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Your Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Your Password/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByText(/Sign In/i));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fakeToken');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
