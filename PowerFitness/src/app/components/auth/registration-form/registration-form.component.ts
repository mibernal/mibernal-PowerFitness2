import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  isSubmitting = false;
  isPopupOpen = false;
  currentUserSubscription: any;

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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.currentUserSubscription = this.authService.getCurrentUser().subscribe(() => {
      // handle current user value
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async onSubmit(): Promise<void> {
    const { firstName, lastName, email, password } = this.registrationForm.value;

    if (this.registrationForm.controls['email'].invalid || !this.isEmailValid(email)) {
      console.log('Invalid email format');
      return;
    }

    try {
      // Verificar si el correo electrónico ya existe en la base de datos
      const querySnapshot = await this.firestore
        .collection('users', (ref) => ref.where('email', '==', email))
        .get()
        .toPromise();

      if (!querySnapshot?.empty) {
        console.log('Correo Electronico Ya Existe');
        // Mostrar mensaje de error
        this.snackBar.open('Correo Electronico Ya Existe', 'Cerrar', { duration: 5000 });
        return;
      }

      // Si el correo electrónico no existe, crear el usuario
      const userCredential = await this.authService.signUpWithEmailAndPassword(email, password).toPromise();
      if (userCredential?.user) {
        console.log('User created:', userCredential.user);
        // Agregar al usuario a Firestore
        const userRef = this.firestore.collection('users').doc(userCredential.user.uid);
        await userRef.set({
          firstName,
          lastName,
          email,
        });
        console.log('User added to Firestore:', userCredential.user);
        // Redirigir al panel de usuario
        this.router.navigate(['/user-panel']);
      }
    } catch (error) {
      console.log('Error creating user:', error);
    }
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
          // Mostrar mensaje de error
          this.snackBar.open('Correo Electronico Ya Existe', 'Cerrar', { duration: 5000 });
          return;
        }

        // Si el correo electrónico no existe, crear el usuario con el proveedor externo
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
      .catch((error) => {
        console.log('Error checking email existence:', error);
        this.snackBar.open('Error al Verificar Email', 'Cerrar', { duration: 5000 });
      });
  }

  registerWithGoogle(): void {
    if (this.isPopupOpen) {
      return;
    }

    this.isPopupOpen = true;

    this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result: firebase.auth.UserCredential) => {
        const credential = result?.credential;
        if (credential) {
          const user = result.user;
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
      .then((result: firebase.auth.UserCredential) => {
        const credential = result?.credential;
        if (credential) {
          const user = result.user;
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
}
