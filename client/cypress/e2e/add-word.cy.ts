// import { Word } from 'src/app/anagram/word';
import {AddWordPage} from '../support/add-word.po';

describe('add word list', () => {
  const page = new AddWordPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Word Group');
  });

  it('should enable and disable add word button', () => {
    page.addWordButton().should('be.disabled');
// whole bunch of tests gb2
  })
})
