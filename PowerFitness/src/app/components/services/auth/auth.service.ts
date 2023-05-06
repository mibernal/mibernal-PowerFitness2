import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  async signUpWithEmailAndPassword(email: string, password: string): Promise<void> {
    await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<void> {
    await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    await this.afAuth.signInWithPopup(provider);
  }

  async signInWithFacebook(): Promise<void> {
    const provider = new firebase.auth.FacebookAuthProvider();
    await this.afAuth.signInWithPopup(provider);
  }

  async signOut(): Promise<void> {
    await this.afAuth.signOut();
  }
}
