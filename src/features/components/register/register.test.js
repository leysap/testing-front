import '@testing-library/jest-dom/extend-expect'; 
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register'; 
import { useUsers } from '../../hooks/use.users'; 
import Swal from 'sweetalert2';

jest.mock('../../hooks/use.users');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(), 
}));

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('renders the Register component', () => {
    useUsers.mockReturnValue({ handleRegisterUser: jest.fn() });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/User Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
  });

  test('shows error alert when fields are empty', async () => {
    useUsers.mockReturnValue({ handleRegisterUser: jest.fn() });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'REGISTER ERROR',
          text: 'Try again please',
        })
      );
    });
  });

  test('submits the form and shows success alert', async () => {
    const mockHandleRegisterUser = jest.fn();
    useUsers.mockReturnValue({ handleRegisterUser: mockHandleRegisterUser });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.input(screen.getByLabelText(/User Name:/i), { target: { value: 'Jenny' } });
    fireEvent.input(screen.getByLabelText(/Email:/i), { target: { value: 'jenny@example.com' } });
    fireEvent.input(screen.getByLabelText(/Password:/i), { target: { value: 'pass1234' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockHandleRegisterUser).toHaveBeenCalledWith({
        userName: 'Jenny',
        email: 'jenny@example.com',
        password: 'pass1234',
      });
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'WELCOME TO FILMS',
          text: 'Redirecting to login process',
        })
      );
    });
  });
});
