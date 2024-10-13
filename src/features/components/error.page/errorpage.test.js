import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import ErrorPage from './ErrorPage';

describe('ErrorPage component', () => {
  it('renders the image with correct src and alt text', () => {
    render(<ErrorPage />);

    // Selecciona la imagen por su alt text
    const image = screen.getByAltText('Vincent from Pulp Fiction');

    // Comprueba que la imagen este en el documento
    expect(image).toBeInTheDocument();

    // Verifica el atributo src
    expect(image).toHaveAttribute('src', '/vincent.gif');

    // Verifica el atributo width y height
    expect(image).toHaveAttribute('width', '300');
    expect(image).toHaveAttribute('height', '300');
  });

  it('applies the correct CSS class from the module', () => {
    const { container } = render(<ErrorPage />);

    // Verifica que el div padre tenga la clase correcta
    const divElement = container.firstChild;
    // Esto comprueba que la clase 'image' ha sido aplicada
    expect(divElement).toHaveClass('image'); 
  });
});
