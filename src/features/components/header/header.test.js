import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { Header } from './Header';

describe('Header component', () => {
  const mockTitle = 'Welcome to the Movie App';
  const mockSubtitle = 'Explore your favorite movies';

  test('renders the title and subtitle correctly', () => {
    render(
      <Router>
        <Header title={mockTitle} subtitle={mockSubtitle} />
      </Router>
    );

    // Verifica que el título esté en el documento
    const titleElement = screen.getByText(mockTitle);
    expect(titleElement).toBeInTheDocument();

    // Verifica que el subtítulo esté en el documento
    const subtitleElement = screen.getByText(mockSubtitle);
    expect(subtitleElement).toBeInTheDocument();
  });

  test('renders the link to the homepage', () => {
    render(
      <Router>
        <Header title={mockTitle} subtitle={mockSubtitle} />
      </Router>
    );

    // Verifica que el enlace esté en el documento
    const linkElement = screen.getByRole('link', { name: mockTitle });
    expect(linkElement).toBeInTheDocument();

    // Verifica que el enlace redirija a la página principal
    expect(linkElement).toHaveAttribute('href', '/');
  });

  test('applies the correct CSS class to the header', () => {
    const { container } = render(
      <Router>
        <Header title={mockTitle} subtitle={mockSubtitle} />
      </Router>
    );

    // Verifica que el header tenga la clase correcta
    const headerElement = container.querySelector('header');
    expect(headerElement).toHaveClass('header'); 
  });
});
