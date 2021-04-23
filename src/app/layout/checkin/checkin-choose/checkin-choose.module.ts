import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckinChoosePageRoutingModule } from './checkin-choose-routing.module';

import { CheckinChoosePage } from './checkin-choose.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CheckinChoosePageRoutingModule
  ],
  declarations: [CheckinChoosePage]
})
export class CheckinChoosePageModule {}
