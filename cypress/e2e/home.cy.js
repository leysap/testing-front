describe('Home Component', () => {
    beforeEach(() => {
      // Visita la página de inicio en localhost:5173
      cy.visit('http://localhost:5173');
    });
  
    it('should display the header with correct title and subtitle', () => {
      // Verifica que el título y el subtítulo estén visibles en el Header
      cy.get('h1').should('contain', 'Films');
      cy.get('h2').should('contain', 'Feel your films');
    });
  
    it('should display the welcome message', () => {
      // Verifica que el mensaje de bienvenida esté presente
      cy.get('.intro').should('contain', 'Welcome to a unique place where you can express your feelings');
    });
  
    it('should navigate to the films list when clicking on the films link', () => {
      // Verifica que el enlace para la lista de películas funcione correctamente
      cy.get('a[href="/list"]').first().click();
  
      // Verifica que la URL haya cambiado a la página de lista de películas
      cy.url().should('include', '/list');
    });
  
    it('should navigate to the films list when clicking the film reel icon', () => {
      // Verifica que al hacer clic en el icono de "film reel" navegue a la lista de películas
      cy.get('a[aria-label="Access to the list of films clicking in this icon button."]').click();
  
      // Verifica que la URL haya cambiado a la página de lista de películas
      cy.url().should('include', '/list');
    });
  
    it('should navigate to the registration page when clicking on the register link', () => {
      // Verifica que el enlace para registrarse funcione correctamente
      cy.get('a[href="/register"]').click();
  
      // Verifica que la URL haya cambiado a la página de registro
      cy.url().should('include', '/register');
    });
  
    it('should navigate to the login page when clicking the login button', () => {
      // Verifica que el botón de login funcione correctamente
      cy.get('button').contains('Login').click();
  
      // Verifica que la URL haya cambiado a la página de login
      cy.url().should('include', '/login');
    });
  });
  