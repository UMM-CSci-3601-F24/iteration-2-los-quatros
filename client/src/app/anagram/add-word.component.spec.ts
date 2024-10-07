import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddWordComponent } from './add-word.component';
import { AbstractControl, FormGroup } from '@angular/forms';
import { WordService } from './word.service';
import { MockWordService } from 'src/testing/word.service.mock';

describe('AddWordComponent', () => {
  let addWordComponent: AddWordComponent;
  let addWordForm: FormGroup;
  let fixture: ComponentFixture<AddWordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(WordService, { useValue: new MockWordService() });
    TestBed.configureTestingModule({
      imports: [

        AddWordComponent
      ],
    })
    .compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWordComponent);
    addWordComponent = fixture.componentInstance;
    fixture.detectChanges();
    addWordForm = addWordComponent.addWordForm;
    expect(addWordForm).toBeDefined();
    expect(addWordForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(addWordComponent).toBeTruthy();
    expect(addWordForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addWordForm.valid).toBeFalsy();
  });

  describe('the word group field', () => {
    let wordControl: AbstractControl;

    beforeEach(() => {
      wordControl = addWordComponent.addWordForm.controls.word;
    });

    it('should not allow empty names', () => {
      wordControl.setValue('');
      expect(wordControl.valid).toBeFalsy();
    });
    it('should allow Foods as a word group name', () => {
      wordControl.setValue('Foods');
      expect(wordControl.valid).toBeTruthy();
    })
  })

  describe('the new words field', () => {
    let wordGroupControl: AbstractControl;

    beforeEach(() => {
      wordGroupControl = addWordComponent.addWordForm.controls.wordGroup;
    })

    it('should not allow empty inputs', () => {
      wordGroupControl.setValue('');
      expect(wordGroupControl.valid).toBeFalsy();
    });
    it('should allow input `burger, fries, milkshake`', () => {
      wordGroupControl.setValue('burger, fries, milkshake');
      expect(wordGroupControl.valid).toBeTruthy();
    });
  });

  // describe('getErrorMessage()', () => {

  // });

  // a lot more tests I dont want to write rn gb2
});
