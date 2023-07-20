describe('RoadComponent', () => {
    beforeEach(() => {
        cy.intercept('GET', 'http://localhost:5555/roads', { fixture: 'roads.json' });
        cy.intercept('GET', 'http://localhost:5555/sensors', { fixture: 'sensors.json' });
        cy.intercept('GET', 'http://localhost:5555/sensors/0', { fixture: 'sensors/sensor0.json' });
        cy.intercept('GET', 'http://localhost:5555/roads/1', { fixture: 'roads/road1.json' });
        cy.visit('http://localhost:3000/roads');
    });

    it('displays the road data in the grid', () => {
        cy.get('.DataGrid').should('be.visible');

        for (let i = 1; i <= 5; i++) {
            cy.get(`[aria-colindex="${i}"] > .MuiDataGrid-columnHeaderDraggableContainer > .MuiDataGrid-columnHeaderTitleContainer > .MuiDataGrid-columnHeaderTitleContainerContent > .MuiDataGrid-columnHeaderTitle`).should("exist");
        }

        // Test the 5 rows
        cy.get('.MuiDataGrid-row').should('have.length', 5);

        // Test the search bar
        cy.get('#\\:r1\\:').type('Rivoli');
        cy.get('.MuiDataGrid-row').should('have.length', 3);
    });

    it('displays the map with the road and sensor data', () => {
        cy.get('.PrivateSwitchBase-input').click();

        cy.get('.leaflet-marker-icon').should('have.length', 6);
        cy.get('.leaflet-marker-icon').first().click();
        cy.get('.leaflet-popup-content > a').click();


    });
});