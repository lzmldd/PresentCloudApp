import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmJoinPageRoutingModule } from './confirm-join-routing.module';

import { ConfirmJoinPage } from './confirm-join.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmJoinPageRoutingModule
  ],
  declarations: [ConfirmJoinPage]
})
export class ConfirmJoinPageModule {}
