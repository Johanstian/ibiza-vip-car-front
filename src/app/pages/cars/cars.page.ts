import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CarsDetailPage } from './cars-detail/cars-detail.page';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.page.html',
  styleUrls: ['./cars.page.scss'],
})
export class CarsPage implements OnInit {


  cars: any[] = [
    {
      id: 1,
      name: 'Mercedes Benz',
      model: 'V-Class 130',
      space: 13,
      price: 130
    },
    {
      id: 2,
      name: 'Mercedes Benz',
      model: 'V-Class 150',
      space: 15,
      price: 150
    },
    {
      id: 3,
      name: 'BMW',
      model: 'S-Sport 880',
      space: 17,
      price: 170
    }
  ]

  constructor
  (private modalController: ModalController) { }

  ngOnInit() {
  }

  async details(car: any) {
    const modal = await this.modalController.create({
      component: CarsDetailPage,
      componentProps: {
        carData: car,
      },
    });
    await modal.present();
  }

}
