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

  // a bunch of tests for filtering and sorting gb2

  it('should click add word group and go to right url', () => {
    page.addWordButton().click();
    cy.url().should(url => expect(url.endsWith('/anagram/new')).to.be.true);
    cy.get('.add-word-title').should('have.text', 'New Word Group');
  });
});
