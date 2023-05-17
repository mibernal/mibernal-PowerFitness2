import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import 'firebase/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isPopupOpen = false;
  onSubmit(): void {

    const { firstName, lastName, email, password } = this.registrationForm.value;

    if (this.registrationForm.controls['email'].invalid || !this.isEmailValid(email)) {
      console.log('Invalid email format');
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          console.log('User created:', user);
          // Agregar al usuario a Firestore
          const userRef = this.firestore.collection('users').doc(user.uid);
          userRef.set({
            firstName,
            lastName,
            email,
            password  // Agregar la contraseña al documento del usuario en Firestore
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
    if (this.isPopupOpen) {
      return;
    }

    this.isPopupOpen = true;

    this.authService
      .signInWithGoogle()
      .then((result: any) => {
        if (result && result.credential) {
          const credential = firebase.auth.GoogleAuthProvider.credential(result.credential);
          if (credential) {
            const user = firebase.auth().currentUser;
            if (user) {
              console.log('Successfully registered with Google!', user);

              // Agregar al usuario a Firestore
              const { displayName, email } = user;
              const [firstName, lastName] = displayName?.split(' ') ?? ["", ""];
              const userRef = this.firestore.collection('users').doc(user.uid);
              userRef.set({
                firstName,
                lastName,
                email,
                password: null // Agregar la contraseña como null al documento del usuario en Firestore
              }).then(() => {
                console.log('User added to Firestore:', user);
              }).catch((error) => {
                console.log('Error adding user to Firestore:', error);
              });
            }
          } else {
            console.log('Error registering with Google:', result);
          }
        }
      })
      .catch((error) => {
      this.snackBar.open('Error al registrar con Google', 'Cerrar', { duration: 5000 });
      console.log('Error registering with Google:', error);
      })
      .finally(() => {
        this.isPopupOpen = false;
      });
  }

  private isEmailValid(email: string): boolean {
    // Utiliza una expresión regular para verificar el formato del correo electrónico
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  registerWithFacebook(): void {
    if (this.isPopupOpen) {
      return;
    }
    this.isPopupOpen = true;

    this.authService
      .signInWithFacebook()
      .then((result: any) => {
        const credential = result?.credential?.accessToken;
        if (credential) {
          const user = firebase.auth().currentUser;
          if (user) {
            console.log('Successfully registered with Facebook!', user);

            // Agregar al usuario a Firestore
            const { displayName, email } = user;
          const [firstName, lastName] = displayName?.split(' ') ?? ["", ""];
          const userRef = this.firestore.collection('users').doc(user.uid);
          userRef.set({
            firstName,
            lastName,
            email,
            password: null // Agregar la contraseña como null al documento del usuario en Firestore
          }).then(() => {
            console.log('User added to Firestore:', user);
          }).catch((error) => {
            console.log('Error adding user to Firestore:', error);
          });
        }
      } else {
        console.log('Error registering with Facebook:', result);
      }
    })
    .catch((error) => {
      this.snackBar.open('Error al registrar con Facebook', 'Cerrar', { duration: 5000 });
      console.log('Error registering with Google:', error);
    })
    .finally(() => {
      this.isPopupOpen = false;
    });
  }
}
