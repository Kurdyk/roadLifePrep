describe('SensorComponent', () => {

    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:5555/sensors/0', { fixture: 'sensors/sensor0.json' });
        cy.intercept('GET', 'http://localhost:5555/roads/1', { fixture: 'roads/road1.json' });
    });

    it('should display sensor presentation and graph', () => {
      // Visit the page
      cy.visit('http://localhost:3000/sensor/0');
  
      // Wait for the data to load
      cy.get('#SensorWrapper').should('not.contain', 'CircularProgress');
  
      // Assert the sensor presentation
      cy.get('#Adress').should('be.visible');
      cy.get('#WearInfo').should('be.visible');
  
      // Assert the sensor graph and selector
      cy.get('#SensorGraphAndSelectorWrapper').should('be.visible');
      cy.get('#DataTypeSelection').should('be.visible');
      cy.get('#TimeScaleSelector').should('be.visible');
  
      // Toggle data type
      cy.get('#DataTypeSelection').contains('Usage').click();
  
      // Change time scale
      cy.get('.MuiSelect-select').click(); 
      cy.get('[data-value="Mois"]').click();

      // Assert the graph
      cy.get('#SensorGraphAndScale').should('be.visible');
      // Add more assertions as needed
  
      // Assert the map
      cy.get('#SensorMap').should('be.visible');
      // Add assertions for map markers and lines as needed
    });
  });
  