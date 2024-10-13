import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import List from './List';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useFilms } from '../../hooks/use.films';
import { useUsers } from '../../hooks/use.users';
import '@testing-library/jest-dom/extend-expect'; 
import Swal from 'sweetalert2';

jest.mock('../../hooks/use.films', () => ({
  useFilms: jest.fn(),
}));

jest.mock('../../hooks/use.users', () => ({
  useUsers: jest.fn(),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

// Configuración del router y el mock de los hooks
const renderWithRouter = (initialRoute = '/') => {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<div>Create Film</div>} />
        <Route path="/myfilms" element={<div>My Films</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('List component', () => {
  let filmsMock, useFilmsMock, useUsersMock;

  beforeEach(() => {
    filmsMock = [
      { id: 1, title: 'Film 1', description: 'Description 1', poster: { url: 'http://example.com/film1.jpg' } },
      { id: 2, title: 'Film 2', description: 'Description 2', poster: { url: 'http://example.com/film2.jpg' } },
    ];

    // Mock de los hooks
    useFilmsMock = {
      films: filmsMock,
      handleLoadFilms: jest.fn(),
    };

    useUsersMock = {
      handleLogoutUser: jest.fn(),
      token: 'mockToken',
      currentUser: 'John Doe',
    };

    useFilms.mockReturnValue(useFilmsMock);
    useUsers.mockReturnValue(useUsersMock);
  });

  test('renders the list component correctly when user is logged in', () => {
    renderWithRouter();

    // Verifica que los elementos de la interfaz estén presentes
    expect(screen.getByText("Hi John Doe")).toBeInTheDocument();
    expect(screen.getByText("ADD A FILM")).toBeInTheDocument();
    expect(screen.getByText("YOUR FILMS")).toBeInTheDocument();
    expect(screen.getByText("LOG OUT")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "ADD A FILM" })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "YOUR FILMS" })).toBeInTheDocument();
  });

  test('loads and displays films correctly', async () => {
    renderWithRouter();

    // Verifica que las películas se han cargado correctamente
    await waitFor(() => {
      expect(screen.getByText('Film 1')).toBeInTheDocument();
      expect(screen.getByText('Film 2')).toBeInTheDocument();
      expect(screen.getByAltText('Film 1')).toBeInTheDocument();  // Verifica que la imagen se muestra
      expect(screen.getByAltText('Film 2')).toBeInTheDocument(); 
    });

    // Verifica que se haya llamado a handleLoadFilms
    expect(useFilmsMock.handleLoadFilms).toHaveBeenCalled();
  });

  test('navigates to the create film page when the "ADD A FILM" button is clicked', () => {
    renderWithRouter();

    const addFilmButton = screen.getByRole('button', { name: /ADD A FILM/ });
    fireEvent.click(addFilmButton);

    // Verifica que la navegación se ha realizado correctamente
    expect(screen.getByText('Create Film')).toBeInTheDocument();
  });

  test('navigates to the my films page when the "YOUR FILMS" button is clicked', () => {
    renderWithRouter();

    const myFilmsButton = screen.getByRole('button', { name: /YOUR FILMS/ });
    fireEvent.click(myFilmsButton);

    // Verifica que la navegación se ha realizado correctamente
    expect(screen.getByText('My Films')).toBeInTheDocument();
  });

  test('logs out the user and shows a Swal confirmation when the "LOG OUT" button is clicked', async () => {
    renderWithRouter();

    const logoutButton = screen.getByRole('button', { name: /LOG OUT/ });
    fireEvent.click(logoutButton);

    // Verifica que Swal.fire fue llamado
    expect(Swal.fire).toHaveBeenCalledWith({
      width: '20em',
      title: 'SEE YOU SOON',
      text: 'Enjoy your films',
      background: 'linear-gradient(to right, rgba(20, 20, 20), rgba(0, 0, 0))',
      color: 'red',
      showConfirmButton: false,
      padding: '4em 0',
      timer: 2000,
    });

    // Verifica que handleLogoutUser fue llamado
    expect(useUsersMock.handleLogoutUser).toHaveBeenCalled();
  });

  test('does not render user controls when there is no token', () => {
    // Mock de un usuario sin token
    useUsers.mockReturnValue({
      handleLogoutUser: jest.fn(),
      token: null,
      currentUser: null,
    });

    renderWithRouter();

    // Verifica que los controles del usuario no se renderizan
    expect(screen.queryByText("Hi")).toBeNull();
    expect(screen.queryByText("ADD A FILM")).toBeNull();
    expect(screen.queryByText("YOUR FILMS")).toBeNull();
  });
});
