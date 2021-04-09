import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSuccessPageRoutingModule } from './create-success-routing.module';

import { CreateSuccessPage } from './create-success.page';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxQRCodeModule,
    CreateSuccessPageRoutingModule
  ],
  declarations: [CreateSuccessPage]
})
export class CreateSuccessPageModule {}
