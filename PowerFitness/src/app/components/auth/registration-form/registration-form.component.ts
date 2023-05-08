import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    console.log(this.registrationForm.value);
  }

  registerWithGoogle(): void {
    this.authService
      .signInWithGoogle()
      .then(() => console.log('Successfully registered with Google!'))
      .catch((error) => console.log('Error registering with Google:', error));
  }

  registerWithFacebook(): void {
    this.authService
      .signInWithFacebook()
      .then(() => console.log('Successfully registered with Facebook!'))
  }
}