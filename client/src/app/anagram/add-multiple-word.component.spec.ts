import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultipleWordComponent } from './add-multiple-word.component';

describe('AddMultipleWordComponent', () => {
  let component: AddMultipleWordComponent;
  let fixture: ComponentFixture<AddMultipleWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMultipleWordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMultipleWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
