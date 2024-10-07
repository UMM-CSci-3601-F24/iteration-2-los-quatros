export class WordListPage {
  private readonly baseUrl = '/anagram';
  private readonly pageTitle = '.word-list-title';
  private readonly addWordButtonSelector = '[data-test=addWordButton]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getAnagramTitle() {
    return cy.get(this.pageTitle);
  }

  addWordButton() {
    return cy.get(this.addWordButtonSelector);
  }
}
