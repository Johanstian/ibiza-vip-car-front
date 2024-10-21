import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { IdentityService } from 'src/app/core/services/identity.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;
  id = this.identityService.getUser().id;
  userForm!: FormGroup;
  token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2NzE0MGUzZjIzYzMyNTVjN2UyODc2NTAiLCJpYXQiOjE3Mjk0MzY4NjQsImV4cCI6MTcyOTYwOTY2NH0.80dBs_9FhaEPuhJsbI4vOw4BszHMSEAenxYnky--sZc'

  constructor(
    private alertService: AlertService,
    private identityService: IdentityService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

  }

  ngOnInit() {
    // Inicializar el formulario de inmediato, aunque sea vacío
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.getUser(); // Luego obtener los datos del usuario
  }

  getUser() {
    this.identityService.getUserById(this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.user = data.user;
        this.patchFormValues(); // Actualizar valores del formulario
      }
    });
  }

  patchFormValues() {
    if (this.user) {
      this.userForm.patchValue({
        name: this.user.name,
        lastName: this.user.lastName,
        email: this.user.email,
      });
    }
  }

  updateUser() {
    // this.loading = false;
    const updatedUser = {
      name: this.userForm.value.name,
      lastName: this.userForm.value.lastName,
      email: this.userForm.value.email
    };

    console.log('userdi', this.id)

    this.identityService.updateUser(this.id, updatedUser).subscribe({
      next: (data) => {
        console.log('Usuario actualizado', data);
        this.alertService.success('¡Actualización exitosa!', 'Tu perfil ha sido actualizado correctamente.');
        // this.loading = false;
        this.router.navigate(['/pages/account']);
        this.identityService.name.emit(true)
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error.error.message);
        this.alertService.error('¡Error!', 'No se pudo actualizar el usuario. Por favor, inténtalo de nuevo.');
        // this.loading = false;
      }
    });
  }



}