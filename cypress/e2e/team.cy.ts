import { COLLABORATORS } from '../../src/components/team/const';

describe('TeamPage', () => {

  
    it('displays the team members correctly', () => {

        cy.visit('http://localhost:3000/team'); 

        const numberOfCollaborators = COLLABORATORS.length;
    
        // Check if the TeamPageTitle has the correct text
        cy.get('#TeamPageTitle').should('have.text', "L'équipe RoadLife");
    
        // Check if there are the correct number of collaborator cards rendered on the page
        cy.get('.collaboratorCard').should('have.length', numberOfCollaborators);
    
        // Loop through each collaborator and check their details
        COLLABORATORS.forEach((collaborator, index) => {
            cy.get(`.collaboratorCard:nth-child(${index + 1})`).within(() => {
            // Check if the collaborator name is correct
            cy.get('.MuiCardHeader-title').should('have.text', collaborator.name);
    
            // Check if the collaborator image is visible and has the correct URL
            cy.get('img').should('exist').and('have.attr', 'src', collaborator.imgPath);
    
            // Check if the collaborator description is correct
            cy.get('.MuiCardContent-root').should('have.text', collaborator.description);
            });
        });
    });
});
  