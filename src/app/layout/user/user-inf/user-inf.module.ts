import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserInfPageRoutingModule } from './user-inf-routing.module';

import { UserInfPage } from './user-inf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserInfPageRoutingModule
  ],
  declarations: [UserInfPage]
})
export class UserInfPageModule {}
