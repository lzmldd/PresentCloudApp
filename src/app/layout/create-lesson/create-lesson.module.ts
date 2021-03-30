import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateLessonPageRoutingModule } from './create-lesson-routing.module';

import { CreateLessonPage } from './create-lesson.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateLessonPageRoutingModule
  ],
  declarations: [CreateLessonPage]
})
export class CreateLessonPageModule {}
