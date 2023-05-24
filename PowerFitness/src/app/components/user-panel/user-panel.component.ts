import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

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
        displayName: this.profileForm.get('displayName')?.value,
        phoneNumber: this.profileForm.get('phoneNumber')?.value
      };
  
      this.authService.updateUserProfile(updatedProfileData)
        .then(() => {
          this.showSuccessMessage('Perfil actualizado exitosamente');
          this.profileForm.reset();
        })
        .catch(error => {
          this.showErrorMessage('Error al actualizar el perfil');
          console.error('Error updating profile:', error);
        });
    } else {
      this.showErrorMessage('Por favor, completa todos los campos requeridos');
    }
  }
  showErrorMessage(arg0: string) {
    throw new Error('Method not implemented.');
  }
  showSuccessMessage(arg0: string) {
    throw new Error('Method not implemented.');
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const currentPassword = this.passwordForm.get('currentPassword')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;

      this.authService.changePassword(currentPassword, newPassword)
        .then(() => {
          this.showSuccessMessage('Contraseña actualizada exitosamente');
          this.passwordForm.reset();
        })
        .catch(error => {
          this.showErrorMessage('Error al cambiar la contraseña');
          console.error('Error changing password:', error);
        });
    } else {
      this.showErrorMessage('Por favor, completa todos los campos requeridos');
    }
  }
}

