import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitting = false;
  isRegistrationEnabled = true; // Variable para habilitar o deshabilitar el registro
  isUserRegistered = false;

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService // Agregar el servicio AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const { email, password } = this.loginForm.value;
      this.authenticateUser(email, password);
    }
  }

  googleLogin(): void {
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((result: any) => {
          console.log(result);
          this.redirectToUserPanel();
        })
        .catch((error: any) => {
          this.handleAuthenticationError(error);
          console.log(error)
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
          this.redirectToUserPanel();
        })
        .catch((error: any) => {
          this.handleAuthenticationError(error);
          console.log(error)
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    }
  }

  redirectToRegistration(): void {
    this.router.navigate(['/registration-form']); // Redireccionar a la página de registro
  }

  private authenticateUser(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then((result: any) => {
        console.log(result);
        if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
          // El usuario es nuevo, mostrar mensaje de error
          this.isUserRegistered = false;
          this.showUserNotRegisteredError();
        } else {
          // El usuario existe, redirigir al panel de usuario
          this.redirectToUserPanel();
        }
      })
      .catch((error: any) => {
        if (error.code === 'auth/user-not-found') {
          // Usuario no registrado, mostrar mensaje de error
          this.isUserRegistered = false;
          this.showUserNotRegisteredError();
          console.log(error)
        } else {
          this.handleAuthenticationError(error);
        }
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  private showUserNotRegisteredError(): void {
    this.snackBar.open('El usuario no está registrado. Regístrate antes de iniciar sesión.', 'Cerrar', { duration: 3000 });
    this.redirectToRegistration(); // Redireccionar a la página de registro
  }

  private redirectToUserPanel(): void {
    this.router.navigate(['/user-panel']); // Redireccionar al panel de usuario después de iniciar sesión
  }

  private handleAuthenticationError(error: any): void {
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('Autenticación cancelada por el usuario');
    } else if (error.code === 'auth/wrong-password') {
      console.log('Contraseña incorrecta');
      this.snackBar.open('Contraseña incorrecta. Por favor, verifica tus credenciales.', 'Cerrar', { duration: 3000 });
    } else {
      console.error(error);
      this.snackBar.open('Error en el inicio de sesión', 'Cerrar', { duration: 3000 });
    }
  }
}
