import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinByQrcodePageRoutingModule } from './join-by-qrcode-routing.module';

import { JoinByQrcodePage } from './join-by-qrcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinByQrcodePageRoutingModule
  ],
  declarations: [JoinByQrcodePage]
})
export class JoinByQrcodePageModule {}
