import jwtDecode from "jwt-decode";

describe('LoginComponent', () => {

    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:4444/login', {fixture: 'login.json'})
        cy.intercept('POST', 'http://localhost:4444/register', {fixture: 'register.json'})
    });

    it('logs in successfully and obtains the access token', () => {
      cy.visit('http://localhost:3000/auth');
  
      // Assuming the LoginComponent is rendered on the page
      cy.get('#LoginWrapper').should('exist');
  
      // Fill in the login form inputs
      cy.get('input[placeholder="Mail"]').first().type('ll@ll.fr'); 
      cy.get('input[placeholder="Mot de passe"]').type('azerty');
  
      // Submit the login form
      cy.get('#LoginWrapper > .GenericForm > .ActionButtonGroup > .MuiButtonBase-root').click();
      cy.url().should('eq', 'http://localhost:3000/accueil');

      // Assert that the access token is stored in sessionStorage
      cy.then(() => {

        const token = window.sessionStorage.getItem('token');
        expect(token).to.exist;
  
        // You can also decode the token and perform assertions on its contents
        const decodedToken = jwtDecode(token);
        expect(decodedToken.role).to.equal('collectivite');
      });
  
        // Assert that the user is redirected to the home page     
        
        cy.get('#NavBarButtonWrapper > :nth-child(4)').should('exist');
        cy.get('#NavBarButtonWrapper > :nth-child(3)').click();

        cy.url().should('eq', 'http://localhost:3000/accueil');

    });

    it('register successfully and obtains the access token', () => {
        cy.visit('http://localhost:3000/auth');
  
        // Assuming the LoginComponent is rendered on the page
        cy.get('#LoginWrapper > .GenericForm > .MuiToggleButtonGroup-root > [value="register"]').click();
        cy.get('#RegisterWrapper').should('exist');
        
        // Fill in the login form inputs
        cy.get('#RegisterWrapper > .GenericForm > .FormGroup > .InputsRows > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input').type("Jean");
        cy.get('#RegisterWrapper > .GenericForm > .FormGroup > .InputsRows > :nth-child(2) > .MuiInputBase-root > .MuiInputBase-input').type("Dupont");
        cy.get(':nth-child(3) > .MuiInputBase-root > .MuiInputBase-input').type("ll@ll.fr")
        cy.get(':nth-child(4) > .MuiInputBase-root > .MuiInputBase-input').type("1Az€rty0");  
        // Submit the register form
        cy.get('#RegisterWrapper > .GenericForm > .ActionButtonGroup > .MuiButtonBase-root').click();
        cy.url().should('eq', 'http://localhost:3000/accueil');

        cy.then(() => {

            const token = window.sessionStorage.getItem('token');
            expect(token).to.exist;

            // You can also decode the token and perform assertions on its contents
            const decodedToken = jwtDecode(token);
            expect(decodedToken.role).to.equal('particulier');
        });
    
          // Assert that the user is redirected to the home page     
          cy.get('#NavBarButtonWrapper > :nth-child(3)').click();
  
          cy.url().should('eq', 'http://localhost:3000/accueil');
  
    });
});
  