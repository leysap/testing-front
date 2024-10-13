import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { useUsers } from '../../hooks/use.users';
import '@testing-library/jest-dom/extend-expect'; 
import Swal from 'sweetalert2';

jest.mock('../../hooks/use.users');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  const mockHandleLoginUser = jest.fn();

  beforeEach(() => {
    useUsers.mockReturnValue({
      handleLoginUser: mockHandleLoginUser,
      isError: null,
    });
    jest.clearAllMocks();
  });

  it('should render the login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Verifica que el formulario y sus elementos se renderizan correctamente
    expect(screen.getByLabelText(/user/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should submit the form and call handleLoginUser', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula el ingreso de datos en el formulario
    fireEvent.change(screen.getByLabelText(/user/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Simula el envío del formulario
    fireEvent.submit(screen.getByRole('form'));

    // Verifica que se haya llamado a la función handleLoginUser con los datos correctos
    await waitFor(() =>
      expect(mockHandleLoginUser).toHaveBeenCalledWith({
        user: 'testUser',
        password: 'password123',
      })
    );
  });

  it('should show success alert and navigate to /list on successful login', async () => {
    useUsers.mockReturnValue({
      handleLoginUser: mockHandleLoginUser,
      isError: false, // Simula un inicio de sesión exitoso
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula el envío del formulario
    fireEvent.submit(screen.getByRole('form'));

    // Espera a que se muestre el alert de éxito
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
        title: 'LOGIN SUCCESS!',
        icon: 'success',
      }))
    );

    // Verifica que se haya llamado a navigate con la ruta correcta
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/list')
    );
  });

  it('should show error alert on login failure', async () => {
    useUsers.mockReturnValue({
      handleLoginUser: mockHandleLoginUser,
      isError: true, // Simula un error de inicio de sesión
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula el envío del formulario
    fireEvent.submit(screen.getByRole('form'));

    // Espera a que se muestre el alert de error
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
        title: 'ERROR',
        icon: 'error',
      }))
    );
  });
});
