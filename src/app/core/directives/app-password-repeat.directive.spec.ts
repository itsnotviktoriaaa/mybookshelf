import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PasswordRepeatDirective } from './app-password-repeat.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

@Component({
  template: `
    <form [formGroup]="form" appPasswordRepeat>
      <input formControlName="password" />
      <input formControlName="confirmPassword" />
    </form>
  `,
  imports: [ReactiveFormsModule, PasswordRepeatDirective],
  standalone: true,
})
class TestComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      password: [''],
      confirmPassword: [''],
    });
  }
}

describe('PasswordRepeatDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, PasswordRepeatDirective, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return required error if both password and confirmPassword are empty', () => {
    component.form.controls['password'].setValue('');
    component.form.controls['confirmPassword'].setValue('');

    expect(component.form.controls['password'].errors).toEqual({ required: true });
    expect(component.form.controls['confirmPassword'].errors).toEqual({ required: true });
  });

  it('should return passwordRepeat error if password and confirmPassword do not match', () => {
    component.form.controls['password'].setValue('password123');
    component.form.controls['confirmPassword'].setValue('differentPassword');

    expect(component.form.controls['confirmPassword'].errors).toEqual({ passwordRepeat: true });
  });

  it('should not return passwordRepeat error if password and confirmPassword match', () => {
    component.form.controls['password'].setValue('password123');
    component.form.controls['confirmPassword'].setValue('password123');

    expect(component.form.controls['confirmPassword'].errors).toBeNull();
  });

  it('should remove passwordRepeat error if confirmPassword is updated to match password', () => {
    component.form.controls['password'].setValue('password123');
    component.form.controls['confirmPassword'].setValue('differentPassword');

    expect(component.form.controls['confirmPassword'].errors).toEqual({ passwordRepeat: true });

    component.form.controls['confirmPassword'].setValue('password123');
    fixture.detectChanges();

    expect(component.form.controls['confirmPassword'].errors).toBeNull();
  });
});
