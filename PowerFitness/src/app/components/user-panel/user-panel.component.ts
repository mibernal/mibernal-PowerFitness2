import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Add more profile fields as needed
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const updatedProfileData = {
        displayName: this.profileForm.get('name')?.value,
        email: this.profileForm.get('email')?.value
        // Add more profile fields as needed
      };
  
      this.authService.updateUserProfile(updatedProfileData)
        .then(() => {
          this.showSuccessMessage('Profile updated successfully');
          this.profileForm.reset();
        })
        .catch(error => {
          this.showErrorMessage('Error updating profile');
          console.error('Error updating profile:', error);
        });
    } else {
      this.showErrorMessage('Please fill in all required fields');
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const currentPassword = this.passwordForm.get('currentPassword')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;

      this.authService.changePassword(currentPassword, newPassword)
        .then(() => {
          this.showSuccessMessage('Password changed successfully');
          this.passwordForm.reset();
        })
        .catch(error => {
          this.showErrorMessage('Error changing password');
          console.error('Error changing password:', error);
        });
    } else {
      this.showErrorMessage('Please fill in all required fields');
    }
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
