import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FilmDetail from './FilmDetail'; 
import { useFilms } from '../../hooks/use.films';
import { useUsers } from '../../hooks/use.users';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'; 

jest.mock('../../hooks/use.films');
jest.mock('../../hooks/use.users');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const mockFilm = {
  id: '1',
  title: 'Test Film',
  genre: 'Drama',
  release: '2024',
  synopsis: 'This is a test film.',
  poster: { url: 'http://example.com/poster.jpg' },
};

beforeEach(() => {
  jest.clearAllMocks();

  useFilms.mockReturnValue({
    films: [mockFilm],
    handleDeleteFilm: jest.fn(),
  });

  useUsers.mockReturnValue({
    token: 'test-token', 
  });

  useParams.mockReturnValue({ id: '1' });
});

test('renders film details', () => {
  render(
    <MemoryRouter initialEntries={['/film/1']}>
      <FilmDetail />
    </MemoryRouter>
  );

  expect(screen.getByText(/Films/i)).toBeInTheDocument();
  expect(screen.getByText(mockFilm.title)).toBeInTheDocument();
  expect(screen.getByText(`(${mockFilm.genre})`)).toBeInTheDocument();
  expect(screen.getByText(`Released in ${mockFilm.release}`)).toBeInTheDocument();
  expect(screen.getByText(mockFilm.synopsis)).toBeInTheDocument();
});

test('shows edit and delete buttons when token is present', () => {
  render(
    <MemoryRouter initialEntries={['/film/1']}>
      <FilmDetail />
    </MemoryRouter>
  );

  expect(screen.getByText(/EDIT/i)).toBeInTheDocument();
  expect(screen.getByText(/DELETE/i)).toBeInTheDocument();
});

test('navigates to update page when edit button is clicked', () => {
  render(
    <MemoryRouter initialEntries={['/film/1']}>
      <Routes>
        <Route path="/film/1" element={<FilmDetail />} />
        <Route path="/update/1" element={<div>Update Page</div>} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText(/EDIT/i));
  expect(screen.getByText(/Update Page/i)).toBeInTheDocument();
});

test('calls handleDeleteFilm and shows success alert when delete button is clicked', async () => {
  const { handleDeleteFilm } = useFilms();

  jest.spyOn(Swal, 'fire').mockImplementation(() => Promise.resolve());

  render(
    <MemoryRouter initialEntries={['/film/1']}>
      <FilmDetail />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText(/DELETE/i));

  expect(handleDeleteFilm).toHaveBeenCalledWith(mockFilm.id);
  expect(Swal.fire).toHaveBeenCalledWith(
    expect.objectContaining({
      title: 'GREAT SUCCESS!!',
      text: 'The film has been deleted',
    })
  );
});

test('displays message when no token is present', () => {
  useUsers.mockReturnValue({
    token: null,
  });

  render(
    <MemoryRouter initialEntries={['/film/1']}>
      <FilmDetail />
    </MemoryRouter>
  );

  expect(screen.getByText(/filmers/i)).toBeInTheDocument();
});
