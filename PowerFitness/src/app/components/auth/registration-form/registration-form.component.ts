import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router,
    private auth: AngularFireAuth
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

    // Verificar si el correo electrónico ya existe en la base de datos
    this.firestore
      .collection('users', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (!querySnapshot?.empty) {
          console.log('Correo Electronico Ya Existe');
        // Mostrar mensaje de error
        this.snackBar.open('Correo Electronico Ya Existe', 'Cerrar', { duration: 5000 });
          return;
        }

        // Si el correo electrónico no existe, crear el usuario
        this.authService
          .signUpWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            if (user) {
              console.log('User created:', user);
              // Agregar al usuario a Firestore
              const userRef = this.firestore.collection('users').doc(user.uid);
              userRef
                .set({
                  firstName,
                  lastName,
                  email,
                  password // Agregar la contraseña al documento del usuario en Firestore
                })
                .then(() => {
                  console.log('User added to Firestore:', user);
                  // Redirigir al panel de usuario
                  this.router.navigate(['/user-panel']);
                })
                .catch((error) => {
                  console.log('Error adding user to Firestore:', error);
                });
            }
          })
          .catch((error) => console.log('Error creating user:', error));
      })
      .catch((error) => console.log('Error checking email existence:', error));
  }

  verifyAndRegisterWithExternalProvider(email: string, uid: string, displayName: string | null, photoURL: string | null): void {
    // Verificar si el correo electrónico ya existe en la base de datos
    this.firestore
      .collection('users', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (!querySnapshot?.empty) {
          console.log('Correo Electronico Ya Existe');
          this.snackBar.open('Correo Electronico Ya Existe', 'Cerrar', { duration: 5000 });
          return;
        }
  
        // Si el correo electrónico no existe, registrar al usuario con proveedor externo
        const [firstName, lastName] = (displayName || '').split(' ');
        const userRef = this.firestore.collection('users').doc(uid);
        userRef
          .set({
            firstName,
            lastName,
            email,
            password: null, // Agregar la contraseña como null al documento del usuario en Firestore
            photoURL: photoURL || '' // Agregar la foto de perfil al documento del usuario en Firestore, o cadena vacía si es null
          })
          .then(() => {
            console.log('Usuario Creado', uid);
            this.snackBar.open('Usuario Creado', 'Cerrar', { duration: 5000 });
            // Redirigir al panel de usuario
            this.router.navigate(['/user-panel']);
          })
          .catch((error) => {
            console.log('Error Creando Usuario', error);
            this.snackBar.open('Error Creando Usuario', 'Cerrar', { duration: 5000 });
          });
      })
      .catch((error) => console.log('Error checking email existence:', error));
      this.snackBar.open('Error al Verificar Email', 'Cerrar', { duration: 5000 });
  }

  registerWithGoogle(): void {
    if (this.isPopupOpen) {
      return;
    }

    this.isPopupOpen = true;

    this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result: any) => {
        const credential = result?.credential?.accessToken;
        if (credential) {
          const user = firebase.auth().currentUser;
          if (user) {
            const email = user.email ?? '';
            const photoURL = user.photoURL ?? '';
            const displayName = user.displayName ?? '';
            this.verifyAndRegisterWithExternalProvider(email, user.uid, displayName, photoURL);
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

  registerWithFacebook(): void {
    if (this.isPopupOpen) {
      return;
    }

    this.isPopupOpen = true;

    this.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((result: any) => {
        const credential = result?.credential?.accessToken;
        if (credential) {
          const user = firebase.auth().currentUser;
          if (user) {
            const email = user.email ?? '';
            const photoURL = user.photoURL ?? '';
            const displayName = user.displayName ?? '';
            this.verifyAndRegisterWithExternalProvider(email, user.uid, displayName, photoURL);
          }
        }
      })
      .catch((error) => {
        this.snackBar.open('Error al registrar con Facebook', 'Cerrar', { duration: 5000 });
        console.log('Error registering with Facebook:', error);
      })
      .finally(() => {
        this.isPopupOpen = false;
      });
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}