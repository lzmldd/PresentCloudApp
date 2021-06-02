import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentCheckinResultPageRoutingModule } from './student-checkin-result-routing.module';

import { StudentCheckinResultPage } from './student-checkin-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentCheckinResultPageRoutingModule
  ],
  declarations: [StudentCheckinResultPage]
})
export class StudentCheckinResultPageModule {}
