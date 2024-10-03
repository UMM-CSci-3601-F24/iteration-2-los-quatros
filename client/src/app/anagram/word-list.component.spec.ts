import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { MatCardModule } from '@angular/material/card';

import { WordListComponent } from './word-list.component';
import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';
import { Word } from './word';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Word List', () => {
  let wordList: WordListComponent;
  let fixture: ComponentFixture<WordListComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [WordListComponent, BrowserAnimationsModule],
      providers: [{provide: WordService, useValue: new MockWordService}],
    })
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(WordListComponent);
      wordList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(wordList).toBeTruthy();
  });
  it('contains all the words', () => {
    expect(wordList.serverFilteredWords().length).toBe(5);
  })
  it("contains a word 'Mac'", () => {
    expect(
      wordList.serverFilteredWords().some((word: Word) => word.word === 'Mac')
    ).toBe(true);
  });
  // it has 4 words in group group members
  //it has one word in group 'teachers'
});
