export class WordListPage {
  private readonly baseUrl = '/anagram';
  private readonly pageTitle = '.word-list-title';
  private readonly addWordButtonSelector = '[data-test=addWordButton]';
  private readonly anagramListItemsSelector = '.anagram-nav-list .anagram-list-item'

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getAnagramTitle() {
    return cy.get(this.pageTitle);
  }

  addWordButton() {
    return cy.get(this.addWordButtonSelector);
  }

  getAnagramListItems() {
    return cy.get(this.anagramListItemsSelector)
  }
}
