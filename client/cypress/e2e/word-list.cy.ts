import { WordListPage } from "cypress/support/word-list.po";

const page = new WordListPage();

describe('Anagram Solver', () => {

  before(() => {
    cy.task('seed:database');
  })

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getAnagramTitle().should('have.text', 'Anagram Generator');
  });

  //tests can be uncommented after sorting and filtering are implemented
  // it('Should select sort by alphabetical and return sorted elements ', () => {
  //   cy.get("[data-test=sortTypeSelect]").click()
  //   cy.get('mat-option').contains("Alphabetical").click()
  // });
  // // it('Should select sort by alphabetical descending and return sorted elements', () => {

  // // });
  // it('Should type something in the contains field and return correct results', () => {
  //   cy.get('[data-test="wordContainsInput"]').type('k');
  //   // page.getWordListItems().should('have.lengthOf', 2);
  //   // page.getWordListItems().find('.anagram-list-word')
  //   //   .should('contain.text', "Jakob")
  //   //   .should('contains.text', "Keenan")
  //   //   .should('not.contain.text', "Nic")
  //   //   .should('not.contain.text', "El")
  //   //   .should('not.contain.text', "Mac");
  // })
})
