import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonDetailEditPageRoutingModule } from './lesson-detail-edit-routing.module';

import { LessonDetailEditPage } from './lesson-detail-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonDetailEditPageRoutingModule
  ],
  declarations: [LessonDetailEditPage]
})
export class LessonDetailEditPageModule {}
