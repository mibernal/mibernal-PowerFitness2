import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private auth: AngularFireAuth, private router: Router) {}

canActivate(): Promise<boolean> {
return new Promise((resolve, reject) => {
this.auth.onAuthStateChanged((user) => {
if (user) {
resolve(true); // Permitir acceso si hay un usuario autenticado
} else {
this.router.navigate(['/login-form']); // Redireccionar al formulario de inicio de sesión si no hay un usuario autenticado
resolve(false);
}
});
});
}
}