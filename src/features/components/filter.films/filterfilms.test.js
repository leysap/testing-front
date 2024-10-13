import { render, screen, fireEvent } from '@testing-library/react';
import { FilterFilms } from './FilterFilms';
import { useFilms } from '../../hooks/use.films';
import '@testing-library/jest-dom/extend-expect'; 

jest.mock('../../hooks/use.films');

describe('FilterFilms component', () => {
  const mockHandleLoadFilms = jest.fn();
  const mockHandleLoadFiltered = jest.fn();
  const mockHandlePaging = jest.fn();

  beforeEach(() => {
    useFilms.mockReturnValue({
      handleLoadFilms: mockHandleLoadFilms,
      handleLoadFiltered: mockHandleLoadFiltered,
      handlePaging: mockHandlePaging,
      next: 'next-url',
      previous: 'previous-url',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the FilterFilms component', () => {
    render(<FilterFilms />);
    expect(screen.getByText('Show All')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /</ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: />/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should call handleLoadFilms when "Show All" button is clicked', () => {
    render(<FilterFilms />);
    fireEvent.click(screen.getByText('Show All'));
    expect(mockHandleLoadFilms).toHaveBeenCalled();
  });

  it('should call handlePaging with next/previous URL on button clicks', () => {
    render(<FilterFilms />);
    
    // Click en "next" button
    fireEvent.click(screen.getByRole('button', { name: />/ }));
    expect(mockHandlePaging).toHaveBeenCalledWith('next-url');
    
    // Click en "previous" button
    fireEvent.click(screen.getByRole('button', { name: /</ }));
    expect(mockHandlePaging).toHaveBeenCalledWith('previous-url');
  });

  it('should not call handlePaging when next/previous URLs are null', () => {
    // Simula la ausencia de next y previous URLs
    useFilms.mockReturnValueOnce({
      handleLoadFilms: mockHandleLoadFilms,
      handleLoadFiltered: mockHandleLoadFiltered,
      handlePaging: mockHandlePaging,
      next: null,
      previous: null,
    });

    render(<FilterFilms />);

    // Intenta hacer clic en el botón "next"
    fireEvent.click(screen.getByRole('button', { name: />/ }));
    expect(mockHandlePaging).not.toHaveBeenCalled();

    // Intenta hacer clic en el botón "previous"
    fireEvent.click(screen.getByRole('button', { name: /</ }));
    expect(mockHandlePaging).not.toHaveBeenCalled();
  });

  it('should call handleLoadFiltered when a genre is selected', () => {
    render(<FilterFilms />);
    const genreSelect = screen.getByRole('combobox');

    // Change to 'Action' genre
    fireEvent.change(genreSelect, { target: { value: 'Action' } });
    expect(mockHandleLoadFiltered).toHaveBeenCalledWith('genre=Action');

    // Change to 'Drama' genre
    fireEvent.change(genreSelect, { target: { value: 'Drama' } });
    expect(mockHandleLoadFiltered).toHaveBeenCalledWith('genre=Drama');
  });

  it('should not call handleLoadFiltered if the selected element name is not "genre"', () => {
    render(<FilterFilms />);

    // Simula un cambio en el select pero con un evento que no es de "genre"
    const fakeEvent = { target: { name: 'not-genre', value: 'some-value' } };
    fireEvent.change(screen.getByRole('combobox'), fakeEvent);

    // Verifica que no se ha llamado a handleLoadFiltered
    expect(mockHandleLoadFiltered).not.toHaveBeenCalled();
  });

  it('should call handleLoadNext and handleLoadPrevious with correct URLs', () => {
    render(<FilterFilms />);

    // Llama a handleLoadNext
    fireEvent.click(screen.getByRole('button', { name: />/ }));
    expect(mockHandlePaging).toHaveBeenCalledWith('next-url');

    // Llama a handleLoadPrevious
    fireEvent.click(screen.getByRole('button', { name: /</ }));
    expect(mockHandlePaging).toHaveBeenCalledWith('previous-url');
  });

  it('should not call handleLoadNext if next URL is null', () => {
    // Simula un valor nulo para next URL
    useFilms.mockReturnValueOnce({
      handleLoadFilms: mockHandleLoadFilms,
      handleLoadFiltered: mockHandleLoadFiltered,
      handlePaging: mockHandlePaging,
      next: null,
      previous: 'previous-url',
    });

    render(<FilterFilms />);

    // Clic en el botón next, pero no debería hacer nada porque next es null
    fireEvent.click(screen.getByRole('button', { name: />/ }));
    expect(mockHandlePaging).not.toHaveBeenCalled();
  });

  it('should not call handleLoadPrevious if previous URL is null', () => {
    // Simula un valor nulo para previous URL
    useFilms.mockReturnValueOnce({
      handleLoadFilms: mockHandleLoadFilms,
      handleLoadFiltered: mockHandleLoadFiltered,
      handlePaging: mockHandlePaging,
      next: 'next-url',
      previous: null,
    });

    render(<FilterFilms />);

    // Clic en el botón previous, pero no debería hacer nada porque previous es null
    fireEvent.click(screen.getByRole('button', { name: /</ }));
    expect(mockHandlePaging).not.toHaveBeenCalled();
  });
});
