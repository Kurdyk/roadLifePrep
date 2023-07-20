describe('InterventionListComposant', () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:5111/interventions', { fixture: 'intervention.json' });
        for (let i = 0; i < 3; i++) {
            cy.intercept('GET', `http://localhost:5555/roads/${i}`, { fixture: `roads/road${i}.json` }).as(`getRoad${i}`);
        }
        cy.intercept('GET', 'http://localhost:5555/roads', { fixture: 'roads.json' })
        cy.intercept('POST', 'http://localhost:5111/interventions', (req) => {
            req.reply({
                status: 200,
              });
        });
    });
      

    it('render the data grid and filters', () => {
        cy.visit('http://localhost:3000/interventions');
    
        cy.get('#InterventionList').should('exist');
    
        // Assuming the component has a button to request a new intervention
        cy.get('button').should('exist').contains('Demander une intervention');  
        
        // Test the number of rows
        cy.get('.MuiDataGrid-row').should('have.length', 4);

        // Test the checkbox
        cy.get('.MuiCheckbox-root').should('have.length', 4);

        for (let i = 1; i < 5; i++) {
            const current = cy.get(`:nth-child(${i}) > .MuiButtonBase-root > .PrivateSwitchBase-input`)
            current.should('exist');
            current.click();
            cy.get('.MuiDataGrid-row').should('have.length', 1);
            current.click();
        }

        // Test date filter
        cy.get('#\\:r3\\:').type('02072023');
        cy.get('#\\:r7\\:').type('06072023');
        cy.get('.MuiDataGrid-row').should('have.length', 2);

        // Test search bar
        cy.get('#\\:r1\\:').type('Rivoli');
        cy.get('.MuiDataGrid-row').should('have.length', 1);
    });

    it('Test new intervention', () => {
        cy.visit('http://localhost:3000/newIntervention');

        // Test the form
        cy.get('.MuiAutocomplete-endAdornment > .MuiButtonBase-root').click();
        cy.get('#\\:r1\\:-option-1').click();

        cy.get(':nth-child(2) > .MuiInputBase-root').type('A beautiful description');
        cy.get(':nth-child(3) > .MuiInputBase-root').type('Jean');
        cy.get(':nth-child(4) > .MuiInputBase-root').type('Dupont');
        cy.get(':nth-child(5) > .MuiInputBase-root').type('jeandupont@hotmail.fr');

        cy.get('.ActionButtonGroup > .MuiButtonBase-root').click();
        cy.url().should('eq', 'http://localhost:3000/interventions');
    });
});
  