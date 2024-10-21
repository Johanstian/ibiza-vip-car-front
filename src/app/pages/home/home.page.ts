import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IdentityService } from 'src/app/core/services/identity.service';
import { CarsDetailPage } from '../cars/cars-detail/cars-detail.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  @Output() commentSent = new EventEmitter<void>();
  id = this.identityService.getUser().id;
  user: any;
  cosas!: [
    {name: 'A', event: 'B'}
  ]

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

  constructor(
    private identityService: IdentityService,
    private modalController: ModalController
  ) {

  }

  ngOnInit() {
    // this.user = this.identityService.getUser();
    this.identityService.name.subscribe((value) => {
      if (value) {
        this.getUser();
      }
    })
    this.getUser()
  }

  getUser() {
    this.identityService.getUserById(this.id).subscribe({
      next: (data) => {
        console.log('qué es esta data', data)
        this.user = data.user;
        console.log('user home', this.user)
      }
    })
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
