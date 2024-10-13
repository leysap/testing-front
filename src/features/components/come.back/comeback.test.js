import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ComeBack } from './ComeBack';
import '@testing-library/jest-dom/extend-expect';

describe('ComeBack Component', () => {
  it('debería renderizar el componente con el ícono de home y el enlace a "/"', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <ComeBack />
      </BrowserRouter>
    );

    // Verificar que el enlace esté presente y apunta a "/"
    const linkElement = getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/');

    // Verificar que el enlace (que contiene el ícono) esté en el documento
    expect(linkElement).toBeInTheDocument();
  });
});
