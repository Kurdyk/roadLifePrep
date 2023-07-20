import jwtDecode from "jwt-decode";

describe('UsersComponent', () => {

    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:5555/users', { fixture: 'users.json' });
        cy.intercept('POST', 'http://localhost:4444/login', {fixture: 'login.json'})
      });

    it('renders the data grid correctly', () => {
        // Login first
        cy.visit('http://localhost:3000/auth');
    
        cy.get('#LoginWrapper').should('exist');
    
        // Fill in the login form inputs
        cy.get('input[placeholder="Mail"]').first().type('ll@ll.fr'); 
        cy.get('input[placeholder="Mot de passe"]').type('azerty');
    
        // Submit the login form
        cy.get('#LoginWrapper > .GenericForm > .ActionButtonGroup > .MuiButtonBase-root').click();

        cy.wait(1000);

        // Assert that the access token is stored in sessionStorage
        cy.window().then((window) => {
            const token = window.sessionStorage.getItem('token');
            expect(token).to.exist;
    
            // You can also decode the token and perform assertions on its contents
            const decodedToken = jwtDecode(token);
            expect(decodedToken.role).to.equal('collectivite');
        });

        cy.get('#NavBarButtonWrapper > :nth-child(4)').click();
            
        // Assuming the UsersComponent is rendered on the page
        cy.get('#UsersTableWrapper').should('exist');
        cy.wait(100);
        
        // Verify the number of columns in the data grid
        for (let i = 1; i <= 5; i++) {
            cy.get(`[aria-colindex="${i}"] > .MuiDataGrid-columnHeaderDraggableContainer > .MuiDataGrid-columnHeaderTitleContainer > .MuiDataGrid-columnHeaderTitleContainerContent > .MuiDataGrid-columnHeaderTitle`).should("exist");
        }
        cy.get('#\\:r1\\:').type('lv');

        cy.get('.MuiDataGrid-row').should('have.length', 1);
    });
});