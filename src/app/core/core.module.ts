import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPageModule } from '../components/header/header.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HeaderPageModule
  ],
  exports: [
    HeaderPageModule
  ]
})
export class CoreModule { }
