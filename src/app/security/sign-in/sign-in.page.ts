import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { IdentityService } from 'src/app/core/services/identity.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  loading: boolean = false;
  signInForm!: FormGroup;
  user: any;


  driverId = 'driver123';
  private watchId: any | null = null;
  private trackingInterval: any;

  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
    private router: Router,
    private webSocketService: WebsocketService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signInForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    })
  }

  login() {
    this.loading = true;
    this.identityService.signIn(this.signInForm.value).subscribe({
      next: (data) => {
        console.log(data)
        this.user = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.webSocketService.connect();
        // this.getLocation();
        this.router.navigate(['/pages/home']);
        this.loading = false;
        this.alertService.success('¡Bienvenido!', 'To the Ibiza Vip Car luxury experience');
      },
      error: (error) => {
        console.log('error', error.error.message);
        this.alertService.error('¡Error!', 'Usuario y/o contraseña inválidos.')
        this.loading = false;
      }
    })
  }

  async getLocation() {
    try {
      const position = await this.webSocketService.getCurrentPosition();
      console.log('Current position:', position);

      // this.webSocketService.setCoordinates(position.lat, position.lng); //para guardar en localstorage

      // if (!this.webSocketService.isConnected) {
      //   console.log('Esperando a que el socket esté conectado...');
      // }

      if (!this.webSocketService.isConnected) {
        console.log('Esperando a que el socket esté conectado...');
        await new Promise((resolve) => {
          const checkSocketInterval = setInterval(() => {
            if (this.webSocketService.isConnected) {
              clearInterval(checkSocketInterval);
              resolve(true);
            }
          }, 1000); // Verificar cada segundo
        });
      }
  

      this.webSocketService.sendLocationUpdate(this.driverId, position.lat, position.lng);
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }


}
