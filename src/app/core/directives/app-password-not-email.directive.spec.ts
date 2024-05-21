import { PasswordNotEmailDirective } from './app-password-not-email.directive';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

@Component({
  template: `
    <form [formGroup]="form" appPasswordNotEmail>
      <input formControlName="email" />
      <input formControlName="password" />
    </form>
  `,
  imports: [ReactiveFormsModule, PasswordNotEmailDirective],
  standalone: true,
})
class TestComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: [''],
      password: [''],
    });
  }
}

describe('PasswordNotEmailDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, PasswordNotEmailDirective, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return required error if password is empty', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('');

    expect(component.form.controls['password'].errors).toEqual({ required: true });
  });

  it('should return passwordAsEmail error if password is the same as email', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('test@example.com');

    expect(component.form.controls['password'].errors).toEqual({ passwordAsEmail: true });
  });

  it('should not return passwordAsEmail error if password is different from email', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('differentPassword123');

    expect(component.form.controls['password'].errors).toBeNull();
  });

  it('should remove passwordAsEmail error if password is updated to be different from email', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('test@example.com');

    expect(component.form.controls['password'].errors).toEqual({ passwordAsEmail: true });

    component.form.controls['password'].setValue('differentPassword123');
    fixture.detectChanges();

    expect(component.form.controls['password'].errors).toBeNull();
  });

  it('should not set pattern error if password matches the required pattern', () => {
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('Valid123!');

    expect(component.form.controls['password'].errors).toBeNull();
  });
});
