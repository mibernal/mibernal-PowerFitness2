import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private authService: AuthService,
    private firestore: AngularFirestore
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
    const { firstName, lastName, email, password } = this.registrationForm.value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result && result.user) {
          const user = result.user;
          console.log('User created:', user);
  
          // Agregar al usuario a Firestore
          const userRef = this.firestore.collection('users').doc(user.uid);
          userRef.set({
            firstName,
            lastName,
            email
          }).then(() => {
            console.log('User added to Firestore:', user);
          }).catch((error) => {
            console.log('Error adding user to Firestore:', error);
          });
        }
      })
      .catch((error) => console.log('Error creating user:', error));
  }  

  registerWithGoogle(): void {
    this.authService
      .signInWithGoogle()
      .then((result) => {
        if (result instanceof firebase.auth.UserCredential) {
          const user = result.user;
          console.log('Successfully registered with Google!', user);
  
          // Agregar al usuario a Firestore
          if (user) {
            const { displayName, email } = user;
            const [firstName, lastName] = displayName?.split(' ') ?? ["", ""];
            const userRef = this.firestore.collection('users').doc(user.uid);
            userRef.set({
              firstName,
              lastName,
              email
            }).then(() => {
              console.log('User added to Firestore:', user);
            }).catch((error) => {
              console.log('Error adding user to Firestore:', error);
            });
          }
        } else {
          console.log('Error registering with Google:', result);
        }
      })
      .catch((error) => console.log('Error registering with Google:', error));
  }
  

  registerWithFacebook(): void {
    this.authService
      .signInWithFacebook()
      .then(() => console.log('Successfully registered with Facebook!'))
      .catch((error) => console.log('Error registering with Facebook:', error));
  }
}
