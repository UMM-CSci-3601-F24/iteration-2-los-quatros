import { Injectable } from '@angular/core';
import { Word } from './word';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  readonly wordUrl: string = `${environment.apiUrl}anagram`;

  private readonly groupKey = 'group';
  private readonly containsKey = 'contains';


  constructor(private httpClient: HttpClient) { }

  getWords(filters?: {contains?: string; group?: string}): Observable<Word[]> {

    let httpParams: HttpParams = new HttpParams();
    if(filters) {
      if(filters.contains) {
        httpParams = httpParams.set(this.containsKey, filters.contains);
      }
      if(filters.group) {
        httpParams = httpParams.set(this.groupKey, filters.group);
      }
    }
    return this.httpClient.get<Word[]>(this.wordUrl, {
      params: httpParams,
    });
  }
  sortWords(words: Word[], filters: {sortType?: string; sortOrder?: boolean}): Word[] {
    const filteredWords = words;
    //let filteredWords = words;

    if(filters.sortType) {
      if(filters.sortType === "alphabetical"){
        filteredWords.sort();
      }
    }
    if(filters.sortOrder) {
      filteredWords.reverse();
    }
    return filteredWords;
  }

  addWord(newWord: Partial<Word>): Observable<string> {
    return this.httpClient.post<{id: string}>(this.wordUrl, newWord).pipe(map(response => response.id))
  }

  deleteWord(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.wordUrl}/${id}`);
  }
}
