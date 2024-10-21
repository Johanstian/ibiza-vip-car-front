import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-cars-detail',
  templateUrl: './cars-detail.page.html',
  styleUrls: ['./cars-detail.page.scss'],
})
export class CarsDetailPage implements OnInit {

  carData: any;
  selectedCar: any;

  constructor (
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private navParams: NavParams,
     ) {  }

  ngOnInit() {
    this.carData = this.navParams.get('carData');
    console.log('the car', this.carData)
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
