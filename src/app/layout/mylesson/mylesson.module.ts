import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MylessonPageRoutingModule } from './mylesson-routing.module';

import { MylessonPage } from './mylesson.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MylessonPageRoutingModule
  ],
  declarations: [MylessonPage]
})
export class MylessonPageModule {}
