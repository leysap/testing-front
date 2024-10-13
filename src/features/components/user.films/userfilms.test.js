import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import UserFilms from './UserFilms'; 
import { useFilms } from '../../hooks/use.films';
import { useUsers } from '../../hooks/use.users';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../hooks/use.films');
jest.mock('../../hooks/use.users');

describe('UserFilms component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useFilms.mockReturnValue({
      handleLoadFilms: jest.fn(),
    });

    useUsers.mockReturnValue({
      userFilms: [],
      token: null,
    });
  });

  test('renders correctly when no films are added', () => {
    render(
      <MemoryRouter>
        <UserFilms />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Sorry, you haven't added any film yet/i)).toBeInTheDocument();
  });

  test('renders film cards when user has films and token', () => {
    const mockFilms = [
      {
        id: 1,
        title: 'Film 1',
        poster: {
          url: 'https://example.com/poster1.jpg',
        },
      },
      {
        id: 2,
        title: 'Film 2',
        poster: {
          url: 'https://example.com/poster2.jpg',
        },
      },
    ];

    useUsers.mockReturnValue({
      userFilms: mockFilms,
      token: 'valid-token',
    });

    render(
      <MemoryRouter>
        <UserFilms />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Film 1')).toBeInTheDocument();
    expect(screen.getByText('Film 2')).toBeInTheDocument();
  });

  test('calls handleLoadFilms on component mount', () => {
    const mockHandleLoadFilms = jest.fn(); 
    
    useFilms.mockReturnValue({
      handleLoadFilms: mockHandleLoadFilms,
    });
    

    render(
      <MemoryRouter>
        <UserFilms />
      </MemoryRouter>
    );
    
    // Verificar que se llama a handleLoadFilms
    expect(mockHandleLoadFilms).toHaveBeenCalled();
  });
});
