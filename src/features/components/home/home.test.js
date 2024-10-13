import '@testing-library/jest-dom/extend-expect'; 
import { render, screen } from '@testing-library/react';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';

describe('Home component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  });

  test('renders the home component correctly', () => {
    // Verifica que el título 'Films' esté presente en el componente Header (h1)
    const filmsHeader =screen.getByRole("heading", { name: "Films" });
    expect(filmsHeader).toBeInTheDocument();

    // Verifica que el subtítulo 'Feel your films' esté presente en el Header (h2)
    const filmsSubtitle = screen.getByText('Feel your films');
    expect(filmsSubtitle).toBeInTheDocument();

    // Verifica que el mensaje introductorio esté presente
    const introMessage = screen.getByText(
      'Welcome to a unique place where you can express your feelings about the films you have watched, and share them with the whole world. Remember that the only condition to express your emotions is by using a single unique sentence.'
    );
    expect(introMessage).toBeInTheDocument();
  });

  test('renders the "Films" link and navigates to the films list', () => {
    // Verifica que el enlace "Films" esté presente (en la lista de films dentro del div 'films')
    const filmsLink = screen.getByText('Films', { selector: 'a' });
    expect(filmsLink).toBeInTheDocument();

    // Verifica que el enlace funcione correctamente (redirige a '/list')
    expect(filmsLink).toHaveAttribute('href', '/list');
  });

  test('renders the film reel icon link', () => {
    // Verifica que el ícono del carrete de película (react-icons) esté presente
    const reelIcon = screen.getByLabelText('Access to the list of films clicking in this icon button.');
    expect(reelIcon).toBeInTheDocument();

    // Verifica que el ícono funcione correctamente (redirige a '/list')
    expect(reelIcon.closest('a')).toHaveAttribute('href', '/list');
  });

  test('renders the "create your account" link', () => {
    // Verifica que el enlace "create your account" esté presente
    const registerLink = screen.getByRole('link', { name: /create your account here/i });
    expect(registerLink).toBeInTheDocument();

    // Verifica que el enlace funcione correctamente (redirige a '/register')
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('renders the "Login" button', () => {
    // Verifica que el botón "Login" esté presente
    const loginButton = screen.getByRole('link', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    // Verifica que el enlace funcione correctamente (redirige a '/login')
    expect(loginButton).toHaveAttribute('href', '/login');
  });
});
