describe('Login Component', () => {
    beforeEach(() => {
      // Visita la aplicación en localhost:5173
      cy.visit('http://localhost:5173/login');
    });
  
    it('should display the login form', () => {
      cy.get('form[aria-label="form"]').should('exist');  // Verifica que el formulario exista
      cy.get('input[name="user"]').should('be.visible');  // Verifica el campo de usuario
      cy.get('input[name="password"]').should('be.visible');  // Verifica el campo de contraseña
      cy.get('button[role="button"]').contains('Send');  // Verifica el botón de envío
    });
  
    it('should successfully log in with correct credentials', () => {
      cy.get('input[name="user"]').type('validUser');
      cy.get('input[name="password"]').type('validPassword');
      
      // Simular el envío del formulario
      cy.get('form').submit();
      
      // Verificar que aparece el modal de éxito de SweetAlert
      cy.get('.swal2-title').should('contain', 'LOGIN SUCCESS!');
      cy.get('.swal2-content').should('contain', 'Redirecting to the list of films');
      
      // Verificar la redirección a la lista de películas
      cy.url().should('include', '/list');
    });
  
    it('should show error on invalid credentials', () => {
      // Simular el llenado del formulario con credenciales inválidas
      cy.get('input[name="user"]').type('invalidUser');
      cy.get('input[name="password"]').type('invalidPassword');
      
      // Simular el envío del formulario
      cy.get('form').submit();
      
      // Verificar que aparece el modal de error de SweetAlert
      cy.get('.swal2-title').should('contain', 'ERROR');
      cy.get('.swal2-content').should('contain', 'INVALID USERNAME OR PASSWORD');
      
      // Asegurar que la URL no cambia
      cy.url().should('eq', 'http://localhost:5173/login');
    });
  });
  