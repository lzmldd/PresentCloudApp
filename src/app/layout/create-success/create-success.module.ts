import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSuccessPageRoutingModule } from './create-success-routing.module';

import { CreateSuccessPage } from './create-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateSuccessPageRoutingModule
  ],
  declarations: [CreateSuccessPage]
})
export class CreateSuccessPageModule {}
