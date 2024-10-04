import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WordService } from './word.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-wordgroup',
  templateUrl: './add-wordslist.component.html',
  styleUrls: ['./add-wordslist.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule]
})
export class AddWordsListComponent {

  addWordsListForm = new FormGroup({
    word: new FormControl('', Validators.compose([
      Validators.required,
      (fc) => {
        if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
          return ({existingWord: true});
        } else {
          return null;
        }
      }
    ])),

    wordGroup: new FormControl('')
  });
  readonly addTodoValidationMessages = {
    word: [
      {type: 'required', message: 'Word is required'}
    ],
  };

  constructor(
    private wordService: WordService,
    private snackBar: MatSnackBar,
    private router: Router) {
  }

  formControlHasError(controlWord: string): boolean {
    return this.addWordsListForm.get(controlWord).invalid &&
      (this.addWordsListForm.get(controlWord).dirty || this.addWordsListForm.get(controlWord).touched);
  }

  getErrorMessage(word: keyof typeof this.addTodoValidationMessages): string {
    for(const {type, message} of this.addTodoValidationMessages[word]) {
      if (this.addWordsListForm.get(word).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }
  // submitForm() {
  //   this.wordService.addWordsList(this.addWordsListForm.value).subscribe({
  //     next: (newId) => {
  //       this.snackBar.open(
  //         `Added word ${this.addWordsListForm.value.word}`,
  //         null,
  //         { duration: 2000 }
  //       );
  //       this.router.navigate(['/words/', newId]);
  //     },
  //     error: err => {
  //       this.snackBar.open(
  //         `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
  //         'OK',
  //         { duration: 5000 }
  //       );
  //     },
  //   });
  // }

}

