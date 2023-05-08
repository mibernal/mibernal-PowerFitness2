import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const { email, password } = this.loginForm.value;
      this.auth.signInWithEmailAndPassword(email, password)
      .then((result: any) => {
          console.log(result);
        })
        .catch((error: any) => {
          console.error(error);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    }
  }

  googleLogin(): void {
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result: any) => {
          console.log(result);
        })
        .catch((error: any) => {
          console.error(error);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    }
  }

  facebookLogin(): void {
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((result: any) => {
          console.log(result);
        })
        .catch((error: any) => {
          console.error(error);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    }
  }
}