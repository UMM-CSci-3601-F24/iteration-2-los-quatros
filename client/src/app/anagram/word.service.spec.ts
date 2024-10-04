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
  describe('When getWords() is called with parameters it forms proper HTTP request(Sever Filtering)', () => {
    // server filtering is contains and group as of 10/4/24
    it('correctly calls api/anagram with  filter parameter contains', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testWords));

      wordService.getWords({contains: 'c'}).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to correct endpoint')
          .toHaveBeenCalledWith(wordService.wordUrl, {params: new HttpParams().set('contains', 'c')});
      });
    });
    it('correctly calls api/anagram with filter parameter group', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testWords));

      wordService.getWords({group: 'teach'}).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to correct endpoint')
          .toHaveBeenCalledWith(wordService.wordUrl, {params: new HttpParams().set('group', 'teach')});
      });
    });
    it('correctly calls api/anagram with more than one filter parameters', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testWords));

      wordService.getWords({contains: 'l', group: 'mem'}).subscribe(() => {
        const [url, options] = mockedMethod.calls.argsFor(0);
        const calledHttpParams: HttpParams = (options.params) as HttpParams;

        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(url)
          .withContext('talks to correct endpoint')
          .toEqual(wordService.wordUrl);
        expect(calledHttpParams.keys().length)
          .toBe(2);
        expect(calledHttpParams.get('contains'))
          .withContext('contains `l`')
          .toEqual('l');
        expect(calledHttpParams.get('group'))
          .withContext(' from wordGroup mem')
          .toEqual('mem');
      });
    });
  });

  /*
  describe('sorting on the client (alphabetical, by length))
  //test tets hehehe
  */
});
