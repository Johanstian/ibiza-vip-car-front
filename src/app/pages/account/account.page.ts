import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  private watchId: any | null = null;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private websocketService: WebsocketService
  ) {

  }

  ngOnInit() {

  }

  async logout() {
    const alert = await this.alertController.create({
      header: '¿Seguro que quieres salir?',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
        },
        {
          text: 'Si',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.websocketService.stopTracking();
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            this.router.navigate(['/security/sign-in']);
            this.websocketService.disconnect();
            // localStorage.removeItem('coordinates'); // Elimina las coordenadas si no se necesitan más
            // this.closeMenu();
          }
        }
      ]
    });
    return await alert.present();
  }

  closeMenu() {
    // this.menuController.close();
  }

}
