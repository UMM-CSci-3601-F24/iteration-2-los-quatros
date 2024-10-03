import { TestBed, waitForAsync } from '@angular/core/testing';

import { WordService } from './word.service';
import { Word } from './word';
import { HttpClient, HttpParams, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('WordService', () => {
  const testWords: Word[] = [
    {
      word: 'El',
      wordGroup: 'team members',
    },
    {
      word: 'Mac',
      wordGroup: 'team member',
    },
    {
      word: 'Jakob',
      wordGroup: 'team member',
    },
    {
      word: 'Kennan',
      wordGroup: 'team member',
    },
    {
      word: 'Nic',
      wordGroup: 'teachers',
    },
  ];
  let wordService: WordService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    wordService = new WordService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('When getWords() is called with no parameters', () => {
    it('calls api/anagram', waitForAsync(() => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testWords));
      wordService.getWords().subscribe(() => {
        expect(mockedMethod).withContext('one call').toHaveBeenCalledTimes(1);
        expect(mockedMethod).withContext('talks to correct endpoint').toHaveBeenCalledWith(wordService.wordUrl, {params: new HttpParams()});
      });
    }));
  });
});
