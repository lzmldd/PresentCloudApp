import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonSchoolPageRoutingModule } from './lesson-school-routing.module';

import { LessonSchoolPage } from './lesson-school.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonSchoolPageRoutingModule
  ],
  declarations: [LessonSchoolPage]
})
export class LessonSchoolPageModule {}
