import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LessonTabsPageRoutingModule } from './lesson-tabs-routing.module';

import { LessonTabsPage } from './lesson-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonTabsPageRoutingModule
  ],
  declarations: [LessonTabsPage]
})
export class LessonTabsPageModule {}
