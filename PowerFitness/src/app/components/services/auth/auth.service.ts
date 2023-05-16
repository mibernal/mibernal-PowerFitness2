import { Injectable, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { User } from '@firebase/auth-types';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(@Inject(AngularFireAuth) private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  async signUpWithEmailAndPassword(email: string, password: string): Promise<void> {
    await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<void> {
    await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider);
  }  

  async signInWithFacebook(): Promise<void> {
    const provider = new firebase.auth.FacebookAuthProvider();
    await this.afAuth.signInWithPopup(provider);
  }

  async signOut(): Promise<void> {
    await this.afAuth.signOut();
  }
}
