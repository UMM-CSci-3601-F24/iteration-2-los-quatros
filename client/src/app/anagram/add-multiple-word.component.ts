import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WordService } from './word.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
// import { emitKeypressEvents } from 'readline';

@Component({
  selector: 'app-add-multiple-word',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,],
  templateUrl: './add-multiple-word.component.html',
  styleUrl: './add-multiple-word.component.scss'
})
export class AddMultipleWordComponent {
  addMultipleWordForm = new FormGroup({
    word: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1)
    ])),
    wordGroup: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
    ])),
  });

  readonly addWordValidationMessages = {
    word: [
      {type: 'required', message: 'There must be at least one word'},
      {type: 'minlength', message: 'Name of word group must be at least 1 character long'},
    ],
    wordGroup: [
      {type: 'required', message: 'Word group name is required'},
      {type: 'minlength', message: 'Word entered must be at least 1 character long'},
    ]
  };

  constructor(
    private wordService: WordService,
    private snackBar: MatSnackBar,
    private router: Router) {
  }
  formControlHasError(controlName: string): boolean {
    return this.addMultipleWordForm.get(controlName).invalid &&
      (this.addMultipleWordForm.get(controlName).dirty || this.addMultipleWordForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.addWordValidationMessages): string {
    for(const {type, message} of this.addWordValidationMessages[name]) {
      if (this.addMultipleWordForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }



  // submitForm() {
    // this.wordService.addMultipleWord(this.addMultipleWordForm.value).subscribe({
    //   next: () => {
    //     this.snackBar.open(
    //       `Added word group: ${this.addMultipleWordForm.value.wordGroup}`,
    //       null,
    //       {duration: 2000}
    //     );
    //     const wordGroup = this.addMultipleWordForm.value;
    //     wordGroup.word = '';
    //     this.addMultipleWordForm.setValue(wordGroup as { word: string, wordGroup: string });
    //   },
  //     error: err => {
  //       if (err.status === 400) {
  //         this.snackBar.open(
  //           `The server failed to process your request to add a new word group. Is the server up? – Error
  //           Code: ${err.status}\nMessage: ${err.message}`,
  //             'OK',
  //             { duration: 5000 }
  //         );
  //       } else {
  //         this.snackBar.open(
  //           `An unexpected error occurred – Error Code: ${err.status}\nMessage: ${err.message}`,
  //             'OK',
  //             { duration: 5000 }
  //         );
  //       }
  //     },
  //   });
  // }

  submitForm() {
    this.wordService.addMultipleWord(this.addMultipleWordForm.value).subscribe({
      next: () => {
        this.snackBar.open(
          `Added word group: ${this.addMultipleWordForm.value.wordGroup}`,
          null,
          {duration: 2000}
        );
        const wordGroup = this.addMultipleWordForm.value;
        wordGroup.word = '';
        this.addMultipleWordForm.setValue(wordGroup as { word: string, wordGroup: string });
        this.router.navigate(['/anagram']);
      },
      error: err => {
        if (err.status === 400) {
          this.snackBar.open(
            `The server failed to process your request to add a new word group. Is the server up? – Error Code: ${err.status}\nMessage: ${err.message}`,
              'OK',
              { duration: 5000 }
          );
        } else {
          this.snackBar.open(
            `An unexpected error occurred – Error Code: ${err.status}\nMessage: ${err.message}`,
              'OK',
              { duration: 5000 }
          );
        }
      },
    });
  }
}




