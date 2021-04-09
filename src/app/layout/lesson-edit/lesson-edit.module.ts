import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonEditPageRoutingModule } from './lesson-edit-routing.module';

import { LessonEditPage } from './lesson-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonEditPageRoutingModule
  ],
  declarations: [LessonEditPage]
})
export class LessonEditPageModule {}
