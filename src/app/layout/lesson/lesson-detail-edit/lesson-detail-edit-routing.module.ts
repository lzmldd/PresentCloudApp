import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonDetailEditPage } from './lesson-detail-edit.page';

const routes: Routes = [
  {
    path: '',
    component: LessonDetailEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonDetailEditPageRoutingModule {}
