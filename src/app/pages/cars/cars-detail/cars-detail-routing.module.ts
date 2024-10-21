import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarsDetailPage } from './cars-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CarsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarsDetailPageRoutingModule {}
