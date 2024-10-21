import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarsDetailPageRoutingModule } from './cars-detail-routing.module';

import { CarsDetailPage } from './cars-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarsDetailPageRoutingModule
  ],
  declarations: [CarsDetailPage]
})
export class CarsDetailPageModule {}
