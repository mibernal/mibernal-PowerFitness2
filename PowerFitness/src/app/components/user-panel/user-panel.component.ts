import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import firebase from 'firebase/compat/app';
import { User } from '@firebase/auth-types';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  selectedModule: string;
  currentUser: User | null;
  currentUserSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.selectedModule = 'profile';

    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Add more profile fields as needed
    });

    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validator: this.passwordMatchValidator }
    );

    this.currentUserSubscription = this.authService.getCurrentUser().subscribe((value: User | null) => {
      if (value) {
        this.currentUser = value;
        this.profileForm.patchValue({
          name: value.displayName || '',
          email: value.email || ''
        });
      }
    });
  }

  passwordMatchValidator(formGroup: FormGroup): void {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  selectModule(module: string): void {
    this.selectedModule = module;
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const { name, email } = this.profileForm.value;
      this.authService.updateUserProfile(name, email)
        .subscribe(
          () => {
            this.showSuccessMessage('Profile updated successfully');
          },
          (error: any) => {
            this.showErrorMessage('Failed to update profile');
            console.error(error);
          }
        );
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.authService.changeUserPassword(currentPassword, newPassword)
        .subscribe(
          () => {
            this.showSuccessMessage('Password changed successfully');
          },
          (error: any) => {
            this.showErrorMessage('Failed to change password');
            console.error(error);
          }
        );
    }
  }

  logout(): void {
    this.authService.signOut()
      .then(() => {
        // Handle successful logout
      })
      .catch((error: any) => {
        console.error('Logout error:', error);
      });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
