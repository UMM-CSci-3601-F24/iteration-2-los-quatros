export class WordListPage {
  private readonly baseUrl = '/anagram';
  private readonly pageTitle = '.word-list-title';
  private readonly wordListItemsSelector = '.anagram-nav-list .anagram-list-item';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getAnagramTitle() {
    return cy.get(this.pageTitle);
  }

  getWordListItems() {
    return cy.get(this.wordListItemsSelector);
  }

  // addWordButton() {
  //   return cy.get(this.addButtonSelector);
  // }
}
