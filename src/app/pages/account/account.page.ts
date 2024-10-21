import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private router: Router
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
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            this.router.navigate(['/security/sign-in'])
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
