import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-request-form',
  standalone: false,
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent {
  requestForm: FormGroup;
  submitted = false;
  successMessage = '';

  districts = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'];

  constructor(private fb: FormBuilder) {
    this.requestForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100), this.alphaOnlyValidator]],
      district: [''],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      message: ['', [Validators.required, Validators.maxLength(5000)]]
    });
  }

  get f() {
    return this.requestForm.controls;
  }

  // ✅ Custom validator: only alphabets and spaces
  alphaOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !/^[A-Za-z\s]*$/.test(value)) {
      return { alphaOnly: true };
    }
    return null;
  }

  // ✅ Restrict input for name to only letters
  allowOnlyLetters(event: KeyboardEvent) {
    const char = event.key;
    if (!/^[A-Za-z\s]$/.test(char)) {
      event.preventDefault();
    }
  }

  // ✅ Restrict input for mobile to only numbers
  allowOnlyNumbers(event: KeyboardEvent) {
    const char = event.key;
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }
  }

  // ✅ Trigger validation visibility on mouseleave
  handleMouseEvent(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      this.submitted = true;
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.requestForm.invalid) {
      return;
    }

    const requestId = Math.floor(100000 + Math.random() * 900000);
    this.successMessage = `Request submitted successfully! Your Request ID: ${requestId}`;
    alert(this.successMessage);

    this.requestForm.reset();
    this.submitted = false;
  }
}
