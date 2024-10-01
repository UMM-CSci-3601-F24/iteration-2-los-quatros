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
})
