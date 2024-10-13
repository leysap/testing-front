import '@testing-library/jest-dom/extend-expect'; 
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateOrEditFilm from './CreateOrEditFilm';
import { useFilms } from '../../hooks/use.films';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../../hooks/use.films');

const mockHandleCreateFilm = jest.fn();
const mockHandleUpdateFilm = jest.fn();
const mockHandleLoadFilms = jest.fn();
const mockFilms = [
  {
    id: '1',
    title: 'Film 1',
    release: '2023',
    genre: 'Action',
    synopsis: 'Synopsis for Film 1',
  },
];

beforeEach(() => {
  useFilms.mockReturnValue({
    handleCreateFilm: mockHandleCreateFilm,
    handleUpdateFilm: mockHandleUpdateFilm,
    films: mockFilms,
    handleLoadFilms: mockHandleLoadFilms,
  });
});

afterEach(() => {
  jest.clearAllMocks(); 
});

test('renders the form for creating a new film', () => {
  render(
    <MemoryRouter initialEntries={['/create']}>
      <Routes>
        <Route path="/create" element={<CreateOrEditFilm />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Year of release/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Select a genre/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Synopsis/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Add a poster/i)).toBeInTheDocument();
});


test('renders the form for editing an existing film', async () => {
  render(
    <MemoryRouter initialEntries={['/edit/1']}>
      <Routes>
        <Route path="/edit/:id" element={<CreateOrEditFilm />} />
      </Routes>
    </MemoryRouter>
  );

  mockHandleLoadFilms();

  await waitFor(() => {
    expect(screen.getByLabelText(/Title/i).value).toBe('Film 1');
    expect(screen.getByLabelText(/Year of release/i).value).toBe('2023');
    expect(screen.getByLabelText(/Select a genre/i).value).toBe('Action');
    expect(screen.getByLabelText(/Synopsis/i).value).toBe('Synopsis for Film 1');
  });
});

test('submits the form to update an existing film', async () => {
  render(
    <MemoryRouter initialEntries={['/edit/1']}>
      <Routes>
        <Route path="/edit/:id" element={<CreateOrEditFilm />} />
      </Routes>
    </MemoryRouter>
  );

  mockHandleLoadFilms();

  fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Film' } });
  fireEvent.change(screen.getByLabelText(/Year of release/i), { target: { value: '2025' } });
  fireEvent.change(screen.getByLabelText(/Select a genre/i), { target: { value: 'Comedy' } });
  fireEvent.change(screen.getByLabelText(/Synopsis/i), { target: { value: 'Updated synopsis for Film 1' } });

  expect(screen.queryByLabelText(/Add a poster/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByText(/Save Changes/i));

  await waitFor(() => {
    expect(mockHandleUpdateFilm).toHaveBeenCalledTimes(1);
  });
});
