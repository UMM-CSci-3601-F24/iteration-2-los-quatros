import { Component, computed, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
// import { MatFormField } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { WordService } from './word.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { Word } from './word';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-word-list-component',
  standalone: true,
  imports: [
    MatCardModule,
    // MatFormField,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.scss'
})
export class WordListComponent {
  // client side sorting
  sortType = signal<string | undefined>(undefined);
  sortOrder = signal<string | undefined>(undefined);
  //server side filtering
  contains = signal<string|undefined>(undefined);
  group = signal<string|undefined>(undefined);

  errMsg = signal<string | undefined>(undefined);

  constructor(private wordService: WordService, private snackBar: MatSnackBar) {
    // Nothing here – everything is in the injection parameters.
  }

  private contains$ = toObservable(this.contains);
  private group$ = toObservable(this.group);

  serverFilteredWords =
    toSignal(
      combineLatest([this.contains$, this.group$]).pipe(
        switchMap(([contains, group]) =>
          this.wordService.getWords({
            contains,
            group,
          })
        ),
        catchError((err) => {
          if (err.error instanceof ErrorEvent) {
            this.errMsg.set(
              `Problem in the client – Error: ${err.error.message}`
            );
          } else {
            this.errMsg.set(
              `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`
            );
          }
          this.snackBar.open(this.errMsg(), 'OK', { duration: 6000 });
          return of<Word[]>([]);
        }),
        tap(() => {

        })
      )
    );


  filteredWords = computed(() => {
    const serverFilteredWords = this.serverFilteredWords();
    return this.wordService.filterWords(serverFilteredWords, {
      sortType: this.sortType(),
      sortOrder: this.sortOrder(),
    });
  });
}
