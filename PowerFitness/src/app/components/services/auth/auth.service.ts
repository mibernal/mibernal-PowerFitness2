import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, first } from 'rxjs';
import { User } from '@firebase/auth-types';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user$ = this.afAuth.authState;
  }

  async signUpWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return await this.afAuth.createUserWithEmailAndPassword(email, password);
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
  
  updateUserProfile(updatedProfileData: any): Promise<void> {
    return this.afAuth.authState
      .pipe(first())
      .toPromise()
      .then((user) => {
        const userId = user?.uid;
        if (userId) {
          return this.firestore.collection('users').doc(userId).update(updatedProfileData);
        } else {
          throw new Error('User not authenticated');
        }
      })
      .catch((error) => {
        console.error('Error updating user profile:', error);
        throw error;
      });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const credential = firebase.auth.EmailAuthProvider.credential(user.email || '', currentPassword);
      try {
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword);
      } catch (error) {
        console.error('Error changing password:', error);
        throw error;
      }
    } else {
      throw new Error('User not authenticated');
    }
  }  
}