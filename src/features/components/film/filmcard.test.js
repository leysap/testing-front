import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'; 
import { FilmCard } from './FilmCard';

describe('FilmCard component', () => {
  const mockItem = {
    id: '1',
    title: 'Pulp Fiction',
    poster: {
      url: '/pulp-fiction.jpg',
    },
  };

  test('renders the image with correct src, alt, width, and height', () => {
    render(
      <Router>
        <FilmCard item={mockItem} />
      </Router>
    );

    const image = screen.getByAltText(mockItem.title);

    // Verifica que la imagen esté en el documento
    expect(image).toBeInTheDocument();

    // Verifica el atributo src
    expect(image).toHaveAttribute('src', mockItem.poster.url);

    // Verifica el atributo width y height
    expect(image).toHaveAttribute('width', '150');
    expect(image).toHaveAttribute('height', '250');
  });

  test('renders the correct title', () => {
    render(
      <Router>
        <FilmCard item={mockItem} />
      </Router>
    );

    // Verifica que el título esté en el documento
    const title = screen.getByText(mockItem.title);
    expect(title).toBeInTheDocument();
  });

  test('renders the correct link to the film detail page', () => {
    render(
      <Router>
        <FilmCard item={mockItem} />
      </Router>
    );

    const link = screen.getByRole('link');

    // Verifica que el enlace esté en el documento
    expect(link).toBeInTheDocument();

    // Verifica que el href del enlace sea correcto
    expect(link).toHaveAttribute('href', '/detail/' + mockItem.id);
  });
});
