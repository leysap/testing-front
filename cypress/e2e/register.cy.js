describe('Register Component', () => {
    beforeEach(() => {
      // Visita la página de registro en localhost:5173
      cy.visit('http://localhost:5173/register');
    });
  
    it('should display the registration form', () => {
      cy.get('form[aria-label="form"]').should('exist');  // Verifica que el formulario exista
      cy.get('input[name="user"]').should('be.visible');  // Verifica el campo de nombre de usuario
      cy.get('input[name="email"]').should('be.visible');  // Verifica el campo de correo electrónico
      cy.get('input[name="password"]').should('be.visible');  // Verifica el campo de contraseña
      cy.get('button[type="submit"]').contains('Sign Up');  // Verifica el botón de registro
    });
  
    it('should show error when trying to register with empty fields', () => {
      // Dejar los campos vacíos y enviar el formulario
      cy.get('form').submit();
  
      // Verificar que aparece el modal de error de SweetAlert
      cy.get('.swal2-title').should('contain', 'REGISTER ERROR');
      cy.get('.swal2-content').should('contain', 'Try again please');
      
      // Asegurar que la URL no cambia
      cy.url().should('eq', 'http://localhost:5173/register');
    });
  
    it('should successfully register a user with valid data', () => {
      // Llenar el formulario con datos válidos
      cy.get('input[name="user"]').type('newUser');
      cy.get('input[name="email"]').type('newuser@example.com');
      cy.get('input[name="password"]').type('securePassword');
  
      // Simular el envío del formulario
      cy.get('form').submit();
      
      // Verificar que aparece el modal de éxito de SweetAlert
      cy.get('.swal2-title').should('contain', 'WELCOME TO FILMS');
      cy.get('.swal2-content').should('contain', 'Redirecting to login process');
  
      // Verificar la redirección al login
      cy.url().should('include', '/login');
    });
  
    it('should show an error if any field is left blank', () => {
      // Llenar el formulario solo con el nombre de usuario
      cy.get('input[name="user"]').type('newUser');
      
      // Dejar email y contraseña vacíos
      cy.get('form').submit();
  
      // Verificar que aparece el modal de error de SweetAlert
      cy.get('.swal2-title').should('contain', 'REGISTER ERROR');
      cy.get('.swal2-content').should('contain', 'Try again please');
  
      cy.url().should('eq', 'http://localhost:5173/register');
    });
  });
  