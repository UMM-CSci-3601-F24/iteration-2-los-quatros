import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { MatCardModule } from '@angular/material/card';


import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';
import { Word } from './word';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

const COMMON_IMPORTS: unknown[] = [
  RouterTestingModule,
  BrowserAnimationsModule,
]

describe('Word List', () => {
  let wordList: WordListComponent;
  let fixture: ComponentFixture<WordListComponent>;
  let wordService: WordService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS, WordListComponent],
      providers: [{provide: WordService, useValue: new MockWordService() }, MatSnackBar],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(WordListComponent);
      wordList = fixture.componentInstance;
      wordService = TestBed.inject(WordService);
      snackBar = TestBed.inject(MatSnackBar);
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(wordList).toBeTruthy();
  });

  it('contains all the words', () => {
    expect(wordList.serverFilteredWords().length).toBe(5);
  });

  it("contains a word 'Mac'", () => {
    expect(
      wordList.serverFilteredWords().some((word: Word) => word.word === 'Mac')
    ).toBe(true);
  });

  it('has four words in the group `team members`', () => {
    expect(
      wordList.serverFilteredWords().filter((word: Word) => word.wordGroup === "team member").length
    ).toBe(4);
  });

  it('has one word in the group `teachers`', () => {
    expect(
      wordList.serverFilteredWords().filter((word: Word) => word.wordGroup === "teachers").length
    ).toBe(1);
  });

  it('should call deleteWord and show a Snackbar message', () => {
    spyOn(wordService, 'deleteWord').and.returnValue(of(undefined));
    spyOn(snackBar, 'open');

    wordList.deleteWord('testId');

    expect(wordService.deleteWord).toHaveBeenCalledWith('testId');
    expect(snackBar.open).toHaveBeenCalledWith('We deleted a word!', 'OK', { duration: 6000 });
  });

  it('should handle HttpErrorResponse and show an error Snackbar', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    });

    spyOn(wordService, 'getWords').and.returnValue(throwError(() => errorResponse));
    spyOn(snackBar, 'open');

    wordList.ngOnInit();

    expect(wordList.errMsg()).toContain('Problem contacting the server – Error Code: 404\nMessage: test 404 error');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Problem contacting the server – Error Code: 404\nMessage: test 404 error',
      'OK',
      { duration: 6000 }
    );
  });

  it('should handle client-side error and show an error Snackbar', () => {
    const errorEvent = new ErrorEvent('Network error', {
      message: 'simulated network error'
    });

    const errorResponse = new HttpErrorResponse({
      error: errorEvent,
      status: 0,
      statusText: 'Unknown Error'
    });

    spyOn(wordService, 'getWords').and.returnValue(throwError(() => errorResponse));
    spyOn(snackBar, 'open');

    wordList.ngOnInit();

    expect(wordList.errMsg()).toContain('Problem in the client – Error: simulated network error');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Problem in the client – Error: simulated network error',
      'OK',
      { duration: 6000 }
    );
  });
});

describe('misbehaving word list', () => {
  let wordList: WordListComponent;
  let fixture: ComponentFixture<WordListComponent>;
  let originalTimeout;

  let wordServiceStub: {
    getWords: () => Observable<Word[]>;
  };

  beforeEach(() => {
    wordServiceStub = {
      getWords: () =>
        new Observable((observer) => {
          observer.error('getWords() Observer generates and error');
        }),
    };
    TestBed.configureTestingModule({
      imports: [WordListComponent, COMMON_IMPORTS],
      providers: [{provide: WordService, useValue: wordServiceStub}],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(WordListComponent);
      wordList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  // these two functions are a workaround to build more time
  //into this test so it does not auto fail when another test fails
  beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('generates an error if we don`t set up a WordListService', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    expect(wordList.serverFilteredWords())
      .withContext('service cant give values of non-existent list')
      .toEqual([]);
    expect(wordList.errMsg())
      .withContext('the error message will be')
      .toContain('Problem contacting the server – Error Code:');
  });
});
export { WordListComponent };

