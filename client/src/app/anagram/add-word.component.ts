import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WordService } from './word.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-word',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-word.component.html',
  styleUrl: './add-word.component.scss'
})
export class AddWordComponent {
  addWordForm = new FormGroup({
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
      {type: 'required', message: 'Please enter words to be added'},
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
    /* private router: Router*/) {
  }

  formControlHasError(controlName: string): boolean {
    return this.addWordForm.get(controlName).invalid &&
      (this.addWordForm.get(controlName).dirty || this.addWordForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.addWordValidationMessages): string {
    for(const {type, message} of this.addWordValidationMessages[name]) {
      if (this.addWordForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

submitForm() {
throw new Error('Method not implemented.');
/*
// gb2
  this.wordService.addWord(this.addWordForm.value).subscribe({
  })
*/
}

}
