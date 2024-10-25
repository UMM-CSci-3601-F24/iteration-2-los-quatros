
describe('Grid Component', () => {
    beforeEach(() => {
      cy.visit('/grid');
    });

    it('should render the grid with default size', () => {
      cy.get('app-grid-component').within(() => {
        cy.get('mat-grid-tile').should('have.length', 100);
      });
    });
  });

  describe('Grid Component Expansion Panel', () => {
    it('should open the expansion panel', () => {
      cy.visit('/grid');

      cy.get('mat-expansion-panel-header').click();

      cy.get('.mat-expansion-panel-body').should('be.visible');
    });
  });
