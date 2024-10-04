import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Word } from "src/app/anagram/word";
import { WordService } from "src/app/anagram/word.service";
import { AppComponent } from "src/app/app.component";

@Injectable({
  providedIn: AppComponent
})
export class MockWordService extends WordService {
  static testWords: Word[] = [
    {
      word: "El",
      wordGroup: "team members",
    },
    {
      word: "Mac",
      wordGroup: "team member",
    },
    {
      word: "Jakob",
      wordGroup: "team member",
    },
    {
      word: "Kennan",
      wordGroup: "team member",
    },
    {
      word: "Nic",
      wordGroup: "teachers",
    },
  ];

  constructor() {
    super(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWords(_filters: {contains?: string; group?: string}): Observable<Word[]> {
    return of(MockWordService.testWords);
  }
}
