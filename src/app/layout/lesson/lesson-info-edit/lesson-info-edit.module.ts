import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonInfoEditPageRoutingModule } from './lesson-info-edit-routing.module';

import { LessonInfoEditPage } from './lesson-info-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonInfoEditPageRoutingModule
  ],
  declarations: [LessonInfoEditPage]
})
export class LessonInfoEditPageModule {}
