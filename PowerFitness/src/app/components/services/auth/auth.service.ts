import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from, throwError } from 'rxjs';
import { User, UserCredential } from '@firebase/auth-types';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { switchMap, take, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user$ = this.afAuth.authState;
  }

  signUpWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      catchError((error) => {
        console.error('Error signing up:', error);
        return throwError(error);
      })
    );
  }  

  signInWithGoogle(): Observable<UserCredential> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      catchError((error) => {
        console.error('Error signing in with Google:', error);
        return throwError(error);
      })
    );
  }  

  signInWithFacebook(): Observable<UserCredential> {
    const provider = new firebase.auth.FacebookAuthProvider();
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      catchError((error) => {
        console.error('Error signing in with Facebook:', error);
        return throwError(error);
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.afAuth.signOut()).pipe(
      catchError((error) => {
        console.error('Error signing out:', error);
        return throwError(error);
      })
    );
  }
  
  updateUserProfile(updatedProfileData: any): Observable<void> {
    return this.getCurrentUser().pipe(
      switchMap((user) => {
        if (user) {
          const userId = user.uid;
          return from(this.firestore.collection('users').doc(userId).update(updatedProfileData)).pipe(
            catchError((error) => {
              console.error('Error updating user profile:', error);
              return throwError(error);
            })
          );
        } else {
          return throwError(new Error('User not authenticated'));
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.getCurrentUser().pipe(
      switchMap((user) => {
        if (user) {
          const credential = firebase.auth.EmailAuthProvider.credential(user.email || '', currentPassword);
          return from(user.reauthenticateWithCredential(credential)).pipe(
            switchMap(() => from(user.updatePassword(newPassword))),
            catchError((error) => {
              console.error('Error changing password:', error);
              return throwError(error);
            })
          );
        } else {
          return throwError(new Error('User not authenticated'));
        }
      })
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.afAuth.authState.pipe(take(1));
  }
  
  unsubscribeAuthState(): void {
    // Implement the logic for unsubscribing authState here
  }
  
}
