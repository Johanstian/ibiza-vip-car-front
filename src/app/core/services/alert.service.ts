import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private toastController: ToastController
  ) { }

  async success(title: string, message: any) {
    const toast = await this.toastController.create({
      header: title,
      message: message,
      duration: 3000,
      cssClass: 'alertSuccess',
      position: 'top',
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
        }
      ]
    });
    return await toast.present();
  }

  async error(title: string, message: any) {
    const toast = await this.toastController.create({
      header: title,
      message: message,
      duration: 3000,
      color: 'danger',
      position: 'top',
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
        }
      ]
    });
    return await toast.present();
  }

}